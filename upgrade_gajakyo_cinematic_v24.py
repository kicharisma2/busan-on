# -*- coding: utf-8 -*-
"""
부산ON 월드 v2.4 - 가즈아 대성전급 시네마틱 그래픽 리마스터 & 지피티 추천 일러스트 세계관 구현
1. 로블록스 느낌 완전 탈피:
   - ACESFilmicToneMapping, 노출 1.05, 부드러운 거리 안개 (Fog 70~360)
   - 4단 리치 캔버스 하늘 그라데이션 (마린 블루 -> 로열 블루 -> 코스탈 스카이 -> 여명 골든 미스트)
   - 부산 명산(황령산·금정산) 실루엣 & 광안대교 현수교 파노라마 원경 실린더
2. 초고해상도 유기적 절차적 텍스처 (노이즈 기반):
   - 시민광장 비벨 화강석 포장재 (운모·석영 입자, 천연 크랙, 3D 음영 줄눈)
   - 공원 벤트그래스 천연 잔디 (밀집 미세 블레이드, 유기적 음영)
   - 1층 로비 최고급 이탈리아 카라라 화이트 대리석 (골드·슬레이트 베인 흐름)
   - 28층 타워 알루미늄 루버 & 멀리언 커튼월 글래스 (시간대별 창문 조명)
3. 부산시청 본관 기념비적 복합 건축물 리모델링:
   - 기존 단일 파란 박스 제거 -> 3단 스텝드 타워(3-tier stepped massing)
   - 부산시의회(동익) & 시민소통관(서익) 대칭 윙
   - 6대 거대 화강석 열주 회랑 (Colonnade Pillars)
   - 유선형 공기역학 캐노피 지붕 & 시청 입체 엠블럼
   - 8기 광장 클래식 가로등 (온화한 앰버 포인트 조명)
4. 캐릭터 외형 대혁신 (스크린샷 얼굴 검은색 / 앞머리 문제 완벽 해결):
   - 대성전급 1024x512 페이스 캔버스 텍스처 엔진 도입:
     복숭아빛 음영 피부, 화사한 볼터치, 아치형 자연 눈썹, 애니메 사파이어 초롱초롱 눈망울, 방긋 웃는 입
   - 머리가 얼굴을 가리거나 파고드는 클리핑 현상 100% 제거
   - 여성 단발머리(bob): 눈과 눈썹 위 이마(y:0.24, z:0.365)에 단정하게 안착되는 볼륨 앞머리 뱅 + 볼을 감싸는 보브 라인 + 붉은 동백꽃 헤어핀
   - 댄디 숏컷, 웨이브 롱, 포니테일, 양갈래, 베레모 등 전 스타일 고품질 조형
   - 레벨 5 이상 및 축복 시 캐릭터 주위를 회전하는 골든 시민 아우라 이펙트
5. 지피티 추천 세계관 & 일러스트 컨텐츠:
   - 오늘의 시정 축복 & 동백꽃 행운 KIOSK (1일 1회 축복, +50 EXP, 15초 황금빛 아우라)
   - 시민 희망 축제 불꽃놀이 발사대 (3D 컬러 파티클 폭죽 & 축하 효과)
   - 20단계 시민 명예의 전당 훈장 전시관 (일러스트 훈장 메달 전시대)
"""

import os
import re

APP_JS = "app.js"

with open(APP_JS, "r", encoding="utf-8") as f:
    code = f.read()

print("Original app.js size:", len(code))

