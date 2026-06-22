/* =============================================
   이재희 포트폴리오 — main.js
   ============================================= */

/* ── Text Scramble ──
   히어로 이름(JAEHEE LEE)의 글자 해독 효과는 React Bits DecryptedText를
   포팅한 assets/js/decrypted-text.js로 옮겼다. (이 파일이 끝나면 그쪽이
   herotext-ready 이벤트를 쏴서 FuzzyText 연동도 그대로 이어진다.) */

/* ── Gallery Data ── */
const galleryItems = [
  // 대표작 (다양한 카테고리 믹스 — 그래픽 디자인 섹션 첫 화면에 보여줄 작업물)
  { src: 'assets/images/graphic/banner/bluecore.jpg', category: 'banner', title: '블루코어컴퍼니', desc: 'SNS 피드 (AI 이미지 활용)' },
  { src: 'assets/images/graphic/detail/이수연코스메틱_상세페이지_클렌징파우더.jpg', category: 'detail', title: '이수연코스메틱 상세페이지 클렌징파우더', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/web/더마름다이어트_메인홈_1.jpg', category: 'web', title: '더마름다이어트 메인홈 1', desc: '웹 디자인' },
  { src: 'assets/images/graphic/package/가인미가_패키지_달력_1.png', category: 'package', title: '가인미가 패키지 달력 1', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/banner/shinhan.jpg', category: 'banner', title: '신한라이프', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/blog/온다패션_블로그 스킨.png', category: 'blog', title: '온다패션 블로그 스킨', desc: '블로그 스킨' },
  { src: 'assets/images/graphic/detail/hanssem.jpg', category: 'detail', title: '한샘(엠시스)', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/logo/대한명품감정원_로고.jpg', category: 'logo', title: '대한명품감정원 로고', desc: '로고 디자인' },
  { src: 'assets/images/graphic/web/가인미가_메인홈_1.png', category: 'web', title: '가인미가 메인홈 1', desc: '웹 디자인' },
  { src: 'assets/images/graphic/package/더마름다이어트_패키지_마스크팩.jpg', category: 'package', title: '더마름다이어트 패키지 마스크팩', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/photo/아데스카_사진촬영.png', category: 'photo', title: '아데스카 사진촬영', desc: '사진촬영' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_코스메틱배너_1.jpg', category: 'banner', title: '가인미가 SNS 코스메틱배너 1', desc: 'SNS 피드 디자인' },

  // 배너
  { src: 'assets/images/graphic/banner/24clinic.jpg', category: 'banner', title: '24인치의원', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/aruda.jpg', category: 'banner', title: '아루다', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/beaverclean.jpg', category: 'banner', title: '비버클린', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/hankookjeda.jpg', category: 'banner', title: '한국제다', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/jigumbada.jpg', category: 'banner', title: '지금바다', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/jinyoung.jpg', category: 'banner', title: '진영코리아', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/mayfore.jpg', category: 'banner', title: '메이포레', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/mohyun.jpg', category: 'banner', title: '모현상회', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/mowi.jpg', category: 'banner', title: '모위', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/norani.jpg', category: 'banner', title: '노라니스튜디오', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_리뷰왕이벤트_1.jpg', category: 'banner', title: '가인미가 SNS 리뷰왕이벤트 1', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_시크릿쿠폰.jpg', category: 'banner', title: '가인미가 SNS 시크릿쿠폰', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_신부관리.jpg', category: 'banner', title: '가인미가 SNS 신부관리', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_이벤트.jpg', category: 'banner', title: '가인미가 SNS 이벤트', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_쪼여준다_1.jpg', category: 'banner', title: '가인미가 SNS 쪼여준다 1', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_쪼여준다_2.jpg', category: 'banner', title: '가인미가 SNS 쪼여준다 2', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_첫방문이벤트.jpg', category: 'banner', title: '가인미가 SNS 첫방문이벤트', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_코스메틱배너_2.jpg', category: 'banner', title: '가인미가 SNS 코스메틱배너 2', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_코스메틱배너_3.jpg', category: 'banner', title: '가인미가 SNS 코스메틱배너 3', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_헤이가인미가.jpg', category: 'banner', title: '가인미가 SNS 헤이가인미가', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/가인미가_SNS_환승얼굴.jpg', category: 'banner', title: '가인미가 SNS 환승얼굴', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/더마름다이어트_SNS_광고배너.jpg', category: 'banner', title: '더마름다이어트 SNS 광고배너', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/더마름다이어트_SNS_그랜드오픈_1.jpg', category: 'banner', title: '더마름다이어트 SNS 그랜드오픈 1', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/더마름다이어트_SNS_그랜드오픈배너_1.jpg', category: 'banner', title: '더마름다이어트 SNS 그랜드오픈배너 1', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/더마름다이어트_SNS_그랜드오픈배너_2.jpg', category: 'banner', title: '더마름다이어트 SNS 그랜드오픈배너 2', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/더마름다이어트_SNS_봄날의신부.jpg', category: 'banner', title: '더마름다이어트 SNS 봄날의신부', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/더마름다이어트_SNS_서포터즈.jpg', category: 'banner', title: '더마름다이어트 SNS 서포터즈', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/더마름다이어트_SNS_이벤트.jpg', category: 'banner', title: '더마름다이어트 SNS 이벤트', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/더마름다이어트_SNS_인바디후기.jpg', category: 'banner', title: '더마름다이어트 SNS 인바디후기', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_가을슈즈대전.jpg', category: 'banner', title: '온다패션 가을슈즈대전', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_가을자켓 아우터 기획전.jpg', category: 'banner', title: '온다패션 가을자켓 아우터 기획전', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_겨울 패딩 아우터 기획전.jpg', category: 'banner', title: '온다패션 겨울 패딩 아우터 기획전', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_겨울 패딩 아우터 기획전_2.jpg', category: 'banner', title: '온다패션 겨울 패딩 아우터 기획전 2', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_나만없어명품패딩.jpg', category: 'banner', title: '온다패션 나만없어명품패딩', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_버버리 블로그 배너.jpg', category: 'banner', title: '온다패션 버버리 블로그 배너', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_샤넬구매대행.jpg', category: 'banner', title: '온다패션 샤넬구매대행', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_슈퍼위크.jpg', category: 'banner', title: '온다패션 슈퍼위크', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_온다세일게임.jpg', category: 'banner', title: '온다패션 온다세일게임', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_위클리특가전.jpg', category: 'banner', title: '온다패션 위클리특가전', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_지갑 기획전.jpg', category: 'banner', title: '온다패션 지갑 기획전', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_채용공고이미지_1.jpg', category: 'banner', title: '온다패션 채용공고이미지 1', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_채용공고이미지_2.jpg', category: 'banner', title: '온다패션 채용공고이미지 2', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_크록스 기획전_1.jpg', category: 'banner', title: '온다패션 크록스 기획전 1', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_크록스 기획전_2.png', category: 'banner', title: '온다패션 크록스 기획전 2', desc: 'SNS 피드 디자인' },
  { src: 'assets/images/graphic/banner/온다패션_포토리뷰.jpg', category: 'banner', title: '온다패션 포토리뷰', desc: 'SNS 피드 디자인' },
  // 상세페이지
  { src: 'assets/images/graphic/detail/fly365.jpg', category: 'detail', title: '플라이삼육오', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_굿나잇라이트_PC_1.jpg', category: 'detail', title: '교보핫트랙스 굿나잇라이트 PC 1', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_굿나잇라이트_PC_2.gif', category: 'detail', title: '교보핫트랙스 굿나잇라이트 PC 2', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_굿나잇라이트_PC_3.jpg', category: 'detail', title: '교보핫트랙스 굿나잇라이트 PC 3', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_굿나잇라이트_모바일_1.jpg', category: 'detail', title: '교보핫트랙스 굿나잇라이트 모바일 1', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_굿나잇라이트_모바일_2.gif', category: 'detail', title: '교보핫트랙스 굿나잇라이트 모바일 2', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_굿나잇라이트_모바일_3.jpg', category: 'detail', title: '교보핫트랙스 굿나잇라이트 모바일 3', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_기분좋은선택_PC.jpg', category: 'detail', title: '교보핫트랙스 기분좋은선택 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_기분좋은선택_모바일.jpg', category: 'detail', title: '교보핫트랙스 기분좋은선택 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_기억보관함노트_PC.jpg', category: 'detail', title: '교보핫트랙스 기억보관함노트 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_기억보관함노트_모바일.jpg', category: 'detail', title: '교보핫트랙스 기억보관함노트 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_넛츠바_PC.jpg', category: 'detail', title: '교보핫트랙스 넛츠바 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_넛츠바_모바일.jpg', category: 'detail', title: '교보핫트랙스 넛츠바 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_동아_PC.jpg', category: 'detail', title: '교보핫트랙스 동아 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_동아_모바일.jpg', category: 'detail', title: '교보핫트랙스 동아 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_랄랄라타운_PC.jpg', category: 'detail', title: '교보핫트랙스 랄랄라타운 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_랄랄라타운_모바일.jpg', category: 'detail', title: '교보핫트랙스 랄랄라타운 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_로지텍_PC.jpg', category: 'detail', title: '교보핫트랙스 로지텍 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_로지텍_모바일.jpg', category: 'detail', title: '교보핫트랙스 로지텍 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_로투스_PC.jpg', category: 'detail', title: '교보핫트랙스 로투스 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_로투스_모바일.jpg', category: 'detail', title: '교보핫트랙스 로투스 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_바디스크럽_PC_1.jpg', category: 'detail', title: '교보핫트랙스 바디스크럽 PC 1', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_바디스크럽_PC_2.gif', category: 'detail', title: '교보핫트랙스 바디스크럽 PC 2', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_바디스크럽_PC_3.jpg', category: 'detail', title: '교보핫트랙스 바디스크럽 PC 3', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_바디스크럽_모바일_1.jpg', category: 'detail', title: '교보핫트랙스 바디스크럽 모바일 1', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_바디스크럽_모바일_2.gif', category: 'detail', title: '교보핫트랙스 바디스크럽 모바일 2', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_바디스크럽_모바일_3.jpg', category: 'detail', title: '교보핫트랙스 바디스크럽 모바일 3', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_배불바_PC.jpg', category: 'detail', title: '교보핫트랙스 배불바 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_배불바_모바일.jpg', category: 'detail', title: '교보핫트랙스 배불바 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_보싸인_PC.jpg', category: 'detail', title: '교보핫트랙스 보싸인 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_보싸인_모바일.jpg', category: 'detail', title: '교보핫트랙스 보싸인 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_북프렌즈_PC.jpg', category: 'detail', title: '교보핫트랙스 북프렌즈 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_북프렌즈_모바일.jpg', category: 'detail', title: '교보핫트랙스 북프렌즈 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_시라쿠스_PC.jpg', category: 'detail', title: '교보핫트랙스 시라쿠스 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_시라쿠스_모바일.jpg', category: 'detail', title: '교보핫트랙스 시라쿠스 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_아케소_PC.jpg', category: 'detail', title: '교보핫트랙스 아케소 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_아케소_모바일.jpg', category: 'detail', title: '교보핫트랙스 아케소 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_에어팟맥스_PC.jpg', category: 'detail', title: '교보핫트랙스 에어팟맥스 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_에어팟맥스_모바일.jpg', category: 'detail', title: '교보핫트랙스 에어팟맥스 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_제티_PC.jpg', category: 'detail', title: '교보핫트랙스 제티 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_제티_모바일.jpg', category: 'detail', title: '교보핫트랙스 제티 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_코스타노바_PC.jpg', category: 'detail', title: '교보핫트랙스 코스타노바 PC', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/교보핫트랙스_코스타노바_모바일.jpg', category: 'detail', title: '교보핫트랙스 코스타노바 모바일', desc: '상세페이지 디자인' },
  { src: 'assets/images/graphic/detail/한우먹는날_한우등심양념구이.jpg', category: 'detail', title: '한우먹는날 한우등심양념구이', desc: '상세페이지 디자인' },
  // 블로그 스킨
  { src: 'assets/images/graphic/blog/drawing.jpg', category: 'blog', title: '그림앤나드로잉카페', desc: '네이버 블로그 스킨' },
  { src: 'assets/images/graphic/blog/woosung.jpg', category: 'blog', title: '우성건설', desc: '네이버 블로그 스킨' },
  // 패키지
  { src: 'assets/images/graphic/package/package.jpg', category: 'package', title: '패키지 디자인', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/package/가인미가_패키지_달력_2.jpg', category: 'package', title: '가인미가 패키지 달력 2', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/package/더마름다이어트_인쇄물_고객관리차트_1.jpg', category: 'package', title: '더마름다이어트 인쇄물 고객관리차트 1', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/package/더마름다이어트_인쇄물_고객관리차트_2.jpg', category: 'package', title: '더마름다이어트 인쇄물 고객관리차트 2', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/package/더마름다이어트_패키지_든든한끼.jpg', category: 'package', title: '더마름다이어트 패키지 든든한끼', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/package/더마름다이어트_패키지_물병.jpg', category: 'package', title: '더마름다이어트 패키지 물병', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/package/더마름다이어트_패키지_쇼핑백.jpg', category: 'package', title: '더마름다이어트 패키지 쇼핑백', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/package/더마름다이어트_패키지_젤리.jpg', category: 'package', title: '더마름다이어트 패키지 젤리', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/package/더마름다이어트_패키지_파우더.jpg', category: 'package', title: '더마름다이어트 패키지 파우더', desc: '패키지 디자인' },
  { src: 'assets/images/graphic/package/tofu.jpg', category: 'package', title: '두부만드는집', desc: '패키지 디자인' },
  // 로고
  { src: 'assets/images/graphic/logo/더마름다이어트_로고.png', category: 'logo', title: '더마름다이어트 로고', desc: '로고 디자인' },
  // 웹디자인
  { src: 'assets/images/graphic/web/가인미가_메인홈_2.png', category: 'web', title: '가인미가 메인홈 2', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/가인미가_메인홈_3.png', category: 'web', title: '가인미가 메인홈 3', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/가인미가_메인홈_4.png', category: 'web', title: '가인미가 메인홈 4', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/가인미가_메인홈_5.png', category: 'web', title: '가인미가 메인홈 5', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/가인미가_메인홈_6.png', category: 'web', title: '가인미가 메인홈 6', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/가인미가_메인홈_7.png', category: 'web', title: '가인미가 메인홈 7', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/더마름다이어트_메인홈_2.jpg', category: 'web', title: '더마름다이어트 메인홈 2', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/더마름다이어트_메인홈_3.jpg', category: 'web', title: '더마름다이어트 메인홈 3', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/더마름다이어트_메인홈_4.jpg', category: 'web', title: '더마름다이어트 메인홈 4', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/더마름다이어트_메인홈_5.jpg', category: 'web', title: '더마름다이어트 메인홈 5', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/더마름다이어트_메인홈_6.png', category: 'web', title: '더마름다이어트 메인홈 6', desc: '웹 디자인' },
  { src: 'assets/images/graphic/web/더마름다이어트_메인홈_7.png', category: 'web', title: '더마름다이어트 메인홈 7', desc: '웹 디자인' },
];

/* ── Canvas Particles ── */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -9999, y: -9999 };
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x:  Math.random() * this.canvas.width,
        y:  Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => { this.resize(); this.init(); });
    document.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      // Drift
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 185, 154, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    this.particles.forEach((p1, i) => {
      this.particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(200, 185, 154, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(() => this.animate());
  }
}

/* ── Custom Cursor ── */
function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  const dot  = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .filter-btn, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));
}

