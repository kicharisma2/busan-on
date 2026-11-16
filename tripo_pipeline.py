# -*- coding: utf-8 -*-
"""
tripo_pipeline.py
부산ON 월드 - Tripo3D (tripo3d.ai) GenAI 3D 에셋 자동 생성 및 연동 파이프라인

사용법:
  1. 사전 정의된 에셋 생성 (동백이, 시청 본관, 부기, 닻 조형물 등):
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --target dongbaek
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --target city_hall
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --target boogi

  2. 사용자 지정 텍스트 프롬프트로 생성:
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --prompt "Cute seagull 3d mascot" --output models/boogi.glb

  3. 2D 사진 이미지로 3D 모델 생성 (Image to 3D):
     python tripo_pipeline.py --api-key YOUR_TRIPO_KEY --image city_hall_photo.jpg --output models/city_hall.glb

  4. 연결 상태 및 모델 폴더 검사:
     python tripo_pipeline.py --check
"""

import os
import sys
import time
import json
import argparse
import urllib.request
import urllib.error

API_BASE = "https://api.tripo3d.ai/v2/openapi"

TARGET_PRESETS = {
    "city_hall": {
        "prompt": "Realistic modern Busan City Hall glass tower facade, architectural exterior, 8k pbr texture, clean windows, high quality glb",
        "output": "models/city_hall.glb",
        "desc": "부산광역시청 본관 행정 타워 외관"
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

def create_task_text_to_3d(api_key, prompt):
    url = f"{API_BASE}/task"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
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
                print(f"❌ [Tripo API 오류] {data.get('message', 'Unknown error')}")
                return None
    except urllib.error.HTTPError as e:
        print(f"❌ [HTTP Error {e.code}] {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"❌ [요청 예외] {e}")
        return None

def poll_task(api_key, task_id):
    url = f"{API_BASE}/task/{task_id}"
    headers = {
        "Authorization": f"Bearer {api_key}"
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
    urllib.request.urlretrieve(model_url, output_path)
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
    parser.add_argument("--api-key", help="Tripo3D API Key (tripo3d.ai에서 발급)")
    parser.add_argument("--target", choices=list(TARGET_PRESETS.keys()), help="사전 정의된 타겟 에셋")
    parser.add_argument("--prompt", help="사용자 정의 텍스트 프롬프트")
    parser.add_argument("--image", help="Image-to-3D 이미지 파일 경로")
    parser.add_argument("--output", help="저장할 .glb 파일 경로")
    parser.add_argument("--check", action="store_true", help="현재 models 폴더 상태 검사")

    args = parser.parse_args()

    if args.check or (not args.api_key and not args.target and not args.prompt):
        check_models_dir()
        if not args.api_key:
            print("\n💡 [안내] Tripo3D API 키를 입력하면 AI 3D 모델 생성을 바로 시작할 수 있습니다.")
            print("   예시: python tripo_pipeline.py --api-key YOUR_KEY --target dongbaek")
        return

    if not args.api_key:
        print("❌ --api-key 인자가 필요합니다. (tripo3d.ai 웹사이트 계정 설정에서 발급)")
        sys.exit(1)

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
    task_id = create_task_text_to_3d(args.api_key, prompt)
    if not task_id:
        print("❌ 작업 생성에 실패했습니다.")
        sys.exit(1)

    model_url = poll_task(args.api_key, task_id)
    if not model_url:
        print("❌ 3D 모델 생성 실패.")
        sys.exit(1)

    download_model(model_url, output_path)

if __name__ == "__main__":
    main()
