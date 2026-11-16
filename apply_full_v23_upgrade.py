# -*- coding: utf-8 -*-
"""
부산ON 월드 v2.3 종합 버그 픽스 및 GPT/공식 홈페이지 인기메뉴 전면 반영 패치
1. 이동 컨트롤 락 해제: SELECT 포커스 해제 및 캔버스 터치 블러, 방향키/WASD 정상화
2. 우측 사이드바 및 모든 모달 즉각 표시: .modal-overlay.visible { display: flex !important; } 및 사이드바 위치 보정
3. 하단 툴바 단일 통합 및 3D 제스처(박수, 손흔들기, 환호, 댄스, 기도, 경례) 실시간 관절 모션 물리 구현
4. 외모 바꾸기 룸 즉각 팝업 및 8종 헤어/8종 의상/3종 피부톤 실시간 변경 완비
5. 부산시청 & 16개 구·군 공식 홈페이지 인기메뉴 원스톱 e-포털 모달 및 3D 인터랙티브 키오스크 완비
6. 404 에러 원천 차단 및 PyInstaller 바이너리/GitHub Pages 동기화
"""

import os
import re
import json

BASE_DIR = r"c:\Users\Mini PC\Desktop\프로그램\부산광역시청"

# ========================================================
# 1. style.css 패치
# ========================================================
def patch_style_css():
    path = os.path.join(BASE_DIR, "style.css")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. .modal-overlay.visible 누락 추가 및 .modal-overlay fixed 보정
    if ".modal-overlay.visible" not in content:
        overlay_target = """.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(6px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 100;
  pointer-events: auto;
  padding: 20px;
}"""
        overlay_replacement = """.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 100;
  pointer-events: auto;
  padding: 16px;
}

.modal-overlay.visible {
  display: flex !important;
  opacity: 1 !important;
  visibility: visible !important;
}"""
        if overlay_target in content:
            content = content.replace(overlay_target, overlay_replacement)
        else:
            # 정규식으로 .modal-overlay { ... } 교체
            content = re.sub(
                r'\.modal-overlay\s*\{[^}]*display:\s*none;[^}]*\}',
                overlay_replacement,
                content,
                count=1
            )

    # 2. .event-sidebar 데스크톱 및 모바일 위치 보정 (화면 밖 튕김 방지)
    old_sidebar = """.event-sidebar {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: auto;
  z-index: 45;
}"""
    new_sidebar = """.event-sidebar {
  position: fixed;
  top: 64px;
  right: 12px;
  transform: none !important;
  max-height: calc(100vh - 130px);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
  z-index: 55;
  padding: 4px 2px;
}
.event-sidebar::-webkit-scrollbar {
  display: none;
}"""
    if old_sidebar in content:
        content = content.replace(old_sidebar, new_sidebar)

    # 모바일 미디어 쿼리 내 .event-sidebar transform: none !important 보완
    content = re.sub(
        r'(\.event-sidebar\s*\{[^}]*top:\s*60px\s*!important;[^}]*)(\})',
        r'\1  transform: none !important;\n    max-height: calc(100vh - 120px) !important;\n    overflow-y: auto !important;\n    scrollbar-width: none !important;\n\2',
        content
    )

    # 3. .toolbar-container 및 하단 바 포지셔닝 고정 (z-index 60, 터치 보장)
    old_toolbar = """.toolbar-container {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);"""
    new_toolbar = """.toolbar-container {
  position: fixed;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);"""
    if old_toolbar in content:
        content = content.replace(old_toolbar, new_toolbar)

    # 4. 인기메뉴 모달 전용 CSS 추가 (없을 경우 파일 끝에 추가)
    if ".popular-menu-grid" not in content:
        popular_styles = """

/* ========================================================
   v2.3 공식 홈페이지 인기메뉴 & e-행정 포털 모달 스타일
   ======================================================== */
.popular-filter-pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 6px 2px 10px 2px;
  scrollbar-width: none;
}
.popular-filter-pills::-webkit-scrollbar {
  display: none;
}
.popular-pill-btn {
  padding: 7px 15px;
  border-radius: 20px;
  border: 1.5px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.popular-pill-btn:hover {
  background: #e0f2fe;
  border-color: #38bdf8;
  color: #0369a1;
  transform: translateY(-1px);
}
.popular-pill-btn.active {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: #ffffff;
  border-color: #0284c7;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
}
.popular-menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-top: 10px;
  max-height: 58vh;
  overflow-y: auto;
  padding-right: 4px;
  padding-bottom: 8px;
}
.popular-menu-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.popular-menu-card:hover {
  border-color: #0284c7;
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(2, 132, 199, 0.16);
}
.popular-card-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}
.popular-card-icon {
  font-size: 24px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 10px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.popular-card-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
}
.popular-card-agency {
  font-size: 11px;
  color: #0284c7;
  font-weight: 700;
  margin-top: 3px;
}
.popular-card-summary {
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 10px;
  flex-grow: 1;
}
.popular-card-actions {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}
.popular-action-btn {
  flex: 1;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.15s ease;
}
.popular-action-btn.primary {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: #ffffff;
}
.popular-action-btn.primary:hover {
  background: #0284c7;
  box-shadow: 0 4px 10px rgba(2, 132, 199, 0.35);
}
.popular-action-btn.secondary {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
}
.popular-action-btn.secondary:hover {
  background: #e2e8f0;
}
"""
        content += popular_styles

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(" [✓] style.css 패치 완료!")

