// ========================================================
// 부산ON 월드 (BUSAN ON WORLD) - 프리미엄 3D 메타버스 엔진
// 부산광역시청 5대 시민광장, 1층 들락날락 도서관, 2층 행복민원실
// 프로시저럴 텍스처, 톤매핑 & 고대비 조명, SD 치비 아바타, 실시간 멀티플레이
// ========================================================

// --------------------------------------------------------
// 1. 글로벌 상태 및 상수 정의
// --------------------------------------------------------
const STATE = {
  playerName: "열린시민",
  playerLevel: 1,
  playerExp: 20,
  playerTitle: "첫 방문 시민",
  robeColor: "blue",
  hatType: "camellia",
  wingsType: "seagull",
  currentRoom: "BUSAN-HQ",
  onlineCount: 1,
  peers: {},             // { id: { mesh, info, targetPos, targetRotY } }
  keys: { w: false, a: false, s: false, d: false, space: false, shift: false },
  joystickDir: { x: 0, y: 0 },
  clickTargetPos: null,
  activeHostUrl: null,
  ws: null,
  lastMoveSend: 0,
  stamps: { anchor: false, lighthouse: false, lobby: false, civil: false },
  quizIndex: 0,
  quizScore: 0,
  interactionTarget: null
};

const COLOR_PALETTE = {
  blue: 0x0284c7,     // 부산 마린 로얄 블루 (고대비 선명도)
  white: 0xffffff,    // 순백 화이트
  camellia: 0xe11d48, // 동백꽃 레드
  gold: 0xf59e0b,     // 햇살 골드
  green: 0x10b981     // 녹음 그린
};

// 3D 렌더링 전역 변수
let scene, camera, renderer, controls, clock;
let localPlayer = null;
let clickMarkerMesh = null;
let fountainParticles = [];
let fallingPetals = [];
let seagulls = [];
let interactiveObjects = [];
let lighthouseBeamMesh = null;
let busanCityHallObstacles = [];

// 프로시저럴 텍스처 캐시
const TEXTURES = {};

// ========================================================
// 2. 프로시저럴 고품질 텍스처 생성기 (외장 에셋 없이 즉각 로드)
// ========================================================
function createProceduralTextures() {
  // (1) 시민광장 화강석 석재 타일 (Stone Plaza Tiles)
  const c1 = document.createElement('canvas');
  c1.width = 512;
  c1.height = 512;
  const ctx1 = c1.getContext('2d');
  ctx1.fillStyle = '#e2e8f0';
  ctx1.fillRect(0, 0, 512, 512);

  // 미세 석재 노이즈
  for (let i = 0; i < 20000; i++) {
    const nx = Math.random() * 512;
    const ny = Math.random() * 512;
    ctx1.fillStyle = Math.random() > 0.5 ? '#cbd5e1' : '#f8fafc';
    ctx1.fillRect(nx, ny, 2, 2);
  }

  // 타일 줄눈 (Grid lines)
  ctx1.strokeStyle = '#94a3b8';
  ctx1.lineWidth = 4;
  for (let x = 0; x <= 512; x += 128) {
    ctx1.beginPath(); ctx1.moveTo(x, 0); ctx1.lineTo(x, 512); ctx1.stroke();
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx1.beginPath(); ctx1.moveTo(0, y); ctx1.lineTo(512, y); ctx1.stroke();
  }
  TEXTURES.plaza = new THREE.CanvasTexture(c1);
  TEXTURES.plaza.wrapS = THREE.RepeatWrapping;
  TEXTURES.plaza.wrapT = THREE.RepeatWrapping;
  TEXTURES.plaza.repeat.set(8, 8);

  // (2) 1층 로비 광택 대리석 (Polished Marble Floor)
  const c2 = document.createElement('canvas');
  c2.width = 512;
  c2.height = 512;
  const ctx2 = c2.getContext('2d');
  ctx2.fillStyle = '#f8fafc';
  ctx2.fillRect(0, 0, 512, 512);
  // 은은한 회색 마블 마블링 베인
  ctx2.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx2.lineWidth = 6;
  ctx2.beginPath();
  ctx2.moveTo(40, 0);
  ctx2.bezierCurveTo(180, 160, 240, 360, 480, 512);
  ctx2.stroke();

  ctx2.beginPath();
  ctx2.moveTo(0, 320);
  ctx2.bezierCurveTo(200, 240, 320, 120, 512, 80);
  ctx2.stroke();

  // 대리석 대형 타일 라인
  ctx2.strokeStyle = '#cbd5e1';
  ctx2.lineWidth = 2;
  for (let x = 0; x <= 512; x += 256) {
    ctx2.beginPath(); ctx2.moveTo(x, 0); ctx2.lineTo(x, 512); ctx2.stroke();
  }
  for (let y = 0; y <= 512; y += 256) {
    ctx2.beginPath(); ctx2.moveTo(0, y); ctx2.lineTo(512, y); ctx2.stroke();
  }
  TEXTURES.marble = new THREE.CanvasTexture(c2);
  TEXTURES.marble.wrapS = THREE.RepeatWrapping;
  TEXTURES.marble.wrapT = THREE.RepeatWrapping;
  TEXTURES.marble.repeat.set(8, 5);

  // (3) 시청 고층 유리 타워 커튼월 (Modern Glass Curtain Wall)
  const c3 = document.createElement('canvas');
  c3.width = 512;
  c3.height = 512;
  const ctx3 = c3.getContext('2d');
  ctx3.fillStyle = '#0284c7';
  ctx3.fillRect(0, 0, 512, 512);

  // 창문 유리 패널 격자 & 조명 반사
  for (let y = 0; y < 512; y += 64) {
    for (let x = 0; x < 512; x += 32) {
      ctx3.fillStyle = Math.random() > 0.4 ? '#38bdf8' : '#7dd3fc';
      ctx3.fillRect(x + 2, y + 4, 28, 56);
      // 창문 내부 은은한 시정 사무실 불빛
      if (Math.random() > 0.6) {
        ctx3.fillStyle = 'rgba(254, 240, 138, 0.45)';
        ctx3.fillRect(x + 4, y + 10, 24, 24);
      }
    }
  }
  // 수직 알루미늄 멀리언
  ctx3.strokeStyle = '#0f172a';
  ctx3.lineWidth = 3;
  for (let x = 0; x <= 512; x += 32) {
    ctx3.beginPath(); ctx3.moveTo(x, 0); ctx3.lineTo(x, 512); ctx3.stroke();
  }
  TEXTURES.glassTower = new THREE.CanvasTexture(c3);
  TEXTURES.glassTower.wrapS = THREE.RepeatWrapping;
  TEXTURES.glassTower.wrapT = THREE.RepeatWrapping;
  TEXTURES.glassTower.repeat.set(6, 6);

  // (4) 2층 및 야외무대 따뜻한 원목 마루 (Wood Floor)
  const c4 = document.createElement('canvas');
  c4.width = 512;
  c4.height = 512;
  const ctx4 = c4.getContext('2d');
  ctx4.fillStyle = '#b45309';
  ctx4.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) {
    ctx4.fillStyle = (y / 32) % 2 === 0 ? '#92400e' : '#b45309';
    ctx4.fillRect(0, y, 512, 30);
  }
  ctx4.strokeStyle = '#78350f';
  ctx4.lineWidth = 2;
  for (let y = 0; y <= 512; y += 32) {
    ctx4.beginPath(); ctx4.moveTo(0, y); ctx4.lineTo(512, y); ctx4.stroke();
  }
  TEXTURES.wood = new THREE.CanvasTexture(c4);
  TEXTURES.wood.wrapS = THREE.RepeatWrapping;
  TEXTURES.wood.wrapT = THREE.RepeatWrapping;
  TEXTURES.wood.repeat.set(6, 6);

  // (5) 푸른 잔디 공원 텍스처 (Grass)
  const c5 = document.createElement('canvas');
  c5.width = 512;
  c5.height = 512;
  const ctx5 = c5.getContext('2d');
  ctx5.fillStyle = '#22c55e';
  ctx5.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 30000; i++) {
    const gx = Math.random() * 512;
    const gy = Math.random() * 512;
    ctx5.fillStyle = Math.random() > 0.5 ? '#16a34a' : '#4ade80';
    ctx5.fillRect(gx, gy, 2, 3);
  }
  TEXTURES.grass = new THREE.CanvasTexture(c5);
  TEXTURES.grass.wrapS = THREE.RepeatWrapping;
  TEXTURES.grass.wrapT = THREE.RepeatWrapping;
  TEXTURES.grass.repeat.set(16, 16);
}

// ========================================================
// 3. 호스트 서버 자동 감지 (Gist Raw 무제한 통신)
// ========================================================
const GIST_REGISTRY_ID = "8bd7ddc5c6df9538c8092e1f01c9b2fa";

async function autoDiscoverHostServer() {
  // 1. 수동 지정 호스트 확인
  const savedHost = localStorage.getItem('busan_custom_host');
  if (savedHost) {
    STATE.activeHostUrl = savedHost;
    updateServerStatusUI(true, "수동 지정 호스트");
    return savedHost;
  }

  // 2. 로컬호스트 실행 환경 확인
  const loc = window.location;
  if (loc.hostname === 'localhost' || loc.hostname === '127.0.0.1' || loc.port === '8080') {
    STATE.activeHostUrl = `${loc.protocol}//${loc.host}`;
    updateServerStatusUI(true, "로컬 서버 (포트 8080)");
    return STATE.activeHostUrl;
  }

  // 3. GitHub Pages: Gist Raw URL 직접 호출 (Rate Limit 403 제약 완전 없음!)
  updateServerStatusUI(false, "글로벌 호스트 탐색 중...");
  const cacheBuster = Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  try {
    const rawRes = await fetch(`https://gist.githubusercontent.com/kicharisma2/${GIST_REGISTRY_ID}/raw/host.json?_nocache=${cacheBuster}`, {
      cache: 'no-store'
    });
    if (rawRes.ok) {
      const hostInfo = await rawRes.json();
      if (hostInfo && hostInfo.status === 'online' && (hostInfo.url || hostInfo.host)) {
        const cleanHost = (hostInfo.url || hostInfo.host).replace(/\/+$/, '');
        STATE.activeHostUrl = cleanHost;
        updateServerStatusUI(true, "글로벌 인터넷 연결됨 (부산ON)");
        console.log("[부산ON] Gist Raw 호스트 실시간 연동 성공:", cleanHost);
        return cleanHost;
      }
    }
  } catch (err) {
    console.warn("[부산ON] Gist Raw 호스트 조회 실패:", err);
  }

  STATE.activeHostUrl = "http://localhost:8080";
  updateServerStatusUI(false, "로컬 대기 모드");
  return STATE.activeHostUrl;
}

function getApiUrl(path) {
  const base = STATE.activeHostUrl || "http://localhost:8080";
  return `${base}${path.startsWith('/') ? path : '/' + path}`;
}

function updateServerStatusUI(online, text) {
  const dot = document.getElementById('server-status-dot');
  const txt = document.getElementById('server-status-text');
  const pill = document.getElementById('server-status-pill');
  if (dot) dot.innerText = online ? "🟢" : "🟡";
  if (txt) txt.innerText = text;
  if (pill) {
    pill.className = `server-status-pill clickable ${online ? 'online' : 'waiting'}`;
  }
}

// ========================================================
// 4. Three.js 씬 초기화 및 톤매핑 / 고대비 조명
// ========================================================
const SHARED_GEO = {};
const SHARED_MAT = {};

function initSharedGeometries() {
  SHARED_GEO.head = new THREE.SphereGeometry(0.44, 24, 22);
  SHARED_GEO.hair = new THREE.SphereGeometry(0.48, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.6);
  SHARED_GEO.hairBangs = new THREE.BoxGeometry(0.38, 0.18, 0.14);
  SHARED_GEO.eye = new THREE.SphereGeometry(0.065, 14, 12);
  SHARED_GEO.shine = new THREE.SphereGeometry(0.024, 10, 10);
  SHARED_GEO.blush = new THREE.SphereGeometry(0.068, 12, 10);
  SHARED_GEO.mouth = new THREE.TorusGeometry(0.045, 0.016, 8, 14, Math.PI);
  SHARED_GEO.body = new THREE.CylinderGeometry(0.26, 0.38, 0.62, 20);
  SHARED_GEO.limb = new THREE.CylinderGeometry(0.09, 0.09, 0.38, 12);
  SHARED_GEO.shoe = new THREE.BoxGeometry(0.16, 0.08, 0.24);
  SHARED_GEO.camelliaFlower = new THREE.CylinderGeometry(0.14, 0.14, 0.04, 8);
  SHARED_GEO.camelliaCenter = new THREE.SphereGeometry(0.05, 8, 8);
  SHARED_GEO.halo = new THREE.TorusGeometry(0.36, 0.04, 10, 24);
  SHARED_GEO.wing = new THREE.BoxGeometry(0.48, 0.22, 0.04);
  SHARED_GEO.shadowDecal = new THREE.CircleGeometry(0.42, 18);

  SHARED_MAT.skin = new THREE.MeshStandardMaterial({ color: 0xffdfd3, roughness: 0.45 });
  SHARED_MAT.hair = new THREE.MeshStandardMaterial({ color: 0x24140e, roughness: 0.6 }); // 또렷한 흑갈색 헤어
  SHARED_MAT.eye = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  SHARED_MAT.shine = new THREE.MeshBasicMaterial({ color: 0xffffff });
  SHARED_MAT.blush = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
  SHARED_MAT.mouth = new THREE.MeshBasicMaterial({ color: 0xe11d48 });
  SHARED_MAT.shoe = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
  SHARED_MAT.gold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });
  SHARED_MAT.camellia = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3 });
  SHARED_MAT.halo = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  SHARED_MAT.wing = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  SHARED_MAT.shadow = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.26 });
}

