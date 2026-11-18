# -*- mode: python ; coding: utf-8 -*-

a = Analysis(
    ['start_online_server.py'],
    pathex=[],
    binaries=[('cloudflared.exe', '.')],
    datas=[
        ('index.html', '.'),
        ('style.css', '.'),
        ('app.js', '.'),
        ('audio.js', '.'),
        ('three.min.js', '.'),
        ('GLTFLoader.js', '.'),
        ('DRACOLoader.js', '.'),
        ('models', 'models'),
        ('OrbitControls.js', '.'),
        ('busan_data.py', '.'),
        ('district_details.json', '.'),
        ('open_data.json', '.')
    ],
    hiddenimports=[
        'urllib.request',
        'json',
        'server',
        'busan_data'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='부산ON_글로벌서버_v3',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None
)