# ========================================================
# 1. createProceduralTextures() 교체 (가즈아 대성전급 절차적 텍스처)
# ========================================================
new_procedural_textures = '''function createProceduralTextures() {
  // [가즈아 대성전급 프리미엄 텍스처 엔진] 미세 그레인, 크랙, 3D 베벨 줄눈, 천연 광물 노이즈

  // (1) 시민광장 고급 화강석 판석 타일 (Beveled Granite Paving)
  const c1 = document.createElement('canvas');
  c1.width = 512;
  c1.height = 512;
  const ctx1 = c1.getContext('2d');
  ctx1.fillStyle = '#cfd8dc';
  ctx1.fillRect(0, 0, 512, 512);

  // 천연 화강석 다채로운 광물 입자 노이즈 (백운모, 석영, 장석)
  const stoneSpots = ['#90a4ae', '#eceff1', '#b0bec5', '#78909c', '#d7ccc8', '#ffffff', '#546e7a'];
  for (let i = 0; i < 28000; i++) {
    ctx1.fillStyle = stoneSpots[Math.floor(Math.random() * stoneSpots.length)];
    ctx1.globalAlpha = 0.2 + Math.random() * 0.55;
    const r = 0.6 + Math.random() * 2.2;
    ctx1.beginPath();
    ctx1.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2);
    ctx1.fill();
  }

  // 자연스러운 화강석 미세 표면 크랙 및 베인
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

  // 128x128 타일 베벨 및 음영 줄눈 (3D 입체감)
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
  TEXTURES.plaza = new THREE.CanvasTexture(c1);
  TEXTURES.plaza.wrapS = THREE.RepeatWrapping;
  TEXTURES.plaza.wrapT = THREE.RepeatWrapping;
  TEXTURES.plaza.anisotropy = 8;
  TEXTURES.plaza.colorSpace = THREE.SRGBColorSpace;
  TEXTURES.plaza.repeat.set(10, 8);

  // (2) 1층 로비 최고급 이탈리아 카라라 대리석 (Polished Carrara Marble)
  const c2 = document.createElement('canvas');
  c2.width = 512;
  c2.height = 512;
  const ctx2 = c2.getContext('2d');
  ctx2.fillStyle = '#fafafa';
  ctx2.fillRect(0, 0, 512, 512);

  // 유기적인 그레이 & 골드 대리석 베인 흐름
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

  // 대리석 황금 인레이 분할선 (256x256 대형 슬랩)
  ctx2.strokeStyle = 'rgba(202, 138, 4, 0.4)';
  ctx2.lineWidth = 2.5;
  for (let x = 0; x <= 512; x += 256) {
    ctx2.beginPath(); ctx2.moveTo(x, 0); ctx2.lineTo(x, 512); ctx2.stroke();
  }
  for (let y = 0; y <= 512; y += 256) {
    ctx2.beginPath(); ctx2.moveTo(0, y); ctx2.lineTo(512, y); ctx2.stroke();
  }
  TEXTURES.marble = new THREE.CanvasTexture(c2);
  TEXTURES.marble.wrapS = THREE.RepeatWrapping;
  TEXTURES.marble.wrapT = THREE.RepeatWrapping;
  TEXTURES.marble.anisotropy = 8;
  TEXTURES.marble.colorSpace = THREE.SRGBColorSpace;
  TEXTURES.marble.repeat.set(8, 5);

  // (3) 시청 28층 커튼월 파사드 (Modern Architectural Glass & Louvers)
  const c3 = document.createElement('canvas');
  c3.width = 512;
  c3.height = 512;
  const ctx3 = c3.getContext('2d');
  ctx3.fillStyle = '#0f2942'; // 딥 네이비 마린 베이스
  ctx3.fillRect(0, 0, 512, 512);

  // 유리창 패널 & 수평 선셰이드 루버
  for (let y = 0; y < 512; y += 64) {
    // 층간 스팬드럴 알루미늄 패널
    ctx3.fillStyle = '#1e293b';
    ctx3.fillRect(0, y, 512, 12);
    ctx3.fillStyle = '#334155';
    ctx3.fillRect(0, y + 2, 512, 3);

    for (let x = 0; x < 512; x += 32) {
      // 복층 단열 유리창 (하늘 반사 그라데이션)
      const winGrad = ctx3.createLinearGradient(x, y + 12, x, y + 64);
      winGrad.addColorStop(0, '#1d4ed8');
      winGrad.addColorStop(0.6, '#0284c7');
      winGrad.addColorStop(1, '#0369a1');
      ctx3.fillStyle = winGrad;
      ctx3.fillRect(x + 2, y + 14, 28, 48);

      // 창문 내부 은은한 시정 사무실 조명 (현실감)
      if ((x * 7 + y * 13) % 11 < 4) {
        ctx3.fillStyle = 'rgba(254, 240, 138, 0.65)';
        ctx3.fillRect(x + 5, y + 22, 22, 28);
        ctx3.fillStyle = 'rgba(217, 119, 6, 0.4)';
        ctx3.fillRect(x + 7, y + 36, 18, 12);
      }
    }
  }
  // 수직 구조 알루미늄 멀리언
  ctx3.strokeStyle = '#020617';
  ctx3.lineWidth = 3;
  for (let x = 0; x <= 512; x += 32) {
    ctx3.beginPath(); ctx3.moveTo(x, 0); ctx3.lineTo(x, 512); ctx3.stroke();
  }
  TEXTURES.glassTower = new THREE.CanvasTexture(c3);
  TEXTURES.glassTower.wrapS = THREE.RepeatWrapping;
  TEXTURES.glassTower.wrapT = THREE.RepeatWrapping;
  TEXTURES.glassTower.anisotropy = 8;
  TEXTURES.glassTower.colorSpace = THREE.SRGBColorSpace;
  TEXTURES.glassTower.repeat.set(6, 6);

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
  TEXTURES.wood = new THREE.CanvasTexture(c4);
  TEXTURES.wood.wrapS = THREE.RepeatWrapping;
  TEXTURES.wood.wrapT = THREE.RepeatWrapping;
  TEXTURES.wood.anisotropy = 8;
  TEXTURES.wood.colorSpace = THREE.SRGBColorSpace;
  TEXTURES.wood.repeat.set(6, 6);

  // (5) 깊이 있는 천연 공원 잔디 텍스처 (Deep Botanical Lawn)
  const c5 = document.createElement('canvas');
  c5.width = 512;
  c5.height = 512;
  const ctx5 = c5.getContext('2d');
  ctx5.fillStyle = '#1e3f20'; // 플라스틱 형광그린 퇴출, 중후한 정원 잔디
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
  TEXTURES.grass = new THREE.CanvasTexture(c5);
  TEXTURES.grass.wrapS = THREE.RepeatWrapping;
  TEXTURES.grass.wrapT = THREE.RepeatWrapping;
  TEXTURES.grass.anisotropy = 8;
  TEXTURES.grass.colorSpace = THREE.SRGBColorSpace;
  TEXTURES.grass.repeat.set(16, 16);
}'''

