// ========================================================
// 부산ON 월드 (BUSAN ON WORLD) - 메인 클라이언트 스크립트
// Three.js 3D 부산시청 메타버스, 멀티플레이어 동기화,
// AI 행정안내소, 소관부서 검색기, 층별 사무실 안내, 시민 자유담벼락
// ========================================================

const CLOUD_REGISTRY_GIST_ID = '8bd7ddc5c6df9538c8092e1f01c9b2fa';

const STATE = {
  currentRealm: 'BUSAN-HQ',
  playerName: '부산시민_' + Math.floor(Math.random() * 899 + 100),
  playerLevel: 1,
  playerExp: 0,
  playerTitle: '[첫 방문 시민]',
  playerRobe: 'blue',
  playerHat: 'camellia',
  playerWings: 'seagull',
  playerBelt: 'citizen',

  // 스탬프 및 퀘스트 진행 상태
  stamps: {
    anchor: false,
    lighthouse: false,
    lobby: false,
    civil: false,
    shout: false
  },
  currentAct: 1,

  // 피어(다른 시민들)
  peers: {},
  onlineCount: 1,

  // 웹소켓 및 호스트 서버
  ws: null,
  clientId: null,
  apiBase: '',
  serverHost: window.location.host,
  serverConnected: false,

  // 2D 모드 활성화 여부
  is2DMode: false
};

function getApiUrl(path) {
  if (STATE.apiBase) {
    return `${STATE.apiBase}${path}`;
  }
  return path;
}

function updateServerStatusUI(online, text) {
  const pill = document.getElementById('server-status-pill');
  const dot = document.getElementById('server-status-dot');
  const label = document.getElementById('server-status-text');
  if (pill && dot && label) {
    dot.innerText = online ? '🟢' : '🟡';
    label.innerText = text;
    pill.className = `server-status-pill ${online ? 'online' : 'waiting'}`;
  }
}

function showServerConfigPrompt() {
  const current = STATE.apiBase || `http://${window.location.host}`;
  const custom = prompt(
    "🌐 [부산ON 호스트 서버 주소 설정]\n\n" +
    "현재 연결된 서버 주소:\n" + current + "\n\n" +
    "수동으로 다른 Cloudflare 주소나 IP를 지정하시려면 아래에 입력하세요 (비워두면 자동 감지 유지):",
    STATE.apiBase
  );
  if (custom !== null && custom.trim() !== "") {
    let clean = custom.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    STATE.serverHost = clean;
    STATE.apiBase = `https://${clean}`;
    updateServerStatusUI(true, '수동 연결');
    if (STATE.ws) {
      STATE.ws.close();
    }
    connectWebSocket();
    loadWallPosts();
  }
}

async function autoDiscoverHostServer() {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocal) {
    STATE.apiBase = '';
    STATE.serverHost = window.location.host;
    updateServerStatusUI(true, '로컬 서버');
    return window.location.host;
  }

  if (window.location.hostname.includes('trycloudflare.com')) {
    STATE.apiBase = '';
    STATE.serverHost = window.location.host;
    updateServerStatusUI(true, '터널 라이브');
    return window.location.host;
  }

  // GitHub Pages 등 외부 웹사이트에서 실행될 때: Gist에서 실시간 호스트 주소 탐색
  console.log('[부산ON] 외부 환경 감지: Gist에서 라이브 호스트 서버 주소 조회 중...');
  updateServerStatusUI(false, '호스트 찾는 중');

  const cacheBuster = Date.now();
  // 1. Raw Gist 조회
  try {
    const rawRes = await fetch(`https://gist.githubusercontent.com/kicharisma2/${CLOUD_REGISTRY_GIST_ID}/raw/host.json?_nocache=${cacheBuster}`, { cache: 'no-store' });
    if (rawRes.ok) {
      const parsed = await rawRes.json();
      const targetUrl = parsed.url || parsed.host;
      if (parsed.status === 'online' && targetUrl) {
        const cleanHost = targetUrl.trim().replace(/^https?:\/\//i, '').replace(/^wss?:\/\//i, '').replace(/\/+.*$/, '');
        STATE.serverHost = cleanHost;
        STATE.apiBase = `https://${cleanHost}`;
        console.log('[부산ON] Gist Raw 라이브 호스트 발견:', cleanHost);
        updateServerStatusUI(true, '실시간 연결됨');
        return cleanHost;
      }
    }
  } catch (e1) {
    console.warn('[부산ON] Gist raw 조회 알림:', e1);
  }

  // 2. Gist REST API 폴백
  try {
    const res = await fetch(`https://api.github.com/gists/${CLOUD_REGISTRY_GIST_ID}?_nocache=${cacheBuster}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.files && data.files['host.json']) {
        const parsed = JSON.parse(data.files['host.json'].content);
        const targetUrl = parsed.url || parsed.host;
        if (parsed.status === 'online' && targetUrl) {
          const cleanHost = targetUrl.trim().replace(/^https?:\/\//i, '').replace(/^wss?:\/\//i, '').replace(/\/+.*$/, '');
          STATE.serverHost = cleanHost;
          STATE.apiBase = `https://${cleanHost}`;
          console.log('[부산ON] Gist API 라이브 호스트 발견:', cleanHost);
          updateServerStatusUI(true, '실시간 연결됨');
          return cleanHost;
        }
      }
    }
  } catch (e2) {
    console.warn('[부산ON] Gist API 조회 알림:', e2);
  }

  updateServerStatusUI(false, '호스트 대기');
  return null;
}

// 9단계 시민 탐험가 계급 체계
const CITIZEN_RANKS = [
  { level: 1, title: '첫 방문 시민', minExp: 0 },
  { level: 2, title: '광장 산책자', minExp: 100 },
  { level: 3, title: '청사 길잡이', minExp: 250 },
  { level: 4, title: '행정 탐구자', minExp: 450 },
  { level: 5, title: '소통 참여자', minExp: 700 },
  { level: 6, title: '우리동네 보안관', minExp: 1050 },
  { level: 7, title: '시민 지킴이', minExp: 1500 },
  { level: 8, title: '16개 구·군 탐험가', minExp: 2100 },
  { level: 9, title: '부산ON 마스터', minExp: 3000 }
];

// 3D 전역 변수
let scene, camera, renderer, controls;
let localPlayerMesh = null;
let animMixers = [];
let clock = new THREE.Clock();
let interactiveObjects = []; // E키 상호작용 트리거 목록
let seagulls = [];
let fountainParticles = [];
let camelliaPetals = [];

// 키보드 입력 상태
const KEYS = { w: false, a: false, s: false, d: false, space: false, shift: false };

// ========================================================
// 1. 초기화 (INIT)
// ========================================================
window.addEventListener('DOMContentLoaded', () => {
  initThree();
  buildBusanWorld();
  setupEventListeners();
  connectWebSocket();
  loadInitialData();
  animate();
});

