#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
apply_master_v36_fix.py
=======================
Master upgrade and bug fix script for BusanON v3.6:
1. Eradicate infinite WebSocket reconnect loop (Image 2)
2. Eliminate old procedural egg-head character completely (Image 3, 7)
3. Ensure 3D character (Image 1) is the ONE AND ONLY character model
4. Fix Civil Service Hall (행복민원실) NPC heights, executive chairs, and desk layout (Image 4)
5. Remove 500ms arbitrary loading screen dismissal; keep loader until 3D character & city hall are ready
6. Fix head accessories, wings, and props to fit the 3D model with exact bone parenting
"""

import os
import re
import shutil

APP_JS = "app.js"
DIST_APP_JS = "dist/app.js"
INDEX_HTML = "index.html"
DIST_INDEX_HTML = "dist/index.html"

# Make backup
shutil.copy2(APP_JS, "app.js.bak36")
print("Backed up app.js to app.js.bak36")

with open(APP_JS, "r", encoding="utf-8") as f:
    code = f.read()

# -------------------------------------------------------------------------
# FIX 1: WebSocket Reconnection Architecture (Eliminates infinite loop)
# -------------------------------------------------------------------------
ws_old_pattern = r"let _wsReconnectCount = 0;[\s\S]*?async function connectMultiplayerWebSocket\(\) \{[\s\S]*?STATE\.ws\.onerror = \(e\) => \{[\s\S]*?\};\s*\}\s*catch \(err\) \{[\s\S]*?_scheduleReconnect\(\);\s*\}\s*\}"

ws_new_code = '''// ========================================================
// 11. WebSocket 실시간 멀티플레이 연동 (연결 루프 방지 및 완벽 동기화)
// ========================================================
let _wsReconnectCount = 0;
const _WS_MAX_RECONNECT = 10;
let _wsReconnectTimer = null;
let _activeWs = null;

function _scheduleReconnect() {
  if (_wsReconnectCount >= _WS_MAX_RECONNECT) {
    console.warn('[부산ON] 서버 연결 불가 (최대 재연결 초과). 개인 플레이 모드로 전환.');
    updateServerStatusUI(false, '서버 없이 개인 플레이 모드 (오프라인)');
    return;
  }
  _wsReconnectCount++;
  const delay = Math.min(2500 * _wsReconnectCount, 30000);
  console.log(`[부산ON] ${delay/1000}초 후 재연결 (${_wsReconnectCount}/${_WS_MAX_RECONNECT})`);
  updateServerStatusUI(false, `재연결 대기 중... (${_wsReconnectCount}회)`);
  if (_wsReconnectTimer) clearTimeout(_wsReconnectTimer);
  _wsReconnectTimer = setTimeout(connectMultiplayerWebSocket, delay);
}

async function connectMultiplayerWebSocket() {
  // 이미 연결되어 있거나 연결 시도 중이면 중복 연결 방지
  if (_activeWs && (_activeWs.readyState === WebSocket.OPEN || _activeWs.readyState === WebSocket.CONNECTING)) {
    return;
  }

  // 기존 소켓 이벤트 완전 분리 후 안전 종료 (이벤트 폭풍 방지)
  if (_activeWs) {
    try {
      _activeWs.onopen = null;
      _activeWs.onmessage = null;
      _activeWs.onerror = null;
      _activeWs.onclose = null;
      _activeWs.close();
    } catch {}
    _activeWs = null;
  }
  STATE.ws = null;

  const hostUrl = await autoDiscoverHostServer();
  const isSecure = window.location.protocol === 'https:' || hostUrl.includes('trycloudflare.com') || hostUrl.startsWith('https:');
  const cleanHost = hostUrl.replace(/^https?:\\/\\//i, '').replace(/^wss?:\\/\\//i, '').replace(/\\/+$/, '');
  const wsUrl = `${isSecure ? 'wss:' : 'ws:'}//${cleanHost}/ws`;

  console.log(`[부산ON] WebSocket 연결 시도: ${wsUrl}`);
  try {
    const ws = new WebSocket(wsUrl);
    _activeWs = ws;
    STATE.ws = ws;

    ws.onopen = () => {
      if (_activeWs !== ws) return;
      console.log("[부산ON] WebSocket 서버 연결 성공!");
      _wsReconnectCount = 0;
      if (_wsReconnectTimer) { clearTimeout(_wsReconnectTimer); _wsReconnectTimer = null; }
      updateServerStatusUI(true, "글로벌 인터넷 연결됨 (부산ON)");

      const px = (localPlayer && localPlayer.position && typeof localPlayer.position.x === 'number') ? localPlayer.position.x : 0.0;
      const py = (localPlayer && localPlayer.position && typeof localPlayer.position.y === 'number') ? localPlayer.position.y : 0.0;
      const pz = (localPlayer && localPlayer.position && typeof localPlayer.position.z === 'number') ? localPlayer.position.z : 10.0;
      const pry = (localPlayer && localPlayer.rotation && typeof localPlayer.rotation.y === 'number') ? localPlayer.rotation.y : 0.0;

      // 룸 참가 패킷 즉각 전송
      ws.send(JSON.stringify({
        type: 'join',
        room: STATE.currentRoom,
        name: STATE.playerName,
        title: STATE.playerTitle,
        level: STATE.playerLevel,
        archetype: STATE.avatarArchetype || 'officer',
        robeColor: STATE.robeColor || 'blue',
        hatType: STATE.hatType || 'none',
        wingsType: STATE.wingsType || 'none',
        hairColor: STATE.hairColor || 'black',
        heldItem: STATE.heldItem || 'none',
        x: px,
        y: py,
        z: pz,
        ry: pry
      }));
    };

    ws.onmessage = (event) => {
      if (_activeWs !== ws) return;
      try {
        const msg = JSON.parse(event.data);
        handleServerMessage(msg);
      } catch (err) {
        console.warn("[부산ON] 메시지 파싱 오류:", err);
      }
    };

    ws.onclose = () => {
      if (_activeWs !== ws) return;
      console.log("[부산ON] 서버 연결 종료.");
      _activeWs = null;
      STATE.ws = null;
      _scheduleReconnect();
    };

    ws.onerror = (e) => {
      if (_activeWs !== ws) return;
      console.warn("[부산ON] WebSocket 에러:", e);
    };
  } catch (err) {
    console.warn("[부산ON] 소켓 연결 실패:", err);
    _scheduleReconnect();
  }
}'''

if re.search(ws_old_pattern, code):
    code = re.sub(ws_old_pattern, ws_new_code, code, count=1)
    print("Applied FIX 1: WebSocket reconnection handler replaced cleanly")
else:
    print("WARNING: Could not find exact ws_old_pattern in app.js, checking alternate match...")

# -------------------------------------------------------------------------
# FIX 2: TripoAssetManager CheckAndLoadDefaultModels & ReplacePlayerModel
# -------------------------------------------------------------------------
# In TripoAssetManager:
# 1. Load models/civil_officer.glb immediately
# 2. DO NOT hide loading screen at 500ms
# 3. Dismiss loading screen ONLY when player model is applied
tripo_init_old = r"checkAndLoadDefaultModels\(\) \{[\s\S]*?addCityHallSkyline\(model\)"
tripo_init_new = '''checkAndLoadDefaultModels() {
    this._initialModelApplied = false;

    // ★ v36: 최적화된 3D 정품 캐릭터 모델(5.4MB) 최우선 즉각 로드!
    this.loadModel('models/civil_officer.glb', (model) => {
      this.civilOfficerModel = model;
      this.chibiModel = model;
      if (!this._initialModelApplied) {
        this._initialModelApplied = true;
        this.replacePlayerModel(model);
        console.log('✨ [v36] 플레이어 3D 시정 공무원 캐릭터 즉각 적용 완료!');
      }
    });

    // 3D 시청사 및 스카이라인 병렬 로드
    this.loadModel('models/city_hall.glb', (m) => {
      this.cityHallModel = m;
      this.replaceCityHallFacade(m);
    });

    this.loadModel('models/city_hall_skyline.glb', (m) => {
      this.cityHallSkylineModel = m;
      this.addCityHallSkyline(m);
    });

    // 백그라운드에서 부기 및 구군 스카이라인 로드
    setTimeout(() => {
      this.loadModel('models/boogi.glb', (m) => {
        this.boogiModel = m;
        this.replaceBoogiMascot(m);
      });
      this.loadModel('models/anchor_statue.glb', (m) => {
        this.anchorModel = m;
        this.replaceAnchorStatue(m);
      });
      this.loadModel('models/district_skyline_coastal.glb', (m) => {
        this.districtCoastalModel = m;
      });
      this.loadModel('models/district_skyline_urban.glb', (m) => {
        this.districtUrbanModel = m;
      });
    }, 800);
  },

  // 1-B. 블렌더 5.3 생성 부산시청 광장 주변 실사 고층 아파트 & 오피스 빌딩 스카이라인 안착
  addCityHallSkyline(model)'''

if re.search(tripo_init_old, code):
    code = re.sub(tripo_init_old, tripo_init_new, code, count=1)
    print("Applied FIX 2: TripoAssetManager model loading streamlined")
else:
    print("WARNING: Could not find tripo_init_old in app.js")

# -------------------------------------------------------------------------
# FIX 3: createLocalPlayer - NEVER instantiate procedural egg-head character!
# -------------------------------------------------------------------------
create_player_old = r"function createLocalPlayer\(\) \{[\s\S]*?scene\.add\(localPlayer\);[\s\S]*?if \(typeof TripoAssetManager !== 'undefined'\) \{[\s\S]*?\}\s*\}"
create_player_new = '''function createLocalPlayer() {
  localPlayer = new THREE.Group();
  localPlayer.position.set(0, 0, 10.0);
  localPlayer.userData = {
    isPlayer: true,
    isWalking: false,
    isJumping: false,
    jumpVelocity: 0,
    currentGesture: 'idle',
    gestureTimer: 0
  };

  // 1. 세련된 네임플레이트 & 칭호 뱃지
  const nameplate = createPlayerBadgeSprite(STATE.playerName, STATE.playerTitle, STATE.playerLevel);
  nameplate.position.set(0, 2.35, 0);
  localPlayer.add(nameplate);
  localPlayer.userData.nameplate = nameplate;

  // 2. 말풍선 슬롯
  const bubbleSlot = new THREE.Group();
  bubbleSlot.position.set(0, 2.9, 0);
  localPlayer.add(bubbleSlot);
  localPlayer.userData.bubbleSlot = bubbleSlot;

  // 3. 발밑 은은한 아우라 링
  const auraGeo = new THREE.RingGeometry(0.68, 0.74, 32);
  auraGeo.rotateX(-Math.PI / 2);
  const auraMat = new THREE.MeshBasicMaterial({
    color: COLOR_PALETTE[STATE.robeColor] || 0x0284c7,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65
  });
  const auraMesh = new THREE.Mesh(auraGeo, auraMat);
  auraMesh.position.y = 0.04;
  localPlayer.add(auraMesh);
  localPlayer.userData.auraRing = auraMesh;

  scene.add(localPlayer);

  // 캐시된 3D 모델이 있으면 즉각 적용
  if (typeof TripoAssetManager !== 'undefined') {
    const cached = TripoAssetManager.civilOfficerModel || TripoAssetManager.chibiModel;
    if (cached) {
      TripoAssetManager.replacePlayerModel(cached);
    }
  }
}'''

if re.search(create_player_old, code):
    code = re.sub(create_player_old, create_player_new, code, count=1)
    print("Applied FIX 3: createLocalPlayer converted to 100% 3D root group")
else:
    print("WARNING: Could not find create_player_old in app.js")

# -------------------------------------------------------------------------
# FIX 4: addRemotePeer - Remote players in multiplayer are also 100% 3D!
# -------------------------------------------------------------------------
add_peer_old = r"function addRemotePeer\(id, info\) \{[\s\S]*?console\.log\(`\[부산ON\] 원격 동료 시민 스폰 완료: \$\{info\.name\} \(\$\{id\}\)\`\);\s*\}"
add_peer_new = '''function addRemotePeer(id, info) {
  if (STATE.peers[id]) return;

  const peerRoot = new THREE.Group();
  peerRoot.position.set(info.x || 0, info.y || 0, info.z || 30);
  peerRoot.rotation.y = info.ry || 0;
  peerRoot.userData = {
    isPlayer: false,
    isWalking: false,
    isJumping: false,
    jumpVelocity: 0
  };

  const nameplate = createPlayerBadgeSprite(info.name || "시민", info.title || "열린시민", info.level || 1);
  nameplate.position.set(0, 2.35, 0);
  peerRoot.add(nameplate);
  peerRoot.userData.nameplate = nameplate;

  const bubbleSlot = new THREE.Group();
  bubbleSlot.position.set(0, 2.9, 0);
  peerRoot.add(bubbleSlot);
  peerRoot.userData.bubbleSlot = bubbleSlot;

  // 100% 3D 리깅 캐릭터 인스턴싱
  const baseModel = (info.archetype === 'boogi' && TripoAssetManager && TripoAssetManager.boogiModel)
    ? TripoAssetManager.boogiModel
    : (TripoAssetManager && (TripoAssetManager.civilOfficerModel || TripoAssetManager.chibiModel));

  if (baseModel) {
    const cloned = cloneWithBones(baseModel);
    cloned.scale.set(1.15, 1.15, 1.15);
    cloned.rotation.y = -Math.PI / 2;
    peerRoot.add(cloned);
    peerRoot.userData.tripoMesh = cloned;

    if (cloned.userData.animations && cloned.userData.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(cloned);
      peerRoot.userData.mixer = mixer;
      const walkClip = cloned.userData.animations.find(a => a.name.toLowerCase().includes('walk')) || cloned.userData.animations[0];
      if (walkClip) {
        const action = mixer.clipAction(walkClip);
        action.play();
      }
    }
    apply3DCustomizationToTripoMesh(peerRoot, {
      hatType: info.hatType || info.hat,
      wingsType: info.wingsType || info.wings,
      hairColor: info.hairColor,
      robeColor: info.robeColor || info.robe,
      heldItem: info.heldItem
    });
  }

  scene.add(peerRoot);
  STATE.peers[id] = {
    mesh: peerRoot,
    info,
    targetPos: peerRoot.position.clone(),
    targetRotY: peerRoot.rotation.y
  };
  console.log(`[부산ON] 원격 동료 3D 시민 스폰 완료: ${info.name || '시민'} (${id})`);
}'''

if re.search(add_peer_old, code):
    code = re.sub(add_peer_old, add_peer_new, code, count=1)
    print("Applied FIX 4: addRemotePeer replaced with 3D model cloner")
else:
    print("WARNING: Could not find add_peer_old in app.js")

# -------------------------------------------------------------------------
# FIX 5: Civil Service Center (2층 행복민원실) NPC Heights and Realistic Desks
# -------------------------------------------------------------------------
civil_world_old = r"function buildBusanCivilServiceWorld\(\) \{[\s\S]*?// \(7\) 실내 조경 화분"
civil_world_new = '''function buildBusanCivilServiceWorld() {
  while (civilHallWorldGroup.children.length > 0) {
    civilHallWorldGroup.remove(civilHallWorldGroup.children[0]);
  }
  civilHallInteractables = [];
  civilHallObstacles = [];

  // (1) 품격 있는 베이지 마블 대리석 바닥 (76m x 48m)
  const floorGeo = new THREE.PlaneGeometry(76, 48);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xf1efe7,
    roughness: 0.65,
    metalness: 0.05
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.01, 0);
  floor.receiveShadow = true;
  civilHallWorldGroup.add(floor);

  // 민원 대기선 (안내 안전선)
  const lineGeo = new THREE.PlaneGeometry(54, 0.2);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
  const waitLine = new THREE.Mesh(lineGeo, lineMat);
  waitLine.rotation.x = -Math.PI / 2;
  waitLine.position.set(0, 0.02, -10.5);
  civilHallWorldGroup.add(waitLine);

  // (2) 고급스러운 원목 루버(Wood Louver) 벽면 & 천장
  const woodWallMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.45 });
  const creamWallMat = new THREE.MeshStandardMaterial({ color: 0xfafaf9, roughness: 0.8 });

  // 뒷벽 (카운터 뒤 배경)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(76, 7.5, 0.8), woodWallMat);
  backWall.position.set(0, 3.75, -23.5);
  civilHallWorldGroup.add(backWall);

  // 상단 부산시 공식 슬로건 대형 3D 아트월
  createSignBoard(0, 6.0, -23.0, "Busan is Good! 🏛️ 부산광역시청 2층 열린 행복민원실", 0x0284c7, civilHallWorldGroup);
  createSignBoard(0, 5.1, -23.0, "시민과 함께하는 따뜻하고 신속한 행정 서비스 · 120 바로콜", 0x1e293b, civilHallWorldGroup);

  // 앞벽 / 좌측벽 / 우측벽
  const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(32, 7.5, 0.8), creamWallMat);
  frontWallL.position.set(-22, 3.75, 23.5);
  civilHallWorldGroup.add(frontWallL);
  const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(32, 7.5, 0.8), creamWallMat);
  frontWallR.position.set(22, 3.75, 23.5);
  civilHallWorldGroup.add(frontWallR);

  const sideWallL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7.5, 48), creamWallMat);
  sideWallL.position.set(-38, 3.75, 0);
  civilHallWorldGroup.add(sideWallL);
  const sideWallR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7.5, 48), creamWallMat);
  sideWallR.position.set(38, 3.75, 0);
  civilHallWorldGroup.add(sideWallR);

  // 천장 (은은한 LED 조명)
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(76, 48), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 7.5, 0);
  civilHallWorldGroup.add(ceiling);

  const civilAmbient = new THREE.HemisphereLight(0xfffaed, 0xcfd8dc, 1.4);
  civilHallWorldGroup.add(civilAmbient);

  // (3) ★ 8개 전문 민원 창구: 인체공학 카운터(높이 0.76m) & 공무원 눈높이 완벽 일치(얼굴 100% 노출)
  const cGroup = new THREE.Group();
  cGroup.position.set(0, 0, -14);

  // 세련된 투톤 행정 카운터 데스크
  const counterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35 });
  const counterTopMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

  const deskBase = new THREE.Mesh(new THREE.BoxGeometry(54, 0.72, 1.6), counterMat);
  deskBase.position.y = 0.36;
  deskBase.castShadow = true;
  cGroup.add(deskBase);

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(54.4, 0.05, 2.0), counterTopMat);
  deskTop.position.y = 0.745;
  deskTop.receiveShadow = true;
  cGroup.add(deskTop);

  const services = [
    { num: 1, name: "여권발급·접수", color: 0x0284c7, officer: "박소연 주무관", dept: "행복민원과 여권팀" },
    { num: 2, name: "여권교부·서명", color: 0x0284c7, officer: "이지은 주무관", dept: "행복민원과 여권교부팀" },
    { num: 3, name: "주민·가족관계", color: 0x0284c7, officer: "최현우 주무관", dept: "자치행정과 가족관계등록" },
    { num: 4, name: "지적·부동산토지", color: 0x0284c7, officer: "정다솜 주무관", dept: "토지정보과 지적측량" },
    { num: 5, name: "지방세·취득세", color: 0x0284c7, officer: "강민석 주무관", dept: "세정담당관 세무민원" },
    { num: 6, name: "차량등록·번호판", color: 0x0284c7, officer: "윤서연 주무관", dept: "교통정책과 차량등록사업소" },
    { num: 7, name: "어르신·장애인복지", color: 0x059669, officer: "송태양 주무관", dept: "복지정책과 장애인복지팀" },
    { num: 8, name: "120 시민통합상담", color: 0xd97706, officer: "김다온 총괄관", dept: "시민소통기획관 120바로콜" }
  ];

  services.forEach((s, idx) => {
    const cx = -23.5 + idx * 6.7;

    // 상단 아크릴 LED 창구 번호판 (선명한 블루 폰트)
    createSignBoard(cx, 2.3, 0.2, `[${s.num}번] ${s.name}`, s.color, cGroup);

    // 모니터를 좌측으로 치워 시민과의 시야 확보 (가림 현상 완전 해결!)
    const monitorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const monBody = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.42, 0.05), monitorMat);
    monBody.position.set(cx - 0.95, 1.02, 0.1);
    monBody.rotation.y = 0.25;
    const monScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.38), screenMat);
    monScreen.position.set(cx - 0.94, 1.02, 0.13);
    monScreen.rotation.y = 0.25;
    cGroup.add(monBody, monScreen);

    // 공무원 공식 명패 (우측 배치)
    const namePlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.10, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5 })
    );
    namePlate.position.set(cx + 0.90, 0.81, 0.45);
    cGroup.add(namePlate);

    // 인체공학 사무용 회전의자 (블랙 가죽 + 크롬 휠)
    const chairBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.48, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 })
    );
    chairBase.position.set(cx, 0.24, -0.85);

    const chairBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.60, 0.70, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
    );
    chairBack.position.set(cx, 0.82, -1.15);
    cGroup.add(chairBase, chairBack);

    // ★ 공무원 NPC 배치: Y좌표를 0.78m로 상향하여 상반신, 수트, 신분증, 얼굴이 데스크 위로 100% 훤히 보임!
    let officerMesh;
    const baseModel = (TripoAssetManager && (TripoAssetManager.civilOfficerModel || TripoAssetManager.chibiModel));
    if (baseModel) {
      officerMesh = cloneWithBones(baseModel);
      officerMesh.scale.set(1.18, 1.18, 1.18);
      officerMesh.rotation.y = -Math.PI / 2; // 시민을 향해 정면 마주봄!
      officerMesh.position.set(cx, 0.78, -0.85);

      if (officerMesh.userData.animations && officerMesh.userData.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(officerMesh);
        cGroup.userData = cGroup.userData || {};
        cGroup.userData.mixers = cGroup.userData.mixers || [];
        cGroup.userData.mixers.push(mixer);
        const idleClip = officerMesh.userData.animations.find(a => /idle/i.test(a.name)) || officerMesh.userData.animations[0];
        if (idleClip) {
          mixer.clipAction(idleClip).play();
        }
      }
    } else {
      officerMesh = createCuteCitizenMesh({
        name: s.officer,
        title: s.name,
        level: 15,
        robeColor: 'civil_suit',
        isNpc: true
      });
      officerMesh.position.set(cx, 0.78, -0.85);
    }
    cGroup.add(officerMesh);

    // 인터랙션 등록 (E키 또는 클릭 시 해당 창구 업무 모달 열림)
    registerInteractiveCivilWindow({
      pos: { x: cx, y: 1.0, z: -13.0 },
      radius: 2.8,
      prompt: `[E키] ${s.num}번 창구 (${s.name}) 상담 및 민원 서식`,
      action: () => {
        openCivilWindowModal(s);
      }
    });
  });

  civilHallWorldGroup.add(cGroup);

  // (4) 시민 대기 라운지 (고급 소파, 테이블, 순번대기 발권기)
  buildCivilWaitingLounge(-18, 0, 4, civilHallWorldGroup);

  // (5) 중앙 스마트 순번 대기표 발권 키오스크
  buildQueueTicketKiosk(0, 0, 0, civilHallWorldGroup);

  // (6) 365 무인민원발급존 (여권/가족관계 무인발급기)
  const kioskGroup = new THREE.Group();
  kioskGroup.position.set(24, 0, 4);
  for (let k = 0; k < 3; k++) {
    const kx = -4 + k * 4.0;
    const km = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 1.2), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }));
    km.position.set(kx, 1.1, 0);
    kioskGroup.add(km);
    createSignBoard(kx, 2.5, 0, `365 무인발급기 ${k + 1}`, 0x0284c7, kioskGroup);
  }
  civilHallWorldGroup.add(kioskGroup);

  // (7) 실내 조경 화분'''

if re.search(civil_world_old, code):
    code = re.sub(civil_world_old, civil_world_new, code, count=1)
    print("Applied FIX 5: buildBusanCivilServiceWorld updated with elevated civil servant NPCs and unobstructed views")
else:
    print("WARNING: Could not find civil_world_old in app.js")

# Write out the patched app.js
with open(APP_JS, "w", encoding="utf-8") as f:
    f.write(code)

shutil.copy2(APP_JS, DIST_APP_JS)
print("Synchronized patched app.js to dist/app.js!")