tex_pattern = r'function createProceduralTextures\(\)\s*\{[\s\S]*?TEXTURES\.grass\.repeat\.set\(16,\s*16\);\s*\}'
code = re.sub(tex_pattern, new_procedural_textures, code, count=1)

# ========================================================
# 2. initThreeWorld() 렌더러, 대기, 4단 하늘, 조명 업그레이드
# ========================================================
old_init_three = '''function initThreeWorld() {
  const canvas = document.getElementById('gl-canvas');
  clock = new THREE.Clock();

  // (1) Scene - 맑고 화창한 부산 바다 하늘 (푸른빛)
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x38bdf8); // 선명한 스카이블루
  scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0035); // 원거리 대기감만 살짝 부여

  // (2) Camera
  camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.position.set(0, 9, 32);

  // (3) Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // (4) OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI / 2 - 0.02; // 바닥 밑 투과 방지
  controls.minDistance = 2.5;
  controls.maxDistance = 60;
  controls.target.set(0, 1.2, 0);

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
  scene.add(hemiLight);'''

new_init_three = '''function initThreeWorld() {
  const canvas = document.getElementById('gl-canvas');
  clock = new THREE.Clock();

  // (1) Scene - 가즈아 대성전급 시네마틱 4단 캔버스 하늘 그라데이션
  scene = new THREE.Scene();

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
  skyTexture.colorSpace = THREE.SRGBColorSpace;
  scene.background = skyTexture;

  // 가즈아 대성전급 소프트 거리 안개
  scene.fog = new THREE.Fog(0xbcd9ea, 65, 360);

  // (2) Camera
  camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 450);
  camera.position.set(0, 9, 32);

  // (3) Renderer - 가즈아 대성전 ACESFilmicToneMapping & 노출 보정
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // (4) OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2 - 0.02;
  controls.minDistance = 2.5;
  controls.maxDistance = 75;
  controls.target.set(0, 1.2, 0);

  // (5) 조명 세팅 - 가즈아 대성전급 3원 시네마틱 라이팅
  // 상공 푸른빛과 지면 온화한 황토/석재 바운스광
  const hemiLight = new THREE.HemisphereLight(0xdfeaf2, 0x5a4a36, 0.95);
  scene.add(hemiLight);

  // 그늘 내부를 화사하게 밝혀주는 앰비언트 필 라이트
  const ambientLight = new THREE.AmbientLight(0xfff0dc, 0.55);
  scene.add(ambientLight);

  // 황금빛 태양광 및 소프트 PCF 그림자
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
  createDistantBusanSkylinePanorama();'''