/* ── Navigation ── */
function initNav() {
  const nav     = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const mobile  = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (menuBtn && mobile) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      mobile.classList.toggle('open');
      document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
    });

    mobile.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        mobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ── Scroll Animations ── */
function initScrollAnimations() {
  const fadeEls = document.querySelectorAll('.fade-in');
  if (!fadeEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    observer.observe(el);
  });
}

/* ── Hero Stats Count-up ── */
// "8+", "8년+", "120+", "95%" 처럼 숫자 뒤에 단위/기호가 붙는 텍스트에서
// 숫자와 나머지(접미사)를 분리해 { el, target, suffix } 형태로 돌려준다.
function parseCountUpItems(els) {
  return [...els].map(el => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(.*)$/);
    if (!match) return null;
    return { el, target: parseInt(match[1], 10), suffix: match[2] };
  }).filter(Boolean);
}

// 자릿수가 늘어나면서(0 → 8, 0 → 120 등) 박스 너비가 변해 정렬이
// 흔들리는 것을 막기 위해, 최종 텍스트 기준 너비를 먼저 측정해
// min-width로 고정해 둔 다음 0부터 보이도록 세팅한다.
function prepareCountUpItems(items) {
  items.forEach(item => {
    const { el, target, suffix } = item;
    el.textContent = `${target}${suffix}`;
    const finalWidth = el.getBoundingClientRect().width;
    el.style.minWidth = `${Math.ceil(finalWidth)}px`;
    el.textContent = `0${suffix}`;
  });
}