function initThree() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('gl-canvas');

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbbe1fa); // 상쾌한 부산 하늘색
  scene.fog = new THREE.FogExp2(0xcfe9f7, 0.005);

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 1000);
  camera.position.set(0, 18, 48);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05; // 지면 아래 회전 방지
  controls.minDistance = 6;
  controls.maxDistance = 140;
  controls.target.set(0, 3, 20);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
  sunLight.position.set(80, 150, 70);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 400;
  const d = 100;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  scene.add(sunLight);

  const seaHemiLight = new THREE.HemisphereLight(0x0284c7, 0x10b981, 0.35);
  scene.add(seaHemiLight);
}

// ========================================================
// 2. 3D 부산시청 및 5대 시청광장 모델링
// ========================================================
function buildBusanWorld() {
  // (1) 넓은 지면 및 잔디밭
  const groundGeo = new THREE.PlaneGeometry(350, 350);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // 중앙대로 아스팔트 도로 (정문 앞)
  const roadGeo = new THREE.PlaneGeometry(350, 24);
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.02, 75);
  road.receiveShadow = true;
  scene.add(road);

  // 중앙대로 황색 차선
  const lineGeo = new THREE.PlaneGeometry(350, 0.8);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.rotation.x = -Math.PI / 2;
  line.position.set(0, 0.03, 75);
  scene.add(line);

  // (2) 부산광역시청 본관 건물 (28층 메인 타워 + 저층 로비 캐노피)
  buildBusanCityHallBuilding();

  // (3) 시민광장 중앙 '부산의 닻' 거대 조형물
  buildAnchorSculpture(0, 0, 15);

  // (4) 바닥 분수대
  buildFountain(0, 0, 28);

  // (5) 등대광장 (오륙도 등대 조형물 + 소원 연못)
  buildLighthouseSquare(-45, 0, 12);

  // (6) 동백광장 (동백나무 군락 산책로)
  buildCamelliaSquare(45, 0, 12);

  // (7) 녹음광장 & 야외공연장 버스킹 무대
  buildGreenPlazaAmphitheater(-50, 0, 45);

  // (8) 잔디광장 & 속 시원한 시민 발언대
  buildFreeSpeechPodium(50, 0, 45);

  // (9) 시청 1층 들락날락 & 로비 실내 인터랙션 구역
  buildDeullakLobbyArea(0, 0, -25);

  // (10) 하늘의 갈매기 애니메이션
  createFlockOfSeagulls();

  // (11) 로컬 플레이어 생성
  createLocalPlayer();
}

// 부산시청 본관 (28층 주타워)
function buildBusanCityHallBuilding() {
  const cityHallGroup = new THREE.Group();

  // 저층 기단부 (1~3층 열린로비 & 행복민원실)
  const baseGeo = new THREE.BoxGeometry(90, 14, 50);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.set(0, 7, -35);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  cityHallGroup.add(baseMesh);

  // 정문 유리 파사드 & 캐노피
  const glassGeo = new THREE.BoxGeometry(60, 10, 2);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.75
  });
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.position.set(0, 5, -9);
  cityHallGroup.add(glassMesh);

  // 정문 캐노피 지붕
  const canopyGeo = new THREE.BoxGeometry(34, 1.5, 12);
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x0369a1 });
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0, 9, -5);
  canopy.castShadow = true;
  cityHallGroup.add(canopy);

  // 28층 고층 주타워 (28-Story High-Rise Tower)
  const towerGeo = new THREE.BoxGeometry(68, 70, 36);
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    roughness: 0.2,
    metalness: 0.5
  });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.set(0, 49, -38);
  tower.castShadow = true;
  tower.receiveShadow = true;
  cityHallGroup.add(tower);

  // 타워 측면 화강석 기둥 프레임
  [-34, 34].forEach(x => {
    const colGeo = new THREE.BoxGeometry(4, 72, 38);
    const colMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9 });
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(x, 49, -38);
    col.castShadow = true;
    cityHallGroup.add(col);
  });

  // 타워 상단 부산광역시 심볼 전광판
  const signGeo = new THREE.BoxGeometry(30, 6, 2);
  const signMat = new THREE.MeshStandardMaterial({ color: 0x0369a1 });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 84, -18);
  cityHallGroup.add(sign);

  scene.add(cityHallGroup);

  // 정문 진입 트리거 등록 (1층 로비)
  registerInteractiveObject({
    id: 'lobby_entrance',
    name: '부산시청 1층 열린로비 입장 (들락날락)',
    pos: new THREE.Vector3(0, 1, -8),
    radius: 7,
    action: () => openOfficeModal()
  });
}

// 시민광장 '부산의 닻 (Anchor)' 은빛 상징 조형물
function buildAnchorSculpture(x, y, z) {
  const anchorGroup = new THREE.Group();
  anchorGroup.position.set(x, y, z);

  // 화강암 원형 기단
  const plinthGeo = new THREE.CylinderGeometry(6, 6.5, 1.2, 32);
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
  const plinth = new THREE.Mesh(plinthGeo, plinthMat);
  plinth.position.y = 0.6;
  plinth.receiveShadow = true;
  anchorGroup.add(plinth);

  // 은빛 강철 닻 샤프트 (기둥)
  const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
  const shaft = new THREE.Mesh(shaftGeo, steelMat);
  shaft.position.y = 6;
  shaft.castShadow = true;
  anchorGroup.add(shaft);

  // 닻 상단 고리 (Ring)
  const ringGeo = new THREE.TorusGeometry(1.4, 0.35, 16, 32);
  const ring = new THREE.Mesh(ringGeo, steelMat);
  ring.position.y = 11;
  ring.castShadow = true;
  anchorGroup.add(ring);

  // 닻 하단 양 날개 곡선 (Arms)
  const armGeo = new THREE.TorusGeometry(3.6, 0.45, 16, 32, Math.PI);
  const arm = new THREE.Mesh(armGeo, steelMat);
  arm.rotation.z = Math.PI;
  arm.position.y = 4.2;
  arm.castShadow = true;
  anchorGroup.add(arm);

  // 상징 명판
  const plaqueGeo = new THREE.BoxGeometry(3, 1, 0.2);
  const plaqueMat = new THREE.MeshStandardMaterial({ color: 0x0369a1 });
  const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
  plaque.position.set(0, 0.9, 6.1);
  anchorGroup.add(plaque);

  scene.add(anchorGroup);

  // 닻 조형물 인터랙션 트리거 (스탬프 획득)
  registerInteractiveObject({
    id: 'anchor',
    name: '부산의 닻 조형물 감상하기',
    pos: new THREE.Vector3(x, 1, z),
    radius: 7,
    action: () => {
      collectStamp('anchor', '부산의 닻 스탬프');
      openPhotosModal();
    }
  });
}

// 바닥 분수대
function buildFountain(x, y, z) {
  const fountainGeo = new THREE.CylinderGeometry(7, 7.5, 0.8, 32);
  const fountainMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.1 });
  const fountain = new THREE.Mesh(fountainGeo, fountainMat);
  fountain.position.set(x, 0.4, z);
  fountain.receiveShadow = true;
  scene.add(fountain);

  // 분수 물줄기 파티클
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const dropGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const dropMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
    const drop = new THREE.Mesh(dropGeo, dropMat);
    drop.position.set(x + Math.cos(angle) * 3.5, 1, z + Math.sin(angle) * 3.5);
    drop.userData = { baseY: 0.6, speed: 2 + Math.random() * 2, phase: Math.random() * Math.PI * 2 };
    scene.add(drop);
    fountainParticles.push(drop);
  }
}