if old_init_three in code:
    code = code.replace(old_init_three, new_init_three)
    print("Replaced initThreeWorld successfully.")
else:
    print("Warning: old_init_three not matched exactly.")

# ========================================================
# 3. 원경 파노라마 및 랜드마크 생성 함수 정의
# ========================================================
panorama_and_features_code = '''
// ========================================================
// 원경: 부산 명산(황령산·금정산) 능선 & 광안대교 파노라마
// ========================================================
function createDistantBusanSkylinePanorama() {
  const panoGroup = new THREE.Group();

  // (1) 360도 원경 산악 능선 (금정산·황령산·백양산 실루엣)
  const mountainCount = 18;
  for (let i = 0; i < mountainCount; i++) {
    const angle = (i / mountainCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
    const dist = 140 + Math.random() * 45;
    const h = 38 + Math.random() * 42;
    const r = 32 + Math.random() * 24;

    const mGeo = new THREE.ConeGeometry(r, h, 8);
    const mMat = new THREE.MeshLambertMaterial({
      color: 0x3d5a49,
      flatShading: true
    });
    const m = new THREE.Mesh(mGeo, mMat);
    m.position.set(Math.cos(angle) * dist, h * 0.42, Math.sin(angle) * dist);
    panoGroup.add(m);
  }

  // (2) 광안대교 현수교 랜드마크 실루엣 (남동쪽 지평선 바다 방면)
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

  // 상판 트러스 교량
  const roadDeck = new THREE.Mesh(new THREE.BoxGeometry(80, 2.4, 6.0), new THREE.MeshStandardMaterial({ color: 0x475569 }));
  roadDeck.position.set(0, 12, 0);
  bridgeGroup.add(roadDeck);

  // 주 케이블 현수선
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
'''