function animateCountUp(item, duration = 1400) {
  const { el, target, suffix } = item;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = `${target}${suffix}`;
  }
  requestAnimationFrame(tick);
}

/* ── Hero Stats Count-up ── */
function initHeroStats() {
  const nums = document.querySelectorAll('.hero-stat-num');
  if (!nums.length) return;

  const items = parseCountUpItems(nums);
  if (!items.length) return;
  prepareCountUpItems(items);

  const statsEl = document.querySelector('.hero-stats');
  if (!statsEl) return;

  let played = false;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !played) {
        played = true;
        const startDelay = 1000; // 화면에 보이고 1초 뒤부터 카운트업 시작
        items.forEach((item, i) => setTimeout(() => animateCountUp(item, 1400), startDelay + i * 120));
        observer.unobserve(statsEl);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(statsEl);
}

/* ── About 섹션 핵심 역량 퍼센트 Count-up ── */
function initSkillBarCounts() {
  const pctEls = document.querySelectorAll('.skill-bar-pct');
  if (!pctEls.length) return;

  const items = parseCountUpItems(pctEls);
  if (!items.length) return;
  prepareCountUpItems(items);

  const container = document.querySelector('.skill-bars');
  if (!container) return;

  let played = false;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !played) {
        played = true;
        // 막대 채워지는 애니메이션(1.1s, 0.15s 지연)과 맞춰 함께 차오르게 한다.
        items.forEach((item, i) => setTimeout(() => animateCountUp(item, 1100), 150 + i * 60));
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(container);
}

