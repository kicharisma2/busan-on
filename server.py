# ========================================================
# 부산ON 월드 v2.0 (BUSAN ON WORLD v2.0) - 통합 시민소통 메타버스 서버 (단일 포트 8080)
# HTTP 정적 파일 서빙 + REST API + RFC 6455 WebSocket 멀티플레이 통합
# (부산시청 본청 + 16개 자치 구·군청 독립 월드, 구청 종합민원실, 구립도서관, 지역 맛집·카페 안내)
# ========================================================

import os
import sys
import json
import base64
import hashlib
import struct
import threading
import time
import socket
import math
import urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

import busan_data

def safe_float(val, default=0.0):
    if val is None:
        return default
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return default
        return f
    except (ValueError, TypeError):
        return default

def safe_int(val, default=1):
    if val is None:
        return default
    try:
        return int(val)
    except (ValueError, TypeError):
        return default


PORT = 8080

# 16개 구·군 + 부산시청 본관 야외광장 + 2층 종합행복민원실 룸 채널 등록
ROOM_LIST = ['BUSAN-HQ', 'BUSAN-CIVIL'] + [d['code'] for d in busan_data.BUSAN_DISTRICTS]
ROOMS = {r: {} for r in ROOM_LIST}

ROOM_STATE = {
    r: {
        'voice_count': 0,         # 시민 발언 횟수
        'stamp_total': 5,         # 스탬프 수
        'active_event': '시민 소통의 시간'
    } for r in ROOM_LIST
}

ROOM_CHAT_HISTORY = {r: [] for r in ROOM_LIST}

# 시민 자유 담벼락 영구 저장 파일
WALL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'citizen_wall_posts.json')
WALL_LOCK = threading.RLock()