// 등대광장 (오륙도 등대 조형물 + 소원 연못)
function buildLighthouseSquare(x, y, z) {
  const lhGroup = new THREE.Group();
  lhGroup.position.set(x, y, z);

  // 연못 지면
  const pondGeo = new THREE.CylinderGeometry(10, 10.5, 0.5, 32);
  const pondMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.4 });
  const pond = new THREE.Mesh(pondGeo, pondMat);
  pond.position.y = 0.25;
  lhGroup.add(pond);

  // 오륙도 클래식 등대 타워 (빨강 + 흰색 줄무늬)
  const towerGeo = new THREE.CylinderGeometry(1.6, 2.5, 14, 16);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.y = 7.5;
  tower.castShadow = true;
  lhGroup.add(tower);

  // 등대 흰색 띠
  const bandGeo = new THREE.CylinderGeometry(1.85, 2.05, 3.5, 16);
  const bandMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const band = new THREE.Mesh(bandGeo, bandMat);
  band.position.y = 7.5;
  lhGroup.add(band);

  // 등대 램프 룸 (상단)
  const lampGeo = new THREE.CylinderGeometry(1.5, 1.5, 2.2, 16);
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const lamp = new THREE.Mesh(lampGeo, lampMat);
  lamp.position.y = 15;
  lhGroup.add(lamp);

  // 등대 회전 탐조등 광선 (Beam)
  const beamGeo = new THREE.ConeGeometry(5, 22, 16, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.x = Math.PI / 2;
  beam.position.set(0, 15, 11);
  lhGroup.add(beam);
  lhGroup.userData = { beamMesh: beam };

  scene.add(lhGroup);

  registerInteractiveObject({
    id: 'lighthouse',
    name: '등대광장 소원 연못 방문하기',
    pos: new THREE.Vector3(x, 1, z),
    radius: 8,
    action: () => {
      collectStamp('lighthouse', '오륙도 등대 스탬프');
      if (window.busanAudio) window.busanAudio.playDingDong();
      alert("✨ 등대광장 소원 연못에 오셨습니다! 오늘의 시민 소원을 빌어보세요.");
    }
  });
}

// 동백광장 (동백나무 군락)
function buildCamelliaSquare(x, y, z) {
  const camelliaGroup = new THREE.Group();
  camelliaGroup.position.set(x, y, z);

  // 붉은 동백나무 8그루 배치
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const dist = 5 + (i % 2) * 3;
    const treeX = Math.cos(angle) * dist;
    const treeZ = Math.sin(angle) * dist;

    // 나무 기둥
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(treeX, 1.5, treeZ);
    trunk.castShadow = true;
    camelliaGroup.add(trunk);

    // 진녹색 잎사귀
    const leavesGeo = new THREE.SphereGeometry(1.8, 12, 12);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.set(treeX, 3.8, treeZ);
    leaves.castShadow = true;
    camelliaGroup.add(leaves);

    // 붉은 동백꽃 꽃송이
    for (let f = 0; f < 5; f++) {
      const flowerGeo = new THREE.SphereGeometry(0.3, 6, 6);
      const flowerMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
      const flower = new THREE.Mesh(flowerGeo, flowerMat);
      flower.position.set(
        treeX + (Math.random() - 0.5) * 2.2,
        3.5 + Math.random() * 1.5,
        treeZ + (Math.random() - 0.5) * 2.2
      );
      camelliaGroup.add(flower);
    }
  }

  // 휴식 벤치
  const benchGeo = new THREE.BoxGeometry(4, 0.6, 1.4);
  const benchMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
  const bench = new THREE.Mesh(benchGeo, benchMat);
  bench.position.set(0, 0.5, 0);
  bench.castShadow = true;
  camelliaGroup.add(bench);

  scene.add(camelliaGroup);
}

// 녹음광장 & 야외 버스킹 공연장
function buildGreenPlazaAmphitheater(x, y, z) {
  const ampGroup = new THREE.Group();
  ampGroup.position.set(x, y, z);

  // 반원형 원형 스탠드 계단 3단
  for (let i = 1; i <= 3; i++) {
    const tierGeo = new THREE.CylinderGeometry(8 + i * 2, 8 + i * 2, 0.6, 24, 1, false, 0, Math.PI);
    const tierMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1 });
    const tier = new THREE.Mesh(tierGeo, tierMat);
    tier.position.y = (4 - i) * 0.6;
    tier.receiveShadow = true;
    ampGroup.add(tier);
  }

  // 버스킹 무대 바닥
  const stageGeo = new THREE.CylinderGeometry(6, 6, 0.5, 24);
  const stageMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
  const stage = new THREE.Mesh(stageGeo, stageMat);
  stage.position.y = 0.25;
  stage.receiveShadow = true;
  ampGroup.add(stage);

  // 마이크 스탠드
  const micGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8);
  const micMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
  const mic = new THREE.Mesh(micGeo, micMat);
  mic.position.set(0, 1.4, 0);
  ampGroup.add(mic);

  scene.add(ampGroup);

  registerInteractiveObject({
    id: 'busking_stage',
    name: '야외공연장 버스킹 무대 (댄스/음악)',
    pos: new THREE.Vector3(x, 1, z),
    radius: 6,
    action: () => performGesture('dance')
  });
}

// 속 시원한 시민 발언대 (Free Speech Podium)
function buildFreeSpeechPodium(x, y, z) {
  const podGroup = new THREE.Group();
  podGroup.position.set(x, y, z);

  // 나무 발언대 단상
  const deckGeo = new THREE.BoxGeometry(6, 0.8, 6);
  const deckMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
  const deck = new THREE.Mesh(deckGeo, deckMat);
  deck.position.y = 0.4;
  deck.receiveShadow = true;
  podGroup.add(deck);

  // 연단 (Podium Stand)
  const standGeo = new THREE.BoxGeometry(1.6, 2.4, 1.2);
  const standMat = new THREE.MeshStandardMaterial({ color: 0x92400e });
  const stand = new THREE.Mesh(standGeo, standMat);
  stand.position.set(0, 1.6, -1.5);
  podGroup.add(stand);

  // 대형 황동 확성기 스피커 (Megaphone Speakers)
  const hornGeo = new THREE.ConeGeometry(0.9, 2.2, 16);
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
  const horn = new THREE.Mesh(hornGeo, hornMat);
  horn.rotation.x = -Math.PI / 2;
  horn.position.set(0, 3.2, -1.5);
  podGroup.add(horn);

  scene.add(podGroup);

  registerInteractiveObject({
    id: 'free_podium',
    name: '속 시원한 시민 발언대 (확성기 외치기)',
    pos: new THREE.Vector3(x, 1, z),
    radius: 6,
    action: () => openPodiumPrompt()
  });
}