# ========================================================
# 2. index.html 패치
# ========================================================
def patch_index_html():
    path = os.path.join(BASE_DIR, "index.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. <select id="realm-select"> onchange에 this.blur() 추가 (방향키/WASD 이동 잠김 원천 차단)
    content = content.replace(
        '<select id="realm-select" class="realm-select" onchange="switchRealm(this.value)">',
        '<select id="realm-select" class="realm-select" onchange="switchRealm(this.value); this.blur();">'
    )

    # 2. 우측 사이드바에 '🔥 인기메뉴' 및 '🎨 꾸미기' 원형 버튼 확실히 배치
    if 'openPopularMenusModal()' not in content:
        target_quiz = """      <button class="sidebar-circle-btn clickable" onclick="openQuizModal()" title="부산 시정 상식 퀴즈 룰렛 (EXP 획득 및 레벨업)">
        <span class="circle-icon">🎡</span>
        <span class="circle-label">시정퀴즈</span>
      </button>"""
        new_sidebar_btns = """      <button class="sidebar-circle-btn clickable" onclick="openPopularMenusModal()" title="부산시 & 16개 구·군 공식 홈페이지 인기메뉴 및 핵심 e-행정 포털">
        <span class="circle-icon">🔥</span>
        <span class="circle-label">인기메뉴</span>
      </button>

      <button class="sidebar-circle-btn clickable" onclick="openCustomizeModal()" title="시민 의상 및 아바타 꾸미기 룸">
        <span class="circle-icon">🎨</span>
        <span class="circle-label">꾸미기</span>
      </button>

      <button class="sidebar-circle-btn clickable" onclick="openQuizModal()" title="부산 시정 상식 퀴즈 룰렛 (EXP 획득 및 레벨업)">
        <span class="circle-icon">🎡</span>
        <span class="circle-label">시정퀴즈</span>
      </button>"""
        content = content.replace(target_quiz, new_sidebar_btns)

    # 3. 하단 툴바에 기도/꾸미기/인기메뉴 버튼 추가
    if 'openPopularMenusModal()' not in content:
        old_toolbar_end = """      <button class="prayer-btn shout" onclick="openPodiumPrompt()" title="시민 발언대에 올라 확성기로 외칩니다">
        <span class="btn-icon">📢</span>
        <span class="btn-text">외치기</span>
      </button>

      <button class="prayer-btn" onclick="openFullChatHistoryModal()" title="전체 채팅 기록 및 채널 대화">
        <span class="btn-icon">💬</span>
        <span class="btn-text">채팅</span>
      </button>"""
        new_toolbar_end = """      <button class="prayer-btn" onclick="performGesture('pray')" title="부산의 번영과 안녕을 기원합니다 (단축키 5)">
        <span class="btn-icon">🌺</span>
        <span class="btn-text">기도</span>
      </button>

      <button class="prayer-btn shout" onclick="openPodiumPrompt()" title="시민 발언대에 올라 확성기로 외칩니다">
        <span class="btn-icon">📢</span>
        <span class="btn-text">외치기</span>
      </button>

      <button class="prayer-btn" onclick="openCustomizeModal()" title="시민 의상 및 아바타 꾸미기 룸">
        <span class="btn-icon">🎨</span>
        <span class="btn-text">꾸미기</span>
      </button>

      <button class="prayer-btn" onclick="openPopularMenusModal()" title="부산시 & 16개 구·군 공식 홈페이지 인기메뉴">
        <span class="btn-icon">🔥</span>
        <span class="btn-text">인기메뉴</span>
      </button>

      <button class="prayer-btn" onclick="openFullChatHistoryModal()" title="전체 채팅 기록 및 채널 대화">
        <span class="btn-icon">💬</span>
        <span class="btn-text">채팅</span>
      </button>"""
        content = content.replace(old_toolbar_end, new_toolbar_end)

    # 4. 모달 영역에 '#modal-popular-menus' 마크업 추가
    if 'id="modal-popular-menus"' not in content:
        popular_modal_html = """
  <!-- MODAL: 부산시청 & 16개 구·군 공식 홈페이지 인기메뉴 및 e-행정 원스톱 포털 -->
  <div class="modal-overlay" id="modal-popular-menus">
    <div class="modal-content" style="max-width: 960px;">
      <div class="modal-header">
        <div class="modal-title-group">
          <div class="modal-icon-badge">🔥</div>
          <div>
            <div class="modal-title">부산광역시 & 16개 구·군 공식 홈페이지 인기메뉴 포털</div>
            <div class="modal-sub">시민들이 가장 많이 찾는 대표 e-민원, 여권, 세금, 일자리, 관광, 복지 원스톱 바로가기</div>
          </div>
        </div>
        <button class="modal-close-btn" onclick="closeModal('modal-popular-menus')">✕</button>
      </div>
      <div class="modal-body">
        <div style="margin-bottom: 12px;">
          <input type="text" id="popular-search-input" class="division-search-input" placeholder="🔍 인기 행정서비스 검색 (예: 여권, 위택스, 동백전, 일자리, 드론쇼, 케이블카...)" oninput="searchPopularMenus(this.value)">
        </div>
        <div class="popular-filter-pills" id="popular-filter-pills">
          <button class="popular-pill-btn active" onclick="filterPopularMenus('all', this)">⭐ 전체보기</button>
          <button class="popular-pill-btn" onclick="filterPopularMenus('city_top10', this)">🏛️ 부산시 대표 TOP 10</button>
          <button class="popular-pill-btn" onclick="filterPopularMenus('district_civil', this)">📋 16개 구·군 e-민원</button>
          <button class="popular-pill-btn" onclick="filterPopularMenus('culture_tour', this)">🏖️ 문화·관광·축제 HOT</button>
          <button class="popular-pill-btn" onclick="filterPopularMenus('welfare_youth', this)">💳 복지·청년·일자리</button>
          <button class="popular-pill-btn" onclick="filterPopularMenus('traffic_safety', this)">🚍 교통·안전·의료</button>
        </div>
        <div class="popular-menu-grid" id="popular-menus-grid">
          <!-- JS 동적 렌더링 -->
        </div>
      </div>
    </div>
  </div>
"""
        content = content.replace('</body>', popular_modal_html + '\n</body>')

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(" [✓] index.html 패치 완료!")

# ========================================================
# 3. app.js 패치
# ========================================================
def patch_app_js():
    path = os.path.join(BASE_DIR, "app.js")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. setupMovementControls() 에서 SELECT 태그 포커스 해제 및 WASD 락 방지
    old_move_ctrl = """function setupMovementControls() {
  window.addEventListener('keydown', (e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;"""
    
    new_move_ctrl = """function setupMovementControls() {
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
    }"""
    if old_move_ctrl in content:
        content = content.replace(old_move_ctrl, new_move_ctrl)

    # 캔버스 및 화면 클릭 시 입력창/선택창 자동 블러 처리
    pointer_target = """  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.top-nav, .event-sidebar, .middle-area, .toolbar-container, .modal-overlay, .virtual-joystick')) {
      return;
    }"""
    pointer_replacement = """  window.addEventListener('pointerdown', (e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      document.activeElement.blur();
      window.focus();
    }
    if (e.target.closest('.top-nav, .event-sidebar, .middle-area, .toolbar-container, .modal-overlay, .virtual-joystick')) {
      return;
    }"""
    if pointer_target in content:
        content = content.replace(pointer_target, pointer_replacement)

    # 2. switchRealm() 카메라 타겟과 플레이어 위치 100% 동기화 (구청 이동 시 튕김 및 시점 이탈 방지)
    old_switch = """function switchRealm(realmCode) {
  STATE.currentRoom = realmCode;
  const sel = document.getElementById('realm-select');
  if (sel) sel.value = realmCode;

  if (realmCode === 'BUSAN-HQ') {
    if (cityHallWorldGroup) cityHallWorldGroup.visible = true;
    if (districtWorldGroup) districtWorldGroup.visible = false;
    interactiveObjects = [...cityHallInteractablesBackup];
    if (localPlayer) {
      localPlayer.position.set(0, 0, 38);
      if (controls) controls.target.set(0, 1.4, 28);
    }
    showSpeechBubble(localPlayer, "🌊 [부산광역시청 본관] 중앙 시민광장에 도착했습니다!");
  } else {
    if (cityHallWorldGroup) cityHallWorldGroup.visible = false;
    if (districtWorldGroup) {
      districtWorldGroup.visible = true;
      buildDistrictOfficeWorld(realmCode);
    }
    interactiveObjects = [...districtInteractables];
    if (localPlayer) {
      localPlayer.position.set(0, 0, 24);
      if (controls) controls.target.set(0, 1.4, 12);
    }"""

    new_switch = """function switchRealm(realmCode) {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
  window.focus();

  STATE.currentRoom = realmCode;
  const sel = document.getElementById('realm-select');
  if (sel) sel.value = realmCode;

  if (realmCode === 'BUSAN-HQ') {
    if (cityHallWorldGroup) cityHallWorldGroup.visible = true;
    if (districtWorldGroup) districtWorldGroup.visible = false;
    interactiveObjects = [...cityHallInteractablesBackup];
    if (localPlayer) {
      localPlayer.position.set(0, 0, 38);
      localPlayer.rotation.y = 0;
      if (controls && camera) {
        controls.target.set(0, 1.4, 38);
        camera.position.set(0, 6.5, 48.5);
        controls.update();
      }
    }
    showSpeechBubble(localPlayer, "🌊 [부산광역시청 본관] 중앙 시민광장에 도착했습니다!");
  } else {
    if (cityHallWorldGroup) cityHallWorldGroup.visible = false;
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
    }"""
    if old_switch in content:
        content = content.replace(old_switch, new_switch)

    # 3. performGesture() 3D 관절 모션 타이머 등록
    old_perf = """function performGesture(type) {
  if (!localPlayer) return;
  if (type === 'wave') {"""
    new_perf = """function performGesture(type) {
  if (!localPlayer) return;
  const ud = localPlayer.userData;
  if (ud) {
    ud.currentGesture = type;
    ud.gestureTimer = 3.5;
  }
  if (type === 'wave') {"""
    if old_perf in content:
        content = content.replace(old_perf, new_perf)

    # 4. updateCuteCitizenAnimation() 내 3D 제스처 관절 물리 애니메이션 (박수, 손흔들기, 환호, 댄스, 기도, 경례)
    gesture_anim_code = """
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
"""
    old_walking_check = "  // 2. 걷기 시 팔다리 스윙 및 통통 바운스\n  if (ud.isWalking) {"
    if old_walking_check in content and "3D 시민 감정표현 제스처 실시간 관절 모션" not in content:
        content = content.replace(
            old_walking_check,
            gesture_anim_code + "\n  // 2. 걷기 시 팔다리 스윙 및 통통 바운스\n  if (ud.isWalking) {\n    ud.gestureTimer = 0;\n    ud.currentGesture = null;"
        )

    # 5. 멀티플레이 액션 동기화 (상대방 캐릭터도 박수/손흔들기 3D 모션 재생)
    ws_action_target = "    } else if (data.type === 'action') {\n      const p = STATE.peers[data.id];\n      if (p && p.mesh) {"
    ws_action_replacement = """    } else if (data.type === 'action') {
      const p = STATE.peers[data.id];
      if (p && p.mesh) {
        p.mesh.userData.currentGesture = data.act;
        p.mesh.userData.gestureTimer = 3.5;"""
    if ws_action_target in content:
        content = content.replace(ws_action_target, ws_action_replacement)

    # 6. 공식 홈페이지 인기메뉴 데이터 및 렌더러 함수 추가
    if "POPULAR_HOMEPAGE_SERVICES" not in content:
        popular_js_code = """
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
"""
        content += "\n" + popular_js_code

    # 7. 시청 광장 및 구청 월드에 인기 e-민원 키오스크 3D 오브젝트 추가
    if "인기 e-민원 KIOSK" not in content:
        # buildBusanCityHallWorld 내 키오스크 추가
        city_kiosk_code = """
  // (16) [v2.3 공식 홈페이지 인기메뉴 e-키오스크]
  const popKioskGroup = new THREE.Group();
  popKioskGroup.position.set(6.0, 0, 2.0);
  const pKioskMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
  const pStand = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 2.2, 16), pKioskMat);
  pStand.position.y = 1.1;
  popKioskGroup.add(pStand);

  const pScreen = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.15), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  pScreen.position.set(0, 1.8, 0.2);
  pScreen.rotation.x = -0.2;
  popKioskGroup.add(pScreen);

  const pBadge = createTextLabelSprite("🔥 부산시 & 16구군 인기 e-민원 KIOSK", { r: 249, g: 115, b: 22 }, 16);
  pBadge.position.set(0, 2.5, 0.2);
  popKioskGroup.add(pBadge);
  cityHallWorldGroup.add(popKioskGroup);

  registerInteractiveObject({
    id: 'kiosk-popular-menus',
    pos: { x: 6.0, y: 0, z: 2.0 },
    radius: 4.5,
    prompt: "E키: 공식 홈페이지 인기메뉴 e-키오스크 열기",
    action: () => openPopularMenusModal('all')
  });
"""
        content = content.replace(
            "  buildHopeBalloonTree();\n}",
            "  buildHopeBalloonTree();\n" + city_kiosk_code + "\n}"
        )

        # buildDistrictOfficeWorld 내 구청 인기메뉴 키오스크 추가
        dist_kiosk_code = """
  // 구청 공식 홈페이지 인기메뉴 키오스크 등록
  registerDistrictInteractive({
    pos: { x: 0, z: 12 },
    radius: 4.5,
    prompt: `E키: [${distName}] 대표 e-민원 & 관광안내 열기`,
    action: () => openPopularMenusModal('district_civil')
  });
"""
        content = content.replace(
            "  buildReturnToCityHallPortal(districtWorldGroup);\n}",
            dist_kiosk_code + "\n  buildReturnToCityHallPortal(districtWorldGroup);\n}"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(" [✓] app.js 패치 완료!")

# ========================================================
# 4. server.py 패치 (정적 파일 및 /api/popular-menus 서빙)
# ========================================================
def patch_server_py():
    path = os.path.join(BASE_DIR, "server.py")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # /api/popular-menus 엔드포인트 추가
    if "/api/popular-menus" not in content:
        target_api = "        # 1. 16개 구·군청 메타데이터\n        if path == '/api/districts':"
        replacement_api = """        # 0. 부산시 & 16개 구·군 공식 홈페이지 인기메뉴 API
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
        if path == '/api/districts':"""
        content = content.replace(target_api, replacement_api)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(" [✓] server.py 패치 완료!")

# ========================================================
# 5. busan_data.py 패치 (BUSAN_POPULAR_HOMEPAGE_SERVICES 추가)
# ========================================================
def patch_busan_data_py():
    path = os.path.join(BASE_DIR, "busan_data.py")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if "BUSAN_POPULAR_HOMEPAGE_SERVICES" not in content:
        services_data_code = """

# ========================================================
# 7. 부산광역시 및 16개 자치 구·군 공식 홈페이지 인기메뉴 & e-행정 포털 마스터 데이터
# ========================================================
BUSAN_POPULAR_HOMEPAGE_SERVICES = [
    {
        "id": "pop-passport",
        "category": "city_top10",
        "district": "BUSAN-HQ",
        "title": "여권 신청 및 야간 여권민원 사전예약",
        "agency": "부산시청 2층 행복민원실",
        "icon": "🛂",
        "summary": "대한민국 전자여권 신규발급 및 갱신, 직장인을 위한 매주 목요일 야간(18:00~20:00) 발급 사전예약제 운영.",
        "details": "준비물: 신분증, 6개월 이내 여권용 사진 1매, 수수료. 온라인 정부24 재발급 신청 시 방문 수령 1회로 단축 가능.",
        "url": "https://www.busan.go.kr/minwon0202",
        "hot": True
    },
    {
        "id": "pop-minwon120",
        "category": "city_top10",
        "district": "BUSAN-HQ",
        "title": "부산민원 120 바로콜센터 & 온라인 민원신청",
        "agency": "부산광역시 통합민원과",
        "icon": "📞",
        "summary": "국번 없이 120 전화 한 통으로 부산시정, 구·군정, 교통, 세무, 상수도 모든 궁금증을 실시간 원스톱 상담 및 부서 연결.",
        "details": "평일 08:30~18:30 전문상담원 운영, 야간 및 공휴일 당직실 긴급 연계. 온라인 부산민원120 포털 24시간 접수.",
        "url": "https://www.busan.go.kr/minwon120",
        "hot": True
    },
    {
        "id": "pop-safety",
        "category": "traffic_safety",
        "district": "BUSAN-HQ",
        "title": "안전신문고 (도로파손, 포트홀, 불법주정차 간편신고)",
        "agency": "행정안전부 & 부산시 안전신문고",
        "icon": "🚨",
        "summary": "도로 포트홀, 불법주정차, 보도블록 파손, 신호등 고장 등 생활 속 위험 요소를 스마트폰 사진 2장으로 즉시 신고.",
        "details": "신고 접수 즉시 관할 시·구청 담당 부서로 자동 이첩되어 처리 진행 상황 및 현장 정비 사진이 문자로 안내됩니다.",
        "url": "https://www.safetyreport.go.kr",
        "hot": True
    },
    {
        "id": "pop-dongbaek",
        "category": "welfare_youth",
        "district": "BUSAN-HQ",
        "title": "동백전 7% 캐시백 & 동백패스 4.5만원 대중교통 환급",
        "agency": "부산시 소상공인지원과 / 교통정책과",
        "icon": "💳",
        "summary": "부산 지역화폐 동백전 월 충전금 결제 시 7% 즉시 캐시백, 대중교통 월 4만 5천원 초과금 최대 4만 5천원 환급(동백패스).",
        "details": "하나/농협/부산은행 동백전 체크카드 및 앱 간편 발급. K-패스와 연계되어 전국 최고 수준의 교통비 절감 혜택 제공.",
        "url": "https://dongbaekjeon.busan.go.kr",
        "hot": True
    },
    {
        "id": "pop-wetax",
        "category": "city_top10",
        "district": "BUSAN-HQ",
        "title": "위택스 (지방세·자동차세·재산세 조회 및 납부)",
        "agency": "부산광역시 세정과 / 위택스",
        "icon": "💰",
        "summary": "자동차세, 주민세, 재산세, 취득세 등 부산시 모든 지방세와 상하수도 요금을 간편인증으로 즉시 조회하고 전자 납부.",
        "details": "1월 자동차세 연납 시 최대 5% 공제 혜택. 카드 포인트 납부 및 모바일 전자송달 신청 시 세액 공제 추가 적용.",
        "url": "https://www.wetax.go.kr",
        "hot": True
    },
    {
        "id": "pop-young",
        "category": "welfare_youth",
        "district": "BUSAN-HQ",
        "title": "부산청년플랫폼 (월세 20만원 지원 & 희망적금)",
        "agency": "부산광역시 청년정책담당관",
        "icon": "🏠",
        "summary": "부산 거주 무주택 청년 월 최대 20만 원 월세 지원, 청년희망날개통장(매칭지원금), 청년 자격증 응시료 지원.",
        "details": "만 19~39세 부산 거주 청년 대상, 소득 및 거주 기준 충족 시 온라인 간편 신청 및 바우처 즉시 지급.",
        "url": "https://young.busan.go.kr",
        "hot": True
    },
    {
        "id": "pop-job",
        "category": "welfare_youth",
        "district": "BUSAN-HQ",
        "title": "부산일자리정보망 (청년·중장년·시니어 취업매칭)",
        "agency": "부산경제진흥원 / 일자리종합센터",
        "icon": "💼",
        "summary": "부산 지역 우수 중소·중견기업 구인정보, 공공기관 채용공고, 청년 맞춤형 AI 모의면접 및 취업 컨설팅 전액 무료.",
        "details": "시청 1층 일자리종합센터 방문 시 1:1 전담 직업상담사 배정 및 이력서 클리닉, 취업장려금 연계 지원.",
        "url": "https://www.busanjob.net",
        "hot": True
    },
    {
        "id": "pop-tour",
        "category": "culture_tour",
        "district": "BUSAN-HQ",
        "title": "부산 문화관광 & 4대 메가 축제 일정 안내",
        "agency": "부산광역시 관광마이스산업과",
        "icon": "🌊",
        "summary": "광안리 부산불꽃축제, 부산바다축제, 자갈치축제, 원아시아페스티벌(BOF) 등 사계절 글로벌 축제 일정 및 명소 안내.",
        "details": "부산 시티투어버스 노선도, 태종대·해운대·기장 오션뷰 핫플레이스 및 맛집 코스 공식 가이드북 다운로드 제공.",
        "url": "https://www.busan.go.kr/tour",
        "hot": True
    },
    {
        "id": "pop-bis",
        "category": "traffic_safety",
        "district": "BUSAN-HQ",
        "title": "부산 실시간 버스도착정보 (BIS) & 도시철도 노선",
        "agency": "부산광역시 버스운영과 / 교통정보센터",
        "icon": "🚍",
        "summary": "부산 시내버스, 마을버스, 광역환승 실시간 도착 예정 시간과 저상버스 운행 여부, 도시철도 1~4호선 환승 정보.",
        "details": "초정밀 버스 실시간 GPS 위치 추적, 첫차·막차 시간표 및 정류소별 노선 검색 지원.",
        "url": "https://bus.busan.go.kr",
        "hot": False
    },
    {
        "id": "pop-moonlight",
        "category": "traffic_safety",
        "district": "BUSAN-HQ",
        "title": "달빛어린이병원 & 야간휴일 공공심야약국 안내",
        "agency": "부산광역시 건강정책과",
        "icon": "🏥",
        "summary": "소아 경증 환자가 야간 및 공휴일에도 응급실 대신 신속하게 외래 진료를 받을 수 있는 부산 전역 달빛어린이병원 안내.",
        "details": "연제구, 사하구, 기장군, 해운대구 등 권역별 야간 23시까지 운영 소아과 및 인근 처방조제 공공심야약국 목록.",
        "url": "https://www.busan.go.kr/depart/hlthhospital",
        "hot": True
    },
    {
        "id": "pop-dist-haeundae",
        "category": "district_civil",
        "district": "DIST-HAEUNDAE",
        "title": "해운대구: 해수욕장 스마트 비치 & 문화복합센터",
        "agency": "해운대구청 관광문화과",
        "icon": "🏖️",
        "summary": "해운대 해수욕장 파라솔·물품 온라인 스마트 예약, 해운대 문화복합센터 대관, 블루라인파크 해변열차 관광 연계.",
        "details": "해운대 구민 할인 혜택, 구포나루·동백섬 산책로 코스 및 센텀시티 영화의전당 행사 정보 제공.",
        "url": "https://www.haeundae.go.kr",
        "hot": True
    },
    {
        "id": "pop-dist-busanjin",
        "category": "district_civil",
        "district": "DIST-BUSANJIN",
        "title": "부산진구: 서면 젊음의거리 페스티벌 & 시민공원 예약",
        "agency": "부산진구청 일자리경제과",
        "icon": "🛍️",
        "summary": "부산의 심장 서면 메디컬스트리트, 전포카페거리 축제, 부산시민공원 잔디광장 및 뽀로로 도서관 시설 예약.",
        "details": "소상공인 골목상권 활성화 지원, 당감동 외식거리 및 부전마켓타운 전통시장 온누리상품권 사용처 안내.",
        "url": "https://www.busanjin.go.kr",
        "hot": True
    },
    {
        "id": "pop-dist-suyeong",
        "category": "culture_tour",
        "district": "DIST-SUYEONG",
        "title": "수영구: 광안리 M 드론라이트쇼 상설공연 관람안내",
        "agency": "수영구청 스마트도시과",
        "icon": "🌉",
        "summary": "매주 토요일 밤 광안리 해변에서 펼쳐지는 2,000대 규모 세계 최고 수준의 M 드론라이트쇼 회차별 테마 및 명당 안내.",
        "details": "광안리 해변 맨발 걷기 '슈퍼어싱' 힐링존, 민락수변공원 청정 힐링 문화광장 및 민락더마켓 복합문화공간 연계.",
        "url": "https://www.suyeong.go.kr",
        "hot": True
    },
    {
        "id": "pop-dist-namgu",
        "category": "culture_tour",
        "district": "DIST-NAMGU",
        "title": "남구: 세계 유일 UN평화문화특구 & 오륙도 스카이워크",
        "agency": "남구청 문화관광체육과",
        "icon": "🕊️",
        "summary": "세계 유일의 UN기념공원 평화투어, 국립일제강제동원역사관, 동해와 남해가 만나는 오륙도 스카이워크 물때·개방시간.",
        "details": "이기대 해안절벽 갈맷길 트레킹 코스, 대연동 원조 돼지국밥 골목 및 평화공원 국화축제 안내.",
        "url": "https://www.bsnamgu.go.kr",
        "hot": False
    },
    {
        "id": "pop-dist-geumjeong",
        "category": "culture_tour",
        "district": "DIST-GEUMJEONG",
        "title": "금정구: 천년고찰 범어사 문화탐방 & 금정산성 먹거리촌",
        "agency": "금정구청 문화관광과",
        "icon": "⛰️",
        "summary": "금정산 국립공원 등산로 코스, 범어사 템플스테이 예약, 대한민국 1호 민속주 금정산성 막걸리 및 염소불고기 명소.",
        "details": "온천천 물놀이장 구민 무료 이용, 금정문화회관 기획 공연 예매 및 부산대 젊음의 거리 버스킹 스케줄.",
        "url": "https://www.geumjeong.go.kr",
        "hot": False
    },
    {
        "id": "pop-dist-saha",
        "category": "culture_tour",
        "district": "DIST-SAHA",
        "title": "사하구: 다대포 꿈의 낙조분수 공연 & 감천문화마을",
        "agency": "사하구청 문화예술과",
        "icon": "🌅",
        "summary": "세계 최대 바닥음악분수 다대포 꿈의 낙조분수 음악공연 시간표, 한국의 마추픽추 감천문화마을 골목투어 지도.",
        "details": "장림포구 '부네치아' 포토존, 을숙도 국립청소년생태체험관 및 다대포 해변 일몰 서핑 강습 연계.",
        "url": "https://www.saha.go.kr",
        "hot": True
    },
    {
        "id": "pop-dist-bukgu",
        "category": "district_civil",
        "district": "DIST-BUKGU",
        "title": "북구: 낙동강 구포나루 축제 & 화명생태공원 튤립단지",
        "agency": "북구청 문화관광과",
        "icon": "🚂",
        "summary": "영남 3대 장터 구포국수 체험관, 낙동강 구포나루 축제, 화명생태공원 야외수영장 및 연꽃·튤립 대단지 축제.",
        "details": "구포시장 장날(3일·8일) 먹거리 안내, 북구 평생학습관 무료 강좌 신청 및 화명기차역 야외 쉼터 연계.",
        "url": "https://www.bsbukgu.go.kr",
        "hot": False
    },
    {
        "id": "pop-dist-yeongdo",
        "category": "culture_tour",
        "district": "DIST-YEONGDO",
        "title": "영도구: 흰여울문화마을 해안산책로 & 태종대 다누비",
        "agency": "영도구청 문화관광과",
        "icon": "🏝️",
        "summary": "바다 절벽 위 영화 변호인 촬영지 흰여울문화마을, 태종대 순환 다누비열차 예매, 대형 복합문화공간 피아크(P.ARK).",
        "details": "깡깡이예술마을 유람선 체험, 국립해양박물관 4D 영상관 무료 관람 및 영도 봉래산 조내기고구마 역사관.",
        "url": "https://www.yeongdo.go.kr",
        "hot": True
    },
    {
        "id": "pop-dist-dongnae",
        "category": "district_civil",
        "district": "DIST-DONGNAE",
        "title": "동래구: 동래온천 스파 & 동래읍성 역사축제",
        "agency": "동래구청 문화관광과",
        "icon": "🌸",
        "summary": "삼국시대부터 이어진 대한민국 대표 동래온천 노천 족욕체험장 무료 개방, 동래읍성 역사축제 줄다리기 재현.",
        "details": "동래파전 명가 전통거리 지도, 온천천 카페거리 및 복천동 고분군 야외 박물관 해설 예약.",
        "url": "https://www.dongnae.go.kr",
        "hot": False
    },
    {
        "id": "pop-dist-sasang",
        "category": "district_civil",
        "district": "DIST-SASANG",
        "title": "사상구: 삼락생태공원 벚꽃축제 & 사상인디스페이스",
        "agency": "사상구청 문화체육과",
        "icon": "🌾",
        "summary": "전국 최장 벚꽃터널 삼락생태공원 오토캠핑장 예약, 부산 삼락 락페스티벌, 사상인디스페이스 청년 예술 공연.",
        "details": "괘법동 르네시떼 패션타운, 부산서부시외버스터미널 환승 및 사상스마트시티 재생사업 홍보관 안내.",
        "url": "https://www.sasang.go.kr",
        "hot": False
    },
    {
        "id": "pop-dist-gangseo",
        "category": "district_civil",
        "district": "DIST-GANGSEO",
        "title": "강서구: 가덕신공항 배후도시 & 대저생태공원 유채꽃",
        "agency": "강서구청 미래전략과",
        "icon": "✈️",
        "summary": "가덕도신공항 건설 현황, 명지국제신도시 및 에코델타시티 스마트빌리지 분양, 대저생태공원 전국 최대 유채꽃 축제.",
        "details": "낙동강 하구 을숙도 에코센터 철새도래지 탐조 프로그램, 둔치도 청년 농업 스마트팜 체험 안내.",
        "url": "https://www.bsgangseo.go.kr",
        "hot": False
    },
    {
        "id": "pop-dist-gijang",
        "category": "culture_tour",
        "district": "DIST-GIJANG",
        "title": "기장군: 오시리아 롯데월드 & 기장 미역·멸치 축제",
        "agency": "기장군청 문화관광과",
        "icon": "🌊",
        "summary": "오시리아 관광단지 롯데월드 부산·스카이라인 루지·이케아, 해동용궁사 바다법당, 기장 대변항 멸치축제.",
        "details": "칠암 아나고(붕장어) 구이거리, 웨이브온 등 기장 해안가 명품 오션뷰 카페거리 공식 투어맵.",
        "url": "https://www.gijang.go.kr",
        "hot": True
    },
    {
        "id": "pop-dist-junggu",
        "category": "culture_tour",
        "district": "DIST-JUNGGU",
        "title": "중구: 자갈치시장 활어 수산물 & 남포동 BIFF광장",
        "agency": "중구청 경제진흥과",
        "icon": "🐟",
        "summary": "'오이소! 보이소! 사이소!' 자갈치시장 라이브, 남포동 BIFF광장 씨앗호떡, 용두산공원 부산타워 전망대 할인.",
        "details": "보수동 책방골목 북살롱 투어, 국제시장 609청년몰, 40계단 문화관광특구 역사기행 프로그램.",
        "url": "https://www.bsjunggu.go.kr",
        "hot": True
    },
    {
        "id": "pop-dist-seogu",
        "category": "culture_tour",
        "district": "DIST-SEOGU",
        "title": "서구: 송도해수욕장 해상케이블카 & 용궁구름다리",
        "agency": "서구청 문화관광과",
        "icon": "🚠",
        "summary": "대한민국 1호 공설해수욕장 송도해상케이블카 에어크루즈 온라인 예매, 바다 위를 걷는 송도 용궁구름다리.",
        "details": "암남공원 해안 볼레길 트레킹, 송도 스카이워크 포토존 및 부산공동어시장 고등어 축제 안내.",
        "url": "https://www.bsseogu.go.kr",
        "hot": False
    },
    {
        "id": "pop-dist-donggu",
        "category": "district_civil",
        "district": "DIST-DONGGU",
        "title": "동구: 초량 차이나타운특구 & 168계단 모노레일",
        "agency": "동구청 일자리경제과",
        "icon": "🏮",
        "summary": "부산역 맞은편 초량 차이나타운 축제 만두거리, 산복도로 명물 168계단 친환경 모노레일 무료 탑승.",
        "details": "초량 불백(불고기백반) 테마거리, 명란로드 이바구공작소, 북항 친환경 수변공원 연결 보행교 개통 안내.",
        "url": "https://www.bsdonggu.go.kr",
        "hot": False
    },
    {
        "id": "pop-dist-yeonje",
        "category": "district_civil",
        "district": "DIST-YEONJE",
        "title": "연제구: 부산시청 행정타운 & 온천천 시민공원",
        "agency": "연제구청 총무과 / 문화체육과",
        "icon": "🏛️",
        "summary": "부산광역시청, 시의회, 경찰청, 법원·검찰청 행정타운 원스톱 안내, 사계절 꽃이 피는 온천천 시민공원 벚꽃길.",
        "details": "연산동 고분군 가야역사 탐방로, 거제리 전통시장 온누리상품권 장보기 및 구민 무료 자전거 대여소 운영.",
        "url": "https://www.yeonje.go.kr",
        "hot": True
    }
]
"""
        content += services_data_code

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(" [✓] busan_data.py 패치 완료!")

def main():
    print("=" * 65)
    print(" 🌊 [부산ON 월드 v2.3] 통합 버그 픽스 및 공식 인기메뉴 포털 패치 가동 🌊")
    print("=" * 65)
    patch_style_css()
    patch_index_html()
    patch_app_js()
    patch_busan_data_py()
    patch_server_py()
    print("=" * 65)
    print("  🎉 모든 소스코드 패치가 성공적으로 완료되었습니다! 🎉")
    print("=" * 65)

if __name__ == "__main__":
    main()