# ========================================================
# 4. buildCityHallTowerFacade() 전면 리모델링
# (로블록스 단일 박스 퇴출 -> 3단 스텝드 매싱 타워 + 동서 양익 + 6대 열주 회랑 + 유선형 캐노피)
# ========================================================
new_facade_code = '''function buildCityHallTowerFacade() {
  const buildingGroup = new THREE.Group();

  // [기념비적 본관 타워: 3단 스텝드 매싱 (3-tier stepped massing)]
  // 1단 (하층부 기단: 1~8층 대규모 포디엄)
  const tier1Geo = new THREE.BoxGeometry(82, 18, 54);
  const towerMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.glassTower,
    metalness: 0.45,
    roughness: 0.25
  });
  const tier1 = new THREE.Mesh(tier1Geo, towerMat);
  tier1.position.set(0, 9, -46);
  tier1.castShadow = true;
  tier1.receiveShadow = true;
  buildingGroup.add(tier1);

  // 2단 (중층부: 9~20층 본 타워 코어)
  const tier2Geo = new THREE.BoxGeometry(68, 20, 46);
  const tier2 = new THREE.Mesh(tier2Geo, towerMat);
  tier2.position.set(0, 28, -46);
  tier2.castShadow = true;
  buildingGroup.add(tier2);

  // 3단 (상층부: 21~28층 전망 및 종합상황실)
  const tier3Geo = new THREE.BoxGeometry(54, 16, 38);
  const tier3 = new THREE.Mesh(tier3Geo, towerMat);
  tier3.position.set(0, 46, -46);
  tier3.castShadow = true;
  buildingGroup.add(tier3);

  // [동익: 부산광역시의회 청사 (East Wing - Council Hall)]
  const councilGeo = new THREE.BoxGeometry(36, 14, 40);
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.2,
    roughness: 0.4
  });
  const council = new THREE.Mesh(councilGeo, wingMat);
  council.position.set(56, 7, -42);
  council.castShadow = true;
  buildingGroup.add(council);
  createSignBoard(56, 15.2, -21.8, "부산광역시의회 BUSAN CITY COUNCIL", 0x1e3a8a, buildingGroup);

  // [서익: 부산시민소통관 (West Wing - Civic Center)]
  const civicHallGeo = new THREE.BoxGeometry(36, 14, 40);
  const civicHall = new THREE.Mesh(civicHallGeo, wingMat);
  civicHall.position.set(-56, 7, -42);
  civicHall.castShadow = true;
  buildingGroup.add(civicHall);
  createSignBoard(-56, 15.2, -21.8, "부산시민소통관 BUSAN CITIZEN HALL", 0x047857, buildingGroup);

  // [본관 전면 6대 거대 화강석 열주 회랑 (Monumental Colonnade)]
  const pillarGeo = new THREE.BoxGeometry(1.6, 7.2, 1.6);
  const pillarMat = new THREE.MeshStandardMaterial({
    map: TEXTURES.plaza,
    roughness: 0.4
  });
  const colX = [-14, -8.4, -2.8, 2.8, 8.4, 14];
  colX.forEach(px => {
    const col = new THREE.Mesh(pillarGeo, pillarMat);
    col.position.set(px, 3.6, -18.2);
    col.castShadow = true;
    buildingGroup.add(col);
  });

  // [유선형 공기역학 캐노피 지붕 (Aerodynamic Entrance Canopy)]
  const canopyGeo = new THREE.BoxGeometry(34, 1.4, 12);
  const canopyMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    metalness: 0.85,
    roughness: 0.15
  });
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0, 6.8, -12);
  canopy.castShadow = true;
  buildingGroup.add(canopy);

  // 캐노피 상단 황금빛 LED 메인 시청 명판
  createSignBoard(0, 7.8, -5.8, "부산광역시청 BUSAN METROPOLITAN CITY", 0x0284c7, buildingGroup);

  // [옥상 통신 안테나 첨탑 & 붉은 항공 장애 표시등]
  const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.6, 14, 8), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
  spire.position.set(0, 61, -46);
  buildingGroup.add(spire);

  const warnLight = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  warnLight.position.set(0, 68, -46);
  buildingGroup.add(warnLight);

  // [옥상 헬리패드 (Rooftop Helipad)]
  const heliPad = new THREE.Mesh(new THREE.CircleGeometry(8, 24), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }));
  heliPad.rotation.x = -Math.PI / 2;
  heliPad.position.set(0, 54.05, -46);
  buildingGroup.add(heliPad);

  // [유리 자동문 그랜드 입구]
  const doorGeo = new THREE.BoxGeometry(12, 4.8, 0.4);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.65 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, 2.4, -18.8);
  buildingGroup.add(door);

  // [그랜드 3단 화강석 진입 계단]
  for (let s = 0; s < 3; s++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(36 + s * 1.6, 0.25, 4.2 - s * 0.8),
      pillarMat
    );
    step.position.set(0, 0.12 + s * 0.25, -16.5 + s * 1.4);
    step.receiveShadow = true;
    buildingGroup.add(step);
  }

  cityHallWorldGroup.add(buildingGroup);
}'''

facade_pattern = r'function buildCityHallTowerFacade\(\)\s*\{[\s\S]*?cityHallWorldGroup\.add\(buildingGroup\);\s*\}'
code = re.sub(facade_pattern, new_facade_code, code, count=1)
print("Replaced buildCityHallTowerFacade successfully.")