// 1층 들락날락 & 열린로비 실내 데스크
function buildDeullakLobbyArea(x, y, z) {
  const lobbyGroup = new THREE.Group();
  lobbyGroup.position.set(x, y, z);

  // 안내데스크 카운터
  const deskGeo = new THREE.BoxGeometry(12, 1.8, 3.5);
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.set(0, 1, 0);
  lobbyGroup.add(desk);

  // 16개 구·군 3D 축소 디오라마 테이블
  const tableGeo = new THREE.CylinderGeometry(6, 6.2, 1.4, 24);
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.set(-18, 0.7, 0);
  lobbyGroup.add(table);

  // 디오라마 위 작은 미니어처 빌딩들
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const bGeo = new THREE.BoxGeometry(0.8, 1.2 + Math.random(), 0.8);
    const bMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const bMesh = new THREE.Mesh(bGeo, bMat);
    bMesh.position.set(-18 + Math.cos(angle) * 3.5, 2, Math.sin(angle) * 3.5);
    lobbyGroup.add(bMesh);
  }

  // 2층 행복민원실 번호표 발급기 키오스크
  const kioskGeo = new THREE.BoxGeometry(1.2, 3.2, 1.2);
  const kioskMat = new THREE.MeshStandardMaterial({ color: 0x0369a1 });
  const kiosk = new THREE.Mesh(kioskGeo, kioskMat);
  kiosk.position.set(18, 1.6, 0);
  lobbyGroup.add(kiosk);

  scene.add(lobbyGroup);

  // AI 다온 안내데스크 트리거
  registerInteractiveObject({
    id: 'daon_desk',
    name: '다온 AI 행정상담 데스크',
    pos: new THREE.Vector3(x, 1, z + 2),
    radius: 7,
    action: () => openAiGuideModal()
  });

  // 16개 구·군 디오라마 포털 트리거
  registerInteractiveObject({
    id: 'diorama_portal',
    name: '16개 구·군 디오라마 포털 열기',
    pos: new THREE.Vector3(x - 18, 1, z),
    radius: 6,
    action: () => openDistrictsModal()
  });

  // 번호표 발급기 트리거
  registerInteractiveObject({
    id: 'ticket_kiosk',
    name: '2층 행복민원실 번호표 뽑기',
    pos: new THREE.Vector3(x + 18, 1, z),
    radius: 6,
    action: () => {
      if (window.busanAudio) window.busanAudio.playDingDong();
      alert("🎟️ [행복민원실 번호표 발급 완료]\n대기번호: 104번 (현재 대기인수: 2명)\n친절하게 모시겠습니다.");
      collectStamp('civil', '행복민원실 스탬프');
    }
  });
}

// 갈매기 편대 생성
function createFlockOfSeagulls() {
  for (let i = 0; i < 6; i++) {
    const sGroup = new THREE.Group();
    // 날개 2개
    const wingGeo = new THREE.BoxGeometry(1.2, 0.05, 0.4);
    const wingMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.x = -0.6;
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.x = 0.6;
    sGroup.add(leftWing, rightWing);

    sGroup.position.set(
      (Math.random() - 0.5) * 120,
      35 + Math.random() * 20,
      (Math.random() - 0.5) * 120
    );
    sGroup.userData = {
      angle: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.01,
      radius: 40 + Math.random() * 30,
      height: sGroup.position.y,
      leftWing: leftWing,
      rightWing: rightWing
    };
    scene.add(sGroup);
    seagulls.push(sGroup);
  }
}

// ========================================================
// 3. 로컬 및 피어(멀티플레이어) 플레이어 아바타
// ========================================================
function createLocalPlayer() {
  localPlayerMesh = createAvatarMesh(STATE.playerRobe, STATE.playerHat, STATE.playerWings);
  localPlayerMesh.position.set(0, 0, 35); // 시민광장 앞 시작 위치
  scene.add(localPlayerMesh);
}