function initThreeWorld() {
  const canvas = document.getElementById('gl-canvas');
  clock = new THREE.Clock();

  // (1) Scene - 맑고 화창한 부산 바다 하늘 (푸른빛)
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x38bdf8); // 선명한 스카이블루
  scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0035); // 원거리 대기감만 살짝 부여

  // (2) Camera
  camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 800);
  camera.position.set(0, 12, 54);

  // (3) Renderer - ACES 톤매핑으로 눈부심 방지 및 사진 수준의 선명한 대비
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05; // 과노출 없는 황금 노출값
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // (4) OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI / 2 - 0.03;
  controls.minDistance = 2.5;
  controls.maxDistance = 65;
  controls.target.set(0, 1.4, 28);

  // (5) 조명 세팅 - 부드러운 환경광 + 선명한 태양광 (하얗게 날아가지 않음)
  const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.45); // 따뜻하고 부드러운 앰비언트
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.15); // 선명한 메인 태양광
  sunLight.position.set(40, 65, 35);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0003;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 180;
  const d = 52;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  scene.add(sunLight);

  // 하늘(푸른빛)과 땅(바다빛)의 자연스러운 바운스광
  const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1e3a8a, 0.38);
  scene.add(hemiLight);

  createProceduralTextures();
  initSharedGeometries();
  setupClickMarker();
  buildBusanCityHallWorld();
  createLocalPlayer();
  setupMovementControls();
  setupVirtualJoystick();
  setupResizeHandler();

  animate();
}

// ========================================================
// 5. 부산광역시청 및 5대 시민광장 3D 건축 모델링
// ========================================================
function buildBusanCityHallWorld() {
  busanCityHallObstacles = [];

  // (1) 메인 지형: 푸른 잔디 공원 (텍스처 적용)
  const terrainGeo = new THREE.PlaneGeometry(240, 240);
  const terrainMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.grass,
    roughness: 0.85
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.rotation.x = -Math.PI / 2;
  terrain.position.y = -0.02;
  terrain.receiveShadow = true;
  scene.add(terrain);

  // (2) 시민광장 화강석 석재 바닥 (텍스처 적용)
  const plazaFloorGeo = new THREE.PlaneGeometry(54, 46);
  const plazaFloorMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.plaza,
    roughness: 0.4
  });
  const plazaFloor = new THREE.Mesh(plazaFloorGeo, plazaFloorMat);
  plazaFloor.rotation.x = -Math.PI / 2;
  plazaFloor.position.set(0, 0.01, 31);
  plazaFloor.receiveShadow = true;
  scene.add(plazaFloor);

  // (3) 부산광역시청 본관 외관 타워 (28층 모던 커튼월)
  buildCityHallTowerFacade();

  // (4) 시민광장: 부산의 닻 조형물 & 음악 분수대
  buildAnchorSculpture(0, 0, 26);
  buildDancingFountain(0, 0, 42);

  // (5) 등대광장: 해양 등대 & 소원 연못
  buildLighthouseSquare(34, 0, 30);

  // (6) 동백광장: 만개한 동백나무 정원 & 벤치
  buildCamelliaSquare(-34, 0, 30);

  // (7) 녹음광장 야외공연장: 반원형 관람석 & 버스킹 무대
  buildGreenPlazaAmphitheater(-33, 0, 60);

  // (8) 잔디광장 시민 발언대: 확성기 발언대
  buildFreeSpeechPodium(33, 0, 60);

  // (9) 1층 들락날락 어린이 도서관 & 미래도시관 & 안내데스크
  buildFirstFloorAtriumLobby();

  // (10) 1F -> 2F 중앙 그랜드 계단 및 에스컬레이터
  buildCentralGrandStairs();

  // (11) 2층 행복민원실 (여권창구, 120콜센터, 아주라 수유실, 순번 키오스크)
  buildSecondFloorCivilServiceHall();

  // (12) 갈매기 비행 무리
  createFlockOfSeagulls();
}

// --------------------------------------------------------
// [건축 1] 부산시청 본관 28층 타워 외관 파사드
// --------------------------------------------------------
function buildCityHallTowerFacade() {
  const buildingGroup = new THREE.Group();

  // 28층 모던 글래스 타워 볼륨 (커튼월 텍스처 적용)
  const towerGeo = new THREE.BoxGeometry(84, 44, 70);
  const towerMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.glassTower,
    metalness: 0.5,
    roughness: 0.2
  });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.set(0, 22, -50);
  tower.castShadow = true;
  buildingGroup.add(tower);

  // 옥상 통신 안테나 철탑 & 붉은 항공 장애 표시등
  const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.4, 10, 8), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
  spire.position.set(0, 49, -50);
  buildingGroup.add(spire);

  const warnLight = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  warnLight.position.set(0, 54, -50);
  buildingGroup.add(warnLight);

  // 1층 캐노피 지붕 & 시청 간판
  const canopyGeo = new THREE.BoxGeometry(28, 1.2, 8);
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.2 });
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0, 5.2, -1);
  canopy.castShadow = true;
  buildingGroup.add(canopy);

  createSignBoard(0, 5.9, 3.1, "부산광역시청 BUSAN METROPOLITAN CITY", 0x0369a1, buildingGroup);

  // 유리 자동문 입구 (Z: 0, X: -6 ~ 6)
  const doorGeo = new THREE.BoxGeometry(10, 4.2, 0.4);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.55 });
  const doors = new THREE.Mesh(doorGeo, doorMat);
  doors.position.set(0, 2.1, 0);
  buildingGroup.add(doors);

  scene.add(buildingGroup);

  // 건물 외벽 물리 충돌 등록
  busanCityHallObstacles.push({ type: 'box', x: -28, z: 0, w: 32, d: 2, h: 10 });
  busanCityHallObstacles.push({ type: 'box', x: 28, z: 0, w: 32, d: 2, h: 10 });
  busanCityHallObstacles.push({ type: 'box', x: -42, z: -45, w: 2, d: 80, h: 15 });
  busanCityHallObstacles.push({ type: 'box', x: 42, z: -45, w: 2, d: 80, h: 15 });
  busanCityHallObstacles.push({ type: 'box', x: 0, z: -84, w: 86, d: 2, h: 15 });
}

// --------------------------------------------------------
// [건축 2] 시민광장: 부산의 닻(Anchor) 상징 조형물
// --------------------------------------------------------
function buildAnchorSculpture(x, y, z) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  // 화강석 단상 (Y: 1.0)
  const baseGeo = new THREE.BoxGeometry(5.0, 1.0, 5.0);
  const baseMat = new THREE.MeshStandardMaterial({ map: TEXTURES.plaza, roughness: 0.4 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.5;
  base.receiveShadow = true;
  base.castShadow = true;
  group.add(base);

  // 실버 크롬 닻 메탈 조각
  const anchorMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.12 });

  const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 4.2, 16), anchorMat);
  shank.position.y = 3.0;
  shank.castShadow = true;
  group.add(shank);

  const stock = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.4, 16), anchorMat);
  stock.rotation.z = Math.PI / 2;
  stock.position.y = 4.4;
  group.add(stock);

  const ringGeo = new THREE.TorusGeometry(1.6, 0.22, 12, 24, Math.PI);
  const flukes = new THREE.Mesh(ringGeo, anchorMat);
  flukes.rotation.z = Math.PI;
  flukes.position.y = 2.4;
  group.add(flukes);

  const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.08, 10, 20), anchorMat);
  topRing.position.y = 5.2;
  group.add(topRing);

  scene.add(group);

  registerInteractiveObject({
    id: 'anchor',
    pos: { x, y: 1.0, z },
    radius: 3.5,
    prompt: "부산의 닻 기념비 살펴보기",
    action: () => {
      collectStamp('anchor', "부산의 닻");
      showSpeechBubble(localPlayer, "⚓ 해양 수도 부산의 상징 '부산의 닻' 조형물입니다! 굳건한 번영을 염원합니다.");
      if (window.busanAudio) window.busanAudio.playStampSound();
    }
  });

  busanCityHallObstacles.push({ type: 'box', x, z, w: 5.0, d: 5.0, h: 1.0 });
}

// --------------------------------------------------------
// [건축 3] 음악 분수대 (Dancing Fountain)
// --------------------------------------------------------
function buildDancingFountain(x, y, z) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const basinGeo = new THREE.CylinderGeometry(6.2, 6.4, 0.7, 32);
  const basinMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
  const basin = new THREE.Mesh(basinGeo, basinMat);
  basin.position.y = 0.35;
  basin.receiveShadow = true;
  group.add(basin);

  const waterGeo = new THREE.CylinderGeometry(5.8, 5.8, 0.65, 32);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.85
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.y = 0.38;
  group.add(water);

  for (let i = 0; i < 16; i++) {
    const pGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.9 });
    const p = new THREE.Mesh(pGeo, pMat);
    const angle = (i / 16) * Math.PI * 2;
    p.position.set(Math.cos(angle) * 3.5, 0.6, Math.sin(angle) * 3.5);
    p.userData = { baseY: 0.6, speed: 3.5 + Math.random(), phase: i * 0.4 };
    fountainParticles.push(p);
    group.add(p);
  }

  scene.add(group);

  registerInteractiveObject({
    id: 'fountain',
    pos: { x, y, z },
    radius: 7.0,
    prompt: "음악 분수대 물줄기 감상하기",
    action: () => {
      showSpeechBubble(localPlayer, "⛲ 시원한 분수대 물줄기를 보니 마음까지 상쾌해집니다!");
      if (window.busanAudio) window.busanAudio.playFountainSplash();
      addCitizenExp(30);
    }
  });

  busanCityHallObstacles.push({ type: 'cyl', x, z, r: 6.2, h: 0.7 });
}

// --------------------------------------------------------
// [건축 4] 등대광장: 해양 등대 & 소원 연못
// --------------------------------------------------------
function buildLighthouseSquare(x, y, z) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const lhGroup = new THREE.Group();
  lhGroup.position.set(0, 0, 0);

  const baseGeo = new THREE.CylinderGeometry(2.4, 2.8, 1.2, 18);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
  const lhBase = new THREE.Mesh(baseGeo, baseMat);
  lhBase.position.y = 0.6;
  lhGroup.add(lhBase);

  const colors = [0xe11d48, 0xffffff, 0xe11d48, 0xffffff];
  for (let i = 0; i < 4; i++) {
    const segGeo = new THREE.CylinderGeometry(1.9 - i * 0.25, 2.15 - i * 0.25, 2.2, 18);
    const segMat = new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.4 });
    const seg = new THREE.Mesh(segGeo, segMat);
    seg.position.y = 1.2 + 1.1 + i * 2.2;
    seg.castShadow = true;
    lhGroup.add(seg);
  }

  const lanternGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.4, 16);
  const lanternMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8 });
  const lantern = new THREE.Mesh(lanternGeo, lanternMat);
  lantern.position.y = 11.2;
  lhGroup.add(lantern);

  const beamGeo = new THREE.ConeGeometry(8, 28, 16, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide
  });
  lighthouseBeamMesh = new THREE.Mesh(beamGeo, beamMat);
  lighthouseBeamMesh.rotation.x = Math.PI / 2;
  lighthouseBeamMesh.position.set(0, 11.2, 14);
  lhGroup.add(lighthouseBeamMesh);

  group.add(lhGroup);

  // 소원 연못
  const pondGroup = new THREE.Group();
  pondGroup.position.set(0, 0, 10);
  const pondRim = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 0.4, 20), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
  pondRim.position.y = 0.2;
  pondGroup.add(pondRim);

  const pondWater = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 0.38, 20), new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, transparent: true, opacity: 0.85 }));
  pondWater.position.y = 0.22;
  pondGroup.add(pondWater);
  group.add(pondGroup);

  scene.add(group);

  registerInteractiveObject({
    id: 'lighthouse',
    pos: { x, y, z },
    radius: 4.5,
    prompt: "부산 해양 등대 둘러보기",
    action: () => {
      collectStamp('lighthouse', "해양 등대");
      showSpeechBubble(localPlayer, "🏮 부산의 밤바다를 환히 밝히는 희망의 등대입니다!");
      if (window.busanAudio) window.busanAudio.playStampSound();
    }
  });

  registerInteractiveObject({
    id: 'wish_pond',
    pos: { x, y, z: z + 10 },
    radius: 3.5,
    prompt: "동전 소원 연못에 행운 빌기",
    action: () => {
      if (window.busanAudio) window.busanAudio.playCoinToss();
      showSpeechBubble(localPlayer, "🪙 동전을 퐁당 던졌습니다! 부산시민 모두의 소원이 이루어지길!");
      addCitizenExp(50);
    }
  });

  busanCityHallObstacles.push({ type: 'cyl', x, z, r: 2.8, h: 12 });
  busanCityHallObstacles.push({ type: 'cyl', x, z: z + 10, r: 3.4, h: 0.4 });
}