def load_wall_posts():
    with WALL_LOCK:
        if os.path.exists(WALL_FILE):
            try:
                with open(WALL_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception:
                pass
        # 파일이 없으면 기본 데이터 저장
        try:
            with open(WALL_FILE, 'w', encoding='utf-8') as f:
                json.dump(busan_data.DEFAULT_WALL_POSTS, f, ensure_ascii=False, indent=2)
        except Exception:
            pass
        return list(busan_data.DEFAULT_WALL_POSTS)

def save_wall_posts(posts):
    with WALL_LOCK:
        try:
            with open(WALL_FILE, 'w', encoding='utf-8') as f:
                json.dump(posts, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[WALL_SAVE_ERROR] {e}", flush=True)

WALL_POSTS = load_wall_posts()

CLIENT_MAP = {}    # { sock: client_id }
CLIENT_META = {}   # { client_id: {'room': r, 'info': info, 'sock': sock, 'send_lock': Lock()} }
CLIENT_LOCK = threading.RLock()

WS_MAGIC = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

def make_ws_handshake(key):
    resp_key = base64.b64encode(hashlib.sha1((key + WS_MAGIC).encode('utf-8')).digest()).decode('utf-8')
    handshake = (
        "HTTP/1.1 101 Switching Protocols\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        f"Sec-WebSocket-Accept: {resp_key}\r\n\r\n"
    )
    return handshake.encode('utf-8')

def encode_ws_frame(data_str, opcode=0x1):
    payload = data_str.encode('utf-8') if isinstance(data_str, str) else data_str
    length = len(payload)
    frame = bytearray([0x80 | (opcode & 0x0f)])
    if length <= 125:
        frame.append(length)
    elif length <= 65535:
        frame.append(126)
        frame.extend(struct.pack("!H", length))
    else:
        frame.append(127)
        frame.extend(struct.pack("!Q", length))
    frame.extend(payload)
    return bytes(frame)

def safe_send_frame(sock, frame_bytes, send_lock=None):
    try:
        if send_lock:
            with send_lock:
                sock.sendall(frame_bytes)
        else:
            sock.sendall(frame_bytes)
        return True
    except Exception:
        return False

def recv_exact_stream(rfile, num_bytes):
    try:
        data = rfile.read(num_bytes)
        if not data or len(data) < num_bytes:
            return None
        return data
    except (socket.timeout, TimeoutError):
        raise
    except Exception:
        return None

def decode_ws_frame_from_stream(rfile, sock, send_lock):
    try:
        header = recv_exact_stream(rfile, 2)
        if not header:
            return None, None
        b1, b2 = header[0], header[1]
        opcode = b1 & 0x0f

        if opcode == 0x8:
            return 'close', None

        masked = (b2 & 0x80) != 0
        payload_len = b2 & 0x7f

        if payload_len == 126:
            ext = recv_exact_stream(rfile, 2)
            if not ext: return None, None
            payload_len = struct.unpack("!H", ext)[0]
        elif payload_len == 127:
            ext = recv_exact_stream(rfile, 8)
            if not ext: return None, None
            payload_len = struct.unpack("!Q", ext)[0]

        mask = recv_exact_stream(rfile, 4) if masked else None
        if masked and not mask:
            return None, None

        data = recv_exact_stream(rfile, payload_len)
        if data is None:
            return None, None

        if masked and mask:
            data = bytearray(data)
            for i in range(len(data)):
                data[i] ^= mask[i % 4]

        # 0x9: Ping -> 즉각 Pong(0xA) 응답
        if opcode == 0x9:
            pong_frame = encode_ws_frame(data, opcode=0xA)
            safe_send_frame(sock, pong_frame, send_lock)
            return 'ping', None

        if opcode == 0xA:
            return 'pong', None

        return 'text', data.decode('utf-8', errors='ignore')
    except (socket.timeout, TimeoutError):
        return 'timeout', None
    except Exception:
        return None, None

def broadcast_room(room_id, msg_obj, exclude_sock=None):
    if room_id not in ROOMS:
        ROOMS[room_id] = {}
        ROOM_CHAT_HISTORY[room_id] = []
        ROOM_STATE[room_id] = {'voice_count': 0, 'stamp_total': 5, 'active_event': '시민 소통의 시간'}
    frame = encode_ws_frame(json.dumps(msg_obj))
    dead_socks = []
    with CLIENT_LOCK:
        for cid, info in list(ROOMS[room_id].items()):
            sock = info['ws']
            if sock == exclude_sock:
                continue
            slock = info.get('send_lock')
            if not safe_send_frame(sock, frame, slock):
                dead_socks.append(sock)

    for sock in dead_socks:
        cleanup_client(sock, reason='broadcast_failed')

def cleanup_client(sock, reason='normal_close'):
    old_room = None
    cid = None
    actual_count = 0
    with CLIENT_LOCK:
        if sock not in CLIENT_MAP:
            try:
                sock.close()
            except Exception:
                pass
            return
        cid = CLIENT_MAP.pop(sock, None)
        meta = CLIENT_META.pop(cid, None)
        if meta and meta.get('room') in ROOMS:
            old_room = meta['room']
            ROOMS[old_room].pop(cid, None)
            actual_count = len(ROOMS[old_room])

    try:
        sock.close()
    except Exception:
        pass

    if old_room and cid:
        print(f"[-] 시민 퇴장 ({reason}): {cid} (현재 {old_room} 시민 수: {actual_count}명)", flush=True)
        broadcast_room(old_room, {
            'type': 'peer_leave',
            'id': cid,
            'count': actual_count
        })

def handle_websocket_loop(handler):
    sock = handler.connection
    rfile = handler.rfile
    send_lock = threading.Lock()

    try:
        sock.settimeout(45.0)
    except Exception:
        pass

    client_id = os.urandom(6).hex()
    current_room = 'BUSAN-HQ'

    while True:
        try:
            status, msg_str = decode_ws_frame_from_stream(rfile, sock, send_lock)
        except (socket.timeout, TimeoutError):
            status = 'timeout'
            msg_str = None

        if status == 'timeout':
            # 45초 무응답 시 WebSocket 핑(Heartbeat) 송신하여 소켓 활성 점검
            try:
                ping_frame = encode_ws_frame(b'', opcode=0x9)
                if not safe_send_frame(sock, ping_frame, send_lock):
                    break
            except Exception:
                break
            continue

        if status in (None, 'close'):
            break
        if status in ('ping', 'pong'):
            continue
        if not msg_str:
            continue

        try:
            msg = json.loads(msg_str)
            mtype = msg.get('type')

            if mtype == 'ping':
                safe_send_frame(sock, encode_ws_frame(json.dumps({'type': 'pong'})), send_lock)
                continue

            if mtype == 'join':
                new_room = msg.get('room', 'BUSAN-HQ')
                if new_room not in ROOMS:
                    ROOMS[new_room] = {}

                old_room = None
                with CLIENT_LOCK:
                    if client_id in CLIENT_META:
                        old_room = CLIENT_META[client_id].get('room')
                        if old_room and old_room in ROOMS and client_id in ROOMS[old_room]:
                            ROOMS[old_room].pop(client_id, None)

                if old_room and old_room in ROOMS and old_room != new_room:
                    print(f"[-] 시민 공간 이동: {client_id} ({old_room} -> {new_room})", flush=True)
                    broadcast_room(old_room, {
                        'type': 'peer_leave',
                        'id': client_id,
                        'count': len(ROOMS[old_room])
                    })

                current_room = new_room
                with CLIENT_LOCK:
                    client_info = {
                        'id': client_id,
                        'name': msg.get('name', '부산시민_' + client_id[:4]),
                        'level': safe_int(msg.get('level'), 1),
                        'title': msg.get('title', '첫 방문 시민'),
                        'robe': msg.get('robe', msg.get('robeColor', 'blue')),
                        'robeColor': msg.get('robeColor', msg.get('robe', 'blue')),
                        'hat': msg.get('hat', msg.get('hatType', 'camellia')),
                        'hatType': msg.get('hatType', msg.get('hat', 'camellia')),
                        'wings': msg.get('wings', msg.get('wingsType', 'none')),
                        'wingsType': msg.get('wingsType', msg.get('wings', 'none')),
                        'hairStyle': msg.get('hairStyle', 'short'),
                        'hairColor': msg.get('hairColor', 'black'),
                        'skinTone': msg.get('skinTone', 'warm'),
                        'belt': msg.get('belt', 'citizen'),
                        'x': safe_float(msg.get('x'), 0.0),
                        'y': safe_float(msg.get('y'), 0.0),
                        'z': safe_float(msg.get('z'), 20.0),
                        'ry': safe_float(msg.get('ry'), 0.0),
                        'jump': bool(msg.get('jump', False)),
                        'act': 'idle'
                    }
                    ROOMS[current_room][client_id] = {'ws': sock, 'info': client_info, 'send_lock': send_lock}
                    CLIENT_MAP[sock] = client_id
                    CLIENT_META[client_id] = {'room': current_room, 'info': client_info, 'sock': sock, 'send_lock': send_lock}

                    actual_count = len(ROOMS[current_room])
                    peer_list = [p['info'] for p in ROOMS[current_room].values() if p['info']['id'] != client_id]

                print(f"[+] 시민 입장: [{client_info['title']}] {client_info['name']} ({client_id}) -> {current_room} (총 {actual_count}명)", flush=True)

                recent_chats = ROOM_CHAT_HISTORY.get(current_room, [])[-40:]

                # 1. 환영 패킷 전송
                safe_send_frame(sock, encode_ws_frame(json.dumps({
                    'type': 'welcome',
                    'id': client_id,
                    'room': current_room,
                    'peers': peer_list,
                    'count': actual_count,
                    'chat_history': recent_chats
                })), send_lock)

                # 2. 룸 내 다른 시민들에게 알림
                broadcast_room(current_room, {
                    'type': 'peer_join',
                    'id': client_id,
                    'peer': client_info,
                    'info': client_info,
                    'count': actual_count
                }, exclude_sock=sock)

            elif mtype == 'move':
                y_val = safe_float(msg.get('y'), 0.0)
                jump_val = bool(msg.get('jump', False))
                with CLIENT_LOCK:
                    if client_id in CLIENT_META:
                        info = CLIENT_META[client_id]['info']
                        info['x'] = safe_float(msg.get('x'), info.get('x', 0.0))
                        info['y'] = y_val
                        info['z'] = safe_float(msg.get('z'), info.get('z', 20.0))
                        info['ry'] = safe_float(msg.get('ry'), info.get('ry', 0.0))
                        info['jump'] = jump_val

                broadcast_room(current_room, {
                    'type': 'peer_move',
                    'id': client_id,
                    'x': safe_float(msg.get('x'), 0.0),
                    'y': y_val,
                    'z': safe_float(msg.get('z'), 20.0),
                    'ry': safe_float(msg.get('ry'), 0.0),
                    'jump': jump_val
                }, exclude_sock=sock)

            elif mtype == 'level_up':
                lvl = safe_int(msg.get('level'), 1)
                ttl = msg.get('title', '시민 탐험가')
                nm = msg.get('name', '부산시민')
                with CLIENT_LOCK:
                    if client_id in CLIENT_META:
                        info = CLIENT_META[client_id]['info']
                        info['level'] = lvl
                        info['title'] = ttl
                        info['name'] = nm

                broadcast_room(current_room, {
                    'type': 'peer_level_up',
                    'id': client_id,
                    'name': nm,
                    'level': lvl,
                    'title': ttl
                })

            elif mtype == 'action':
                act = msg.get('act', 'idle')
                with CLIENT_LOCK:
                    if client_id in CLIENT_META:
                        CLIENT_META[client_id]['info']['act'] = act

                broadcast_room(current_room, {
                    'type': 'peer_action',
                    'id': client_id,
                    'act': act,
                    'text': msg.get('text', '')
                }, exclude_sock=sock)

            elif mtype == 'update_look':
                with CLIENT_LOCK:
                    if client_id in CLIENT_META:
                        info = CLIENT_META[client_id]['info']
                        info['name'] = msg.get('name', info['name'])
                        info['robe'] = msg.get('robe', info['robe'])
                        info['hat'] = msg.get('hat', info['hat'])
                        info['wings'] = msg.get('wings', info['wings'])
                        info['belt'] = msg.get('belt', info['belt'])

                broadcast_room(current_room, {
                    'type': 'peer_update_look',
                    'id': client_id,
                    'name': msg.get('name'),
                    'robe': msg.get('robe'),
                    'hat': msg.get('hat'),
                    'wings': msg.get('wings'),
                    'belt': msg.get('belt')
                }, exclude_sock=sock)

            elif mtype == 'chat':
                chat_entry = {
                    'type': 'peer_chat',
                    'id': client_id,
                    'name': msg.get('name', '시민'),
                    'title': msg.get('title', '시민'),
                    'text': msg.get('text', ''),
                    'scope': msg.get('scope', 'all'), # all, square, wall
                    'time': time.strftime("%H:%M")
                }
                print(f"[시민 채팅] [{current_room}] {chat_entry['name']}: {chat_entry['text']}", flush=True)
                if current_room not in ROOM_CHAT_HISTORY:
                    ROOM_CHAT_HISTORY[current_room] = []
                ROOM_CHAT_HISTORY[current_room].append(chat_entry)
                if len(ROOM_CHAT_HISTORY[current_room]) > 100:
                    ROOM_CHAT_HISTORY[current_room].pop(0)

                broadcast_room(current_room, chat_entry, exclude_sock=sock)

            elif mtype == 'shout_podium':
                # 시민 발언대 외치기 (전체 공지 및 확성기 이펙트)
                shout_text = msg.get('text', '부산을 더 살기 좋은 도시로!')
                author_name = msg.get('name', '열혈시민')
                print(f"[시민 발언대 외침!] {author_name}: {shout_text}", flush=True)
                broadcast_room(current_room, {
                    'type': 'podium_broadcast',
                    'id': client_id,
                    'name': author_name,
                    'text': shout_text,
                    'time': time.strftime("%H:%M:%S")
                })

            elif mtype == 'stamp_collected':
                # 스탬프 투어 수집 브로드캐스트
                stamp_id = msg.get('stamp_id', '')
                stamp_name = msg.get('stamp_name', '')
                author_name = msg.get('name', '시민')
                broadcast_room(current_room, {
                    'type': 'peer_stamp',
                    'id': client_id,
                    'name': author_name,
                    'stamp_id': stamp_id,
                    'stamp_name': stamp_name
                }, exclude_sock=sock)

        except Exception as e:
            print(f"[WS_PACKET_ERROR] {client_id}: {e}", flush=True)
            continue

    cleanup_client(sock, reason='loop_exit')


def get_web_root():
    """웹 리소스(index.html, style.css 등)의 실제 위치를 어떤 실행 환경에서도 안정적으로 탐색"""
    candidates = []
    # 1. PyInstaller _MEIPASS
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        candidates.append(getattr(sys, '_MEIPASS'))
    # 2. 실행 파일 디렉터리 및 상위 디렉터리 (dist/.. 포함)
    if getattr(sys, 'frozen', False):
        exe_dir = os.path.dirname(os.path.abspath(sys.executable))
        candidates.append(exe_dir)
        candidates.append(os.path.dirname(exe_dir))
    # 3. 소스 코드 위치 및 상위 디렉터리
    file_dir = os.path.dirname(os.path.abspath(__file__))
    candidates.append(file_dir)
    candidates.append(os.path.dirname(file_dir))
    # 4. 현재 작업 디렉터리
    candidates.append(os.getcwd())

    for c in candidates:
        if c and os.path.exists(os.path.join(c, 'index.html')):
            return os.path.abspath(c)
    return os.getcwd()

WEB_ROOT = get_web_root()
print(f"[부산ON] 정적 파일 서빙 디렉터리: {WEB_ROOT}", flush=True)


class BusanCivicHTTPHandler(SimpleHTTPRequestHandler):
    extensions_map = SimpleHTTPRequestHandler.extensions_map.copy()
    extensions_map.update({
        '.js': 'application/javascript; charset=utf-8',
        '.mjs': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.html': 'text/html; charset=utf-8',
        '.htm': 'text/html; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
    })

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_ROOT, **kwargs)

    def translate_path(self, path):
        # 1. Query parameter 및 Fragment 제거, URL 디코딩
        clean_path = urllib.parse.unquote(path.split('?', 1)[0].split('#', 1)[0])
        norm_path = clean_path.lstrip('/')
        if not norm_path or norm_path in ('index', 'index.htm', 'index.html'):
            norm_path = 'index.html'

        # 2. 모든 가능한 디렉터리 후보 탐색
        candidates = []
        if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
            candidates.append(getattr(sys, '_MEIPASS'))
        if getattr(sys, 'frozen', False):
            exe_d = os.path.dirname(os.path.abspath(sys.executable))
            candidates.append(exe_d)
            candidates.append(os.path.dirname(exe_d))
        candidates.append(WEB_ROOT)
        candidates.append(os.getcwd())
        candidates.append(os.path.dirname(os.path.abspath(__file__)))
        candidates.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        candidates.append(r"c:\Users\Mini PC\Desktop\프로그램\부산광역시청")
        candidates.append(r"c:\Users\Mini PC\Desktop\프로그램\부산광역시청\dist")

        # 3. 직접 일치 파일 탐색
        for c in candidates:
            if c and os.path.isdir(c):
                cand = os.path.join(c, norm_path)
                if os.path.isfile(cand):
                    return cand

        # 4. SPA 라우팅 및 HTML 탐색 (확장자가 없거나 .html 요청 시 index.html 반환)
        _, ext = os.path.splitext(norm_path)
        if ext in ('', '.html', '.htm'):
            for c in candidates:
                if c and os.path.isdir(c):
                    cand = os.path.join(c, 'index.html')
                    if os.path.isfile(cand):
                        return cand

        # 5. 기본 super().translate_path() 호출
        return super().translate_path(path)

    def send_error(self, code, message=None, explain=None):
        # 404 에러 발생 시 Error page 대신 index.html 로 안전하게 서빙하여 브라우저 404 에러 원천 차단
        if code == 404:
            for c in [
                getattr(sys, '_MEIPASS', None),
                os.path.dirname(os.path.abspath(sys.executable)) if getattr(sys, 'frozen', False) else None,
                WEB_ROOT,
                os.getcwd(),
                os.path.dirname(os.path.abspath(__file__)),
                r"c:\Users\Mini PC\Desktop\프로그램\부산광역시청",
                r"c:\Users\Mini PC\Desktop\프로그램\부산광역시청\dist"
            ]:
                if c and os.path.isdir(c):
                    idx = os.path.join(c, 'index.html')
                    if os.path.isfile(idx):
                        try:
                            with open(idx, 'rb') as f:
                                content = f.read()
                            self.send_response(200)
                            self.send_header('Content-Type', 'text/html; charset=utf-8')
                            self.send_header('Content-Length', str(len(content)))
                            self.send_header('Access-Control-Allow-Origin', '*')
                            self.end_headers()
                            self.wfile.write(content)
                            return
                        except Exception:
                            pass
        super().send_error(code, message, explain)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 루트('/') 접근 시 index.html 로 기본 라우팅
        if path in ('', '/', '/index', '/index.htm'):
            self.path = '/index.html'
            path = '/index.html'

        qs = urllib.parse.parse_qs(parsed.query)

        # 0. 부산시 & 16개 구·군 공식 홈페이지 인기메뉴 API
        if path == '/api/popular-menus':
            cat = qs.get('cat', ['all'])[0]
            q = qs.get('q', [''])[0].strip().lower()
            items = getattr(busan_data, 'BUSAN_POPULAR_HOMEPAGE_SERVICES', [])
            if cat and cat != 'all':
                items = [it for it in items if it.get('category') == cat]
            if q:
                items = [it for it in items if q in it.get('title', '').lower() or q in it.get('summary', '').lower() or q in it.get('agency', '').lower()]
            self.send_json_response(items)
            return

        # 1. 16개 구·군청 메타데이터
        if path == '/api/districts':
            self.send_json_response(busan_data.BUSAN_DISTRICTS)
            return

        # 2. 부산시청 층별 사무실 안내 (from sejong-office-app)
        if path == '/api/office-search':
            floor_kw = qs.get('floor', [''])[0].strip()
            q = qs.get('q', [''])[0].strip().lower()

            results = []
            for fl in busan_data.BUSAN_OFFICE_FLOORS:
                if floor_kw and floor_kw not in fl['floor']:
                    continue
                for off in fl['offices']:
                    if not q or (q in off['name'].lower() or q in off['dept'].lower() or q in off['duties'].lower() or q in off['room'].lower()):
                        results.append({
                            "floor": fl['floor'],
                            "floor_name": fl['name'],
                            **off
                        })
            self.send_json_response(results)
            return

        # 3. 소관부서 & 사무분장 판별 (from division-in-charge)
        if path == '/api/division-search':
            q = qs.get('q', [''])[0].strip().lower()
            results = []
            for item in busan_data.DIVISION_KNOWLEDGE_BASE:
                match = False
                if not q:
                    match = True
                else:
                    for kw in item['keyword']:
                        if kw.lower() in q or q in kw.lower():
                            match = True
                            break
                    if q in item['task_name'].lower() or q in item['dept_city'].lower() or q in item['dept_district'].lower():
                        match = True
                if match:
                    results.append(item)
            self.send_json_response(results)
            return

        # 4. 실제 부산시청 사진 및 구조 갤러리 데이터
        if path == '/api/busan-photos':
            self.send_json_response(busan_data.BUSAN_PHOTO_GALLERY)
            return

        # 5. 시민 자유담벼락 게시물 목록
        if path == '/api/wall':
            category = qs.get('cat', ['전체'])[0]
            with WALL_LOCK:
                posts = list(WALL_POSTS)
            if category and category != '전체':
                posts = [p for p in posts if p.get('category') == category]
            self.send_json_response(posts)
            return

        # 6. 16개 구·군별 상세 데이터 (민원실, 도서관, 맛집)
        if path == '/api/district-details':
            code = qs.get('code', [''])[0].strip()
            details = getattr(busan_data, 'BUSAN_DISTRICT_DETAILS', {})
            if code and code in details:
                self.send_json_response(details[code])
            else:
                self.send_json_response(details)
            return

        # 7. 맛집 & 인기 카페 큐레이션
        if path == '/api/gourmet':
            code = qs.get('district', [''])[0].strip()
            details = getattr(busan_data, 'BUSAN_DISTRICT_DETAILS', {})
            if code and code in details:
                self.send_json_response(details[code].get('gourmet', {}))
            else:
                all_gourmet = {k: v.get('gourmet', {}) for k, v in details.items()}
                self.send_json_response(all_gourmet)
            return

        # 8. 구립 도서관 및 전자도서관 포털
        if path == '/api/libraries':
            code = qs.get('district', [''])[0].strip()
            details = getattr(busan_data, 'BUSAN_DISTRICT_DETAILS', {})
            if code and code in details:
                self.send_json_response(details[code].get('library', {}))
            else:
                all_libs = {k: v.get('library', {}) for k, v in details.items()}
                self.send_json_response(all_libs)
            return

        # 9. 부산광역시 열린 정보공개방 API (연도별 예산서, 시정 프로젝트, 뉴스, 통계, 시민계급)
        if path == '/api/open-data/budgets':
            year = qs.get('year', [''])[0].strip()
            budgets = getattr(busan_data, 'BUSAN_ANNUAL_BUDGETS', [])
            if year:
                matched = [b for b in budgets if b.get('year') == year]
                self.send_json_response(matched[0] if matched else {})
            else:
                self.send_json_response(budgets)
            return

        if path == '/api/open-data/projects':
            self.send_json_response(getattr(busan_data, 'BUSAN_MAJOR_PROJECTS', []))
            return

        if path == '/api/open-data/news':
            self.send_json_response(getattr(busan_data, 'BUSAN_CITY_NEWS', []))
            return

        if path == '/api/open-data/stats':
            self.send_json_response(getattr(busan_data, 'BUSAN_CITY_STATISTICS', {}))
            return

        if path == '/api/open-data/ranks':
            self.send_json_response(getattr(busan_data, 'BUSAN_CIVIC_RANKS', []))
            return

        if path == '/api/open-data/missions':
            self.send_json_response(getattr(busan_data, 'BUSAN_DAILY_MISSIONS', []))
            return

        if path == '/api/open-data/all':
            self.send_json_response({
                'budgets': getattr(busan_data, 'BUSAN_ANNUAL_BUDGETS', []),
                'projects': getattr(busan_data, 'BUSAN_MAJOR_PROJECTS', []),
                'news': getattr(busan_data, 'BUSAN_CITY_NEWS', []),
                'statistics': getattr(busan_data, 'BUSAN_CITY_STATISTICS', {}),
                'civic_ranks': getattr(busan_data, 'BUSAN_CIVIC_RANKS', []),
                'daily_missions': getattr(busan_data, 'BUSAN_DAILY_MISSIONS', [])
            })
            return

        # 10. WebSocket 업그레이드 감지
        upgrade = self.headers.get('Upgrade', '').lower()
        connection = self.headers.get('Connection', '').lower()
        if 'websocket' in upgrade or 'upgrade' in connection:
            ws_key = self.headers.get('Sec-WebSocket-Key')
            if ws_key:
                handshake_bytes = make_ws_handshake(ws_key)
                self.connection.sendall(handshake_bytes)
                handle_websocket_loop(self)
                return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_len = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_len).decode('utf-8', errors='ignore') if content_len > 0 else '{}'

        try:
            payload = json.loads(body)
        except Exception:
            payload = {}

        # 1. AI 행정안내원 (다온 & 부기) 질의응답
        if path == '/api/ai-guide':
            question = payload.get('question', '').strip()
            answer_data = self.generate_ai_guide_response(question)
            self.send_json_response(answer_data)
            return

        # 2. 시민 담벼락 새 글 등록
        if path == '/api/wall':
            title = payload.get('title', '').strip()
            content = payload.get('content', '').strip()
            author = payload.get('author', '익명시민').strip() or '익명시민'
            category = payload.get('category', '불만외치기')
            district = payload.get('district', '연제구')

            if not title or not content:
                self.send_error_response("제목과 내용을 모두 입력해 주세요.", 400)
                return

            new_post = {
                "id": "post-" + os.urandom(4).hex(),
                "author": author,
                "category": category,
                "title": title,
                "content": content,
                "district": district,
                "time": time.strftime("오늘 %H:%M"),
                "likes": 1,
                "comments": []
            }

            with WALL_LOCK:
                WALL_POSTS.insert(0, new_post)
                save_wall_posts(WALL_POSTS)

            # 웹소켓 룸에도 공지 브로드캐스트
            broadcast_room('BUSAN-HQ', {
                'type': 'wall_new_post',
                'post': new_post
            })

            self.send_json_response({"success": True, "post": new_post})
            return

        # 3. 시민 담벼락 공감/좋아요
        if path == '/api/wall/like':
            post_id = payload.get('post_id')
            updated_likes = 0
            with WALL_LOCK:
                for p in WALL_POSTS:
                    if p['id'] == post_id:
                        p['likes'] = p.get('likes', 0) + 1
                        updated_likes = p['likes']
                        break
                save_wall_posts(WALL_POSTS)
            self.send_json_response({"success": True, "likes": updated_likes})
            return

        # 4. 시민 담벼락 댓글 등록
        if path == '/api/wall/comment':
            post_id = payload.get('post_id')
            comment_text = payload.get('text', '').strip()
            comment_author = payload.get('author', '시민').strip()

            if not post_id or not comment_text:
                self.send_error_response("댓글 내용을 입력해 주세요.", 400)
                return

            new_comment = {
                "author": comment_author,
                "text": comment_text,
                "time": time.strftime("%H:%M")
            }

            with WALL_LOCK:
                for p in WALL_POSTS:
                    if p['id'] == post_id:
                        if 'comments' not in p:
                            p['comments'] = []
                        p['comments'].append(new_comment)
                        break
                save_wall_posts(WALL_POSTS)

            self.send_json_response({"success": True, "comment": new_comment})
            return

        self.send_error(404, "Not Found")

    def send_json_response(self, data_obj, code=200):
        body_bytes = json.dumps(data_obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body_bytes)))
        self.end_headers()
        self.wfile.write(body_bytes)

    def send_error_response(self, message, code=400):
        self.send_json_response({"error": message}, code=code)

    def generate_ai_guide_response(self, q):
        """
        다온 & 부기 AI 행정안내원:
        - 시민의 자연어 질의 분석
        - 소관 기관(부산시청 본청 vs 16개 구청 vs 특수기관) 명확 판별
        - 담당 부서, 전화번호, 층수 매칭
        - 법령 및 조례 근거 제시
        - 공식 민원 접수처(부산민원120, 안전신문고, 정부24) 링크 안내
        - 비공식 참고용 고지 배지
        """
        q_lower = q.lower()
        matched_item = None

        # 1. 지식 베이스 키워드 검색
        for item in busan_data.DIVISION_KNOWLEDGE_BASE:
            for kw in item['keyword']:
                if kw in q_lower:
                    matched_item = item
                    break
            if matched_item:
                break

        # 2. 층별 사무실 검색 연계
        matched_office = None
        for fl in busan_data.BUSAN_OFFICE_FLOORS:
            for off in fl['offices']:
                if any(w in off['name'].lower() or w in off['duties'].lower() for w in q_lower.split()):
                    matched_office = {**off, "floor": fl['floor']}
                    break
            if matched_office:
                break

        if matched_item:
            answer_text = (
                f"문의하신 사안은 **[{matched_item['task_name']}]** 관련 업무입니다.\n\n"
                f"📌 **관할 구분:** {matched_item['authority']}\n"
                f"🏢 **부산시청 담당:** {matched_item['dept_city']}\n"
                f"🏛️ **자치구·군 담당:** {matched_item['dept_district']}\n\n"
                f"💡 **처리 안내 및 팁:**\n{matched_item['rule_summary']}\n\n"
                f"📜 **관련 법령/근거:** {matched_item['legal_basis']}\n"
                f"🚀 **신속한 접수 경로:** {matched_item['official_action']}"
            )
            return {
                "success": True,
                "found": True,
                "task_name": matched_item['task_name'],
                "authority": matched_item['authority'],
                "answer": answer_text,
                "dept_city": matched_item['dept_city'],
                "dept_district": matched_item['dept_district'],
                "legal_basis": matched_item['legal_basis'],
                "official_portals": [
                    {"name": "부산민원120 콜센터", "url": "tel:051-120", "desc": "국번없이 120 (평일 08:30~18:30)"},
                    {"name": "안전신문고", "url": "https://www.safetyreport.go.kr", "desc": "도로파손·불법주정차 앱 간편 신고"},
                    {"name": "부산광역시 공식 민원창구", "url": "https://www.busan.go.kr/minwon120", "desc": "통합민원 온라인 신청"},
                    {"name": "정부24", "url": "https://www.gov.kr", "desc": "각종 행정증명서 발급 및 신고"}
                ],
                "badge": "공식 행정자료 기반 안내",
                "disclaimer": "본 답변은 행정 편의를 돕기 위한 비공식 AI 가이드이며, 법적 민원 접수나 처분 효력이 없습니다. 정확한 행정처리는 공식 창구를 통해 주시기 바랍니다."
            }

        elif matched_office:
            answer_text = (
                f"문의하신 내용과 가장 밀접한 부서는 **부산시청 {matched_office['floor']} [{matched_office['dept']} - {matched_office['name']}]**입니다.\n\n"
                f"📞 **직통 연락처:** {matched_office['tel']}\n"
                f"📍 **위치:** 부산시청 본관 {matched_office['floor']} {matched_office['room']}\n"
                f"📋 **소관 업무:** {matched_office['duties']}\n\n"
                f"직접 방문하시기 전에 해당 부서에 전화로 필요 구비서류를 미리 문의하시면 시간을 크게 절약하실 수 있습니다!"
            )
            return {
                "success": True,
                "found": True,
                "task_name": matched_office['name'],
                "authority": "부산광역시 본청",
                "answer": answer_text,
                "dept_city": f"{matched_office['dept']} ({matched_office['tel']})",
                "dept_district": "시 본청 소관 또는 해당 구청 연계",
                "legal_basis": "부산광역시 행정기구 설치 조례",
                "official_portals": [
                    {"name": "부산시 콜센터 120", "url": "tel:051-120", "desc": "051-120 (전화 연결)"},
                    {"name": "부산시청 종합안내", "url": "https://www.busan.go.kr/bhintro04", "desc": "청사 층별 종합안내도"}
                ],
                "badge": "청사 부서 안내 매칭",
                "disclaimer": "부서 개편이나 업무 분장에 따라 변경될 수 있으니 방문 전 120 콜센터 또는 해당 부서 직통번호로 확인해 주세요."
            }

        else:
            answer_text = (
                f"입력하신 질문에 대해 가장 적절한 안내 창구를 종합 검토하였습니다.\n\n"
                f"부산시청 및 16개 구·군의 방대한 행정 사무 중 정확한 소관부서 매칭을 위해,\n"
                f"국번 없이 **☎ 051-120 (부산시 통합민원 120 바로콜센터)**로 전화 주시면 상담원이 즉시 담당 공무원 직통 전화로 연결해 드립니다.\n\n"
                f"또한 아래의 [소관부서 검색기] 탭에서 '포트홀', '불법주차', '여권', '청년지원' 등 단어 단위로 검색해 보실 수 있습니다."
            )
            return {
                "success": True,
                "found": False,
                "task_name": "일반 행정 질의",
                "authority": "부산시 120 바로콜센터 문의 권장",
                "answer": answer_text,
                "dept_city": "부산시청 통합민원과 (051-888-1451)",
                "dept_district": "해당 거주지 구·군청 민원실",
                "legal_basis": "민원 처리에 관한 법률",
                "official_portals": [
                    {"name": "부산민원 120", "url": "tel:051-120", "desc": "국번없이 120"},
                    {"name": "부산시 대표포털", "url": "https://www.busan.go.kr", "desc": "공식 시정소식 및 민원안내"}
                ],
                "badge": "일반 행정 가이드",
                "disclaimer": "비공식 참고용 안내입니다. 법적 공식 민원은 부산민원120 또는 안전신문고를 이용해 주세요."
            }

