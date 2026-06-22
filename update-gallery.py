#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
갤러리 자동 업데이트 스크립트
-------------------------------
사용법:
  1. 이미지를 아래 폴더에 저장
     assets/images/graphic/sns/        ← SNS 배너
     assets/images/graphic/detail/     ← 상세페이지
     assets/images/graphic/blog/       ← 블로그 스킨
     assets/images/graphic/package/    ← 패키지
     assets/images/graphic/logo/       ← 로고
     assets/images/graphic/web/        ← 웹디자인
  2. 터미널에서 실행: python3 update-gallery.py
"""

import os
import re
import unicodedata

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MAIN_JS  = os.path.join(BASE_DIR, 'assets', 'js', 'main.js')

CATEGORIES = {
    'banner':  ('assets/images/graphic/banner',  '배너 디자인'),
    'detail':  ('assets/images/graphic/detail',  '상세페이지 디자인'),
    'blog':    ('assets/images/graphic/blog',    '블로그 스킨'),
    'package': ('assets/images/graphic/package', '패키지 디자인'),
    'logo':    ('assets/images/graphic/logo',    '로고 디자인'),
    'web':     ('assets/images/graphic/web',     '웹 디자인'),
    'photo':   ('assets/images/graphic/photo',   '사진촬영'),
}

IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

CAT_LABELS = {
    'banner': '배너',
    'detail': '상세페이지',
    'blog': '블로그 스킨',
    'package': '패키지',
    'logo': '로고',
    'web': '웹디자인',
    'photo': '사진촬영',
}


def scan_images():
    found = []
    for category, (rel_path, default_desc) in CATEGORIES.items():
        abs_path = os.path.join(BASE_DIR, *rel_path.split('/'))
        if not os.path.exists(abs_path):
            os.makedirs(abs_path)
            print(f"  📁 폴더 생성: {rel_path}")
            continue
        for fname in sorted(os.listdir(abs_path)):
            if os.path.splitext(fname)[1].lower() in IMAGE_EXTS:
                src = f"{rel_path}/{fname}"
                fname_nfc = unicodedata.normalize('NFC', fname)
                title = os.path.splitext(fname_nfc)[0].replace('-', ' ').replace('_', ' ')
                found.append({
                    'src': src,
                    'category': category,
                    'title': title,
                    'desc': default_desc,
                })
    return found


def read_existing_metadata(js_content):
    metadata = {}
    pattern = r"src:\s*'([^']+)'[^}]*?title:\s*'([^']*)'[^}]*?desc:\s*'([^']*)'"
    for m in re.finditer(pattern, js_content, re.DOTALL):
        metadata[m.group(1)] = {'title': m.group(2), 'desc': m.group(3)}
    return metadata


def build_gallery_js(items):
    lines = []
    prev_cat = None
    for item in items:
        if item['category'] != prev_cat:
            lines.append(f"  // {CAT_LABELS.get(item['category'], item['category'])}")
            prev_cat = item['category']
        lines.append(
            f"  {{ src: '{item['src']}', "
            f"category: '{item['category']}', "
            f"title: '{item['title']}', "
            f"desc: '{item['desc']}' }},"
        )
    return '\n'.join(lines)


def update_main_js(new_items_js):
    with open(MAIN_JS, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'(const galleryItems\s*=\s*\[)[\s\S]*?(\];)'
    new_content = re.sub(pattern, f'\\1\n{new_items_js}\n\\2', content)

    if new_content == content:
        print("⚠️  main.js에서 galleryItems를 찾지 못했어요.")
        return False

    with open(MAIN_JS, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True


def main():
    print("\n🔍 이미지 폴더 스캔 중...\n")

    with open(MAIN_JS, 'r', encoding='utf-8') as f:
        js_content = f.read()

    existing = read_existing_metadata(js_content)
    scanned  = scan_images()

    new_items, added = [], []
    for item in scanned:
        if item['src'] in existing:
            item['title'] = existing[item['src']]['title']
            item['desc']  = existing[item['src']]['desc']
        else:
            added.append(item['src'])
        new_items.append(item)

    new_items_js = build_gallery_js(new_items)

    if update_main_js(new_items_js):
        print(f"✅ 완료! 총 {len(new_items)}개 이미지 등록\n")
        if added:
            print(f"  ✨ 새로 추가된 이미지 {len(added)}개:")
            for src in added:
                print(f"     {src}")
        else:
            print("  변경된 이미지 없음")
    print()


if __name__ == '__main__':
    main()