// --------------------------------------------------------
// [건축 5] 동백광장: 부산 시화(市花) 동백나무 정원
// --------------------------------------------------------
function buildCamelliaSquare(x, y, z) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const treePositions = [
    { dx: -6, dz: -6 }, { dx: 0, dz: -8 }, { dx: 6, dz: -6 },
    { dx: -8, dz: 0 }, { dx: 8, dz: 0 },
    { dx: -6, dz: 6 }, { dx: 0, dz: 8 }, { dx: 6, dz: 6 }
  ];

  treePositions.forEach(p => {
    const tree = createCamelliaTree();
    tree.position.set(p.dx, 0, p.dz);
    group.add(tree);
    busanCityHallObstacles.push({ type: 'cyl', x: x + p.dx, z: z + p.dz, r: 0.8, h: 4.5 });
  });

  const bench1 = createParkBench();
  bench1.position.set(-2, 0, 0);
  group.add(bench1);

  const bench2 = createParkBench();
  bench2.position.set(2, 0, 0);
  bench2.rotation.y = Math.PI;
  group.add(bench2);

  for (let i = 0; i < 24; i++) {
    const petal = new THREE.Mesh(SHARED_GEO.camelliaFlower, SHARED_MAT.camellia);
    petal.scale.set(0.6, 0.6, 0.6);
    petal.position.set(
      x + (Math.random() - 0.5) * 16,
      1.5 + Math.random() * 3.5,
      z + (Math.random() - 0.5) * 16
    );
    petal.userData = { vy: 0.015 + Math.random() * 0.02, rotSpeed: Math.random() * 0.04 };
    fallingPetals.push(petal);
    scene.add(petal);
  }

  scene.add(group);

  registerInteractiveObject({
    id: 'camellia',
    pos: { x, y, z },
    radius: 4.5,
    prompt: "동백꽃 정원 벤치에서 쉬어가기",
    action: () => {
      showSpeechBubble(localPlayer, "🌺 붉은 동백꽃 향기가 가득합니다. 부산의 시화는 아름다운 동백꽃입니다!");
      if (window.busanAudio) window.busanAudio.playClick();
      addCitizenExp(30);
    }
  });
}

function createCamelliaTree() {
  const tree = new THREE.Group();
  const trunkGeo = new THREE.CylinderGeometry(0.24, 0.32, 2.4, 10);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 1.2;
  trunk.castShadow = true;
  tree.add(trunk);

  const foliageGeo = new THREE.SphereGeometry(1.6, 12, 10);
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65 });
  const foliage = new THREE.Mesh(foliageGeo, foliageMat);
  foliage.position.y = 2.8;
  foliage.castShadow = true;
  tree.add(foliage);

  for (let i = 0; i < 8; i++) {
    const flower = new THREE.Mesh(SHARED_GEO.camelliaFlower, SHARED_MAT.camellia);
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI;
    flower.position.set(
      Math.sin(v) * Math.cos(u) * 1.5,
      2.8 + Math.cos(v) * 1.4,
      Math.sin(v) * Math.sin(u) * 1.5
    );
    flower.rotation.set(Math.random(), Math.random(), Math.random());
    tree.add(flower);
  }
  return tree;
}

function createParkBench() {
  const bench = new THREE.Group();
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.7), seatMat);
  seat.position.y = 0.45;
  bench.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 0.1), seatMat);
  back.position.set(0, 0.85, -0.3);
  bench.add(back);

  [-0.9, 0.9].forEach(dx => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.65), legMat);
    leg.position.set(dx, 0.225, 0);
    bench.add(leg);
  });
  return bench;
}

// --------------------------------------------------------
// [건축 6] 녹음광장 야외공연장 버스킹 무대
// --------------------------------------------------------
function buildGreenPlazaAmphitheater(x, y, z) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  // 원목 버스킹 무대 (Y: 0.4, 텍스처 적용)
  const stageGeo = new THREE.CylinderGeometry(5.2, 5.4, 0.4, 24);
  const stageMat = new THREE.MeshStandardMaterial({ map: TEXTURES.wood, roughness: 0.5 });
  const stage = new THREE.Mesh(stageGeo, stageMat);
  stage.position.y = 0.2;
  stage.receiveShadow = true;
  group.add(stage);

  // 스탠드 마이크
  const micMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85 });
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8), micMat);
  stand.position.set(0, 0.9, 0);
  group.add(stand);

  const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
  micHead.position.set(0, 1.6, 0);
  group.add(micHead);

  // 반원형 관람석 계단 (3단 티어)
  for (let tier = 1; tier <= 3; tier++) {
    const tierGeo = new THREE.CylinderGeometry(5.2 + tier * 2.5, 5.2 + tier * 2.5, 0.5, 24, 1, false, Math.PI * 0.2, Math.PI * 0.6);
    const tierMat = new THREE.MeshStandardMaterial({ map: TEXTURES.plaza, roughness: 0.5 });
    const tierMesh = new THREE.Mesh(tierGeo, tierMat);
    tierMesh.position.y = tier * 0.5 - 0.25;
    group.add(tierMesh);
  }

  scene.add(group);

  registerInteractiveObject({
    id: 'amphitheater',
    pos: { x, y, z },
    radius: 4.5,
    prompt: "야외공연장 무대에서 댄스 버스킹하기",
    action: () => {
      performGesture('dance');
      showSpeechBubble(localPlayer, "💃 녹음광장 버스킹 무대에서 신나는 댄스를 펼칩니다!");
      if (window.busanAudio) window.busanAudio.playApplause();
      addCitizenExp(60);
    }
  });

  busanCityHallObstacles.push({ type: 'cyl', x, z, r: 5.2, h: 0.4 });
}

// --------------------------------------------------------
// [건축 7] 잔디광장 시민 발언대 (Free Speech Podium)
// --------------------------------------------------------
function buildFreeSpeechPodium(x, y, z) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const podiumBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 4.2), new THREE.MeshStandardMaterial({ map: TEXTURES.wood, roughness: 0.5 }));
  podiumBase.position.y = 0.4;
  group.add(podiumBase);

  const lectern = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 0.8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
  lectern.position.set(0, 1.35, -1.0);
  group.add(lectern);

  const megaMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.25 });
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 14), megaMat);
  horn.rotation.x = Math.PI / 2;
  horn.position.set(0, 1.95, -1.0);
  group.add(horn);

  scene.add(group);

  registerInteractiveObject({
    id: 'speech_podium',
    pos: { x, y: 0.8, z },
    radius: 3.5,
    prompt: "시민 발언대에 올라 확성기로 외치기",
    action: () => {
      openPodiumPrompt();
    }
  });

  busanCityHallObstacles.push({ type: 'box', x, z, w: 4.2, d: 4.2, h: 0.8 });
}

// --------------------------------------------------------
// [건축 8] 1층 로비: '들락날락' 어린이 복합문화도서관 & 16구군 미래도시관 & 안내데스크
// --------------------------------------------------------
function buildFirstFloorAtriumLobby() {
  const lobbyGroup = new THREE.Group();

  // 1층 광택 대리석 바닥 (텍스처 적용)
  const floorGeo = new THREE.PlaneGeometry(80, 38);
  const floorMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.marble,
    roughness: 0.18,
    metalness: 0.12
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.02, -19);
  floor.receiveShadow = true;
  lobbyGroup.add(floor);

  // 들락날락 도서관
  buildDeullakLibrarySection(-24, 0, -18, lobbyGroup);

  // 중앙 미래도시관 16개 자치구군 디오라마
  buildFutureCityDistrictTable(0, 0, -16, lobbyGroup);

  // 종합안내데스크 & AI 다온 NPC
  buildAiGuideReceptionDesk(24, 0, -14, lobbyGroup);

  scene.add(lobbyGroup);
}

function buildDeullakLibrarySection(x, y, z, parent) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  createSignBoard(0, 3.8, 0, "들락날락 어린이 복합문화공간", 0x0284c7, group);

  const shelfMat = new THREE.MeshStandardMaterial({ map: TEXTURES.wood, roughness: 0.5 });
  [-4.5, 4.5].forEach(dx => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.2, 0.8), shelfMat);
    shelf.position.set(dx, 1.6, -4);
    group.add(shelf);
    busanCityHallObstacles.push({ type: 'box', x: x + dx, z: z - 4, w: 6.5, d: 0.8, h: 3.2 });
  });

  const table = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.6, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  table.position.set(0, 0.3, 0);
  group.add(table);

  [-1.8, 1.8].forEach(sx => {
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.35, 12), new THREE.MeshStandardMaterial({ color: sx > 0 ? 0x06b6d4 : 0xf43f5e }));
    stool.position.set(sx, 0.18, 0);
    group.add(stool);
  });

  parent.add(group);

  registerInteractiveObject({
    id: 'deullak_library',
    pos: { x, y, z },
    radius: 4.5,
    prompt: "들락날락 어린이 도서관 둘러보기",
    action: () => {
      collectStamp('lobby', "1층 들락날락");
      showSpeechBubble(localPlayer, "📚 1층 '들락날락' 복합문화도서관입니다. 책과 미디어가 가득한 시민 휴식처입니다!");
      if (window.busanAudio) window.busanAudio.playStampSound();
    }
  });
}

function buildFutureCityDistrictTable(x, y, z, parent) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const tableGeo = new THREE.CylinderGeometry(4.5, 4.7, 0.85, 32);
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.y = 0.425;
  group.add(table);

  const mapTop = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, 0.88, 32), new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.45,
    roughness: 0.2
  }));
  mapTop.position.y = 0.44;
  group.add(mapTop);

  for (let i = 0; i < 16; i++) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b }));
    const angle = (i / 16) * Math.PI * 2;
    pin.position.set(Math.cos(angle) * 3.2, 0.95, Math.sin(angle) * 3.2);
    group.add(pin);
  }

  parent.add(group);

  registerInteractiveObject({
    id: 'future_districts',
    pos: { x, y, z },
    radius: 5.5,
    prompt: "16개 구·군 디오라마 미래도시관 포털 열기",
    action: () => {
      openDistrictsModal();
    }
  });

  busanCityHallObstacles.push({ type: 'cyl', x, z, r: 4.6, h: 0.9 });
}

function buildAiGuideReceptionDesk(x, y, z, parent) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const counterGeo = new THREE.BoxGeometry(6.5, 1.1, 1.6);
  const counterMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, metalness: 0.3 });
  const counter = new THREE.Mesh(counterGeo, counterMat);
  counter.position.y = 0.55;
  group.add(counter);

  createSignBoard(0, 1.8, 0, "종합안내데스크 (AI 다온)", 0xffffff, group);

  // AI 다온 NPC
  const daonNpc = createCuteCitizenMesh({
    name: "안내원 다온",
    title: "AI 시정 길잡이",
    robeColor: "blue",
    hatType: "headset",
    wingsType: "none",
    isNpc: true
  });
  daonNpc.position.set(0, 0, -1.0);
  group.add(daonNpc);

  parent.add(group);

  registerInteractiveObject({
    id: 'ai_daon_desk',
    pos: { x, y, z: z + 1.2 },
    radius: 3.5,
    prompt: "AI 안내원 다온과 상담하기 (질의응답)",
    action: () => {
      openAiGuideModal();
    }
  });

  busanCityHallObstacles.push({ type: 'box', x, z, w: 6.5, d: 1.6, h: 1.1 });
}

// --------------------------------------------------------
// [건축 9] 1F -> 2F 중앙 그랜드 계단 및 에스컬레이터 (물리 램프)
// --------------------------------------------------------
function buildCentralGrandStairs() {
  const group = new THREE.Group();

  const stairLength = 16.0;
  const stairHeight = 5.0;
  const rampGeo = new THREE.BoxGeometry(12.0, 0.4, stairLength);
  const rampMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });
  const ramp = new THREE.Mesh(rampGeo, rampMat);

  ramp.position.set(0, 2.5, -30.0);
  ramp.rotation.x = Math.atan2(stairHeight, stairLength);
  group.add(ramp);

  [-5.8, 5.8].forEach(rx => {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, stairLength + 1, 10), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85 }));
    rail.position.set(rx, 3.4, -30.0);
    rail.rotation.x = Math.PI / 2 + Math.atan2(stairHeight, stairLength);
    group.add(rail);
  });

  scene.add(group);
}