_GLOBAL_HTTPD = None

def run_server(port=PORT):
    global _GLOBAL_HTTPD
    server_address = ('0.0.0.0', port)
    _GLOBAL_HTTPD = ThreadingHTTPServer(server_address, BusanCivicHTTPHandler)
    print("=" * 65, flush=True)
    print(f" [부산ON 월드 v2.0] 부산광역시청 & 16개 구·군청 시민소통 메타버스 서버 시작!", flush=True)
    print(f" - 서비스 주소: http://localhost:{port}", flush=True)
    print(f" - 지원 공간: 부산시청 본청 + 16개 자치구·군 독립 청사 및 종합민원실", flush=True)
    print(f" - 특화 기능: 구립도서관 연동, 지역별 맛집·인기 카페 안내, 실시간 시민채팅", flush=True)
    print(f" - 통합 엔진: 소관부서 판별 + 층별 사무실 안내 + AI 다온 행정상담소", flush=True)
    print("=" * 65, flush=True)
    try:
        _GLOBAL_HTTPD.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 안전하게 종료합니다.")
        stop_server()

def start_server_in_background(port=PORT):
    global _GLOBAL_HTTPD
    server_address = ('0.0.0.0', port)
    _GLOBAL_HTTPD = ThreadingHTTPServer(server_address, BusanCivicHTTPHandler)
    t = threading.Thread(target=_GLOBAL_HTTPD.serve_forever, daemon=True)
    t.start()
    print(f" [부산ON 월드] 백그라운드 서버 가동 (포트 {port})", flush=True)
    return t

def stop_server():
    global _GLOBAL_HTTPD
    if _GLOBAL_HTTPD:
        try:
            _GLOBAL_HTTPD.shutdown()
            _GLOBAL_HTTPD.server_close()
        except Exception:
            pass
        _GLOBAL_HTTPD = None
        print(" [부산ON 월드] 서버 종료 완료", flush=True)

if __name__ == '__main__':
    run_server()