/* ── Gallery ── */
const GALLERY_PAGE_SIZE = 12;

// 멀티컬럼(masonry) 레이아웃에서는 DOM 순서가 컬럼1 전체 → 컬럼2 전체 →
// 컬럼3 전체로 이어져서, 그 순서대로 스태거하면 "오른쪽만 나중에 열리는"
// 느낌이 든다. 실제 화면 좌표(offsetTop/offsetLeft) 기준으로 위→아래,
// 왼쪽→오른쪽(Z자) 순서로 다시 정렬해서 진짜 자연스러운 순서로 열리게 한다.
function sortByVisualOrder(items) {
  const rowThreshold = 32; // px — 이 안의 top 차이는 같은 줄로 취급
  return [...items]
    .map(el => ({ el, top: el.offsetTop, left: el.offsetLeft }))
    .sort((a, b) => {
      const rowDiff = Math.round(a.top / rowThreshold) - Math.round(b.top / rowThreshold);
      if (rowDiff !== 0) return rowDiff;
      return a.left - b.left;
    })
    .map(o => o.el);
}

// 갤러리 카드를 자연스럽게(순차적으로) 열어 보여주는 공용 헬퍼
function revealGalleryItems(items, stagger = 60) {
  if (!items.length) return;
  const ordered = sortByVisualOrder(items);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ordered.forEach((el, i) => {
        setTimeout(() => el.classList.remove('revealing'), i * stagger);
      });
    });
  });
}