// --------------------------------------------------------
// [건축 10] 2층 행복민원실 (Happy Civil Service Hall)
// --------------------------------------------------------
function buildSecondFloorCivilServiceHall() {
  const floor2Group = new THREE.Group();

  // 2층 바닥 (Y: 5.0, 원목 텍스처 적용)
  const floor2Geo = new THREE.PlaneGeometry(80, 44);
  const floor2Mat = new THREE.MeshStandardMaterial({
    map: TEXTURES.wood,
    roughness: 0.35
  });
  const floor2 = new THREE.Mesh(floor2Geo, floor2Mat);
  floor2.rotation.x = -Math.PI / 2;
  floor2.position.set(0, 5.0, -60);
  floor2.receiveShadow = true;
  floor2Group.add(floor2);

  // 1층 로비 조망 안전 강화유리 난간
  const glassRailGeo = new THREE.BoxGeometry(80, 1.2, 0.2);
  const glassRailMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
  const rail = new THREE.Mesh(glassRailGeo, glassRailMat);
  rail.position.set(0, 5.6, -38.2);
  floor2Group.add(rail);

  // 8개 종합 민원 창구
  buildCivilServiceCounters(-20, 5.0, -62, floor2Group);

  // 순번 대기표 발급 키오스크
  buildQueueTicketKiosk(-6, 5.0, -45, floor2Group);

  // 시민 대기 라운지
  buildCivilWaitingLounge(-18, 5.0, -48, floor2Group);

  // 120 부산민원콜센터 부스
  buildCallCenterBooth(24, 5.0, -48, floor2Group);

  // 아주라 모자휴게실
  buildAjuraNurseryRoom(24, 5.0, -68, floor2Group);

  scene.add(floor2Group);

  busanCityHallObstacles.push({ type: 'box', x: -24, z: -38.2, w: 32, d: 0.4, h: 7.0 });
  busanCityHallObstacles.push({ type: 'box', x: 24, z: -38.2, w: 32, d: 0.4, h: 7.0 });
}

function buildCivilServiceCounters(x, y, z, parent) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const desk = new THREE.Mesh(new THREE.BoxGeometry(28, 1.1, 2.2), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.3 }));
  desk.position.y = 0.55;
  group.add(desk);

  const services = ["여권발급", "가족관계", "지적토지", "세무상담", "차량등록", "건축주택", "어르신복지", "통합민원"];
  for (let i = 0; i < 8; i++) {
    const cx = -12 + i * 3.4;
    createSignBoard(cx, 1.8, 0, `${i + 1}번 ${services[i]}`, 0x0f172a, group);

    const staff = createCuteCitizenMesh({
      name: `담당관${i + 1}`,
      title: services[i],
      robeColor: "white",
      hatType: "none",
      wingsType: "none",
      isNpc: true
    });
    staff.position.set(cx, 0, -1.2);
    group.add(staff);
  }

  parent.add(group);

  registerInteractiveObject({
    id: 'civil_counters',
    pos: { x, y, z: z + 1.8 },
    radius: 6.0,
    prompt: "2층 종합민원 창구 안내 및 상담",
    action: () => {
      collectStamp('civil', "2층 행복민원실");
      openOfficeModal();
      showSpeechBubble(localPlayer, "📋 행복민원실 1번~8번 창구입니다. 여권 발급과 각종 민원을 상담받으실 수 있습니다!");
      if (window.busanAudio) window.busanAudio.playStampSound();
    }
  });

  busanCityHallObstacles.push({ type: 'box', x, z, w: 28, d: 2.2, h: 6.5 });
}

function buildQueueTicketKiosk(x, y, z, parent) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.6), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 }));
  body.position.y = 0.8;
  group.add(body);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.55), new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5 }));
  screen.position.set(0, 1.15, 0.31);
  group.add(screen);

  createSignBoard(0, 1.9, 0, "순번 대기표 발급기", 0x0284c7, group);

  parent.add(group);

  registerInteractiveObject({
    id: 'queue_kiosk',
    pos: { x, y, z },
    radius: 2.5,
    prompt: "순번 대기표 발급기 터치하기 (번호표 출력)",
    action: () => {
      openTicketKioskModal();
    }
  });

  busanCityHallObstacles.push({ type: 'box', x, z, w: 0.8, d: 0.6, h: 6.6 });
}

function buildCivilWaitingLounge(x, y, z, parent) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
  [-4, 0, 4].forEach(sx => {
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.7, 1.2), sofaMat);
    sofa.position.set(sx, 0.35, 0);
    group.add(sofa);
    busanCityHallObstacles.push({ type: 'box', x: x + sx, z, w: 3.2, d: 1.2, h: 5.7 });
  });

  const tv = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 0.1), new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x0284c7, emissiveIntensity: 0.3 }));
  tv.position.set(0, 2.6, -3.5);
  group.add(tv);

  parent.add(group);
}

function buildCallCenterBooth(x, y, z, parent) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const booth = new THREE.Mesh(new THREE.BoxGeometry(8, 2.6, 6), new THREE.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.45 }));
  booth.position.y = 1.3;
  group.add(booth);

  createSignBoard(0, 2.8, 0, "120 부산민원콜센터 상담실", 0x0284c7, group);

  parent.add(group);

  registerInteractiveObject({
    id: 'call_center',
    pos: { x, y, z: z + 3.2 },
    radius: 4.0,
    prompt: "120 부산민원콜센터 상담 부스 연결",
    action: () => {
      showSpeechBubble(localPlayer, "📞 120 부산민원콜센터입니다. 전화(국번없이 120)로도 친절히 안내받으실 수 있습니다!");
      if (window.busanAudio) window.busanAudio.playDingDong();
      openOfficeModal();
    }
  });

  busanCityHallObstacles.push({ type: 'box', x, z, w: 8, d: 6, h: 7.6 });
}

function buildAjuraNurseryRoom(x, y, z, parent) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const room = new THREE.Mesh(new THREE.BoxGeometry(8, 2.6, 6), new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.4 }));
  room.position.y = 1.3;
  group.add(room);

  createSignBoard(0, 2.8, 0, "아주라(Ajura) 모자휴게실 · 수유실", 0xf59e0b, group);

  parent.add(group);

  registerInteractiveObject({
    id: 'ajura_room',
    pos: { x, y, z: z + 3.2 },
    radius: 4.0,
    prompt: "아주라 모자휴게실 둘러보기",
    action: () => {
      showSpeechBubble(localPlayer, "👶 영유아 동반 시민을 위한 따뜻한 수유실 '아주라' 쉼터입니다.");
      if (window.busanAudio) window.busanAudio.playClick();
      addCitizenExp(30);
    }
  });

  busanCityHallObstacles.push({ type: 'box', x, z, w: 8, d: 6, h: 7.6 });
}

function createSignBoard(x, y, z, textStr, bgHex, parent) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#' + bgHex.toString(16).padStart(6, '0');
  ctx.roundRect(0, 0, 512, 128, 24);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.roundRect(4, 4, 504, 120, 20);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(textStr, 256, 64);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), mat);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function createFlockOfSeagulls() {
  for (let i = 0; i < 5; i++) {
    const sGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    body.rotation.x = Math.PI / 2;
    sGroup.add(body);

    const wingGeo = new THREE.BoxGeometry(0.8, 0.04, 0.2);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
    const lWing = new THREE.Mesh(wingGeo, wingMat);
    lWing.position.set(-0.45, 0, 0);
    sGroup.add(lWing);

    const rWing = new THREE.Mesh(wingGeo, wingMat);
    rWing.position.set(0.45, 0, 0);
    sGroup.add(rWing);

    const radius = 22 + i * 8;
    const speed = 0.008 + i * 0.002;
    sGroup.position.set(0, 18 + i * 2.5, 30);
    sGroup.userData = { radius, speed, angle: i * 1.2, lWing, rWing };

    seagulls.push(sGroup);
    scene.add(sGroup);
  }
}

// ========================================================
// 6. 선명한 고대비 귀여운 SD 치비 시민 캐릭터 아바타 엔진
// ========================================================
function createCuteCitizenMesh({
  name = "시민",
  title = "열린시민",
  level = 1,
  robeColor = "blue",
  hatType = "camellia",
  wingsType = "seagull",
  isPlayer = false,
  isNpc = false
} = {}) {
  const root = new THREE.Group();

  // (1) 몸통 (선명한 로얄블루 수트 및 깃)
  const robeHex = COLOR_PALETTE[robeColor] || COLOR_PALETTE.blue;
  const robeMat = new THREE.MeshStandardMaterial({ color: robeHex, roughness: 0.45 });
  const body = new THREE.Mesh(SHARED_GEO.body, robeMat);
  body.position.y = 0.65;
  if (isPlayer) body.castShadow = true;
  root.add(body);

  // 화이트 와이셔츠 깃 포인트
  const collar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.06), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  collar.position.set(0, 0.88, 0.18);
  root.add(collar);

  // (2) 또렷한 헤어스타일과 대두 머리 (Head & Hair)
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.22;
  root.add(headGroup);

  const head = new THREE.Mesh(SHARED_GEO.head, SHARED_MAT.skin);
  if (isPlayer) head.castShadow = true;
  headGroup.add(head);

  // 입체 흑갈색 헤어 볼륨 (어떤 조명에서도 또렷하게 캐릭터 윤곽을 살림)
  const hair = new THREE.Mesh(SHARED_GEO.hair, SHARED_MAT.hair);
  hair.position.set(0, 0.06, -0.02);
  headGroup.add(hair);

  const bangsL = new THREE.Mesh(SHARED_GEO.hairBangs, SHARED_MAT.hair);
  bangsL.position.set(-0.16, 0.28, 0.32);
  bangsL.rotation.z = 0.2;
  headGroup.add(bangsL);

  const bangsR = new THREE.Mesh(SHARED_GEO.hairBangs, SHARED_MAT.hair);
  bangsR.position.set(0.16, 0.28, 0.32);
  bangsR.rotation.z = -0.2;
  headGroup.add(bangsR);

  // 초롱초롱한 애니메 눈망울
  const eyeL = new THREE.Mesh(SHARED_GEO.eye, SHARED_MAT.eye);
  eyeL.position.set(-0.14, 0.02, 0.38);
  const shineL = new THREE.Mesh(SHARED_GEO.shine, SHARED_MAT.shine);
  shineL.position.set(-0.02, 0.025, 0.045);
  eyeL.add(shineL);
  headGroup.add(eyeL);

  const eyeR = new THREE.Mesh(SHARED_GEO.eye, SHARED_MAT.eye);
  eyeR.position.set(0.14, 0.02, 0.38);
  const shineR = new THREE.Mesh(SHARED_GEO.shine, SHARED_MAT.shine);
  shineR.position.set(-0.02, 0.025, 0.045);
  eyeR.add(shineR);
  headGroup.add(eyeR);

  // 핑크빛 볼터치 (Blush)
  const blushL = new THREE.Mesh(SHARED_GEO.blush, SHARED_MAT.blush);
  blushL.position.set(-0.25, -0.08, 0.34);
  headGroup.add(blushL);

  const blushR = new THREE.Mesh(SHARED_GEO.blush, SHARED_MAT.blush);
  blushR.position.set(0.25, -0.08, 0.34);
  headGroup.add(blushR);

  // 방긋 웃는 입
  const mouth = new THREE.Mesh(SHARED_GEO.mouth, SHARED_MAT.mouth);
  mouth.rotation.x = Math.PI;
  mouth.position.set(0, -0.15, 0.42);
  headGroup.add(mouth);

  // (3) 팔 & 다리 및 구두
  const armL = new THREE.Mesh(SHARED_GEO.limb, robeMat);
  armL.position.set(-0.36, 0.68, 0);
  root.add(armL);

  const armR = new THREE.Mesh(SHARED_GEO.limb, robeMat);
  armR.position.set(0.36, 0.68, 0);
  root.add(armR);

  const legGroupL = new THREE.Group();
  legGroupL.position.set(-0.14, 0.22, 0);
  const legL = new THREE.Mesh(SHARED_GEO.limb, SHARED_MAT.skin);
  legGroupL.add(legL);
  const shoeL = new THREE.Mesh(SHARED_GEO.shoe, SHARED_MAT.shoe);
  shoeL.position.set(0, -0.16, 0.04);
  legGroupL.add(shoeL);
  root.add(legGroupL);

  const legGroupR = new THREE.Group();
  legGroupR.position.set(0.14, 0.22, 0);
  const legR = new THREE.Mesh(SHARED_GEO.limb, SHARED_MAT.skin);
  legGroupR.add(legR);
  const shoeR = new THREE.Mesh(SHARED_GEO.shoe, SHARED_MAT.shoe);
  shoeR.position.set(0, -0.16, 0.04);
  legGroupR.add(shoeR);
  root.add(legGroupR);

  // (4) 발밑 전용 그림자 데칼 (바닥과 언제나 분리되어 또렷하게 보임)
  const shadowDecal = new THREE.Mesh(SHARED_GEO.shadowDecal, SHARED_MAT.shadow);
  shadowDecal.rotation.x = -Math.PI / 2;
  shadowDecal.position.y = 0.02;
  root.add(shadowDecal);

  // (5) 모자 장식 파츠
  const hatSlot = new THREE.Group();
  headGroup.add(hatSlot);
  applyHatDecoration(hatSlot, hatType);

  // (6) 날개 장식 파츠
  const wingsSlot = new THREE.Group();
  body.add(wingsSlot);
  applyWingsDecoration(wingsSlot, wingsType);

  // (7) 머리 위 3D 캔버스 닉네임 명찰
  const nameTagMesh = createNameTagSprite(name, title, level, isPlayer);
  nameTagMesh.position.y = 2.05;
  root.add(nameTagMesh);

  // (8) 머리 위 말풍선 슬롯
  const bubbleSlot = new THREE.Group();
  bubbleSlot.position.y = 2.55;
  bubbleSlot.visible = false;
  root.add(bubbleSlot);

  root.userData = {
    name,
    title,
    level,
    robeColor,
    hatType,
    wingsType,
    headGroup,
    eyeL,
    eyeR,
    armL,
    armR,
    legGroupL,
    legGroupR,
    hatSlot,
    wingsSlot,
    nameTagMesh,
    bubbleSlot,
    isWalking: false,
    walkSpeed: 7.8,
    isJumping: false,
    jumpVelocity: 0,
    blinkTimer: 2.0 + Math.random() * 3,
    blinkDuration: 0
  };

  return root;
}

