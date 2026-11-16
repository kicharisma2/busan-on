# -*- coding: utf-8 -*-
import urllib.request
import json
import time
import threading
import server

# Start server on test port 8089
port = 8089
t = server.start_server_in_background(port)
time.sleep(1.0)

test_urls = [
    f"http://localhost:{port}/index.html",
    f"http://localhost:{port}/style.css?v=2.1.0",
    f"http://localhost:{port}/app.js?v=2.1.0",
    f"http://localhost:{port}/open_data.json",
    f"http://localhost:{port}/api/open-data/budgets",
    f"http://localhost:{port}/api/open-data/budgets?year=2026",
    f"http://localhost:{port}/api/open-data/projects",
    f"http://localhost:{port}/api/open-data/news",
    f"http://localhost:{port}/api/open-data/stats",
    f"http://localhost:{port}/api/open-data/ranks",
    f"http://localhost:{port}/api/open-data/missions",
    f"http://localhost:{port}/api/open-data/all",
    f"http://localhost:{port}/api/districts",
    f"http://localhost:{port}/api/popular-menus",
    f"http://localhost:{port}/api/popular-menus?cat=city_top10",
    f"http://localhost:{port}/api/district-details",
    f"http://localhost:{port}/api/gourmet",
    f"http://localhost:{port}/api/libraries"
]

all_passed = True
for url in test_urls:
    try:
        with urllib.request.urlopen(url, timeout=3) as res:
            data = res.read()
            status = res.status
            print(f"[OK] {status} | Size: {len(data):6d} bytes | {url}")
            assert status == 200
    except Exception as e:
        print(f"[FAIL] {url}: {e}")
        all_passed = False

server.stop_server()

if all_passed:
    print("\n🎉 ALL 16 ENDPOINTS PASSED WITH 200 OK!")
else:
    print("\n❌ SOME ENDPOINTS FAILED!")
    exit(1)