function createAvatarMesh(robeColor, hatType, wingsType) {
  const avatar = new THREE.Group();

  // 색상 매핑
  const colorMap = {
    blue: 0x0284c7,
    white: 0xffffff,
    camellia: 0xf43f5e,
    gold: 0xf59e0b,
    green: 0x10b981
  };
  const bodyColor = colorMap[robeColor] || 0x0284c7;

  // 몸체 (Robe)
  const bodyGeo = new THREE.CylinderGeometry(0.45, 0.75, 1.8, 16);
  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.5 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.1;
  body.castShadow = true;
  avatar.add(body);

  // 머리 (Head)
  const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.8 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 2.4;
  head.castShadow = true;
  avatar.add(head);

  // 모자/헤어 액세서리
  if (hatType === 'camellia') {
    // 붉은 동백꽃 핀
    const fGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const fMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const flower = new THREE.Mesh(fGeo, fMat);
    flower.position.set(0.35, 2.7, 0.2);
    avatar.add(flower);
  } else if (hatType === 'seagull') {
    // 갈매기 모자
    const sGeo = new THREE.ConeGeometry(0.3, 0.7, 8);
    const sMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sMesh = new THREE.Mesh(sGeo, sMat);
    sMesh.position.y = 2.95;
    avatar.add(sMesh);
  } else if (hatType === 'halo') {
    // 시민 후광
    const hGeo = new THREE.TorusGeometry(0.5, 0.06, 8, 24);
    const hMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const halo = new THREE.Mesh(hGeo, hMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 3.1;
    avatar.add(halo);
  }

  // 날개
  if (wingsType === 'seagull' || wingsType === 'angel') {
    const wGeo = new THREE.BoxGeometry(0.8, 0.3, 0.05);
    const wMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const wLeft = new THREE.Mesh(wGeo, wMat);
    wLeft.position.set(-0.65, 1.6, -0.4);
    wLeft.rotation.y = 0.3;
    const wRight = new THREE.Mesh(wGeo, wMat);
    wRight.position.set(0.65, 1.6, -0.4);
    wRight.rotation.y = -0.3;
    avatar.add(wLeft, wRight);
  }

  return avatar;
}

// ========================================================
// 4. WebSocket 멀티플레이 동기화
// ========================================================
async function connectWebSocket() {
  if (!STATE.serverHost || (window.location.hostname.includes('github.io') && !STATE.apiBase)) {
    await autoDiscoverHostServer();
  }

  const host = STATE.serverHost || window.location.host;
  const isHttps = window.location.protocol === 'https:' || host.includes('trycloudflare.com');
  const protocol = isHttps ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${host}/ws`;

  console.log(`[BusanWS] 웹소켓 연결 시도: ${wsUrl}`);
  try {
    STATE.ws = new WebSocket(wsUrl);
  } catch (e) {
    console.error('[BusanWS] WebSocket 생성 실패:', e);
    updateServerStatusUI(false, '연결 실패');
    setTimeout(connectWebSocket, 4000);
    return;
  }

  STATE.ws.onopen = () => {
    console.log('[BusanWS] 서버 연결 성공!');
    STATE.serverConnected = true;
    updateServerStatusUI(true, '실시간 연결됨');
    // 룸 참가 패킷
    sendWs({
      type: 'join',
      room: STATE.currentRealm,
      name: STATE.playerName,
      level: STATE.playerLevel,
      title: STATE.playerTitle,
      robe: STATE.playerRobe,
      hat: STATE.playerHat,
      wings: STATE.playerWings,
      belt: STATE.playerBelt,
      x: localPlayerMesh.position.x,
      y: localPlayerMesh.position.y,
      z: localPlayerMesh.position.z,
      ry: localPlayerMesh.rotation.y
    });
  };

  STATE.ws.onmessage = (event) => {
    try {
      const msg = jsonParse(event.data);
      handleServerMessage(msg);
    } catch (e) {
      console.error('[BusanWS] 메시지 파싱 오류:', e);
    }
  };

  STATE.ws.onclose = () => {
    STATE.serverConnected = false;
    updateServerStatusUI(false, '재연결 대기');
    console.warn('[BusanWS] 연결 종료됨. 4초 후 재연결 시도...');
    setTimeout(connectWebSocket, 4000);
  };
}

function sendWs(obj) {
  if (STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    STATE.ws.send(JSON.stringify(obj));
  }
}

function handleServerMessage(msg) {
  const mtype = msg.type;

  if (mtype === 'welcome') {
    STATE.clientId = msg.id;
    updateOnlineCount(msg.count);
    // 기존 피어들 생성
    if (msg.peers) {
      msg.peers.forEach(addPeer);
    }
  } else if (mtype === 'peer_join') {
    updateOnlineCount(msg.count);
    addPeer(msg.peer);
    addSystemChat(`[입장] ${msg.peer.name} 님이 부산ON 월드에 오셨습니다.`);
  } else if (mtype === 'peer_leave') {
    updateOnlineCount(msg.count);
    removePeer(msg.id);
  } else if (mtype === 'peer_move') {
    updatePeerPosition(msg.id, msg.x, msg.y, msg.z, msg.ry, msg.jump);
  } else if (mtype === 'peer_chat') {
    appendChatMessage(msg.name, msg.text, msg.title, msg.time);
  } else if (mtype === 'podium_broadcast') {
    showPodiumBanner(msg.name, msg.text);
    if (window.busanAudio) window.busanAudio.playMegaphoneSound();
  } else if (mtype === 'wall_new_post') {
    addSystemChat(`📢 [새 담벼락 글] ${msg.post.author}: "${msg.post.title}"`);
  }
}

function addPeer(info) {
  if (!info || info.id === STATE.clientId || STATE.peers[info.id]) return;
  const mesh = createAvatarMesh(info.robe || 'blue', info.hat || 'camellia', info.wings || 'seagull');
  mesh.position.set(info.x || 0, info.y || 0, info.z || 0);
  scene.add(mesh);

  STATE.peers[info.id] = {
    info: info,
    mesh: mesh,
    targetPos: new THREE.Vector3(info.x || 0, info.y || 0, info.z || 0),
    targetRotY: info.ry || 0
  };
}

function removePeer(id) {
  if (STATE.peers[id]) {
    scene.remove(STATE.peers[id].mesh);
    delete STATE.peers[id];
  }
}

function updatePeerPosition(id, x, y, z, ry, jump) {
  const peer = STATE.peers[id];
  if (peer) {
    peer.targetPos.set(x, y, z);
    peer.targetRotY = ry;
    if (jump) {
      peer.mesh.position.y = 1.2;
    }
  }
}

function updateOnlineCount(cnt) {
  STATE.onlineCount = cnt;
  const badge = document.getElementById('online-count-badge');
  if (badge) badge.innerText = `접속자 ${cnt}명`;
}

// ========================================================
// 5. 플레이어 조작 및 메인 렌더 루프
// ========================================================
let playerVelocityY = 0;
let isGrounded = true;

function setupEventListeners() {
  window.addEventListener('resize', onWindowResize);

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      if (e.key === 'Enter' && document.activeElement.id === 'chat-input') {
        sendChatMessage();
      }
      return;
    }

    if (key === 'w') KEYS.w = true;
    if (key === 'a') KEYS.a = true;
    if (key === 's') KEYS.s = true;
    if (key === 'd') KEYS.d = true;
    if (e.code === 'Space') {
      if (isGrounded) {
        playerVelocityY = 0.42;
        isGrounded = false;
        KEYS.space = true;
      }
    }
    if (e.shiftKey) KEYS.shift = true;
    if (key === 'e') triggerInteraction();
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w') KEYS.w = false;
    if (key === 'a') KEYS.a = false;
    if (key === 's') KEYS.s = false;
    if (key === 'd') KEYS.d = false;
    if (!e.shiftKey) KEYS.shift = false;
    if (e.code === 'Space') KEYS.space = false;
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

let lastNetSync = 0;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // (1) 로컬 플레이어 이동 계산
  if (localPlayerMesh) {
    const moveSpeed = (KEYS.shift ? 16 : 9) * delta;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).normalize().negate();

    const moveDir = new THREE.Vector3();
    if (KEYS.w) moveDir.add(forward);
    if (KEYS.s) moveDir.sub(forward);
    if (KEYS.d) moveDir.add(right);
    if (KEYS.a) moveDir.sub(right);

    if (moveDir.lengthSq() > 0.001) {
      moveDir.normalize();
      localPlayerMesh.position.addScaledVector(moveDir, moveSpeed);
      localPlayerMesh.rotation.y = Math.atan2(moveDir.x, moveDir.z);
    }

    // 중력 및 점프
    playerVelocityY -= 1.2 * delta;
    localPlayerMesh.position.y += playerVelocityY;
    if (localPlayerMesh.position.y <= 0) {
      localPlayerMesh.position.y = 0;
      playerVelocityY = 0;
      isGrounded = true;
    }

    // 카메라 추적
    controls.target.lerp(
      new THREE.Vector3(localPlayerMesh.position.x, localPlayerMesh.position.y + 2, localPlayerMesh.position.z),
      0.1
    );

    // 좌표 표시 업데이트
    const coordEl = document.getElementById('coord-display');
    if (coordEl) {
      coordEl.innerText = `X:${Math.round(localPlayerMesh.position.x)} Z:${Math.round(localPlayerMesh.position.z)}`;
    }

    // 네트워크 위치 동기화 (초당 15회)
    if (time - lastNetSync > 0.065) {
      lastNetSync = time;
      sendWs({
        type: 'move',
        x: localPlayerMesh.position.x,
        y: localPlayerMesh.position.y,
        z: localPlayerMesh.position.z,
        ry: localPlayerMesh.rotation.y,
        jump: !isGrounded
      });
    }

    // 상호작용 프롬프트 검사
    checkProximityInteraction();
  }

  // (2) 다른 피어들 부드러운 보간 (Interpolation)
  for (const id in STATE.peers) {
    const peer = STATE.peers[id];
    peer.mesh.position.lerp(peer.targetPos, 0.2);
    peer.mesh.rotation.y = THREE.MathUtils.lerp(peer.mesh.rotation.y, peer.targetRotY, 0.2);
  }

  // (3) 분수대 물줄기 애니메이션
  fountainParticles.forEach(p => {
    p.position.y = p.userData.baseY + Math.sin(time * p.userData.speed + p.userData.phase) * 1.8 + 1.2;
  });

  // (4) 갈매기 비행 애니메이션
  seagulls.forEach(s => {
    s.userData.angle += s.userData.speed;
    s.position.x = Math.cos(s.userData.angle) * s.userData.radius;
    s.position.z = Math.sin(s.userData.angle) * s.userData.radius;
    s.rotation.y = -s.userData.angle + Math.PI / 2;

    const flap = Math.sin(time * 8) * 0.4;
    s.userData.leftWing.rotation.z = flap;
    s.userData.rightWing.rotation.z = -flap;
  });

  controls.update();
  renderer.render(scene, camera);
}

// ========================================================
// 6. 상호작용 시스템 & 근접 감지
// ========================================================
let nearestInteractable = null;

function registerInteractiveObject(obj) {
  interactiveObjects.push(obj);
}

function checkProximityInteraction() {
  if (!localPlayerMesh) return;
  const pPos = localPlayerMesh.position;
  let found = null;
  let minDist = Infinity;

  interactiveObjects.forEach(obj => {
    const d = pPos.distanceTo(obj.pos);
    if (d < obj.radius && d < minDist) {
      minDist = d;
      found = obj;
    }
  });

  nearestInteractable = found;
  const promptEl = document.getElementById('interact-prompt');
  const textEl = document.getElementById('prompt-text');

  if (found) {
    promptEl.style.display = 'flex';
    textEl.innerText = `${found.name} (E키)`;
  } else {
    promptEl.style.display = 'none';
  }
}

function triggerInteraction() {
  if (nearestInteractable && nearestInteractable.action) {
    nearestInteractable.action();
  }
}

// 스탬프 획득 및 퀘스트 진행
function collectStamp(stampKey, stampName) {
  if (STATE.stamps[stampKey]) return; // 이미 획득함
  STATE.stamps[stampKey] = true;

  if (window.busanAudio) window.busanAudio.playStampSound();

  // 퀘스트 태그 업데이트
  const tagEl = document.getElementById(`tag-${stampKey}`);
  if (tagEl) {
    tagEl.classList.add('done');
    tagEl.innerText = `✓ ${stampName} 완료`;
  }

  addExp(80);
  addSystemChat(`🌟 [스탬프 달성!] '${stampName}'을 획득하였습니다! (+80 XP)`);
  sendWs({ type: 'stamp_collected', stamp_id: stampKey, stamp_name: stampName, name: STATE.playerName });

  // 모든 스탬프 달성 시 ACT 업데이트
  const allStamps = Object.values(STATE.stamps).filter(Boolean).length;
  if (allStamps >= 4) {
    document.getElementById('quest-act-badge').innerText = 'ACT 5. 부산ON 마스터';
    document.getElementById('quest-title').innerText = '16개 구·군을 잇는 부산의 중심';
    document.getElementById('quest-desc').innerText = '축하합니다! 시청과 광장의 모든 주요 시설을 탐방 완료하셨습니다.';
  }
}

function addExp(amount) {
  STATE.playerExp += amount;
  let currentRank = CITIZEN_RANKS[0];
  for (let r of CITIZEN_RANKS) {
    if (STATE.playerExp >= r.minExp) currentRank = r;
  }

  if (currentRank.level > STATE.playerLevel) {
    STATE.playerLevel = currentRank.level;
    STATE.playerTitle = `[${currentRank.title}]`;
    document.getElementById('player-rank-badge').innerText = `탐험가 Lv.${STATE.playerLevel}`;
    document.getElementById('player-title-text').innerText = STATE.playerTitle;
    if (window.busanAudio) window.busanAudio.playLevelUp();
    addSystemChat(`🎉 [레벨업!] 시민 등급이 '${currentRank.title}' (Lv.${STATE.playerLevel})로 상승했습니다!`);
    sendWs({ type: 'level_up', level: STATE.playerLevel, title: STATE.playerTitle, name: STATE.playerName });
  }

  // 프로그레스 바 업데이트
  const nextRank = CITIZEN_RANKS[STATE.playerLevel] || currentRank;
  const pct = Math.min(100, Math.round((STATE.playerExp / nextRank.minExp) * 100));
  const fillEl = document.getElementById('player-xp-fill');
  if (fillEl) fillEl.style.width = `${pct}%`;
}

// 제스처 모션
function performGesture(type) {
  if (!localPlayerMesh) return;
  if (type === 'wave') {
    localPlayerMesh.rotation.y += 0.5;
    setTimeout(() => { localPlayerMesh.rotation.y -= 0.5; }, 300);
    addSystemChat(`${STATE.playerName} 님이 손을 흔들어 인사합니다.`);
  } else if (type === 'clap') {
    if (window.busanAudio) window.busanAudio.playDingDong();
    addSystemChat(`${STATE.playerName} 님이 박수를 칩니다.`);
  } else if (type === 'dance') {
    let count = 0;
    const interval = setInterval(() => {
      localPlayerMesh.rotation.y += Math.PI / 4;
      localPlayerMesh.position.y = 0.5;
      count++;
      if (count > 8) {
        clearInterval(interval);
        localPlayerMesh.position.y = 0;
      }
    }, 100);
    addSystemChat(`${STATE.playerName} 님이 신나게 춤을 춥니다!`);
  } else if (type === 'cheer') {
    playerVelocityY = 0.5;
    isGrounded = false;
    addSystemChat(`${STATE.playerName} 님이 크게 환호합니다!`);
  }
  sendWs({ type: 'action', act: type });
}

// 시민 발언대 외치기
function openPodiumPrompt() {
  document.getElementById('modal-podium-shout').style.display = 'flex';
}

function submitPodiumShout() {
  const input = document.getElementById('podium-input-text');
  const text = input.value.trim();
  if (!text) return;

  sendWs({ type: 'shout_podium', text: text, name: STATE.playerName });
  showPodiumBanner(STATE.playerName, text);
  if (window.busanAudio) window.busanAudio.playMegaphoneSound();

  collectStamp('shout', '시민 발언대 스탬프');
  closeModal('modal-podium-shout');
  input.value = '';
}

function showPodiumBanner(author, text) {
  const banner = document.getElementById('podium-banner');
  const authorEl = document.getElementById('podium-author');
  const textEl = document.getElementById('podium-text');
  authorEl.innerText = `[시민 발언대] ${author}:`;
  textEl.innerText = text;
  banner.style.display = 'flex';

  setTimeout(() => {
    banner.style.display = 'none';
  }, 6000);
}

// ========================================================
// 7. 실시간 채팅 기능
// ========================================================
function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  appendChatMessage(STATE.playerName, text, STATE.playerTitle, getTimeStr());
  sendWs({
    type: 'chat',
    name: STATE.playerName,
    title: STATE.playerTitle,
    text: text
  });

  input.value = '';
}

function appendChatMessage(name, text, title, time) {
  const container = document.getElementById('chat-messages');
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg';
  msgEl.innerHTML = `
    <span class="msg-title">${escapeHtml(title || '[시민]')}</span>
    <span class="msg-author">${escapeHtml(name)}:</span>
    <span>${escapeHtml(text)}</span>
    <span class="msg-time">${time || getTimeStr()}</span>
  `;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function addSystemChat(text) {
  const container = document.getElementById('chat-messages');
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg';
  msgEl.style.color = '#0284c7';
  msgEl.innerHTML = `<span style="font-weight:700;">[알림]</span> ${escapeHtml(text)}`;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function switchChatTab(tab) {
  document.querySelectorAll('.chat-tab').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  if (tab === 'wall') {
    openWallModal();
  }
}

// ========================================================
// 8. 모달 및 핵심 행정 서비스 연동
// ========================================================
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function toggleAudio() {
  if (!window.busanAudio) return;
  const isPlaying = window.busanAudio.toggleBgm();
  const btn = document.getElementById('bgm-toggle-btn');
  btn.style.color = isPlaying ? '#0284c7' : '#64748b';
  btn.innerText = isPlaying ? '🔊' : '🎵';
}

function toggle2DMode() {
  STATE.is2DMode = !STATE.is2DMode;
  if (STATE.is2DMode) {
    openOfficeModal();
  }
}

// --------------------------------------------------------
// MODAL 1: AI 행정안내소
// --------------------------------------------------------
function openAiGuideModal() {
  document.getElementById('modal-ai-guide').style.display = 'flex';
}

function askAiQuestion(q) {
  document.getElementById('ai-question-input').value = q;
  submitAiQuestion();
}

function submitAiQuestion() {
  const input = document.getElementById('ai-question-input');
  const q = input.value.trim();
  if (!q) return;

  const history = document.getElementById('ai-history');

  // 유저 말풍선 추가
  const uBubble = document.createElement('div');
  uBubble.className = 'ai-bubble user';
  uBubble.innerText = q;
  history.appendChild(uBubble);

  input.value = '';
  history.scrollTop = history.scrollHeight;

  // 봇 로딩 말풍선
  const botBubble = document.createElement('div');
  botBubble.className = 'ai-bubble bot';
  botBubble.innerHTML = `<em>다온이가 부산시청 및 구·군 행정자료를 검색하고 있습니다...</em>`;
  history.appendChild(botBubble);
  history.scrollTop = history.scrollHeight;

  fetch(getApiUrl('/api/ai-guide'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: q })
  })
  .then(r => r.json())
  .then(data => {
    let portalHtml = '';
    if (data.official_portals) {
      portalHtml = '<div class="ai-portal-cards">' + data.official_portals.map(p => `
        <a href="${p.url}" target="_blank" class="ai-portal-card">
          <span class="card-title">🔗 ${escapeHtml(p.name)}</span>
          <span class="card-desc">${escapeHtml(p.desc)}</span>
        </a>
      `).join('') + '</div>';
    }

    botBubble.innerHTML = `
      <div class="ai-badge">${escapeHtml(data.badge || '행정 AI 가이드')}</div>
      <div>${formatMarkdown(data.answer)}</div>
      ${portalHtml}
      <div style="font-size: 11px; color:#64748b; margin-top: 10px; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
        * ${escapeHtml(data.disclaimer)}
      </div>
    `;
    history.scrollTop = history.scrollHeight;
    if (window.busanAudio) window.busanAudio.playDingDong();
  })
  .catch(() => {
    botBubble.innerHTML = `부산시 120 바로콜센터(☎ 051-120)로 문의하시면 전문 상담원이 상세히 안내해 드립니다.`;
  });
}

// --------------------------------------------------------
// MODAL 2: 소관부서 검색기 (division-in-charge)
// --------------------------------------------------------
function openDivisionModal() {
  document.getElementById('modal-division').style.display = 'flex';
  searchDivision();
}

function searchDivision() {
  const q = document.getElementById('division-input').value.trim();
  fetch(getApiUrl(`/api/division-search?q=${encodeURIComponent(q)}`))
    .then(r => r.json())
    .then(list => {
      const container = document.getElementById('division-results');
      if (!list || list.length === 0) {
        container.innerHTML = `<div style="padding: 20px; color:#64748b; text-align:center;">검색 결과가 없습니다. 다른 단어(예: 주차, 포트홀, 여권, 소음)로 검색해 보세요.</div>`;
        return;
      }
      container.innerHTML = list.map(item => `
        <div class="division-card">
          <div class="division-card-header">
            <span class="division-task-name">${escapeHtml(item.task_name)}</span>
            <span class="division-authority-badge">${escapeHtml(item.authority)}</span>
          </div>
          <div class="division-row"><strong>🏢 부산시청 담당:</strong> ${escapeHtml(item.dept_city)}</div>
          <div class="division-row"><strong>🏛️ 16개 구·군 담당:</strong> ${escapeHtml(item.dept_district)}</div>
          <div class="division-row"><strong>💡 처리 및 판별 기준:</strong> ${escapeHtml(item.rule_summary)}</div>
          <div class="division-row"><strong>📜 관련 법령/근거:</strong> ${escapeHtml(item.legal_basis)}</div>
          <div class="division-row" style="color: #0369a1; font-weight:700;"><strong>🚀 빠른 조치:</strong> ${escapeHtml(item.official_action)}</div>
        </div>
      `).join('');
    });
}

// --------------------------------------------------------
// MODAL 3: 청사 사무실 안내 (sejong-office-app)
// --------------------------------------------------------
let currentOfficeFloorFilter = '';

function openOfficeModal() {
  document.getElementById('modal-office').style.display = 'flex';
  searchOffice();
}

function filterOfficeFloor(fl) {
  currentOfficeFloorFilter = fl;
  document.querySelectorAll('.floor-chip').forEach(c => c.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
  searchOffice();
}

function searchOffice() {
  const q = document.getElementById('office-search-input').value.trim();
  fetch(getApiUrl(`/api/office-search?floor=${encodeURIComponent(currentOfficeFloorFilter)}&q=${encodeURIComponent(q)}`))
    .then(r => r.json())
    .then(list => {
      const tbody = document.getElementById('office-table-body');
      if (!list || list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color:#64748b;">해당 부서 또는 사무실 정보가 없습니다.</td></tr>`;
        return;
      }
      tbody.innerHTML = list.map(off => `
        <tr>
          <td><span class="floor-chip" style="padding:2px 8px;">${off.floor}</span></td>
          <td style="font-weight:700;">${escapeHtml(off.room)}</td>
          <td style="font-weight:800; color:#0369a1;">${escapeHtml(off.name)}</td>
          <td><a href="tel:${off.tel}" style="color:#0284c7; text-decoration:none; font-weight:700;">📞 ${escapeHtml(off.tel)}</a></td>
          <td>${escapeHtml(off.duties)}</td>
        </tr>
      `).join('');
    });
}