function buildGallery() {
  const container = document.getElementById('gallery');
  if (!container) return;

  const deletedSrcs = JSON.parse(localStorage.getItem('deleted_gallery') || '[]');

  galleryItems.filter(item => !deletedSrcs.includes(item.src)).forEach(item => {
    const el = document.createElement('div');
    el.className = 'gallery-item revealing';
    el.draggable = true;
    el.dataset.category = item.category;
    el.dataset.src   = item.src;
    el.dataset.title = item.title;
    el.dataset.desc  = item.desc;

    const img = document.createElement('img');
    img.alt = item.title;
    img.loading = 'lazy';

    img.onerror = () => {
      img.remove();
      const ph = document.createElement('div');
      ph.className = 'gallery-placeholder';
      ph.textContent = item.title;
      el.insertBefore(ph, el.firstChild);
    };
    img.src = item.src;

    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    overlay.innerHTML = `
      <div class="gallery-item-info">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>`;

    const delBtn = document.createElement('button');
    delBtn.className = 'gallery-delete-btn';
    delBtn.innerHTML = '✕';
    delBtn.title = '삭제';
    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (window._showDeleteConfirm) window._showDeleteConfirm(el, null);
    });

    const dragHandle = document.createElement('div');
    dragHandle.className = 'gallery-drag-handle';
    dragHandle.innerHTML = '⠿';
    dragHandle.title = '드래그해서 순서 변경';

    el.appendChild(img);
    el.appendChild(overlay);
    el.appendChild(delBtn);
    el.appendChild(dragHandle);
    container.appendChild(el);
  });

  if (window._applyGalleryOrder) window._applyGalleryOrder();

  // 그래픽 디자인 섹션이 화면에 들어올 때 카드가 순차적으로 열리는 모션
  const galleryEntranceObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = [...container.querySelectorAll('.gallery-item.revealing')]
          .filter(el => !el.classList.contains('hidden') && !el.classList.contains('page-hidden'));
        revealGalleryItems(items, 50);
        galleryEntranceObserver.disconnect();
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  galleryEntranceObserver.observe(container);

  // 더보기 버튼 생성
  const btn = document.createElement('button');
  btn.id = 'gallery-load-more';
  btn.className = 'gallery-load-more';
  container.insertAdjacentElement('afterend', btn);

  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    const hidden = [...document.querySelectorAll('.gallery-item.page-hidden')];
    const toReveal = hidden.slice(0, GALLERY_PAGE_SIZE);
    if (!toReveal.length) return;

    // 멀티컬럼(masonry) 레이아웃은 카드가 추가되면 전체가 즉시 재배치된다.
    // 갤러리를 통째로 가렸다 보여주는 대신, FLIP 기법으로 이미 보이던
    // 카드는 이전 위치 → 새 위치로 부드럽게 슬라이드시키고, 새로 추가된
    // 카드만 그 자리에서 펼쳐지듯 열리게 해서 더 자연스럽게 만든다.
    // 클릭 시점의 스크롤 위치를 기억해 두고, 레이아웃 재배치/포커스 이동으로
    // 화면이 위아래로 튀지 않도록 고정시킨다.
    const scrollBefore = window.scrollY;
    const lockScroll = () => {
      if (window.scrollY !== scrollBefore) window.scrollTo(0, scrollBefore);
    };

    btn.disabled = true;
    btn.blur();

    const visibleBefore = [...container.querySelectorAll('.gallery-item')]
      .filter(el => !el.classList.contains('hidden') && !el.classList.contains('page-hidden'));
    const firstRects = new Map(visibleBefore.map(el => [el, el.getBoundingClientRect()]));

    toReveal.forEach(el => el.classList.remove('page-hidden'));
    updateLoadMore();
    lockScroll();

    // FLIP(First-Last-Invert-Play): 재배치로 위치가 바뀐 카드만 이전 위치로
    // 즉시 되돌려 놓는다(애니메이션 없이) — 다음 프레임에서 제자리로 슬라이드.
    visibleBefore.forEach(el => {
      const first = firstRects.get(el);
      const last = el.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        el.style.transition = 'none';
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    });
    void container.offsetHeight; // 강제 리플로우로 위 transform을 먼저 적용시킨다

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lockScroll();
        visibleBefore.forEach(el => {
          if (!el.style.transform) return;
          el.style.transition = 'transform 0.5s var(--ease)';
          el.style.transform = '';
          el.addEventListener('transitionend', () => {
            el.style.transition = '';
          }, { once: true });
        });
        revealGalleryItems(toReveal, 70);
        setTimeout(() => { btn.disabled = false; }, 420);
      });
    });
  });
}

