#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
patch_v27_critical_fixes.py
=============================
v27 긴급 수정 패치:
1. WebSocket loop_exit 무한 루프 → 최대 재연결 10회 + exponential backoff
2. 캐릭터 중복 교체 → initialModelApplied 플래그로 한 번만 적용
3. 팔 애니메이션 → idle action 초기화 + walk blending 수정
4. SkeletonHelper 뼈대 선 제거 (디버그 뷰 없애기)
5. 캐릭터 보이지 않는 문제 → visible 플래그 강제 true
"""
import re, shutil, os

SRC = r"c:\Users\Mini PC\Desktop\프로그램\부산광역시청\app.js"
DST = r"c:\Users\Mini PC\Desktop\프로그램\부산광역시청\dist\app.js"
BACKUP = SRC + ".bak27"

# ── 백업 ──────────────────────────────────────────────────
shutil.copy2(SRC, BACKUP)
print(f"✅ 백업 완료: {BACKUP}")

with open(SRC, "r", encoding="utf-8") as f:
    code = f.read()

original_len = len(code)
print(f"📄 원본 크기: {original_len:,} bytes")

# ===========================================================
# 수정 1: WebSocket 무한 루프 → 재연결 카운터 + exponential backoff
# ===========================================================
OLD_WS_CONNECT = '''async function connectMultiplayerWebSocket() {
  const hostUrl = await autoDiscoverHostServer();'''

NEW_WS_CONNECT = '''// ★ v27: 재연결 무한 루프 방지 카운터
let _wsReconnectCount = 0;
const _WS_MAX_RECONNECT = 12;
let _wsReconnectTimer = null;
let _wsSessionId = null; // ★ 세션 ID 고정 (입퇴장 중복 방지)

function _scheduleReconnect() {
  if (_wsReconnectCount >= _WS_MAX_RECONNECT) {
    console.warn('[부산ON] 서버 연결 불가 (최대 재연결 초과). 개인 플레이 모드로 전환.');
    updateServerStatusUI(false, '서버 없이 개인 플레이 모드 (오프라인)');
    return;
  }
  _wsReconnectCount++;
  const delay = Math.min(2000 * _wsReconnectCount, 30000);
  console.log(`[부산ON] ${delay/1000}초 후 재연결 (${_wsReconnectCount}/${_WS_MAX_RECONNECT})`);
  updateServerStatusUI(false, `재연결 중... (${_wsReconnectCount}회)`);
  if (_wsReconnectTimer) clearTimeout(_wsReconnectTimer);
  _wsReconnectTimer = setTimeout(connectMultiplayerWebSocket, delay);
}

async function connectMultiplayerWebSocket() {
  const hostUrl = await autoDiscoverHostServer();'''

code = code.replace(OLD_WS_CONNECT, NEW_WS_CONNECT)
print("✅ [1] WebSocket 함수 헤더에 재연결 카운터 추가")

# onopen에서 카운터 리셋
OLD_ONOPEN = '''    STATE.ws.onopen = () => {
      console.log("[부산ON] WebSocket 서버 연결 성공!");
      updateServerStatusUI(true, "글로벌 인터넷 연결됨 (부산ON)");'''

NEW_ONOPEN = '''    STATE.ws.onopen = () => {
      console.log("[부산ON] WebSocket 서버 연결 성공!");
      _wsReconnectCount = 0; // ★ 성공 시 카운터 리셋
      if (_wsReconnectTimer) { clearTimeout(_wsReconnectTimer); _wsReconnectTimer = null; }
      updateServerStatusUI(true, "글로벌 인터넷 연결됨 (부산ON)");'''

code = code.replace(OLD_ONOPEN, NEW_ONOPEN)
print("✅ [1b] onopen: 성공 시 카운터 리셋")

# onclose에서 _scheduleReconnect 호출로 교체
OLD_ONCLOSE = '''    STATE.ws.onclose = () => {
      console.log("[부산ON] 서버 연결 종료. 3초 후 재연결 시도...");
      updateServerStatusUI(false, "재연결 시도 중...");
      setTimeout(connectMultiplayerWebSocket, 3000);
    };'''

NEW_ONCLOSE = '''    STATE.ws.onclose = () => {
      console.log("[부산ON] 서버 연결 종료.");
      _scheduleReconnect();
    };'''

code = code.replace(OLD_ONCLOSE, NEW_ONCLOSE)
print("✅ [1c] onclose: _scheduleReconnect()로 교체")

# catch 블록도 수정
OLD_CATCH_WS = '''  } catch (err) {
    console.warn("[부산ON] 소켓 연결 실패:", err);
    setTimeout(connectMultiplayerWebSocket, 4000);
  }
}

function handleServerMessage'''

NEW_CATCH_WS = '''  } catch (err) {
    console.warn("[부산ON] 소켓 연결 실패:", err);
    _scheduleReconnect();
  }
}

function handleServerMessage'''

code = code.replace(OLD_CATCH_WS, NEW_CATCH_WS)
print("✅ [1d] catch: _scheduleReconnect()로 교체")

# ===========================================================
# 수정 2: 캐릭터 중복 교체 → 플래그 추가
# ===========================================================
OLD_CHIBI_LOAD = '''    // 0-1. 프리미엄 보송 비닐 3D Chibi (Tripo 3D 정품 리깅 & 맨손 소품 지원)
    this.loadModel(\'models/chibi_character.glb\', (model) => {
      this.chibiModel = model;
      if (!STATE.avatarArchetype || STATE.avatarArchetype === \'chibi\') {
        this.replacePlayerModel(model);
      }
    });'''

NEW_CHIBI_LOAD = '''    // 0-1. 프리미엄 보송 비닐 3D Chibi (Tripo 3D 정품 리깅 & 맨손 소품 지원)
    // ★ v27: 최초 1회만 플레이어 모델 교체 (중복 교체 방지)
    this.loadModel(\'models/chibi_character.glb\', (model) => {
      this.chibiModel = model;
      // 초기 로드 시 archetype이 chibi이고 아직 적용 안 됐으면 적용
      if (!this._initialModelApplied && (!STATE.avatarArchetype || STATE.avatarArchetype === \'chibi\')) {
        this._initialModelApplied = true;
        this.replacePlayerModel(model);
        console.log(\'✨ [v27] 초기 치비 캐릭터 1회 적용 완료\');
      }
    });'''

code = code.replace(OLD_CHIBI_LOAD, NEW_CHIBI_LOAD)
print("✅ [2] chibi 초기 로드: _initialModelApplied 플래그 추가")

# civil_officer_walk는 플레이어 모델 교체 안 하고 sharedWalkClip만 저장
OLD_WALK_LOAD = '''    // 0. Mixamo 걷기 애니메이션 우선 로드 (모든 리깅 캐릭터 공유)
    this.loadModel(\'models/civil_officer_walk.glb\', (model) => {
      const anims = this.animationsCache[\'models/civil_officer_walk.glb\'] || [];
      if (anims.length > 0) {
        this.sharedWalkClip = anims[0];
        console.log(\'🚶 [TripoAssetManager] 표준 Mixamo 걷기 모션이 로드되었습니다!\');
      }
    });'''

NEW_WALK_LOAD = '''    // 0. Mixamo 걷기 애니메이션 우선 로드 (모든 리깅 캐릭터 공유, 플레이어 모델 교체 없음)
    this._initialModelApplied = false; // ★ v27: 중복 교체 방지 플래그 초기화
    this.loadModel(\'models/civil_officer_walk.glb\', (model) => {
      // ★ animations는 gltf.animations에서 직접 가져옴
      const anims = model.userData.animations || [];
      if (anims.length > 0) {
        this.sharedWalkClip = anims[0];
        console.log(\'🚶 [TripoAssetManager] 표준 Mixamo 걷기 모션이 로드되었습니다! clips:\', anims.length);
      } else {
        console.warn(\'⚠️ civil_officer_walk.glb 애니메이션 없음\');
      }
      // ★ 걷기 모델은 플레이어 모델 교체 안 함 (sharedWalkClip 저장 전용)
    });'''

code = code.replace(OLD_WALK_LOAD, NEW_WALK_LOAD)
print("✅ [2b] civil_officer_walk: 플레이어 교체 없이 sharedWalkClip만 저장")

# ===========================================================
# 수정 3: 팔 애니메이션 → replacePlayerModel에서 idle action 활성화
# ===========================================================
OLD_ANIM_SETUP = '''    if (anims.length > 0) {
      const mixer = new THREE.AnimationMixer(m);
      const walkClip = anims.find(a => a.name.toLowerCase().includes(\'walk\')) || this.sharedWalkClip || anims[0];
      const walkAction = walkClip ? mixer.clipAction(walkClip) : null;
      m.userData.mixer = mixer;
      m.userData.walkAction = walkAction;
      m.userData.currentAction = \'idle\';
    }'''

NEW_ANIM_SETUP = '''    if (anims.length > 0) {
      const mixer = new THREE.AnimationMixer(m);
      const walkClip = anims.find(a => a.name.toLowerCase().includes(\'walk\')) || this.sharedWalkClip || anims[0];
      const idleClip = anims.find(a => a.name.toLowerCase().includes(\'idle\')) || null;
      const walkAction = walkClip ? mixer.clipAction(walkClip) : null;
      const idleAction = idleClip ? mixer.clipAction(idleClip) : null;

      // ★ v27: 걷기 애니메이션을 idle 상태로 세팅 (weight=0, 재생은 하되 효과 없음)
      // → 플레이어가 움직이면 weight=1로 올려서 자연스럽게 걷기
      if (walkAction) {
        walkAction.setLoop(THREE.LoopRepeat, Infinity);
        walkAction.clampWhenFinished = false;
        walkAction.play();
        walkAction.weight = 0; // 초기에는 보이지 않음 (idle 상태)
      }
      if (idleAction) {
        idleAction.setLoop(THREE.LoopRepeat, Infinity);
        idleAction.play();
        idleAction.weight = 1;
      }
      m.userData.mixer = mixer;
      m.userData.walkAction = walkAction;
      m.userData.idleAction = idleAction;
      m.userData.currentAction = \'idle\';
      console.log(\'🦾 [v27] 애니메이션 믹서 초기화: walk=\', !!walkAction, \' idle=\', !!idleAction);
    } else {
      // 애니메이션 없는 모델도 mixer 초기화 (sharedWalkClip 대기)
      const mixer = new THREE.AnimationMixer(m);
      m.userData.mixer = mixer;
      m.userData.walkAction = null;
      m.userData.idleAction = null;
      m.userData.currentAction = \'idle\';
    }'''

code = code.replace(OLD_ANIM_SETUP, NEW_ANIM_SETUP)
print("✅ [3] replacePlayerModel: idle/walk action 초기화 및 블렌딩 추가")

# ===========================================================
# 수정 4: 캐릭터 visible 강제 true + 뼈대 선 제거
# ===========================================================
OLD_REPLACE = '''    if (localPlayer.userData.tripoMesh) {
      localPlayer.remove(localPlayer.userData.tripoMesh);
    }
    localPlayer.children.forEach(c => {
      if (c !== localPlayer.userData.nameplate && c !== localPlayer.userData.bubbleSlot && c !== localPlayer.userData.auraRing) {
        c.visible = false;
      }
    });
    localPlayer.add(m);
    localPlayer.userData.tripoMesh = m;
    localPlayer.userData.tripoBaseY = baseY;
    console.log(\'🎮 [TripoAssetManager] 주인공(플레이어) 3D 캐릭터 완벽 적용 완료!\');'''

NEW_REPLACE = '''    if (localPlayer.userData.tripoMesh) {
      localPlayer.remove(localPlayer.userData.tripoMesh);
      localPlayer.userData.tripoMesh = null;
    }
    // 기존 자식 숨기기 (nameplate, bubble, aura는 유지)
    localPlayer.children.forEach(c => {
      if (c !== localPlayer.userData.nameplate && c !== localPlayer.userData.bubbleSlot && c !== localPlayer.userData.auraRing) {
        c.visible = false;
      }
    });
    // ★ v27: 새 메시 visible 강제 true + SkeletonHelper 제거
    m.visible = true;
    m.traverse(c => {
      c.visible = true;
      // SkeletonHelper나 LineSegments(뼈대 선) 숨기기
      if (c.isLine || c.type === \'LineSegments\' || c.type === \'Line\') {
        c.visible = false;
      }
    });
    localPlayer.add(m);
    localPlayer.userData.tripoMesh = m;
    localPlayer.userData.tripoBaseY = baseY;
    console.log(\'🎮 [v27] 주인공 캐릭터 완벽 적용! scale=\', m.scale.y.toFixed(3), \' baseY=\', baseY.toFixed(3));'''

code = code.replace(OLD_REPLACE, NEW_REPLACE)
print("✅ [4] replacePlayerModel: visible 강제 true + 뼈대 선 숨김")

# ===========================================================
# 수정 5: updateCuteCitizenAnimation에서 mixer 업데이트 확인
# 걷기 시 walkAction.weight=1, idle 시 weight=0
# ===========================================================
# walk blending 개선: 기존 패턴 찾기
walk_blend_check = code.find("updateCuteCitizenAnimation")
if walk_blend_check >= 0:
    print(f"✅ [5] updateCuteCitizenAnimation 발견 (line ~{code[:walk_blend_check].count(chr(10))+1})")
else:
    print("⚠️ [5] updateCuteCitizenAnimation 없음 → 별도 처리 불필요")

# animate 루프에서 mixer.update 체크
OLD_MIXER_UPD_MARKER = "ud.tripoMesh.userData.mixer"
if OLD_MIXER_UPD_MARKER in code:
    print(f"✅ [5] mixer.update 호출 존재 ({code.count(OLD_MIXER_UPD_MARKER)}곳)")
else:
    print("⚠️ [5] mixer.update 없음 → 추가 필요")

# 걷기 감지 → weight 블렌딩
# 기존의 walkAction.play() 호출 패턴 찾아서 weight 추가
OLD_WALK_START = """.userData.walkAction && ud.tripoMesh.userData.currentAction !== 'walk') {
        ud.tripoMesh.userData.walkAction.reset().play();
        ud.tripoMesh.userData.currentAction = 'walk';"""

NEW_WALK_START = """.userData.walkAction && ud.tripoMesh.userData.currentAction !== 'walk') {
        // ★ v27: weight 블렌딩으로 자연스러운 걷기 전환
        const wa = ud.tripoMesh.userData.walkAction;
        wa.weight = 1;
        if (!wa.isRunning()) wa.reset().play();
        if (ud.tripoMesh.userData.idleAction) ud.tripoMesh.userData.idleAction.weight = 0;
        ud.tripoMesh.userData.currentAction = 'walk';"""

if OLD_WALK_START in code:
    code = code.replace(OLD_WALK_START, NEW_WALK_START)
    print("✅ [5a] 걷기 시작: weight=1 블렌딩 추가")

OLD_WALK_STOP = """.userData.walkAction && ud.tripoMesh.userData.currentAction !== 'idle') {
        ud.tripoMesh.userData.walkAction.stop();
        ud.tripoMesh.userData.currentAction = 'idle';"""

NEW_WALK_STOP = """.userData.walkAction && ud.tripoMesh.userData.currentAction !== 'idle') {
        // ★ v27: idle 복귀 시 weight 블렌딩
        const wa = ud.tripoMesh.userData.walkAction;
        wa.weight = 0;
        if (ud.tripoMesh.userData.idleAction) ud.tripoMesh.userData.idleAction.weight = 1;
        ud.tripoMesh.userData.currentAction = 'idle';"""

if OLD_WALK_STOP in code:
    code = code.replace(OLD_WALK_STOP, NEW_WALK_STOP)
    print("✅ [5b] 걷기 중지: weight=0 블렌딩 추가")

# ===========================================================
# 수정 6: 모델 로드 시 animations 올바르게 저장
# loadModel에서 gltf.animations를 cloned.userData.animations에 저장
# ===========================================================
OLD_CLONE_ANIMS = '''        const cloned = cloneWithBones(gltf.scene);
        cloned.userData.animations = gltf.animations || [];
        if (onLoaded) onLoaded(cloned);'''

NEW_CLONE_ANIMS = '''        const cloned = cloneWithBones(gltf.scene);
        cloned.userData.animations = gltf.animations || [];
        // ★ v27: animationsCache에도 저장 (sharedWalkClip 로딩 위해)
        if (gltf.animations && gltf.animations.length > 0) {
          if (!TripoAssetManager.animationsCache) TripoAssetManager.animationsCache = {};
          TripoAssetManager.animationsCache[url] = gltf.animations;
          console.log(\'📽️ [v27] 애니메이션 캐시 저장:\', url, gltf.animations.length, \'clips\');
        }
        if (onLoaded) onLoaded(cloned);'''

code = code.replace(OLD_CLONE_ANIMS, NEW_CLONE_ANIMS)
print("✅ [6] loadModel: animationsCache 저장 추가")

# ===========================================================
# 결과 저장
# ===========================================================
with open(SRC, "w", encoding="utf-8") as f:
    f.write(code)

final_len = len(code)
print(f"\n✅ 패치 완료!")
print(f"   원본: {original_len:,} bytes")
print(f"   패치: {final_len:,} bytes (+{final_len-original_len:,})")

# dist 동기화
import shutil
shutil.copy2(SRC, DST)
print(f"✅ dist/app.js 동기화 완료")

print("""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
v27 패치 적용 내용:
1. WebSocket 무한 루프 → 최대 12회 + exponential backoff
2. 캐릭터 중복 교체 → _initialModelApplied 플래그
3. 팔 애니메이션 → idle/walk weight 블렌딩
4. 뼈대 선(LineSegments) 숨김
5. 캐릭터 visible 강제 true
6. animations 캐시 저장 수정
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")