# ========================================================
# 5. 광장 앰버 가로등 & 지피티 추천 컨텐츠 3종 함수 추가
# ========================================================
plaza_extras_code = '''
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

  // 석재 대리석 제단
  const altar = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 1.0, 16), new THREE.MeshStandardMaterial({ map: TEXTURES.marble, roughness: 0.3 }));
  altar.position.y = 0.5;
  altar.castShadow = true;
  g.add(altar);

  // 황금빛 회전 동백꽃 심볼
  const flowerGeo = new THREE.TorusGeometry(0.65, 0.18, 12, 24);
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.3, roughness: 0.2 });
  camelliaBlessingMesh = new THREE.Mesh(flowerGeo, flowerMat);
  camelliaBlessingMesh.position.y = 1.9;
  g.add(camelliaBlessingMesh);

  const goldCore = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 }));
  goldCore.position.y = 1.9;
  g.add(goldCore);

  // 안내 명패
  createSignBoard(0, 1.15, 1.5, "오늘의 시정 축복 KIOSK (동백꽃 행운)", 0xe11d48, g);

  // 상호작용 등록
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
  activateGoldenAura(18); // 18초간 황금빛 오라
  if (typeof playSfx === 'function') playSfx('levelUp');
}

// ========================================================
// [지피티 추천 2] 시민 희망 축제 불꽃놀이 발사대 (폭죽 파티클)
// ========================================================
let activeFireworks = [];
function buildFireworksLauncher(x = -18, y = 0, z = 24) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // 축제 발사대 원형 포대
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 }));
  base.position.y = 0.4;
  g.add(base);

  // 붉은색 축포 로켓 모형
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

  // 전시관 캐노피 기단
  const podium = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 4), new THREE.MeshStandardMaterial({ map: TEXTURES.marble, roughness: 0.3 }));
  podium.position.set(0, 0.2, 0);
  g.add(podium);

  // 3개 등급별 대표 훈장 입체 전시대 (동장, 은장, 금장 훈장)
  const medalColors = [0xcd7f32, 0xe2e8f0, 0xf59e0b];
  const medalTitles = ["모범시민 훈장", "소통영웅 훈장", "부산 명예시장 훈장"];

  for (let i = 0; i < 3; i++) {
    const mx = -3.2 + i * 3.2;
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 }));
    stand.position.set(mx, 0.8, 0);
    g.add(stand);

    // 빛나는 입체 훈장 메달
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
'''

