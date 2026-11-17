# -*- coding: utf-8 -*-
"""
tripo_pipeline.py
부산ON 월드 - Tripo3D (tripo3d.ai) GenAI 3D 에셋 자동 생성 및 연동 파이프라인

사용법:
  1. 잔액 및 계정 상태 확인:
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --balance

  2. 사전 정의된 에셋 생성 (공무원, 회사원, 동백이, 시청 본관 등):
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --target civil_officer
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --target office_worker
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --target dongbaek
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --target city_hall

  3. 사용자 지정 텍스트 프롬프트로 생성:
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --prompt "Cute chibi Korean civil servant" --output models/civil_officer.glb
"""

import os
import sys
import time
import json
import argparse
import urllib.request
import urllib.error

API_BASE = "https://api.tripo3d.ai/v2/openapi"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

TARGET_PRESETS = {
    "civil_officer": {
        "prompt": "Cute stylized 3D Korean civil servant public official, wearing smart suit with city hall ID card lanyard badge on neck, clean hairstyle, friendly smiling face, chibi game asset, 8k pbr textures, rigged",
        "output": "models/civil_officer.glb",
        "desc": "부산시청 공무원 캐릭터 (공무원증 목걸이 & 단정한 정장)"
    },
    "office_worker": {
        "prompt": "Cute chibi Korean office worker businessman wearing stylish slim-fit navy suit with corporate employee lanyard card, holding leather briefcase, friendly expression, stylized 3d character, game ready, rigged",
        "output": "models/office_worker.glb",
        "desc": "스마트 회사원 캐릭터 (사원증 목걸이 & 비즈니스 정장 & 서류가방)"
    },
    "dongbaek": {
        "prompt": "Cute stylized 3D mascot of red camellia flower girl, chibi game character, vibrant red petals and green leaf ribbon, rigged",
        "output": "models/dongbaek.glb",
        "desc": "동백이 (시청 공식 길잡이 NPC)"
    },
    "boogi": {
        "prompt": "Cute cartoon seagull mascot wearing red framed eyeglasses and red sneakers, friendly expression, 3d game asset, rigged",
        "output": "models/boogi.glb",
        "desc": "부산시 소통 마스코트 부기 (갈매기)"
    },
    "city_hall": {
        "prompt": "Realistic modern Busan City Hall glass tower facade, architectural exterior, 8k pbr texture, clean windows, high quality glb",
        "output": "models/city_hall.glb",
        "desc": "부산광역시청 본관 행정 타워 외관"
    },
    "anchor_statue": {
        "prompt": "Grand bronze anchor monument sculpture on white marble pedestal, maritime symbol of Busan harbor, weathered bronze pbr",
        "output": "models/anchor_statue.glb",
        "desc": "시청 앞 광장 닻(Anchor) 상징 조형물"
    },
    "fountain": {
        "prompt": "Classic tiered architectural fountain basin with carved marble reliefs, plaza centerpiece, high detail",
        "output": "models/fountain.glb",
        "desc": "시민광장 중앙 음악 분수대"
    },
    "desk": {
        "prompt": "Modern curved public service reception desk, blue accent led, acrylic divider and service signs",
        "output": "models/desk.glb",
        "desc": "1층/2층 종합 안내 및 민원 상담 데스크"
    }
}

def get_balance(api_key):
    url = f"{API_BASE}/user/balance"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "User-Agent": USER_AGENT
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data.get("code") == 0:
                bal = data["data"].get("balance", 0)
                frozen = data["data"].get("frozen", 0)
                return bal, frozen
            else:
                print(f"❌ [오류] {data.get('message')}")
                return None, None
    except Exception as e:
        print(f"❌ [잔액 조회 실패] {e}")
        return None, None

def create_task_text_to_3d(api_key, prompt):
    url = f"{API_BASE}/task"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "User-Agent": USER_AGENT
    }
    payload = {
        "type": "text_to_model",
        "prompt": prompt
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data.get("code") == 0:
                task_id = data["data"]["task_id"]
                return task_id
            else:
                print(f"❌ [Tripo API 오류: 코드 {data.get('code')}] {data.get('message', 'Unknown error')}")
                if data.get("suggestion"):
                    print(f"   💡 제안: {data.get('suggestion')}")
                return None
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            err_json = json.loads(err_body)
            print(f"❌ [HTTP Error {e.code}] {err_json.get('message')}")
            if err_json.get('suggestion'):
                print(f"   💡 제안: {err_json.get('suggestion')}")
        except:
            print(f"❌ [HTTP Error {e.code}] {err_body}")
        return None
    except Exception as e:
        print(f"❌ [요청 예외] {e}")
        return None

def poll_task(api_key, task_id):
    url = f"{API_BASE}/task/{task_id}"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "User-Agent": USER_AGENT
    }
    print(f"⏳ [Tripo AI 3D 연산 중] Task ID: {task_id}")
    while True:
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if data.get("code") != 0:
                    print(f"❌ 오류: {data}")
                    return None
                status = data["data"]["status"]
                progress = data["data"].get("progress", 0)
                print(f"  ... 진행 상태: {status} ({progress}%)")
                if status == "success":
                    output = data["data"]["output"]
                    model_url = output.get("pbr_model") or output.get("model")
                    return model_url
                elif status in ["failed", "cancelled"]:
                    print(f"❌ 생성 실패: {data['data'].get('error')}")
                    return None
        except Exception as e:
            print(f"  ... 재시도 중 ({e})")
        time.sleep(3)

