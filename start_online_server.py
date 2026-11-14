# ========================================================
# 부산ON 월드 (BUSAN ON WORLD) 원클릭 글로벌 인터넷 멀티플레이 서버 런처
# 로컬 WebSocket/HTTP 서버(8080) + Cloudflare 공인 인터넷 터널
# + 독립 GUI 데스크톱 전용 창(Edge Chromium WebView2) 원클릭 구동
# ========================================================

import os
import sys
import subprocess
import time
import re
import socket
import atexit
import threading
import json
import urllib.request

import server

GIST_ID = "8bd7ddc5c6df9538c8092e1f01c9b2fa"
GITHUB_SITE_URL = "https://kicharisma2.github.io/busan-on/"

def get_github_token():
    tok = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if tok:
        return tok.strip()
    try:
        p = subprocess.Popen(["gh", "auth", "token"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        out, _ = p.communicate(timeout=3)
        if p.returncode == 0 and out.strip():
            return out.strip()
    except Exception:
        pass
    return None

def check_single_instance(port=8080):
    """이미 8080 포트를 점유 중인 서버가 있는지 확인 (중복 호스트 방지)"""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.bind(('127.0.0.1', port))
        s.close()
        return True
    except OSError:
        return False

def update_cloud_registry(status="online", url=""):
    """
    GitHub Gist에 현재 실행 중인 부산ON 호스트의 공인 터널 주소를 실시간 자동 갱신
    """
    payload = json.dumps({
        "status": status,
        "url": url,
        "host": url,
        "updated": int(time.time())
    })

    # 1. 로컬 host.json 파일 보관
    try:
        base_dir = get_base_dir()
        with open(os.path.join(base_dir, "host.json"), "w", encoding="utf-8") as f:
            f.write(payload)
    except Exception:
        pass

    # 2. GitHub REST API 직접 호출
    token = get_github_token()
    if token:
        try:
            api_url = f"https://api.github.com/gists/{GIST_ID}"
            req_data = json.dumps({"files": {"host.json": {"content": payload}}}).encode("utf-8")
            req = urllib.request.Request(
                api_url,
                data=req_data,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/vnd.github.v3+json",
                    "User-Agent": "Busan-ON"
                },
                method="PATCH"
            )
            with urllib.request.urlopen(req, timeout=5) as res:
                if res.status in (200, 201):
                    return True
        except Exception:
            pass

    return False

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def get_base_dir():
    candidates = []
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        candidates.append(getattr(sys, '_MEIPASS'))
    if getattr(sys, 'frozen', False):
        exe_dir = os.path.dirname(os.path.abspath(sys.executable))
        candidates.append(exe_dir)
        candidates.append(os.path.dirname(exe_dir))
    candidates.append(os.path.dirname(os.path.abspath(__file__)))
    candidates.append(os.getcwd())

    for c in candidates:
        if c and os.path.exists(os.path.join(c, 'index.html')):
            return os.path.abspath(c)
    return os.getcwd()

def find_cloudflared():
    """모든 잠재적 위치에서 cloudflared.exe를 탐색"""
    candidates = []
    base_dir = get_base_dir()
    candidates.append(os.path.join(base_dir, "cloudflared.exe"))
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        candidates.append(os.path.join(getattr(sys, '_MEIPASS'), "cloudflared.exe"))
    if getattr(sys, 'frozen', False):
        exe_dir = os.path.dirname(os.path.abspath(sys.executable))
        candidates.append(os.path.join(exe_dir, "cloudflared.exe"))
        candidates.append(os.path.join(os.path.dirname(exe_dir), "cloudflared.exe"))
    candidates.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "cloudflared.exe"))
    candidates.append(r"C:\Users\Mini PC\Desktop\프로그램\부산광역시청\cloudflared.exe")

    for c in candidates:
        if os.path.exists(c) and os.path.isfile(c):
            return os.path.abspath(c)

    try:
        p = subprocess.Popen(["where", "cloudflared.exe"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        out, _ = p.communicate(timeout=2)
        if p.returncode == 0 and out.strip():
            return out.strip().splitlines()[0]
    except Exception:
        pass

    return None

def launch_host_desktop_window(target_url):
    """호스트 전용 데스크톱 창 (Microsoft Edge App 모드)"""
    try:
        edge_paths = [
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
        ]
        edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)
        if edge_exe:
            subprocess.Popen([
                edge_exe,
                f"--app={target_url}",
                "--window-size=1280,820"
            ])
            return True
    except Exception:
        pass

    try:
        import webbrowser
        webbrowser.open(target_url)
        return True
    except Exception:
        return False

def main():
    base_dir = get_base_dir()
    os.chdir(base_dir)

    print("=" * 70, flush=True)
    print(" 🌊 [부산ON 월드 v2.0] 부산광역시청 & 16개 구·군청 시민소통 메타버스 글로벌 호스트 가동 🌊", flush=True)
    print("=" * 70, flush=True)

    if not check_single_instance(8080):
        print(" [!] 부산ON 서버가 이미 실행 중입니다!", flush=True)
        print("     브라우저 또는 데스크톱 창으로 접속하세요: http://localhost:8080/index.html", flush=True)
        print("=" * 70, flush=True)
        launch_host_desktop_window("http://localhost:8080/index.html")
        return

    print(" [1/3] 로컬 부산시청 통합 서버(포트 8080) 시작 중...", flush=True)
    server_thread = server.start_server_in_background(8080)
    time.sleep(1.0)

    # Cloudflare 터널 실행
    print(" [2/3] 인터넷 공인 터널(Cloudflare) 연결 확인 중...", flush=True)
    cf_path = find_cloudflared()
    public_url = None

    if cf_path:
        print(f" [*] 터널 엔진 확인됨: {cf_path}", flush=True)
        try:
            tunnel_proc = subprocess.Popen(
                [cf_path, "tunnel", "--url", "http://localhost:8080"],
                stderr=subprocess.PIPE,
                stdout=subprocess.PIPE
            )
            start_wait = time.time()
            while time.time() - start_wait < 12:
                line = tunnel_proc.stderr.readline().decode('utf-8', errors='ignore')
                if not line and tunnel_proc.poll() is not None:
                    break
                m = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
                if m:
                    public_url = m.group(0)
                    break
        except Exception as e:
            print(f" [!] 터널 구동 중 예외: {e}", flush=True)

    stop_heartbeat = threading.Event()
    if public_url:
        print(" [3/3] 공인 인터넷 접속 주소가 발급되었습니다!", flush=True)
        update_cloud_registry("online", public_url)

        def heartbeat_worker():
            while not stop_heartbeat.wait(15):
                try:
                    update_cloud_registry("online", public_url)
                except Exception:
                    pass
        threading.Thread(target=heartbeat_worker, daemon=True).start()

        local_ip = get_local_ip()
        local_url = f"http://{local_ip}:8080/index.html"

        url_file_path = os.path.join(base_dir, "ONLINE_URL.txt")
        try:
            with open(url_file_path, "w", encoding="utf-8") as f:
                f.write(f"=== 부산ON 월드 실시간 인터넷 접속 주소 ===\n\n[글로벌 공인 인터넷 주소]\n{public_url}/index.html\n\n[내부 LAN 주소]\n{local_url}\n")
        except Exception:
            pass

        print("=" * 70, flush=True)
        print("  🎉 부산ON 월드 글로벌 인터넷 라이브 서버가 완벽 가동되었습니다! 🎉", flush=True)
        print("=" * 70, flush=True)
        print(f"  🌐 전 세계 어디서나 접속 가능한 공인 주소:\n     👉 {public_url}/index.html\n", flush=True)
        print(f"  💻 로컬 및 내부망 접속 주소:\n     👉 http://localhost:8080/index.html\n", flush=True)
        print("=" * 70, flush=True)
        print("  * 이 창을 닫으면 서버가 종료됩니다. 실행을 유지해 주세요.", flush=True)
        print("=" * 70, flush=True)

        launch_host_desktop_window("http://localhost:8080/index.html")
    else:
        print(" [!] 로컬 단독 모드로 서버가 정상 구동되었습니다.", flush=True)
        print("     👉 http://localhost:8080/index.html", flush=True)
        launch_host_desktop_window("http://localhost:8080/index.html")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[*] 부산ON 월드 서버를 안전하게 종료합니다.", flush=True)
    finally:
        stop_heartbeat.set()
        update_cloud_registry("offline", "")
        server.stop_server()

if __name__ == '__main__':
    main()