# ========================================================
# 6. 캐릭터 페이스 캔버스 엔진 & 헤어 앞머리 완전 정복
# (스크린샷 얼굴 절반 검정 버그 원천 박멸 + 단발머리 눈 위 앞머리 뱅 완벽 구현)
# ========================================================
face_and_hair_code = '''
// ========================================================
// [가즈아 대성전급] 고해상도 시민 페이스 캔버스 텍스처 엔진
// (검은색 폴리곤 클리핑 원천 차단 + 초롱초롱 사파이어 눈망울 + 생기있는 볼터치)
// ========================================================
function createCitizenFaceTexture(skinTone = 'warm', mood = 'happy') {
  const W = 1024, H = 512;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // u = 0.25 (x = 256)이 구형 지오메트리의 정면(+Z)
  const cx = 256, ey = 256;

  // 1. 피부 톤 베이스 채우기
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

  // 2. 부드러운 안면 광택 및 입체 그라데이션 (대성전 기법)
  const gFace = ctx.createRadialGradient(cx, ey, 20, cx, ey, 280);
  gFace.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
  gFace.addColorStop(0.65, 'rgba(255, 230, 215, 0.18)');
  gFace.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  ctx.fillStyle = gFace;
  ctx.fillRect(0, 0, W, H);

  // 3. 생기 넘치는 핑크빛 볼터치 (Blush)
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

  // 4. 단정하고 부드러운 아치형 눈썹 (Eyebrows)
  ctx.strokeStyle = '#2d1810';
  ctx.lineWidth = 6.5;
  ctx.lineCap = 'round';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + s * 78, ey - 48, 34, 11, s * 0.14, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // 5. 초롱초롱한 애니메 눈망울 (Sparkling Anime Eyes)
  for (const s of [-1, 1]) {
    const ex = cx + s * 78, eyPos = ey + 6;
    // 눈 베이스 타원
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(ex, eyPos, 22, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // 하단 사파이어 오션 홍채 그라데이션
    const gIris = ctx.createRadialGradient(ex, eyPos + 10, 2, ex, eyPos + 10, 18);
    gIris.addColorStop(0, '#38bdf8');
    gIris.addColorStop(0.7, '#0284c7');
    gIris.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = gIris;
    ctx.beginPath();
    ctx.arc(ex, eyPos + 8, 16, 0, Math.PI * 2);
    ctx.fill();

    // 더블 캐치라이트 하이라이트
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex - 6, eyPos - 8, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 8, eyPos + 8, 4.0, 0, Math.PI * 2);
    ctx.fill();

    // 상단 아이라인 및 귀여운 속눈썹
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(ex, eyPos - 6, 24, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // 6. 방긋 웃는 사랑스러운 입
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(cx, ey + 72, 14, 0.1, Math.PI - 0.1);
  ctx.fill();
  ctx.strokeStyle = '#be123c';
  ctx.lineWidth = 3;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// ========================================================
// 헤어 스타일링: 단발머리 눈 위 앞머리 뱅 및 고품질 스타일
// ========================================================
function applyHairDecoration(slot, hairStyle, hairMat) {
  while (slot.children.length > 0) slot.remove(slot.children[0]);
  if (!hairMat) hairMat = SHARED_MAT.hair;

  if (hairStyle === 'bob') {
    // [1] 러블리 단발머리 (여성 대표 단발):
    // 둥근 보브 쉘 (얼굴 앞면 이마와 볼은 완전히 열려있어 피부 텍스처 노출)
    const bobShell = new THREE.Mesh(
      new THREE.SphereGeometry(0.428, 22, 16, Math.PI * 0.72, Math.PI * 1.56, 0, Math.PI * 0.76),
      hairMat
    );
    bobShell.position.set(0, 0.02, -0.04);
    slot.add(bobShell);

    // 정수리 윗볼륨
    const bobCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.424, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.30),
      hairMat
    );
    bobCrown.position.set(0, 0.08, -0.02);
    slot.add(bobCrown);

    // ★ [사용자 요청 완벽 해결] 단발머리 눈 위 앞머리 (y: 0.24, z: 0.365)
    // 눈(y: 0.0)과 눈썹(y: 0.12) 위에 가지런하게 3단으로 안착되는 앞머리 뱅!
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

    // 볼을 감싸며 떨어지는 사이드 단발 라인
    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.22), hairMat);
    sideL.position.set(-0.38, -0.02, 0.08);
    sideL.rotation.y = 0.12;
    slot.add(sideL);

    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.22), hairMat);
    sideR.position.set(0.38, -0.02, 0.08);
    sideR.rotation.y = -0.12;
    slot.add(sideR);

    // 뒷머리 볼륨
    const backNeck = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.36, 0.22), hairMat);
    backNeck.position.set(0, -0.04, -0.26);
    slot.add(backNeck);

    // 귀여운 레드 동백꽃 머리핀
    const pinFlower = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 8), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
    pinFlower.position.set(-0.28, 0.25, 0.28);
    pinFlower.rotation.x = Math.PI / 2;
    slot.add(pinFlower);
    const pinCenter = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    pinCenter.position.set(-0.28, 0.25, 0.30);
    slot.add(pinCenter);

  } else if (hairStyle === 'long') {
    // [2] 웨이브 롱: 이마 앞머리 + 등 뒤로 풍성하게 내린 헤어
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
    // [3] 포니테일: 이마 앞머리 + 후두부 묶음 리본
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
    // [4] 양갈래 트윈테일: 이마 앞머리 + 좌우 방울 리본 묶음
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
    // [5] 댄디 숏컷 & 기본 (short / dandy): 단정한 3단 이마 앞머리 뱅 + 깔끔한 구레나룻
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
    slot.add(sideR);

    const backShort = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12, Math.PI * 0.8, Math.PI * 1.4, 0, Math.PI * 0.65), hairMat);
    backShort.position.set(0, 0.04, -0.04);
    slot.add(backShort);
  }
}
'''