function applyPageLimit() {
  const allItems = [...document.querySelectorAll('.gallery-item')];
  // 현재 필터에 보이는 아이템만 대상
  const visible = allItems.filter(el => !el.classList.contains('hidden'));
  // page-hidden 초기화
  allItems.forEach(el => el.classList.remove('page-hidden'));
  // 페이지 초과분 숨기기
  visible.slice(GALLERY_PAGE_SIZE).forEach(el => el.classList.add('page-hidden'));
  updateLoadMore();
}

function updateLoadMore() {
  const btn = document.getElementById('gallery-load-more');
  if (!btn) return;
  const remaining = document.querySelectorAll('.gallery-item.page-hidden').length;
  if (remaining > 0) {
    btn.textContent = `더보기 +${remaining}`;
    btn.style.display = 'block';
  } else {
    btn.style.display = 'none';
  }
}

function initGalleryFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!btns.length || !items.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const newlyShown = [];
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        if (show && item.classList.contains('hidden')) newlyShown.push(item);
        item.classList.toggle('hidden', !show);
      });

      applyPageLimit();

      // 실제로 화면에 보이게 될 카드만 순차적으로 열리는 모션 적용
      const toReveal = newlyShown.filter(item => !item.classList.contains('page-hidden'));
      toReveal.forEach(item => item.classList.add('revealing'));
      revealGalleryItems(toReveal, 40);
    });
  });
}