def download_model(model_url, output_path):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    print(f"⬇️ [다운로드 시작] {model_url} -> {output_path}")
    req = urllib.request.Request(model_url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as resp, open(output_path, 'wb') as f:
        f.write(resp.read())
    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"✨ [다운로드 완료!] 저장 경로: {output_path} ({file_size_mb:.2f} MB)")
    print(f"🎉 이제 부산ON 프로그램을 실행하거나 새로고침하면 고품질 3D 에셋이 즉시 반영됩니다!")

def check_models_dir():
    print("========================================================")
    print("🔍 [부산ON] Tripo3D models/ 에셋 폴더 상태 점검")
    print("========================================================")
    if not os.path.exists("models"):
        os.makedirs("models", exist_ok=True)
        print("📁 models/ 디렉터리를 새로 생성했습니다.")

    files = os.listdir("models")
    print(f"현재 models/ 내 파일 수: {len(files)}개")
    for f in files:
        fpath = os.path.join("models", f)
        size_kb = os.path.getsize(fpath) / 1024
        print(f"  - {f} ({size_kb:.1f} KB)")

    print("\n지원되는 주요 사전 정의 에셋 목록:")
    for key, info in TARGET_PRESETS.items():
        exists = "✅ 적용 중" if os.path.exists(info["output"]) else "⬜ 절차적 메쉬 대기 중"
        print(f"  [{key}] {info['desc']} -> {info['output']} ({exists})")
    print("========================================================")

def main():
    parser = argparse.ArgumentParser(description="부산ON 월드 - Tripo3D GenAI 에셋 파이프라인")
    parser.add_argument("--api-key", default="tsk_fa7-iYRGx72kG2Y4GBqYT1CXZ0FW775uvdR64-9JsUy", help="Tripo3D API Key")
    parser.add_argument("--balance", action="store_true", help="API 키 잔액(크레딧) 확인")
    parser.add_argument("--target", choices=list(TARGET_PRESETS.keys()), help="사전 정의된 타겟 에셋")
    parser.add_argument("--prompt", help="사용자 정의 텍스트 프롬프트")
    parser.add_argument("--image", help="Image-to-3D 이미지 파일 경로")
    parser.add_argument("--output", help="저장할 .glb 파일 경로")
    parser.add_argument("--check", action="store_true", help="현재 models 폴더 상태 검사")

    args = parser.parse_args()

    api_key = args.api_key

    if args.balance:
        bal, frozen = get_balance(api_key)
        print("========================================================")
        print(f"🔑 Tripo API Key: {api_key[:10]}...{api_key[-6:]}")
        if bal is not None:
            print(f"💰 현재 보유 크레딧: {bal} Credits (동결: {frozen})")
            if bal == 0:
                print("\n⚠️ [크레딧 부족 안내]")
                print("  현재 Tripo API 크레딧이 0개입니다.")
                print("  Tripo는 모델 1개 생성 시 약 15~35 크레딧이 소모됩니다.")
                print("  • $10 충전 시: 1,000 크레딧 제공 (약 30~50개 3D 모델 생성 가능)")
                print("  • 충전 방법: https://tripo3d.ai 로그인 -> 좌측 하단 프로필 -> Billing / Pricing 에서 구매")
        print("========================================================")
        return

    if args.check or (not args.target and not args.prompt):
        check_models_dir()
        bal, _ = get_balance(api_key)
        if bal is not None:
            print(f"💰 현재 Tripo 크레딧: {bal} Credits")
        return

    prompt = args.prompt
    output_path = args.output

    if args.target:
        preset = TARGET_PRESETS[args.target]
        prompt = preset["prompt"]
        if not output_path:
            output_path = preset["output"]
        print(f"🎯 타겟 선택: [{args.target}] {preset['desc']}")

    if not prompt:
        print("❌ 생성할 프롬프트가 지정되지 않았습니다.")
        sys.exit(1)

    if not output_path:
        output_path = "models/custom_asset.glb"

    print(f"🚀 [Tripo3D 요청 시작] 프롬프트: \"{prompt}\"")
    task_id = create_task_text_to_3d(api_key, prompt)
    if not task_id:
        print("❌ 작업 생성에 실패했습니다.")
        sys.exit(1)

    model_url = poll_task(api_key, task_id)
    if not model_url:
        print("❌ 3D 모델 생성 실패.")
        sys.exit(1)

    download_model(model_url, output_path)

if __name__ == "__main__":
    main()
