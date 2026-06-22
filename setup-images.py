#!/usr/bin/env python3
"""
이재희 포트폴리오 — 이미지 설치 스크립트
터미널에서 실행: python3 setup-images.py
"""

import os
import shutil

# ── 경로 설정 ──────────────────────────────────────────────
HOME = os.path.expanduser('~')
DRIVE = os.path.join(HOME, 'Library', 'CloudStorage',
                     'GoogleDrive-mhmte123@gmail.com', '내 드라이브', '포트폴리오')
SITE  = os.path.join(HOME, 'Documents', 'portfolio_jaehee')

# ── 이미지 매핑 (원본 경로 → 대상 경로) ──────────────────────
COPY_MAP = {
    # SNS 배너
    os.path.join('SNS 배너', '노라니스튜디오', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'norani.jpg'),
    os.path.join('SNS 배너', '아루다', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'aruda.jpg'),
    os.path.join('SNS 배너', '비버클린', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'beaverclean.jpg'),
    os.path.join('SNS 배너', '모위', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'mowi.jpg'),
    os.path.join('SNS 배너', '진영코리아', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'jinyoung.jpg'),
    os.path.join('SNS 배너', '블루코어컴퍼니 (AI 활용 이미지)', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'bluecore.jpg'),
    os.path.join('SNS 배너', '신한라이프', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'shinhan.jpg'),
    os.path.join('SNS 배너', '한국제다', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'hankookjeda.jpg'),
    os.path.join('SNS 배너', '24인치의원', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', '24clinic.jpg'),
    os.path.join('SNS 배너', '메이포레', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'mayfore.jpg'),
    os.path.join('SNS 배너', '두부만드는집', '두부만드는집_메뉴판_v1.3_이재희 선임_20251013.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'tofu.jpg'),
    os.path.join('SNS 배너', '지금바다', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'jigumbada.jpg'),
    os.path.join('SNS 배너', '모현상회', '01.jpg'):
        os.path.join('assets', 'images', 'graphic', 'sns', 'mohyun.jpg'),

    # 상세페이지
    os.path.join('상세페이지', '플라이삼육오', '플라이삼육오_LA꽃갈비 상세페이지_v1.0_이재희 선임_20250901.jpg'):
        os.path.join('assets', 'images', 'graphic', 'detail', 'fly365.jpg'),
    os.path.join('상세페이지', '한샘(엠시스)', '한샘_상세페이지_라운드터치후드_v2.3_이재희 선임_20251016.jpg'):
        os.path.join('assets', 'images', 'graphic', 'detail', 'hanssem.jpg'),

    # 블로그 스킨
    os.path.join('블로그 스킨', '우성건설_블로그스킨_v1.2_이재희 주임_20250828.jpg'):
        os.path.join('assets', 'images', 'graphic', 'blog', 'woosung.jpg'),
    os.path.join('블로그 스킨', '그림앤나드로잉카페_블로그스킨_v1.0_이재희 선임_20251024.jpg'):
        os.path.join('assets', 'images', 'graphic', 'blog', 'drawing.jpg'),

    # 패키지 디자인
    os.path.join('패키지 디자인', '작업물 복사.jpg'):
        os.path.join('assets', 'images', 'graphic', 'package', 'package.jpg'),
}

# ── 실행 ──────────────────────────────────────────────────
def main():
    print('=' * 50)
    print(' 이재희 포트폴리오 이미지 설치 스크립트')
    print('=' * 50)

    ok, fail = 0, 0

    for src_rel, dst_rel in COPY_MAP.items():
        src = os.path.join(DRIVE, src_rel)
        dst = os.path.join(SITE, dst_rel)

        # 대상 폴더 생성
        os.makedirs(os.path.dirname(dst), exist_ok=True)

        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f'  ✅ {os.path.basename(dst)}')
            ok += 1
        else:
            print(f'  ⚠️  원본 없음: {src_rel}')
            fail += 1

    print()
    print(f'완료: {ok}개 복사, {fail}개 누락')
    if fail > 0:
        print('→ 누락 파일은 Google Drive에서 "오프라인 사용 가능"으로 설정 후 다시 실행하세요.')
    else:
        print('→ 모든 이미지가 portfolio_jaehee에 설치되었습니다!')

if __name__ == '__main__':
    main()