/* ── Active Nav Link Highlight ── */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  // threshold(영역 비율) 기준은 그래픽 디자인 갤러리처럼 뷰포트보다 훨씬
  // 긴 섹션에서 문제가 생긴다 — 섹션 전체 높이의 40%가 한 번에 화면에
  // 걸치는 순간이 아예 없을 수 있어서 isIntersecting이 절대 true가
  // 안 되고, nav에서 해당 섹션이 영원히 활성화되지 않는다(다른 짧은
  // 섹션들은 이 조건을 만족해서 정상 동작했던 것). 섹션 높이와
  // 무관하게 항상 동작하도록, rootMargin으로 뷰포트 중앙에 얇은
  // 기준선만 남기고(threshold: 0) 그 선을 지나는 섹션을 active로
  // 표시하는 방식(스크롤스파이 표준 패턴)으로 변경.
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => obs.observe(s));
}


/* ── Gallery Modal ── */
function initGalleryModal() {
  const modal     = document.getElementById('galleryModal');
  const backdrop  = document.getElementById('modalBackdrop');
  const closeBtn  = document.getElementById('modalClose');
  const prevBtn   = document.getElementById('modalPrev');
  const nextBtn   = document.getElementById('modalNext');
  const modalImg  = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc  = document.getElementById('modalDesc');
  if (!modal) return;

  let currentIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    return [...document.querySelectorAll('.gallery-item:not(.hidden):not(.page-hidden)')].map(el => ({
      src:   el.dataset.src,
      title: el.dataset.title,
      desc:  el.dataset.desc
    }));
  }

  function openModal(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    showItem(currentIndex);
    modal.classList.add('open');
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showItem(index) {
    const item = visibleItems[index];
    if (!item) return;
    modalImg.style.opacity = '0';
    modalImg.style.transform = 'scale(0.97)';
    modalImg.onload = () => {
      modalImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      modalImg.style.opacity = '1';
      modalImg.style.transform = 'scale(1)';
    };
    modalImg.src = item.src;
    modalImg.alt = item.title;
    modalTitle.textContent = item.title;
    modalDesc.textContent = item.desc;
    prevBtn.style.opacity = index === 0 ? '0.3' : '1';
    nextBtn.style.opacity = index === visibleItems.length - 1 ? '0.3' : '1';
    modal.scrollTop = 0;
  }

  // Gallery item click
  document.getElementById('gallery').addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    visibleItems = getVisibleItems();
    const visIdx = visibleItems.findIndex(v => v.src === item.dataset.src);
    openModal(visIdx >= 0 ? visIdx : 0);
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) showItem(--currentIndex);
  });
  nextBtn.addEventListener('click', () => {
    if (currentIndex < visibleItems.length - 1) showItem(++currentIndex);
  });

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft'  && currentIndex > 0) showItem(--currentIndex);
    if (e.key === 'ArrowRight' && currentIndex < visibleItems.length - 1) showItem(++currentIndex);
  });
}