function applyHatDecoration(slot, hatType) {
  while (slot.children.length > 0) slot.remove(slot.children[0]);

  if (hatType === 'camellia') {
    const flower = new THREE.Mesh(SHARED_GEO.camelliaFlower, SHARED_MAT.camellia);
    flower.position.set(0.26, 0.38, 0.18);
    slot.add(flower);
    const center = new THREE.Mesh(SHARED_GEO.camelliaCenter, SHARED_MAT.gold);
    center.position.set(0.26, 0.40, 0.20);
    slot.add(center);
  } else if (hatType === 'seagull') {
    const seagullHat = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    seagullHat.position.set(0, 0.48, 0);
    seagullHat.rotation.x = Math.PI / 4;
    slot.add(seagullHat);
  } else if (hatType === 'halo') {
    const halo = new THREE.Mesh(SHARED_GEO.halo, SHARED_MAT.halo);
    halo.position.set(0, 0.58, 0);
    halo.rotation.x = Math.PI / 2;
    slot.add(halo);
  } else if (hatType === 'headset') {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 8, 16, Math.PI), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    band.position.set(0, 0.1, 0);
    slot.add(band);
    const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 10), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    earL.position.set(-0.42, 0.06, 0);
    earL.rotation.z = Math.PI / 2;
    slot.add(earL);
  }
}

function applyWingsDecoration(slot, wingsType) {
  while (slot.children.length > 0) slot.remove(slot.children[0]);

  if (wingsType === 'seagull' || wingsType === 'angel') {
    const lWing = new THREE.Mesh(SHARED_GEO.wing, SHARED_MAT.wing);
    lWing.position.set(-0.38, 0.1, -0.24);
    lWing.rotation.y = -0.35;
    slot.add(lWing);

    const rWing = new THREE.Mesh(SHARED_GEO.wing, SHARED_MAT.wing);
    rWing.position.set(0.38, 0.1, -0.24);
    rWing.rotation.y = 0.35;
    slot.add(rWing);

    slot.userData.lWing = lWing;
    slot.userData.rWing = rWing;
  }
}

function createNameTagSprite(name, title, level, isMe = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isMe ? 'rgba(2, 132, 199, 0.95)' : 'rgba(15, 23, 42, 0.9)';
  ctx.roundRect(10, 10, 364, 76, 20);
  ctx.fill();

  ctx.strokeStyle = isMe ? '#f59e0b' : '#38bdf8';
  ctx.lineWidth = 4;
  ctx.roundRect(10, 10, 364, 76, 20);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 22px "Noto Sans KR", sans-serif';
  ctx.fillText(`Lv.${level} ${title}`, 192, 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Noto Sans KR", sans-serif';
  ctx.fillText(name, 192, 70);

  const tex = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(2.4, 0.6, 1.0);
  return sprite;
}

function createLocalPlayer() {
  localPlayer = createCuteCitizenMesh({
    name: STATE.playerName,
    title: STATE.playerTitle,
    level: STATE.playerLevel,
    robeColor: STATE.robeColor,
    hatType: STATE.hatType,
    wingsType: STATE.wingsType,
    isPlayer: true
  });
  localPlayer.position.set(0, 0, 38);
  scene.add(localPlayer);
}

// ========================================================
// 7. 충돌 판정 및 다층 계단/슬로프 물리 엔진 (가즈아교 계승)
// ========================================================
function getBusanCityHallFloorY(x, z) {
  // 1. 2층 행복민원실 (Z: -38 to -82, X: -40 to 40)
  if (x >= -40 && x <= 40 && z <= -38.0 && z >= -82.0) {
    return 5.0;
  }

  // 2. 1F -> 2F 중앙 그랜드 계단/에스컬레이터 (Z: -22 to -38, X: -6.5 to 6.5)
  if (x >= -6.5 && x <= 6.5 && z < -22.0 && z > -38.0) {
    const progress = (-z - 22.0) / 16.0;
    return 5.0 * Math.max(0, Math.min(1, progress));
  }

  // 3. 시민광장 닻 조형물 단상 (Z: 23.5 to 28.5, X: -2.5 to 2.5)
  if (x >= -2.5 && x <= 2.5 && z >= 23.5 && z <= 28.5) {
    return 1.0;
  }

  // 4. 녹음광장 야외공연장 관람석 스텝
  if (x >= -46 && x <= -20 && z >= 52 && z <= 68) {
    const d = Math.hypot(x - (-33), z - 60);
    if (d > 4.5 && d <= 7.0) return 0.5;
    if (d > 7.0 && d <= 10.0) return 1.0;
    if (d > 10.0 && d <= 13.5) return 1.5;
  }

  // 5. 잔디광장 발언대 단상
  if (x >= 31 && x <= 35 && z >= 58 && z <= 62) {
    return 0.8;
  }

  return 0.0;
}

function resolveObstacleCollision(currX, currZ, nextX, nextZ, footY) {
  let resX = nextX;
  let resZ = nextZ;
  const radius = 0.42;

  if (resX < -50) resX = -50;
  if (resX > 50) resX = 50;
  if (resZ > 72) resZ = 72;
  if (resZ < -80) resZ = -80;

  for (const obs of busanCityHallObstacles) {
    if (obs.type === 'box') {
      const halfW = obs.w / 2;
      const halfD = obs.d / 2;
      const minX = obs.x - halfW - radius;
      const maxX = obs.x + halfW + radius;
      const minZ = obs.z - halfD - radius;
      const maxZ = obs.z + halfD + radius;

      if (resX >= minX && resX <= maxX && resZ >= minZ && resZ <= maxZ) {
        if (footY >= obs.h - 0.2) continue;
        const overlapL = resX - minX;
        const overlapR = maxX - resX;
        const overlapB = resZ - minZ;
        const overlapF = maxZ - resZ;
        const minO = Math.min(overlapL, overlapR, overlapB, overlapF);

        if (minO === overlapL) resX = minX;
        else if (minO === overlapR) resX = maxX;
        else if (minO === overlapB) resZ = minZ;
        else resZ = maxZ;
      }
    } else if (obs.type === 'cyl') {
      const dx = resX - obs.x;
      const dz = resZ - obs.z;
      const dist = Math.hypot(dx, dz);
      const minDist = obs.r + radius;

      if (dist < minDist) {
        if (footY >= obs.h - 0.2) continue;
        const angle = Math.atan2(dz, dx);
        resX = obs.x + Math.cos(angle) * minDist;
        resZ = obs.z + Math.sin(angle) * minDist;
      }
    }
  }

  return { x: resX, z: resZ };
}

// ========================================================
// 8. 이동 컨트롤 & 3인칭 스마트 카메라 추적 (미끄러짐 제로)
// ========================================================
function setupMovementControls() {
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') STATE.keys.w = true;
    if (k === 's' || k === 'arrowdown') STATE.keys.s = true;
    if (k === 'a' || k === 'arrowleft') STATE.keys.a = true;
    if (k === 'd' || k === 'arrowright') STATE.keys.d = true;
    if (e.code === 'Space') {
      e.preventDefault();
      triggerPlayerJump();
    }
    if (k === 'e') {
      triggerProximityAction();
    }
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') STATE.keys.w = false;
    if (k === 's' || k === 'arrowdown') STATE.keys.s = false;
    if (k === 'a' || k === 'arrowleft') STATE.keys.a = false;
    if (k === 'd' || k === 'arrowright') STATE.keys.d = false;
  });

  // 바닥 클릭 이동
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.top-nav, .event-sidebar, .middle-area, .toolbar-container, .modal-overlay, .virtual-joystick')) {
      return;
    }
    if (e.button !== 0) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (const hit of intersects) {
      if (hit.point && Math.abs(hit.point.y) < 6.0) {
        STATE.clickTargetPos = new THREE.Vector3(hit.point.x, hit.point.y, hit.point.z);
        if (clickMarkerMesh) {
          clickMarkerMesh.position.set(hit.point.x, hit.point.y + 0.05, hit.point.z);
          clickMarkerMesh.visible = true;
        }
        break;
      }
    }
  });
}

function setupClickMarker() {
  const markerGeo = new THREE.RingGeometry(0.3, 0.45, 18);
  const markerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
  clickMarkerMesh = new THREE.Mesh(markerGeo, markerMat);
  clickMarkerMesh.rotation.x = -Math.PI / 2;
  clickMarkerMesh.visible = false;
  scene.add(clickMarkerMesh);
}

function triggerPlayerJump() {
  if (!localPlayer) return;
  const ud = localPlayer.userData;
  if (!ud.isJumping) {
    ud.isJumping = true;
    ud.jumpVelocity = 8.8;
    if (window.busanAudio) window.busanAudio.playJump();
  }
}

function setupVirtualJoystick() {
  const container = document.getElementById('virtualJoystickContainer');
  const knob = document.getElementById('joystickKnob');
  if (!container || !knob) return;

  let activeTouchId = null;
  const maxRadius = 36;

  function updateKnob(clientX, clientY) {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    STATE.joystickDir.x = dx / maxRadius;
    STATE.joystickDir.y = -dy / maxRadius;
  }

  function resetKnob() {
    activeTouchId = null;
    knob.style.transform = 'translate(0px, 0px)';
    STATE.joystickDir.x = 0;
    STATE.joystickDir.y = 0;
  }

  container.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    activeTouchId = t.identifier;
    updateKnob(t.clientX, t.clientY);
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (activeTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId) {
        updateKnob(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    if (activeTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId) {
        resetKnob();
        break;
      }
    }
  });
}

function updatePlayerMovement(dt) {
  if (!localPlayer) return;
  const ud = localPlayer.userData;
  const curPos = localPlayer.position;

  const moveDir = new THREE.Vector3();
  let isMoving = false;

  if (camera) {
    const camFwd = new THREE.Vector3();
    camera.getWorldDirection(camFwd);
    camFwd.y = 0;
    camFwd.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camFwd, new THREE.Vector3(0, 1, 0)).normalize();

    if (STATE.keys.w) moveDir.add(camFwd);
    if (STATE.keys.s) moveDir.sub(camFwd);
    if (STATE.keys.a) moveDir.sub(camRight);
    if (STATE.keys.d) moveDir.add(camRight);

    if (Math.abs(STATE.joystickDir.x) > 0.05 || Math.abs(STATE.joystickDir.y) > 0.05) {
      moveDir.addScaledVector(camFwd, STATE.joystickDir.y);
      moveDir.addScaledVector(camRight, STATE.joystickDir.x);
    }
  }

  let nextX = curPos.x;
  let nextZ = curPos.z;

  if (moveDir.lengthSq() > 0.001) {
    moveDir.normalize();
    isMoving = true;
    STATE.clickTargetPos = null;
    if (clickMarkerMesh) clickMarkerMesh.visible = false;

    const targetAngle = Math.atan2(moveDir.x, moveDir.z);
    let diff = targetAngle - localPlayer.rotation.y;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    localPlayer.rotation.y += diff * Math.min(1, dt * 14);

    const step = ud.walkSpeed * dt;
    nextX += moveDir.x * step;
    nextZ += moveDir.z * step;
  } else if (STATE.clickTargetPos) {
    const toTarget = new THREE.Vector3().subVectors(STATE.clickTargetPos, curPos);
    toTarget.y = 0;
    const dist = toTarget.length();

    if (dist > 0.4) {
      toTarget.normalize();
      isMoving = true;

      const targetAngle = Math.atan2(toTarget.x, toTarget.z);
      let diff = targetAngle - localPlayer.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      localPlayer.rotation.y += diff * Math.min(1, dt * 14);

      const step = Math.min(dist, ud.walkSpeed * dt);
      nextX += toTarget.x * step;
      nextZ += toTarget.z * step;
    } else {
      STATE.clickTargetPos = null;
      if (clickMarkerMesh) clickMarkerMesh.visible = false;
    }
  }

  const resolved = resolveObstacleCollision(curPos.x, curPos.z, nextX, nextZ, curPos.y);
  curPos.x = resolved.x;
  curPos.z = resolved.z;

  const targetFloorY = getBusanCityHallFloorY(curPos.x, curPos.z);

  if (ud.isJumping) {
    ud.jumpVelocity -= 22 * dt;
    curPos.y += ud.jumpVelocity * dt;
    if (curPos.y <= targetFloorY) {
      curPos.y = targetFloorY;
      ud.isJumping = false;
      ud.jumpVelocity = 0;
    }
  } else {
    if (Math.abs(curPos.y - targetFloorY) < 0.25) {
      curPos.y = targetFloorY;
    } else if (curPos.y > targetFloorY) {
      curPos.y = Math.max(targetFloorY, curPos.y - 12 * dt);
    } else {
      curPos.y = Math.min(targetFloorY, curPos.y + 12 * dt);
    }
  }

  ud.isWalking = isMoving;

  // 3인칭 스마트 카메라 추적 (타겟과 카메라 일체 이동으로 시점 미끄러짐 원천 차단)
  if (controls && isMoving) {
    const curTarget = controls.target.clone();
    const newTarget = new THREE.Vector3(curPos.x, curPos.y + 1.4, curPos.z);
    const targetDelta = new THREE.Vector3().subVectors(newTarget, curTarget);

    controls.target.addScaledVector(targetDelta, Math.min(1, dt * 8));
    camera.position.addScaledVector(targetDelta, Math.min(1, dt * 8));
  }

  // 멀티플레이 위치 패킷 전송
  const now = performance.now();
  if ((isMoving || ud.isJumping) && STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    if (now - STATE.lastMoveSend > 65) {
      STATE.lastMoveSend = now;
      STATE.ws.send(JSON.stringify({
        type: 'move',
        x: Math.round(curPos.x * 100) / 100,
        y: Math.round(curPos.y * 100) / 100,
        z: Math.round(curPos.z * 100) / 100,
        ry: Math.round(localPlayer.rotation.y * 100) / 100,
        jump: ud.isJumping
      }));
    }
  }

  checkProximityInteractions();
}

