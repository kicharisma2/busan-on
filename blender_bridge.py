# -*- coding: utf-8 -*-
"""
부산ON x Blender 5.3 3D AI Bridge & Automation Pipeline
- Tripo 3D AI 연동 및 상태 점검
- 블렌더 원클릭 실행
- 3D 모델(GLB) 블렌더 임포트/익스포트 및 메타버스 최적화 연동
"""

import os
import sys
import subprocess
import argparse

BLENDER_PATH = r"C:\Program Files\Blender Foundation\Blender 5.3\blender.exe"
TRIPO_API_KEY = "tsk_fa7-iYRGx72kG2Y4GBqYT1CXZ0FW775uvdR64-9JsUy"

def check_blender():
    if not os.path.exists(BLENDER_PATH):
        print(f"❌ 블렌더 5.3 실행 파일을 찾을 수 없습니다: {BLENDER_PATH}")
        return False
    print(f"✅ 블렌더 5.3 감지됨: {BLENDER_PATH}")
    return True

def check_tripo_status():
    if not check_blender():
        return
    
    script = """
import bpy, asyncio
try:
    mod = __import__('tripo-3d-for-blender')
    api_key = bpy.context.scene.api_key
    print(f'🔑 등록된 Tripo API Key: {api_key[:10]}... (총 {len(api_key)}자)')
    asyncio.run(mod.utils.Update_User_balance(api_key, bpy.context))
    balance = bpy.context.scene.user_balance
    print(f'💰 현재 사용 가능한 Tripo AI 크레딧 잔액: {balance} 크레딧')
    print('✨ Tripo 3D AI 애드온 정상 연동 완료!')
except Exception as e:
    print(f'❌ 연동 확인 중 오류 발생: {e}')
"""
    cmd = [BLENDER_PATH, "--background", "--python-expr", script]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    for line in res.stdout.splitlines():
        if any(tag in line for tag in ['Tripo', 'API Key', '크레딧', '오류', '잔액']):
            print(line)

def launch_blender():
    if not check_blender():
        return
    env = os.environ.copy()
    env["TRIPO_API_KEY"] = TRIPO_API_KEY
    print("🚀 Blender 5.3 3D AI 스튜디오를 실행합니다...")
    subprocess.Popen([BLENDER_PATH], env=env)

def main():
    parser = argparse.ArgumentParser(description="부산ON x Blender 3D AI 연동 도구")
    parser.add_argument("--status", action="store_true", help="Tripo 3D AI 애드온 및 크레딧 상태 점검")
    parser.add_argument("--launch", action="store_true", help="블렌더 5.3 실행")
    args = parser.parse_args()

    if args.status:
        check_tripo_status()
    elif args.launch:
        launch_blender()
    else:
        print("="*60)
        print("  🎨 부산ON x Blender 5.3 3D AI 브릿지")
        print("="*60)
        check_tripo_status()
        print("\n[안내] 블렌더를 실행하려면: python blender_bridge.py --launch")
        print("또는 '블렌더_AI_실행하기.bat'을 더블 클릭하세요.")

if __name__ == "__main__":
    main()
