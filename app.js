
// ========================================================
// ★ 부산광역시 공식 3D 소통 마스코트 부기 (Official Boogi)
// (조롱박형 순백 체형 + 이마 위 빨간 스마트 안경 + 점눈 + 노란 부리 + 동백꽃 스니커즈)
// ========================================================
function createOfficialBoogiMesh() {
  const root = new THREE.Group();

  // 1. 순백의 매끄러운 조롱박형 몸체 (Pear-shaped body)
  const points = [
    new THREE.Vector2(0.00, 0.00),
    new THREE.Vector2(0.24, 0.05),
    new THREE.Vector2(0.38, 0.16),
    new THREE.Vector2(0.44, 0.32),
    new THREE.Vector2(0.42, 0.50),
    new THREE.Vector2(0.34, 0.70),
    new THREE.Vector2(0.27, 0.88),
    new THREE.Vector2(0.24, 1.04),
    new THREE.Vector2(0.18, 1.18),
    new THREE.Vector2(0.00, 1.23)
  ];
  const bodyGeo = new THREE.LatheGeometry(points, 32);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.28,
    metalness: 0.02
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  root.add(body);

  // 2. 머리 위 3가닥 앙증맞은 깃털 (Head Feather Tufts)
  const featherMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const fGeo = new THREE.ConeGeometry(0.045, 0.14, 12);
  
  const fC = new THREE.Mesh(fGeo, featherMat);
  fC.position.set(0, 1.25, -0.04);
  fC.rotation.x = -0.25;
  root.add(fC);

  const fL = new THREE.Mesh(fGeo, featherMat);
  fL.position.set(-0.06, 1.23, -0.04);
  fL.rotation.set(-0.2, 0, 0.25);
  root.add(fL);

  const fR = new THREE.Mesh(fGeo, featherMat);
  fR.position.set(0.06, 1.23, -0.04);
  fR.rotation.set(-0.2, 0, -0.25);
  root.add(fR);

  // 3. 이마 위 빨간 스마트 안경 (Red Smart Glasses on Forehead)
  const glassesGroup = new THREE.Group();
  glassesGroup.position.set(0, 1.08, 0.21);
  glassesGroup.rotation.x = -0.18; // 이마 곡면에 걸침

  const redMat = new THREE.MeshStandardMaterial({
    color: 0xef233c, // 공식 부기 시그니처 레드
    roughness: 0.22,
    metalness: 0.1
  });

  const rimGeo = new THREE.TorusGeometry(0.10, 0.022, 16, 32);
  const rimL = new THREE.Mesh(rimGeo, redMat);
  rimL.position.x = -0.105;
  glassesGroup.add(rimL);

  const rimR = new THREE.Mesh(rimGeo, redMat);
  rimR.position.x = 0.105;
  glassesGroup.add(rimR);

  const bridgeGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.06, 12);
  const bridge = new THREE.Mesh(bridgeGeo, redMat);
  bridge.rotation.z = Math.PI / 2;
  glassesGroup.add(bridge);

  const templeGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.24, 12);
  const templeL = new THREE.Mesh(templeGeo, redMat);
  templeL.position.set(-0.21, 0, -0.11);
  templeL.rotation.x = Math.PI / 2;
  templeL.rotation.y = 0.18;
  glassesGroup.add(templeL);

  const templeR = new THREE.Mesh(templeGeo, redMat);
  templeR.position.set(0.21, 0, -0.11);
  templeR.rotation.x = Math.PI / 2;
  templeR.rotation.y = -0.18;
  glassesGroup.add(templeR);

  root.add(glassesGroup);

  // 4. 깜찍한 점눈 (Two Jet-Black Dot Eyes)
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.15,
    metalness: 0.3
  });
  const eyeGeo = new THREE.SphereGeometry(0.034, 16, 16);

  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.082, 0.90, 0.285);
  eyeL.scale.set(1, 1, 0.6);
  root.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.082, 0.90, 0.285);
  eyeR.scale.set(1, 1, 0.6);
  root.add(eyeR);

  // 눈동자 하이라이트 반사광
  const eyeSpecGeo = new THREE.SphereGeometry(0.010, 8, 8);
  const eyeSpecMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const specL = new THREE.Mesh(eyeSpecGeo, eyeSpecMat);
  specL.position.set(-0.075, 0.91, 0.302);
  root.add(specL);

  const specR = new THREE.Mesh(eyeSpecGeo, eyeSpecMat);
  specR.position.set(0.089, 0.91, 0.302);
  root.add(specR);

  // 5. 둥글납작 노란 부리 (Flat Oval Yellow Beak)
  const beakMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.32
  });
  const beakGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.048, 24);
  const beak = new THREE.Mesh(beakGeo, beakMat);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.77, 0.355);
  beak.scale.set(1.4, 0.95, 1.0);
  beak.castShadow = true;
  root.add(beak);

  const smileGeo = new THREE.TorusGeometry(0.07, 0.006, 8, 24, Math.PI);
  const smileMat = new THREE.MeshBasicMaterial({ color: 0x92400e });
  const smile = new THREE.Mesh(smileGeo, smileMat);
  smile.rotation.x = Math.PI / 2;
  smile.rotation.z = Math.PI;
  smile.position.set(0, 0.77, 0.405);
  root.add(smile);

  // 6. 날개 팔 (Wings with Black Tips)
  const wingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
  const wingTipMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });

  function makeWing(isLeft) {
    const wGroup = new THREE.Group();
    const wBodyGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.34, 16);
    const wBody = new THREE.Mesh(wBodyGeo, wingMat);
    wBody.position.y = -0.17;
    wBody.scale.set(0.65, 1, 1.2);
    wGroup.add(wBody);

    const wTipGeo = new THREE.ConeGeometry(0.065, 0.16, 16);
    const wTip = new THREE.Mesh(wTipGeo, wingTipMat);
    wTip.position.y = -0.40;
    wTip.rotation.z = Math.PI;
    wTip.scale.set(0.65, 1, 1.2);
    wGroup.add(wTip);

    return wGroup;
  }

  const wingL = makeWing(true);
  wingL.position.set(-0.36, 0.65, 0.04);
  wingL.rotation.set(0.15, 0, 0.62);
  root.add(wingL);

  const wingR = makeWing(false);
  wingR.position.set(0.36, 0.65, 0.04);
  wingR.rotation.set(0.15, 0, -0.62);
  root.add(wingR);

  // 7. 뒤쪽 깜찍한 꼬리 (Tail with black tip)
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.32, -0.42);
  tailGroup.rotation.x = -0.45;
  const tailMesh = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 16), wingTipMat);
  tailMesh.rotation.x = -Math.PI / 2;
  tailMesh.scale.set(1.4, 0.6, 1);
  tailGroup.add(tailMesh);
  root.add(tailGroup);

  // 8. 노란 다리 & 동백꽃 블랙 운동화 (Yellow Legs & Camellia Sneakers)
  const legMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35 });
  const soleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const camelliaMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3 });

  function makeLegAndShoe(isLeft) {
    const legGroup = new THREE.Group();

    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.16, 12), legMat);
    leg.position.y = 0.16;
    legGroup.add(leg);

    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.10, 0.26), shoeMat);
    shoe.position.set(0, 0.07, 0.04);
    shoe.castShadow = true;
    legGroup.add(shoe);

    const toe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.10, 16, 1, false, 0, Math.PI), shoeMat);
    toe.rotation.y = Math.PI / 2;
    toe.position.set(0, 0.07, 0.17);
    legGroup.add(toe);

    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.035, 0.30), soleMat);
    sole.position.set(0, 0.018, 0.05);
    legGroup.add(sole);

    for (let si = 0; si < 2; si++) {
      const lace = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.012, 0.024), soleMat);
      lace.position.set(0, 0.122, 0.04 + si * 0.05);
      legGroup.add(lace);
    }

    const cam = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.016, 8), camelliaMat);
    cam.rotation.z = Math.PI / 2;
    cam.position.set(isLeft ? -0.09 : 0.09, 0.07, 0.04);
    legGroup.add(cam);

    const pistil = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.02, 6), legMat);
    pistil.rotation.z = Math.PI / 2;
    pistil.position.set(isLeft ? -0.095 : 0.095, 0.07, 0.04);
    legGroup.add(pistil);

    return legGroup;
  }

  const legL = makeLegAndShoe(true);
  legL.position.set(-0.14, 0, 0);
  root.add(legL);

  const legR = makeLegAndShoe(false);
  legR.position.set(0.14, 0, 0);
  root.add(legR);

  root.userData = {
    isOfficialBoogi: true,
    body, wingL, wingR, legL, legR, eyeL, eyeR, glassesGroup
  };

  return root;
}


function addExp(amount, reason = '시민 활동') {
  if (typeof awardCivicExp === 'function') {
    awardCivicExp(amount, reason);
  }
}

function showToastNotification(text) {
  if (typeof localPlayer !== 'undefined' && localPlayer) {
    showSpeechBubble(localPlayer, text);
  }
  if (typeof addTestimonyItem === 'function') {
    addTestimonyItem('시정 안내', text);
  }
}

function openCivicRankGuideModal() {
  if (typeof openCivicLifeModal === 'function') {
    openCivicLifeModal();
  }
}

function safeRoundRect(ctx, x, y, w, h, r = 12) {
  if (ctx && typeof ctx.roundRect === 'function') {
    try {
      safeRoundRect(ctx, x, y, w, h, r);
      return;
    } catch (e) {}
  }
  if (typeof r === 'number') r = [r, r, r, r];
  const tl = r[0] || 0, tr = r[1] || tl, br = r[2] || tl, bl = r[3] || tr;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x + tl, y);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

// ========================================================
// [부산ON v2.4] 범용 호환성 폴리필 & 브릿지 (블랙스크린 방지)
// ========================================================
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r = 0) {
    if (typeof r === 'number') r = [r, r, r, r];
    const tl = r[0] || 0, tr = r[1] || tl, br = r[2] || tl, bl = r[3] || tr;
    this.beginPath();
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
  };
}

function createCivicNameplate(name, title, level, isNpc = false) {
  if (typeof createNameTagSprite === 'function') {
    return createNameTagSprite(name, title, level, false, isNpc);
  }
  const s = new THREE.Sprite();
  s.position.y = 1.95;
  return s;
}

function registerInteractionArea({ x, z, y = 0, radius = 3.5, name = '', action }) {
  if (typeof registerInteractiveObject === 'function') {
    registerInteractiveObject({
      id: 'area_' + Math.random().toString(36).substr(2, 6),
      pos: { x, y: y || 0, z },
      radius: radius || 3.5,
      prompt: `E키: [${name}]`,
      action: action || (() => {})
    });
  }
}

// ========================================================
// 부산ON 월드 (BUSAN ON WORLD) - 프리미엄 3D 메타버스 엔진
// 부산광역시청 5대 시민광장, 1층 들락날락 도서관, 2층 행복민원실
// 프로시저럴 텍스처, 톤매핑 & 고대비 조명, SD 치비 아바타, 실시간 멀티플레이
// ========================================================

// --------------------------------------------------------
// 1. 글로벌 상태 및 상수 정의
// --------------------------------------------------------
const STATE = {
  avatarArchetype: localStorage.getItem('busan_avatar_archetype') || 'worker', // 'worker', 'officer', 'citizen', 'boogi'
  lastEnteredCivilRoom: null,
  playerName: "열린시민",
  playerLevel: 1,
  playerExp: 20,
  playerTitle: "첫 방문 시민",
  robeColor: localStorage.getItem('busan_robe') || "blue",
  hatType: localStorage.getItem('busan_hat') || "camellia",
  wingsType: localStorage.getItem('busan_wings') || "none",
  hairStyle: localStorage.getItem('busan_hair_style') || "short",
  hairColor: localStorage.getItem('busan_hair_color') || "black",
  skinTone: localStorage.getItem('busan_skin_tone') || "warm",
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
  blue: 0x0284c7,     // 부산 마린 로얄 블루
  white: 0xf8fafc,    // 순백 화이트
  camellia: 0xe11d48, // 동백꽃 레드
  gold: 0xf59e0b,     // 햇살 골드
  green: 0x10b981,    // 녹음 그린
  hanbok: 0x1e1b4b,   // 전통 한복 딥네이비
  denim: 0x2563eb,    // 청량 스트리트 데님
  lavender: 0x8b5cf6, // 로맨틱 라벤더
  blackHair: 0x1e293b,
  brownHair: 0x78350f,
  goldHair: 0xf59e0b,
  silverHair: 0xcbd5e1,
  pinkHair: 0xf472b6,
  oceanHair: 0x0284c7,
  purpleHair: 0x8b5cf6,
  greenHair: 0x10b981,
  warmSkin: 0xffd7ba,
  fairSkin: 0xffdfd3,
  tanSkin: 0xe0a96d
};

// v2.0 다중 청사 월드 그룹 & 인터랙션 캐시
let cityHallWorldGroup = null;
let civilHallWorldGroup = null;
let civilHallInteractables = [];
let civilHallObstacles = [];
let districtWorldGroup = null;
let districtObstacles = [];
let districtInteractables = [];
let cityHallObstaclesBackup = [];
let cityHallInteractablesBackup = [];

// ========================================================
// 1-B. 16개 자치구·군 및 부산시청 종합 상세 데이터베이스 (v2.0)
// ========================================================
const BUSAN_DISTRICT_DETAILS = {
  "BUSAN-HQ": {
    "code": "BUSAN-HQ",
    "name": "부산광역시청 본관",
    "eng": "Busan Metropolitan City Hall",
    "tagline": "다시 태어나도 살고 싶은 부산",
    "address": "부산광역시 연제구 중앙대로 1001",
    "tel": "051-120",
    "official_url": "https://www.busan.go.kr",
    "online_civil_url": "https://www.busan.go.kr/minwon",
    "civil_service": {
      "title": "2층 행복민원실 & 1층 통합안내",
      "counters": [
        {
          "name": "여권발급창구 (1~6번)",
          "desc": "대한민국 여권 신규·갱신, 분실신고, 온라인 여권신청 교부",
          "tel": "051-888-1461"
        },
        {
          "name": "120 바로콜센터 민원창구",
          "desc": "부산시정 전반 120전화상담 및 현장접수",
          "tel": "051-120"
        },
        {
          "name": "시민 무료 법률·노무·세무 상담실",
          "desc": "변호사, 세무사, 노무사 전문상담 (사전예약제)",
          "tel": "051-888-1455"
        },
        {
          "name": "아주라(아이돌봄) 쉼터 & 수유실",
          "desc": "영유아 동반 민원인을 위한 기저귀교환대, 수유공간",
          "tel": "051-888-1451"
        },
        {
          "name": "무인민원발급 키오스크",
          "desc": "24시간 112종 민원서류 즉시 발급 (주민등록, 토지, 지방세 등)",
          "tel": "051-888-1451"
        }
      ]
    },
    "library": {
      "name": "부산도서관 & 1층 시청 들락날락",
      "tel": "051-310-5400",
      "addr": "부산광역시 사상구 사상로310번길 33 (부산도서관) / 시청 1층 들락날락",
      "portal_url": "https://library.busan.go.kr",
      "services": "부산 대표 공공도서관, 3D 미디어아트, 실감형 동화구연, 어린이 복합문화공간, 전자책·오디오북"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "시청앞 국수와보쌈",
          "dish": "마늘보쌈 · 바지락칼국수",
          "desc": "시청 공무원과 인근 주민들이 줄서는 연제구 1등 보쌈 명가",
          "addr": "부산 연제구 시청로 24",
          "tel": "051-865-8892"
        },
        {
          "name": "소문난가야밀면 시청점",
          "dish": "물밀면 · 비빔밀면 · 수제만두",
          "desc": "깊고 시원한 육수와 쫄깃한 면발로 유명한 부산 사계절 별미",
          "addr": "부산 연제구 거제천로 87",
          "tel": "051-866-5562"
        },
        {
          "name": "거제골참숯구이",
          "dish": "참숯 한우생갈비 · 가마솥갈비탕",
          "desc": "진한 국물의 점심 갈비탕과 부드러운 참숯 구이 전문점",
          "addr": "부산 연제구 중앙대로 1043",
          "tel": "051-868-3392"
        }
      ],
      "cafes": [
        {
          "name": "텐퍼센트커피 시청본점",
          "signature": "텐라떼 (아인슈페너) · 스페셜티 아메리카노",
          "desc": "부산에서 전국으로 뻗어나간 스페셜티 커피의 시작점",
          "addr": "부산 연제구 중앙대로 1000"
        },
        {
          "name": "온천천 멜버른 (카페거리)",
          "signature": "리코타 팬케이크 · 플랫화이트",
          "desc": "온천천 벚꽃길을 내려다보는 호주 멜버른 스타일 브런치 카페",
          "addr": "부산 동래구 온천천로 441번길 3"
        }
      ]
    },
    "landmarks": [
      {
        "name": "시민광장 & 부산의 닻",
        "desc": "해양수도 부산을 상징하는 대형 닻 조형물과 음악 분수대"
      },
      {
        "name": "1층 들락날락 어린이 복합문화공간",
        "desc": "미디어아트 월, 3D 동화체험실, 열린 북카페"
      }
    ]
  },
  "DIST-YEONJE": {
    "code": "DIST-YEONJE",
    "name": "연제구청",
    "eng": "Yeonje-gu Office",
    "tagline": "부산의 중심, 살기 좋은 행복도시 연제",
    "address": "부산광역시 연제구 연제로 2",
    "tel": "051-665-4000",
    "official_url": "https://www.yeonje.go.kr",
    "online_civil_url": "https://www.yeonje.go.kr/portal/contents.do?mId=0401010000",
    "civil_service": {
      "title": "연제구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원여권과",
          "desc": "여권 접수 및 교부, 주민등록 등·초본, 인감, 가족관계",
          "tel": "051-665-4261"
        },
        {
          "name": "세무1·2과",
          "desc": "취득세, 등록면허세, 재산세, 자동차세",
          "tel": "051-665-4201"
        },
        {
          "name": "토지정보과",
          "desc": "개별공시지가, 부동산거래신고, 지적측량성과검사",
          "tel": "051-665-4771"
        },
        {
          "name": "연제구 통합 무인민원창구",
          "desc": "365일 연중무휴 주요 민원서류 무인발급",
          "tel": "051-665-4000"
        }
      ]
    },
    "library": {
      "name": "연제도서관",
      "tel": "051-665-5460",
      "addr": "부산광역시 연제구 황령산로 608",
      "portal_url": "https://www.yeonje.go.kr/library",
      "services": "종합자료실, 디지털자료실, 어린이도서관, 전자도서관 포털"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "거제리 굴다리돼지국밥",
          "dish": "순대국밥 · 따로국밥",
          "desc": "진한 뚝배기 사골육수와 푸짐한 건더기의 연산동 로컬 노포",
          "addr": "부산 연제구 거제천로 104",
          "tel": "051-864-1188"
        },
        {
          "name": "연산동 시골통돼지볶음",
          "dish": "통돼지 김치찌개 · 볶음",
          "desc": "신선한 통돼지고기와 숙성 묵은지가 어우러진 밥도둑 명가",
          "addr": "부산 연제구 중앙대로1075번길 9",
          "tel": "051-851-0822"
        },
        {
          "name": "오방맛길 참숯뒷통구이",
          "dish": "참숯 뽈살 · 뒷통구이",
          "desc": "연산교차로 오방맛길의 쫄깃한 식감 자랑 명품 특수부위",
          "addr": "부산 연제구 고분로13번길 25",
          "tel": "051-863-9288"
        }
      ],
      "cafes": [
        {
          "name": "연산 라메르 카페",
          "signature": "시그니처 크림라떼 · 크루아상",
          "desc": "도심 속 아늑한 정원 분위기와 감성 베이커리",
          "addr": "부산 연제구 반송로 36"
        },
        {
          "name": "카페 테라스온",
          "signature": "바닐라빈 빈라떼 · 에그타르트",
          "desc": "온천천 시민공원 진입로의 햇살 가득 테라스 카페",
          "addr": "부산 연제구 세병로 22"
        }
      ]
    },
    "landmarks": [
      {
        "name": "온천천 시민공원",
        "desc": "도심 속 생태하천, 봄철 벚꽃과 유채꽃 명소 산책로"
      },
      {
        "name": "연산동 고분군",
        "desc": "삼국시대 거칠산국 지배층의 대형 고분 유적지"
      }
    ]
  },
  "DIST-DONGNAE": {
    "code": "DIST-DONGNAE",
    "name": "동래구청",
    "eng": "Dongnae-gu Office",
    "tagline": "역사와 전통이 꽃피는 문화관광도시 동래",
    "address": "부산광역시 동래구 충렬대로237번길 93",
    "tel": "051-550-4000",
    "official_url": "https://www.dongnae.go.kr",
    "online_civil_url": "https://www.dongnae.go.kr/index.dongnae?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "동래구청 2025 신청사 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원여권과 (신청사 1층)",
          "desc": "여권접수·교부, 주민등록, 가족관계, 어디서나민원",
          "tel": "051-550-4261"
        },
        {
          "name": "토지정보과 (신청사 1층)",
          "desc": "지적도, 지적측량, 도로명주소, 공시지가",
          "tel": "051-550-4771"
        },
        {
          "name": "세무1·2과 (신청사 2층)",
          "desc": "지방소득세, 취득세, 등록면허세, 체납세 징수",
          "tel": "051-550-4201"
        },
        {
          "name": "일자리경제과 (신청사 3층)",
          "desc": "동래구 중소상공인 지원, 지역화폐, 사회적기업 육성",
          "tel": "051-550-4471"
        },
        {
          "name": "스마트 무인민원발급존 (1층 로비)",
          "desc": "신청사 24시간 연중무휴 무인발급기",
          "tel": "051-550-4000"
        }
      ]
    },
    "library": {
      "name": "동래읍성도서관 & 안락누리도서관",
      "tel": "051-550-6900",
      "addr": "부산광역시 동래구 명륜로112번가길 43 (동래읍성도서관)",
      "portal_url": "https://www.dongnae.go.kr/tour/index.dongnae?menuCd=DOM_000000302000000000",
      "services": "동래역사 특화자료실, 전자도서관, 어린이 열람실, 주민 독서동아리"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "동래할매파전",
          "dish": "전통 동래파전 · 찹쌀동동주",
          "desc": "부산시 무형문화재 제3호, 4대째 이어오는 80년 전통 겉바속촉 파전",
          "addr": "부산 동래구 명륜로94번길 43-10",
          "tel": "051-552-0792"
        },
        {
          "name": "동래삼계탕",
          "dish": "궁중약계탕 · 전통삼계탕",
          "desc": "동래 주민들이 복날뿐 아니라 사계절 보양하러 찾는 맑고 진한 삼계탕",
          "addr": "부산 동래구 동래로116번길 39",
          "tel": "051-555-2464"
        },
        {
          "name": "원조 조방낙지 본점",
          "dish": "낙곱새 (낙지+곱창+새우) 볶음",
          "desc": "매콤칼칼한 양념과 당면 사리의 원조 조방낙지 스타일의 진수",
          "addr": "부산 동래구 명륜로94번길 42",
          "tel": "051-555-7763"
        }
      ],
      "cafes": [
        {
          "name": "모모스커피 온천장 본점",
          "signature": "월드챔피언 드립커피 · 맛있는 라떼",
          "desc": "전유향 월드바리스타 챔피언십 우승자의 본진이자 대나무 정원 카페",
          "addr": "부산 동래구 오시게로 20"
        },
        {
          "name": "온천장 브라운피크 고택",
          "signature": "흑임자 크림라떼 · 곶감 버터롤",
          "desc": "100년 된 고택을 감각적으로 재생한 동래온천 힐링 카페",
          "addr": "부산 동래구 금강공원로 26"
        }
      ]
    },
    "landmarks": [
      {
        "name": "동래읍성지 & 복천고분군",
        "desc": "임진왜란 송상현 부사의 충절이 깃든 역사유적지와 푸른 잔디 언덕"
      },
      {
        "name": "동래온천 노천 족탕",
        "desc": "신라시대부터 유명한 국내 최고(最古) 알칼리성 식염천 온천수"
      }
    ]
  },
  "DIST-HAEUNDAE": {
    "code": "DIST-HAEUNDAE",
    "name": "해운대구청",
    "eng": "Haeundae-gu Office",
    "tagline": "살기 좋은 도시, 오고 싶은 해운대",
    "address": "부산광역시 해운대구 중동2로 11",
    "tel": "051-749-4000",
    "official_url": "https://www.haeundae.go.kr",
    "online_civil_url": "https://www.haeundae.go.kr/index.do?menuCd=DOM_000000102000000000",
    "civil_service": {
      "title": "해운대구청 종합민원실 (본관 1층)",
      "counters": [
        {
          "name": "민원여권과",
          "desc": "해운대구민 및 외국인 여권신청, 주민등록, 인감",
          "tel": "051-749-4261"
        },
        {
          "name": "세무1·2과",
          "desc": "재산세, 종합소득세, 자동차세 상담 및 지방세 납부",
          "tel": "051-749-4201"
        },
        {
          "name": "관광문화과",
          "desc": "해수욕장 시설 이용, 관광 축제, 해운대 모래축제 안내",
          "tel": "051-749-4061"
        },
        {
          "name": "해운대 원클릭 무인민원존",
          "desc": "해운대구청 정문 24시간 무인민원발급기 운영",
          "tel": "051-749-4000"
        }
      ]
    },
    "library": {
      "name": "해운대인문학도서관 & 우동작은도서관",
      "tel": "051-749-6580",
      "addr": "부산광역시 해운대구 좌동순환로 15번길 22",
      "portal_url": "https://www.haeundae.go.kr/humanitieslib/",
      "services": "인문학 특화자료실, 해운대 디지털 아카이브, 전자도서관 포털, 옥상 하늘정원"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "해운대 암소갈비집",
          "dish": "한우 생갈비 · 감자사리",
          "desc": "기와집 한옥 마당에서 즐기는 부드러운 갈비와 특제 육수 감자사리",
          "addr": "부산 해운대구 중동2로10번길 325",
          "tel": "051-746-0038"
        },
        {
          "name": "금수복국 해운대본점",
          "dish": "은복지리 · 밀복뚝배기 · 복튀김",
          "desc": "1970년부터 뚝배기 복국을 최초로 탄생시킨 해운대 대표 해장 명가",
          "addr": "부산 해운대구 중동1로43번길 23",
          "tel": "051-742-3600"
        },
        {
          "name": "해운대 원조할매국밥",
          "dish": "가마솥 소고기국밥 · 선지국밥",
          "desc": "60년 동안 커다란 가마솥에서 우려낸 맑고 칼칼한 소고기국밥 노포",
          "addr": "부산 해운대구 구남로21번길 27",
          "tel": "051-746-0387"
        }
      ],
      "cafes": [
        {
          "name": "랑데자뷰 해운대점",
          "signature": "오로라 에이드 · 제주 감성 플랫화이트",
          "desc": "통창 너머 해운대 백사장과 동백섬이 한눈에 펼쳐지는 오션뷰 핫플",
          "addr": "부산 해운대구 달맞이길62번길 23"
        },
        {
          "name": "엣지993 미포점",
          "signature": "바닐라빈 라떼 · 크로플",
          "desc": "블루라인파크 해변열차 인근 미포 끝자락 바다 위 루프탑",
          "addr": "부산 해운대구 달맞이길62번길 78"
        }
      ]
    },
    "landmarks": [
      {
        "name": "해운대 해수욕장 & 동백섬",
        "desc": "대한민국 대표 해변 백사장과 누리마루 APEC 하우스 산책로"
      },
      {
        "name": "센텀시티 & 영화의전당",
        "desc": "부산국제영화제(BIFF)의 중심이자 세계 최대 백화점이 있는 첨단단지"
      }
    ]
  },
  "DIST-BUSANJIN": {
    "code": "DIST-BUSANJIN",
    "name": "부산진구청",
    "eng": "Busanjin-gu Office",
    "tagline": "시민의 힘으로 도약하는 부산진구",
    "address": "부산광역시 부산진구 시민공원로 30",
    "tel": "051-605-4000",
    "official_url": "https://www.busanjin.go.kr",
    "online_civil_url": "https://www.busanjin.go.kr/index.busanjin?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "부산진구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원여권과",
          "desc": "서면 중심 상권 및 구민 여권 발급, 주민등록",
          "tel": "051-605-4261"
        },
        {
          "name": "세무1·2과",
          "desc": "상가 취득세, 법인 지방소득세, 자동차세",
          "tel": "051-605-4201"
        },
        {
          "name": "일자리경제과",
          "desc": "전포카페거리 소상공인 지원, 청년취업 사관학교",
          "tel": "051-605-4471"
        },
        {
          "name": "부산진구 스마트 무인민원센터",
          "desc": "부산시민공원 인접 24시간 자동발급",
          "tel": "051-605-4000"
        }
      ]
    },
    "library": {
      "name": "부산진구립도서관 & 부산시민공원 잔디도서관",
      "tel": "051-605-6370",
      "addr": "부산광역시 부산진구 백양대로 160",
      "portal_url": "https://www.busanjin.go.kr/lib",
      "services": "백양산 숲속 도서관, 시민공원 북피크닉 세트 대여, 멀티미디어 전자책"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "송정3대국밥",
          "dish": "돼지국밥 · 수육백반 · 찹쌀순대",
          "desc": "1946년부터 서면 국밥골목을 3대째 굳건히 지켜온 맑고 깊은 국밥",
          "addr": "부산 부산진구 서면로68번길 33",
          "tel": "051-806-5722"
        },
        {
          "name": "기장손칼국수",
          "dish": "손칼국수 · 비빔칼국수 · 김밥",
          "desc": "투박하게 썰어낸 쫄깃한 면발과 쑥갓, 다진 마늘의 감칠맛",
          "addr": "부산 부산진구 서면로 56",
          "tel": "051-806-6094"
        },
        {
          "name": "개금밀면 본점",
          "dish": "물밀면 · 비빔밀면 · 어묵만두",
          "desc": "1966년 개금골목시장에서 시작된 부산 3대 밀면 원조 명가",
          "addr": "부산 부산진구 가야대로482번길 9-4",
          "tel": "051-892-3466"
        }
      ],
      "cafes": [
        {
          "name": "블랙업커피 서면본점",
          "signature": "'해, 수염' 소금커피 · 핸드드립 싱글오리진",
          "desc": "단짠 크림과 산뜻한 콜드브루의 조화로 전국적인 명성을 얻은 곳",
          "addr": "부산 부산진구 서전로10번길 41"
        },
        {
          "name": "베르크 로스터스 (전포카페거리)",
          "signature": "베르크 블렌드 베이비 · 플랫화이트",
          "desc": "전포동 골목의 감각적인 지하 로스팅 쇼룸과 교회 의자 인테리어",
          "addr": "부산 부산진구 서전로58번길 115"
        }
      ]
    },
    "landmarks": [
      {
        "name": "부산시민공원",
        "desc": "하야리아 미군 부대 부지가 시민의 품으로 돌아온 47만㎡의 도심 센트럴파크"
      },
      {
        "name": "서면 젊음의 거리 & 전포카페거리",
        "desc": "부산 최대 번화가와 트렌디한 감성 카페들이 밀집한 뉴욕타임스 추천 명소"
      }
    ]
  },
  "DIST-SUYEONG": {
    "code": "DIST-SUYEONG",
    "name": "수영구청",
    "eng": "Suyeong-gu Office",
    "tagline": "아름다운 도시, 행복한 수영",
    "address": "부산광역시 수영구 남천동로 100",
    "tel": "051-610-4000",
    "official_url": "https://www.suyeong.go.kr",
    "online_civil_url": "https://www.suyeong.go.kr/index.suyeong?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "수영구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원여권과",
          "desc": "광안리 해변 인접 주민 여권 발급, 주민등록",
          "tel": "051-610-4261"
        },
        {
          "name": "세무과",
          "desc": "주택분 재산세, 지방소득세, 등록면허세",
          "tel": "051-610-4201"
        },
        {
          "name": "문화관광과",
          "desc": "광안리 M 드론라이트쇼, 어방축제, 해양레포츠 안내",
          "tel": "051-610-4061"
        },
        {
          "name": "수영 스마트 무인발급기",
          "desc": "구청 1층 로비 24시간 무인민원기",
          "tel": "051-610-4000"
        }
      ]
    },
    "library": {
      "name": "수영구도서관 & 망미도서관",
      "tel": "051-610-4511",
      "addr": "부산광역시 수영구 남천동로 108번길 57",
      "portal_url": "https://www.suyeong.go.kr/library",
      "services": "금련산 숲속 도서관, 수영사적 바다특화자료실, 전자책 대출"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "광안리 언양불고기 부산집",
          "dish": "참숯 언양불고기 · 김치찌개",
          "desc": "광안리 바닷가에서 30년 넘게 달콤짭조름한 숯불 불고기를 굽는 명소",
          "addr": "부산 수영구 남천바다로 32",
          "tel": "051-754-1004"
        },
        {
          "name": "수영돼지국밥",
          "dish": "돼지국밥 · 순대국밥 · 모둠수육",
          "desc": "잡내 없이 깔끔하고 맑은 국물로 수요미식회에 소개된 수영구 대표 국밥",
          "addr": "부산 수영구 무학로9번길 33",
          "tel": "051-758-5046"
        },
        {
          "name": "남천동 다리집",
          "dish": "가래떡 떡볶이 · 대왕 오징어튀김",
          "desc": "통가래떡을 진한 고추장 양념에 버무려 가위로 썰어먹는 남천동 떡볶이 성지",
          "addr": "부산 수영구 남천바다로10번길 70",
          "tel": "051-625-0130"
        }
      ],
      "cafes": [
        {
          "name": "밀락더마켓 블루부스",
          "signature": "밀락 오션라떼 · 수제 젤라또",
          "desc": "민락항 수변에 지어진 광안대교 파노라마 뷰 복합문화공간 스탠드",
          "addr": "부산 수영구 민락수변로17번길 56"
        },
        {
          "name": "남천동 빵천동 메종이이",
          "signature": "소금버터롤 · 아몬드 크림라떼",
          "desc": "전국 빵순이들이 순례하는 남천동 빵천동 골목의 고즈넉한 베이커리",
          "addr": "부산 수영구 좌수영로 139"
        }
      ]
    },
    "landmarks": [
      {
        "name": "광안리 해수욕장 & 광안대교",
        "desc": "주말마다 하늘을 수놓는 상설 M 드론라이트쇼와 다이아몬드 브릿지 야경"
      },
      {
        "name": "수영사적공원",
        "desc": "조선시대 경상좌도 수군절도사영이 있던 유서 깊은 성곽 유적지"
      }
    ]
  },
  "DIST-NAM": {
    "code": "DIST-NAM",
    "name": "남구청",
    "eng": "Nam-gu Office",
    "tagline": "세계가 찾는 평화도시, 활력 넘치는 남구",
    "address": "부산광역시 남구 못골로 19",
    "tel": "051-607-4000",
    "official_url": "https://www.bsnamgu.go.kr",
    "online_civil_url": "https://www.bsnamgu.go.kr/index.namgu?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "남구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원여권과",
          "desc": "대연동·용호동 주민 여권 및 가족관계 등록",
          "tel": "051-607-4261"
        },
        {
          "name": "세무1·2과",
          "desc": "문현금융단지 법인세무, 취득세, 재산세",
          "tel": "051-607-4201"
        },
        {
          "name": "복지지원과",
          "desc": "국가유공자 예우, 노인 복지수당, 장애인 지원",
          "tel": "051-607-4311"
        },
        {
          "name": "남구청 24시간 무인발급기",
          "desc": "정문 입구 위치, 편리한 112종 민원서류 발급",
          "tel": "051-607-4000"
        }
      ]
    },
    "library": {
      "name": "부산남구도서관 & 분포도서관",
      "tel": "051-607-4731",
      "addr": "부산광역시 남구 못골번영로 71번길 44",
      "portal_url": "https://www.bsnamgu.go.kr/library",
      "services": "UN평화특구 특화 코너, 용호만 바다전망 열람실, 모바일 전자책"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "쌍둥이돼지국밥",
          "dish": "수육백반 · 돼지국밥",
          "desc": "촉촉한 항정살 수육과 따뜻한 국물이 일품인 대연동의 전설적인 맛집",
          "addr": "부산 남구 유엔평화로 35-1",
          "tel": "051-628-7020"
        },
        {
          "name": "용호동 할매팥빙수단팥죽",
          "dish": "가마솥 팥빙수 (3,500원) · 단팥죽",
          "desc": "직접 쑨 통팥과 사과잼이 올라간 착한 가격의 40년 전통 팥빙수",
          "addr": "부산 남구 용호로90번길 24",
          "tel": "051-623-9946"
        },
        {
          "name": "대연동 진주횟집",
          "dish": "자연산 참가자미 물회 · 생우럭매운탕",
          "desc": "못골시장 인근 현지인들이 사계절 찾는 시원 칼칼한 회비빔밥",
          "addr": "부산 남구 못골로 29",
          "tel": "051-624-3450"
        }
      ],
      "cafes": [
        {
          "name": "오륙도 해파랑카페",
          "signature": "오륙도 소금라떼 · 수제 르뱅쿠키",
          "desc": "동해와 남해가 만나는 오륙도 스카이워크 절벽 위 오션뷰 테라스",
          "addr": "부산 남구 오륙도로 137"
        },
        {
          "name": "빌라드엘르 (유엔공원)",
          "signature": "바닐라빈 라떼 · 브라우니",
          "desc": "UN기념공원의 푸른 숲과 수목 산책로를 마주한 온실 정원 카페",
          "addr": "부산 남구 유엔평화로 76번길 26"
        }
      ]
    },
    "landmarks": [
      {
        "name": "UN기념공원 & 평화공원",
        "desc": "세계 유일의 유엔군 참전용사 안장 묘역이자 사계절 꽃이 피는 평화의 숲"
      },
      {
        "name": "오륙도 스카이워크",
        "desc": "35미터 해안 절벽 위에 설치된 투명 유리바닥 전망대"
      }
    ]
  },
  "DIST-JUNG": {
    "code": "DIST-JUNG",
    "name": "중구청",
    "eng": "Jung-gu Office",
    "tagline": "역사와 문화가 살아 숨 쉬는 부산의 심장",
    "address": "부산광역시 중구 중구로 120",
    "tel": "051-600-4000",
    "official_url": "https://www.junggu.busan.kr",
    "online_civil_url": "https://www.junggu.busan.kr/index.junggu?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "중구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원봉사과",
          "desc": "원도심 주민 여권 발급, 가족관계, 주민등록",
          "tel": "051-600-4261"
        },
        {
          "name": "세무과",
          "desc": "남포동·광복동 상가 지방소득세, 재산세",
          "tel": "051-600-4201"
        },
        {
          "name": "시장경제과",
          "desc": "자갈치시장·국제시장 전통시장 현대화 및 온누리상품권",
          "tel": "051-600-4471"
        },
        {
          "name": "중구청 무인민원발급기",
          "desc": "구청 1층 및 남포역·중앙역 지하철역사 운영",
          "tel": "051-600-4000"
        }
      ]
    },
    "library": {
      "name": "중구립보수동책방골목 어린이도서관",
      "tel": "051-600-4781",
      "addr": "부산광역시 중구 책방골목길 8",
      "portal_url": "https://www.bsjunggu.go.kr/library",
      "services": "헌책방 역사 아카이브, 고서 전시, 동화 구연, 어린이 북카페"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "이재모피자 본점",
          "dish": "이재모 크러스트 피자 · 오븐치즈스파게티",
          "desc": "100% 임실치즈를 듬뿍 올려 오픈런 없이는 맛보기 힘든 부산 최고의 피자",
          "addr": "부산 중구 광복중앙로 31",
          "tel": "051-245-1478"
        },
        {
          "name": "18번완당집",
          "dish": "원조 완당 · 완당세트 · 유부초밥",
          "desc": "1947년부터 종잇장처럼 얇은 피에 고기소를 넣어 목넘김이 예술인 완당",
          "addr": "부산 중구 비프광장로 31-1",
          "tel": "051-245-0018"
        },
        {
          "name": "자갈치 백화양곱창",
          "dish": "연탄불 모둠 양곱창 구이 · 양볶음밥",
          "desc": "자갈치시장 골목에서 할머니들이 연탄 화로에 직접 구워주는 원조 곱창",
          "addr": "부산 중구 자갈치로23번길 6",
          "tel": "051-245-0105"
        }
      ],
      "cafes": [
        {
          "name": "노티스 (NOTICE)",
          "signature": "쌀창고 아인슈페너 · 휘낭시에",
          "desc": "1950년에 지어진 오래된 쌀 창고를 개조해 북항 바다를 바라보는 빈티지 카페",
          "addr": "부산 중구 대교로 135"
        },
        {
          "name": "바우노바 백산",
          "signature": "클래식 드립커피 · 티라미수",
          "desc": "백산기념관 골목 앤틱한 가구와 LP 음악이 흐르는 장인의 로스터리",
          "addr": "부산 중구 백산길 9"
        }
      ]
    },
    "landmarks": [
      {
        "name": "용두산공원 부산타워",
        "desc": "부산 원도심과 북항, 자갈치 앞바다를 360도로 조망하는 부산의 상징 타워"
      },
      {
        "name": "자갈치시장 & 국제시장 & 비프(BIFF)광장",
        "desc": "생생한 자갈치 아지매들의 활기와 영화 역사가 서린 영화·쇼핑 거리"
      }
    ]
  },
  "DIST-SEO": {
    "code": "DIST-SEO",
    "name": "서구청",
    "eng": "Seo-gu Office",
    "tagline": "딱 살기 좋은 도시 서구",
    "address": "부산광역시 서구 구덕로 120",
    "tel": "051-240-4000",
    "official_url": "https://www.bsseogu.go.kr",
    "online_civil_url": "https://www.bsseogu.go.kr/index.bsseogu?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "서구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원봉사과",
          "desc": "여권 발급, 주민등록, 인감증명, 가족관계",
          "tel": "051-240-4261"
        },
        {
          "name": "세무과",
          "desc": "공동주택 재산세, 자동차세, 등록세",
          "tel": "051-240-4201"
        },
        {
          "name": "해양수산과",
          "desc": "공동어시장 현대화, 송도해수욕장 시설 관리",
          "tel": "051-240-4501"
        },
        {
          "name": "서구청 365 무인민원발급창구",
          "desc": "구청 1층 현관 무인민원발급기 운영",
          "tel": "051-240-4000"
        }
      ]
    },
    "library": {
      "name": "구덕도서관 & 서구어린이도서관",
      "tel": "051-240-4581",
      "addr": "부산광역시 서구 서대신동3가 1-1",
      "portal_url": "https://www.bsseogu.go.kr/library",
      "services": "구덕산 숲속 힐링 도서관, 어린이 독서캠프, 스마트 전자도서관"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "송도공원",
          "dish": "참숯 소갈비 · 런치 정식",
          "desc": "송도 바다 앞 통창으로 케이블카가 지나가는 풍경을 보며 즐기는 갈비",
          "addr": "부산 서구 송도해변로 149",
          "tel": "051-246-8800"
        },
        {
          "name": "암남공원 해녀 조개구이촌",
          "dish": "모둠 조개구이 · 전복낙지호롱",
          "desc": "해녀들이 갓 채취한 가리비와 치즈, 버터를 연탄불에 올려 먹는 바다 포차",
          "addr": "부산 서구 암남공원로 127",
          "tel": "051-240-4000"
        },
        {
          "name": "18번완당 서대신동 발상지",
          "dish": "발상지 완당면 · 비빔모밀",
          "desc": "완당의 역사가 시작된 서대신동 골목의 고즈넉한 완당 전문 노포",
          "addr": "부산 서구 구덕로321번길 8",
          "tel": "051-242-5328"
        }
      ],
      "cafes": [
        {
          "name": "송도 TCC (The Cafe Coffee)",
          "signature": "송도 바다 소금커피 · 앙버터",
          "desc": "송도해수욕장 백사장 정면에서 케이블카를 바라보는 루프탑 영화관 카페",
          "addr": "부산 서구 송도해변로 143"
        },
        {
          "name": "구덕산 숲소리",
          "signature": "대추생강차 · 쑥 와플",
          "desc": "구덕산 수원지 편백나무 숲길에 위치한 새소리 가득 힐링 찻집",
          "addr": "부산 서구 꽃마을로 163"
        }
      ]
    },
    "landmarks": [
      {
        "name": "송도해수욕장 & 송도해상케이블카",
        "desc": "대한민국 제1호 공설 해수욕장과 바다 위 86m를 가로지르는 크리스탈 케이블카"
      },
      {
        "name": "암남공원 & 송도용궁구름다리",
        "desc": "기암절벽과 해안 트레킹 데크, 무인도 동섬을 잇는 공중 구름다리"
      }
    ]
  },
  "DIST-DONG": {
    "code": "DIST-DONG",
    "name": "동구청",
    "eng": "Dong-gu Office",
    "tagline": "북항시대의 중심, 희망찬 동구",
    "address": "부산광역시 동구 구청로 1",
    "tel": "051-440-4000",
    "official_url": "https://www.bsdonggu.go.kr",
    "online_civil_url": "https://www.bsdonggu.go.kr/index.donggu?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "동구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원봉사과",
          "desc": "부산역 인접 민원인 여권 발급, 가족관계, 주민등록",
          "tel": "051-440-4261"
        },
        {
          "name": "세무과",
          "desc": "북항재개발 관련 세무 상담, 취득세, 재산세",
          "tel": "051-440-4201"
        },
        {
          "name": "북항개발지원과",
          "desc": "북항 친수공원, 오페라하우스, 랜드마크부지 개발 안내",
          "tel": "051-440-4701"
        },
        {
          "name": "부산역사 내 24시간 무인민원존",
          "desc": "부산역 2층 대합실 및 구청 1층 무인발급기",
          "tel": "051-440-4000"
        }
      ]
    },
    "library": {
      "name": "동구어린이영어도서관 & 수정도서관",
      "tel": "051-440-4841",
      "addr": "부산광역시 동구 망양로 589",
      "portal_url": "https://www.bsdonggu.go.kr/library",
      "services": "초량이바구길 전망 도서관, 영어 원서 열람, 모바일 오디오북"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "신발원 (차이나타운)",
          "dish": "고기만두 · 군만두 · 꽈배기",
          "desc": "1951년 개업 이래 백종원의 3대천왕에 나온 겉바속촉 육즙 폭발 수제만두",
          "addr": "부산 동구 대영로243번길 62",
          "tel": "051-467-0177"
        },
        {
          "name": "본전돼지국밥",
          "dish": "돼지국밥 · 순대국밥 · 부추무침",
          "desc": "부산역 1번 출구 앞 늘 긴 줄이 늘어서는 깔끔하고 시원한 맑은 국밥",
          "addr": "부산 동구 중앙대로214번길 3-8",
          "tel": "051-441-0865"
        },
        {
          "name": "초량불백 본점",
          "dish": "원조 불고기백반 (초량 육거리)",
          "desc": "택시 기사님들의 입맛을 사로잡은 40년 전통 매콤달콤 돼지불백",
          "addr": "부산 동구 초량로 36",
          "tel": "051-464-0454"
        }
      ],
      "cafes": [
        {
          "name": "초량1941",
          "signature": "바닐라 우유 · 홍차 우유 · 타르트",
          "desc": "1941년 지어진 일본식 목조 적산가옥을 재생한 숲속 우유 카페",
          "addr": "부산 동구 망양로 533-5"
        },
        {
          "name": "브라운핸즈 백제",
          "signature": "백제 바닐라빈 라떼 · 브라우니",
          "desc": "1927년 부산 최초의 근대식 종합병원인 백제병원을 재생한 빈티지 카페",
          "addr": "부산 동구 중앙대로209번길 16"
        }
      ]
    },
    "landmarks": [
      {
        "name": "초량이바구길 168계단 & 모노레일",
        "desc": "피란민들의 삶의 애환이 깃든 산복도로 계단과 부산항 전경을 내려다보는 모노레일"
      },
      {
        "name": "부산역 & 북항친수공원",
        "desc": "유라시아 철도의 시발점이자 부산 미래를 이끌 북항 수변 공원"
      }
    ]
  },
  "DIST-YEONGDO": {
    "code": "DIST-YEONGDO",
    "name": "영도구청",
    "eng": "Yeongdo-gu Office",
    "tagline": "해양문화 1번지, 아름다운 섬 영도",
    "address": "부산광역시 영도구 태종로 423",
    "tel": "051-419-4000",
    "official_url": "https://www.yeongdo.go.kr",
    "online_civil_url": "https://www.yeongdo.go.kr/index.yeongdo?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "영도구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원봉사과",
          "desc": "도서지역 주민 여권 발급, 선원 관련 주민등록",
          "tel": "051-419-4261"
        },
        {
          "name": "세무과",
          "desc": "선박세, 취득세, 재산세, 지방소득세",
          "tel": "051-419-4201"
        },
        {
          "name": "해양항만과",
          "desc": "깡깡이예술마을 선박 수리, 연안 정비, 태종대 공원 안내",
          "tel": "051-419-4501"
        },
        {
          "name": "영도구청 24시간 스마트발급존",
          "desc": "구청 1층 무인발급기",
          "tel": "051-419-4000"
        }
      ]
    },
    "library": {
      "name": "영도도서관 & 남항작은도서관",
      "tel": "051-419-5660",
      "addr": "부산광역시 영도구 와치로 209",
      "portal_url": "https://www.yeongdo.go.kr/library",
      "services": "봉래산 조망 도서관, 해양문화 특화자료 코너, 전자책 키오스크"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "달뜨네 (흰여울마을)",
          "dish": "시락국밥 · 스지된장찌개",
          "desc": "바다를 내려다보며 즐기는 정갈하고 시원한 영도 어머니의 밥상",
          "addr": "부산 영도구 절영로 205",
          "tel": "051-418-2266"
        },
        {
          "name": "제주복국 영도본점",
          "dish": "메밀 까치복지리 · 복수육",
          "desc": "태종대 초입에서 맑고 시원한 복국으로 전국 식도락가의 사랑을 받는 곳",
          "addr": "부산 영도구 해양로 39",
          "tel": "051-405-5050"
        },
        {
          "name": "남항시장 재기돼지국밥",
          "dish": "토렴식 따로국밥 · 모둠순대",
          "desc": "남항시장 안에서 가마솥 토렴으로 밥알에 육수가 깊게 밴 전통 돼지국밥",
          "addr": "부산 영도구 절영로49번길 25",
          "tel": "051-418-0526"
        }
      ],
      "cafes": [
        {
          "name": "피아크 (P.ARK)",
          "signature": "피아크 블렌드 라떼 · 밀크 크러핀",
          "desc": "오륙도와 북항 바다가 180도로 펼쳐지는 국내 최대 규모의 복합 오션뷰 카페",
          "addr": "부산 영도구 해양로 195번길 180"
        },
        {
          "name": "신기산업 & 신기숲",
          "signature": "신기라떼 · 말차 테린느",
          "desc": "선물 방울 공장을 감각적으로 개조한 루프탑과 숲속 고요한 대나무 카페",
          "addr": "부산 영도구 와치로51번길 2"
        }
      ]
    },
    "landmarks": [
      {
        "name": "태종대 국립공원 & 다누비열차",
        "desc": "울창한 숲과 기암절벽, 대한해협 바다가 어우러진 국가 지정 명승지"
      },
      {
        "name": "흰여울문화마을 & 절영해안산책로",
        "desc": "영화 '변호인' 촬영지이자 절벽 위 파란 바다를 따라 걷는 한국의 산토리니"
      }
    ]
  },
  "DIST-BUK": {
    "code": "DIST-BUK",
    "name": "북구청",
    "eng": "Buk-gu Office",
    "tagline": "낙동강의 자연과 사람이 어우러지는 희망 북구",
    "address": "부산광역시 북구 낙동대로1570번길 33",
    "tel": "051-309-4000",
    "official_url": "https://www.bsbukgu.go.kr",
    "online_civil_url": "https://www.bsbukgu.go.kr/index.bukgu?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "북구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원봉사과",
          "desc": "덕천·화명·구포 주민 여권 발급, 주민등록",
          "tel": "051-309-4261"
        },
        {
          "name": "세무1·2과",
          "desc": "아파트 재산세, 지방소득세, 자동차세",
          "tel": "051-309-4201"
        },
        {
          "name": "환경위생과",
          "desc": "구포시장 식품위생, 낙동강 생태계 보전",
          "tel": "051-309-4471"
        },
        {
          "name": "북구청 스마트 무인발급존",
          "desc": "구청 현관 365일 무인발급기",
          "tel": "051-309-4000"
        }
      ]
    },
    "library": {
      "name": "화명도서관 & 구포도서관",
      "tel": "051-309-6460",
      "addr": "부산광역시 북구 화명신도시로 115",
      "portal_url": "https://www.bsbukgu.go.kr/library",
      "services": "화명생태공원 인접 도서관, 낙동강 생태특화자료실, 어린이 전자도서관"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "덕천고가",
          "dish": "가마솥 장작불 진곰탕 · 순대국밥",
          "desc": "대형 무쇠 가마솥에 장작불을 때서 우려내는 보약 같은 진한 국물",
          "addr": "부산 북구 만덕대로 15",
          "tel": "051-337-1422"
        },
        {
          "name": "하동재첩국 구포본점",
          "dish": "하동 재첩진국 · 재첩회덮밥",
          "desc": "낙동강 하구 하동 섬진강 재첩의 시원하고 맑은 감칠맛을 내는 40년 전통",
          "addr": "부산 북구 구포만세길 85",
          "tel": "051-332-6842"
        },
        {
          "name": "구포국수 원조골목",
          "dish": "구포 멸치국수 · 비빔국수",
          "desc": "해풍에 말려 쫄깃함이 남다른 구포국수 면발에 진한 멸치육수를 붓는 향토음식",
          "addr": "부산 북구 구포시장1길 6",
          "tel": "051-331-5080"
        }
      ],
      "cafes": [
        {
          "name": "비아조 (Viajo)",
          "signature": "낙동강 에이드 · 굴뚝빵 (뜨르들로)",
          "desc": "낙동강 강변을 따라 야외 정원과 분수대가 이국적으로 꾸며진 대형 힐링 카페",
          "addr": "부산 강서구 식만로 164 (북구 경계)"
        },
        {
          "name": "화명동 숲속카페 산울림",
          "signature": "오미자차 · 가래떡구이",
          "desc": "금정산 자락 대천천 계곡 숲길 사이에 숨겨진 평화로운 정원 찻집",
          "addr": "부산 북구 화명천로 12"
        }
      ]
    },
    "landmarks": [
      {
        "name": "화명생태공원",
        "desc": "낙동강 둔치에 조성된 축구장 100배 규모의 수변 생태공원과 연꽃습지"
      },
      {
        "name": "구포 만세거리 & 구포시장",
        "desc": "3·1운동 구포장터 만세운동의 역사와 부산 최대 상설 전통시장"
      }
    ]
  },
  "DIST-SAHA": {
    "code": "DIST-SAHA",
    "name": "사하구청",
    "eng": "Saha-gu Office",
    "tagline": "자연과 예술이 어우러진 해양관광도시 사하",
    "address": "부산광역시 사하구 낙동대로398번길 12",
    "tel": "051-220-4000",
    "official_url": "https://www.saha.go.kr",
    "online_civil_url": "https://www.saha.go.kr/index.saha?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "사하구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원봉사과",
          "desc": "괴정·하단·다대동 주민 여권 및 가족관계 등록",
          "tel": "051-220-4261"
        },
        {
          "name": "세무1·2과",
          "desc": "신평·장림산단 기업 지방세, 주택분 재산세",
          "tel": "051-220-4201"
        },
        {
          "name": "도시재생과",
          "desc": "감천문화마을 운영, 장림포구 부네치아 환경 개선",
          "tel": "051-220-4701"
        },
        {
          "name": "사하구청 365 무인발급기",
          "desc": "구청 로비 24시간 연중무휴",
          "tel": "051-220-4000"
        }
      ]
    },
    "library": {
      "name": "다대도서관 & 사하구립을숙도도서관",
      "tel": "051-220-5860",
      "addr": "부산광역시 사하구 다대낙조2길 9",
      "portal_url": "https://www.saha.go.kr/library",
      "services": "다대포 낙조 오션뷰 열람실, 철새 생태도서관, 모바일 전자책"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "할매집 다대포",
          "dish": "바지락칼국수 · 해물파전 · 문어숙회",
          "desc": "다대포 해수욕장 어귀에서 신선한 조개와 시원한 칼국수를 내는 맛집",
          "addr": "부산 사하구 몰운대1길 55",
          "tel": "051-263-2801"
        },
        {
          "name": "괴정 제일돌곱창",
          "dish": "돌판 소곱창전골 · 양곱창구이",
          "desc": "40년 동안 뜨거운 돌판에 자글자글 끓여내는 얼큰한 곱창전골과 우동사리",
          "addr": "부산 사하구 사하로181번길 6",
          "tel": "051-205-0892"
        },
        {
          "name": "하단 포항물회",
          "dish": "포항식 고추장 참가자미 물회",
          "desc": "동아대 인근 현지인들이 신선한 회를 배와 오이와 비벼먹는 로컬 명가",
          "addr": "부산 사하구 승학로 8",
          "tel": "051-204-6333"
        }
      ],
      "cafes": [
        {
          "name": "감천 아방가르드 카페",
          "signature": "감천 썬셋에이드 · 크로플",
          "desc": "알록달록 파스텔톤 계단식 마을과 어린왕자 동상이 내려다보이는 전망대 카페",
          "addr": "부산 사하구 옥천로 121"
        },
        {
          "name": "이지요661 (다대포)",
          "signature": "소금빵 · 다대포 낙조라떼",
          "desc": "다대포 해변의 붉은 노을을 통창으로 감상할 수 있는 대형 베이커리",
          "addr": "부산 사하구 다대로 661"
        }
      ]
    },
    "landmarks": [
      {
        "name": "감천문화마을",
        "desc": "한국의 마추픽추, 골목마다 벽화와 예술 조형물이 가득한 세계적 문화명소"
      },
      {
        "name": "다대포 해수욕장 & 꿈의 낙조분수",
        "desc": "세계 최대 바닥음악분수와 황홀한 일몰 낙조가 펼쳐지는 모래사장"
      }
    ]
  },
  "DIST-GEUMJEONG": {
    "code": "DIST-GEUMJEONG",
    "name": "금정구청",
    "eng": "Geumjeong-gu Office",
    "tagline": "자연이 숨 쉬는 품격 있는 문화도시 금정",
    "address": "부산광역시 금정구 중앙대로 1777",
    "tel": "051-519-4000",
    "official_url": "https://www.geumjeong.go.kr",
    "online_civil_url": "https://www.geumjeong.go.kr/index.geumj?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "금정구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원여권과",
          "desc": "부산대 상권 및 금정구민 여권, 인감증명",
          "tel": "051-519-4261"
        },
        {
          "name": "세무1·2과",
          "desc": "재산세, 종합소득세, 자동차세",
          "tel": "051-519-4201"
        },
        {
          "name": "문화관광과",
          "desc": "금정산성 역사문화축제, 범어사 템플스테이 안내",
          "tel": "051-519-4061"
        },
        {
          "name": "금정구청 24시간 무인민원창구",
          "desc": "구청 1층 및 부산대역, 노포역 운영",
          "tel": "051-519-4000"
        }
      ]
    },
    "library": {
      "name": "금정도서관 & 금샘도서관",
      "tel": "051-519-5610",
      "addr": "부산광역시 금정구 체육공원로 100",
      "portal_url": "https://www.geumjeong.go.kr/library",
      "services": "금정산 자락 도서관, 부산대 연계 학술코너, 디지털 전자책"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "금정산성 암탉집 (산성마을)",
          "dish": "참숯 석쇠 흑염소불고기 · 오리불고기",
          "desc": "금정산성 맑은 공기 속에서 은은한 참숯 향을 머금은 원조 산성고기",
          "addr": "부산 금정구 산성로 490",
          "tel": "051-517-5292"
        },
        {
          "name": "범어사 소문난암돼지집",
          "dish": "암돼지 생삼겹살 · 된장찌개",
          "desc": "범어사 등산로 어귀에서 30년간 쫄깃한 고기맛을 지켜온 산악인들의 참새방앗간",
          "addr": "부산 금정구 상마1길 11",
          "tel": "051-508-3333"
        },
        {
          "name": "코하루 (부산대 정문)",
          "dish": "하카타 돈코츠라멘 · 매운라멘",
          "desc": "부산대 대학가에서 진한 돼지사골을 고아 만든 가성비 최고의 자가제면 라멘",
          "addr": "부산 금정구 부산대학로38번길 16",
          "tel": "051-516-4392"
        }
      ],
      "cafes": [
        {
          "name": "더팜47 (The Farm 47)",
          "signature": "팜슈페너 · 갓 구운 무화과 깜빠뉴",
          "desc": "금정산 회동수원지 둘레길 숲속 동화 같은 대형 식물원 베이커리 카페",
          "addr": "부산 금정구 하마1길 53"
        },
        {
          "name": "모모스커피 온천장역점",
          "signature": "에티오피아 게이샤 드립 · 까눌레",
          "desc": "스페셜티 커피의 성지 모모스의 온천장 지하철역 맞은편 로스팅 랩",
          "addr": "부산 금정구 오시게로 18"
        }
      ]
    },
    "landmarks": [
      {
        "name": "범어사 & 금정산성",
        "desc": "천년고찰 범어사와 국내 최장 17km에 달하는 사적 제215호 금정산성"
      },
      {
        "name": "회동수원지 땅뫼산 황토숲길",
        "desc": "피톤치드 가득한 편백나무 숲과 수원지를 바라보며 맨발로 걷는 황톳길"
      }
    ]
  },
  "DIST-GANGSEO": {
    "code": "DIST-GANGSEO",
    "name": "강서구청",
    "eng": "Gangseo-gu Office",
    "tagline": "동북아 해양물류 거점, 미래도시 강서",
    "address": "부산광역시 강서구 낙동북로 477",
    "tel": "051-970-4000",
    "official_url": "https://www.bsgangseo.go.kr",
    "online_civil_url": "https://www.bsgangseo.go.kr/index.gangseo?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "강서구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원봉사과",
          "desc": "명지국제도시·신호·지사 주민 여권 및 가족관계 등록",
          "tel": "051-970-4261"
        },
        {
          "name": "세무과",
          "desc": "명지 신도시 아파트 취득세, 녹산산단 기업 세무",
          "tel": "051-970-4201"
        },
        {
          "name": "스마트도시과",
          "desc": "에코델타시티 스마트빌리지, 가덕신공항 배후단지 안내",
          "tel": "051-970-4701"
        },
        {
          "name": "명지 민원출장소 및 무인발급기",
          "desc": "명지국제도시 민원출장소 24시간 무인기",
          "tel": "051-970-4000"
        }
      ]
    },
    "library": {
      "name": "강서기적의도서관 & 명지누리도서관",
      "tel": "051-970-2340",
      "addr": "부산광역시 강서구 명지오션시티10로 48",
      "portal_url": "https://www.bsgangseo.go.kr/library",
      "services": "어린이 전문 기적의도서관, 에코 생태자료실, 모바일 전자책"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "명지 선창갈비",
          "dish": "숯불 돼지갈비 · 된장찌개",
          "desc": "명지 선창마을에서 30년간 달콤한 양념돼지갈비로 가족 외식을 책임져온 곳",
          "addr": "부산 강서구 르노삼성대로 608",
          "tel": "051-271-2022"
        },
        {
          "name": "가덕도 대항 소희네집",
          "dish": "제철 해물 한상정식 (4인 1상)",
          "desc": "가덕도 앞바다의 전복, 멍게, 생선회, 해물된장이 한 상 가득 나오는 가성비 맛집",
          "addr": "부산 강서구 가덕해안로 1208",
          "tel": "051-971-8886"
        },
        {
          "name": "대저 짭짤이토마토 농가식당",
          "dish": "토마토 한우 불고기 비빔밥",
          "desc": "미네랄 풍부한 낙동강 하구 대저토마토를 활용한 신선한 건강 밥상",
          "addr": "부산 강서구 대저중앙로 347",
          "tel": "051-971-1250"
        }
      ],
      "cafes": [
        {
          "name": "록산 (ROKSAN)",
          "signature": "생과일 파블로바 · 록산 블렌드",
          "desc": "명지 낙동강변의 대형 과일 창고를 개조한 싱그러운 정원 베이커리 카페",
          "addr": "부산 강서구 화전산단5로 52"
        },
        {
          "name": "가덕도 구디너프 (Good Enough)",
          "signature": "남해 바다 솔티라떼 · 크루아상",
          "desc": "가덕도 해안 절벽 위에 통유리로 지어져 거제도와 남해 바다가 한눈에 보이는 곳",
          "addr": "부산 강서구 가덕해안로1169번길 28"
        }
      ]
    },
    "landmarks": [
      {
        "name": "대저생태공원 & 유채꽃단지",
        "desc": "봄이면 전국 최대 규모의 유채꽃 축제가 열리는 낙동강 둔치 생태공원"
      },
      {
        "name": "가덕도 신공항 예정지 & 대항항",
        "desc": "부산의 백년대계를 열 24시간 관문공항 부지와 청정 남해 어촌마을"
      }
    ]
  },
  "DIST-SASANG": {
    "code": "DIST-SASANG",
    "name": "사상구청",
    "eng": "Sasang-gu Office",
    "tagline": "도약하는 스마트 도시, 살기 좋은 사상",
    "address": "부산광역시 사상구 학감대로 242",
    "tel": "051-310-4000",
    "official_url": "https://www.sasang.go.kr",
    "online_civil_url": "https://www.sasang.go.kr/index.sasang?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "사상구청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원봉사과",
          "desc": "서부시외버스터미널 인접 주민 여권 발급, 주민등록",
          "tel": "051-310-4261"
        },
        {
          "name": "세무1·2과",
          "desc": "사상스마트공업단지 기업 지방세, 취득세",
          "tel": "051-310-4201"
        },
        {
          "name": "일자리경제과",
          "desc": "산업단지 청년 일자리 지원, 스마트 제조혁신",
          "tel": "051-310-4471"
        },
        {
          "name": "부산서부터미널 무인민원창구",
          "desc": "사상역 터미널 대합실 24시간 무인기",
          "tel": "051-310-4000"
        }
      ]
    },
    "library": {
      "name": "사상도서관 & 부산도서관",
      "tel": "051-310-7950",
      "addr": "부산광역시 사상구 사상로310번길 33 (부산도서관)",
      "portal_url": "https://www.sasang.go.kr/library",
      "services": "부산시립 대표도서관 본관, 20만 권 장서, 어린이 책마당, 첨단 전자책 뷰어"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "합천일류돼지국밥",
          "dish": "고기국밥 · 돼지우동 · 모둠수육",
          "desc": "진한 사골 국물에 다진 마늘을 듬뿍 얹어 알싸하고 깊은 감칠맛의 사상 최고 국밥",
          "addr": "부산 사상구 광장로 34",
          "tel": "051-317-2478"
        },
        {
          "name": "대궐안집",
          "dish": "점심 갈비탕 (한정판매) · 한우 꽃등심",
          "desc": "사상역 앞 웅장한 한옥에서 매일 점심 줄서서 먹는 푸짐한 명품 갈비탕",
          "addr": "부산 사상구 광장로 68",
          "tel": "051-322-1223"
        },
        {
          "name": "괘법동 꼬리집",
          "dish": "연탄불 돼지꼬리구이 · 삼겹살",
          "desc": "백종원의 3대천왕에 소개된 연탄불에 바삭쫄깃하게 구워먹는 별미 돼지꼬리",
          "addr": "부산 사상구 사상로182번길 35",
          "tel": "051-323-3392"
        }
      ],
      "cafes": [
        {
          "name": "쿼피 (QUOPHI)",
          "signature": "피넛버터 크림라떼 · 르뱅쿠키",
          "desc": "사상 공단 창고를 감각적인 인더스트리얼 감성으로 개조한 스페셜티 로스터리",
          "addr": "부산 사상구 사상로 356"
        },
        {
          "name": "카페 오르디 (ORRD)",
          "signature": "오르디 슈페너 · 솔티드 카라멜 케이크",
          "desc": "삼락생태공원 인근 햇살이 쏟아지는 통유리와 미니멀 디자인의 대형 카페",
          "addr": "부산 사상구 대동로107번길 17"
        }
      ]
    },
    "landmarks": [
      {
        "name": "삼락생태공원 & 벚꽃터널",
        "desc": "낙동강 둔치의 광활한 생태습지와 한국의 아름다운 길 100선에 선정된 벚꽃길"
      },
      {
        "name": "부산서부버스터미널 & 사상역 애플아울렛",
        "desc": "서부산 교통의 허브이자 경남 전역으로 연결되는 시외버스 관문"
      }
    ]
  },
  "DIST-GIJANG": {
    "code": "DIST-GIJANG",
    "name": "기장군청",
    "eng": "Gijang-gun Office",
    "tagline": "행복을 품은 생태도시, 기장의 꿈",
    "address": "부산광역시 기장군 기장읍 기장대로 560",
    "tel": "051-709-4000",
    "official_url": "https://www.gijang.go.kr",
    "online_civil_url": "https://www.gijang.go.kr/index.gijang?menuCd=DOM_000000103000000000",
    "civil_service": {
      "title": "기장군청 종합민원실 (1층)",
      "counters": [
        {
          "name": "민원봉사과",
          "desc": "기장읍·정관신도시·일광 주민 여권 및 가족관계 등록",
          "tel": "051-709-4261"
        },
        {
          "name": "세무과",
          "desc": "오시리아 관광단지 세무 상담, 취득세, 재산세",
          "tel": "051-709-4201"
        },
        {
          "name": "해양수산과",
          "desc": "기장 미역·다시마 특구, 어항 관리, 대게시장 육성",
          "tel": "051-709-4501"
        },
        {
          "name": "정관읍 출장소 및 무인발급기",
          "desc": "정관신도시 출장소 및 기장군청 24시간 무인기",
          "tel": "051-709-4000"
        }
      ]
    },
    "library": {
      "name": "기장도서관 & 정관도서관",
      "tel": "051-709-5330",
      "addr": "부산광역시 기장군 기장읍 차성로 347",
      "portal_url": "https://www.gijang.go.kr/library",
      "services": "해양생태 특화자료실, 정관 소두방공원 숲 도서관, 전자책 모바일 대출"
    },
    "gourmet": {
      "restaurants": [
        {
          "name": "기장시장 청해진 대게하우스",
          "dish": "러시아·영덕 활대게 찜 · 게딱지볶음밥",
          "desc": "기장전통시장에서 살아있는 대게를 즉석에서 쪄주는 푸짐한 해산물 성지",
          "addr": "부산 기장군 기장읍 읍내로104번길 12",
          "tel": "051-722-6800"
        },
        {
          "name": "연화리 해녀촌 할매집",
          "dish": "가마솥 전복죽 · 모둠 해물쟁반",
          "desc": "해녀들이 직접 물질해 올린 낙지, 해삼, 멍게, 개불과 녹진한 전복내장죽",
          "addr": "부산 기장군 기장읍 연화1길 169",
          "tel": "051-721-3990"
        },
        {
          "name": "풍원장 시골밥상집",
          "dish": "보쌈정식 · 숯불돼지불고기 정식",
          "desc": "기장 오시리아 입구에서 20여 가지 반찬과 가마솥 밥을 내는 한정식",
          "addr": "부산 기장군 기장읍 시랑리 343-1",
          "tel": "051-721-7718"
        }
      ],
      "cafes": [
        {
          "name": "웨이브온 커피 (Waveon Coffee)",
          "signature": "월내라떼 · 풀문 브루잉",
          "desc": "한국건축문화대상 수상, 기장 앞바다 바위 절벽 위에 지어진 오션뷰 명소",
          "addr": "부산 기장군 장안읍 해맞이로 286"
        },
        {
          "name": "칠암사계 (이흥용 베이커리)",
          "signature": "칠암 소금빵 · 퀸아망",
          "desc": "대한민국 제과명장 이흥용이 칠암항 등대 앞 바다에 지은 소금빵의 성지",
          "addr": "부산 기장군 일광읍 칠암1길 7-10"
        }
      ]
    },
    "landmarks": [
      {
        "name": "해동용궁사 & 오시리아 관광단지",
        "desc": "바다 절벽 위에 지어진 수상법당과 롯데월드 어드벤처, 루지 테마파크"
      },
      {
        "name": "오랑대공원 & 아홉산숲",
        "desc": "거친 기암괴석과 바다 용왕단, 400년 동안 지켜온 신비로운 대나무 숲"
      }
    ]
  }
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

function applyTexColorSpace(tex, repeatX = 1, repeatY = 1) {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  if (THREE.SRGBColorSpace) {
    tex.colorSpace = THREE.SRGBColorSpace;
  } else if (THREE.sRGBEncoding) {
    tex.encoding = THREE.sRGBEncoding;
  }
  tex.repeat.set(repeatX, repeatY);
  return tex;
}

function createProceduralTextures() {
  // [가즈아 대성전급 프리미엄 절차적 텍스처 엔진]
  
  // (1) 시민광장 고급 화강석 판석 타일 (Beveled Granite Paving)
  const c1 = document.createElement('canvas');
  c1.width = 512;
  c1.height = 512;
  const ctx1 = c1.getContext('2d');
  ctx1.fillStyle = '#cfd8dc';
  ctx1.fillRect(0, 0, 512, 512);

  const stoneSpots = ['#90a4ae', '#eceff1', '#b0bec5', '#78909c', '#d7ccc8', '#ffffff', '#546e7a'];
  for (let i = 0; i < 28000; i++) {
    ctx1.fillStyle = stoneSpots[Math.floor(Math.random() * stoneSpots.length)];
    ctx1.globalAlpha = 0.2 + Math.random() * 0.55;
    const r = 0.6 + Math.random() * 2.2;
    ctx1.beginPath();
    ctx1.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2);
    ctx1.fill();
  }

  ctx1.globalAlpha = 0.25;
  ctx1.strokeStyle = '#455a64';
  for (let i = 0; i < 35; i++) {
    ctx1.lineWidth = 0.8 + Math.random() * 1.5;
    ctx1.beginPath();
    const sx = Math.random() * 512, sy = Math.random() * 512;
    ctx1.moveTo(sx, sy);
    ctx1.quadraticCurveTo(sx + (Math.random() - 0.5) * 40, sy + (Math.random() - 0.5) * 40, sx + (Math.random() - 0.5) * 60, sy + (Math.random() - 0.5) * 60);
    ctx1.stroke();
  }
  ctx1.globalAlpha = 1.0;

  for (let x = 0; x <= 512; x += 128) {
    ctx1.strokeStyle = '#37474f';
    ctx1.lineWidth = 3.5;
    ctx1.beginPath(); ctx1.moveTo(x, 0); ctx1.lineTo(x, 512); ctx1.stroke();
    ctx1.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx1.lineWidth = 1.5;
    ctx1.beginPath(); ctx1.moveTo(x + 2, 0); ctx1.lineTo(x + 2, 512); ctx1.stroke();
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx1.strokeStyle = '#37474f';
    ctx1.lineWidth = 3.5;
    ctx1.beginPath(); ctx1.moveTo(0, y); ctx1.lineTo(512, y); ctx1.stroke();
    ctx1.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx1.lineWidth = 1.5;
    ctx1.beginPath(); ctx1.moveTo(0, y + 2); ctx1.lineTo(512, y + 2); ctx1.stroke();
  }
  TEXTURES.plaza = applyTexColorSpace(new THREE.CanvasTexture(c1), 10, 8);

  // (2) 1층 로비 최고급 이탈리아 카라라 대리석 (Polished Carrara Marble)
  const c2 = document.createElement('canvas');
  c2.width = 512;
  c2.height = 512;
  const ctx2 = c2.getContext('2d');
  ctx2.fillStyle = '#fafafa';
  ctx2.fillRect(0, 0, 512, 512);

  ctx2.globalAlpha = 0.22;
  const marbleColors = ['#78909c', '#607d8b', '#d4af37', '#b0bec5'];
  for (let v = 0; v < 18; v++) {
    ctx2.strokeStyle = marbleColors[v % marbleColors.length];
    ctx2.lineWidth = 2 + Math.random() * 8;
    ctx2.beginPath();
    let cx = Math.random() * 512, cy = 0;
    ctx2.moveTo(cx, cy);
    while (cy < 512) {
      const ncx = cx + (Math.random() - 0.48) * 80;
      const ncy = cy + 40 + Math.random() * 50;
      ctx2.quadraticCurveTo(cx + (Math.random() - 0.5) * 50, cy + 20, ncx, ncy);
      cx = ncx; cy = ncy;
    }
    ctx2.stroke();
  }
  ctx2.globalAlpha = 1.0;

  ctx2.strokeStyle = 'rgba(202, 138, 4, 0.4)';
  ctx2.lineWidth = 2.5;
  for (let x = 0; x <= 512; x += 256) {
    ctx2.beginPath(); ctx2.moveTo(x, 0); ctx2.lineTo(x, 512); ctx2.stroke();
  }
  for (let y = 0; y <= 512; y += 256) {
    ctx2.beginPath(); ctx2.moveTo(0, y); ctx2.lineTo(512, y); ctx2.stroke();
  }
  TEXTURES.marble = applyTexColorSpace(new THREE.CanvasTexture(c2), 8, 5);

  // (3) 시청 28층 커튼월 파사드 (Modern Architectural Glass & Louvers)
  const c3 = document.createElement('canvas');
  c3.width = 512;
  c3.height = 512;
  const ctx3 = c3.getContext('2d');
  ctx3.fillStyle = '#0f2942';
  ctx3.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 64) {
    ctx3.fillStyle = '#1e293b';
    ctx3.fillRect(0, y, 512, 12);
    ctx3.fillStyle = '#334155';
    ctx3.fillRect(0, y + 2, 512, 3);

    for (let x = 0; x < 512; x += 32) {
      const winGrad = ctx3.createLinearGradient(x, y + 12, x, y + 64);
      winGrad.addColorStop(0, '#1d4ed8');
      winGrad.addColorStop(0.6, '#0284c7');
      winGrad.addColorStop(1, '#0369a1');
      ctx3.fillStyle = winGrad;
      ctx3.fillRect(x + 2, y + 14, 28, 48);

      if ((x * 7 + y * 13) % 11 < 4) {
        ctx3.fillStyle = 'rgba(254, 240, 138, 0.65)';
        ctx3.fillRect(x + 5, y + 22, 22, 28);
        ctx3.fillStyle = 'rgba(217, 119, 6, 0.4)';
        ctx3.fillRect(x + 7, y + 36, 18, 12);
      }
    }
  }
  ctx3.strokeStyle = '#020617';
  ctx3.lineWidth = 3;
  for (let x = 0; x <= 512; x += 32) {
    ctx3.beginPath(); ctx3.moveTo(x, 0); ctx3.lineTo(x, 512); ctx3.stroke();
  }
  TEXTURES.glassTower = applyTexColorSpace(new THREE.CanvasTexture(c3), 6, 6);

  // (4) 따뜻한 원목 마루 텍스처 (Architectural Oak Wood)
  const c4 = document.createElement('canvas');
  c4.width = 512;
  c4.height = 512;
  const ctx4 = c4.getContext('2d');
  ctx4.fillStyle = '#5c321e';
  ctx4.fillRect(0, 0, 512, 512);
  const woodPlanks = ['#4a2616', '#663821', '#542d19', '#703e25'];
  for (let y = 0; y < 512; y += 32) {
    ctx4.fillStyle = woodPlanks[(y / 32) % woodPlanks.length];
    ctx4.fillRect(0, y, 512, 30);
    ctx4.strokeStyle = 'rgba(26, 12, 6, 0.35)';
    ctx4.lineWidth = 1;
    for (let k = 0; k < 6; k++) {
      ctx4.beginPath();
      const my = y + 4 + Math.random() * 22;
      ctx4.moveTo(0, my);
      ctx4.quadraticCurveTo(256, my + (Math.random() - 0.5) * 6, 512, my);
      ctx4.stroke();
    }
  }
  ctx4.strokeStyle = '#1e0c05';
  ctx4.lineWidth = 2.5;
  for (let y = 0; y <= 512; y += 32) {
    ctx4.beginPath(); ctx4.moveTo(0, y); ctx4.lineTo(512, y); ctx4.stroke();
  }
  TEXTURES.wood = applyTexColorSpace(new THREE.CanvasTexture(c4), 6, 6);

  // (5) 깊이 있는 천연 공원 잔디 텍스처 (Deep Botanical Lawn)
  const c5 = document.createElement('canvas');
  c5.width = 512;
  c5.height = 512;
  const ctx5 = c5.getContext('2d');
  ctx5.fillStyle = '#1e3f20';
  ctx5.fillRect(0, 0, 512, 512);

  const grassColors = ['#164e23', '#225d2b', '#2e7d32', '#1b4d24', '#388e3c', '#143818', '#43a047'];
  for (let i = 0; i < 35000; i++) {
    ctx5.fillStyle = grassColors[Math.floor(Math.random() * grassColors.length)];
    ctx5.globalAlpha = 0.3 + Math.random() * 0.5;
    const gx = Math.random() * 512;
    const gy = Math.random() * 512;
    ctx5.fillRect(gx, gy, 1.8, 4.0);
  }
  ctx5.globalAlpha = 0.18;
  ctx5.fillStyle = '#3e2723';
  for (let i = 0; i < 40; i++) {
    ctx5.beginPath();
    ctx5.arc(Math.random() * 512, Math.random() * 512, 10 + Math.random() * 35, 0, Math.PI * 2);
    ctx5.fill();
  }
  ctx5.globalAlpha = 1.0;
  TEXTURES.grass = applyTexColorSpace(new THREE.CanvasTexture(c5), 16, 16);
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
  SHARED_GEO.head = new THREE.SphereGeometry(0.40, 24, 20);
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

  // (1) Scene - 가즈아 대성전급 시네마틱 4단 캔버스 하늘 그라데이션
  scene = new THREE.Scene();

  try {
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 4;
    skyCanvas.height = 512;
    const sCtx = skyCanvas.getContext('2d');
    const sGrad = sCtx.createLinearGradient(0, 0, 0, 512);
    sGrad.addColorStop(0, '#0f2744');    // 딥 해양 마린 블루
    sGrad.addColorStop(0.32, '#1e5bb8'); // 코스탈 로열 블루
    sGrad.addColorStop(0.65, '#5ea8f5'); // 맑은 부산 하늘빛
    sGrad.addColorStop(0.86, '#c4e3f8'); // 포근한 해안 대기 연무
    sGrad.addColorStop(1.0, '#fedcb5');  // 황금빛 아침 지평선 노을
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 4, 512);
    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    if (THREE.SRGBColorSpace) skyTexture.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) skyTexture.encoding = THREE.sRGBEncoding;
    scene.background = skyTexture;
  } catch (e) {
    scene.background = new THREE.Color(0x38bdf8);
  }

  // 가즈아 대성전급 소프트 거리 안개
  scene.fog = new THREE.Fog(0xbcd9ea, 65, 360);

  // (2) Camera & OrbitControls (시청 본관 정면을 완벽 구도로 응시)
  camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 800);
  camera.position.set(0, 4.8, 17.0);

  // (3) Renderer - ACES 톤매핑으로 눈부심 방지 및 사진 수준의 선명한 대비
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;


  // (4) OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI / 2 - 0.03;
  controls.minDistance = 2.5;
  controls.maxDistance = 65;
  controls.target.set(0, 1.4, 10.0);

  // (5) 조명 세팅 - 가즈아 대성전급 3원 시네마틱 라이팅
  const hemiLight = new THREE.HemisphereLight(0xdfeaf2, 0x5a4a36, 0.95);
  scene.add(hemiLight);

  const ambientLight = new THREE.AmbientLight(0xfff0dc, 0.55);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
  sunLight.position.set(38, 65, 30);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0006;
  sunLight.shadow.camera.near = 1.0;
  sunLight.shadow.camera.far = 240;
  const d = 60;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  scene.add(sunLight);

  // 원경: 부산의 명산(황령산·금정산) 및 광안대교 실루엣 파노라마 원경 생성
  if (typeof createDistantBusanSkylinePanorama === 'function') {
    createDistantBusanSkylinePanorama();
  }

  createProceduralTextures();
  initSharedGeometries();
  setupClickMarker();

  cityHallWorldGroup = new THREE.Group();
  civilHallWorldGroup = new THREE.Group();
  civilHallWorldGroup.visible = false;
  districtWorldGroup = new THREE.Group();
  districtWorldGroup.visible = false;
  scene.add(cityHallWorldGroup);
  scene.add(civilHallWorldGroup);
  scene.add(districtWorldGroup);

  buildBusanCityHallWorld();
  initOutdoorAutonomousNpcs();
  cityHallObstaclesBackup = [...busanCityHallObstacles];
  cityHallInteractablesBackup = [...interactiveObjects];

  createLocalPlayer();
  setupMovementControls();
  setupVirtualJoystick();
  setupResizeHandler();
  setupChatEnterListeners();
  setupMobileProtections();
  TripoAssetManager.init();

  animate();
}

// ========================================================
// 5. 부산광역시청 및 5대 시민광장 3D 건축 모델링
// ========================================================
// ========================================================

// ========================================================
// [Tripo3D GenAI & NPC Dialogue Engine]
// ========================================================

// ========================================================
// [Tripo3D Skeleton & SkinnedMesh Cloner]
// ========================================================
function cloneWithBones(source) {
  if (!source) return null;
  const clone = source.clone(true);
  const sourceBones = [];
  source.traverse(node => {
    if (node.isBone) sourceBones.push(node);
  });
  const cloneBones = [];
  clone.traverse(node => {
    if (node.isBone) cloneBones.push(node);
  });
  clone.traverse(node => {
    if (node.isSkinnedMesh && node.skeleton) {
      const skeleton = node.skeleton;
      const bones = [];
      for (let i = 0; i < skeleton.bones.length; i++) {
        const sourceBone = skeleton.bones[i];
        const index = sourceBones.indexOf(sourceBone);
        bones.push(index !== -1 ? cloneBones[index] : sourceBone);
      }
      node.bind(new THREE.Skeleton(bones, skeleton.boneInverses), node.matrixWorld);
    }
  });
  return clone;
}

const TripoAssetManager = {
  loader: null,
  dracoLoader: null,
  cache: {},
  animationsCache: {},
  isReady: false,

  init() {
    if (typeof THREE.GLTFLoader !== 'undefined') {
      this.loader = new THREE.GLTFLoader();
      if (typeof THREE.DRACOLoader !== 'undefined') {
        this.dracoLoader = new THREE.DRACOLoader();
        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
        this.loader.setDRACOLoader(this.dracoLoader);
      }
      this.isReady = true;
      console.log('✅ [TripoAssetManager] GLTFLoader & DRACOLoader 준비 완료');
      this.checkAndLoadDefaultModels();
    } else {
      console.warn('ℹ️ [TripoAssetManager] GLTFLoader 준비 대기 중 (Procedural 메쉬 동작)');
    }
  },

  loadModel(url, onLoaded, onError) {
    if (!this.isReady || !this.loader) {
      if (onError) onError('GLTFLoader unavailable');
      return;
    }
    if (this.cache[url]) {
      const cloned = cloneWithBones(this.cache[url]);
      cloned.userData.animations = this.animationsCache[url] || [];
      if (onLoaded) onLoaded(cloned);
      return;
    }
    this.loader.load(
      url,
      (gltf) => {
        console.log(`✅ [TripoAssetManager] 모델 로드 성공: ${url} (애니메이션: ${gltf.animations.length}개)`);
        
        // PBR 머티리얼 최적화: 시커먼 메탈릭 버그 100% 박멸 & 화사한 순백 클레이/비닐 토이 광택
        gltf.scene.traverse(c => {
          if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
            c.frustumCulled = false;
            if (c.material) {
              c.material.metalness = 0.0;
              c.material.metalnessMap = null;
              c.material.roughness = 0.35;
              c.material.roughnessMap = null;
              c.material.color.setHex(0xffffff);
              c.material.needsUpdate = true;
            }
          }
        });

        this.cache[url] = gltf.scene;
        this.animationsCache[url] = gltf.animations || [];
        gltf.scene.userData.animations = gltf.animations || [];

        const cloned = cloneWithBones(gltf.scene);
        cloned.userData.animations = gltf.animations || [];
        if (onLoaded) onLoaded(cloned);
      },
      undefined,
      (err) => {
        console.log(`ℹ️ [TripoAssetManager] ${url} 대기 중 (기본 절차적 모델 유지)`);
        if (onError) onError(err);
      }
    );
  },

  boogiModel: null,
  civilOfficerModel: null,
  officeWorkerModel: null,
  anchorModel: null,
  cityHallModel: null,

  checkAndLoadDefaultModels() {
    // 1. 소통 캐릭터 부기 마스코트 우선 로드 (화사한 순백 몬스터블락 3D)
    this.loadModel('models/boogi.glb', (model) => {
      this.boogiModel = model;
      this.replaceBoogiMascot(model);
    });
    // 2. 공무원 및 스마트 회사원
    this.loadModel('models/civil_officer.glb', (model) => {
      this.civilOfficerModel = model;
      this.replaceCivilOfficerModel(model);
    });
    this.loadModel('models/office_worker.glb', (model) => {
      this.officeWorkerModel = model;
      this.replaceOfficeWorkerModel(model);
    });
    // 3. 부산 닻 상징 조형물 및 시청 3D 외관 본관
    this.loadModel('models/anchor_statue.glb', (model) => {
      this.anchorModel = model;
      this.replaceAnchorStatue(model);
    });
    this.loadModel('models/city_hall.glb', (model) => {
      this.cityHallModel = model;
      this.replaceCityHallFacade(model);
    });
  },

  // 1. 부산시청 3D 외관 본관 교체 (야외 광장 배경으로 당당히 배치)
  replaceCityHallFacade(tripoModel) {
    if (!cityHallWorldGroup) return;
    const bbox = new THREE.Box3().setFromObject(tripoModel);
    const size = bbox.getSize(new THREE.Vector3());
    const targetHeight = 44.0;
    const scale = targetHeight / (size.y || 1);
    tripoModel.scale.set(scale, scale, scale);
    tripoModel.position.set(0, -bbox.min.y * scale, -48);
    tripoModel.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
        c.frustumCulled = false;
        if (c.material) {
          c.material.metalness = 0.2;
          c.material.roughness = 0.25;
        }
      }
    });
    cityHallWorldGroup.add(tripoModel);
    console.log('🏛️ [TripoAssetManager] 부산시청 3D 본관 타워가 야외 광장에 당당히 세워졌습니다!');
  },

  // 2. 시민광장 음악분수대는 100% 실시간 Three.js 동적 댄싱 분수(중력+물줄기+수중LED)로 작동
  replaceFountain(tripoModel) {
    // 석고처럼 굳은 정적 모델 대신 살아 숨쉬는 역동적 음악 분수대 적용 (사용자 요청 완벽 반영)
  },

  // 3. 부산의 닻 상징 조형물 교체
  replaceAnchorStatue(tripoModel) {
    if (!cityHallWorldGroup) return;
    const bbox = new THREE.Box3().setFromObject(tripoModel);
    const size = bbox.getSize(new THREE.Vector3());
    const scale = 4.2 / (size.y || 1);
    tripoModel.scale.set(scale, scale, scale);
    tripoModel.position.set(0, -bbox.min.y * scale, 24);
    cityHallWorldGroup.add(tripoModel);
    console.log('⚓ [TripoAssetManager] 닻 상징 조형물 교체 완료!');
  },

  // 4. 부산 공식 소통 캐릭터 부기 (100% 공식 캐릭터 3D 완벽 구현)
  replaceBoogiMascot(dummyModel) {
    const bada = outdoorNpcs.find(n => n.id === 'npc_bada');
    if (!bada || !bada.mesh) return;

    if (bada.mesh.userData.tripoMesh) {
      bada.mesh.remove(bada.mesh.userData.tripoMesh);
      bada.mesh.userData.tripoMesh = null;
    }

    const m = createOfficialBoogiMesh();
    m.scale.set(1.25, 1.25, 1.25);
    m.position.set(0, 0, 0);

    bada.mesh.children.forEach(c => {
      if (c !== bada.mesh.userData.nameplate && c !== bada.mesh.userData.bubbleSlot && c !== m) {
        c.visible = false;
      }
    });
    bada.mesh.add(m);
    bada.mesh.userData.tripoMesh = m;
    bada.mesh.userData.tripoBaseY = 0.0;
    console.log('🌊 [TripoAssetManager] 부산 공식 3D 부기 마스코트 장착 완료!');
    return;
  },

  _unused_old_boogi(tripoModel) {
    this.boogiModel = tripoModel;
    const bada = outdoorNpcs.find(n => n.id === 'npc_bada');
    if (!bada || !bada.mesh) return;

    if (bada.mesh.userData.tripoMesh) {
      bada.mesh.remove(bada.mesh.userData.tripoMesh);
      bada.mesh.userData.tripoMesh = null;
    }

    const m = cloneWithBones(tripoModel);
    m.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
        c.frustumCulled = false;
        if (c.material) {
          c.material.metalness = 0.0;
          c.material.metalnessMap = null;
          c.material.roughness = 0.32;
          c.material.roughnessMap = null;
          c.material.color.setHex(0xffffff);
          c.material.needsUpdate = true;
        }
      }
    });

    const bbox = new THREE.Box3().setFromObject(m);
    const size = bbox.getSize(new THREE.Vector3());
    const scale = 1.7 / (size.y || 1);
    m.scale.set(scale, scale, scale);
    const baseY = -bbox.min.y * scale;
    m.position.set(0, baseY, 0);

    // AnimationMixer 바인딩 (idle & walk)
    const anims = tripoModel.userData.animations || [];
    if (anims.length > 0) {
      const mixer = new THREE.AnimationMixer(m);
      const idleClip = anims.find(a => a.name.toLowerCase().includes('idle')) || anims[0];
      const walkClip = anims.find(a => a.name.toLowerCase().includes('walk')) || anims[1] || anims[0];
      const idleAction = idleClip ? mixer.clipAction(idleClip) : null;
      const walkAction = walkClip ? mixer.clipAction(walkClip) : null;
      if (idleAction) idleAction.play();
      m.userData.mixer = mixer;
      m.userData.idleAction = idleAction;
      m.userData.walkAction = walkAction;
      m.userData.currentAction = 'idle';
    }

    // Hide procedural body meshes, keep nameplate and bubble
    bada.mesh.children.forEach(c => {
      if (c !== bada.mesh.userData.nameplate && c !== bada.mesh.userData.bubbleSlot && c !== m) {
        c.visible = false;
      }
    });
    bada.mesh.add(m);
    bada.mesh.userData.tripoMesh = m;
    bada.mesh.userData.tripoBaseY = baseY;
    console.log('🌊 [TripoAssetManager] 부기 마스코트 Monster Block 3D 화사한 순백 애니메이션 모델 교체 완료!');
  },

  // 5. 공무원 캐릭터 (시청 정복 + 태블릿 + 애니메이션 관절 보행)
  replaceCivilOfficerModel(tripoModel) {
    outdoorNpcs.forEach(n => {
      if (n.id && (n.id.includes('officer') || n.id.includes('staff')) && n.mesh) {
        const m = cloneWithBones(tripoModel);
        const bbox = new THREE.Box3().setFromObject(m);
        const size = bbox.getSize(new THREE.Vector3());
        const scale = 1.65 / (size.y || 1);
        m.scale.set(scale, scale, scale);
        m.rotation.y = -Math.PI / 2; // ★ 정면(+Z) 보행 완벽 정렬 (옆으로 걷기 해결)
        const baseY = -bbox.min.y * scale + 0.12 * scale; // ★ 보행 시 발바닥 바닥 잠김 방지
        m.position.set(0, baseY, 0);

        const anims = tripoModel.userData.animations || [];
        if (anims.length > 0) {
          const mixer = new THREE.AnimationMixer(m);
          const idleClip = anims.find(a => a.name.toLowerCase().includes('idle')) || anims[0];
          const walkClip = anims.find(a => a.name.toLowerCase().includes('walk')) || anims[1] || anims[0];
          const idleAction = idleClip ? mixer.clipAction(idleClip) : null;
          const walkAction = walkClip ? mixer.clipAction(walkClip) : null;
          if (idleAction) idleAction.play();
          m.userData.mixer = mixer;
          m.userData.idleAction = idleAction;
          m.userData.walkAction = walkAction;
          m.userData.currentAction = 'idle';
        }

        n.mesh.children.forEach(c => {
          if (c !== n.mesh.userData.nameplate && c !== n.mesh.userData.bubbleSlot) c.visible = false;
        });
        n.mesh.add(m);
        n.mesh.userData.tripoMesh = m;
        n.mesh.userData.tripoBaseY = baseY;
      }
    });
    console.log('🏛️ [TripoAssetManager] 공무원 캐릭터가 리깅 3D 애니메이션 모델로 교체되었습니다!');
  },

  // 6. 회사원 및 플레이어 캐릭터 교체
  replaceOfficeWorkerModel(tripoModel) {
    outdoorNpcs.forEach(n => {
      if (n.id && (n.id.includes('worker') || n.id.includes('choi') || n.id.includes('lee')) && n.mesh) {
        const m = cloneWithBones(tripoModel);
        const bbox = new THREE.Box3().setFromObject(m);
        const size = bbox.getSize(new THREE.Vector3());
        const scale = 1.65 / (size.y || 1);
        m.scale.set(scale, scale, scale);
        m.rotation.y = -Math.PI / 2; // ★ 정면(+Z) 보행 완벽 정렬 (옆으로 걷기 해결)
        const baseY = -bbox.min.y * scale + 0.12 * scale; // ★ 보행 시 발바닥 바닥 잠김 방지
        m.position.set(0, baseY, 0);

        const anims = tripoModel.userData.animations || [];
        if (anims.length > 0) {
          const mixer = new THREE.AnimationMixer(m);
          const idleClip = anims.find(a => a.name.toLowerCase().includes('idle')) || anims[0];
          const walkClip = anims.find(a => a.name.toLowerCase().includes('walk')) || anims[1] || anims[0];
          const idleAction = idleClip ? mixer.clipAction(idleClip) : null;
          const walkAction = walkClip ? mixer.clipAction(walkClip) : null;
          if (idleAction) idleAction.play();
          m.userData.mixer = mixer;
          m.userData.idleAction = idleAction;
          m.userData.walkAction = walkAction;
          m.userData.currentAction = 'idle';
        }

        n.mesh.children.forEach(c => {
          if (c !== n.mesh.userData.nameplate && c !== n.mesh.userData.bubbleSlot) c.visible = false;
        });
        n.mesh.add(m);
        n.mesh.userData.tripoMesh = m;
        n.mesh.userData.tripoBaseY = baseY;
      }
    });

    if (localPlayer) {
      this.replacePlayerModel(tripoModel);
    }
  },

  // ★ 주인공(플레이어) 3D 캐릭터 완벽 적용 (절대 사라지지 않고 뚜렷하게 보임!)
  replacePlayerModel(tripoModel) {
    if (!localPlayer) return;
    const m = cloneWithBones(tripoModel);
    m.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
        c.frustumCulled = false;
        if (c.material) {
          c.material.metalness = 0.05;
          c.material.roughness = 0.42;
          c.material.needsUpdate = true;
        }
      }
    });

    const bbox = new THREE.Box3().setFromObject(m);
    const size = bbox.getSize(new THREE.Vector3());
    const targetHeight = 1.65;
    const scale = targetHeight / (size.y || 1);
    m.scale.set(scale, scale, scale);
    m.rotation.y = -Math.PI / 2; // ★ 정면(+Z) 보행 완벽 정렬
    const baseY = -bbox.min.y * scale + 0.12 * scale; // ★ 발바닥 잠김 방지
    m.position.set(0, baseY, 0);

    const anims = tripoModel.userData.animations || [];
    if (anims.length > 0) {
      const mixer = new THREE.AnimationMixer(m);
      const idleClip = anims.find(a => a.name.toLowerCase().includes('idle')) || anims[0];
      const walkClip = anims.find(a => a.name.toLowerCase().includes('walk')) || anims[1] || anims[0];
      const idleAction = idleClip ? mixer.clipAction(idleClip) : null;
      const walkAction = walkClip ? mixer.clipAction(walkClip) : null;
      if (idleAction) idleAction.play();
      m.userData.mixer = mixer;
      m.userData.idleAction = idleAction;
      m.userData.walkAction = walkAction;
      m.userData.currentAction = 'idle';
    }

    if (localPlayer.userData.tripoMesh) {
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
    console.log('🎮 [TripoAssetManager] 주인공(플레이어) 3D 캐릭터 완벽 적용 완료!');
  },

  setPlayerModelByType(type) {
    const file = type === 'boogi' ? 'models/boogi.glb' :
                 type === 'officer' ? 'models/civil_officer.glb' :
                 type === 'worker' ? 'models/office_worker.glb' : null;
    if (!file) return;
    this.loadModel(file, (model) => {
      this.replacePlayerModel(model);
      if (typeof showSpeechBubble !== 'undefined' && localPlayer) {
        showSpeechBubble(localPlayer, `✨ 플레이어가 [${type}] 아바타로 변신했습니다!`);
      }
    });
  }
};


// --------------------------------------------------------
// [건축 1] 부산시청 본관 28층 타워 외관 파사드
// --------------------------------------------------------

// ========================================================
// 원경: 부산 명산(황령산·금정산) 능선 & 광안대교 파노라마
// ========================================================
function createDistantBusanSkylinePanorama() {
  const panoGroup = new THREE.Group();

  // ★ 부산의 명산(황령산·금정산·배산) 실사풍 유려한 중첩 능선 파노라마
  const mountainSegments = 36;
  const ridgeColors = [0x1e3a2b, 0x2d4f3b, 0x3d644d, 0x517962]; // 심산유곡 그라데이션

  for (let layer = 0; layer < 3; layer++) {
    const radius = 180 + layer * 40;
    const curvePoints = [];
    for (let s = 0; s <= mountainSegments; s++) {
      const theta = (s / mountainSegments) * Math.PI * 2;
      // 황령산(북동), 금정산(북서), 배산(동남)의 실제 고도 실루엣
      const bump1 = Math.sin(theta * 3.0 + layer) * 18.0;
      const bump2 = Math.cos(theta * 5.0) * 12.0;
      const h = 42.0 + (3 - layer) * 14.0 + bump1 + bump2;
      const r = radius + Math.sin(theta * 4.0) * 12.0;
      curvePoints.push(new THREE.Vector3(Math.cos(theta) * r, h, Math.sin(theta) * r));
    }

    // 굴곡진 산등성이 메시
    for (let s = 0; s < mountainSegments; s++) {
      const p1 = curvePoints[s];
      const p2 = curvePoints[s + 1];
      const midX = (p1.x + p2.x) / 2;
      const midZ = (p1.z + p2.z) / 2;
      const avgH = (p1.y + p2.y) / 2;

      const hillGeo = new THREE.SphereGeometry(avgH * 0.72, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55);
      const hillMat = new THREE.MeshStandardMaterial({
        color: ridgeColors[layer % ridgeColors.length],
        roughness: 0.88,
        flatShading: false
      });
      const hill = new THREE.Mesh(hillGeo, hillMat);
      hill.position.set(midX, 0, midZ);
      hill.scale.set(1.4, 1.0, 1.4);
      panoGroup.add(hill);
    }
  }

  // 황령산 정상 부산방송 송신탑 (Hwangnyeongsan Broadcast Tower)
  const towerGroup = new THREE.Group();
  towerGroup.position.set(65, 78, -130);
  const towerTruss = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 4.2, 38, 8), new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.2 }));
  towerGroup.add(towerTruss);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  beacon.position.y = 20;
  towerGroup.add(beacon);
  panoGroup.add(towerGroup);

  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(110, 0, 110);
  bridgeGroup.rotation.y = -Math.PI / 4;

  const towerMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
  const cableMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });

  for (const tx of [-14, 14]) {
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 46, 2.4), towerMat);
    p1.position.set(tx, 23, 0);
    bridgeGroup.add(p1);

    const cross = new THREE.Mesh(new THREE.BoxGeometry(10, 2.0, 1.8), towerMat);
    cross.position.set(tx, 32, 0);
    bridgeGroup.add(cross);
  }

  const roadDeck = new THREE.Mesh(new THREE.BoxGeometry(80, 2.4, 6.0), new THREE.MeshStandardMaterial({ color: 0x475569 }));
  roadDeck.position.set(0, 12, 0);
  bridgeGroup.add(roadDeck);

  const cableGeo = new THREE.CylinderGeometry(0.15, 0.15, 80, 8);
  const cable1 = new THREE.Mesh(cableGeo, cableMat);
  cable1.rotation.z = Math.PI / 2;
  cable1.position.set(0, 32, 2.6);
  bridgeGroup.add(cable1);

  const cable2 = new THREE.Mesh(cableGeo, cableMat);
  cable2.rotation.z = Math.PI / 2;
  cable2.position.set(0, 32, -2.6);
  bridgeGroup.add(cable2);

  panoGroup.add(bridgeGroup);
  scene.add(panoGroup);
}

// ========================================================
// 8기 클래식 광장 가로등 (온화한 앰버 포인트 조명)
// ========================================================
function buildPlazaStreetlamps() {
  const lampPositions = [
    [-22, 0, 16], [22, 0, 16],
    [-22, 0, 32], [22, 0, 32],
    [-22, 0, 48], [22, 0, 48],
    [-12, 0, 54], [12, 0, 54]
  ];

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });

  lampPositions.forEach(([x, y, z]) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.6, 10), poleMat);
    pole.position.set(x, 2.3, z);
    pole.castShadow = true;
    cityHallWorldGroup.add(pole);

    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.35, 10), poleMat);
    shade.position.set(x, 4.7, z);
    cityHallWorldGroup.add(shade);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), bulbMat);
    bulb.position.set(x, 4.5, z);
    cityHallWorldGroup.add(bulb);

    const pLight = new THREE.PointLight(0xffd166, 1.8, 18, 1.5);
    pLight.position.set(x, 4.4, z);
    cityHallWorldGroup.add(pLight);
  });
}

// ========================================================
// [지피티 추천 1] 오늘의 시정 축복 & 동백꽃 행운 KIOSK
// ========================================================
let camelliaBlessingMesh = null;
function buildCamelliaFortuneKiosk(x = 18, y = 0, z = 24) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const altar = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 1.0, 16), new THREE.MeshStandardMaterial({ map: TEXTURES.marble, roughness: 0.3 }));
  altar.position.y = 0.5;
  altar.castShadow = true;
  g.add(altar);

  const flowerGeo = new THREE.TorusGeometry(0.65, 0.18, 12, 24);
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.3, roughness: 0.2 });
  camelliaBlessingMesh = new THREE.Mesh(flowerGeo, flowerMat);
  camelliaBlessingMesh.position.y = 1.9;
  g.add(camelliaBlessingMesh);

  const goldCore = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 }));
  goldCore.position.y = 1.9;
  g.add(goldCore);

  createSignBoard(0, 1.15, 1.5, "오늘의 시정 축복 KIOSK (동백꽃 행운)", 0xe11d48, g);

  registerInteractionArea({
    x, z, radius: 3.2,
    name: "오늘의 시정 축복 KIOSK",
    action: () => triggerDailyBlessing()
  });

  cityHallWorldGroup.add(g);
}

function triggerDailyBlessing() {
  const blessings = [
    "시민과 함께 바다로 미래로 도약하는 부산! 오늘 행운지수 99점!",
    "따뜻한 동백꽃의 온기가 깃듭니다! 시민 소통력 대폭 상승 (+50 EXP)",
    "다시 태어나도 살고 싶은 도시, 부산! 당신의 하루에 축복이 가득합니다!",
    "맑은 해양 바람이 시민 여러분의 꿈을 응원합니다! (경험치 획득)"
  ];
  const b = blessings[Math.floor(Math.random() * blessings.length)];
  addExp(50);
  showToastNotification(`🌸 [시정 축복] ${b}`);
  showSpeechBubble(STATE.name, `✨ 오늘의 축복: "${b}"`);
  activateGoldenAura(18);
  if (typeof playSfx === 'function') playSfx('levelUp');
}

// ========================================================
// [지피티 추천 2] 시민 희망 축제 불꽃놀이 발사대
// ========================================================
let activeFireworks = [];
function buildFireworksLauncher(x = -18, y = 0, z = 24) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 }));
  base.position.y = 0.4;
  g.add(base);

  const rocket = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
  rocket.position.y = 1.2;
  g.add(rocket);

  createSignBoard(0, 0.95, 1.3, "시민 희망 축제 불꽃놀이 발사대", 0x0284c7, g);

  registerInteractionArea({
    x, z, radius: 3.0,
    name: "불꽃놀이 발사대",
    action: () => launchCivicFireworks(x, 2, z)
  });

  cityHallWorldGroup.add(g);
}

function launchCivicFireworks(startX, startY, startZ) {
  showToastNotification("🎆 시민 희망 축제 불꽃놀이가 광장 밤하늘에 발사되었습니다!");
  if (typeof playSfx === 'function') playSfx('portal');

  const pCount = 120;
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(pCount * 3);
  const velocities = [];
  const colors = [0xf59e0b, 0xef4444, 0x38bdf8, 0xa855f7, 0x10b981];
  const chosenColor = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < pCount; i++) {
    positions[i * 3] = startX;
    positions[i * 3 + 1] = startY + 12;
    positions[i * 3 + 2] = startZ;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const speed = 0.25 + Math.random() * 0.45;
    velocities.push({
      vx: Math.sin(phi) * Math.cos(theta) * speed,
      vy: Math.cos(phi) * speed + 0.15,
      vz: Math.sin(phi) * Math.sin(theta) * speed
    });
  }
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: chosenColor,
    size: 0.45,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending
  });
  const pSystem = new THREE.Points(geom, mat);
  scene.add(pSystem);

  activeFireworks.push({
    mesh: pSystem,
    velocities,
    life: 2.5,
    maxLife: 2.5
  });
}

// ========================================================
// [지피티 추천 3] 부산 시민 명예의 전당 훈장 전시관 (20단계)
// ========================================================
function buildCivicHonorHallExhibition(startX = -26, y = 0, startZ = 46) {
  const g = new THREE.Group();
  g.position.set(startX, y, startZ);

  const podium = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 4), new THREE.MeshStandardMaterial({ map: TEXTURES.marble, roughness: 0.3 }));
  podium.position.set(0, 0.2, 0);
  g.add(podium);

  const medalColors = [0xcd7f32, 0xe2e8f0, 0xf59e0b];
  const medalTitles = ["모범시민 훈장", "소통영웅 훈장", "부산 명예시장 훈장"];

  for (let i = 0; i < 3; i++) {
    const mx = -3.2 + i * 3.2;
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 }));
    stand.position.set(mx, 0.8, 0);
    g.add(stand);

    const medal = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16), new THREE.MeshStandardMaterial({ color: medalColors[i], metalness: 0.9, roughness: 0.2 }));
    medal.position.set(mx, 1.5, 0);
    medal.rotation.x = Math.PI / 4;
    g.add(medal);

    createSignBoard(mx, 2.05, 0, medalTitles[i], medalColors[i], g);
  }

  createSignBoard(0, 2.5, 0, "부산 시민 명예의 전당 훈장 갤러리", 0xd97706, g);

  registerInteractionArea({
    x: startX, z: startZ, radius: 4.5,
    name: "명예의 전당 훈장 전시관",
    action: () => {
      showToastNotification("🎖️ [명예의 전당] 1~20단계 시민 계급 및 공로 훈장이 전시되어 있습니다.");
      if (typeof openCivicRankGuideModal === 'function') openCivicRankGuideModal();
    }
  });

  cityHallWorldGroup.add(g);
}

// ========================================================
// [가즈아 대성전급] 고해상도 시민 페이스 캔버스 텍스처 엔진
// ========================================================
function createCitizenFaceTexture(skinTone = 'warm', mood = 'happy') {
  const W = 1024, H = 512;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  const cx = 256, ey = 256;

  const skinPals = {
    warm: '#f3c4a2',
    fair: '#fbe2d5',
    tan: '#d99f7d',
    golden: '#e6b98e',
    cool: '#f6d5ca'
  };
  const baseColor = skinPals[skinTone] || skinPals.warm;
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, W, H);

  const gFace = ctx.createRadialGradient(cx, ey, 20, cx, ey, 280);
  gFace.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
  gFace.addColorStop(0.65, 'rgba(255, 230, 215, 0.18)');
  gFace.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  ctx.fillStyle = gFace;
  ctx.fillRect(0, 0, W, H);

  for (const s of [-1, 1]) {
    const bx = cx + s * 115, by = ey + 52;
    const gBlush = ctx.createRadialGradient(bx, by, 4, bx, by, 52);
    gBlush.addColorStop(0, 'rgba(255, 95, 125, 0.75)');
    gBlush.addColorStop(0.55, 'rgba(255, 130, 155, 0.35)');
    gBlush.addColorStop(1, 'rgba(255, 130, 155, 0)');
    ctx.fillStyle = gBlush;
    ctx.beginPath();
    ctx.arc(bx, by, 52, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#2d1810';
  ctx.lineWidth = 6.5;
  ctx.lineCap = 'round';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + s * 78, ey - 48, 34, 11, s * 0.14, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  for (const s of [-1, 1]) {
    const ex = cx + s * 78, eyPos = ey + 6;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(ex, eyPos, 22, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    const gIris = ctx.createRadialGradient(ex, eyPos + 10, 2, ex, eyPos + 10, 18);
    gIris.addColorStop(0, '#38bdf8');
    gIris.addColorStop(0.7, '#0284c7');
    gIris.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = gIris;
    ctx.beginPath();
    ctx.arc(ex, eyPos + 8, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex - 6, eyPos - 8, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 8, eyPos + 8, 4.0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(ex, eyPos - 6, 24, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(cx, ey + 72, 14, 0.1, Math.PI - 0.1);
  ctx.fill();
  ctx.strokeStyle = '#be123c';
  ctx.lineWidth = 3;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
  tex.anisotropy = 8;
  return tex;
}

// ========================================================
// 헤어 스타일링: 단발머리 눈 위 앞머리 뱅 및 고품질 스타일
// ========================================================
function applyHairDecoration(slot, hairStyle, hairMat) {
  while (slot.children.length > 0) slot.remove(slot.children[0]);
  if (!hairMat) hairMat = SHARED_MAT.hair;

  // 모든 헤어 스타일에 풍성하고 귀여운 정수리 탑 크라운(Top Crown) 기본 적용 (달걀머리/대머리 방지!)
  const baseCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.428, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.46),
    hairMat
  );
  baseCrown.position.set(0, 0.04, -0.02);
  slot.add(baseCrown);

  if (hairStyle === 'bob') {
    // [1] 러블리 단발머리
    const bobShell = new THREE.Mesh(
      new THREE.SphereGeometry(0.428, 22, 16, Math.PI * 0.72, Math.PI * 1.56, 0, Math.PI * 0.76),
      hairMat
    );
    bobShell.position.set(0, 0.02, -0.04);
    slot.add(bobShell);

    const bobCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.424, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.30),
      hairMat
    );
    bobCrown.position.set(0, 0.08, -0.02);
    slot.add(bobCrown);

    // ★ 단발머리 눈 위 앞머리 (y: 0.24, z: 0.365)
    const bangCenter = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.07), hairMat);
    bangCenter.position.set(0, 0.24, 0.365);
    slot.add(bangCenter);

    const bangLeft = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.07, 0.07), hairMat);
    bangLeft.position.set(-0.15, 0.22, 0.355);
    bangLeft.rotation.z = 0.14;
    slot.add(bangLeft);

    const bangRight = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.07, 0.07), hairMat);
    bangRight.position.set(0.15, 0.22, 0.355);
    bangRight.rotation.z = -0.14;
    slot.add(bangRight);

    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.22), hairMat);
    sideL.position.set(-0.38, -0.02, 0.08);
    sideL.rotation.y = 0.12;
    slot.add(sideL);

    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.22), hairMat);
    sideR.position.set(0.38, -0.02, 0.08);
    sideR.rotation.y = -0.12;
    slot.add(sideR);

    const backNeck = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.36, 0.22), hairMat);
    backNeck.position.set(0, -0.04, -0.26);
    slot.add(backNeck);

    const pinFlower = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 8), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
    pinFlower.position.set(-0.28, 0.25, 0.28);
    pinFlower.rotation.x = Math.PI / 2;
    slot.add(pinFlower);
    const pinCenter = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    pinCenter.position.set(-0.28, 0.25, 0.30);
    slot.add(pinCenter);

  } else if (hairStyle === 'long') {
    const bang = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.08), hairMat);
    bang.position.set(0, 0.24, 0.365);
    slot.add(bang);

    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.72, 0.22), hairMat);
    sideL.position.set(-0.38, -0.18, 0.08);
    slot.add(sideL);

    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.72, 0.22), hairMat);
    sideR.position.set(0.38, -0.18, 0.08);
    slot.add(sideR);

    const backLong = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.82, 0.20), hairMat);
    backLong.position.set(0, -0.24, -0.28);
    slot.add(backLong);

  } else if (hairStyle === 'ponytail') {
    const bang = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.08), hairMat);
    bang.position.set(0, 0.24, 0.365);
    slot.add(bang);

    const tieRing = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.03, 8, 16), new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3 }));
    tieRing.position.set(0, 0.30, -0.36);
    tieRing.rotation.x = 0.5;
    slot.add(tieRing);

    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 0.60, 12), hairMat);
    tail.position.set(0, 0.04, -0.46);
    tail.rotation.x = -0.55;
    slot.add(tail);

  } else if (hairStyle === 'twintail') {
    const bang = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.08), hairMat);
    bang.position.set(0, 0.24, 0.365);
    slot.add(bang);

    for (const [s, rot] of [[-1, 0.3], [1, -0.3]]) {
      const ring = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
      ring.position.set(s * 0.42, 0.20, -0.15);
      slot.add(ring);

      const tt = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.14, 0.55, 10), hairMat);
      tt.position.set(s * 0.46, -0.06, -0.15);
      tt.rotation.z = rot;
      slot.add(tt);
    }

  } else {
    const bCenter = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.07, 0.07), hairMat);
    bCenter.position.set(0, 0.24, 0.365);
    slot.add(bCenter);

    const bLeft = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.07, 0.07), hairMat);
    bLeft.position.set(-0.14, 0.22, 0.355);
    bLeft.rotation.z = 0.16;
    slot.add(bLeft);

    const bRight = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.07, 0.07), hairMat);
    bRight.position.set(0.14, 0.22, 0.355);
    bRight.rotation.z = -0.16;
    slot.add(bRight);

    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.28, 0.14), hairMat);
    sideL.position.set(-0.38, 0.02, 0.08);
    slot.add(sideL);

    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.28, 0.14), hairMat);
    sideR.position.set(0.38, 0.02, 0.08);
    sideR.rotation.y = 0;
    slot.add(sideR);

    const backShort = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12, Math.PI * 0.8, Math.PI * 1.4, 0, Math.PI * 0.65), hairMat);
    backShort.position.set(0, 0.04, -0.04);
    slot.add(backShort);
  }
}

let goldenAuraTimer = null;
function activateGoldenAura(durationSec = 15) {
  const target = (typeof localPlayer !== 'undefined' && localPlayer) ? localPlayer : null;
  if (!target || !target.userData || !target.userData.auraRing) return;
  target.userData.auraRing.material.opacity = 0.85;
  if (goldenAuraTimer) clearTimeout(goldenAuraTimer);
  goldenAuraTimer = setTimeout(() => {
    if (target && target.userData && target.userData.auraRing && STATE.playerLevel < 5) {
      target.userData.auraRing.material.opacity = 0.0;
    }
  }, durationSec * 1000);
}


// ========================================================
// [부산광역시청 야외 시민광장 월드 (BUSAN-HQ)]
// (3D 본관 외관 + 시민광장 + 닻 조형물 + 음악분수 + 원경 파노라마 + 민원실 입구 포털)
// ========================================================

// ========================================================
// 5-B. 시청 광장 & 야외공원 자율 산책 및 대화 NPC 시스템
// (부기, 시청공무원, 스마트회사원, 동백이 자율 보행 및 상호작용)
// ========================================================
const outdoorNpcs = [];

function initOutdoorAutonomousNpcs() {
  outdoorNpcs.forEach(n => {
    if (n.mesh && n.mesh.parent) n.mesh.parent.remove(n.mesh);
  });
  outdoorNpcs.length = 0;

  // 1. [부산시 소통 마스코트 부기] 100% 공식 3D 부기 마스코트 (조롱박형 체형+이마 빨간 스마트 안경+동백꽃 스니커즈)
  const badaMesh = new THREE.Group();
  const boogiMascot = createOfficialBoogiMesh();
  boogiMascot.scale.set(1.25, 1.25, 1.25);
  badaMesh.add(boogiMascot);
  badaMesh.userData.tripoMesh = boogiMascot;
  badaMesh.userData.tripoBaseY = 0.0;

  const badaNameplate = createCivicNameplate("부기", "부산시 공식 소통 마스코트", 100, true);
  badaNameplate.position.y = 1.68;
  badaMesh.add(badaNameplate);
  badaMesh.userData.nameplate = badaNameplate;

  badaMesh.position.set(-6, 0, 20);
  badaMesh.userData.npcData = {
    id: 'npc_bada',
    name: '부기 (Boogi)',
    title: '부산시 공식 소통 마스코트',
    type: 'bada'
  };
  cityHallWorldGroup.add(badaMesh);

  outdoorNpcs.push({
    id: 'npc_bada',
    mesh: badaMesh,
    name: '부기',
    title: '부산 소통캐릭터',
    speed: 2.6,
    waypoints: [
      { x: -6, z: 20 },
      { x: -14, z: 28 },
      { x: -10, z: 42 },
      { x: 0, z: 36 },
      { x: 10, z: 42 },
      { x: 14, z: 28 },
      { x: 6, z: 20 },
      { x: 0, z: 14 }
    ],
    wpIndex: 0,
    chatCooldown: 8.0,
    chatLines: [
      "안녕! 나는 부산시 소통 캐릭터 부기야! 반가워~ 🌊",
      "시청 광장 음악분수 소리 들으니 시원하지? ⛲",
      "시청 2층 행복민원실 들어가면 여권이랑 증명서 다 발급받을 수 있어! 🏛️",
      "16개 구·군청도 실제 청사 모습으로 멋지게 꾸며져 있으니 구경해봐! 🗺️"
    ]
  });

  // 2. [부산시청 공무원] Civil Officer NPC
  const officerMesh = createCuteCitizenMesh({
    name: "박주무관",
    title: "시민광장 현장안내관 (Lv.16)",
    level: 16,
    robeColor: "civil_suit",
    hairStyle: "dandy",
    hairColor: "black",
    itemHeld: "clipboard",
    isNpc: true
  });
  officerMesh.position.set(6, 0, 18);
  officerMesh.userData.npcData = {
    id: 'npc_officer',
    name: '박주무관',
    title: '시정안내 공무원',
    type: 'officer'
  };
  cityHallWorldGroup.add(officerMesh);

  outdoorNpcs.push({
    id: 'npc_officer',
    mesh: officerMesh,
    name: '박주무관',
    title: '시정 공무원',
    speed: 2.4,
    waypoints: [
      { x: 6, z: 18 },
      { x: 16, z: 18 },
      { x: 16, z: 8 },
      { x: -6, z: 8 },
      { x: -16, z: 18 },
      { x: 0, z: 18 }
    ],
    wpIndex: 0,
    chatCooldown: 12.0,
    chatLines: [
      "안녕하십니까! 부산광역시청을 찾아주신 시민 여러분을 환영합니다 🏛️",
      "정문 앞 포털이나 상단 [민원실 바로가기]를 누르시면 2층 행복민원실로 바로 연결됩니다.",
      "120 부산민원콜센터와 열린 정보공개방에서 다양한 시정 정보를 열람하실 수 있습니다."
    ]
  });

  // 3. [스마트 회사원] Office Worker NPC
  const workerMesh = createCuteCitizenMesh({
    name: "이대리",
    title: "스마트 행정타운 회사원 (Lv.12)",
    level: 12,
    robeColor: "navy_suit",
    hairStyle: "wavy",
    hairColor: "dark_brown",
    itemHeld: "coffee",
    isNpc: true
  });
  workerMesh.position.set(12, 0, 32);
  workerMesh.userData.npcData = {
    id: 'npc_worker',
    name: '이대리',
    title: '스마트 회사원',
    type: 'worker'
  };
  cityHallWorldGroup.add(workerMesh);

  outdoorNpcs.push({
    id: 'npc_worker',
    mesh: workerMesh,
    name: '이대리',
    title: '스마트 회사원',
    speed: 2.5,
    waypoints: [
      { x: 12, z: 32 },
      { x: 22, z: 32 },
      { x: 22, z: 46 },
      { x: 4, z: 46 },
      { x: 4, z: 32 }
    ],
    wpIndex: 0,
    chatCooldown: 14.0,
    chatLines: [
      "시청 광장 커피 한 잔의 여유~ 시정 앱도 빠르고 편리하네요 ☕",
      "오늘도 부산시민 모두 화이팅입니다!"
    ]
  });

  // 4. [동백이] Dongbaek Mascot
  const dongbaekMesh = createCuteCitizenMesh({
    name: "동백이",
    title: "부산시 소통 길잡이 (Lv.15)",
    level: 15,
    robeColor: "camellia",
    hatType: "camellia",
    hairStyle: "bob",
    hairColor: "pink",
    skinTone: "warm",
    isNpc: true
  });
  dongbaekMesh.position.set(-14, 0, 30);
  dongbaekMesh.userData.npcData = {
    id: 'npc_dongbaek',
    name: '동백이',
    title: '부산시 소통 길잡이',
    type: 'dongbaek'
  };
  cityHallWorldGroup.add(dongbaekMesh);

  outdoorNpcs.push({
    id: 'npc_dongbaek',
    mesh: dongbaekMesh,
    name: '동백이',
    title: '소통 길잡이',
    speed: 2.8,
    waypoints: [
      { x: -14, z: 30 },
      { x: -24, z: 30 },
      { x: -24, z: 44 },
      { x: -14, z: 44 }
    ],
    wpIndex: 0,
    chatCooldown: 10.0,
    chatLines: [
      "동백꽃 만개한 부산시청 광장에 오신 것을 환영해요 🌺",
      "동백전 카드 혜택과 구·군별 맛집 리스트도 확인해 보세요!"
    ]
  });

  // ★ Tripo 3D 모델이 이미 로드되어 있다면 즉시 재바인딩 (화면 전환/초기화 시 절대 유실 방지)
  if (typeof TripoAssetManager !== 'undefined') {
    if (TripoAssetManager.boogiModel) {
      TripoAssetManager.replaceBoogiMascot(TripoAssetManager.boogiModel);
    }
    if (TripoAssetManager.civilOfficerModel) {
      TripoAssetManager.replaceCivilOfficerModel(TripoAssetManager.civilOfficerModel);
    }
    if (TripoAssetManager.officeWorkerModel) {
      TripoAssetManager.replaceOfficeWorkerModel(TripoAssetManager.officeWorkerModel);
    }
  }
}

function updateOutdoorNpcs(dt) {
  if (STATE.currentRoom !== 'BUSAN-HQ') return;

  // ★ Tripo 3D 모델 비동기 로드 완료 시 즉시 3D 리깅 메시 바인딩 (지연 로딩 자동 감지)
  if (typeof TripoAssetManager !== 'undefined') {
    if (TripoAssetManager.boogiModel) {
      const bada = outdoorNpcs.find(n => n.id === 'npc_bada');
      if (bada && bada.mesh && !bada.mesh.userData.tripoMesh) {
        TripoAssetManager.replaceBoogiMascot(TripoAssetManager.boogiModel);
      }
    }
    if (TripoAssetManager.civilOfficerModel) {
      const off = outdoorNpcs.find(n => n.id && n.id.includes('officer'));
      if (off && off.mesh && !off.mesh.userData.tripoMesh) {
        TripoAssetManager.replaceCivilOfficerModel(TripoAssetManager.civilOfficerModel);
      }
    }
    if (TripoAssetManager.officeWorkerModel) {
      const wrk = outdoorNpcs.find(n => n.id && n.id.includes('worker'));
      if (wrk && wrk.mesh && !wrk.mesh.userData.tripoMesh) {
        TripoAssetManager.replaceOfficeWorkerModel(TripoAssetManager.officeWorkerModel);
      }
    }
  }

  outdoorNpcs.forEach(npc => {
    if (!npc.mesh) return;
    const wp = npc.waypoints[npc.wpIndex];
    const cur = npc.mesh.position;
    const dx = wp.x - cur.x;
    const dz = wp.z - cur.z;
    const dist = Math.hypot(dx, dz);

    const ud = npc.mesh.userData;

    // ★ 실시간 지형 바닥 높이 동기화 (발바닥 잠김/공중부양 완전 해결)
    cur.y = getBusanCityHallFloorY(cur.x, cur.z);

    if (dist > 0.4) {
      const dirX = dx / dist;
      const dirZ = dz / dist;
      cur.x += dirX * npc.speed * dt;
      cur.z += dirZ * npc.speed * dt;

      const targetAngle = Math.atan2(dirX, dirZ);
      npc.mesh.rotation.y = targetAngle;

      ud.isWalking = true;
      if (ud.tripoMesh && ud.tripoMesh.userData.mixer) {
        if (ud.tripoMesh.userData.currentAction !== 'walk' && ud.tripoMesh.userData.walkAction) {
          if (ud.tripoMesh.userData.idleAction) ud.tripoMesh.userData.idleAction.fadeOut(0.2);
          ud.tripoMesh.userData.walkAction.reset().fadeIn(0.2).play();
          ud.tripoMesh.userData.currentAction = 'walk';
        }
        ud.tripoMesh.userData.mixer.update(dt);
      }
    } else {
      npc.wpIndex = (npc.wpIndex + 1) % npc.waypoints.length;
      ud.isWalking = false;
      if (ud.tripoMesh && ud.tripoMesh.userData.mixer) {
        if (ud.tripoMesh.userData.currentAction !== 'idle' && ud.tripoMesh.userData.idleAction) {
          if (ud.tripoMesh.userData.walkAction) ud.tripoMesh.userData.walkAction.fadeOut(0.2);
          ud.tripoMesh.userData.idleAction.reset().fadeIn(0.2).play();
          ud.tripoMesh.userData.currentAction = 'idle';
        }
        ud.tripoMesh.userData.mixer.update(dt);
      }
    }

    // ★ 모든 NPC 관절 보행 물리 호출 (동상처럼 굳어서 미끄러지는 버그 원천 해결)
    updateCuteCitizenAnimation(npc.mesh, dt, clock.getElapsedTime());

    npc.chatCooldown -= dt;
    if (npc.chatCooldown <= 0) {
      const line = npc.chatLines[Math.floor(Math.random() * npc.chatLines.length)];
      showSpeechBubble(npc.mesh, line);
      npc.chatCooldown = 12.0 + Math.random() * 8.0;
    }
  });
}

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
  cityHallWorldGroup.add(terrain);

  // (2) 시민광장 화강석 석재 바닥
  const plazaFloorGeo = new THREE.PlaneGeometry(64, 52);
  const plazaFloorMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.plaza,
    roughness: 0.4
  });
  const plazaFloor = new THREE.Mesh(plazaFloorGeo, plazaFloorMat);
  plazaFloor.rotation.x = -Math.PI / 2;
  plazaFloor.position.set(0, 0.01, 25);
  plazaFloor.receiveShadow = true;
  cityHallWorldGroup.add(plazaFloor);

  // (3) 시민광장 닻 조형물 & 음악 분수대
  buildAnchorSculpture(0, 0, 24);
  buildDancingFountain(0, 0, 42);

  // (4) 등대광장 & 소원 연못
  buildLighthouseSquare(34, 0, 30);

  // (5) 동백광장 정원 & 벤치
  buildCamelliaSquare(-34, 0, 30);

  // (6) 녹음광장 야외공연장 & 버스킹 무대
  buildGreenPlazaAmphitheater(-33, 0, 60);

  // (7) 잔디광장 시민 발언대
  buildFreeSpeechPodium(33, 0, 60);

  // (8) 가로등 & 조경 & 전시
  buildPlazaStreetlamps();
  buildCamelliaFortuneKiosk(18, 0, 24);
  buildFireworksLauncher(-18, 0, 24);
  buildCivicHonorHallExhibition(-26, 0, 46);
  createFlockOfSeagulls();
  buildEnhancedPlazaLandscaping();

  // (9) 원경 명산 (황령산 & 금정산 파노라마)
  createDistantBusanSkylinePanorama();

  // (10) ★ 부산시청 본관 정문 & 2층 종합민원실(행복민원실) 워프 게이트!
  buildCityHallEntrancePortal(cityHallWorldGroup);
}

function buildCityHallTowerFacade() {
  const buildingGroup = new THREE.Group();

  const towerMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.glassTower,
    metalness: 0.5,
    roughness: 0.2
  });
  const wallMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.glassTower,
    metalness: 0.4,
    roughness: 0.3
  });
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.6
  });

  // 1. 28층 상층 모던 글래스 타워 볼륨 (3층~28층: Y 10.0 ~ 44.0, 실내 1~2층 천장 위로 배치하여 실내 시야 100% 확보)
  const upperTowerGeo = new THREE.BoxGeometry(84, 34, 70);
  const upperTower = new THREE.Mesh(upperTowerGeo, towerMat);
  upperTower.position.set(0, 27, -50);
  upperTower.castShadow = true;
  buildingGroup.add(upperTower);

  // 2. 1~2층 실내 홀 천장 (Y: 10.0, Z: -45)
  const ceilingGeo = new THREE.PlaneGeometry(84, 84);
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2; // 아래를 향함
  ceiling.position.set(0, 10.0, -45);
  buildingGroup.add(ceiling);

  // 3. 1~2층 외벽 (H: 10.0, Y: 5.0) - 실내 로비 및 2층 민원실을 둘러싸는 실제 건축 외벽 구조
  // 좌측 외벽 (X: -42, Z: -45)
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 84), wallMat);
  leftWall.position.set(-42, 5, -45);
  buildingGroup.add(leftWall);

  // 우측 외벽 (X: 42, Z: -45)
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 84), wallMat);
  rightWall.position.set(42, 5, -45);
  buildingGroup.add(rightWall);

  // 후면 외벽 (Z: -87, X: 0)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(86, 10, 2), wallMat);
  backWall.position.set(0, 5, -87);
  buildingGroup.add(backWall);

  // 전면 파사드 외벽 (Z: 0, 중앙 통로 X: -6 ~ 6 개방)
  const frontLeft = new THREE.Mesh(new THREE.BoxGeometry(36, 10, 2), wallMat);
  frontLeft.position.set(-24, 5, 0);
  buildingGroup.add(frontLeft);

  const frontRight = new THREE.Mesh(new THREE.BoxGeometry(36, 10, 2), wallMat);
  frontRight.position.set(24, 5, 0);
  buildingGroup.add(frontRight);

  // 전면 중앙 문 위 보 (Lintel Beam, Y: 7.5, H: 5.0)
  const frontLintel = new THREE.Mesh(new THREE.BoxGeometry(14, 5.0, 2), wallMat);
  frontLintel.position.set(0, 7.5, 0);
  buildingGroup.add(frontLintel);

  // 실내 쾌적 조명 (1층 로비 & 2층 행복민원실 앰비언트 포인트 라이트)
  const lobbyLight1 = new THREE.PointLight(0xfff5ea, 1.4, 38);
  lobbyLight1.position.set(-18, 4.5, -18);
  buildingGroup.add(lobbyLight1);

  const lobbyLight2 = new THREE.PointLight(0xfff5ea, 1.4, 38);
  lobbyLight2.position.set(18, 4.5, -18);
  buildingGroup.add(lobbyLight2);

  const hall2Light = new THREE.PointLight(0xfff8ee, 1.6, 45);
  hall2Light.position.set(0, 9.2, -60);
  buildingGroup.add(hall2Light);

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

  // 유리 자동문 입구 (Z: 0, X: -5 ~ 5, 투명도 0.35로 시야 확보)
  const doorGeo = new THREE.BoxGeometry(10, 4.2, 0.2);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.35 });
  const doors = new THREE.Mesh(doorGeo, doorMat);
  doors.position.set(0, 2.1, 0);
  buildingGroup.add(doors);

  cityHallWorldGroup.add(buildingGroup);

  // 야외 광장 자율 산책 및 대화 NPC 초기화
  initOutdoorAutonomousNpcs();

  // 건물 외벽 물리 충돌 등록 (중앙 문 X: -6 ~ 6 완벽 통과)
  busanCityHallObstacles.push({ type: 'box', x: -24, z: 0, w: 36, d: 2, h: 10 });
  busanCityHallObstacles.push({ type: 'box', x: 24, z: 0, w: 36, d: 2, h: 10 });
  busanCityHallObstacles.push({ type: 'box', x: -42, z: -45, w: 2, d: 84, h: 15 });
  busanCityHallObstacles.push({ type: 'box', x: 42, z: -45, w: 2, d: 84, h: 15 });
  busanCityHallObstacles.push({ type: 'box', x: 0, z: -87, w: 86, d: 2, h: 15 });
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

  cityHallWorldGroup.add(group);

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
// [건축 3] 다이내믹 3D 음악 분수대 (Dynamic Animated Musical Dancing Fountain)
// - 바닥 접지 완벽 밀착 (y: 0~0.65 단차 화강석 석조 수조)
// - 실시간 포물선 물줄기 16열 파도 댄스 (Sinusoidal Arches)
// - 중앙 고압 용솟음 기저 (Center Geyser Spout 10m + 50개 낙하 물방울 파티클)
// - 내측 8열 나선 회전 물줄기 (Swirling Spiral Jets)
// - 수중 다채색 RGB LED 나이트쇼 조명 (Cyan, Sapphire, Magenta, Gold, Emerald)
// --------------------------------------------------------
let musicalFountainData = null;

function buildDancingFountain(x, y, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z); // Plaza floor y = 0 바닥 완벽 접지!
  group.userData.isProceduralFountain = true;

  // 1. 외곽 1단 웅장한 다각형 화강석 석조 테두리 (Outer Basin Rim)
  const outerBasinGeo = new THREE.CylinderGeometry(7.2, 7.5, 0.65, 32);
  const graniteMat = new THREE.MeshStandardMaterial({
    color: 0x475569, // Slate granite
    roughness: 0.35,
    metalness: 0.1
  });
  const outerBasin = new THREE.Mesh(outerBasinGeo, graniteMat);
  outerBasin.position.y = 0.325;
  outerBasin.receiveShadow = true;
  outerBasin.castShadow = true;
  group.add(outerBasin);

  // 2. 상단 마감 화강석 코핑 몰딩 (Top Coping Ring)
  const copingGeo = new THREE.TorusGeometry(7.15, 0.22, 12, 32);
  copingGeo.rotateX(Math.PI / 2);
  const copingMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // Light granite trim
    roughness: 0.25
  });
  const coping = new THREE.Mesh(copingGeo, copingMat);
  coping.position.y = 0.65;
  group.add(coping);

  // 3. 내측 2단 원형 대리석 단상 (Inner Basin Step)
  const innerStepGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.45, 24);
  const innerStepMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.4
  });
  const innerStep = new THREE.Mesh(innerStepGeo, innerStepMat);
  innerStep.position.y = 0.45;
  innerStep.receiveShadow = true;
  group.add(innerStep);

  // 4. 중앙 예술 석조 분수탑 타워 (Central Stepped Fountain Tower)
  const towerBaseGeo = new THREE.CylinderGeometry(1.5, 1.8, 1.2, 20);
  const towerBase = new THREE.Mesh(towerBaseGeo, copingMat);
  towerBase.position.y = 0.85;
  group.add(towerBase);

  const towerBowlGeo = new THREE.CylinderGeometry(2.2, 1.4, 0.4, 20);
  const towerBowl = new THREE.Mesh(towerBowlGeo, copingMat);
  towerBowl.position.y = 1.6;
  group.add(towerBowl);

  const topSpoutGeo = new THREE.CylinderGeometry(0.3, 0.6, 0.7, 16);
  const topSpout = new THREE.Mesh(topSpoutGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 }));
  topSpout.position.y = 2.1;
  group.add(topSpout);

  // 5. 맑고 푸른 수면 (Shimmering Water Surface)
  const waterGeo = new THREE.CircleGeometry(6.9, 32);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Marine Royal Blue
    roughness: 0.05,
    metalness: 0.15,
    transparent: true,
    opacity: 0.88
  });
  const waterPlane = new THREE.Mesh(waterGeo, waterMat);
  waterPlane.position.y = 0.58;
  group.add(waterPlane);

  // 6. 상부 볼 수면
  const upperWaterGeo = new THREE.CircleGeometry(2.0, 20);
  upperWaterGeo.rotateX(-Math.PI / 2);
  const upperWater = new THREE.Mesh(upperWaterGeo, waterMat);
  upperWater.position.y = 1.75;
  group.add(upperWater);

  // 7. 실시간 물 파동 동심원 링 (Animated Wave Ripples)
  const ripples = [];
  for (let r = 0; r < 4; r++) {
    const ringGeo = new THREE.RingGeometry(0.8, 1.1, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.59;
    ring.userData = { phase: r * 0.7, maxRadius: 6.8 };
    group.add(ring);
    ripples.push(ring);
  }

  // 8. 수중 컬러 LED 스포트라이트 (Submerged Underwater RGB LEDs)
  const underwaterLights = [];
  const lightColors = [0x06b6d4, 0x2563eb, 0xd946ef, 0x10b981];
  for (let li = 0; li < 4; li++) {
    const pl = new THREE.PointLight(lightColors[li], 3.0, 12);
    const la = (li / 4) * Math.PI * 2;
    pl.position.set(Math.cos(la) * 3.8, 0.7, Math.sin(la) * 3.8);
    group.add(pl);
    underwaterLights.push(pl);
  }

  // 9. [파티클 시스템 A] 중앙 고압 기저 (Center Geyser Plume - 50 particles)
  const geyserParticles = [];
  const dropletGeo = new THREE.SphereGeometry(0.12, 6, 6);
  const dropletMat = new THREE.MeshStandardMaterial({
    color: 0xf0fdf4,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.4,
    roughness: 0.1,
    transparent: true,
    opacity: 0.92
  });

  for (let i = 0; i < 50; i++) {
    const p = new THREE.Mesh(dropletGeo, dropletMat);
    const angle = Math.random() * Math.PI * 2;
    const spread = Math.random() * 0.4;
    p.position.set(Math.cos(angle) * spread, 2.3, Math.sin(angle) * spread);
    p.userData = {
      vy: 7.0 + Math.random() * 4.5,
      vx: (Math.random() - 0.5) * 1.2,
      vz: (Math.random() - 0.5) * 1.2,
      baseY: 2.3,
      age: Math.random() * 1.5,
      lifetime: 1.5 + Math.random() * 0.6
    };
    group.add(p);
    geyserParticles.push(p);
  }

  // 10. [파티클 시스템 B] 외곽 16열 파도 곡선 아치 분수 (16 Parabolic Arched Jets - 96 particles)
  const archParticles = [];
  for (let jet = 0; jet < 16; jet++) {
    const angle = (jet / 16) * Math.PI * 2;
    for (let step = 0; step < 6; step++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), dropletMat);
      p.userData = {
        jetIndex: jet,
        angle: angle,
        stepFrac: (step + 1) / 6.0,
        baseRadius: 6.2,
        phase: jet * 0.39
      };
      group.add(p);
      archParticles.push(p);
    }
  }

  // 11. [파티클 시스템 C] 내측 8열 나선 회전 회오리 분수 (8 Swirling Spiral Jets - 32 particles)
  const spiralParticles = [];
  for (let s = 0; s < 8; s++) {
    for (let step = 0; step < 4; step++) {
      const sp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), dropletMat);
      sp.userData = {
        spiralIndex: s,
        stepFrac: (step + 1) / 4.0,
        radius: 3.6,
        phase: s * (Math.PI / 4)
      };
      group.add(sp);
      spiralParticles.push(sp);
    }
  }

  // 12. 바닥 분수 포말 스플래시 (Splash rings at landing points)
  const splashParticles = [];
  for (let k = 0; k < 16; k++) {
    const splash = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 0.45, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
    );
    splash.rotateX(-Math.PI / 2);
    splash.position.set(0, 0.6, 0);
    splash.userData = { phase: k * 0.4 };
    group.add(splash);
    splashParticles.push(splash);
  }

  musicalFountainData = {
    group,
    ripples,
    underwaterLights,
    geyserParticles,
    archParticles,
    spiralParticles,
    splashParticles
  };

  cityHallWorldGroup.add(group);

  registerInteractiveObject({
    id: 'fountain',
    pos: { x, y: 0, z },
    radius: 8.0,
    prompt: "⛲ E키: 시정 음악 분수대 (빛과 물의 오케스트라 감상)",
    action: () => {
      showSpeechBubble(localPlayer, "⛲ 시원하게 솟구치는 음악 분수대와 찬란한 LED 불빛이 시민광장을 화사하게 밝힙니다!");
      if (window.busanAudio) window.busanAudio.playFountainSplash();
      addCitizenExp(30);
    }
  });

  busanCityHallObstacles.push({ type: 'cyl', x, z, r: 7.2, h: 0.7 });
}

function updateDancingMusicalFountain(dt, t) {
  if (!musicalFountainData || STATE.currentRoom !== 'BUSAN-HQ') return;
  const d = musicalFountainData;

  // 1. 수면 동심원 리플 (Expanding Ripple Rings)
  d.ripples.forEach(r => {
    const progress = ((t * 0.8 + r.userData.phase) % 1.0);
    const scale = 1.0 + progress * 5.5;
    r.scale.set(scale, scale, 1);
    r.material.opacity = Math.max(0, 0.7 * (1.0 - progress));
  });

  // 2. 수중 RGB LED 라이트쇼 색상 순환 (Vivid Cycle)
  const baseHue = (t * 0.12) % 1.0;
  d.underwaterLights.forEach((pl, i) => {
    const h = (baseHue + i * 0.25) % 1.0;
    pl.color.setHSL(h, 0.95, 0.55);
    pl.intensity = 2.5 + Math.sin(t * 3.0 + i) * 1.0;
  });

  // 3. 중앙 고압 기저 (Geyser Particles: Gravity simulation)
  d.geyserParticles.forEach(p => {
    const ud = p.userData;
    ud.age += dt;
    p.position.y += ud.vy * dt;
    ud.vy -= 12.0 * dt; // Gravity
    p.position.x += ud.vx * dt;
    p.position.z += ud.vz * dt;

    if (p.position.y < ud.baseY || ud.age > ud.lifetime) {
      ud.age = 0;
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.random() * 0.35;
      p.position.set(Math.cos(angle) * spread, ud.baseY, Math.sin(angle) * spread);
      ud.vy = 8.5 + Math.sin(t * 2.0) * 2.0 + Math.random() * 2.5;
      ud.vx = Math.cos(angle) * (0.4 + Math.random() * 0.8);
      ud.vz = Math.sin(angle) * (0.4 + Math.random() * 0.8);
    }
  });

  // 4. 외곽 16열 파도 곡선 아치 분수 (Sinusoidal Parabolic Arches)
  const waveHeight = 3.6 + Math.sin(t * 2.8) * 1.8;
  d.archParticles.forEach(p => {
    const ud = p.userData;
    const jetWave = Math.sin(t * 3.2 + ud.phase);
    const curPeak = Math.max(1.5, waveHeight + jetWave * 1.2);
    
    const frac = ud.stepFrac;
    const curR = ud.baseRadius * (1.0 - frac * 0.7);
    const curY = 0.65 + 4.0 * curPeak * frac * (1.0 - frac);
    p.position.set(Math.cos(ud.angle) * curR, curY, Math.sin(ud.angle) * curR);
  });

  // 5. 내측 8열 나선 회전 회오리 분수 (Swirling Vortex Jets)
  const swirlRot = t * 1.8;
  d.spiralParticles.forEach(sp => {
    const ud = sp.userData;
    const curAngle = ud.phase + swirlRot;
    const frac = ud.stepFrac;
    const curR = ud.radius * (1.0 - frac * 0.4);
    const curY = 0.85 + frac * 3.2 * (0.8 + Math.sin(t * 4.0 + ud.phase) * 0.3);
    sp.position.set(Math.cos(curAngle) * curR, curY, Math.sin(curAngle) * curR);
  });

  // 6. 스플래시 착수 포말 링 애니메이션
  d.splashParticles.forEach((sp, idx) => {
    const a = (idx / d.splashParticles.length) * Math.PI * 2;
    const r = 2.0 + Math.sin(t * 2.5 + sp.userData.phase) * 0.8;
    sp.position.set(Math.cos(a) * r, 0.61, Math.sin(a) * r);
    const sc = 0.6 + Math.sin(t * 6.0 + sp.userData.phase) * 0.4;
    sp.scale.set(sc, sc, 1);
  });
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

  cityHallWorldGroup.add(group);

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
    cityHallWorldGroup.add(petal);
  }

  cityHallWorldGroup.add(group);

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

  cityHallWorldGroup.add(group);

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

  cityHallWorldGroup.add(group);

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

  // [신규] 열린 정보공개관 (연도별 예산서 및 시정정보 데스크)
  buildOpenDataInformationCenter(-24, 0, -14, lobbyGroup);

  
  // [1층 로비 공무원 & 파견 회사원]
  const officerPark = createCuteCitizenMesh({
    name: "박주무관",
    title: "청사 1층 안내관",
    robeColor: "civil_suit",
    hairStyle: "dandy",
    hairColor: "black",
    itemHeld: "tablet",
    isNpc: true
  });
  officerPark.position.set(-6, 0, -18);
  officerPark.rotation.y = 0.5;
  officerPark.userData.npcData = {
    id: 'staff_park',
    name: '박주무관',
    title: '청사 1층 안내관',
    type: 'officer'
  };
  lobbyGroup.add(officerPark);

  registerInteractiveObject({
    id: 'officer_park_interact',
    pos: { x: -6, y: 0, z: -18 },
    radius: 3.8,
    prompt: "💬 [E키 또는 클릭] 박주무관과 대화하기 (청사 1층 안내)",
    action: () => {
      openNpcDialogue('daon');
      showSpeechBubble(officerPark, "어서오십시오! 1층 로비와 들락날락 도서관을 편히 이용하세요.");
      if (window.busanAudio) window.busanAudio.playDingDong();
    }
  });

  const workerLee = createCuteCitizenMesh({
    name: "이대리",
    title: "스마트시티 파견원",
    robeColor: "office_suit",
    hairStyle: "comma",
    hairColor: "brown",
    itemHeld: "briefcase",
    isNpc: true
  });
  workerLee.position.set(16, 0, -22);
  workerLee.rotation.y = -0.6;
  workerLee.userData.npcData = {
    id: 'worker_lee',
    name: '이대리',
    title: '스마트시티 파견 연구원 (Lv.9)',
    type: 'worker'
  };
  lobbyGroup.add(workerLee);

  registerInteractiveObject({
    id: 'worker_lee_interact',
    pos: { x: 16, y: 0, z: -22 },
    radius: 3.8,
    prompt: "💬 [E키 또는 클릭] 이대리와 대화하기 (시청 출장 회사원)",
    action: () => {
      openNpcDialogue('worker_lee');
      showSpeechBubble(workerLee, "스마트시티 프로젝트 회의차 시청에 파견 왔어요 💻");
      if (window.busanAudio) window.busanAudio.playDingDong();
    }
  });

  cityHallWorldGroup.add(lobbyGroup);
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
  daonNpc.userData.isNpc = true;
  daonNpc.userData.npcData = {
    id: 'daon',
    name: '안내원 다온',
    title: '부산시 AI 시정 길잡이 (1층 종합안내)',
    type: 'daon'
  };
  daonNpc.position.set(0, 0, -1.0);
  group.add(daonNpc);

  parent.add(group);

  registerInteractiveObject({
    id: 'ai_daon_desk',
    pos: { x, y, z: z + 1.2 },
    radius: 4.5,
    prompt: "💬 [E키 또는 클릭] 안내원 다온과 대화하기 (AI 종합안내)",
    action: () => {
      openNpcDialogue('daon');
      showSpeechBubble(daonNpc, "안녕하십니까 시민 여러분! AI 안내원 다온입니다 🎧");
      if (window.busanAudio) (window.busanAudio.playChime ? window.busanAudio.playChime() : window.busanAudio.playDingDong());
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

  cityHallWorldGroup.add(group);
}

// --------------------------------------------------------
// [건축 10] 2층 행복민원실 (Happy Civil Service Hall)
// --------------------------------------------------------

// ========================================================
// [시청 야외 본관 정문 & 종합민원실 입구 포털]
// ========================================================
function buildCityHallEntrancePortal(parentGroup) {
  const portalGroup = new THREE.Group();
  portalGroup.position.set(0, 0, -26);

  // 정문 캐노피 프레임
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
  const roof = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 6), canopyMat);
  roof.position.set(0, 4.8, 0);
  portalGroup.add(roof);

  // 양측 지지 기둥
  const colL = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 4.8, 16), canopyMat);
  colL.position.set(-7.5, 2.4, 2.5);
  portalGroup.add(colL);
  const colR = colL.clone();
  colR.position.set(7.5, 2.4, 2.5);
  portalGroup.add(colR);

  // 자동 유리문
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.1 });
  const doorL = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.8, 0.2), glassMat);
  doorL.position.set(-2.0, 1.9, 0);
  portalGroup.add(doorL);
  const doorR = doorL.clone();
  doorR.position.set(2.0, 1.9, 0);
  portalGroup.add(doorR);

  // 블루 LED 발광 바닥 워프 패드
  const padGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.08, 32);
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0284c7,
    emissiveIntensity: 0.65,
    roughness: 0.2
  });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.position.set(0, 0.04, 1.0);
  portalGroup.add(pad);

  // 상단 3D 간판: [ 🏛️ 부산광역시청 종합민원실(행복민원실) 입구 ]
  createSignBoard(0, 5.8, 0, "🏛️ 부산광역시청 2층 행복민원실 입구", 0x0284c7, portalGroup);
  createSignBoard(0, 5.1, 0, "▶ 클릭 또는 E키를 누르면 민원실로 입장합니다", 0x0f172a, portalGroup);

  parentGroup.add(portalGroup);

  // 인터랙티브 상호작용 등록
  registerInteractiveObject({
    id: 'cityhall_entrance_gate',
    pos: { x: 0, y: 0, z: -25 },
    radius: 6.5,
    prompt: "🏛️ [E키 또는 클릭] 부산시청 종합민원실(행복민원실) 입장",
    action: () => {
      switchRealm('BUSAN-CIVIL');
    }
  });

  busanCityHallObstacles.push({ type: 'box', x: -6, z: -26, w: 4, d: 2, h: 5 });
  busanCityHallObstacles.push({ type: 'box', x: 6, z: -26, w: 4, d: 2, h: 5 });
}

// ========================================================
// [부산광역시청 전용 실내 종합민원실(행복민원실) 월드]
// (외벽 간섭 전혀 없이 탁 트이고 쾌적한 럭셔리 실내 행정 공간)
// ========================================================
function buildBusanCivilServiceWorld() {
  while (civilHallWorldGroup.children.length > 0) {
    civilHallWorldGroup.remove(civilHallWorldGroup.children[0]);
  }
  civilHallInteractables = [];
  civilHallObstacles = [];

  // 1. 대리석 바닥 (76m x 48m)
  const floorGeo = new THREE.PlaneGeometry(76, 48);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.25,
    metalness: 0.05
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.01, 0);
  floor.receiveShadow = true;
  civilHallWorldGroup.add(floor);

  // 2. 아늑한 우드월 & 천장 (높이 7m)
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
  const woodAccentMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5 }); // 온화한 원목 루버

  // 뒷벽 (카운터 뒤)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(76, 7.5, 0.8), wallMat);
  backWall.position.set(0, 3.75, -23.5);
  civilHallWorldGroup.add(backWall);

  // 뒷벽 대형 부산 슬로건 간판
  createSignBoard(0, 5.8, -23.0, "Busan is Good! 🏛️ 부산광역시청 행복민원실", 0x0284c7, civilHallWorldGroup);
  createSignBoard(0, 5.0, -23.0, "시민과 함께하는 열린 행정 · 120 바로콜 · 스마트 원스톱 민원서비스", 0x334155, civilHallWorldGroup);

  // 앞벽 (출구 게이트 방면)
  const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(32, 7.5, 0.8), wallMat);
  frontWallL.position.set(-22, 3.75, 23.5);
  civilHallWorldGroup.add(frontWallL);
  const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(32, 7.5, 0.8), wallMat);
  frontWallR.position.set(22, 3.75, 23.5);
  civilHallWorldGroup.add(frontWallR);

  // 좌측벽 / 우측벽
  const sideWallL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7.5, 48), wallMat);
  sideWallL.position.set(-38, 3.75, 0);
  civilHallWorldGroup.add(sideWallL);
  const sideWallR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7.5, 48), wallMat);
  sideWallR.position.set(38, 3.75, 0);
  civilHallWorldGroup.add(sideWallR);

  // 천장
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(76, 48), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 7.5, 0);
  civilHallWorldGroup.add(ceiling);

  // 은은한 실내 조명 (앰비언트 + 펜던트 LED)
  const civilAmbient = new THREE.HemisphereLight(0xffffff, 0xcfd8dc, 1.2);
  civilHallWorldGroup.add(civilAmbient);

  // 3. 8개 전문 종합 민원 창구 (여권, 차량, 세무, 복지 등)
  const cGroup = new THREE.Group();
  cGroup.position.set(0, 0, -14);

  const deskMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
  const deskTopMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

  const deskBase = new THREE.Mesh(new THREE.BoxGeometry(54, 1.15, 2.4), deskMat);
  deskBase.position.y = 0.575;
  cGroup.add(deskBase);

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(54.4, 0.1, 2.8), deskTopMat);
  deskTop.position.y = 1.2;
  cGroup.add(deskTop);

  const services = [
    { num: 1, name: "여권발급·교부", color: 0x0284c7 },
    { num: 2, name: "주민·가족관계", color: 0x0284c7 },
    { num: 3, name: "지적·부동산토지", color: 0x0284c7 },
    { num: 4, name: "지방세·세무상담", color: 0x0284c7 },
    { num: 5, name: "차량등록·취득세", color: 0x0284c7 },
    { num: 6, name: "도시건축·인허가", color: 0x0284c7 },
    { num: 7, name: "어르신·장애인복지", color: 0x0284c7 },
    { num: 8, name: "통합민원·120상담", color: 0x059669 }
  ];

  services.forEach((s, idx) => {
    const cx = -23.5 + idx * 6.7;
    // 아크릴 비말차단막
    const barrier = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.9, 0.05), new THREE.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.45 }));
    barrier.position.set(cx, 1.7, 0.4);
    cGroup.add(barrier);

    // 상단 LED 번호 안내판
    createSignBoard(cx, 2.5, 0.4, `[${s.num}번 창구] ${s.name}`, s.color, cGroup);

    // 창구 담당 공무원 NPC
    const officer = createCuteCitizenMesh({
      name: `창구 주무관 ${s.num}`,
      title: s.name,
      level: 15,
      robeColor: 'civil_suit',
      hairStyle: 'dandy',
      hairColor: 'dark_brown',
      isNpc: true
    });
    officer.position.set(cx, 0, -1.2);
    cGroup.add(officer);
  });

  civilHallWorldGroup.add(cGroup);

  // 4. 순번 대기표 발급 키오스크 (중앙 배치)
  buildQueueTicketKiosk(0, 0, 0, civilHallWorldGroup);

  // 5. 365 스마트 무인민원발급존
  const kioskGroup = new THREE.Group();
  kioskGroup.position.set(24, 0, 4);
  for (let k = 0; k < 3; k++) {
    const kx = -4 + k * 4.0;
    const km = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 1.2), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }));
    km.position.set(kx, 1.1, 0);
    kioskGroup.add(km);
    createSignBoard(kx, 2.6, 0, `365 무인발급기 ${k + 1}`, 0x0369a1, kioskGroup);
  }
  civilHallWorldGroup.add(kioskGroup);

  // 6. 편안한 시민 대기 라운지 (가죽 소파, 혈압측정기, 정수기)
  buildCivilWaitingLounge(-20, 0, 4, civilHallWorldGroup);

  // 7. 행복민원실 현장 안내 공무원 (김주무관)
  const officerKim = createCuteCitizenMesh({
    name: "김주무관",
    title: "민원실 총괄안내관",
    level: 18,
    robeColor: "civil_suit",
    hairStyle: "dandy",
    hairColor: "black",
    itemHeld: "clipboard",
    isNpc: true
  });
  officerKim.position.set(-6, 0, 2.0);
  officerKim.userData.npcData = {
    id: 'staff_kim',
    name: '김주무관',
    title: '행복민원실 현장 총괄안내관',
    type: 'officer'
  };
  civilHallWorldGroup.add(officerKim);

  // 김주무관 대화 인터랙티브
  registerCivilHallInteractive({
    pos: { x: -6, z: 2.0 },
    radius: 4.5,
    prompt: "💬 [E키 또는 클릭] 김주무관과 대화하기 (민원 서식 및 순번 안내)",
    action: () => {
      openNpcDialogue('staff_kim');
      showSpeechBubble(officerKim, "반갑습니다! 순번대기표를 발급받으시면 더 신속히 모시겠습니다 📋");
      if (window.busanAudio) window.busanAudio.playDingDong();
    }
  });

  // 8. ★ 야외 시민광장으로 복귀하는 출구 게이트 (남쪽 입구)
  const exitGroup = new THREE.Group();
  exitGroup.position.set(0, 0, 22);

  const exitPad = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 0.08, 32), new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 0.65
  }));
  exitPad.position.y = 0.04;
  exitGroup.add(exitPad);

  createSignBoard(0, 4.5, 0, "🌳 시청 야외 시민광장 나가기", 0x10b981, exitGroup);
  createSignBoard(0, 3.8, 0, "▶ 클릭 또는 E키를 누르면 야외 광장으로 복귀합니다", 0x334155, exitGroup);

  civilHallWorldGroup.add(exitGroup);

  registerCivilHallInteractive({
    pos: { x: 0, z: 22 },
    radius: 6.5,
    prompt: "🌳 [E키 또는 클릭] 시청 야외 시민광장 나가기",
    action: () => {
      switchRealm('BUSAN-HQ');
    }
  });

  // 실내 충돌체 등록
  civilHallObstacles.push({ type: 'box', x: 0, z: -14, w: 56, d: 3.5, h: 4 });
  civilHallObstacles.push({ type: 'box', x: 0, z: -23.5, w: 76, d: 2, h: 8 });
  civilHallObstacles.push({ type: 'box', x: -38, z: 0, w: 2, d: 48, h: 8 });
  civilHallObstacles.push({ type: 'box', x: 38, z: 0, w: 2, d: 48, h: 8 });
  civilHallObstacles.push({ type: 'box', x: -22, z: 23.5, w: 32, d: 2, h: 8 });
  civilHallObstacles.push({ type: 'box', x: 22, z: 23.5, w: 32, d: 2, h: 8 });
}

function registerCivilHallInteractive(item) {
  civilHallInteractables.push(item);
}

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

  
  // 2층 행복민원실 현장안내 공무원 (김주무관)
  const officerKim = createCuteCitizenMesh({
    name: "김주무관",
    title: "민원실 현장 안내관",
    level: 16,
    robeColor: "civil_suit",
    hairStyle: "dandy",
    hairColor: "black",
    itemHeld: "clipboard",
    isNpc: true
  });
  officerKim.position.set(-6, 5.0, -52);
  officerKim.userData.npcData = {
    id: 'staff_kim',
    name: '김주무관',
    title: '행복민원실 현장 안내관 (Lv.16)',
    type: 'officer'
  };
  floor2Group.add(officerKim);

  registerInteractiveObject({
    id: 'officer_kim_interact',
    pos: { x: -6, y: 5.0, z: -52 },
    radius: 4.0,
    prompt: "💬 [E키 또는 클릭] 김주무관과 대화하기 (행복민원실 현장 도우미)",
    action: () => {
      openNpcDialogue('staff_kim');
      showSpeechBubble(officerKim, "순번대기표를 발급받으시면 더 신속히 안내해 드립니다 📋");
      if (window.busanAudio) window.busanAudio.playDingDong();
    }
  });

  cityHallWorldGroup.add(floor2Group);

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
      robeColor: "civil_suit",
      hatType: "none",
      wingsType: "none",
      isNpc: true,
      itemHeld: i % 2 === 0 ? "clipboard" : "none"
    });
    staff.userData.isNpc = true;
    staff.userData.npcData = {
      id: `staff_${i+1}`,
      serviceName: services[i],
      counterNumber: i + 1,
      name: `담당관 (${services[i]})`,
      title: `2층 행복민원실 ${i + 1}번 창구`,
      type: 'civil_counter'
    };
    staff.position.set(cx, 0, -1.2);
    group.add(staff);

    // 각 창구별 개별 인터랙션 등록
    registerInteractiveObject({
      id: `civil_counter_${i+1}`,
      pos: { x: x + cx, y, z: z + 1.8 },
      radius: 3.2,
      prompt: `💬 [E키 또는 클릭] ${i + 1}번 [${services[i]}] 창구 상담하기`,
      action: () => {
        openCivilOfficialDialogue(services[i], i + 1);
        showSpeechBubble(staff, `어서오십시오! ${i + 1}번 [${services[i]}] 창구입니다.`);
        if (window.busanAudio) (window.busanAudio.playChime ? window.busanAudio.playChime() : window.busanAudio.playDingDong());
      }
    });
  }

  parent.add(group);

  registerInteractiveObject({
    id: 'civil_counters_all',
    pos: { x, y, z: z + 2.0 },
    radius: 7.0,
    prompt: "💬 [E키 또는 클릭] 2층 행복민원실 종합 안내",
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
  safeRoundRect(ctx, 0, 0, 512, 128, 24);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  safeRoundRect(ctx, 4, 4, 504, 120, 20);
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
    cityHallWorldGroup.add(sGroup);
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
  wingsType = "none",
  hairStyle = "short",
  hairColor = "black",
  skinTone = "warm",
  isPlayer = false,
  isNpc = false,
  itemHeld = "none"
} = {}) {
  const root = new THREE.Group();

  // (1) 몸통 (의상 색상 및 칼라)
  const robeHex = COLOR_PALETTE[robeColor] || COLOR_PALETTE.blue;
  const robeMat = new THREE.MeshStandardMaterial({ color: robeHex, roughness: 0.45 });
  const body = new THREE.Mesh(SHARED_GEO.body, robeMat);
  body.position.y = 0.65;
  if (isPlayer) body.castShadow = true;
  root.add(body);

  // 8종 디테일 3D 코스튬 장식
  applyRobeCostume(body, robeColor);

  // (2) 피부 및 헤어 머리 (Head & Hair)
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.22;
  root.add(headGroup);

  // [가즈아 대성전급 혁신] 머리 구체에 페이스 텍스처 직접 맵핑!
  // 검은 박스나 다각형 눈/입이 겹쳐서 반쪽이 검게 보이는 버그 원천 차단!
  const faceTex = createCitizenFaceTexture(skinTone, 'happy');
  const headMat = new THREE.MeshStandardMaterial({
    map: faceTex,
    roughness: 0.45
  });
  const head = new THREE.Mesh(SHARED_GEO.head, headMat);
  if (isPlayer) head.castShadow = true;
  headGroup.add(head);

  // 양쪽 귀 (Ears)
  const earGeo = new THREE.SphereGeometry(0.08, 12, 10);
  const earMat = new THREE.MeshStandardMaterial({ color: COLOR_PALETTE[skinTone + 'Skin'] || COLOR_PALETTE.warmSkin, roughness: 0.5 });
  const earL = new THREE.Mesh(earGeo, earMat);
  earL.position.set(-0.39, -0.02, 0);
  earL.scale.set(0.5, 1, 0.8);
  headGroup.add(earL);

  const earR = new THREE.Mesh(earGeo, earMat);
  earR.position.set(0.39, -0.02, 0);
  earR.scale.set(0.5, 1, 0.8);
  headGroup.add(earR);

  // 동적 헤어 슬롯 (스타일 & 색상 적용)
  const hairHex = COLOR_PALETTE[hairColor + 'Hair'] || COLOR_PALETTE.blackHair;
  const hairMat = new THREE.MeshStandardMaterial({ color: hairHex, roughness: 0.45 });
  const hairSlot = new THREE.Group();
  headGroup.add(hairSlot);
  applyHairDecoration(hairSlot, hairStyle, hairMat);

  // (3) 팔 & 다리 및 구두
  const armL = new THREE.Mesh(SHARED_GEO.limb, robeMat);
  armL.position.set(-0.36, 0.68, 0);
  root.add(armL);

  const armR = new THREE.Mesh(SHARED_GEO.limb, robeMat);
  armR.position.set(0.36, 0.68, 0);
  root.add(armR);

  // 귀여운 3D 소품 장착 (서류가방, 테이크아웃 커피, 클립보드, 태블릿)
  if (itemHeld === 'briefcase') {
    const caseGeo = new THREE.BoxGeometry(0.10, 0.22, 0.26);
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35 });
    const briefcase = new THREE.Mesh(caseGeo, caseMat);
    briefcase.position.set(-0.06, -0.22, 0.08);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 6, 12, Math.PI), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85 }));
    handle.position.set(0, 0.12, 0);
    handle.rotation.z = Math.PI / 2;
    briefcase.add(handle);
    armL.add(briefcase);
  } else if (itemHeld === 'coffee') {
    const cupGeo = new THREE.CylinderGeometry(0.042, 0.032, 0.095, 10);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.set(0.06, -0.16, 0.10);
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.036, 0.042, 10), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 }));
    sleeve.position.y = 0.01;
    cup.add(sleeve);
    armR.add(cup);
  } else if (itemHeld === 'clipboard') {
    const boardGeo = new THREE.BoxGeometry(0.03, 0.24, 0.18);
    const board = new THREE.Mesh(boardGeo, new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 }));
    board.position.set(-0.06, -0.18, 0.08);
    const paper = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.20, 0.14), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    board.add(paper);
    armL.add(board);
  } else if (itemHeld === 'tablet') {
    const tabGeo = new THREE.BoxGeometry(0.025, 0.22, 0.16);
    const tab = new THREE.Mesh(tabGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 }));
    tab.position.set(-0.06, -0.18, 0.08);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.20), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    screen.rotation.y = -Math.PI / 2;
    screen.position.x = -0.014;
    tab.add(screen);
    armL.add(tab);
  }

  const legGroupL = new THREE.Group();
  legGroupL.position.set(-0.14, 0.22, 0);
  const legL = new THREE.Mesh(SHARED_GEO.limb, earMat);
  legGroupL.add(legL);
  const shoeL = new THREE.Mesh(SHARED_GEO.shoe, SHARED_MAT.shoe);
  shoeL.position.set(0, -0.16, 0.04);
  legGroupL.add(shoeL);
  root.add(legGroupL);

  const legGroupR = new THREE.Group();
  legGroupR.position.set(0.14, 0.22, 0);
  const legR = new THREE.Mesh(SHARED_GEO.limb, earMat);
  legGroupR.add(legR);
  const shoeR = new THREE.Mesh(SHARED_GEO.shoe, SHARED_MAT.shoe);
  shoeR.position.set(0, -0.16, 0.04);
  legGroupR.add(shoeR);
  root.add(legGroupR);

  // (4) 모자 장식 슬롯
  const hatSlot = new THREE.Group();
  headGroup.add(hatSlot);
  applyHatDecoration(hatSlot, hatType);

  // (5) 날개 장식 슬롯
  const wingSlot = new THREE.Group();
  wingSlot.position.set(0, 0.72, -0.22);
  root.add(wingSlot);
  applyWingsDecoration(wingSlot, wingsType);

  // (6) 그림자 데칼
  const shadow = new THREE.Mesh(
    SHARED_GEO.shadowDecal,
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  root.add(shadow);

  // (7) 레벨 5 이상 또는 명예시민용 회전 골든 아우라 링
  let auraRing = null;
  if (level >= 5 || isPlayer) {
    const auraGeo = new THREE.TorusGeometry(0.72, 0.03, 8, 28);
    const auraMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: level >= 5 ? 0.75 : 0.0 });
    auraRing = new THREE.Mesh(auraGeo, auraMat);
    auraRing.rotation.x = Math.PI / 2;
    auraRing.position.y = 0.12;
    root.add(auraRing);
  }

  // (8) 3D 시민 칭호 & 네임플레이트
  const nameplate = createCivicNameplate(name, title, level, isNpc);
  nameplate.position.y = 1.95;
  root.add(nameplate);

  // (9) 머리 위 실시간 말풍선 슬롯
  const bubbleSlot = new THREE.Group();
  bubbleSlot.position.y = 2.55;
  bubbleSlot.visible = false;
  root.add(bubbleSlot);

  root.userData = {
    armL, armR, legGroupL, legGroupR,
    headGroup, hairSlot, hatSlot, wingSlot,
    body, headMat, auraRing,
    nameplate,
    bubbleSlot,
    walkSpeed: 7.8,
    isWalking: false,
    isJumping: false,
    jumpVelocity: 0,
    blinkTimer: 2.0 + Math.random() * 3,
    blinkDuration: 0,
    robeColor, hatType, wingsType, hairStyle, hairColor, skinTone,
    isNpc
  };

  return root;
}

// ========================================================
// 6-A. 8종 3D 시민 의상 코스튬 엔진 (정장, 후드, 한복, 세일러, 데님, 원피스 등)
// ========================================================
function applyRobeCostume(bodyMesh, robeStyle) {
  // 기존 장식 파츠 제거
  const toRemove = [];
  bodyMesh.children.forEach(c => {
    if (c.userData && c.userData.isCostumePart) toRemove.push(c);
  });
  toRemove.forEach(c => bodyMesh.remove(c));

  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.4 });
  const brownMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });

  function addPart(mesh) {
    mesh.userData = { isCostumePart: true };
    bodyMesh.add(mesh);
  }

  if (robeStyle === 'civil_suit') {
    // [공무원 정복] 셔츠 깃 + 네이비 타이 + 시청 조끼 + 3D 공무원증 랜야드 목걸이 + 금장 시청 배지
    const shirtCollar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.06), whiteMat);
    shirtCollar.position.set(0, 0.25, 0.26);
    addPart(shirtCollar);

    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.24, 0.03), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    tie.position.set(0, 0.10, 0.30);
    addPart(tie);

    // 랜야드 목걸이 줄
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
    const strapL = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.28, 6), strapMat);
    strapL.position.set(-0.06, 0.12, 0.31);
    strapL.rotation.z = -0.18;
    addPart(strapL);

    const strapR = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.28, 6), strapMat);
    strapR.position.set(0.06, 0.12, 0.31);
    strapR.rotation.z = 0.18;
    addPart(strapR);

    // 아크릴 공무원증 케이스
    const cardHolder = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.13, 0.02), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.2 }));
    cardHolder.position.set(0, -0.04, 0.33);
    addPart(cardHolder);

    const cardPhoto = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.022), whiteMat);
    cardPhoto.position.set(0, -0.02, 0.332);
    addPart(cardPhoto);

    // 부산시청 금장 배지
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.015, 8), goldMat);
    emblem.position.set(-0.14, 0.15, 0.30);
    emblem.rotation.x = Math.PI / 2;
    addPart(emblem);

    // 단정한 벨트
    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 8, 24), darkMat);
    belt.position.set(0, -0.12, 0);
    belt.rotation.x = Math.PI / 2;
    addPart(belt);

  } else if (robeStyle === 'office_suit') {
    // [스마트 회사원 정장] 화이트 칼라 + 버건디 타이 + 사원증 목걸이 + 가슴 행커치프
    const shirtCollar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.06), whiteMat);
    shirtCollar.position.set(0, 0.25, 0.26);
    addPart(shirtCollar);

    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.26, 0.03), new THREE.MeshStandardMaterial({ color: 0x991b1b }));
    tie.position.set(0, 0.10, 0.30);
    addPart(tie);

    const strapMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
    const strapL = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.26, 6), strapMat);
    strapL.position.set(-0.06, 0.13, 0.31);
    strapL.rotation.z = -0.18;
    addPart(strapL);

    const strapR = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.26, 6), strapMat);
    strapR.position.set(0.06, 0.13, 0.31);
    strapR.rotation.z = 0.18;
    addPart(strapR);

    const idBadge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.02), whiteMat);
    idBadge.position.set(0, -0.03, 0.33);
    addPart(idBadge);

    const hanky = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.02), whiteMat);
    hanky.position.set(0.14, 0.16, 0.30);
    addPart(hanky);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 8, 24), darkMat);
    belt.position.set(0, -0.12, 0);
    belt.rotation.x = Math.PI / 2;
    addPart(belt);

  } else if (robeStyle === 'office_casual') {
    const shirtCollar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.06), new THREE.MeshStandardMaterial({ color: 0x93c5fd }));
    shirtCollar.position.set(0, 0.25, 0.26);
    addPart(shirtCollar);

    const idBadge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.02), whiteMat);
    idBadge.position.set(0, 0.02, 0.32);
    addPart(idBadge);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 8, 24), brownMat);
    belt.position.set(0, -0.12, 0);
    belt.rotation.x = Math.PI / 2;
    addPart(belt);

  } else if (robeStyle === 'hanbok') {
    // [1] 전통 품격 동백 한복: 화이트 동정 깃 + 붉은 옷고름 + 허리띠 + 노리개
    const dongjeongL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04), whiteMat);
    dongjeongL.position.set(-0.08, 0.22, 0.28);
    dongjeongL.rotation.z = -0.35;
    addPart(dongjeongL);

    const dongjeongR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04), whiteMat);
    dongjeongR.position.set(0.08, 0.22, 0.28);
    dongjeongR.rotation.z = 0.35;
    addPart(dongjeongR);

    // 고름 리본 매듭
    const goreumKnot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), redMat);
    goreumKnot.position.set(0.06, 0.12, 0.31);
    addPart(goreumKnot);

    const goreumTail1 = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.22, 0.02), redMat);
    goreumTail1.position.set(0.06, 0.01, 0.32);
    goreumTail1.rotation.z = -0.1;
    addPart(goreumTail1);

    const goreumTail2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.02), redMat);
    goreumTail2.position.set(0.09, 0.04, 0.32);
    goreumTail2.rotation.z = 0.15;
    addPart(goreumTail2);

    // 노리개 장식
    const norigae = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 0.12, 8), goldMat);
    norigae.position.set(-0.16, -0.06, 0.31);
    addPart(norigae);

    // 한복 치마/두루마기 금빛 단선
    const skirtBand = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.02, 8, 24), goldMat);
    skirtBand.position.set(0, -0.22, 0);
    skirtBand.rotation.x = Math.PI / 2;
    addPart(skirtBand);

  } else if (robeStyle === 'camellia') {
    // [2] 동백 캐주얼 후드티: 후드 칼라 + 캥거루 앞주머니 + 화이트 스트링 끈
    const hoodCollar = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 8, 18, Math.PI * 1.3), new THREE.MeshStandardMaterial({ color: 0xbe123c }));
    hoodCollar.position.set(0, 0.24, -0.06);
    hoodCollar.rotation.x = Math.PI * 0.45;
    addPart(hoodCollar);

    // 캥거루 주머니
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.06), new THREE.MeshStandardMaterial({ color: 0x9f1239 }));
    pocket.position.set(0, -0.08, 0.32);
    addPart(pocket);

    // 후드 끈
    const strL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 6), whiteMat);
    strL.position.set(-0.06, 0.12, 0.30);
    addPart(strL);

    const strR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 6), whiteMat);
    strR.position.set(0.06, 0.12, 0.30);
    addPart(strR);

  } else if (robeStyle === 'lavender') {
    // [3] 로맨틱 라벤더 프릴 원피스: 레이스 칼라 + 허리 리본 리본 + 프릴 밑단
    const lace = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 8, 20), whiteMat);
    lace.position.set(0, 0.26, 0);
    lace.rotation.x = Math.PI / 2;
    addPart(lace);

    // 허리 리본
    const waistBelt = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.025, 8, 24), new THREE.MeshStandardMaterial({ color: 0xc084fc }));
    waistBelt.position.set(0, -0.05, 0);
    waistBelt.rotation.x = Math.PI / 2;
    addPart(waistBelt);

    const bow = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshStandardMaterial({ color: 0xf472b6 }));
    bow.position.set(0, -0.05, 0.33);
    addPart(bow);

    const ruffle = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.035, 8, 24), whiteMat);
    ruffle.position.set(0, -0.26, 0);
    ruffle.rotation.x = Math.PI / 2;
    addPart(ruffle);

  } else if (robeStyle === 'denim') {
    // [4] 청량 스트리트 데님: 청재킷 칼라 + 이너 스트라이프 + 브라운 가죽 벨트
    const innerShirt = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.04), whiteMat);
    innerShirt.position.set(0, 0.14, 0.29);
    addPart(innerShirt);

    const flapL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.18, 0.03), new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }));
    flapL.position.set(-0.11, 0.13, 0.30);
    addPart(flapL);

    const flapR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.18, 0.03), new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }));
    flapR.position.set(0.11, 0.13, 0.30);
    addPart(flapR);

    // 가죽 벨트 & 버클
    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 8, 24), brownMat);
    belt.position.set(0, -0.12, 0);
    belt.rotation.x = Math.PI / 2;
    addPart(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.03), goldMat);
    buckle.position.set(0, -0.12, 0.34);
    addPart(buckle);

  } else if (robeStyle === 'gold') {
    // [5] 부산 불꽃·빛축제 골드 예복: 황금 견장 + 더블 버튼 6개 + 레드 타이
    const epauletL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.12), goldMat);
    epauletL.position.set(-0.28, 0.27, 0);
    addPart(epauletL);

    const epauletR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.12), goldMat);
    epauletR.position.set(0.28, 0.27, 0);
    addPart(epauletR);

    // 레드 타이
    const redTie = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.26, 0.03), redMat);
    redTie.position.set(0, 0.10, 0.30);
    addPart(redTie);

    // 더블 버튼 4개
    for (let by = 0; by < 2; by++) {
      const bL = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), goldMat);
      bL.position.set(-0.08, 0.02 - by * 0.10, 0.32);
      addPart(bL);

      const bR = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), goldMat);
      bR.position.set(0.08, 0.02 - by * 0.10, 0.32);
      addPart(bR);
    }

  } else if (robeStyle === 'green') {
    // [6] 녹음 그린 캐주얼: 화이트 폴로 칼라 + 가슴 포켓 + 카키 벨트
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.06), whiteMat);
    collar.position.set(0, 0.26, 0.26);
    addPart(collar);

    const chestPocket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.02), new THREE.MeshStandardMaterial({ color: 0x059669 }));
    chestPocket.position.set(-0.12, 0.12, 0.30);
    addPart(chestPocket);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 8, 24), darkMat);
    belt.position.set(0, -0.12, 0);
    belt.rotation.x = Math.PI / 2;
    addPart(belt);

  } else {
    // [7 & 8] 기본 정장 (블루 / 화이트): 화이트 셔츠 깃 + 넥타이 + 시청 골드 배지 + 블랙 벨트
    const shirtCollar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.06), whiteMat);
    shirtCollar.position.set(0, 0.25, 0.26);
    addPart(shirtCollar);

    const tieColor = (robeStyle === 'white') ? 0x0284c7 : 0x0f172a;
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.26, 0.03), new THREE.MeshStandardMaterial({ color: tieColor }));
    tie.position.set(0, 0.10, 0.30);
    addPart(tie);

    // 부산시청 금빛 가슴 배지
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.015, 8), goldMat);
    pin.position.set(-0.14, 0.15, 0.30);
    pin.rotation.x = Math.PI / 2;
    addPart(pin);

    // 슬림 벨트
    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 8, 24), darkMat);
    belt.position.set(0, -0.12, 0);
    belt.rotation.x = Math.PI / 2;
    addPart(belt);
  }
}

// ========================================================
// 6-B. 8종 3D 헤어 스타일링 & 맑은 얼굴 조형 엔진
// ========================================================


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
    const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    mic.position.set(-0.35, -0.06, 0.18);
    mic.rotation.x = 0.5;
    slot.add(mic);
  } else if (hatType === 'cap') {
    // 스포티 볼캡
    const capDome = new THREE.Mesh(new THREE.SphereGeometry(0.40, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.48), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
    capDome.position.set(0, 0.12, 0);
    slot.add(capDome);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.03, 0.26), new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }));
    visor.position.set(0, 0.20, 0.38);
    visor.rotation.x = 0.15;
    slot.add(visor);
  } else if (hatType === 'sunglasses') {
    // 쿨 선글라스
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.08), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.8 }));
    frame.position.set(0, 0.03, 0.40);
    slot.add(frame);
    const lensL = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.09), new THREE.MeshBasicMaterial({ color: 0x1e293b }));
    lensL.position.set(-0.13, 0.03, 0.445);
    slot.add(lensL);
    const lensR = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.09), new THREE.MeshBasicMaterial({ color: 0x1e293b }));
    lensR.position.set(0.13, 0.03, 0.445);
    slot.add(lensR);
  } else if (hatType === 'chef') {
    // 미식가 셰프 모자 (Chef Toque)
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
    band.position.set(0, 0.36, 0);
    slot.add(band);
    const puff = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.35, 0.38, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
    puff.position.set(0, 0.60, 0);
    slot.add(puff);
  } else if (hatType === 'crown') {
    // 골든 로열 크라운
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 }));
    base.position.set(0, 0.40, 0);
    slot.add(base);
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 6), new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8 }));
      spike.position.set(Math.sin(angle) * 0.32, 0.52, Math.cos(angle) * 0.32);
      slot.add(spike);
    }
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
  } else if (wingsType === 'butterfly') {
    // 화려한 나비 날개
    const bMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, transparent: true, opacity: 0.85 });
    const bWingL = new THREE.Mesh(new THREE.CircleGeometry(0.36, 16), bMat);
    bWingL.position.set(-0.32, 0.15, -0.22);
    bWingL.rotation.y = -0.4;
    slot.add(bWingL);

    const bWingR = new THREE.Mesh(new THREE.CircleGeometry(0.36, 16), bMat);
    bWingR.position.set(0.32, 0.15, -0.22);
    bWingR.rotation.y = 0.4;
    slot.add(bWingR);

    slot.userData.lWing = bWingL;
    slot.userData.rWing = bWingR;
  } else if (wingsType === 'backpack') {
    // 여행자 탐험 백팩
    const packMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 0.22), packMat);
    pack.position.set(0, 0.12, -0.26);
    slot.add(pack);

    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.08), new THREE.MeshStandardMaterial({ color: 0x92400e }));
    pocket.position.set(0, 0.04, -0.38);
    slot.add(pocket);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.02), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
    buckle.position.set(0, 0.18, -0.38);
    slot.add(buckle);
  }
}

function createNameTagSprite(name, title, level, isMe = false, isNpc = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  if (isNpc) {
    // [NPC 전용] 황금빛 엠버 그라디언트 + 골드 더블 테두리
    const grad = ctx.createLinearGradient(0, 0, 384, 96);
    grad.addColorStop(0, 'rgba(217, 119, 6, 0.96)');
    grad.addColorStop(1, 'rgba(180, 83, 9, 0.96)');
    ctx.fillStyle = grad;
    safeRoundRect(ctx, 10, 10, 364, 76, 20);
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 5;
    safeRoundRect(ctx, 10, 10, 364, 76, 20);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 22px "Noto Sans KR", sans-serif';
    ctx.fillText(`⭐ [NPC] ${title} ⭐`, 192, 38);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Noto Sans KR", sans-serif';
    ctx.fillText(name, 192, 70);
  } else {
    ctx.fillStyle = isMe ? 'rgba(2, 132, 199, 0.95)' : 'rgba(15, 23, 42, 0.9)';
    safeRoundRect(ctx, 10, 10, 364, 76, 20);
    ctx.fill();

    ctx.strokeStyle = isMe ? '#f59e0b' : '#38bdf8';
    ctx.lineWidth = 4;
    safeRoundRect(ctx, 10, 10, 364, 76, 20);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 22px "Noto Sans KR", sans-serif';
    ctx.fillText(`Lv.${level} ${title}`, 192, 38);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Noto Sans KR", sans-serif';
    ctx.fillText(name, 192, 70);
  }

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
    hairStyle: STATE.hairStyle,
    hairColor: STATE.hairColor,
    skinTone: STATE.skinTone,
    isPlayer: true
  });
  localPlayer.position.set(0, 0, 10.0);
  scene.add(localPlayer);

  // ★ Tripo 3D 캐시가 준비되어 있으면 플레이어 캐릭터에 즉시 3D 리깅 모델 적용!
  if (typeof TripoAssetManager !== 'undefined' && TripoAssetManager.cache['models/office_worker.glb']) {
    TripoAssetManager.replacePlayerModel(TripoAssetManager.cache['models/office_worker.glb']);
  }
}

// ========================================================
// 7. 충돌 판정 및 다층 계단/슬로프 물리 엔진 (가즈아교 계승)
// ========================================================
function getBusanCityHallFloorY(x, z) {
  if (STATE.currentRoom !== 'BUSAN-HQ') {
    if (x >= -12 && x <= 12 && z >= 2 && z <= 8) return 0.5; // 구청 종합민원실 테라스
    return 0.0;
  }

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

  const activeObstacles = (STATE.currentRoom === 'BUSAN-HQ') ? busanCityHallObstacles : ((STATE.currentRoom === 'BUSAN-CIVIL') ? civilHallObstacles : districtObstacles);
  for (const obs of activeObstacles) {
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
    const act = document.activeElement;
    if (act) {
      const tag = act.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (tag === 'SELECT') {
        const k = e.key.toLowerCase();
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'e', '1', '2', '3', '4', '5', '6'].includes(k) || e.code === 'Space') {
          act.blur();
          window.focus();
        } else {
          return;
        }
      }
    }
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
      e.preventDefault();
    }
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
    // 감정표현 단축키 1~6
    if (k === '1') performGesture('wave');
    if (k === '2') performGesture('clap');
    if (k === '3') performGesture('dance');
    if (k === '4') performGesture('cheer');
    if (k === '5') performGesture('pray');
    if (k === '6') performGesture('salute');
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') STATE.keys.w = false;
    if (k === 's' || k === 'arrowdown') STATE.keys.s = false;
    if (k === 'a' || k === 'arrowleft') STATE.keys.a = false;
    if (k === 'd' || k === 'arrowright') STATE.keys.d = false;
  });

  // ★ 창 전환 / 알트탭 / 모달 오픈 시 방향키 쏠림 및 자동달리기 방지
  window.addEventListener('blur', () => {
    STATE.keys.w = false;
    STATE.keys.s = false;
    STATE.keys.a = false;
    STATE.keys.d = false;
    STATE.keys.space = false;
    STATE.clickTargetPos = null;
    if (clickMarkerMesh) clickMarkerMesh.visible = false;
  });
  window.addEventListener('focus', () => {
    STATE.keys.w = false;
    STATE.keys.s = false;
    STATE.keys.a = false;
    STATE.keys.d = false;
    STATE.keys.space = false;
  });

  // 마우스 클릭 인터랙션 & 바닥 클릭 이동
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // NPC 마우스 호버 시 포인터 커서 변경
  window.addEventListener('pointermove', (e) => {
    if (e.target.closest('.top-nav, .event-sidebar, .middle-area, .toolbar-container, .modal-overlay, .virtual-joystick')) {
      document.body.style.cursor = 'default';
      return;
    }
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    let isHovering = false;
    for (const hit of intersects) {
      if (hit.distance > 80) continue;
      const target = findNpcOrInteractiveTarget(hit.object);
      if (target) {
        isHovering = true;
        break;
      }
    }
    document.body.style.cursor = isHovering ? 'pointer' : 'default';
  });

  window.addEventListener('pointerdown', (e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      document.activeElement.blur();
      window.focus();
    }
    if (e.target.closest('.top-nav, .event-sidebar, .middle-area, .toolbar-container, .modal-overlay, .virtual-joystick')) {
      return;
    }
    if (e.button !== 0) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // [핵심 1] NPC 및 상호작용 오브젝트 클릭 우선 판정!
    for (const hit of intersects) {
      if (hit.distance > 80) continue;
      const target = findNpcOrInteractiveTarget(hit.object);
      if (target) {
        handleNpcOrInteractiveClick(target, hit.point);
        return; // 바닥 이동을 수행하지 않고 즉시 종료!
      }
    }

    // [핵심 2] NPC가 클릭되지 않았을 때만 바닥 클릭 이동 수행
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

  // [가즈아 대법당 시그니처 3인칭 조작계] 내가 바라보는 카메라 시선 수평 벡터 기준 이동
  if (camera && controls) {
    // 1. 카메라가 플레이어를 향해 바라보는 정확한 수평 전방 벡터 (Y=0)
    const _fwd = new THREE.Vector3().subVectors(controls.target, camera.position);
    _fwd.y = 0;
    _fwd.normalize();

    // 2. 수평 우측 벡터 (90도 직교)
    const _side = new THREE.Vector3(-_fwd.z, 0, _fwd.x);

    // 3. 키보드 입력값 (W/S 전진·후진, A/D 좌우 스트레이프)
    const f = (STATE.keys.w ? 1 : 0) - (STATE.keys.s ? 1 : 0);
    const r = (STATE.keys.d ? 1 : 0) - (STATE.keys.a ? 1 : 0);

    if (f !== 0 || r !== 0) {
      moveDir.addScaledVector(_fwd, f);
      moveDir.addScaledVector(_side, r);
    }

    // 4. 모바일 가상 조이스틱 연동
    if (Math.abs(STATE.joystickDir.x) > 0.05 || Math.abs(STATE.joystickDir.y) > 0.05) {
      moveDir.addScaledVector(_fwd, STATE.joystickDir.y);
      moveDir.addScaledVector(_side, STATE.joystickDir.x);
    }
  }

  let nextX = curPos.x;
  let nextZ = curPos.z;

  if (moveDir.lengthSq() > 0.001) {
    moveDir.normalize();
    isMoving = true;
    STATE.clickTargetPos = null;
    if (clickMarkerMesh) clickMarkerMesh.visible = false;

    // 캐릭터가 이동하는 방향을 자연스럽게 정면으로 회전
    const targetAngle = Math.atan2(moveDir.x, moveDir.z);
    let diff = targetAngle - localPlayer.rotation.y;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    localPlayer.rotation.y += diff * Math.min(1, dt * 14);

    const speed = (ud && typeof ud.walkSpeed === 'number' && ud.walkSpeed > 0) ? ud.walkSpeed : 7.8;
    const step = speed * dt;
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

      const speed = (ud && typeof ud.walkSpeed === 'number' && ud.walkSpeed > 0) ? ud.walkSpeed : 7.8;
      const step = Math.min(dist, speed * dt);
      nextX += toTarget.x * step;
      nextZ += toTarget.z * step;
    } else {
      STATE.clickTargetPos = null;
      if (clickMarkerMesh) clickMarkerMesh.visible = false;
    }
  }

  // 장애물 충돌 판정
  const resolved = resolveObstacleCollision(curPos.x, curPos.z, nextX, nextZ, curPos.y);
  curPos.x = (typeof resolved.x === 'number' && !isNaN(resolved.x)) ? resolved.x : (isNaN(curPos.x) ? 0 : curPos.x);
  curPos.z = (typeof resolved.z === 'number' && !isNaN(resolved.z)) ? resolved.z : (isNaN(curPos.z) ? 18 : curPos.z);

  const targetFloorY = getBusanCityHallFloorY(curPos.x, curPos.z);

  // ★ 시청 본관 정문 워프 감지 (야외에서 정문 안으로 진입 시 즉시 쾌적한 전용 민원실로 자동 전환)
  if (STATE.currentRoom === 'BUSAN-HQ' && curPos.z < -15.5 && Math.abs(curPos.x) < 8.0) {
    switchRealm('BUSAN-CIVIL');
    return;
  }

  // 점프 & 중력 물리
  if (ud && ud.isJumping) {
    ud.jumpVelocity = (typeof ud.jumpVelocity === 'number') ? ud.jumpVelocity - 22 * dt : 0;
    curPos.y += ud.jumpVelocity * dt;
    if (curPos.y <= targetFloorY) {
      curPos.y = targetFloorY;
      ud.isJumping = false;
      ud.jumpVelocity = 0;
    }
  } else {
    if (isNaN(curPos.y)) curPos.y = targetFloorY;
    if (Math.abs(curPos.y - targetFloorY) < 0.25) {
      curPos.y = targetFloorY;
    } else if (curPos.y > targetFloorY) {
      curPos.y = Math.max(targetFloorY, curPos.y - 12 * dt);
    } else {
      curPos.y = Math.min(targetFloorY, curPos.y + 12 * dt);
    }
  }

  if (ud) ud.isWalking = isMoving;

  // [가즈아 대법당 일체형 카메라 추적] 카메라와 타겟이 1:1로 일체화되어 지연/미끄러짐 제로
  if (controls && isMoving) {
    if (isNaN(curPos.x) || isNaN(curPos.z)) {
      curPos.x = 0; curPos.z = 18;
    }
    const desiredTarget = new THREE.Vector3(curPos.x, curPos.y + 1.4, curPos.z);
    const delta = new THREE.Vector3().subVectors(desiredTarget, controls.target);

    if (!isNaN(delta.x) && !isNaN(delta.y) && !isNaN(delta.z)) {
      controls.target.add(delta);
      camera.position.add(delta);
    }
  }

  // 멀티플레이 위치 패킷 전송
  const now = performance.now();
  if ((isMoving || (ud && ud.isJumping)) && STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    if (now - STATE.lastMoveSend > 65) {
      STATE.lastMoveSend = now;
      STATE.ws.send(JSON.stringify({
        type: 'move',
        x: (curPos && typeof curPos.x === 'number') ? curPos.x : 0.0,
        y: (curPos && typeof curPos.y === 'number') ? curPos.y : 0.0,
        z: (curPos && typeof curPos.z === 'number') ? curPos.z : 0.0,
        ry: (localPlayer && localPlayer.rotation && typeof localPlayer.rotation.y === 'number') ? localPlayer.rotation.y : 0.0,
        act: isMoving ? 'walk' : 'idle',
        jump: !!(ud && ud.isJumping)
      }));
    }
  }
}

function updateCuteCitizenAnimation(c, dt, t) {
  const ud = c.userData;
  if (!ud) return;

  // ★ 부산 공식 부기(Official Boogi) 전용 뒤뚱뒤뚱 보행 & 앙증맞은 날개짓 물리
  if (ud.tripoMesh && ud.tripoMesh.userData && ud.tripoMesh.userData.isOfficialBoogi) {
    const bm = ud.tripoMesh;
    const bud = bm.userData;
    if (ud.isWalking) {
      // 뒤뚱뒤뚱 좌우 바운스 & 전진 피치
      bm.position.y = Math.abs(Math.sin(t * 10)) * 0.08;
      bm.rotation.z = Math.sin(t * 10) * 0.12; // 골반 좌우 씰룩
      bm.rotation.x = 0.06; // 전진 기울임
      if (bud.wingL) bud.wingL.rotation.z = 0.62 + Math.sin(t * 10) * 0.28;
      if (bud.wingR) bud.wingR.rotation.z = -0.62 - Math.sin(t * 10) * 0.28;
      if (bud.legL) bud.legL.rotation.x = Math.sin(t * 10) * 0.45;
      if (bud.legR) bud.legR.rotation.x = -Math.sin(t * 10) * 0.45;
    } else {
      // 대기 시 호흡 바운스 & 부드러운 날개 펄럭임
      bm.position.y = Math.sin(t * 2.5) * 0.02;
      bm.rotation.z *= 0.85;
      bm.rotation.x *= 0.85;
      if (bud.wingL) bud.wingL.rotation.z = 0.62 + Math.sin(t * 3) * 0.08;
      if (bud.wingR) bud.wingR.rotation.z = -0.62 - Math.sin(t * 3) * 0.08;
      if (bud.legL) bud.legL.rotation.x *= 0.85;
      if (bud.legR) bud.legR.rotation.x *= 0.85;
    }
    return;
  }

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


  // 1.5. 3D 시민 감정표현 제스처 실시간 관절 모션 물리 (박수, 인사, 환호, 댄스, 기도, 경례)
  if (ud.gestureTimer > 0) {
    ud.gestureTimer -= dt;
    const g = ud.currentGesture;

    if (g === 'clap') {
      // 👏 박수: 가슴 앞으로 두 팔을 모아 신나게 짝짝짝
      const clapFreq = Math.sin(t * 22);
      if (ud.armL) {
        ud.armL.rotation.x = -1.15;
        ud.armL.rotation.y = 0.55 + clapFreq * 0.22;
        ud.armL.rotation.z = -0.25;
      }
      if (ud.armR) {
        ud.armR.rotation.x = -1.15;
        ud.armR.rotation.y = -0.55 - clapFreq * 0.22;
        ud.armR.rotation.z = 0.25;
      }
      if (ud.headGroup) {
        ud.headGroup.position.y = 1.22 + Math.abs(clapFreq) * 0.03;
        ud.headGroup.rotation.x = 0.08 * Math.sin(t * 11);
      }
    } else if (g === 'wave') {
      // 👋 인사: 오른손을 번쩍 들어 좌우로 다정하게 손흔들기
      if (ud.armR) {
        ud.armR.rotation.x = -0.3;
        ud.armR.rotation.y = 0.2;
        ud.armR.rotation.z = 2.3 + Math.sin(t * 14) * 0.38;
      }
      if (ud.armL) {
        ud.armL.rotation.x = 0;
        ud.armL.rotation.z = -0.15;
      }
      if (ud.headGroup) {
        ud.headGroup.rotation.z = -0.12 + Math.sin(t * 7) * 0.06;
      }
    } else if (g === 'cheer') {
      // 🙌 환호: 두 손을 하늘 높이 번쩍 들고 방방 뛰기
      const cheerBounce = Math.abs(Math.sin(t * 12));
      if (ud.armL) {
        ud.armL.rotation.x = -0.3;
        ud.armL.rotation.z = 2.6 + Math.sin(t * 12) * 0.25;
      }
      if (ud.armR) {
        ud.armR.rotation.x = -0.3;
        ud.armR.rotation.z = -2.6 - Math.sin(t * 12) * 0.25;
      }
      if (ud.headGroup) {
        ud.headGroup.position.y = 1.22 + cheerBounce * 0.08;
      }
    } else if (g === 'dance') {
      // 💃 댄스: 신나는 좌우 리듬 스텝 & 팔 스윙
      const dBeat = Math.sin(t * 9);
      if (ud.armL) {
        ud.armL.rotation.x = dBeat * 0.8;
        ud.armL.rotation.z = Math.cos(t * 9) * 0.5;
      }
      if (ud.armR) {
        ud.armR.rotation.x = -dBeat * 0.8;
        ud.armR.rotation.z = -Math.cos(t * 9) * 0.5;
      }
      if (ud.legGroupL) ud.legGroupL.rotation.z = dBeat * 0.12;
      if (ud.legGroupR) ud.legGroupR.rotation.z = -dBeat * 0.12;
      if (ud.headGroup) {
        ud.headGroup.rotation.y = dBeat * 0.35;
        ud.headGroup.position.y = 1.22 + Math.abs(dBeat) * 0.06;
      }
    } else if (g === 'pray') {
      // 🌺 기도: 두 손을 가지런히 모으고 고개를 숙임
      if (ud.armL) {
        ud.armL.rotation.x = -1.25;
        ud.armL.rotation.y = 0.65;
        ud.armL.rotation.z = -0.15;
      }
      if (ud.armR) {
        ud.armR.rotation.x = -1.25;
        ud.armR.rotation.y = -0.65;
        ud.armR.rotation.z = 0.15;
      }
      if (ud.headGroup) {
        ud.headGroup.rotation.x = 0.22;
      }
    } else if (g === 'salute') {
      // 🫡 경례: 오른손을 이마에 대는 당당한 경례
      if (ud.armR) {
        ud.armR.rotation.x = -1.55;
        ud.armR.rotation.y = -0.55;
        ud.armR.rotation.z = 1.05;
      }
      if (ud.armL) {
        ud.armL.rotation.x = 0;
        ud.armL.rotation.z = -0.15;
      }
      if (ud.headGroup) {
        ud.headGroup.rotation.x = -0.06;
      }
    }
  } else {
    if (ud.currentGesture) {
      ud.currentGesture = null;
      if (ud.headGroup) ud.headGroup.rotation.set(0, 0, 0);
    }
  }

  // 2. 걷기 시 팔다리 스윙 및 통통 바운스
  if (ud.isWalking) {
    ud.gestureTimer = 0;
    ud.currentGesture = null;
    const swing = Math.sin(t * 11) * 0.55;
    if (ud.armL) ud.armL.rotation.x = swing;
    if (ud.armR) ud.armR.rotation.x = -swing;
    if (ud.legGroupL) ud.legGroupL.rotation.x = -swing * 0.9;
    if (ud.legGroupR) ud.legGroupR.rotation.x = swing * 0.9;
    if (ud.headGroup) ud.headGroup.position.y = 1.22 + Math.abs(Math.sin(t * 11)) * 0.05;

    // ★ Tripo 3D 리깅 뼈대(Bone) 및 고화질 캐릭터 관절 보행 모션!
    if (ud.tripoMesh) {
      if (ud.tripoMesh.userData.mixer) {
        if (ud.tripoMesh.userData.currentAction !== 'walk' && ud.tripoMesh.userData.walkAction) {
          if (ud.tripoMesh.userData.idleAction) ud.tripoMesh.userData.idleAction.fadeOut(0.2);
          ud.tripoMesh.userData.walkAction.reset().fadeIn(0.2).play();
          ud.tripoMesh.userData.currentAction = 'walk';
        }
        ud.tripoMesh.userData.mixer.update(dt);
      }
      // 발걸음 통통 바운스
      ud.tripoMesh.position.y = (ud.tripoBaseY || 0) + Math.abs(Math.sin(t * 11)) * 0.12;
      // 골반 / 몸체 좌우 뒤뚱뒤뚱 스윙
      ud.tripoMesh.rotation.z = Math.sin(t * 11) * 0.09;
      // 달리기 전방 피치 기울임
      ud.tripoMesh.rotation.x = 0.08;

      if (ud.rigBones) {
        const armSwing = Math.sin(t * 11) * 0.65;
        const legSwing = Math.sin(t * 11) * 0.75;
        if (ud.rigBones.leftArm) ud.rigBones.leftArm.rotation.x = armSwing;
        if (ud.rigBones.rightArm) ud.rigBones.rightArm.rotation.x = -armSwing;
        if (ud.rigBones.leftLeg) ud.rigBones.leftLeg.rotation.x = -legSwing;
        if (ud.rigBones.rightLeg) ud.rigBones.rightLeg.rotation.x = legSwing;
      }
    }
  } else {
    if (ud.armL) ud.armL.rotation.x = Math.sin(t * 2.5) * 0.08;
    if (ud.armR) ud.armR.rotation.x = -Math.sin(t * 2.5) * 0.08;
    if (ud.legGroupL) ud.legGroupL.rotation.x = 0;
    if (ud.legGroupR) ud.legGroupR.rotation.x = 0;
    if (ud.headGroup) ud.headGroup.position.y = 1.22 + Math.sin(t * 3.0) * 0.02;

    // ★ Tripo 3D 대기 시 자연스러운 호흡(Breathing) 바운스 & 관절 이완
    if (ud.tripoMesh) {
      if (ud.tripoMesh.userData.mixer) {
        if (ud.tripoMesh.userData.currentAction !== 'idle' && ud.tripoMesh.userData.idleAction) {
          if (ud.tripoMesh.userData.walkAction) ud.tripoMesh.userData.walkAction.fadeOut(0.2);
          ud.tripoMesh.userData.idleAction.reset().fadeIn(0.2).play();
          ud.tripoMesh.userData.currentAction = 'idle';
        }
        ud.tripoMesh.userData.mixer.update(dt);
      }
      ud.tripoMesh.position.y = (ud.tripoBaseY || 0) + Math.sin(t * 2.5) * 0.025;
      ud.tripoMesh.rotation.z *= 0.85;
      ud.tripoMesh.rotation.x *= 0.85;

      if (ud.rigBones) {
        if (ud.rigBones.spine) ud.rigBones.spine.rotation.x = Math.sin(t * 2.5) * 0.04;
        if (ud.rigBones.leftArm) ud.rigBones.leftArm.rotation.x = Math.sin(t * 2) * 0.05;
        if (ud.rigBones.rightArm) ud.rigBones.rightArm.rotation.x = -Math.sin(t * 2) * 0.05;
        if (ud.rigBones.leftLeg) ud.rigBones.leftLeg.rotation.x *= 0.85;
        if (ud.rigBones.rightLeg) ud.rigBones.rightLeg.rotation.x *= 0.85;
      }
    }
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

  // 지피티 추천 동백꽃 행운 키오스크 회전
  if (typeof camelliaBlessingMesh !== 'undefined' && camelliaBlessingMesh) {
    camelliaBlessingMesh.rotation.z += dt * 1.5;
  }

  // 불꽃놀이 3D 파티클 물리 업데이트
  if (typeof activeFireworks !== 'undefined' && activeFireworks.length > 0) {
    for (let i = activeFireworks.length - 1; i >= 0; i--) {
      const fw = activeFireworks[i];
      fw.life -= dt;
      const pos = fw.mesh.geometry.attributes.position.array;
      for (let k = 0; k < fw.velocities.length; k++) {
        pos[k * 3] += fw.velocities[k].vx;
        pos[k * 3 + 1] += fw.velocities[k].vy;
        pos[k * 3 + 2] += fw.velocities[k].vz;
        fw.velocities[k].vy -= dt * 0.45;
      }
      fw.mesh.geometry.attributes.position.needsUpdate = true;
      fw.mesh.material.opacity = Math.max(0, fw.life / fw.maxLife);
      if (fw.life <= 0) {
        scene.remove(fw.mesh);
        activeFireworks.splice(i, 1);
      }
    }
  }

  // 플레이어 골든 아우라 회전
  if (typeof localPlayer !== 'undefined' && localPlayer && localPlayer.userData && localPlayer.userData.auraRing) {
    localPlayer.userData.auraRing.rotation.z += dt * 2.0;
  }

  updatePlayerMovement(dt);
  updateOutdoorNpcs(dt);

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

  if (typeof updateDancingMusicalFountain === 'function') {
    updateDancingMusicalFountain(dt, t);
  }

  // 희망 풍선 상승 물리 애니메이션
  for (let i = activeHopeBalloons.length - 1; i >= 0; i--) {
    const b = activeHopeBalloons[i];
    b.position.y += b.userData.vy;
    b.position.x += Math.sin(t * 1.5 + b.userData.phase) * 0.03 + b.userData.driftX;
    if (b.position.y > 55.0) {
      scene.remove(b);
      activeHopeBalloons.splice(i, 1);
    }
  }

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
  safeRoundRect(ctx, 10, 10, 492, 140, 24);
  ctx.fill();

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 6;
  safeRoundRect(ctx, 10, 10, 492, 140, 24);
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

      const px = (localPlayer && localPlayer.position && typeof localPlayer.position.x === 'number') ? localPlayer.position.x : 0.0;
      const py = (localPlayer && localPlayer.position && typeof localPlayer.position.y === 'number') ? localPlayer.position.y : 0.0;
      const pz = (localPlayer && localPlayer.position && typeof localPlayer.position.z === 'number') ? localPlayer.position.z : 10.0;
      const pry = (localPlayer && localPlayer.rotation && typeof localPlayer.rotation.y === 'number') ? localPlayer.rotation.y : 0.0;

      // 룸 참가 패킷 즉각 전송 (모든 꾸미기 및 정밀 위치 완벽 전송)
      STATE.ws.send(JSON.stringify({
        type: 'join',
        room: STATE.currentRoom,
        name: STATE.playerName,
        title: STATE.playerTitle,
        level: STATE.playerLevel,
        robe: STATE.robeColor,
        robeColor: STATE.robeColor,
        hat: STATE.hatType,
        hatType: STATE.hatType,
        wings: STATE.wingsType,
        wingsType: STATE.wingsType,
        hairStyle: STATE.hairStyle,
        hairColor: STATE.hairColor,
        skinTone: STATE.skinTone,
        x: px,
        y: py,
        z: pz,
        ry: pry
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
    robeColor: info.robeColor || info.robe || "blue",
    hatType: info.hatType || info.hat || "camellia",
    wingsType: info.wingsType || info.wings || "none",
    hairStyle: info.hairStyle || "short",
    hairColor: info.hairColor || "black",
    skinTone: info.skinTone || "warm"
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
  const ud = localPlayer.userData;
  if (ud) {
    ud.currentGesture = type;
    ud.gestureTimer = 3.5;
  }
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
  } else if (type === 'pray') {
    showSpeechBubble(localPlayer, "🌺 부산의 번영과 모든 시민의 안녕을 진심으로 기원합니다!");
    if (window.busanAudio) window.busanAudio.playBell();
  } else if (type === 'salute') {
    showSpeechBubble(localPlayer, "🫡 시민을 위한 청렴하고 당당한 시정! 충성!");
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
    {
      act: "ACT 1",
      name: "해양수도 부산의 닻 & 소통 온도 높이기",
      desc: "부산시청 중앙시민광장의 상징 '부산의 닻' 조형물과 음악 분수대를 탐방하고 시민 소통 온도를 높여보세요.",
      reward: 50,
      done: STATE.stamps.anchor && STATE.stamps.lighthouse
    },
    {
      act: "ACT 2",
      name: "15분 도시와 들락날락 & 열린 정보공개방",
      desc: "시청 1층 들락날락 어린이 복합문화공간을 둘러보고, 열린 정보공개관에서 2026 연도별 부산시 본예산서를 열람하세요.",
      reward: 80,
      done: STATE.stamps.lobby
    },
    {
      act: "ACT 3",
      name: "시민의 온기와 행복민원실",
      desc: "2층 행복민원실에 올라가 여권창구, 120콜센터 부스, 아주라 쉼터를 둘러보고 AI 다온에게 가벼운 상담을 받아보세요.",
      reward: 100,
      done: STATE.stamps.civil
    },
    {
      act: "ACT 4",
      name: "당당한 시민의 목소리 & 자유 담벼락",
      desc: "시민광장 야외 발언대 단상에 올라 부산 발전을 위한 응원 한마디를 외치고, 시민 자유 담벼락에 건의글을 남기세요.",
      reward: 150,
      done: STATE.playerExp >= 200
    },
    {
      act: "ACT 5",
      name: "16개 자치구·군 대모험과 2030 미래비전",
      desc: "16개 구·군 포털 게이트를 타고 해운대, 동래, 연제 등 자치 구청을 방문하여 가상 청사 홍보관을 탐방하고 '명예 부산 시민' 칭호를 획득하세요.",
      reward: 300,
      done: STATE.playerLevel >= 3
    }
  ];

  const list = document.getElementById('story-acts-list');
  if (!list) return;
  list.innerHTML = '';
  acts.forEach(a => {
    const card = document.createElement('div');
    card.className = 'division-card';
    card.innerHTML = `
      <div class="division-card-header">
        <div>
          <span style="font-weight:900; color:#0284c7; margin-right:6px;">${a.act}</span>
          <span class="division-task-name">${a.name}</span>
        </div>
        <span class="division-authority-badge ${a.done ? 'city' : 'district'}">${a.done ? '완료 ✓ (+ ' + a.reward + ' XP)' : '보상: ' + a.reward + ' XP'}</span>
      </div>
      <div class="division-row" style="line-height:1.6; color:#475569;">${a.desc}</div>
    `;
    list.appendChild(card);
  });
}

function openCustomizeModal() {
  const nameInput = document.getElementById('custom-name');
  const hairStyleSel = document.getElementById('custom-hair-style');
  const hairColorSel = document.getElementById('custom-hair-color');
  const skinSel = document.getElementById('custom-skin');
  const robeSelect = document.getElementById('custom-robe');
  const hatSelect = document.getElementById('custom-hat');
  const wingsSelect = document.getElementById('custom-wings');

  if (nameInput) nameInput.value = STATE.playerName;
  if (hairStyleSel) hairStyleSel.value = STATE.hairStyle;
  if (hairColorSel) hairColorSel.value = STATE.hairColor;
  if (skinSel) skinSel.value = STATE.skinTone;
  if (robeSelect) robeSelect.value = STATE.robeColor;
  if (hatSelect) hatSelect.value = STATE.hatType;
  let archSel = document.getElementById('custom-archetype');
  if (!archSel) {
    // Add archetype selector UI dynamically if not present
    const modalBody = document.querySelector('#modal-customize .modal-body') || document.querySelector('#modal-customize');
    if (modalBody) {
      const archContainer = document.createElement('div');
      archContainer.className = 'custom-row';
      archContainer.style.marginBottom = '14px';
      archContainer.innerHTML = `
        <label style="font-weight: bold; color: #0284c7; display: block; margin-bottom: 6px;">🎭 아바타 캐릭터 선택 (3D 모델 & 스타일):</label>
        <select id="custom-archetype" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1.5px solid #38bdf8; font-size: 14px; font-weight: bold;">
          <option value="worker">💼 스마트 회사원 (Tripo 3D Chibi - 웨이브 헤어 & 수트 & 사원증 & 커피)</option>
          <option value="officer">🏛️ 부산시청 공무원 (Tripo 3D Chibi - 단정한 정복 & 공무원증 & 태블릿)</option>
          <option value="boogi">🌊 부산 공식 소통 마스코트 부기 (100% 공식 3D 모델)</option>
          <option value="citizen">🎨 클래식 열린 시민 (헤어/의상/피부 풀 커스터마이징)</option>
        </select>
      `;
      modalBody.insertBefore(archContainer, modalBody.firstChild);
      archSel = document.getElementById('custom-archetype');
    }
  }
  if (archSel) {
    archSel.value = STATE.avatarArchetype || 'worker';
    archSel.onchange = previewCustomization;
  }

  if (wingsSelect) wingsSelect.value = STATE.wingsType;

  openModal('modal-customize');
}

function saveCustomization() {
  const nameInput = document.getElementById('custom-name');
  const hairStyleSel = document.getElementById('custom-hair-style');
  const hairColorSel = document.getElementById('custom-hair-color');
  const skinSel = document.getElementById('custom-skin');
  const robeSelect = document.getElementById('custom-robe');
  const hatSelect = document.getElementById('custom-hat');
  const wingsSelect = document.getElementById('custom-wings');

  if (nameInput && nameInput.value.trim()) {
    STATE.playerName = nameInput.value.trim();
    localStorage.setItem('busan_name', STATE.playerName);
  }
  if (hairStyleSel) {
    STATE.hairStyle = hairStyleSel.value;
    localStorage.setItem('busan_hair_style', STATE.hairStyle);
  }
  if (hairColorSel) {
    STATE.hairColor = hairColorSel.value;
    localStorage.setItem('busan_hair_color', STATE.hairColor);
  }
  if (skinSel) {
    STATE.skinTone = skinSel.value;
    localStorage.setItem('busan_skin_tone', STATE.skinTone);
  }
  if (robeSelect) {
    STATE.robeColor = robeSelect.value;
    localStorage.setItem('busan_robe', STATE.robeColor);
  }
  if (hatSelect) {
    STATE.hatType = hatSelect.value;
    localStorage.setItem('busan_hat', STATE.hatType);
  }
  if (wingsSelect) {
    STATE.wingsType = wingsSelect.value;
    localStorage.setItem('busan_wings', STATE.wingsType);
  }

  const archSel = document.getElementById('custom-archetype');
  if (archSel) {
    STATE.avatarArchetype = archSel.value;
    localStorage.setItem('busan_avatar_archetype', STATE.avatarArchetype);
  }

  closeModal('modal-customize');

  applyPlayerAvatarArchetype(STATE.avatarArchetype);
  updatePlayerBadgeUI();

  if (STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    const px = (localPlayer && localPlayer.position && typeof localPlayer.position.x === 'number') ? localPlayer.position.x : 0.0;
    const py = (localPlayer && localPlayer.position && typeof localPlayer.position.y === 'number') ? localPlayer.position.y : 0.0;
    const pz = (localPlayer && localPlayer.position && typeof localPlayer.position.z === 'number') ? localPlayer.position.z : 10.0;
    const pry = (localPlayer && localPlayer.rotation && typeof localPlayer.rotation.y === 'number') ? localPlayer.rotation.y : 0.0;

    STATE.ws.send(JSON.stringify({
      type: 'join',
      room: STATE.currentRoom,
      name: STATE.playerName,
      title: STATE.playerTitle,
      level: STATE.playerLevel,
      robeColor: STATE.robeColor,
      hatType: STATE.hatType,
      wingsType: STATE.wingsType,
      hairStyle: STATE.hairStyle,
      hairColor: STATE.hairColor,
      skinTone: STATE.skinTone,
      x: px,
      y: py,
      z: pz,
      ry: pry
    }));
  }
  showSpeechBubble(localPlayer, "✨ 새로운 시민 아바타 스타일이 적용되었습니다!");
}

function switchRealm(realmCode) {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
  window.focus();

  STATE.currentRoom = realmCode;
  const sel = document.getElementById('realm-select');
  if (sel) sel.value = realmCode;

  updateQuickRealmButton(realmCode);

  if (realmCode === 'BUSAN-HQ') {
    // 🌳 부산시청 야외 시민광장
    if (cityHallWorldGroup) cityHallWorldGroup.visible = true;
    if (civilHallWorldGroup) civilHallWorldGroup.visible = false;
    if (districtWorldGroup) districtWorldGroup.visible = false;
    interactiveObjects = [...cityHallInteractablesBackup];
    if (localPlayer) {
      localPlayer.position.set(0, 0, 10.0);
      localPlayer.rotation.y = 0;
      if (controls && camera) {
        controls.target.set(0, 1.4, 10.0);
        camera.position.set(0, 4.8, 17.0);
        controls.update();
      }
    }
    showSpeechBubble(localPlayer, "🌳 [부산광역시청 야외 시민광장]에 오신 것을 환영합니다!");
  } else if (realmCode === 'BUSAN-CIVIL') {
    // 🏛️ 부산시청 전용 실내 종합민원실(행복민원실)
    if (cityHallWorldGroup) cityHallWorldGroup.visible = false;
    if (civilHallWorldGroup) {
      civilHallWorldGroup.visible = true;
      buildBusanCivilServiceWorld();
    }
    if (districtWorldGroup) districtWorldGroup.visible = false;
    interactiveObjects = [...civilHallInteractables];
    if (localPlayer) {
      localPlayer.position.set(0, 0, 14.0);
      localPlayer.rotation.y = Math.PI; // 카운터를 정면으로 바라봄
      if (controls && camera) {
        controls.target.set(0, 1.4, 14.0);
        camera.position.set(0, 4.2, 20.0);
        controls.update();
      }
    }
    showSpeechBubble(localPlayer, "🏛️ [부산광역시청 2층 행복민원실]에 입장하셨습니다!");
  } else {
    // 🏛️ 16개 자치구·군 청사 및 종합민원실 월드
    if (cityHallWorldGroup) cityHallWorldGroup.visible = false;
    if (civilHallWorldGroup) civilHallWorldGroup.visible = false;
    if (districtWorldGroup) {
      districtWorldGroup.visible = true;
      buildDistrictOfficeWorld(realmCode);
    }
    interactiveObjects = [...districtInteractables];
    if (localPlayer) {
      localPlayer.position.set(0, 0, 24);
      localPlayer.rotation.y = 0;
      if (controls && camera) {
        controls.target.set(0, 1.4, 24);
        camera.position.set(0, 6.5, 34.5);
        controls.update();
      }
    }
    const dist = (typeof BUSAN_DISTRICT_DETAILS !== 'undefined') ? BUSAN_DISTRICT_DETAILS[realmCode] : null;
    const distName = dist ? dist.name : realmCode;
    showSpeechBubble(localPlayer, `🏛️ [${distName}] 청사 및 종합민원실에 도착했습니다!`);
  }

  if (window.busanAudio && typeof window.busanAudio.playChime === 'function') {
    (window.busanAudio.playChime ? window.busanAudio.playChime() : window.busanAudio.playDingDong());
  }

  if (STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    const defaultZ = (realmCode === 'BUSAN-HQ') ? 10.0 : 24.0;
    const px = (localPlayer && localPlayer.position && typeof localPlayer.position.x === 'number') ? localPlayer.position.x : 0.0;
    const py = (localPlayer && localPlayer.position && typeof localPlayer.position.y === 'number') ? localPlayer.position.y : 0.0;
    const pz = (localPlayer && localPlayer.position && typeof localPlayer.position.z === 'number') ? localPlayer.position.z : defaultZ;
    const pry = (localPlayer && localPlayer.rotation && typeof localPlayer.rotation.y === 'number') ? localPlayer.rotation.y : 0.0;

    STATE.ws.send(JSON.stringify({
      type: 'join',
      room: realmCode,
      name: STATE.playerName,
      title: STATE.playerTitle,
      level: STATE.playerLevel,
      robeColor: STATE.robeColor,
      hatType: STATE.hatType,
      wingsType: STATE.wingsType,
      hairStyle: STATE.hairStyle,
      hairColor: STATE.hairColor,
      skinTone: STATE.skinTone,
      x: px,
      y: py,
      z: pz,
      ry: pry
    }));
  }
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


// ========================================================
// 18. 16개 자치구·군 독립 청사 3D 모델링 및 인터랙션 엔진 (v2.0)
// ========================================================
// ========================================================
// 18-B. 구정 홍보 & 비전 대형 3D 미디어 월 및 가상 청사 포털
// ========================================================
function buildDistrictPrMediaWall(realmCode, dist, group) {
  const wallGroup = new THREE.Group();
  wallGroup.position.set(-18, 0, 8);

  // 미디어 월 지지대 프레임
  const frameGeo = new THREE.BoxGeometry(10, 6.2, 0.6);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 4.2, 0);
  wallGroup.add(frame);

  // 디스플레이 스크린 (발광 텍스처)
  const screenGeo = new THREE.PlaneGeometry(9.4, 5.6);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 4.2, 0.32);
  wallGroup.add(screen);

  // 상단 LED 네온 타이틀 바
  const titleBarGeo = new THREE.BoxGeometry(9.6, 0.6, 0.7);
  const titleBarMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.3 });
  const titleBar = new THREE.Mesh(titleBarGeo, titleBarMat);
  titleBar.position.set(0, 7.3, 0);
  wallGroup.add(titleBar);

  group.add(wallGroup);

  // 상호작용 등록
  registerDistrictInteractive({
    pos: { x: -18, z: 8 },
    radius: 6.0,
    prompt: `E키: [${dist.name}] 구정 홍보관 & 공식 비전 전광판 보기`,
    action: () => {
      openDistrictPrModal(realmCode);
    }
  });
}

function openDistrictPrModal(realmCode) {
  const dist = (typeof BUSAN_DISTRICT_DETAILS !== 'undefined' && BUSAN_DISTRICT_DETAILS[realmCode]) 
    ? BUSAN_DISTRICT_DETAILS[realmCode] 
    : (BUSAN_DISTRICT_DETAILS ? BUSAN_DISTRICT_DETAILS['DIST-DONGNAE'] : null);
  if (!dist) return;

  const titleEl = document.getElementById('distPrModalTitle');
  const subEl = document.getElementById('distPrModalSub');
  const bodyEl = document.getElementById('distPrModalBody');

  if (titleEl) titleEl.innerText = `${dist.name} 공식 홍보관 & 비전`;
  if (subEl) subEl.innerText = `${dist.tagline} | ${dist.address} (전화: ${dist.tel})`;

  const civilCounters = (dist.civil_service && dist.civil_service.counters) ? dist.civil_service.counters : [];
  const landmarks = dist.landmarks || [];
  const restList = (dist.gourmet && dist.gourmet.restaurants) ? dist.gourmet.restaurants : [];
  const cafeList = (dist.gourmet && dist.gourmet.cafes) ? dist.gourmet.cafes : [];

  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color:#fff; border-radius:14px; padding:18px; margin-bottom:16px;">
        <div style="font-size:12px; opacity:0.9;">${escapeHtml(dist.eng)}</div>
        <div style="font-size:22px; font-weight:900; margin:4px 0;">${escapeHtml(dist.name)}</div>
        <div style="font-size:14px; opacity:0.95;">"${escapeHtml(dist.tagline)}"</div>
        <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap;">
          <a href="${dist.official_url}" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:6px; background:#ffffff; color:#0369a1; padding:8px 14px; border-radius:8px; font-size:12px; font-weight:800; text-decoration:none;">
            🏛️ ${escapeHtml(dist.name)} 공식 홈페이지 방문
          </a>
          <a href="${dist.online_civil_url}" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:6px; background:#f59e0b; color:#ffffff; padding:8px 14px; border-radius:8px; font-size:12px; font-weight:800; text-decoration:none;">
            📋 온라인 민원신청 바로가기
          </a>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-weight:800; color:#0369a1; font-size:15px; margin-bottom:8px;">🏙️ 지역 명품 랜드마크 & 힐링 관광지</div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
          ${landmarks.map(lm => `
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
              <div style="font-weight:800; color:#1e293b; font-size:13px;">📍 ${escapeHtml(lm.name)}</div>
              <div style="font-size:12px; color:#64748b; margin-top:4px;">${escapeHtml(lm.desc)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-weight:800; color:#0369a1; font-size:15px; margin-bottom:8px;">📋 종합민원실 주요 창구 & 직통 전화</div>
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:8px;">
          ${civilCounters.map(c => `
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; border-bottom:1px dashed #dcfce7; padding-bottom:6px;">
              <div>
                <b style="color:#166534;">${escapeHtml(c.name)}</b>
                <span style="color:#475569; margin-left:6px;">${escapeHtml(c.desc)}</span>
              </div>
              <a href="tel:${c.tel}" style="color:#0284c7; font-weight:700; text-decoration:none; white-space:nowrap;">📞 ${escapeHtml(c.tel)}</a>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom:14px;">
        <div style="font-weight:800; color:#0369a1; font-size:15px; margin-bottom:8px;">🍽️ ${escapeHtml(dist.name)} 대표 맛집 & 핫플 카페</div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
          ${restList.map(r => `
            <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:10px; padding:12px;">
              <div style="font-weight:800; color:#b45309; font-size:13px;">🍲 ${escapeHtml(r.name)} <span style="font-size:11px; font-weight:normal; color:#92400e;">(${escapeHtml(r.dish)})</span></div>
              <div style="font-size:11px; color:#78350f; margin-top:3px;">${escapeHtml(r.desc)}</div>
              <div style="font-size:10px; color:#a16207; margin-top:4px;">📍 ${escapeHtml(r.addr)} (📞 ${escapeHtml(r.tel)})</div>
            </div>
          `).join('')}
          ${cafeList.map(c => `
            <div style="background:#fdf4ff; border:1px solid #fae8ff; border-radius:10px; padding:12px;">
              <div style="font-weight:800; color:#86198f; font-size:13px;">☕ ${escapeHtml(c.name)}</div>
              <div style="font-size:11px; color:#701a75; margin-top:3px;">대표메뉴: ${escapeHtml(c.signature)}</div>
              <div style="font-size:10px; color:#a21caf; margin-top:4px;">📍 ${escapeHtml(c.addr)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  openModal('modal-district-pr');
}


function buildDistrictNaturalLandscape(realmCode, group) {
  const coastal = ['DIST-HAEUNDAE', 'DIST-SUYEONG', 'DIST-NAM', 'DIST-YEONGDO', 'DIST-GIJANG', 'DIST-SEO'];
  const riverside = ['DIST-GANGSEO', 'DIST-SASANG', 'DIST-BUK', 'DIST-SAHA', 'DIST-GEUMJEONG'];

  if (coastal.includes(realmCode)) {
    // 해양 구: 시원한 부산 바다 수면 & 해안 데크
    const seaGeo = new THREE.PlaneGeometry(300, 160);
    const seaMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.8
    });
    const sea = new THREE.Mesh(seaGeo, seaMat);
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(0, -0.4, 110);
    group.add(sea);

    // 광안대교 및 오션 파노라마 타워
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(0, 10, 140);
    for (let p = -40; p <= 40; p += 80) {
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(3, 26, 3), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6 }));
      pylon.position.x = p;
      bridgeGroup.add(pylon);
    }
    const deck = new THREE.Mesh(new THREE.BoxGeometry(220, 1.5, 6), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    deck.position.y = 8;
    bridgeGroup.add(deck);
    group.add(bridgeGroup);

  } else if (riverside.includes(realmCode)) {
    // 낙동강 및 호수 수변 구: 잔잔한 수변과 갈대/수목
    const riverGeo = new THREE.PlaneGeometry(300, 120);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.3,
      metalness: 0.5
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, -0.3, 90);
    group.add(river);

  } else {
    // 도심 및 산악 구 (금정산, 황령산 등 백그라운드)
    const mGroup = new THREE.Group();
    for (let m = -3; m <= 3; m++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(38 + Math.abs(m) * 6, 42 + Math.abs(m) * 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x2e4a3d, roughness: 0.9 })
      );
      cone.position.set(m * 45, 18, -80);
      mGroup.add(cone);
    }
    group.add(mGroup);
  }
}

function buildDistrictOfficeWorld(realmCode) {
  while (districtWorldGroup.children.length > 0) {
    districtWorldGroup.remove(districtWorldGroup.children[0]);
  }
  districtObstacles = [];
  districtInteractables = [];

  const dist = (typeof BUSAN_DISTRICT_DETAILS !== 'undefined' && BUSAN_DISTRICT_DETAILS[realmCode]) 
    ? BUSAN_DISTRICT_DETAILS[realmCode] 
    : BUSAN_DISTRICT_DETAILS['DIST-DONGNAE'];
  const distName = dist ? dist.name : realmCode;

  // (1) 구청 광장 화강석 석재 바닥 (80x80m)
  const floorGeo = new THREE.PlaneGeometry(80, 80);
  const floorMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.plaza || null,
    color: 0xf1f5f9,
    roughness: 0.5
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.01, 15);
  floor.receiveShadow = true;
  districtWorldGroup.add(floor);

  // 주변 잔디밭 (240x240m)
  const lawnGeo = new THREE.PlaneGeometry(240, 240);
  const lawnMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.grass || null,
    roughness: 0.85
  });
  const lawn = new THREE.Mesh(lawnGeo, lawnMat);
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.y = -0.02;
  lawn.receiveShadow = true;
  districtWorldGroup.add(lawn);

  // (2) 구청 청사 건축 모델링
  buildDistrictArchitecture(realmCode, dist, districtWorldGroup);

  // (3) 구청 종합민원실 카운터 부스 존
  buildDistrictCivilServiceCounters(realmCode, dist, districtWorldGroup);

  // (4) 구립도서관 & 전자도서관 키오스크
  buildDistrictLibraryKiosk(realmCode, dist, districtWorldGroup);

  // (5) 지역 맛집 & 인기 카페 안내인 NPC (미식가 부기)
  buildDistrictGourmetNpc(realmCode, dist, districtWorldGroup);

  // (6) 지역 랜드마크 조경 및 수목
  buildDistrictLandmarkLandscape(realmCode, dist, districtWorldGroup);
  buildDistrictNaturalLandscape(realmCode, districtWorldGroup);

  // (6-B) 구정 공식 홍보관 & 비전 대형 전광판
  buildDistrictPrMediaWall(realmCode, dist, districtWorldGroup);

  // (7) 부산시청 본관 복귀 텔레포트 게이트

  // 구청 공식 홈페이지 인기메뉴 키오스크 등록
  registerDistrictInteractive({
    pos: { x: 0, z: 12 },
    radius: 4.5,
    prompt: `E키: [${distName}] 대표 e-민원 & 관광안내 열기`,
    action: () => openPopularMenusModal('district_civil')
  });

  buildReturnToCityHallPortal(districtWorldGroup);
}

function buildDistrictArchitecture(realmCode, dist, group) {
  const bGroup = new THREE.Group();

  let mainColor = 0xf8fafc;
  let glassColor = 0x38bdf8;
  let height = 30;
  let width = 64;

  if (realmCode === 'DIST-DONGNAE') {
    // 2025 동래구청 신청사: 유려한 곡선형 화이트 파사드 & 수평 리본 글래스
    mainColor = 0xffffff;
    glassColor = 0x0284c7;
    height = 36;
    width = 68;

    const bodyGeo = new THREE.BoxGeometry(width, height, 22);
    const bodyMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.25 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, height / 2, -18);
    body.castShadow = true;
    bGroup.add(body);

    for (let f = 1; f <= 9; f++) {
      const ribGeo = new THREE.BoxGeometry(width + 0.2, 1.4, 22.2);
      const ribMat = new THREE.MeshStandardMaterial({ color: glassColor, roughness: 0.1, metalness: 0.5 });
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.set(0, f * 3.6, -18);
      bGroup.add(rib);
    }

    const roofCrest = new THREE.Mesh(new THREE.CylinderGeometry(14, 18, 4, 16, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    roofCrest.rotation.z = Math.PI / 2;
    roofCrest.position.set(0, height + 2, -18);
    bGroup.add(roofCrest);

  } else if (realmCode === 'DIST-HAEUNDAE') {
    // 해운대구청: 해양 블루 오션뷰 타워
    glassColor = 0x0ea5e9;
    height = 38;
    width = 60;

    const tower = new THREE.Mesh(new THREE.BoxGeometry(width, height, 22), new THREE.MeshStandardMaterial({ color: glassColor, roughness: 0.15, metalness: 0.6 }));
    tower.position.set(0, height / 2, -18);
    tower.castShadow = true;
    bGroup.add(tower);

  } else if (realmCode === 'DIST-BUSANJIN') {
    // 부산진구청: 대형 복합 행정타운 & 중앙 글래스 아트리움
    height = 32;
    width = 72;
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, 24), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 }));
    body.position.set(0, height / 2, -18);
    bGroup.add(body);

    const atrium = new THREE.Mesh(new THREE.BoxGeometry(24, height + 4, 26), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.4 }));
    atrium.position.set(0, (height + 4) / 2, -18);
    bGroup.add(atrium);

  } else if (realmCode === 'DIST-SUYEONG') {
    // 수영구청: 친환경 녹색 루프탑 & 모던 청사
    height = 24;
    width = 58;
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, 22), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
    body.position.set(0, height / 2, -18);
    bGroup.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 2, 1.2, 24), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 }));
    roof.position.set(0, height + 0.6, -18);
    bGroup.add(roof);

  } else {
    // 일반 구·군청 청사
    height = 28;
    width = 62;
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, 22), new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35 }));
    body.position.set(0, height / 2, -18);
    bGroup.add(body);

    const glassCenter = new THREE.Mesh(new THREE.BoxGeometry(22, height + 2, 23), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.2 }));
    glassCenter.position.set(0, (height + 2) / 2, -18);
    bGroup.add(glassCenter);
  }

  // 1층 정문 유리 캐노피 현관
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(26, 4.5, 8), new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.85 }));
  canopy.position.set(0, 3.8, -5);
  bGroup.add(canopy);

  // 상단 청사 간판 (3D Canvas Signboard)
  createSignBoard(0, 7.5, -4.5, `[ ${dist.name} 청사 ]`, 0x0284c7, bGroup);

  group.add(bGroup);

  // 구청 건물 충돌체 등록
  districtObstacles.push({ type: 'box', x: 0, z: -18, w: width, d: 24, h: height });
  districtObstacles.push({ type: 'box', x: -38, z: 20, w: 2, d: 80, h: 6 });
  districtObstacles.push({ type: 'box', x: 38, z: 20, w: 2, d: 80, h: 6 });
  districtObstacles.push({ type: 'box', x: 0, z: 56, w: 76, d: 2, h: 6 });
}

function buildDistrictCivilServiceCounters(realmCode, dist, group) {
  const cGroup = new THREE.Group();
  cGroup.position.set(0, 0, 4);

  const platform = new THREE.Mesh(new THREE.BoxGeometry(24, 0.4, 6), new THREE.MeshStandardMaterial({ map: TEXTURES.plaza || null, color: 0xe2e8f0, roughness: 0.5 }));
  platform.position.set(0, 0.2, 0);
  platform.receiveShadow = true;
  cGroup.add(platform);

  const cMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.3 });

  // 1번 민원여권 창구
  const d1 = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.1, 1.6), cMat);
  d1.position.set(-7, 0.95, -0.5);
  cGroup.add(d1);
  createSignBoard(-7, 2.2, -0.5, "1. 민원여권과 / 등초본", 0x0369a1, cGroup);

  // 2번 세무 창구
  const d2 = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.1, 1.6), cMat);
  d2.position.set(0, 0.95, -0.5);
  cGroup.add(d2);
  createSignBoard(0, 2.2, -0.5, "2. 세무과 / 지방세", 0x0369a1, cGroup);

  // 3번 스마트 무인발급기
  const kiosk = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.8, 1.4), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7 }));
  kiosk.position.set(7, 1.3, -0.5);
  cGroup.add(kiosk);
  createSignBoard(7, 2.7, -0.5, "3. 스마트 무인발급기", 0x0f172a, cGroup);

  // 상단 종합민원실 아치 사인
  createSignBoard(0, 3.8, -0.5, `🏛️ [ ${dist.name} 종합민원실 ]`, 0x0284c7, cGroup);

  group.add(cGroup);

  registerDistrictInteractive({
    pos: { x: 0, z: 4 },
    radius: 7.0,
    prompt: `E키: [${dist.name}] 종합민원실 창구 & 온라인 민원`,
    action: () => openDistrictOfficeModal(realmCode)
  });

  districtObstacles.push({ type: 'box', x: 0, z: 4, w: 24, d: 5, h: 2.5 });
}

function buildDistrictLibraryKiosk(realmCode, dist, group) {
  const kGroup = new THREE.Group();
  kGroup.position.set(-16, 0, 14);

  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 2.4, 16), new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.3 }));
  pillar.position.y = 1.2;
  kGroup.add(pillar);

  const bookGroup = new THREE.Group();
  bookGroup.position.y = 3.0;

  const cover = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 1.0), new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 0.4 }));
  bookGroup.add(cover);
  const pages = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.18, 0.9), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  pages.position.y = 0.05;
  bookGroup.add(pages);

  kGroup.add(bookGroup);

  const libName = dist.library ? dist.library.name : "구립 도서관";
  createSignBoard(0, 4.0, 0, `📚 ${libName}`, 0x7e22ce, kGroup);

  group.add(kGroup);

  registerDistrictInteractive({
    pos: { x: -16, z: 14 },
    radius: 5.5,
    prompt: `E키: [${libName}] 전자도서관 & 도서대출`,
    action: () => openDistrictLibraryModal(realmCode)
  });

  districtObstacles.push({ type: 'cyl', x: -16, z: 14, r: 1.2, h: 3.0 });
}

function buildDistrictGourmetNpc(realmCode, dist, group) {
  const gGroup = new THREE.Group();
  gGroup.position.set(16, 0, 14);

  const chefNpc = createCuteCitizenMesh({
    name: "미식가 부기",
    title: `${dist.name} 맛집안내원`,
    level: 10,
    robeColor: "gold",
    hatType: "chef",
    wingsType: "none",
    hairStyle: "dandy",
    hairColor: "brown",
    skinTone: "warm",
    isNpc: true
  });
  gGroup.add(chefNpc);

  const table = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 }));
  table.position.set(0, 0.45, 0.8);
  gGroup.add(table);

  createSignBoard(0, 2.6, 0, `🍽️ [${dist.name}] 맛집 & 카페 안내`, 0xf59e0b, gGroup);

  group.add(gGroup);

  registerDistrictInteractive({
    pos: { x: 16, z: 14 },
    radius: 5.5,
    prompt: `E키: [${dist.name}] 대표 맛집 3선 & 핫플 카페 보기`,
    action: () => openGourmetModal(realmCode)
  });

  districtObstacles.push({ type: 'cyl', x: 16, z: 14, r: 1.4, h: 2.0 });
}

function buildDistrictLandmarkLandscape(realmCode, dist, group) {
  const treeMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });

  const treePositions = [
    { x: -22, z: 2 },
    { x: -22, z: 26 },
    { x: 22, z: 2 },
    { x: 22, z: 26 },
    { x: -10, z: 34 },
    { x: 10, z: 34 }
  ];

  treePositions.forEach(p => {
    const tGroup = new THREE.Group();
    tGroup.position.set(p.x, 0, p.z);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 2.2, 8), trunkMat);
    trunk.position.y = 1.1;
    tGroup.add(trunk);

    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), (realmCode === 'DIST-DONGNAE') ? new THREE.MeshStandardMaterial({ color: 0xf472b6 }) : treeMat);
    foliage.position.y = 2.8;
    foliage.castShadow = true;
    tGroup.add(foliage);

    group.add(tGroup);
    districtObstacles.push({ type: 'cyl', x: p.x, z: p.z, r: 0.6, h: 3.5 });
  });
}

function buildReturnToCityHallPortal(group) {
  const pGroup = new THREE.Group();
  pGroup.position.set(0, 0, 32);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.2, 12, 32), new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x38bdf8, emissiveIntensity: 0.8 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.1;
  pGroup.add(ring);

  const pad = new THREE.Mesh(new THREE.CircleGeometry(2.2, 24), new THREE.MeshBasicMaterial({ color: 0x0369a1, transparent: true, opacity: 0.6 }));
  pad.rotation.x = -Math.PI / 2;
  pad.position.y = 0.05;
  pGroup.add(pad);

  createSignBoard(0, 2.4, 0, "🏢 부산시청 본관(광장)으로 복귀", 0x0284c7, pGroup);

  group.add(pGroup);

  registerDistrictInteractive({
    pos: { x: 0, z: 32 },
    radius: 4.5,
    prompt: "E키: 부산광역시청 본관(중앙시민광장)으로 복귀",
    action: () => switchRealm('BUSAN-HQ')
  });
}

function registerDistrictInteractive(obj) {
  districtInteractables.push(obj);
}

// ========================================================
// 19. 맛집, 민원실, 도서관 모달 렌더러 (v2.0)
// ========================================================
function openGourmetModal(districtCode) {
  const code = districtCode || STATE.currentRoom || 'BUSAN-HQ';
  const sel = document.getElementById('gourmet-district-select');
  if (sel) sel.value = code;
  renderGourmetContent(code);
  openModal('modal-gourmet');
}

function renderGourmetContent(code) {
  const dist = (typeof BUSAN_DISTRICT_DETAILS !== 'undefined' && BUSAN_DISTRICT_DETAILS[code]) 
    ? BUSAN_DISTRICT_DETAILS[code] 
    : BUSAN_DISTRICT_DETAILS['DIST-DONGNAE'];

  const titleEl = document.getElementById('gourmetModalTitle');
  if (titleEl) titleEl.innerText = `🍽️ [${dist.name}] 대표 맛집 & 인기 카페 안내`;

  const rList = document.getElementById('gourmetRestaurantList');
  if (rList) {
    rList.innerHTML = '';
    const restaurants = dist.gourmet?.restaurants || [];
    restaurants.forEach((r, idx) => {
      const card = document.createElement('div');
      card.className = 'gourmet-card';
      const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(r.name + ' ' + r.addr)}`;
      card.innerHTML = `
        <div class="gourmet-card-header">
          <div class="gourmet-name">#${idx + 1} ${escapeHtml(r.name)}</div>
          <span class="gourmet-dish-badge">🍲 ${escapeHtml(r.dish)}</span>
        </div>
        <div class="gourmet-desc">${escapeHtml(r.desc)}</div>
        <div class="gourmet-meta">
          <div class="gourmet-meta-left">
            <span>📍 ${escapeHtml(r.addr)}</span>
            ${r.tel ? `<span> · 📞 <a class="gourmet-tel-link" href="tel:${escapeHtml(r.tel)}">${escapeHtml(r.tel)}</a></span>` : ''}
          </div>
          <a href="${naverMapUrl}" target="_blank" rel="noopener" class="nav-btn clickable" style="padding:2px 8px; font-size:11px; height:24px;">지도보기 ↗</a>
        </div>
      `;
      rList.appendChild(card);
    });
  }

  const cList = document.getElementById('gourmetCafeList');
  if (cList) {
    cList.innerHTML = '';
    const cafes = dist.gourmet?.cafes || [];
    cafes.forEach((c, idx) => {
      const card = document.createElement('div');
      card.className = 'gourmet-card';
      const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(c.name + ' ' + c.addr)}`;
      card.innerHTML = `
        <div class="gourmet-card-header">
          <div class="gourmet-name">☕ ${escapeHtml(c.name)}</div>
          <span class="gourmet-cafe-badge">✨ ${escapeHtml(c.signature)}</span>
        </div>
        <div class="gourmet-desc">${escapeHtml(c.desc)}</div>
        <div class="gourmet-meta">
          <div class="gourmet-meta-left">
            <span>📍 ${escapeHtml(c.addr)}</span>
          </div>
          <a href="${naverMapUrl}" target="_blank" rel="noopener" class="nav-btn clickable" style="padding:2px 8px; font-size:11px; height:24px;">지도보기 ↗</a>
        </div>
      `;
      cList.appendChild(card);
    });
  }
}

function openDistrictOfficeModal(districtCode) {
  const code = districtCode || STATE.currentRoom || 'BUSAN-HQ';
  const dist = (typeof BUSAN_DISTRICT_DETAILS !== 'undefined' && BUSAN_DISTRICT_DETAILS[code]) 
    ? BUSAN_DISTRICT_DETAILS[code] 
    : BUSAN_DISTRICT_DETAILS['DIST-DONGNAE'];

  const titleEl = document.getElementById('districtOfficeModalTitle');
  if (titleEl) titleEl.innerText = `🏛️ [${dist.name}] 종합민원실 안내`;

  const subEl = document.getElementById('districtOfficeModalSub');
  if (subEl) subEl.innerText = `슬로건: "${dist.tagline}"`;

  const headerCard = document.getElementById('districtOfficeHeaderCard');
  if (headerCard) {
    headerCard.innerHTML = `
      <div style="font-weight:800; font-size:15px; color:#0f172a; margin-bottom:4px;">${escapeHtml(dist.name)} (${escapeHtml(dist.eng)})</div>
      <div style="font-size:12.5px; color:#475569; margin-bottom:6px;">📍 도로명 주소: ${escapeHtml(dist.address)}</div>
      <div style="font-size:12.5px; color:#0284c7; font-weight:700;">📞 대표전화: ${escapeHtml(dist.tel)}</div>
    `;
  }

  const countersList = document.getElementById('districtCountersList');
  if (countersList) {
    countersList.innerHTML = '';
    const counters = dist.civil_service?.counters || [];
    counters.forEach(c => {
      const card = document.createElement('div');
      card.className = 'district-counter-card';
      card.innerHTML = `
        <div class="counter-icon-box">📋</div>
        <div class="counter-content">
          <div class="counter-name">${escapeHtml(c.name)}</div>
          <div class="counter-desc">${escapeHtml(c.desc)}</div>
          ${c.tel ? `<div class="counter-tel">📞 직통전화: ${escapeHtml(c.tel)}</div>` : ''}
        </div>
      `;
      countersList.appendChild(card);
    });
  }

  const btnGov24 = document.getElementById('btnGov24Link');
  if (btnGov24) btnGov24.href = "https://www.gov.kr";

  const btnOfficial = document.getElementById('btnDistrictOfficialLink');
  if (btnOfficial) btnOfficial.href = dist.official_url || "https://www.busan.go.kr";

  openModal('modal-district-office');
}

function openDistrictLibraryModal(districtCode) {
  const code = districtCode || STATE.currentRoom || 'BUSAN-HQ';
  const dist = (typeof BUSAN_DISTRICT_DETAILS !== 'undefined' && BUSAN_DISTRICT_DETAILS[code]) 
    ? BUSAN_DISTRICT_DETAILS[code] 
    : BUSAN_DISTRICT_DETAILS['DIST-DONGNAE'];

  const titleEl = document.getElementById('districtLibraryModalTitle');
  if (titleEl) titleEl.innerText = `📚 [${dist.name}] 구립 도서관 & 전자도서관`;

  const card = document.getElementById('districtLibraryCard');
  if (card && dist.library) {
    card.innerHTML = `
      <div style="font-weight:800; font-size:16px; color:#581c87; margin-bottom:4px;">${escapeHtml(dist.library.name)}</div>
      <div style="font-size:12.5px; color:#475569; margin-bottom:4px;">📍 도서관 위치: ${escapeHtml(dist.library.addr)}</div>
      <div style="font-size:12.5px; color:#7e22ce; font-weight:700; margin-bottom:8px;">📞 이용안내: ${escapeHtml(dist.library.tel)}</div>
      <div style="font-size:12px; color:#6b21a8; background:#f3e8ff; border-radius:8px; padding:8px 10px; line-height:1.5;">
        📖 주요 서비스: ${escapeHtml(dist.library.services)}
      </div>
    `;
  }

  const btnLink = document.getElementById('btnLibraryPortalLink');
  if (btnLink && dist.library) {
    btnLink.href = dist.library.portal_url || "https://library.busan.go.kr";
  }

  openModal('modal-district-library');
}

// ========================================================
// 20. 채팅 엔터키 전송 및 모바일 터치 보호 (v2.0)
// ========================================================
function setupChatEnterListeners() {
  const testimonyInput = document.getElementById('testimonyInput');
  if (testimonyInput) {
    testimonyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        submitQuickCitizenVoice();
      }
    });
  }

  const aiInput = document.getElementById('ai-question-input');
  if (aiInput) {
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        submitAiQuestion();
      }
    });
  }

  const podiumInput = document.getElementById('podium-input-text');
  if (podiumInput) {
    podiumInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        submitPodiumShout();
      }
    });
  }
}

function setupMobileProtections() {
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

  let lastTouchTime = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchTime <= 300) {
      if (!e.target.closest('input, textarea, select, button, a')) {
        e.preventDefault();
      }
    }
    lastTouchTime = now;
  }, { passive: false });
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


// ========================================================
// 18. 부산광역시 열린 정보공개방 & 20단계 시민생활/계급 엔진 (신규)
// ========================================================
window.BUSAN_OPEN_DATA = {
  "budgets": [
    {
      "year": "2026",
      "title": "2026년도 부산광역시 본예산",
      "total_amount": "16조 6,921억 원",
      "general_fund": "13조 3,428억 원",
      "special_fund": "3조 3,493억 원",
      "diff_prev": "+9,926억 원 (+6.3%)",
      "slogan": "시민 행복도시 & 글로벌 허브도시 실현을 위한 미래 성장 동력 확보",
      "sectors": [
        {
          "name": "사회복지 및 보건의료",
          "amount": "6조 1,240억 원",
          "pct": "36.7%",
          "color": "#0284c7"
        },
        {
          "name": "교통 및 물류체계 혁신",
          "amount": "1조 8,920억 원",
          "pct": "11.3%",
          "color": "#2563eb"
        },
        {
          "name": "일반공공행정 및 자치행정",
          "amount": "1조 7,450억 원",
          "pct": "10.5%",
          "color": "#0d9488"
        },
        {
          "name": "환경보전 및 상하수도",
          "amount": "1조 2,130억 원",
          "pct": "7.3%",
          "color": "#16a34a"
        },
        {
          "name": "경제활성화 및 청년일자리",
          "amount": "1조 1,580억 원",
          "pct": "6.9%",
          "color": "#ea580c"
        },
        {
          "name": "문화예술 및 해양관광",
          "amount": "7,840억 원",
          "pct": "4.7%",
          "color": "#e11d48"
        },
        {
          "name": "시민안전 및 재난방재",
          "amount": "6,890억 원",
          "pct": "4.1%",
          "color": "#d97706"
        },
        {
          "name": "교육 및 지산학 인재양성",
          "amount": "5,410억 원",
          "pct": "3.2%",
          "color": "#7c3aed"
        },
        {
          "name": "기타 및 재정예비비",
          "amount": "5,461억 원",
          "pct": "3.3%",
          "color": "#64748b"
        }
      ],
      "core_investments": [
        {
          "title": "가덕도신공항 조기 착공 기반조성",
          "amount": "2,480억 원",
          "desc": "남부권 관문공항 보상 및 접근교통망 도로·철도 인프라 선제 착공"
        },
        {
          "title": "부산형 대중교통 동백패스 2.0 & 어린이 무료화",
          "amount": "1,120억 원",
          "desc": "월 4만 5천원 초과금 전액 환급 및 K-패스 중복 결합 전국 최고 교통복지"
        },
        {
          "title": "어린이 복합문화공간 들락날락 100개소",
          "amount": "450억 원",
          "desc": "집 근처 15분 생활권 내 디지털 미디어 아트, 독서, 원어민 AI 영어체험"
        },
        {
          "title": "북항재개발 2단계 배후부지 조성 및 복합단지",
          "amount": "920억 원",
          "desc": "철도시설 재배치 및 오페라하우스 완공 연계 글로벌 워터프론트 구축"
        },
        {
          "title": "지산학 협력 산학도제 및 청년 미래일자리",
          "amount": "780억 원",
          "desc": "지역 21개 대학과 미래 모빌리티·반도체·바이오 기업 현장 맞춤형 인재 양성"
        },
        {
          "title": "소상공인 3대 안전망 및 민생회복 자금",
          "amount": "890억 원",
          "desc": "무이자 경영안정자금 및 골목상권 동백전 발행 캐시백 인센티브 지속 지원"
        },
        {
          "title": "도시침수 예방 대심도 빗물배수터널 및 스마트 방재",
          "amount": "630억 원",
          "desc": "온천천 및 센텀시티 등 상습 침수지역 극한호우 대응 지하 빗물저류터널 고도화"
        }
      ],
      "official_url": "https://www.busan.go.kr/open/finance01",
      "pdf_name": "2026년도_부산광역시_예산서_총람.pdf"
    },
    {
      "year": "2025",
      "title": "2025년도 부산광역시 본예산",
      "total_amount": "15조 6,995억 원",
      "general_fund": "12조 5,711억 원",
      "special_fund": "3조 1,284억 원",
      "diff_prev": "-485억 원 (-0.3%)",
      "slogan": "민생안정, 미래투자, 약자복지 중심 건전재정 운용",
      "sectors": [
        {
          "name": "사회복지 및 보건의료",
          "amount": "5조 7,650억 원",
          "pct": "36.7%",
          "color": "#0284c7"
        },
        {
          "name": "교통 및 물류체계",
          "amount": "1조 7,320억 원",
          "pct": "11.0%",
          "color": "#2563eb"
        },
        {
          "name": "일반공공행정",
          "amount": "1조 6,800억 원",
          "pct": "10.7%",
          "color": "#0d9488"
        },
        {
          "name": "환경보전",
          "amount": "1조 1,480억 원",
          "pct": "7.3%",
          "color": "#16a34a"
        },
        {
          "name": "경제활성화",
          "amount": "1조 890억 원",
          "pct": "6.9%",
          "color": "#ea580c"
        },
        {
          "name": "문화예술관광",
          "amount": "7,250억 원",
          "pct": "4.6%",
          "color": "#e11d48"
        },
        {
          "name": "국토 및 지역개발",
          "amount": "6,520억 원",
          "pct": "4.2%",
          "color": "#d97706"
        },
        {
          "name": "기타",
          "amount": "2조 4,085억 원",
          "pct": "15.3%",
          "color": "#64748b"
        }
      ],
      "core_investments": [
        {
          "title": "도시철도 하단-녹산선 기본설계 및 착공",
          "amount": "680억 원",
          "desc": "서부산권 광역교통난 해소 및 녹산산단 연결"
        },
        {
          "title": "퐁당퐁당 영유아 돌봄센터 및 어린이 안심통학",
          "amount": "320억 원",
          "desc": "24시간 돌봄 공공 서비스망 전면 가동"
        },
        {
          "title": "부산 블록체인 규제자유특구 글로벌 벤처 육성",
          "amount": "410억 원",
          "desc": "디지털자산거래소 기반 생태계 조성"
        }
      ],
      "official_url": "https://www.busan.go.kr/open/finance01",
      "pdf_name": "2025년도_부산광역시_예산서_총람.pdf"
    },
    {
      "year": "2024",
      "title": "2024년도 부산광역시 본예산",
      "total_amount": "15조 7,480억 원",
      "general_fund": "12조 5,917억 원",
      "special_fund": "3조 1,563억 원",
      "diff_prev": "+4,203억 원 (+2.7%)",
      "slogan": "시민 안심도시, 글로벌 영어하기 편한 도시 조성",
      "sectors": [
        {
          "name": "사회복지",
          "amount": "5조 6,210억 원",
          "pct": "35.7%",
          "color": "#0284c7"
        },
        {
          "name": "교통물류",
          "amount": "1조 6,850억 원",
          "pct": "10.7%",
          "color": "#2563eb"
        },
        {
          "name": "공공행정",
          "amount": "1조 6,100억 원",
          "pct": "10.2%",
          "color": "#0d9488"
        },
        {
          "name": "환경",
          "amount": "1조 950억 원",
          "pct": "7.0%",
          "color": "#16a34a"
        },
        {
          "name": "산업경제",
          "amount": "1조 200억 원",
          "pct": "6.5%",
          "color": "#ea580c"
        },
        {
          "name": "기타",
          "amount": "4조 7,170억 원",
          "pct": "29.9%",
          "color": "#64748b"
        }
      ],
      "core_investments": [
        {
          "title": "대중교통 동백패스 전국 최초 정식 시행",
          "amount": "850억 원",
          "desc": "부산시 대중교통 이용률 10% 증가 견인"
        },
        {
          "title": "영어하기 편한 도시 글로벌 빌리지 확충",
          "amount": "220억 원",
          "desc": "시민 생활영어 교육 및 외국인 정주 환경 혁신"
        }
      ],
      "official_url": "https://www.busan.go.kr/open/finance01",
      "pdf_name": "2024년도_부산광역시_예산서_총람.pdf"
    },
    {
      "year": "2023",
      "title": "2023년도 부산광역시 본예산",
      "total_amount": "15조 3,277억 원",
      "general_fund": "11조 9,349억 원",
      "special_fund": "3조 3,928억 원",
      "diff_prev": "+1조 587억 원 (+7.4%)",
      "slogan": "2030 부산세계박람회 유치 도전 및 미래 스마트 그린도시 구현",
      "sectors": [
        {
          "name": "사회복지",
          "amount": "5조 3,120억 원",
          "pct": "34.7%",
          "color": "#0284c7"
        },
        {
          "name": "교통물류",
          "amount": "1조 6,200억 원",
          "pct": "10.6%",
          "color": "#2563eb"
        },
        {
          "name": "환경",
          "amount": "1조 500억 원",
          "pct": "6.8%",
          "color": "#16a34a"
        },
        {
          "name": "기타",
          "amount": "7조 3,457억 원",
          "pct": "47.9%",
          "color": "#64748b"
        }
      ],
      "core_investments": [
        {
          "title": "2030 세계박람회 유치 활동 및 홍보",
          "amount": "620억 원",
          "desc": "BIE 현지실사 대응 및 범시민 유치 열기 조성"
        },
        {
          "title": "수소 모빌리티 및 친환경 그린스마트 인프라",
          "amount": "480억 원",
          "desc": "친환경 수소버스 및 충전소 보급 확대"
        }
      ],
      "official_url": "https://www.busan.go.kr/open/finance01",
      "pdf_name": "2023년도_부산광역시_예산서_총람.pdf"
    },
    {
      "year": "2022",
      "title": "2022년도 부산광역시 본예산",
      "total_amount": "14조 2,690억 원",
      "general_fund": "10조 9,250억 원",
      "special_fund": "3조 3,440억 원",
      "diff_prev": "+9,680억 원 (+7.3%)",
      "slogan": "코로나19 조기 극복 및 일상회복 도약",
      "sectors": [
        {
          "name": "사회복지",
          "amount": "4조 8,900억 원",
          "pct": "34.3%",
          "color": "#0284c7"
        },
        {
          "name": "교통물류",
          "amount": "1조 5,400억 원",
          "pct": "10.8%",
          "color": "#2563eb"
        },
        {
          "name": "기타",
          "amount": "7조 8,390억 원",
          "pct": "54.9%",
          "color": "#64748b"
        }
      ],
      "core_investments": [
        {
          "title": "소상공인 3무(무한도·무이자·무보증료) 특별자금",
          "amount": "540억 원",
          "desc": "위기 소상공인 긴급 금융지원"
        },
        {
          "title": "지역화폐 동백전 발행 인센티브",
          "amount": "800억 원",
          "desc": "골목상권 소비 진작 10% 캐시백 지원"
        }
      ],
      "official_url": "https://www.busan.go.kr/open/finance01",
      "pdf_name": "2022년도_부산광역시_예산서_총람.pdf"
    },
    {
      "year": "2021",
      "title": "2021년도 부산광역시 본예산",
      "total_amount": "13조 3,010억 원",
      "general_fund": "10조 3,240억 원",
      "special_fund": "2조 9,770억 원",
      "diff_prev": "+7,100억 원 (+5.6%)",
      "slogan": "방역체계 확립 및 시민 안전망 강화",
      "sectors": [
        {
          "name": "사회복지",
          "amount": "4조 5,100억 원",
          "pct": "33.9%",
          "color": "#0284c7"
        },
        {
          "name": "기타",
          "amount": "8조 7,910억 원",
          "pct": "66.1%",
          "color": "#64748b"
        }
      ],
      "core_investments": [
        {
          "title": "감염병 상시 전담 호흡기 클리닉 확충",
          "amount": "320억 원",
          "desc": "지역 방역 대응체계 고도화"
        }
      ],
      "official_url": "https://www.busan.go.kr/open/finance01",
      "pdf_name": "2021년도_부산광역시_예산서_총람.pdf"
    }
  ],
  "projects": [
    {
      "id": "gadeok",
      "title": "가덕도신공항 건설사업",
      "badge": "핵심 관문공항",
      "status": "2029년 개항 추진 중",
      "dept": "신공항추진본부 (051-888-4501)",
      "desc": "남부권 1,400만 국민의 글로벌 하늘길을 여는 24시간 운영 가능한 복합 해양물류 거점 관문공항. 공항복합도시 및 배후 철도·도로망 연계 구축.",
      "budget": "총사업비 약 13조 4,900억 원",
      "period": "2024년 ~ 2029년",
      "url": "https://www.busan.go.kr/depart/air01"
    },
    {
      "id": "north_port",
      "title": "부산항 북항재개발 1·2단계",
      "badge": "해양 랜드마크",
      "status": "1단계 친환경 수변공원 개방, 2단계 본궤도",
      "dept": "도시균형발전실 북항재개발과 (051-888-2511)",
      "desc": "우리나라 최초의 항만재개발 사업. 친환경 수변공원, 해양레저공간, 오페라하우스, 랜드마크 복합상업지구를 조성하여 원도심과 바다를 잇는 글로벌 해양관광 비즈니스 지구 조성.",
      "budget": "1·2단계 총 4조 8,000억 원",
      "period": "2008년 ~ 2030년",
      "url": "https://www.busan.go.kr/depart/inport"
    },
    {
      "id": "15min_city",
      "title": "부산형 15분 도시",
      "badge": "생활권 혁신",
      "status": "들락날락 100개소 및 생활권 보행로 확충",
      "dept": "15분도시기획단 (051-888-3481)",
      "desc": "집에서 걸어서 또는 자전거로 15분 이내에 직장, 주거, 교육, 보육, 문화, 의료 서비스를 누릴 수 있는 지속 가능한 사람 중심의 생활권 스마트 도시.",
      "budget": "연간 약 2,500억 원 투입",
      "period": "2022년 ~ 계속",
      "url": "https://www.busan.go.kr/depart/15min"
    },
    {
      "id": "bdx",
      "title": "부산 디지털자산거래소 (BDX) & 금융특구",
      "badge": "미래금융 허브",
      "status": "문현금융단지 BIFC 연계 법인 설립 가동",
      "dept": "금융블록체인담당관 (051-888-4681)",
      "desc": "원자재, 귀금속, 지식재산권, 토큰증권(ST) 등 모든 가치 있는 실물 자산을 디지털화하여 24시간 안전하게 거래하는 4차 산업 블록체인 기반 공공 민간 협력 거래소.",
      "budget": "민자 및 정책금융 협력",
      "period": "2024년 ~ 계속",
      "url": "https://www.busan.go.kr/depart/infin"
    },
    {
      "id": "dongbaek_pass",
      "title": "대중교통 통합할인제 동백패스 & 어린이 무료화",
      "badge": "전국 최초 교통복지",
      "status": "가입자 50만 돌파, K-패스 연계 완료",
      "dept": "교통정책과 (051-888-3901)",
      "desc": "시내버스, 마을버스, 도시철도, 동해선, 경전철 이용 시 월 45,000원 초과 사용액을 최대 45,000원까지 동백전 캐시백으로 환급. 만 6~12세 어린이 대중교통 100% 무료.",
      "budget": "연간 약 1,100억 원",
      "period": "2023년 8월 ~ 계속",
      "url": "https://www.busan.go.kr/depart/intrans01"
    },
    {
      "id": "metro_expansion",
      "title": "도시철도망 확충 (하단-녹산선, 사상-하단선)",
      "badge": "광역 교통망",
      "status": "사상-하단선 마무리, 하단-녹산선 착공",
      "dept": "도시철도과 (051-888-4061)",
      "desc": "서부산권 교통난 해소를 위해 사상~하단(6.9km), 하단~녹산(14.4km) 도시철도를 연결하여 명지국제신도시와 녹산국가산단을 잇는 핵심 대중교통 축 형성.",
      "budget": "약 1조 7,500억 원",
      "period": "2016년 ~ 2029년",
      "url": "https://www.busan.go.kr/depart/inmetro"
    }
  ],
  "news": [
    {
      "title": "부산시, 2026년도 본예산 16조 6,921억원 최종 확정… 글로벌 허브도시 미래투자 본격화",
      "date": "2026.01.05",
      "dept": "예산담당관",
      "category": "예산·재정",
      "summary": "복지·보건 6.1조, 교통물류 1.8조 등 약자복지와 미래 신성장동력 확보에 역대 최대 규모 본예산 편성.",
      "url": "https://www.busan.go.kr/nbnews"
    },
    {
      "title": "‘부산 동백패스’, K-패스와 완벽 결합해 전국 최고의 대중교통 환급 혜택 제공",
      "date": "2026.01.20",
      "dept": "교통정책과",
      "category": "교통복지",
      "summary": "부산 시민이라면 누구나 K-패스와 동백패스 중 더 큰 환급액을 자동으로 적용받아 실질적인 교통비 절감 효과 체감.",
      "url": "https://www.busan.go.kr/nbnews"
    },
    {
      "title": "가덕도신공항 부지조성공사 본계약 체결… 2029년 개항 목표 탄력",
      "date": "2026.02.03",
      "dept": "신공항추진단",
      "category": "도시인프라",
      "summary": "남부권 하늘길을 열 가덕도신공항 부지조성공사가 공식 착공 절차에 돌입하여 글로벌 복합물류 허브도시 조성 가속.",
      "url": "https://www.busan.go.kr/nbnews"
    },
    {
      "title": "15분도시 들락날락, 부산 전역 100번째 복합문화공간 개관 달성!",
      "date": "2026.02.14",
      "dept": "15분도시기획단",
      "category": "시민생활",
      "summary": "아이와 부모가 집 앞에서 누리는 미래형 디지털 놀이터 및 독서 체험관 들락날락이 누적 100개소를 돌파.",
      "url": "https://www.busan.go.kr/nbnews"
    },
    {
      "title": "2026 부산 청년 희망날개통장 & 월세 특별지원 신규 참여자 모집",
      "date": "2026.02.22",
      "dept": "청년정책담당관",
      "category": "청년·일자리",
      "summary": "부산 거주 청년들의 안정적인 주거 자립과 자산 형성을 지원하는 매칭 지원금 통장 신청 안내.",
      "url": "https://www.busan.go.kr/nbnews"
    },
    {
      "title": "광안리 해변 ‘M 드론라이트쇼’ 상설공연, 2026 시즌 신규 테마 공개",
      "date": "2026.03.02",
      "dept": "관광마이스산업과",
      "category": "문화·관광",
      "summary": "매주 토요일 밤 광안대교를 배경으로 펼쳐지는 세계적 수준의 드론 멀티미디어 쇼 시즌 개막.",
      "url": "https://www.busan.go.kr/nbnews"
    }
  ],
  "statistics": {
    "population": "3,284,520명",
    "households": "1,572,140가구",
    "grdp": "104조 3,000억 원",
    "fiscal_independence": "48.7%",
    "port_teu": "2,350만 TEU (세계 6위, 환적 2위)",
    "tourists": "연간 외국인 320만 명 방문",
    "districts_count": "16개 자치구·군 (15구 1군)",
    "slogan": "다시 태어나도 살고 싶은 부산 (Busan is Good)",
    "symbols": {
      "flower": "동백꽃",
      "tree": "동백나무",
      "bird": "갈매기",
      "fish": "고등어",
      "character": "부기 (Boogi)"
    }
  },
  "civic_ranks": [
    {
      "level": 1,
      "title": "방황하는 시민",
      "xp": 0,
      "reward": "기본 시민 의상",
      "badge": "🌱"
    },
    {
      "level": 2,
      "title": "신규 방문자",
      "xp": 50,
      "reward": "기본 인사 제스처",
      "badge": "👋"
    },
    {
      "level": 3,
      "title": "관심 시민",
      "xp": 120,
      "reward": "박수 제스처 & 동백꽃핀",
      "badge": "🌺"
    },
    {
      "level": 4,
      "title": "열린 소통자",
      "xp": 220,
      "reward": "120 스마트 헤드셋",
      "badge": "🎧"
    },
    {
      "level": 5,
      "title": "시정 모니터",
      "xp": 350,
      "reward": "응원 제스처 & 캐주얼 볼캡",
      "badge": "🧢"
    },
    {
      "level": 6,
      "title": "적극 행정인",
      "xp": 520,
      "reward": "청량 스트리트 데님 로브",
      "badge": "👖"
    },
    {
      "level": 7,
      "title": "민원 지킴이",
      "xp": 720,
      "reward": "트렌디 선글라스",
      "badge": "🕶️"
    },
    {
      "level": 8,
      "title": "주민 자치위원",
      "xp": 960,
      "reward": "로맨틱 라벤더 로브",
      "badge": "💜"
    },
    {
      "level": 9,
      "title": "정책 제안가",
      "xp": 1250,
      "reward": "갈매기 날개",
      "badge": "🕊️"
    },
    {
      "level": 10,
      "title": "동백꽃 명예대사",
      "xp": 1600,
      "reward": "전통 한복 로브 & 댄스 제스처",
      "badge": "🎎"
    },
    {
      "level": 11,
      "title": "15분도시 플래너",
      "xp": 2000,
      "reward": "셰프 모자 & 미식가 부기 뱃지",
      "badge": "👨‍🍳"
    },
    {
      "level": 12,
      "title": "지산학 혁신가",
      "xp": 2450,
      "reward": "반짝이는 나비 날개",
      "badge": "🦋"
    },
    {
      "level": 13,
      "title": "해양수도 지킴이",
      "xp": 2950,
      "reward": "부산 마린블루 스페셜 로브",
      "badge": "⚓"
    },
    {
      "level": 14,
      "title": "글로벌 서포터",
      "xp": 3500,
      "reward": "모험가 여행자 백팩",
      "badge": "🎒"
    },
    {
      "level": 15,
      "title": "명예 부산시민",
      "xp": 4150,
      "reward": "성스러운 천사 날개 & 환호 제스처",
      "badge": "🪽"
    },
    {
      "level": 16,
      "title": "미래비전 수석위원",
      "xp": 4900,
      "reward": "찬란한 로열 골드 로브",
      "badge": "✨"
    },
    {
      "level": 17,
      "title": "동백 대상 수상자",
      "xp": 5800,
      "reward": "천사의 빛나는 후광",
      "badge": "😇"
    },
    {
      "level": 18,
      "title": "부산 미래원로",
      "xp": 6900,
      "reward": "위풍당당 경례 제스처 & 로열 크라운",
      "badge": "👑"
    },
    {
      "level": 19,
      "title": "영원한 수호자",
      "xp": 8200,
      "reward": "황금빛 수호 오라 이펙트",
      "badge": "🛡️"
    },
    {
      "level": 20,
      "title": "열린 부산 최고 시민의장",
      "xp": 10000,
      "reward": "최고 시민의장 황금 보좌 & 전용 칭호",
      "badge": "🏛️"
    }
  ],
  "daily_missions": [
    {
      "id": "m1",
      "title": "부산시청 시민광장 산책하기",
      "desc": "5대 시민광장 또는 청사 로비 1회 거닐기",
      "xp": 30,
      "coin": 10
    },
    {
      "id": "m2",
      "title": "AI 안내원 다온과 행정 질의응답",
      "desc": "소관부서 판별기 또는 AI 상담 1회 질문하기",
      "xp": 40,
      "coin": 15
    },
    {
      "id": "m3",
      "title": "열린 정보공개방 예산서 둘러보기",
      "desc": "2026 부산시 본예산 및 핵심 프로젝트 열람",
      "xp": 40,
      "coin": 15
    },
    {
      "id": "m4",
      "title": "시민 자유담벼락에 응원글 작성",
      "desc": "자유담벼락에 글 남기기 또는 공감 하트 누르기",
      "xp": 40,
      "coin": 15
    },
    {
      "id": "m5",
      "title": "16개 구·군청 중 1곳 방문하기",
      "desc": "텔레포트로 구청 방문하여 종합민원실 둘러보기",
      "xp": 50,
      "coin": 20
    }
  ]
};

let selectedBudgetYearGlobal = '2026';
let activeHopeBalloons = [];

// [3D 공간 건축] 1층 서편 로비 열린 정보공개관 데스크
function buildOpenDataInformationCenter(x, y, z, parent) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  // 카운터 데스크
  const counterGeo = new THREE.BoxGeometry(6.5, 1.1, 1.6);
  const counterMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.35, roughness: 0.4 });
  const counter = new THREE.Mesh(counterGeo, counterMat);
  counter.position.y = 0.55;
  group.add(counter);

  createSignBoard(0, 1.8, 0, "📂 열린 정보공개관 (연도별 예산서)", 0x38bdf8, group);

  // 회전하는 3D 홀로그램 폴더 조형물
  const holoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.15);
  const holoMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6, transparent: true, opacity: 0.85 });
  const holoFolder = new THREE.Mesh(holoGeo, holoMat);
  holoFolder.position.set(0, 1.45, 0);
  group.add(holoFolder);

  // 회전 애니메이션 등록
  setInterval(() => {
    if (holoFolder) holoFolder.rotation.y += 0.03;
  }, 30);

  // 전담 안내원 NPC (정보공개관 부기)
  const staffNpc = createCuteCitizenMesh({
    name: "정보관 부기",
    title: "예산·행정정보 안내",
    robeColor: "gold",
    hatType: "chef",
    wingsType: "none",
    hairStyle: "dandy",
    hairColor: "brown",
    skinTone: "warm",
    isNpc: true
  });
  staffNpc.position.set(0, 0, -1.0);
  group.add(staffNpc);

  parent.add(group);

  registerInteractiveObject({
    id: 'open_data_desk',
    pos: { x, y, z: z + 1.2 },
    radius: 3.5,
    prompt: "E키: 열린 정보공개관 (연도별 예산서·프로젝트·통계 열람)",
    action: () => {
      openOpenDataModal();
    }
  });

  busanCityHallObstacles.push({ type: 'box', x, z, w: 6.5, d: 1.6, h: 1.1 });
}

// 실시간 아바타 스타일링 미리보기 (모달 내 선택 즉시 변경 - 달걀머리 번갈아 깜빡이는 버그 완벽 제거)
function applyPlayerAvatarArchetype(archetype) {
  if (!localPlayer) return;
  STATE.avatarArchetype = archetype;
  localStorage.setItem('busan_avatar_archetype', archetype);

  const curPos = localPlayer.position.clone();
  const curRotY = localPlayer.rotation.y;

  // 1. 기존 Tripo / 부기 메시 정리
  if (localPlayer.userData.tripoMesh) {
    localPlayer.remove(localPlayer.userData.tripoMesh);
    localPlayer.userData.tripoMesh = null;
  }

  if (archetype === 'boogi') {
    // 🌊 공식 부기 아바타
    const boogiMesh = createOfficialBoogiMesh();
    boogiMesh.scale.set(1.25, 1.25, 1.25);
    boogiMesh.position.set(0, 0, 0);

    localPlayer.children.forEach(c => {
      if (c !== localPlayer.userData.nameplate && c !== localPlayer.userData.bubbleSlot && c !== localPlayer.userData.auraRing) {
        c.visible = false;
      }
    });
    localPlayer.add(boogiMesh);
    localPlayer.userData.tripoMesh = boogiMesh;
    localPlayer.userData.tripoBaseY = 0.0;
  } else if (archetype === 'officer' && typeof TripoAssetManager !== 'undefined' && TripoAssetManager.civilOfficerModel) {
    // 🏛️ 부산시청 공무원 아바타
    TripoAssetManager.replacePlayerModel(TripoAssetManager.civilOfficerModel);
  } else if (archetype === 'worker' && typeof TripoAssetManager !== 'undefined' && TripoAssetManager.officeWorkerModel) {
    // 💼 스마트 회사원 아바타
    TripoAssetManager.replacePlayerModel(TripoAssetManager.officeWorkerModel);
  } else {
    // 🎨 클래식 열린 시민 (절대 달걀머리가 아닌 풀 커스텀 모드)
    localPlayer.children.forEach(c => {
      c.visible = true;
    });
    if (localPlayer.userData.robeMat) {
      const robeHex = COLOR_PALETTE[STATE.robeColor] || COLOR_PALETTE.blue;
      localPlayer.userData.robeMat.color.setHex(robeHex);
    }
  }

  localPlayer.position.copy(curPos);
  localPlayer.rotation.y = curRotY;
}

function previewCustomization() {
  const nameInput = document.getElementById('custom-name');
  const archSel = document.getElementById('custom-archetype');
  const hairStyleSel = document.getElementById('custom-hair-style');
  const hairColorSel = document.getElementById('custom-hair-color');
  const skinSel = document.getElementById('custom-skin');
  const robeSelect = document.getElementById('custom-robe');
  const hatSelect = document.getElementById('custom-hat');
  const wingsSelect = document.getElementById('custom-wings');

  if (nameInput && nameInput.value.trim()) STATE.playerName = nameInput.value.trim();
  if (archSel) STATE.avatarArchetype = archSel.value;
  if (hairStyleSel) STATE.hairStyle = hairStyleSel.value;
  if (hairColorSel) STATE.hairColor = hairColorSel.value;
  if (skinSel) STATE.skinTone = skinSel.value;
  if (robeSelect) STATE.robeColor = robeSelect.value;
  if (hatSelect) STATE.hatType = hatSelect.value;
  if (wingsSelect) STATE.wingsType = wingsSelect.value;

  applyPlayerAvatarArchetype(STATE.avatarArchetype);
}

// 열린 정보공개방 모달 열기 및 데이터 렌더링
function openOpenDataModal(activeTab = 'budgets') {
  openModal('modal-open-info');
  switchOpenDataTab(activeTab);
}

function switchOpenDataTab(tabName, btnEl) {
  document.querySelectorAll('.open-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.open-tab-content').forEach(c => c.style.display = 'none');

  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    const defaultBtn = document.querySelector(`.open-tab-btn[onclick*="${tabName}"]`);
    if (defaultBtn) defaultBtn.classList.add('active');
  }

  const target = document.getElementById(`openTab-${tabName}`);
  if (target) target.style.display = 'block';

  if (tabName === 'budgets') renderBudgetData(selectedBudgetYearGlobal);
  if (tabName === 'projects') renderProjectsData();
  if (tabName === 'news') renderNewsData();
  if (tabName === 'stats') renderStatsData();
}

function selectBudgetYear(year, btnEl) {
  selectedBudgetYearGlobal = year;
  document.querySelectorAll('.year-pill').forEach(p => p.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderBudgetData(year);
}

function renderBudgetData(year) {
  const data = window.BUSAN_OPEN_DATA || {};
  const budgets = data.budgets || [];
  const b = budgets.find(item => item.year === year) || budgets[0];
  if (!b) return;

  const banner = document.getElementById('budgetSummaryBanner');
  if (banner) {
    banner.innerHTML = `
      <div class="budget-title-row">
        <div>
          <span style="font-size:12px; color:#94a3b8; font-weight:700;">부산광역시 공식 세입·세출 본예산 총액</span>
          <div class="budget-main-val">${b.total_amount}</div>
        </div>
        <div class="budget-diff-badge">${b.diff_prev || '확정 예산'}</div>
      </div>
      <div style="display:flex; gap:16px; font-size:12px; color:#e2e8f0; margin: 8px 0;">
        <span>일반회계: <strong>${b.general_fund}</strong></span>
        <span>특별회계: <strong>${b.special_fund}</strong></span>
      </div>
      <div class="budget-slogan">💡 ${b.slogan}</div>
    `;
  }

  const sectorsList = document.getElementById('budgetSectorsList');
  if (sectorsList) {
    sectorsList.innerHTML = (b.sectors || []).map(sec => `
      <div class="sector-card">
        <div class="sector-header">
          <span>${sec.name}</span>
          <span style="color:#0284c7;">${sec.amount} (${sec.pct})</span>
        </div>
        <div class="sector-bar-bg">
          <div class="sector-bar-fill" style="width:${sec.pct}; background:${sec.color || '#0284c7'};"></div>
        </div>
      </div>
    `).join('');
  }

  const investList = document.getElementById('budgetInvestmentsList');
  if (investList) {
    investList.innerHTML = (b.core_investments || []).map(inv => `
      <div class="invest-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div class="invest-title">📌 ${inv.title}</div>
          <div class="invest-amount">${inv.amount}</div>
        </div>
        <div class="invest-desc">${inv.desc}</div>
      </div>
    `).join('');
  }

  const officialLink = document.getElementById('btnBudgetOfficialUrl');
  if (officialLink && b.official_url) {
    officialLink.href = b.official_url;
  }
}

function renderProjectsData() {
  const data = window.BUSAN_OPEN_DATA || {};
  const projects = data.projects || [];
  const listEl = document.getElementById('majorProjectsList');
  if (!listEl) return;

  listEl.innerHTML = projects.map(p => `
    <div class="project-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
        <div style="font-size:15px; font-weight:800; color:#0f172a;">${p.title}</div>
        <span class="project-badge">${p.badge}</span>
      </div>
      <div style="font-size:12px; color:#0284c7; font-weight:700; margin-bottom:4px;">
        상태: ${p.status} | 예산: ${p.budget}
      </div>
      <div style="font-size:12.5px; color:#475569; line-height:1.5; margin-bottom:6px;">
        ${p.desc}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:#64748b; padding-top:6px; border-top:1px dashed #e2e8f0;">
        <span>담당부서: ${p.dept}</span>
        <a href="${p.url}" target="_blank" rel="noopener" style="color:#0284c7; text-decoration:none; font-weight:700;">상세보기 ↗</a>
      </div>
    </div>
  `).join('');
}

function renderNewsData() {
  const data = window.BUSAN_OPEN_DATA || {};
  const news = data.news || [];
  const listEl = document.getElementById('cityNewsList');
  if (!listEl) return;

  listEl.innerHTML = news.map(n => `
    <div class="invest-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span class="project-badge">${n.category}</span>
        <span style="font-size:11px; color:#94a3b8;">${n.date} | ${n.dept}</span>
      </div>
      <div style="font-size:13.5px; font-weight:800; color:#0f172a; margin-bottom:4px;">${n.title}</div>
      <div style="font-size:12px; color:#475569; line-height:1.4;">${n.summary}</div>
      <div style="margin-top:6px; text-align:right;">
        <a href="${n.url}" target="_blank" rel="noopener" style="font-size:11.5px; color:#0284c7; font-weight:700; text-decoration:none;">공식 보도자료 읽기 ↗</a>
      </div>
    </div>
  `).join('');
}

function renderStatsData() {
  const data = window.BUSAN_OPEN_DATA || {};
  const st = data.statistics || {};
  const container = document.getElementById('cityStatsContainer');
  if (!container) return;

  container.innerHTML = `
    <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:12px; padding:16px; margin-bottom:14px; text-align:center;">
      <div style="font-size:12px; color:#0369a1; font-weight:700;">부산광역시 도시 브랜드 슬로건</div>
      <div style="font-size:22px; font-weight:900; color:#0284c7; margin:4px 0;">${st.slogan || 'Busan is Good'}</div>
      <div style="font-size:12px; color:#64748b;">다시 태어나도 살고 싶은 대한민국 해양 수도</div>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:14px;">
      <div class="sector-card">
        <div style="font-size:11px; color:#64748b;">부산 총 인구</div>
        <div style="font-size:16px; font-weight:800; color:#0f172a;">${st.population}</div>
      </div>
      <div class="sector-card">
        <div style="font-size:11px; color:#64748b;">지역내총생산 (GRDP)</div>
        <div style="font-size:16px; font-weight:800; color:#0f172a;">${st.grdp}</div>
      </div>
      <div class="sector-card">
        <div style="font-size:11px; color:#64748b;">재정자립도</div>
        <div style="font-size:16px; font-weight:800; color:#0284c7;">${st.fiscal_independence}</div>
      </div>
      <div class="sector-card">
        <div style="font-size:11px; color:#64748b;">연간 항만 물동량</div>
        <div style="font-size:16px; font-weight:800; color:#0284c7;">${st.port_teu}</div>
      </div>
    </div>

    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:12px; font-size:12.5px; color:#334155; line-height:1.6;">
      <div>🌲 <strong>시목:</strong> ${st.symbols ? st.symbols.tree : '동백나무'} &nbsp;|&nbsp; 🌺 <strong>시화:</strong> ${st.symbols ? st.symbols.flower : '동백꽃'}</div>
      <div>🕊️ <strong>시조:</strong> ${st.symbols ? st.symbols.bird : '갈매기'} &nbsp;|&nbsp; 🐟 <strong>시어:</strong> ${st.symbols ? st.symbols.fish : '고등어'}</div>
      <div>🐥 <strong>소통 캐릭터:</strong> ${st.symbols ? st.symbols.character : '부기'} &nbsp;|&nbsp; 🏛️ <strong>행정구역:</strong> ${st.districts_count || '16개 구·군'}</div>
    </div>
  `;
}

// 오늘의 시민 생활 (일일 임무 & 계급 모달)
function openCivicLifeModal() {
  updateCivicLifeUI();
  openModal('modal-civic-life');
}

function updateCivicLifeUI() {
  const data = window.BUSAN_OPEN_DATA || {};
  const ranks = data.civic_ranks || [];
  const missions = data.daily_missions || [];

  const curRank = ranks.find(r => r.level === STATE.playerLevel) || ranks[0] || { level: 1, title: '시민', badge: '🌱' };
  const nextRank = ranks.find(r => r.level === STATE.playerLevel + 1) || curRank;

  const titleEl = document.getElementById('civicLifeMyTitle');
  if (titleEl) titleEl.innerText = `Lv.${curRank.level} ${curRank.title}`;
  const badgeEl = document.getElementById('civicLifeMyBadge');
  if (badgeEl) badgeEl.innerText = curRank.badge || '🌱';

  const xpText = document.getElementById('civicLifeXpText');
  const xpBar = document.getElementById('civicLifeXpBar');
  const targetXp = nextRank.xp || 10000;
  if (xpText) xpText.innerText = `${STATE.playerExp || 20} / ${targetXp} XP`;
  if (xpBar) {
    const pct = Math.min(100, Math.floor(((STATE.playerExp || 20) / targetXp) * 100));
    xpBar.style.width = `${pct}%`;
  }

  // 일일 임무 렌더링
  let completedMissions = JSON.parse(localStorage.getItem('busan_done_missions') || '[]');
  const missionsEl = document.getElementById('dailyMissionsList');
  if (missionsEl) {
    missionsEl.innerHTML = missions.map(m => {
      const isDone = completedMissions.includes(m.id);
      return `
        <div class="mission-card ${isDone ? 'completed' : ''}">
          <div>
            <div style="font-size:13px; font-weight:800; color:#0f172a;">${m.title}</div>
            <div style="font-size:11.5px; color:#64748b;">${m.desc} (+${m.xp} XP / +${m.coin} 동백코인)</div>
          </div>
          <button class="mission-check-btn ${isDone ? 'done' : ''}" onclick="toggleDailyMission('${m.id}', ${m.xp})">
            ${isDone ? '완료됨 ✓' : '임무 완료'}
          </button>
        </div>
      `;
    }).join('');

    const progEl = document.getElementById('dailyMissionProgress');
    if (progEl) progEl.innerText = `${completedMissions.length}/${missions.length} 완료`;
  }

  // 20단계 계급 렌더링
  const ranksEl = document.getElementById('civicRanksList');
  if (ranksEl) {
    ranksEl.innerHTML = ranks.map(r => `
      <div class="rank-card-row ${r.level === STATE.playerLevel ? 'current' : ''}">
        <span style="font-size:20px;">${r.badge}</span>
        <div style="flex:1;">
          <div style="font-size:13px; font-weight:800;">Lv.${r.level} ${r.title}</div>
          <div style="font-size:11.5px; color:#64748b;">필요경험치: ${r.xp} XP | 보상: ${r.reward}</div>
        </div>
        ${r.level <= STATE.playerLevel ? '<span style="color:#16a34a; font-weight:800; font-size:12px;">달성 ✓</span>' : '<span style="color:#94a3b8; font-size:11px;">미달성</span>'}
      </div>
    `).join('');
  }
}

function toggleDailyMission(missionId, xp) {
  let completedMissions = JSON.parse(localStorage.getItem('busan_done_missions') || '[]');
  if (!completedMissions.includes(missionId)) {
    completedMissions.push(missionId);
    localStorage.setItem('busan_done_missions', JSON.stringify(completedMissions));
    awardCivicExp(xp, "일일 시민 임무 완료");
    if (window.busanAudio) window.busanAudio.playStampSound();
  }
  updateCivicLifeUI();
}

function awardCivicExp(amount, reason = "") {
  STATE.playerExp = (STATE.playerExp || 20) + amount;
  localStorage.setItem('busan_player_exp', STATE.playerExp);

  // 계급 승급 검사
  const data = window.BUSAN_OPEN_DATA || {};
  const ranks = data.civic_ranks || [];
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (STATE.playerExp >= ranks[i].xp && STATE.playerLevel < ranks[i].level) {
      STATE.playerLevel = ranks[i].level;
      STATE.playerTitle = ranks[i].title;
      localStorage.setItem('busan_player_level', STATE.playerLevel);
      localStorage.setItem('busan_player_title', STATE.playerTitle);
      showSpeechBubble(localPlayer, `🎉 축하합니다! [Lv.${STATE.playerLevel} ${STATE.playerTitle}] 계급으로 승급하셨습니다!`);
      if (window.busanAudio) window.busanAudio.playFanfare();
      break;
    }
  }

  updatePlayerBadgeUI();
  updateCivicLifeUI();
  if (localPlayer) {
    showSpeechBubble(localPlayer, `✨ +${amount} EXP 획득! (${reason})`);
  }
}

// 부산 시민 비전 선포 & 오색 희망 풍선 축제
function triggerHopeBalloonFestival() {
  if (window.busanAudio) window.busanAudio.playApplause();

  // 중앙 광장에서 40개의 오색 풍선 생성하여 하늘로 날리기
  const balloonColors = [0xef4444, 0x3b82f6, 0xf59e0b, 0x10b981, 0xec4899, 0x8b5cf6, 0x06b6d4];
  const balloonGeo = new THREE.SphereGeometry(0.55, 14, 14);

  for (let i = 0; i < 40; i++) {
    const col = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.3, metalness: 0.2 });
    const bMesh = new THREE.Mesh(balloonGeo, mat);

    const bx = (Math.random() - 0.5) * 28;
    const bz = 10 + (Math.random() - 0.5) * 28;
    bMesh.position.set(bx, 1.0 + Math.random() * 2, bz);

    // 풍선 꼬리 끈
    const strGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.6, 4);
    const strMesh = new THREE.Mesh(strGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    strMesh.position.y = -0.55;
    bMesh.add(strMesh);

    bMesh.userData = {
      vy: 0.04 + Math.random() * 0.05,
      driftX: (Math.random() - 0.5) * 0.02,
      phase: Math.random() * Math.PI * 2
    };

    scene.add(bMesh);
    activeHopeBalloons.push(bMesh);
  }

  awardCivicExp(100, "희망 풍선 축제 참여");
  showSpeechBubble(localPlayer, "🎈 부산 시민 희망의 풍선이 힘차게 날아오릅니다! 부산의 미래를 축복합니다!");

  if (STATE.ws && STATE.ws.readyState === WebSocket.OPEN) {
    STATE.ws.send(JSON.stringify({
      type: 'shout_podium',
      name: STATE.playerName,
      text: "🎈 희망 풍선 축제가 시작되었습니다! 함께 미래를 열어갑시다!"
    }));
  }
}


// ========================================================
// 20. 부산광역시 및 16개 구·군 공식 홈페이지 인기메뉴 & e-행정 포털 엔진 (v2.3)
// ========================================================
const POPULAR_HOMEPAGE_SERVICES = [
  {
    id: "pop-passport",
    category: "city_top10",
    district: "BUSAN-HQ",
    title: "여권 신청 및 야간 여권민원 사전예약",
    agency: "부산시청 2층 행복민원실",
    icon: "🛂",
    summary: "대한민국 전자여권 신규발급 및 갱신, 직장인을 위한 매주 목요일 야간(18:00~20:00) 발급 사전예약제 운영.",
    details: "준비물: 신분증, 6개월 이내 여권용 사진 1매, 수수료. 온라인 정부24 재발급 신청 시 방문 수령 1회로 단축 가능.",
    url: "https://www.busan.go.kr/minwon0202",
    hot: true
  },
  {
    id: "pop-minwon120",
    category: "city_top10",
    district: "BUSAN-HQ",
    title: "부산민원 120 바로콜센터 & 온라인 민원신청",
    agency: "부산광역시 통합민원과",
    icon: "📞",
    summary: "국번 없이 120 전화 한 통으로 부산시정, 구·군정, 교통, 세무, 상수도 모든 궁금증을 실시간 원스톱 상담 및 부서 연결.",
    details: "평일 08:30~18:30 전문상담원 운영, 야간 및 공휴일 당직실 긴급 연계. 온라인 부산민원120 포털 24시간 접수.",
    url: "https://www.busan.go.kr/minwon120",
    hot: true
  },
  {
    id: "pop-safety",
    category: "traffic_safety",
    district: "BUSAN-HQ",
    title: "안전신문고 (도로파손, 포트홀, 불법주정차 간편신고)",
    agency: "행정안전부 & 부산시 안전신문고",
    icon: "🚨",
    summary: "도로 포트홀, 불법주정차, 보도블록 파손, 신호등 고장 등 생활 속 위험 요소를 스마트폰 사진 2장으로 즉시 신고.",
    details: "신고 접수 즉시 관할 시·구청 담당 부서로 자동 이첩되어 처리 진행 상황 및 현장 정비 사진이 문자로 안내됩니다.",
    url: "https://www.safetyreport.go.kr",
    hot: true
  },
  {
    id: "pop-dongbaek",
    category: "welfare_youth",
    district: "BUSAN-HQ",
    title: "동백전 7% 캐시백 & 동백패스 4.5만원 대중교통 환급",
    agency: "부산시 소상공인지원과 / 교통정책과",
    icon: "💳",
    summary: "부산 지역화폐 동백전 월 충전금 결제 시 7% 즉시 캐시백, 대중교통 월 4만 5천원 초과금 최대 4만 5천원 환급(동백패스).",
    details: "하나/농협/부산은행 동백전 체크카드 및 앱 간편 발급. K-패스와 연계되어 전국 최고 수준의 교통비 절감 혜택 제공.",
    url: "https://dongbaekjeon.busan.go.kr",
    hot: true
  },
  {
    id: "pop-wetax",
    category: "city_top10",
    district: "BUSAN-HQ",
    title: "위택스 (지방세·자동차세·재산세 조회 및 납부)",
    agency: "부산광역시 세정과 / 위택스",
    icon: "💰",
    summary: "자동차세, 주민세, 재산세, 취득세 등 부산시 모든 지방세와 상하수도 요금을 간편인증으로 즉시 조회하고 전자 납부.",
    details: "1월 자동차세 연납 시 최대 5% 공제 혜택. 카드 포인트 납부 및 모바일 전자송달 신청 시 세액 공제 추가 적용.",
    url: "https://www.wetax.go.kr",
    hot: true
  },
  {
    id: "pop-young",
    category: "welfare_youth",
    district: "BUSAN-HQ",
    title: "부산청년플랫폼 (월세 20만원 지원 & 희망적금)",
    agency: "부산광역시 청년정책담당관",
    icon: "🏠",
    summary: "부산 거주 무주택 청년 월 최대 20만 원 월세 지원, 청년희망날개통장(매칭지원금), 청년 자격증 응시료 지원.",
    details: "만 19~39세 부산 거주 청년 대상, 소득 및 거주 기준 충족 시 온라인 간편 신청 및 바우처 즉시 지급.",
    url: "https://young.busan.go.kr",
    hot: true
  },
  {
    id: "pop-job",
    category: "welfare_youth",
    district: "BUSAN-HQ",
    title: "부산일자리정보망 (청년·중장년·시니어 취업매칭)",
    agency: "부산경제진흥원 / 일자리종합센터",
    icon: "💼",
    summary: "부산 지역 우수 중소·중견기업 구인정보, 공공기관 채용공고, 청년 맞춤형 AI 모의면접 및 취업 컨설팅 전액 무료.",
    details: "시청 1층 일자리종합센터 방문 시 1:1 전담 직업상담사 배정 및 이력서 클리닉, 취업장려금 연계 지원.",
    url: "https://www.busanjob.net",
    hot: true
  },
  {
    id: "pop-tour",
    category: "culture_tour",
    district: "BUSAN-HQ",
    title: "부산 문화관광 & 4대 메가 축제 일정 안내",
    agency: "부산광역시 관광마이스산업과",
    icon: "🌊",
    summary: "광안리 부산불꽃축제, 부산바다축제, 자갈치축제, 원아시아페스티벌(BOF) 등 사계절 글로벌 축제 일정 및 명소 안내.",
    details: "부산 시티투어버스 노선도, 태종대·해운대·기장 오션뷰 핫플레이스 및 맛집 코스 공식 가이드북 다운로드 제공.",
    url: "https://www.busan.go.kr/tour",
    hot: true
  },
  {
    id: "pop-bis",
    category: "traffic_safety",
    district: "BUSAN-HQ",
    title: "부산 실시간 버스도착정보 (BIS) & 도시철도 노선",
    agency: "부산광역시 버스운영과 / 교통정보센터",
    icon: "🚍",
    summary: "부산 시내버스, 마을버스, 광역환승 실시간 도착 예정 시간과 저상버스 운행 여부, 도시철도 1~4호선 환승 정보.",
    details: "초정밀 버스 실시간 GPS 위치 추적, 첫차·막차 시간표 및 정류소별 노선 검색 지원.",
    url: "https://bus.busan.go.kr",
    hot: false
  },
  {
    id: "pop-moonlight",
    category: "traffic_safety",
    district: "BUSAN-HQ",
    title: "달빛어린이병원 & 야간휴일 공공심야약국 안내",
    agency: "부산광역시 건강정책과",
    icon: "🏥",
    summary: "소아 경증 환자가 야간 및 공휴일에도 응급실 대신 신속하게 외래 진료를 받을 수 있는 부산 전역 달빛어린이병원 안내.",
    details: "연제구, 사하구, 기장군, 해운대구 등 권역별 야간 23시까지 운영 소아과 및 인근 처방조제 공공심야약국 목록.",
    url: "https://www.busan.go.kr/depart/hlthhospital",
    hot: true
  },
  {
    id: "pop-dist-haeundae",
    category: "district_civil",
    district: "DIST-HAEUNDAE",
    title: "해운대구: 해수욕장 스마트 비치 & 문화복합센터",
    agency: "해운대구청 관광문화과",
    icon: "🏖️",
    summary: "해운대 해수욕장 파라솔·물품 온라인 스마트 예약, 해운대 문화복합센터 대관, 블루라인파크 해변열차 관광 연계.",
    details: "해운대 구민 할인 혜택, 구포나루·동백섬 산책로 코스 및 센텀시티 영화의전당 행사 정보 제공.",
    url: "https://www.haeundae.go.kr",
    hot: true
  },
  {
    id: "pop-dist-busanjin",
    category: "district_civil",
    district: "DIST-BUSANJIN",
    title: "부산진구: 서면 젊음의거리 페스티벌 & 시민공원 예약",
    agency: "부산진구청 일자리경제과",
    icon: "🛍️",
    summary: "부산의 심장 서면 메디컬스트리트, 전포카페거리 축제, 부산시민공원 잔디광장 및 뽀로로 도서관 시설 예약.",
    details: "소상공인 골목상권 활성화 지원, 당감동 외식거리 및 부전마켓타운 전통시장 온누리상품권 사용처 안내.",
    url: "https://www.busanjin.go.kr",
    hot: true
  },
  {
    id: "pop-dist-suyeong",
    category: "culture_tour",
    district: "DIST-SUYEONG",
    title: "수영구: 광안리 M 드론라이트쇼 상설공연 관람안내",
    agency: "수영구청 스마트도시과",
    icon: "🌉",
    summary: "매주 토요일 밤 광안리 해변에서 펼쳐지는 2,000대 규모 세계 최고 수준의 M 드론라이트쇼 회차별 테마 및 명당 안내.",
    details: "광안리 해변 맨발 걷기 '슈퍼어싱' 힐링존, 민락수변공원 청정 힐링 문화광장 및 민락더마켓 복합문화공간 연계.",
    url: "https://www.suyeong.go.kr",
    hot: true
  },
  {
    id: "pop-dist-namgu",
    category: "culture_tour",
    district: "DIST-NAMGU",
    title: "남구: 세계 유일 UN평화문화특구 & 오륙도 스카이워크",
    agency: "남구청 문화관광체육과",
    icon: "🕊️",
    summary: "세계 유일의 UN기념공원 평화투어, 국립일제강제동원역사관, 동해와 남해가 만나는 오륙도 스카이워크 물때·개방시간.",
    details: "이기대 해안절벽 갈맷길 트레킹 코스, 대연동 원조 돼지국밥 골목 및 평화공원 국화축제 안내.",
    url: "https://www.bsnamgu.go.kr",
    hot: false
  },
  {
    id: "pop-dist-geumjeong",
    category: "culture_tour",
    district: "DIST-GEUMJEONG",
    title: "금정구: 천년고찰 범어사 문화탐방 & 금정산성 먹거리촌",
    agency: "금정구청 문화관광과",
    icon: "⛰️",
    summary: "금정산 국립공원 등산로 코스, 범어사 템플스테이 예약, 대한민국 1호 민속주 금정산성 막걸리 및 염소불고기 명소.",
    details: "온천천 물놀이장 구민 무료 이용, 금정문화회관 기획 공연 예매 및 부산대 젊음의 거리 버스킹 스케줄.",
    url: "https://www.geumjeong.go.kr",
    hot: false
  },
  {
    id: "pop-dist-saha",
    category: "culture_tour",
    district: "DIST-SAHA",
    title: "사하구: 다대포 꿈의 낙조분수 공연 & 감천문화마을",
    agency: "사하구청 문화예술과",
    icon: "🌅",
    summary: "세계 최대 바닥음악분수 다대포 꿈의 낙조분수 음악공연 시간표, 한국의 마추픽추 감천문화마을 골목투어 지도.",
    details: "장림포구 '부네치아' 포토존, 을숙도 국립청소년생태체험관 및 다대포 해변 일몰 서핑 강습 연계.",
    url: "https://www.saha.go.kr",
    hot: true
  },
  {
    id: "pop-dist-bukgu",
    category: "district_civil",
    district: "DIST-BUKGU",
    title: "북구: 낙동강 구포나루 축제 & 화명생태공원 튤립단지",
    agency: "북구청 문화관광과",
    icon: "🚂",
    summary: "영남 3대 장터 구포국수 체험관, 낙동강 구포나루 축제, 화명생태공원 야외수영장 및 연꽃·튤립 대단지 축제.",
    details: "구포시장 장날(3일·8일) 먹거리 안내, 북구 평생학습관 무료 강좌 신청 및 화명기차역 야외 쉼터 연계.",
    url: "https://www.bsbukgu.go.kr",
    hot: false
  },
  {
    id: "pop-dist-yeongdo",
    category: "culture_tour",
    district: "DIST-YEONGDO",
    title: "영도구: 흰여울문화마을 해안산책로 & 태종대 다누비",
    agency: "영도구청 문화관광과",
    icon: "🏝️",
    summary: "바다 절벽 위 영화 변호인 촬영지 흰여울문화마을, 태종대 순환 다누비열차 예매, 대형 복합문화공간 피아크(P.ARK).",
    details: "깡깡이예술마을 유람선 체험, 국립해양박물관 4D 영상관 무료 관람 및 영도 봉래산 조내기고구마 역사관.",
    url: "https://www.yeongdo.go.kr",
    hot: true
  },
  {
    id: "pop-dist-dongnae",
    category: "district_civil",
    district: "DIST-DONGNAE",
    title: "동래구: 동래온천 스파 & 동래읍성 역사축제",
    agency: "동래구청 문화관광과",
    icon: "🌸",
    summary: "삼국시대부터 이어진 대한민국 대표 동래온천 노천 족욕체험장 무료 개방, 동래읍성 역사축제 줄다리기 재현.",
    details: "동래파전 명가 전통거리 지도, 온천천 카페거리 및 복천동 고분군 야외 박물관 해설 예약.",
    url: "https://www.dongnae.go.kr",
    hot: false
  },
  {
    id: "pop-dist-sasang",
    category: "district_civil",
    district: "DIST-SASANG",
    title: "사상구: 삼락생태공원 벚꽃축제 & 사상인디스페이스",
    agency: "사상구청 문화체육과",
    icon: "🌾",
    summary: "전국 최장 벚꽃터널 삼락생태공원 오토캠핑장 예약, 부산 삼락 락페스티벌, 사상인디스페이스 청년 예술 공연.",
    details: "괘법동 르네시떼 패션타운, 부산서부시외버스터미널 환승 및 사상스마트시티 재생사업 홍보관 안내.",
    url: "https://www.sasang.go.kr",
    hot: false
  },
  {
    id: "pop-dist-gangseo",
    category: "district_civil",
    district: "DIST-GANGSEO",
    title: "강서구: 가덕신공항 배후도시 & 대저생태공원 유채꽃",
    agency: "강서구청 미래전략과",
    icon: "✈️",
    summary: "가덕도신공항 건설 현황, 명지국제신도시 및 에코델타시티 스마트빌리지 분양, 대저생태공원 전국 최대 유채꽃 축제.",
    details: "낙동강 하구 을숙도 에코센터 철새도래지 탐조 프로그램, 둔치도 청년 농업 스마트팜 체험 안내.",
    url: "https://www.bsgangseo.go.kr",
    hot: false
  },
  {
    id: "pop-dist-gijang",
    category: "culture_tour",
    district: "DIST-GIJANG",
    title: "기장군: 오시리아 롯데월드 & 기장 미역·멸치 축제",
    agency: "기장군청 문화관광과",
    icon: "🌊",
    summary: "오시리아 관광단지 롯데월드 부산·스카이라인 루지·이케아, 해동용궁사 바다법당, 기장 대변항 멸치축제.",
    details: "칠암 아나고(붕장어) 구이거리, 웨이브온 등 기장 해안가 명품 오션뷰 카페거리 공식 투어맵.",
    url: "https://www.gijang.go.kr",
    hot: true
  },
  {
    id: "pop-dist-junggu",
    category: "culture_tour",
    district: "DIST-JUNGGU",
    title: "중구: 자갈치시장 활어 수산물 & 남포동 BIFF광장",
    agency: "중구청 경제진흥과",
    icon: "🐟",
    summary: "'오이소! 보이소! 사이소!' 자갈치시장 라이브, 남포동 BIFF광장 씨앗호떡, 용두산공원 부산타워 전망대 할인.",
    details: "보수동 책방골목 북살롱 투어, 국제시장 609청년몰, 40계단 문화관광특구 역사기행 프로그램.",
    url: "https://www.bsjunggu.go.kr",
    hot: true
  },
  {
    id: "pop-dist-seogu",
    category: "culture_tour",
    district: "DIST-SEOGU",
    title: "서구: 송도해수욕장 해상케이블카 & 용궁구름다리",
    agency: "서구청 문화관광과",
    icon: "🚠",
    summary: "대한민국 1호 공설해수욕장 송도해상케이블카 에어크루즈 온라인 예매, 바다 위를 걷는 송도 용궁구름다리.",
    details: "암남공원 해안 볼레길 트레킹, 송도 스카이워크 포토존 및 부산공동어시장 고등어 축제 안내.",
    url: "https://www.bsseogu.go.kr",
    hot: false
  },
  {
    id: "pop-dist-donggu",
    category: "district_civil",
    district: "DIST-DONGGU",
    title: "동구: 초량 차이나타운특구 & 168계단 모노레일",
    agency: "동구청 일자리경제과",
    icon: "🏮",
    summary: "부산역 맞은편 초량 차이나타운 축제 만두거리, 산복도로 명물 168계단 친환경 모노레일 무료 탑승.",
    details: "초량 불백(불고기백반) 테마거리, 명란로드 이바구공작소, 북항 친환경 수변공원 연결 보행교 개통 안내.",
    url: "https://www.bsdonggu.go.kr",
    hot: false
  },
  {
    id: "pop-dist-yeonje",
    category: "district_civil",
    district: "DIST-YEONJE",
    title: "연제구: 부산시청 행정타운 & 온천천 시민공원",
    agency: "연제구청 총무과 / 문화체육과",
    icon: "🏛️",
    summary: "부산광역시청, 시의회, 경찰청, 법원·검찰청 행정타운 원스톱 안내, 사계절 꽃이 피는 온천천 시민공원 벚꽃길.",
    details: "연산동 고분군 가야역사 탐방로, 거제리 전통시장 온누리상품권 장보기 및 구민 무료 자전거 대여소 운영.",
    url: "https://www.yeonje.go.kr",
    hot: true
  }
];

let currentPopularFilter = 'all';
let currentPopularKeyword = '';

function openPopularMenusModal(category = 'all') {
  currentPopularFilter = category;
  currentPopularKeyword = '';
  const searchInput = document.getElementById('popular-search-input');
  if (searchInput) searchInput.value = '';

  // 탭 활성화 상태 동기화
  const pills = document.querySelectorAll('.popular-pill-btn');
  pills.forEach(p => {
    p.classList.remove('active');
    if (category === 'all' && p.textContent.includes('전체')) p.classList.add('active');
    else if (category === 'city_top10' && p.textContent.includes('부산시')) p.classList.add('active');
    else if (category === 'district_civil' && p.textContent.includes('16개')) p.classList.add('active');
    else if (category === 'culture_tour' && p.textContent.includes('문화')) p.classList.add('active');
    else if (category === 'welfare_youth' && p.textContent.includes('복지')) p.classList.add('active');
    else if (category === 'traffic_safety' && p.textContent.includes('교통')) p.classList.add('active');
  });

  renderPopularMenus();
  openModal('modal-popular-menus');
}

function filterPopularMenus(category, btnEl) {
  currentPopularFilter = category;
  if (btnEl) {
    document.querySelectorAll('.popular-pill-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  renderPopularMenus();
}

function searchPopularMenus(keyword) {
  currentPopularKeyword = (keyword || '').trim().toLowerCase();
  renderPopularMenus();
}

function renderPopularMenus() {
  const grid = document.getElementById('popular-menus-grid');
  if (!grid) return;

  let filtered = POPULAR_HOMEPAGE_SERVICES.filter(item => {
    // 1. 카테고리 필터
    if (currentPopularFilter !== 'all' && item.category !== currentPopularFilter) {
      return false;
    }
    // 2. 검색어 필터
    if (currentPopularKeyword) {
      const matchTitle = item.title.toLowerCase().includes(currentPopularKeyword);
      const matchAgency = item.agency.toLowerCase().includes(currentPopularKeyword);
      const matchSummary = item.summary.toLowerCase().includes(currentPopularKeyword);
      const matchDetails = item.details.toLowerCase().includes(currentPopularKeyword);
      if (!matchTitle && !matchAgency && !matchSummary && !matchDetails) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: #64748b;">
        <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
        <div style="font-weight: 700; font-size: 15px; color: #334155;">일치하는 인기 행정서비스가 없습니다.</div>
        <div style="font-size: 12px; margin-top: 4px;">다른 검색어나 '전체보기'를 눌러 확인해 보세요.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="popular-menu-card">
      <div>
        <div class="popular-card-header">
          <div class="popular-card-icon">${item.icon}</div>
          <div style="flex:1;">
            <div class="popular-card-title">${escapeHtml(item.title)}</div>
            <div class="popular-card-agency">${escapeHtml(item.agency)}</div>
          </div>
          ${item.hot ? '<span style="background:#fee2e2; color:#ef4444; font-size:10.5px; font-weight:800; padding:2px 7px; border-radius:12px; border:1px solid #fca5a5;">HOT</span>' : ''}
        </div>
        <div class="popular-card-summary">${escapeHtml(item.summary)}</div>
        <div style="font-size:11px; color:#64748b; background:#f8fafc; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0; line-height:1.45;">
          💡 <strong>핵심 안내:</strong> ${escapeHtml(item.details)}
        </div>
      </div>
      <div class="popular-card-actions">
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="popular-action-btn primary" title="공식 포털 바로가기">
          공식 바로가기 ↗
        </a>
        <button class="popular-action-btn secondary" onclick="askAiQuestion('${escapeHtml(item.title)} 신청 방법과 담당부서 알려줘')" title="AI 다온에게 질문">
          🤖 AI 질문
        </button>
      </div>
    </div>
  `).join('');
}




// ========================================================
// [그래픽 환경 고도화 1] 시민광장 유럽풍 화강석 산책로 & 조경 & 테라스 카페
// ========================================================
function buildEnhancedPlazaLandscaping() {
  const group = new THREE.Group();

  // (1) 중앙 진입 산책로 화강석 패턴 테두리
  const walkwayGeo = new THREE.PlaneGeometry(14, 52);
  const walkwayMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.plaza,
    roughness: 0.32,
    metalness: 0.1
  });
  const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
  walkway.rotation.x = -Math.PI / 2;
  walkway.position.set(0, 0.02, 28);
  walkway.receiveShadow = true;
  group.add(walkway);

  // (2) 12개 대형 화강석 조경 화단 & 만개한 3D 동백꽃 수풀
  const shrubGeo = new THREE.SphereGeometry(0.9, 8, 8);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.7 });
  const flowerGeo = new THREE.SphereGeometry(0.18, 6, 6);
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3 });

  [-9, 9].forEach(sx => {
    for (let sz = 12; sz <= 48; sz += 9) {
      // 화단 화강석 턱
      const curb = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.28, 2.4), new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.4 }));
      curb.position.set(sx, 0.14, sz);
      curb.castShadow = true;
      group.add(curb);

      // 초록 수풀
      const shrub = new THREE.Mesh(shrubGeo, leafMat);
      shrub.position.set(sx, 0.85, sz);
      shrub.scale.set(1.1, 0.8, 1.1);
      shrub.castShadow = true;
      group.add(shrub);

      // 붉은 동백꽃 송이들
      for (let fi = 0; fi < 5; fi++) {
        const flower = new THREE.Mesh(flowerGeo, flowerMat);
        const fa = (fi / 5) * Math.PI * 2;
        flower.position.set(sx + Math.cos(fa) * 0.75, 0.95 + (fi % 2) * 0.2, sz + Math.sin(fa) * 0.75);
        group.add(flower);
      }
    }
  });

  // (3) 광장 공원 벤치 (티크 원목 & 주철 프레임) 6세트
  const benchWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.45 });
  const benchIronMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });

  [[-13, 18], [13, 18], [-13, 34], [13, 34], [-13, 48], [13, 48]].forEach(([bx, bz]) => {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.7), benchWoodMat);
    seat.position.set(bx, 0.48, bz);
    seat.castShadow = true;
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.08), benchWoodMat);
    back.position.set(bx, 0.78, bz - 0.32);
    group.add(back);

    [-1.0, 1.0].forEach(lx => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.46, 0.65), benchIronMat);
      leg.position.set(bx + lx, 0.23, bz);
      leg.castShadow = true;
      group.add(leg);
    });
  });

  // (4) 부산광역시청 상징 깃대 (태극기 & 부산시정기)
  const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 12, 12);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });

  [-5.5, 5.5].forEach((px, idx) => {
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(px, 6.0, 8.0);
    pole.castShadow = true;
    group.add(pole);

    // 펄럭이는 깃발 (태극기 / 시정기)
    const flagGeo = new THREE.PlaneGeometry(2.4, 1.6);
    const flagMat = new THREE.MeshStandardMaterial({
      color: idx === 0 ? 0xffffff : 0x0284c7,
      side: THREE.DoubleSide,
      roughness: 0.5
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(px + 1.25, 10.8, 8.0);
    group.add(flag);
  });

  // (5) 광장 야외 테라스 카페 파빌리온 & 파라솔 테이블
  const cafeGroup = new THREE.Group();
  cafeGroup.position.set(26, 0, 44);

  // 우드 데크 바닥
  const deck = new THREE.Mesh(new THREE.BoxGeometry(14, 0.22, 10), new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5 }));
  deck.position.y = 0.11;
  deck.receiveShadow = true;
  cafeGroup.add(deck);

  // 글래스 카페 카운터
  const cafeBar = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.15, 1.4), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }));
  cafeBar.position.set(0, 0.68, -3.2);
  cafeGroup.add(cafeBar);

  createSignBoard(0, 1.9, -3.2, "시민광장 동백카페 ☕", 0x0284c7, cafeGroup);

  // 파라솔 테이블 2세트
  [-3.8, 3.8].forEach(tx => {
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.06, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
    table.position.set(tx, 0.8, 1.2);
    cafeGroup.add(table);

    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), poleMat);
    leg.position.set(tx, 0.4, 1.2);
    cafeGroup.add(leg);

    // 차양 파라솔
    const umbrella = new THREE.Mesh(new THREE.ConeGeometry(1.8, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 }));
    umbrella.position.set(tx, 2.4, 1.2);
    cafeGroup.add(umbrella);
  });

  group.add(cafeGroup);

  cityHallWorldGroup.add(group);
}

// ========================================================
// [그래픽 환경 고도화 2] 1층 로비 인터랙티브 미디어아트 월 & 네온 LED 연출
// ========================================================
function buildEnhancedLobbyArt() {
  const group = new THREE.Group();

  // (1) 1층 들락날락 대형 사이버 오션 & 동백꽃 LED 미디어아트 월 (폭 24m x 높이 6.5m)
  const mediaWallGeo = new THREE.PlaneGeometry(24, 6.5);
  const mediaCanvas = document.createElement('canvas');
  mediaCanvas.width = 1024;
  mediaCanvas.height = 256;
  const mCtx = mediaCanvas.getContext('2d');

  // 감각적인 사이버 웨이브 & 동백꽃 그라데이션
  const mGrad = mCtx.createLinearGradient(0, 0, 1024, 256);
  mGrad.addColorStop(0, '#0284c7');
  mGrad.addColorStop(0.35, '#38bdf8');
  mGrad.addColorStop(0.7, '#e11d48');
  mGrad.addColorStop(1, '#0f172a');
  mCtx.fillStyle = mGrad;
  mCtx.fillRect(0, 0, 1024, 256);

  mCtx.fillStyle = '#ffffff';
  mCtx.font = 'bold 36px "Noto Sans KR", sans-serif';
  mCtx.fillText('🌊 BUSAN DIGITAL MEDIA ART · 들락날락 어린이복합문화공간', 40, 90);
  mCtx.font = '22px "Noto Sans KR", sans-serif';
  mCtx.fillStyle = 'rgba(255,255,255,0.85)';
  mCtx.fillText('시민과 함께하는 글로벌 해양스마트도시 부산 · 인터랙티브 미디어 체험존', 40, 145);

  const mediaTex = new THREE.CanvasTexture(mediaCanvas);
  const mediaMat = new THREE.MeshBasicMaterial({ map: mediaTex });
  const mediaWall = new THREE.Mesh(mediaWallGeo, mediaMat);
  mediaWall.position.set(0, 3.8, -48.8);
  group.add(mediaWall);

  // 미디어월 프레임 메탈 테두리
  const frameGeo = new THREE.BoxGeometry(24.4, 6.8, 0.15);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 3.8, -48.9);
  group.add(frame);

  // 은은한 네온 블루 엠비언트 라이트
  const mediaLight = new THREE.PointLight(0x38bdf8, 2.2, 28, 1.5);
  mediaLight.position.set(0, 4.0, -42);
  group.add(mediaLight);

  cityHallWorldGroup.add(group);
}

// ========================================================
// [그래픽 환경 고도화 3] 2층 행복민원실 아크릴 가림막 & LED 전광판
// ========================================================
function buildEnhancedCivilHall() {
  const group = new THREE.Group();

  // (1) 2층 민원 창구 아크릴 가림막 & 창구별 네온 블루 번호판
  for (let i = 0; i < 8; i++) {
    const cx = -32 + i * 3.4;
    // 투명 아크릴 안전 가림막
    const shieldGeo = new THREE.BoxGeometry(2.8, 0.9, 0.04);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.set(cx, 6.2, -60.8);
    group.add(shield);

    // 상단 네온 LED 번호판
    const ledNumGeo = new THREE.BoxGeometry(0.9, 0.32, 0.08);
    const ledNumMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ledNum = new THREE.Mesh(ledNumGeo, ledNumMat);
    ledNum.position.set(cx, 7.15, -60.8);
    group.add(ledNum);
  }

  // (2) 실시간 순번 대기 종합 전광판
  const displayGeo = new THREE.BoxGeometry(8.5, 1.8, 0.2);
  const displayMat = new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.8 });
  const display = new THREE.Mesh(displayGeo, displayMat);
  display.position.set(-20, 8.2, -54);
  group.add(display);

  const screenGeo = new THREE.PlaneGeometry(8.2, 1.5);
  const dispCanvas = document.createElement('canvas');
  dispCanvas.width = 512;
  dispCanvas.height = 128;
  const dCtx = dispCanvas.getContext('2d');
  dCtx.fillStyle = '#020617';
  dCtx.fillRect(0, 0, 512, 128);
  dCtx.fillStyle = '#38bdf8';
  dCtx.font = 'bold 24px monospace';
  dCtx.fillText('★ 2층 행복민원실 실시간 대기 현황 ★', 30, 42);
  dCtx.fillStyle = '#22c55e';
  dCtx.font = 'bold 32px monospace';
  dCtx.fillText('호출번호 [104번]  대기인수: 2명', 45, 95);

  const dispTex = new THREE.CanvasTexture(dispCanvas);
  const dispScreen = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: dispTex }));
  dispScreen.position.set(-20, 8.2, -53.88);
  group.add(dispScreen);

  cityHallWorldGroup.add(group);
}


function updateQuickRealmButton(currentRealm) {
  const btn = document.getElementById('quick-realm-toggle-btn');
  if (!btn) return;
  if (currentRealm === 'BUSAN-HQ') {
    btn.innerHTML = '🏛️ 시청 민원실 바로가기';
    btn.title = '2층 종합행복민원실로 바로 이동합니다';
    btn.style.background = 'linear-gradient(135deg, #0284c7, #0369a1)';
  } else if (currentRealm === 'BUSAN-CIVIL') {
    btn.innerHTML = '🌳 야외 시민광장 나가기';
    btn.title = '시청 앞 푸른 야외 시민광장으로 나갑니다';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  } else {
    btn.innerHTML = '🏢 시청 본관 광장 복귀';
    btn.title = '부산광역시청 본청 야외광장으로 복귀합니다';
    btn.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
  }
}

function toggleCityHallOrCivil() {
  if (STATE.currentRoom === 'BUSAN-HQ') {
    switchRealm('BUSAN-CIVIL');
  } else {
    switchRealm('BUSAN-HQ');
  }
}