function updateCuteCitizenAnimation(c, dt, t) {
  const ud = c.userData;
  if (!ud) return;

  // 1. 깜찍한 눈 깜빡임
  if (ud.eyeL && ud.eyeR) {
    ud.blinkTimer -= dt;
    if (ud.blinkTimer <= 0) {
      ud.blinkDuration = 0.14;
      ud.blinkTimer = 2.5 + Math.random() * 3.5;
    }
    if (ud.blinkDuration > 0) {
      ud.blinkDuration -= dt;
      ud.eyeL.scale.y = 0.12;
      ud.eyeR.scale.y = 0.12;
    } else {
      ud.eyeL.scale.y = 1.0;
      ud.eyeR.scale.y = 1.0;
    }
  }

  // 2. 걷기 시 팔다리 스윙 및 통통 바운스
  if (ud.isWalking) {
    const swing = Math.sin(t * 11) * 0.55;
    if (ud.armL) ud.armL.rotation.x = swing;
    if (ud.armR) ud.armR.rotation.x = -swing;
    if (ud.legGroupL) ud.legGroupL.rotation.x = -swing * 0.9;
    if (ud.legGroupR) ud.legGroupR.rotation.x = swing * 0.9;
    if (ud.headGroup) ud.headGroup.position.y = 1.22 + Math.abs(Math.sin(t * 11)) * 0.05;
  } else {
    if (ud.armL) ud.armL.rotation.x = Math.sin(t * 2.5) * 0.08;
    if (ud.armR) ud.armR.rotation.x = -Math.sin(t * 2.5) * 0.08;
    if (ud.legGroupL) ud.legGroupL.rotation.x = 0;
    if (ud.legGroupR) ud.legGroupR.rotation.x = 0;
    if (ud.headGroup) ud.headGroup.position.y = 1.22 + Math.sin(t * 3.0) * 0.02;
  }

  // 3. 날개 펄럭임
  if (ud.wingsSlot && ud.wingsSlot.userData.lWing) {
    const flapSpeed = ud.isJumping ? 24 : ud.isWalking ? 14 : 5;
    const flapAmp = ud.isJumping ? 0.6 : ud.isWalking ? 0.35 : 0.15;
    const flap = Math.sin(t * flapSpeed) * flapAmp;
    ud.wingsSlot.userData.lWing.rotation.y = -0.35 + flap;
    ud.wingsSlot.userData.rWing.rotation.y = 0.35 - flap;
  }
}

// ========================================================
// 9. 렌더 루프 및 파티클 / 동적 환경 업데이트
// ========================================================
function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.1);
  const t = clock.getElapsedTime();

  updatePlayerMovement(dt);

  if (localPlayer) {
    updateCuteCitizenAnimation(localPlayer, dt, t);
  }
  for (const id in STATE.peers) {
    const peer = STATE.peers[id];
    if (peer.mesh) {
      peer.mesh.position.lerp(peer.targetPos, 0.25);
      peer.mesh.rotation.y = THREE.MathUtils.lerp(peer.mesh.rotation.y, peer.targetRotY, 0.25);
      updateCuteCitizenAnimation(peer.mesh, dt, t);
    }
  }

  fountainParticles.forEach(p => {
    p.position.y = p.userData.baseY + Math.sin(t * p.userData.speed + p.userData.phase) * 1.6 + 1.2;
  });

  if (lighthouseBeamMesh) {
    lighthouseBeamMesh.rotation.z = t * 1.5;
  }

  fallingPetals.forEach(p => {
    p.position.y -= p.userData.vy;
    p.rotation.z += p.userData.rotSpeed;
    if (p.position.y < 0.1) {
      p.position.y = 4.5 + Math.random() * 2.0;
    }
  });

  seagulls.forEach(s => {
    s.userData.angle += s.userData.speed;
    s.position.x = Math.cos(s.userData.angle) * s.userData.radius;
    s.position.z = 30 + Math.sin(s.userData.angle) * s.userData.radius;
    s.rotation.y = -s.userData.angle + Math.PI / 2;

    const wingFlap = Math.sin(t * 8) * 0.45;
    s.userData.lWing.rotation.z = wingFlap;
    s.userData.rWing.rotation.z = -wingFlap;
  });

  controls.update();
  renderer.render(scene, camera);
}

// ========================================================
// 10. 근접 상호작용
// ========================================================
function registerInteractiveObject(obj) {
  interactiveObjects.push(obj);
}

function checkProximityInteractions() {
  if (!localPlayer) return;
  const p = localPlayer.position;
  let nearest = null;
  let minDist = Infinity;

  for (const obj of interactiveObjects) {
    const dist = Math.hypot(p.x - obj.pos.x, p.z - obj.pos.z);
    if (dist <= obj.radius && dist < minDist) {
      minDist = dist;
      nearest = obj;
    }
  }

  const promptEl = document.getElementById('interact-prompt');
  const promptText = document.getElementById('prompt-text');

  if (nearest) {
    STATE.interactionTarget = nearest;
    if (promptEl) promptEl.classList.add('visible');
    if (promptText) promptText.innerText = nearest.prompt;
  } else {
    STATE.interactionTarget = null;
    if (promptEl) promptEl.classList.remove('visible');
  }
}

function triggerProximityAction() {
  if (STATE.interactionTarget && typeof STATE.interactionTarget.action === 'function') {
    STATE.interactionTarget.action();
  }
}

function showSpeechBubble(characterMesh, text) {
  if (!characterMesh || !characterMesh.userData.bubbleSlot) return;
  const slot = characterMesh.userData.bubbleSlot;

  while (slot.children.length > 0) slot.remove(slot.children[0]);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.roundRect(10, 10, 492, 140, 24);
  ctx.fill();

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 6;
  ctx.roundRect(10, 10, 492, 140, 24);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (text.length > 18) {
    const line1 = text.substring(0, 18);
    const line2 = text.substring(18, 36);
    ctx.fillText(line1, 256, 55);
    ctx.fillText(line2, 256, 105);
  } else {
    ctx.fillText(text, 256, 80);
  }

  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(3.8, 1.2, 1.0);
  slot.add(sprite);
  slot.visible = true;

  setTimeout(() => {
    slot.visible = false;
  }, 4500);
}

// ========================================================
// 11. WebSocket 실시간 멀티플레이 연동 (상호 완벽 동기화 보장)
// ========================================================
async function connectMultiplayerWebSocket() {
  const hostUrl = await autoDiscoverHostServer();
  const isSecure = window.location.protocol === 'https:' || hostUrl.includes('trycloudflare.com') || hostUrl.startsWith('https:');
  const cleanHost = hostUrl.replace(/^https?:\/\//i, '').replace(/^wss?:\/\//i, '').replace(/\/+$/, '');
  const wsUrl = `${isSecure ? 'wss:' : 'ws:'}//${cleanHost}/ws`;

  console.log(`[부산ON] WebSocket 연결 시도: ${wsUrl}`);
  try {
    if (STATE.ws) {
      try { STATE.ws.close(); } catch {}
    }

    STATE.ws = new WebSocket(wsUrl);

    STATE.ws.onopen = () => {
      console.log("[부산ON] WebSocket 서버 연결 성공!");
      updateServerStatusUI(true, "글로벌 인터넷 연결됨 (부산ON)");

      const px = localPlayer ? localPlayer.position.x : 0;
      const py = localPlayer ? localPlayer.position.y : 0;
      const pz = localPlayer ? localPlayer.position.z : 38;

      // 룸 참가 패킷 즉각 전송
      STATE.ws.send(JSON.stringify({
        type: 'join',
        room: STATE.currentRoom,
        name: STATE.playerName,
        title: STATE.playerTitle,
        level: STATE.playerLevel,
        robe: STATE.robeColor,
        hat: STATE.hatType,
        wings: STATE.wingsType,
        x: px,
        y: py,
        z: pz
      }));
    };

    STATE.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleServerMessage(msg);
      } catch (err) {
        console.warn("[부산ON] 메시지 파싱 오류:", err);
      }
    };

    STATE.ws.onclose = () => {
      console.log("[부산ON] 서버 연결 종료. 3초 후 재연결 시도...");
      updateServerStatusUI(false, "재연결 시도 중...");
      setTimeout(connectMultiplayerWebSocket, 3000);
    };

    STATE.ws.onerror = (e) => {
      console.warn("[부산ON] WebSocket 에러:", e);
    };
  } catch (err) {
    console.warn("[부산ON] 소켓 연결 실패:", err);
    setTimeout(connectMultiplayerWebSocket, 4000);
  }
}

function handleServerMessage(msg) {
  const mtype = msg.type;

  // 1. 환영 패킷 (기존 접속 피어들 일괄 생성)
  if (mtype === 'welcome' || mtype === 'join_ack') {
    const peerList = msg.peers || [];
    if (Array.isArray(peerList)) {
      peerList.forEach(p => {
        if (p && p.id) addRemotePeer(p.id, p);
      });
    } else if (typeof peerList === 'object') {
      for (const pid in peerList) {
        if (peerList[pid]) addRemotePeer(pid, peerList[pid]);
      }
    }
    updateOnlineCount(msg.count || 1);
  }
  // 2. 새로운 다른 시민 입장
  else if (mtype === 'peer_join') {
    const info = msg.peer || msg.info || msg;
    const pid = msg.id || info.id;
    if (pid) {
      addRemotePeer(pid, info);
    }
    updateOnlineCount(msg.count);
    addTestimonyItem(`[시민 입장]`, `${info.name || '시민'}님이 시청 광장에 도착했습니다.`);
  }
  // 3. 시민 퇴장
  else if (mtype === 'peer_leave') {
    removeRemotePeer(msg.id);
    updateOnlineCount(msg.count);
  }
  // 4. 시민 이동 동기화
  else if (mtype === 'peer_move') {
    const peer = STATE.peers[msg.id];
    if (peer) {
      peer.targetPos.set(msg.x, msg.y, msg.z);
      peer.targetRotY = msg.ry;
      peer.mesh.userData.isJumping = !!msg.jump;
      peer.mesh.userData.isWalking = true;
    }
  }
  // 5. 채팅 동기화
  else if (mtype === 'peer_chat') {
    addTestimonyItem(msg.name, msg.text);
    const peer = STATE.peers[msg.id];
    if (peer) {
      showSpeechBubble(peer.mesh, msg.text);
    }
  }
  // 6. 시민 발언대 외치기
  else if (mtype === 'podium_broadcast') {
    showPodiumBanner(msg.name, msg.text);
    addTestimonyItem(`[📢 발언대] ${msg.name}`, msg.text);
    if (window.busanAudio) window.busanAudio.playMegaphoneSound();
  }
}

function addRemotePeer(id, info) {
  if (STATE.peers[id]) return;

  const mesh = createCuteCitizenMesh({
    name: info.name || "시민",
    title: info.title || "열린시민",
    level: info.level || 1,
    robeColor: info.robe || "blue",
    hatType: info.hat || "camellia",
    wingsType: info.wings || "seagull"
  });
  mesh.position.set(info.x || 0, info.y || 0, info.z || 30);
  mesh.rotation.y = info.ry || 0;
  scene.add(mesh);

  STATE.peers[id] = {
    mesh,
    info,
    targetPos: mesh.position.clone(),
    targetRotY: mesh.rotation.y
  };
  console.log(`[부산ON] 원격 동료 시민 스폰 완료: ${info.name} (${id})`);
}

function removeRemotePeer(id) {
  if (STATE.peers[id]) {
    scene.remove(STATE.peers[id].mesh);
    delete STATE.peers[id];
  }
}