// --------------------------------------------------------
// MODAL 4: 시민 자유담벼락
// --------------------------------------------------------
let currentWallCategory = '전체';

function openWallModal() {
  document.getElementById('modal-wall').style.display = 'flex';
  loadWallPosts();
}

function filterWallCategory(cat) {
  currentWallCategory = cat;
  document.querySelectorAll('.wall-cat-btn').forEach(b => b.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
  loadWallPosts();
}

function loadWallPosts() {
  fetch(getApiUrl(`/api/wall?cat=${encodeURIComponent(currentWallCategory)}`))
    .then(r => r.json())
    .then(posts => {
      const container = document.getElementById('wall-posts-list');
      if (!posts || posts.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:#64748b;">등록된 담벼락 글이 없습니다. 첫 번째 글을 남겨보세요!</div>`;
        return;
      }
      container.innerHTML = posts.map(p => {
        let badgeClass = 'badge-complaint';
        if (p.category === '개선제안') badgeClass = 'badge-suggestion';
        if (p.category === '칭찬합니다') badgeClass = 'badge-praise';
        if (p.category === '궁금해요') badgeClass = 'badge-question';

        const commentsHtml = (p.comments || []).map(c => `
          <div style="font-size: 11px; background:#f1f5f9; padding: 6px 10px; border-radius: 6px; margin-top: 4px;">
            <strong style="color:#0369a1;">${escapeHtml(c.author)}:</strong> ${escapeHtml(c.text)}
          </div>
        `).join('');

        return `
          <div class="wall-post-card">
            <div class="wall-post-header">
              <span class="wall-post-badge ${badgeClass}">${escapeHtml(p.category)}</span>
              <span style="font-size: 11px; color:#64748b;">📍 ${escapeHtml(p.district || '부산시')} · ${escapeHtml(p.time || '')}</span>
            </div>
            <div class="wall-post-title">${escapeHtml(p.title)}</div>
            <div class="wall-post-content">${escapeHtml(p.content)}</div>
            ${commentsHtml}
            <div class="wall-post-footer">
              <span>작성자: <strong>${escapeHtml(p.author)}</strong></span>
              <button class="wall-like-btn" onclick="likeWallPost('${p.id}')">❤️ 공감 ${p.likes || 0}</button>
            </div>
          </div>
        `;
      }).join('');
    });
}

function openNewPostModal() {
  document.getElementById('modal-new-post').style.display = 'flex';
}

function submitNewWallPost() {
  const cat = document.getElementById('post-category').value;
  const dist = document.getElementById('post-district').value;
  const author = document.getElementById('post-author').value.trim() || STATE.playerName;
  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();

  if (!title || !content) {
    alert("제목과 내용을 모두 작성해 주세요.");
    return;
  }

  fetch(getApiUrl('/api/wall'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: cat, district: dist, author: author, title: title, content: content })
  })
  .then(r => r.json())
  .then(res => {
    if (res.success) {
      alert("✅ 시민 담벼락에 소중한 의견이 등록되었습니다!");
      closeModal('modal-new-post');
      loadWallPosts();
      collectStamp('shout', '시민 담벼락 스탬프');
    }
  });
}