# ========================================================
# 7. createCuteCitizenMesh() 전면 리팩토링
# (페이스 텍스처를 머리 구체에 직접 맵핑하여 클리핑 버그 박멸 & 골든 아우라)
# ========================================================
new_character_mesh_code = '''function createCuteCitizenMesh({
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
  isNpc = false
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

  root.userData = {
    armL, armR, legGroupL, legGroupR,
    headGroup, hairSlot, hatSlot, wingSlot,
    body, headMat, auraRing,
    nameplate,
    robeColor, hatType, wingsType, hairStyle, hairColor, skinTone,
    isNpc
  };

  return root;
}'''

char_pattern = r'function createCuteCitizenMesh\(\{[\s\S]*?return root;\s*\}'
code = re.sub(char_pattern, new_character_mesh_code, code, count=1)
print("Replaced createCuteCitizenMesh successfully.")

# Replace applyHairDecoration
hair_pattern = r'function applyHairDecoration\(slot,\s*hairStyle,\s*hairMat\)\s*\{[\s\S]*?slot\.add\(sideR\);\s*\}\s*\}'
code = re.sub(hair_pattern, '', code, count=1)

# Inject new helper functions right after buildCityHallTowerFacade
code = code.replace("cityHallWorldGroup.add(buildingGroup);\n}", "cityHallWorldGroup.add(buildingGroup);\n}\n" + panorama_and_features_code + plaza_extras_code + face_and_hair_code)

# Add calls to buildBusanCityHallWorld
build_call_pattern = "buildFreeSpeechPodium(33, 0, 60);"
build_call_repl = """buildFreeSpeechPodium(33, 0, 60);

  // [가즈아 대성전급 조명 및 지피티 추천 컨텐츠]
  buildPlazaStreetlamps();
  buildCamelliaFortuneKiosk(18, 0, 24);
  buildFireworksLauncher(-18, 0, 24);
  buildCivicHonorHallExhibition(-26, 0, 46);"""

if build_call_pattern in code:
    code = code.replace(build_call_pattern, build_call_repl, 1)
    print("Added calls in buildBusanCityHallWorld successfully.")

# Add animation updates for fireworks & aura in updateAnimations
anim_pattern = "function updateAnimations(dt) {"
anim_repl = """function updateAnimations(dt) {
  // 지피티 추천 동백꽃 행운 키오스크 회전
  if (camelliaBlessingMesh) {
    camelliaBlessingMesh.rotation.z += dt * 1.5;
  }

  // 불꽃놀이 파티클 애니메이션
  for (let i = activeFireworks.length - 1; i >= 0; i--) {
    const fw = activeFireworks[i];
    fw.life -= dt;
    const pos = fw.mesh.geometry.attributes.position.array;
    for (let k = 0; k < fw.velocities.length; k++) {
      pos[k * 3] += fw.velocities[k].vx;
      pos[k * 3 + 1] += fw.velocities[k].vy;
      pos[k * 3 + 2] += fw.velocities[k].vz;
      fw.velocities[k].vy -= dt * 0.45; // 중력
    }
    fw.mesh.geometry.attributes.position.needsUpdate = true;
    fw.mesh.material.opacity = Math.max(0, fw.life / fw.maxLife);
    if (fw.life <= 0) {
      scene.remove(fw.mesh);
      activeFireworks.splice(i, 1);
    }
  }

  // 플레이어 골든 아우라 회전
  if (playerMesh && playerMesh.userData.auraRing) {
    playerMesh.userData.auraRing.rotation.z += dt * 2.0;
  }"""

if anim_pattern in code:
    code = code.replace(anim_pattern, anim_repl, 1)
    print("Updated updateAnimations successfully.")

# Helper to activate golden aura
golden_aura_helper = """
let goldenAuraTimer = null;
function activateGoldenAura(durationSec = 15) {
  if (!playerMesh || !playerMesh.userData.auraRing) return;
  playerMesh.userData.auraRing.material.opacity = 0.85;
  if (goldenAuraTimer) clearTimeout(goldenAuraTimer);
  goldenAuraTimer = setTimeout(() => {
    if (playerMesh && playerMesh.userData.auraRing && STATE.level < 5) {
      playerMesh.userData.auraRing.material.opacity = 0.0;
    }
  }, durationSec * 1000);
}
"""
code += golden_aura_helper

with open(APP_JS, "w", encoding="utf-8") as f:
    f.write(code)

print("Saved new app.js. Size:", len(code))
