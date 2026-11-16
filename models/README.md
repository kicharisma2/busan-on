# 부산ON 월드 - Tripo3D 에셋 가이드 (models/)

이 폴더(`models/`)는 **Tripo3D (tripo3d.ai)** 에서 생성된 고품질 3D 모델(`.glb` / `.gltf`)을 저장하는 공간입니다.
웹 브라우저 및 실행 프로그램이 시작될 때 이 폴더를 자동으로 감지하여, 기존 박스형/절차적 메쉬를 고품질 실사/카툰 3D 모델로 즉시 자동 교체합니다.

---

## 📁 자동 교체 지원 모델 파일명 규칙

| 파일명 | 대상 오브젝트 | 설명 | 권장 Tripo 프롬프트 / 설정 |
|---|---|---|---|
| `city_hall.glb` | **부산광역시청 본관 청사** | 박스형 건물 외관을 실제 유리 파사드 현대식 타워로 교체 | `Realistic modern Busan City Hall glass tower facade, architectural exterior, 8k pbr texture, clean windows, high quality glb` |
| `dongbaek.glb` | **동백이 (시청 길잡이 NPC)** | 동백꽃 요정/소녀 마스코트 3D 캐릭터 | `Cute stylized 3D mascot of red camellia flower girl, chibi game character, vibrant colors, rigged` |
| `boogi.glb` | **부산시 마스코트 부기** | 빨간 안경과 운동화를 신은 부산 갈매기 부기 | `Cute cartoon seagull mascot wearing red framed eyeglasses and red sneakers, friendly expression, 3d game asset, rigged` |
| `anchor_statue.glb` | **시청 앞 닻(Anchor) 상징 조형물** | 중앙 광장 기념비 | `Grand bronze anchor monument sculpture on marble pedestal, maritime symbol, weathered bronze pbr` |
| `fountain.glb` | **음악 분수대 조형** | 광장 원형 분수대 석조물 | `Classic tiered architectural fountain basin with carved marble reliefs, plaza centerpiece` |
| `desk.glb` | **민원실 종합 카운터** | 1층/2층 안내 및 민원 창구 | `Modern curved public service reception desk, blue accent led, acrylic divider` |

---

## 🚀 Tripo3D 생성 및 적용 3단계

### 방법 1. Tripo 웹 스튜디오에서 직접 받기 (가장 쉽고 편리함)
1. **[https://tripo3d.ai](https://tripo3d.ai)** 접속 후 로그인 (무료 계정 생성 가능)
2. **Text to 3D** 또는 **Image to 3D** 선택:
   - 프롬프트에 위의 권장 프롬프트를 입력하거나, 부산시청/동백이 사진을 업로드합니다.
3. 생성이 완료되면 오른쪽 상단의 **Export** 버튼 클릭 -> 포맷을 **`GLB`** 로 선택하여 다운로드합니다.
4. 다운로드된 파일 이름을 위의 표에 맞춰 변경한 뒤 이 `models/` 폴더에 넣고 새로고침(또는 프로그램 재실행)하면 끝!

### 방법 2. Python 자동화 스크립트 실행 (API 연동)
1. Tripo 웹사이트 설정(Settings -> API Keys)에서 API 키를 발급받습니다.
2. 터미널에서 다음 명령을 실행합니다:
   ```bash
   python tripo_pipeline.py --api-key YOUR_API_KEY --target dongbaek
   ```
   스크립트가 알아서 AI 생성을 요청하고, 완료되면 `models/dongbaek.glb`로 자동 저장합니다!