function likeWallPost(postId) {
  fetch(getApiUrl('/api/wall/like'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId })
  })
  .then(r => r.json())
  .then(() => loadWallPosts());
}

// --------------------------------------------------------
// MODAL 5: 16개 구·군 디오라마 포털
// --------------------------------------------------------
function openDistrictsModal() {
  document.getElementById('modal-districts').style.display = 'flex';
  fetch(getApiUrl('/api/districts'))
    .then(r => r.json())
    .then(list => {
      const container = document.getElementById('districts-grid');
      container.innerHTML = list.map(d => `
        <div class="district-card" onclick="switchRealm('${d.code}')">
          <div>
            <div class="district-name">${escapeHtml(d.name)}</div>
            <div class="district-landmark">🌟 ${escapeHtml(d.landmark)}</div>
            <div class="district-desc">${escapeHtml(d.desc)}</div>
          </div>
          <button class="district-warp-btn">🏛️ ${escapeHtml(d.name)} 월드로 이동</button>
        </div>
      `).join('');
    });
}

function switchRealm(realmCode) {
  if (realmCode === STATE.currentRealm) return;
  STATE.currentRealm = realmCode;
  document.getElementById('realm-select').value = realmCode;
  addSystemChat(`🚀 [공간 이동] '${realmCode}' 월드로 이동하였습니다.`);

  // 기존 피어 청소
  for (let id in STATE.peers) removePeer(id);

  // 서버에 룸 이동 알림
  sendWs({
    type: 'join',
    room: realmCode,
    name: STATE.playerName,
    level: STATE.playerLevel,
    title: STATE.playerTitle,
    robe: STATE.playerRobe,
    hat: STATE.playerHat,
    wings: STATE.playerWings,
    belt: STATE.playerBelt,
    x: 0, y: 0, z: 35, ry: 0
  });

  closeModal('modal-districts');
}