function updateOnlineCount(count) {
  STATE.onlineCount = count || 1;
  const countEl = document.getElementById('cultistCount');
  if (countEl) countEl.innerText = STATE.onlineCount;
}

// ========================================================
// 12. 제스처, 시민 발언대 외치기 & 실시간 채팅 피드
// ========================================================
function performGesture(type) {
  if (!localPlayer) return;
  if (type === 'wave') {
    showSpeechBubble(localPlayer, "👋 부산시민 여러분, 반갑습니다!");
    if (window.busanAudio) window.busanAudio.playClick();
  } else if (type === 'clap') {
    showSpeechBubble(localPlayer, "👏 짝짝짝! 부산 시정 파이팅!");
    if (window.busanAudio) window.busanAudio.playApplause();
  } else if (type === 'cheer') {
    showSpeechBubble(localPlayer, "🙌 와아! 더 살기 좋은 부산을 만듭시다!");
    if (window.busanAudio) window.busanAudio.playApplause();
  } else if (type === 'dance') {
    showSpeechBubble(localPlayer, "💃 즐거운 댄스타임! 모두 함께해요!");
    if (window.busanAudio) window.busanAudio.playClick();
  }

  if (STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    STATE.ws.send(JSON.stringify({
      type: 'action',
      act: type,
      text: type
    }));
  }
}

function submitQuickCitizenVoice() {
  const input = document.getElementById('testimonyInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  addTestimonyItem(`[${STATE.playerName}]`, text);
  showSpeechBubble(localPlayer, text);

  if (STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    STATE.ws.send(JSON.stringify({
      type: 'chat',
      name: STATE.playerName,
      title: STATE.playerTitle,
      text: text,
      scope: 'all'
    }));
  }

  input.value = '';
  addCitizenExp(25);
}

function addTestimonyItem(author, text) {
  const feed = document.getElementById('testimonyFeed');
  if (!feed) return;

  const item = document.createElement('div');
  item.className = 'testimony-item';
  item.innerHTML = `<span class="testimony-author">${author}</span><span>${escapeHtml(text)}</span>`;
  feed.appendChild(item);

  feed.scrollTop = feed.scrollHeight;
  while (feed.children.length > 50) {
    feed.removeChild(feed.firstChild);
  }

  const fullList = document.getElementById('fullChatHistoryList');
  if (fullList) {
    const fullItem = document.createElement('div');
    fullItem.className = 'full-chat-item';
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    fullItem.innerHTML = `<span class="full-chat-time">${timeStr}</span><span class="full-chat-author">${author}:</span><span>${escapeHtml(text)}</span>`;
    fullList.appendChild(fullItem);
  }
}

function openPodiumPrompt() {
  openModal('modal-podium-shout');
}

function submitPodiumShout() {
  const input = document.getElementById('podium-input-text');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  closeModal('modal-podium-shout');
  showPodiumBanner(STATE.playerName, text);

  if (STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    STATE.ws.send(JSON.stringify({
      type: 'shout_podium',
      name: STATE.playerName,
      text: text
    }));
  }

  if (window.busanAudio) window.busanAudio.playMegaphoneSound();
  input.value = '';
  addCitizenExp(80);
}

function showPodiumBanner(author, text) {
  const banner = document.getElementById('podium-banner');
  const authorEl = document.getElementById('podium-author');
  const textEl = document.getElementById('podium-text');
  if (!banner) return;

  if (authorEl) authorEl.innerText = `📢 시민 발언대 외침 (${author})`;
  if (textEl) textEl.innerText = text;

  banner.classList.add('visible');
  setTimeout(() => {
    banner.classList.remove('visible');
  }, 6000);
}

// ========================================================
// 13. 게이미피케이션 & 시민 등급 레벨업 시스템
// ========================================================
const CITIZEN_RANKS = [
  { level: 1, title: "첫 방문 시민", minExp: 0 },
  { level: 2, title: "골목 탐험가", minExp: 100 },
  { level: 3, title: "시정 참여자", minExp: 250 },
  { level: 4, title: "소통의 달인", minExp: 450 },
  { level: 5, title: "열린 부산시민", minExp: 700 },
  { level: 6, title: "시정 모니터요원", minExp: 1050 },
  { level: 7, title: "광장 연설가", minExp: 1500 },
  { level: 8, title: "정책 제안 마스터", minExp: 2100 },
  { level: 9, title: "16구군 대사", minExp: 2800 },
  { level: 10, title: "명예 부산시장", minExp: 3800 }
];

function addCitizenExp(amount) {
  STATE.playerExp += amount;
  let curRank = CITIZEN_RANKS[0];
  for (let i = CITIZEN_RANKS.length - 1; i >= 0; i--) {
    if (STATE.playerExp >= CITIZEN_RANKS[i].minExp) {
      curRank = CITIZEN_RANKS[i];
      break;
    }
  }

  if (curRank.level > STATE.playerLevel) {
    STATE.playerLevel = curRank.level;
    STATE.playerTitle = curRank.title;
    showLevelUpCelebration(STATE.playerLevel, STATE.playerTitle);
  }

  updatePlayerBadgeUI();
}

function updatePlayerBadgeUI() {
  const badge = document.getElementById('player-rank-badge');
  const titleTxt = document.getElementById('player-title-text');
  const fill = document.getElementById('player-xp-fill');

  if (badge) badge.innerText = `시민 Lv.${STATE.playerLevel}`;
  if (titleTxt) titleTxt.innerText = `[${STATE.playerTitle}] ${STATE.playerName}`;

  const nextRank = CITIZEN_RANKS.find(r => r.level === STATE.playerLevel + 1);
  if (fill && nextRank) {
    const curMin = CITIZEN_RANKS.find(r => r.level === STATE.playerLevel).minExp;
    const pct = Math.min(100, Math.max(10, ((STATE.playerExp - curMin) / (nextRank.minExp - curMin)) * 100));
    fill.style.width = `${pct}%`;
  }
}

function showLevelUpCelebration(level, title) {
  if (window.busanAudio) window.busanAudio.playLevelUp();
  showSpeechBubble(localPlayer, `🎉 축하합니다! 시민 등급이 [Lv.${level} ${title}](으)로 승급했습니다!`);
}

function collectStamp(id, name) {
  if (STATE.stamps[id]) return;
  STATE.stamps[id] = true;
  addCitizenExp(100);
}

// ========================================================
// 14. 2층 행복민원실 순번 대기표 키오스크 시스템
// ========================================================
let ticketSeq = 108;

function openTicketKioskModal() {
  openModal('modal-ticket');
}

function dispenseTicket(serviceName, prefix) {
  ticketSeq++;
  const ticketNo = `${prefix}-${ticketSeq}`;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const card = document.getElementById('issuedTicketCard');
  const timeEl = document.getElementById('ticketIssuedTime');
  const numEl = document.getElementById('ticketNumberDisplay');
  const nameEl = document.getElementById('ticketServiceNameDisplay');
  const waitEl = document.getElementById('ticketWaitInfoDisplay');

  if (card) card.style.display = 'block';
  if (timeEl) timeEl.innerText = timeStr;
  if (numEl) numEl.innerText = ticketNo;
  if (nameEl) nameEl.innerText = serviceName;
  if (waitEl) waitEl.innerText = `내 앞 대기인원: ${Math.floor(Math.random() * 3) + 1}명 | 예상 대기시간: 약 5분`;

  if (window.busanAudio) window.busanAudio.playDingDong();
  showSpeechBubble(localPlayer, `🎫 [${serviceName}] 대기번호 ${ticketNo}번 표를 발급받았습니다!`);
  addCitizenExp(40);
}

// ========================================================
// 15. 부산 시정 상식 퀴즈 룰렛 시스템
// ========================================================
const BUSAN_QUIZZES = [
  {
    q: "부산광역시를 상징하는 시화(市花)는 무엇일까요?",
    options: ["1. 동백꽃", "2. 무궁화", "3. 개나리", "4. 진달래"],
    ans: 0,
    desc: "부산의 시화는 겨울에도 붉게 피어나는 아름다운 '동백꽃'입니다!"
  },
  {
    q: "부산광역시에는 총 몇 개의 자치 구·군이 있을까요?",
    options: ["1. 12개", "2. 14개", "3. 16개 (15구 1군)", "4. 18개"],
    ans: 2,
    desc: "부산광역시는 15개 자치구와 1개 군(기장군)으로 총 16개 구·군으로 이루어져 있습니다."
  },
  {
    q: "부산광역시청 1층 로비에 조성된 어린이 복합문화도서관의 이름은?",
    options: ["1. 누리봄", "2. 들락날락", "3. 도란도란", "4. 다드림"],
    ans: 1,
    desc: "1층 로비의 혁신 복합문화공간은 시민 누구나 편하게 오가는 '들락날락'입니다."
  },
  {
    q: "부산광역시의 대표적인 소통 캐릭터 갈매기 마스코트의 이름은?",
    options: ["1. 부기", "2. 갈매기동자", "3. 끼룩이", "4. 바다돌이"],
    ans: 0,
    desc: "부산의 귀여운 랜드마크 마스코트는 '부기(Boogi)'입니다!"
  },
  {
    q: "부산시민과 함께하는 24시간 전화 행정상담 콜센터 번호는?",
    options: ["1. 110", "2. 120", "3. 128", "4. 1339"],
    ans: 1,
    desc: "부산시정의 모든 궁금증은 국번 없이 '120 부산민원콜센터'에서 안내받으실 수 있습니다."
  }
];

function openQuizModal() {
  STATE.quizIndex = 0;
  renderQuizCard();
  openModal('modal-quiz');
}

function renderQuizCard() {
  const quiz = BUSAN_QUIZZES[STATE.quizIndex % BUSAN_QUIZZES.length];
  const badge = document.getElementById('quizNumberBadge');
  const qText = document.getElementById('quizQuestionText');
  const grid = document.getElementById('quizOptionsGrid');
  const resMsg = document.getElementById('quizResultMsg');

  if (badge) badge.innerText = `문제 ${STATE.quizIndex + 1} / ${BUSAN_QUIZZES.length}`;
  if (qText) qText.innerText = quiz.q;
  if (resMsg) resMsg.style.display = 'none';

  if (grid) {
    grid.innerHTML = '';
    quiz.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn clickable';
      btn.innerText = opt;
      btn.onclick = () => submitQuizAnswer(idx, quiz.ans, quiz.desc);
      grid.appendChild(btn);
    });
  }
}

function submitQuizAnswer(userChoice, correctChoice, desc) {
  const resMsg = document.getElementById('quizResultMsg');
  if (!resMsg) return;

  if (userChoice === correctChoice) {
    resMsg.className = 'quiz-result-msg correct';
    resMsg.innerHTML = `🎉 정답입니다! (+100 EXP)<br><small>${desc}</small>`;
    resMsg.style.display = 'block';
    if (window.busanAudio) window.busanAudio.playLevelUp();
    addCitizenExp(100);

    setTimeout(() => {
      STATE.quizIndex++;
      if (STATE.quizIndex < BUSAN_QUIZZES.length) {
        renderQuizCard();
      } else {
        resMsg.innerHTML = "🏆 모든 퀴즈를 완료하셨습니다! 부산 시정 마스터 배지를 획득하셨습니다!";
      }
    }, 2200);
  } else {
    resMsg.className = 'quiz-result-msg wrong';
    resMsg.innerHTML = `❌ 아쉽습니다! 다시 한 번 생각해보세요.<br><small>${desc}</small>`;
    resMsg.style.display = 'block';
    if (window.busanAudio) window.busanAudio.playClick();
  }
}

// ========================================================
// 16. 모달 및 기존 서비스 (AI, Division, Office, Wall)
// ========================================================
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('visible');
  if (window.busanAudio) window.busanAudio.playClick();
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('visible');
}

function openAiGuideModal() { openModal('modal-ai-guide'); }
function openDivisionModal() { searchDivision(); openModal('modal-division'); }
function openOfficeModal() { searchOffice(); openModal('modal-office'); }
function openWallModal() { loadWallPosts(); openModal('modal-wall'); }
function openDistrictsModal() { loadDistricts(); openModal('modal-districts'); }
function openPhotosModal() { loadPhotos(); openModal('modal-photos'); }
function openStoryModal() { loadStoryActs(); openModal('modal-story'); }
function openCustomizeModal() { openModal('modal-customize'); }
function openNewPostModal() { openModal('modal-new-post'); }
function openFullChatHistoryModal() { openModal('modal-chat-history'); }

function showServerConfigPrompt() {
  const input = document.getElementById('cfg-server-host');
  if (input) input.value = STATE.activeHostUrl || '';
  openModal('modal-server-config');
}

function applyCustomServerHost() {
  const input = document.getElementById('cfg-server-host');
  if (!input) return;
  const val = input.value.trim();
  if (val) {
    localStorage.setItem('busan_custom_host', val);
    STATE.activeHostUrl = val;
    closeModal('modal-server-config');
    connectMultiplayerWebSocket();
  }
}