/* ── Resume Modal ── */
function initResumeModal() {
  const trigger  = document.getElementById('resumeBtn');
  const modal    = document.getElementById('resumeModal');
  const backdrop = document.getElementById('resumeModalBackdrop');
  const closeBtn = document.getElementById('resumeModalClose');
  const doc      = document.getElementById('resumeDoc');
  if (!trigger || !modal || !doc) return;

  function openModal() {
    modal.classList.add('open');
    doc.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  // 주의: #hero-canvas는 이제 volumetric-beams.js의 Three.js WebGL 렌더러가 사용 중
  // (ParticleSystem 2D 캔버스와 충돌하므로 제거됨)

  // Core UI
  initCursor();
  initNav();
  initScrollAnimations();
  initHeroStats();
  initSkillBarCounts();

  // Hero name 해독 효과는 assets/js/decrypted-text.js에서 독립적으로 처리

  // Gallery
  buildGallery();
  applyPageLimit();
  initGalleryFilter();
  initGalleryModal();
  initResumeModal();
  window._applyPageLimit = applyPageLimit;
  initActiveNavHighlight();

  // GSAP ScrollTrigger (optional enhancement)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Section headings parallax
    gsap.utils.toArray('.section-heading').forEach(el => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        }
      );
    });

    // About heading reveal
    const aboutH = document.querySelector('.about-heading');
    if (aboutH) {
      gsap.fromTo(aboutH,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: aboutH, start: 'top 80%' }
        }
      );
    }

    // Timeline items stagger
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.fromTo(item,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          ease: 'power2.out',
          delay: i * 0.05,
          scrollTrigger: { trigger: item, start: 'top 88%' }
        }
      );
    });
  }
});