// --------------------------------------------------------
// MODAL 6: 부산시청 공식 사진 갤러리
// --------------------------------------------------------
function openPhotosModal() {
  document.getElementById('modal-photos').style.display = 'flex';
  fetch(getApiUrl('/api/busan-photos'))
    .then(r => r.json())
    .then(photos => {
      const container = document.getElementById('photo-gallery-grid');
      container.innerHTML = photos.map(p => `
        <div class="photo-card">
          <div class="photo-mockup">🏛️</div>
          <div class="photo-card-body">
            <div class="photo-card-title">${escapeHtml(p.title)}</div>
            <div class="photo-card-desc">${escapeHtml(p.desc)}</div>
            <div style="margin-top: 8px; display:flex; flex-wrap:wrap; gap:4px;">
              ${(p.features || []).map(f => `<span style="font-size:10px; background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px;">#${escapeHtml(f)}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('');
    });
}

// --------------------------------------------------------
// MODAL 7: 스토리 수첩
// --------------------------------------------------------
function openStoryModal() {
  document.getElementById('modal-story').style.display = 'flex';
}

// --------------------------------------------------------
// MODAL 8: 캐릭터 꾸미기
// --------------------------------------------------------
function openCustomizeModal() {
  document.getElementById('custom-name').value = STATE.playerName;
  document.getElementById('custom-robe').value = STATE.playerRobe;
  document.getElementById('custom-hat').value = STATE.playerHat;
  document.getElementById('custom-wings').value = STATE.playerWings;
  document.getElementById('modal-customize').style.display = 'flex';
}

function saveCustomization() {
  const name = document.getElementById('custom-name').value.trim() || STATE.playerName;
  const robe = document.getElementById('custom-robe').value;
  const hat = document.getElementById('custom-hat').value;
  const wings = document.getElementById('custom-wings').value;

  STATE.playerName = name;
  STATE.playerRobe = robe;
  STATE.playerHat = hat;
  STATE.playerWings = wings;

  // 로컬 메시 갱신
  if (localPlayerMesh) {
    const pos = localPlayerMesh.position.clone();
    const rot = localPlayerMesh.rotation.y;
    scene.remove(localPlayerMesh);
    localPlayerMesh = createAvatarMesh(robe, hat, wings);
    localPlayerMesh.position.copy(pos);
    localPlayerMesh.rotation.y = rot;
    scene.add(localPlayerMesh);
  }

  sendWs({
    type: 'update_look',
    name: name,
    robe: robe,
    hat: hat,
    wings: wings,
    belt: STATE.playerBelt
  });

  closeModal('modal-customize');
  alert("✨ 시민 아바타 스타일이 새롭게 적용되었습니다!");
}

// ========================================================
// 9. 유틸리티 함수
// ========================================================
function loadInitialData() {
  // 초기 담벼락 프리패치
  fetch(getApiUrl('/api/wall')).then(r => r.json()).catch(() => {});
}

function getTimeStr() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMarkdown(str) {
  if (!str) return '';
  let out = escapeHtml(str);
  out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\n/g, '<br>');
  return out;
}

function jsonParse(str) {
  try { return JSON.parse(str); } catch (e) { return {}; }
}