function resetAutoServerHost() {
  localStorage.removeItem('busan_custom_host');
  closeModal('modal-server-config');
  autoDiscoverHostServer().then(() => connectMultiplayerWebSocket());
}

async function submitAiQuestion() {
  const input = document.getElementById('ai-question-input');
  if (!input) return;
  const q = input.value.trim();
  if (!q) return;

  appendAiBubble('user', q);
  input.value = '';

  const apiUrl = getApiUrl('/api/ai-guide');
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q })
    });
    if (res.ok) {
      const data = await res.json();
      renderAiResponseBubble(data);
    } else {
      appendAiBubble('bot', "현재 안내 서버에 연결할 수 없습니다. 120 콜센터(국번없이 120)로 문의해 주세요.");
    }
  } catch (err) {
    appendAiBubble('bot', "질의응답 서버 연결 중 오류가 발생했습니다.");
  }
}

function askAiQuestion(prompt) {
  const input = document.getElementById('ai-question-input');
  if (input) {
    input.value = prompt;
    submitAiQuestion();
  }
}

function appendAiBubble(sender, text) {
  const hist = document.getElementById('ai-history');
  if (!hist) return;
  const b = document.createElement('div');
  b.className = `ai-bubble ${sender}`;
  b.innerHTML = escapeHtml(text);
  hist.appendChild(b);
  hist.scrollTop = hist.scrollHeight;
}

function renderAiResponseBubble(data) {
  const hist = document.getElementById('ai-history');
  if (!hist) return;
  const b = document.createElement('div');
  b.className = 'ai-bubble bot';
  b.innerHTML = `
    <div class="ai-badge">${escapeHtml(data.character || '다온')}</div>
    <div>${escapeHtml(data.answer)}</div>
    <div style="margin-top: 10px; background: rgba(2, 132, 199, 0.08); padding: 8px 12px; border-radius: 8px; font-size: 12px;">
      <div><strong>담당 관할:</strong> ${escapeHtml(data.authority || '확인 필요')}</div>
      <div><strong>추천 부서:</strong> ${escapeHtml(data.dept_recommend || '-')}</div>
      <div><strong>직통 전화:</strong> <a href="tel:${escapeHtml(data.phone || '120')}" style="color:#0284c7; font-weight:700;">${escapeHtml(data.phone || '120')}</a></div>
    </div>
  `;
  hist.appendChild(b);
  hist.scrollTop = hist.scrollHeight;
  addCitizenExp(50);
}

async function searchDivision() {
  const input = document.getElementById('division-input');
  const kw = input ? input.value.trim() : '';
  const apiUrl = getApiUrl(`/api/division-search?q=${encodeURIComponent(kw)}`);
  try {
    const res = await fetch(apiUrl);
    if (res.ok) {
      const list = await res.json();
      renderDivisionCards(list);
    }
  } catch (err) {
    console.warn("소관부서 검색 실패:", err);
  }
}

function renderDivisionCards(list) {
  const container = document.getElementById('division-results');
  if (!container) return;
  container.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'division-card';
    card.innerHTML = `
      <div class="division-card-header">
        <span class="division-task-name">${escapeHtml(item.task_name)}</span>
        <span class="division-authority-badge ${item.authority === '시청본청' ? 'city' : 'district'}">${escapeHtml(item.authority)}</span>
      </div>
      <div class="division-row"><strong>시청 담당:</strong> ${escapeHtml(item.dept_city)} (${escapeHtml(item.phone_city)})</div>
      <div class="division-row"><strong>구청 담당:</strong> ${escapeHtml(item.dept_district)} (${escapeHtml(item.phone_district)})</div>
      <div class="division-law-box">⚖️ 근거 법령: ${escapeHtml(item.law_basis)}</div>
    `;
    container.appendChild(card);
  });
}

let selectedOfficeFloor = '';

function filterOfficeFloor(fl) {
  selectedOfficeFloor = fl;
  document.querySelectorAll('.floor-chip').forEach(c => c.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
  searchOffice();
}

async function searchOffice() {
  const input = document.getElementById('office-search-input');
  const kw = input ? input.value.trim() : '';
  const apiUrl = getApiUrl(`/api/office-search?floor=${encodeURIComponent(selectedOfficeFloor)}&q=${encodeURIComponent(kw)}`);
  try {
    const res = await fetch(apiUrl);
    if (res.ok) {
      const list = await res.json();
      renderOfficeTable(list);
    }
  } catch (err) {
    console.warn("청사 사무실 검색 실패:", err);
  }
}

function renderOfficeTable(list) {
  const tbody = document.getElementById('office-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  list.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(row.floor)}</strong></td>
      <td>${escapeHtml(row.room)}</td>
      <td style="font-weight:700; color:#0369a1;">${escapeHtml(row.name)}</td>
      <td><a href="tel:${escapeHtml(row.phone)}" style="color:#0284c7; font-weight:700;">${escapeHtml(row.phone)}</a></td>
      <td style="font-size:12px; color:#475569;">${escapeHtml(row.duties)}</td>
    `;
    tbody.appendChild(tr);
  });
}

let currentWallCategory = '전체';

function filterWallCategory(cat) {
  currentWallCategory = cat;
  document.querySelectorAll('.wall-cat-btn').forEach(b => b.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
  loadWallPosts();
}

async function loadWallPosts() {
  const apiUrl = getApiUrl(`/api/wall?cat=${encodeURIComponent(currentWallCategory)}`);
  try {
    const res = await fetch(apiUrl);
    if (res.ok) {
      const posts = await res.json();
      renderWallPosts(posts);
    }
  } catch (err) {
    console.warn("담벼락 로드 실패:", err);
  }
}

function renderWallPosts(posts) {
  const list = document.getElementById('wall-posts-list');
  if (!list) return;
  list.innerHTML = '';
  posts.forEach(p => {
    const item = document.createElement('div');
    item.className = 'wall-post-card';
    item.innerHTML = `
      <div class="wall-post-header">
        <span class="wall-post-cat">${escapeHtml(p.category)}</span>
        <span class="wall-post-district">📍 ${escapeHtml(p.district)}</span>
        <span class="wall-post-author">${escapeHtml(p.author)}</span>
      </div>
      <div class="wall-post-title">${escapeHtml(p.title)}</div>
      <div class="wall-post-content">${escapeHtml(p.content)}</div>
      <div class="wall-post-footer">
        <span class="wall-post-date">${escapeHtml(p.created_at)}</span>
        <button class="wall-like-btn clickable" onclick="likeWallPost('${p.id}')">👍 공감 ${p.likes || 0}</button>
      </div>
    `;
    list.appendChild(item);
  });
}

async function submitNewWallPost() {
  const cat = document.getElementById('post-category').value;
  const dist = document.getElementById('post-district').value;
  const author = document.getElementById('post-author').value.trim() || '익명시민';
  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();

  if (!title || !content) {
    alert("제목과 내용을 입력해 주세요.");
    return;
  }

  const apiUrl = getApiUrl('/api/wall');
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: cat, district: dist, author, title, content })
    });
    if (res.ok) {
      closeModal('modal-new-post');
      loadWallPosts();
      showSpeechBubble(localPlayer, "📝 시민 자유담벼락에 새 의견을 등록했습니다!");
      addCitizenExp(70);
    }
  } catch (err) {
    alert("담벼락 등록 중 오류가 발생했습니다.");
  }
}

async function loadDistricts() {
  const apiUrl = getApiUrl('/api/districts');
  try {
    const res = await fetch(apiUrl);
    if (res.ok) {
      const districts = await res.json();
      const grid = document.getElementById('districts-grid');
      if (!grid) return;
      grid.innerHTML = '';
      districts.forEach(d => {
        const card = document.createElement('div');
        card.className = 'district-portal-card clickable';
        card.onclick = () => {
          switchRealm(d.code);
          closeModal('modal-districts');
        };
        card.innerHTML = `
          <div class="district-badge-circle">${escapeHtml(d.badge)}</div>
          <div class="district-name">${escapeHtml(d.name)}</div>
          <div class="district-feature">${escapeHtml(d.feature)}</div>
          <div style="font-size:11px; color:#0284c7; font-weight:700; margin-top:6px;">클릭하여 구청 월드 접속 →</div>
        `;
        grid.appendChild(card);
      });
    }
  } catch (err) {
    console.warn("구군 디오라마 로드 실패:", err);
  }
}

async function loadPhotos() {
  const apiUrl = getApiUrl('/api/busan-photos');
  try {
    const res = await fetch(apiUrl);
    if (res.ok) {
      const photos = await res.json();
      const grid = document.getElementById('photo-gallery-grid');
      if (!grid) return;
      grid.innerHTML = '';
      photos.forEach(p => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `
          <div class="photo-mockup">${escapeHtml(p.category)}</div>
          <div class="photo-card-body">
            <div class="photo-card-title">${escapeHtml(p.title)}</div>
            <div class="photo-card-desc">${escapeHtml(p.desc)}</div>
          </div>
        `;
        grid.appendChild(card);
      });
    }
  } catch (err) {
    console.warn("사진 로드 실패:", err);
  }
}

function loadStoryActs() {
  const acts = [
    { act: "ACT 1", name: "첫 만남의 광장", desc: "시민광장의 '부산의 닻' 조형물과 등대광장을 방문해 첫 스탬프를 획득하세요.", done: STATE.stamps.anchor && STATE.stamps.lighthouse },
    { act: "ACT 2", name: "들락날락 지혜의 숲", desc: "1층 로비의 들락날락에 방문하고 AI 다온에게 첫 행정 질문을 남겨보세요.", done: STATE.stamps.lobby },
    { act: "ACT 3", name: "행복민원실의 온기", desc: "2층 행복민원실에 올라가 여권창구와 120콜센터 부스를 둘러보세요.", done: STATE.stamps.civil },
    { act: "ACT 4", name: "시민의 목소리", desc: "시민 자유담벼락에 첫 글을 작성하거나 발언대에서 힘차게 의견을 외쳐보세요.", done: STATE.playerExp >= 200 },
    { act: "ACT 5", name: "16개 구·군으로 펼쳐지는 부산", desc: "부산미래도시관에서 16개 구·군 지도를 확인하고 다른 구청 월드로 여행해 보세요.", done: STATE.playerLevel >= 3 }
  ];

  const list = document.getElementById('story-acts-list');
  if (!list) return;
  list.innerHTML = '';
  acts.forEach(a => {
    const card = document.createElement('div');
    card.className = 'division-card';
    card.innerHTML = `
      <div class="division-card-header">
        <span class="division-task-name">${a.act}. ${a.name}</span>
        <span class="division-authority-badge ${a.done ? 'city' : 'district'}">${a.done ? '완료 ✓' : '진행 중'}</span>
      </div>
      <div class="division-row">${a.desc}</div>
    `;
    list.appendChild(card);
  });
}

function saveCustomization() {
  const nameInput = document.getElementById('custom-name');
  const robeSelect = document.getElementById('custom-robe');
  const hatSelect = document.getElementById('custom-hat');
  const wingsSelect = document.getElementById('custom-wings');

  if (nameInput && nameInput.value.trim()) {
    STATE.playerName = nameInput.value.trim();
  }
  if (robeSelect) STATE.robeColor = robeSelect.value;
  if (hatSelect) STATE.hatType = hatSelect.value;
  if (wingsSelect) STATE.wingsType = wingsSelect.value;

  closeModal('modal-customize');

  if (localPlayer) {
    const pos = localPlayer.position.clone();
    const rotY = localPlayer.rotation.y;
    scene.remove(localPlayer);
    createLocalPlayer();
    localPlayer.position.copy(pos);
    localPlayer.rotation.y = rotY;
  }
  updatePlayerBadgeUI();

  if (STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    STATE.ws.send(JSON.stringify({
      type: 'update_look',
      name: STATE.playerName,
      robe: STATE.robeColor,
      hat: STATE.hatType,
      wings: STATE.wingsType
    }));
  }
}

function switchRealm(realmCode) {
  STATE.currentRoom = realmCode;
  const sel = document.getElementById('realm-select');
  if (sel) sel.value = realmCode;

  if (STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    STATE.ws.send(JSON.stringify({
      type: 'join',
      room: realmCode,
      name: STATE.playerName,
      title: STATE.playerTitle,
      level: STATE.playerLevel,
      x: localPlayer ? localPlayer.position.x : 0,
      y: localPlayer ? localPlayer.position.y : 0,
      z: localPlayer ? localPlayer.position.z : 38
    }));
  }

  showSpeechBubble(localPlayer, `🚀 [${realmCode}] 룸 채널로 이동했습니다!`);
}

function toggleAudio() {
  if (window.busanAudio) {
    const on = window.busanAudio.toggleBgm();
    const btn = document.getElementById('bgm-toggle-btn');
    if (btn) btn.style.color = on ? '#0284c7' : '#94a3b8';
  }
}

function setupResizeHandler() {
  window.addEventListener('resize', () => {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

// ========================================================
// 17. 진입점
// ========================================================
window.addEventListener('DOMContentLoaded', () => {
  console.log("🌊 [부산ON 월드] 프리미엄 3D 메타버스 가동");
  initThreeWorld();
  updatePlayerBadgeUI();
  connectMultiplayerWebSocket();
});
