/* =====================================================================
   CoderTown Mock - 목킹 데이터
   원본 API 응답 구조(필드명)를 최대한 유지한다. 새로고침하면 초기화된다.
   ===================================================================== */

function avatarSvg(ch, bg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="${bg}"/><text x="50%" y="54%" font-size="36" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="sans-serif">${ch}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const DEMO_USER = 'demo@codertown.dev';

const USERS = [
  { email: DEMO_USER, nickname: '코딩코끼리', password: 'Demo1234!', profileUrl: null },
  { email: 'kim@codertown.dev', nickname: '김개발', profileUrl: avatarSvg('김', '#6861ec') },
  { email: 'park@codertown.dev', nickname: '박프론트', profileUrl: avatarSvg('박', '#3e86f5') },
  { email: 'lee@codertown.dev', nickname: '이백엔드', profileUrl: avatarSvg('이', '#ff7f50') },
  { email: 'choi@codertown.dev', nickname: '최디자인', profileUrl: avatarSvg('최', '#e83e8c') },
  { email: 'jung@codertown.dev', nickname: '정스터디', profileUrl: avatarSvg('정', '#20c997') },
  { email: 'han@codertown.dev', nickname: '한알고', profileUrl: avatarSvg('한', '#fd7e14') },
  { email: 'yoon@codertown.dev', nickname: '윤데브옵스', profileUrl: avatarSvg('윤', '#6f42c1') },
];

const PART_NAMES = { 1: '팀장', 2: 'PM', 3: '디자이너', 4: '퍼블리셔', 5: '프론트엔드', 6: '백엔드' };

function daysAgo(n, h = 14) {
  const d = new Date('2024-03-16T00:00:00');
  d.setDate(d.getDate() - n);
  d.setHours(h, (n * 7) % 60, 0);
  return d.toISOString();
}

/* ---------- 코끼리(프로젝트 모집) ---------- */
const COKKIRI_SEED = [
  ['React + Spring 커뮤니티 플랫폼 팀원 모집', '개발자 커뮤니티 플랫폼', '코더타운', 8, [[5, 2, 1], [6, 2, 0], [3, 1, 0]], 'kim@codertown.dev'],
  ['여행 플래너 앱 사이드 프로젝트 백엔드 구해요', '여행 일정 공유 서비스', '트립메이트', 10, [[6, 2, 1], [5, 1, 1]], 'park@codertown.dev'],
  ['중고거래 쇼핑몰 서비스 함께 만드실 분', '~중고거래 쇼핑몰 서비스', '당근말고무', 12, [[2, 1, 0], [5, 2, 0], [6, 2, 1]], 'lee@codertown.dev'],
  ['AI 기반 일기장 웹앱 프론트엔드 모집합니다', 'GPT 감정 분석 일기장', '마음일기', 6, [[5, 2, 0], [3, 1, 1]], 'choi@codertown.dev'],
  ['스터디 매칭 플랫폼 MVP 개발 (주 2회 온라인)', '스터디 매칭 플랫폼', '스터디온', 8, [[5, 1, 0], [6, 1, 0], [4, 1, 0]], DEMO_USER],
  ['헬스 루틴 기록 앱 Flutter/Spring 팀원', '운동 루틴 기록 앱', '득근득근', 10, [[5, 2, 2], [6, 1, 0]], 'yoon@codertown.dev'],
  ['반려동물 산책 메이트 매칭 서비스', '산책 메이트 매칭', '멍멍워크', 8, [[2, 1, 1], [5, 1, 0], [6, 2, 1]], 'han@codertown.dev'],
  ['오픈소스 기여 스터디 겸 토이 프로젝트', '오픈소스 대시보드', '깃허브잔디', 4, [[5, 3, 1]], 'jung@codertown.dev'],
  ['맛집 리뷰 지도 서비스 디자이너 급구', '지도 기반 맛집 리뷰', '먹고갈래', 8, [[3, 1, 0], [4, 1, 0], [5, 1, 1]], 'kim@codertown.dev'],
  ['실시간 채팅 기반 면접 연습 플랫폼', '모의 면접 플랫폼', '면접왕', 12, [[5, 2, 1], [6, 2, 2], [2, 1, 0]], 'lee@codertown.dev'],
  ['캘린더 공유 협업툴 백엔드 1명 구합니다', '팀 일정 공유 협업툴', '같이일정', 6, [[6, 1, 0]], 'park@codertown.dev'],
  ['개발자 포트폴리오 빌더 웹서비스', '포트폴리오 빌더', '폴리오', 8, [[5, 2, 0], [3, 1, 0], [6, 1, 1]], 'choi@codertown.dev'],
];

const MAMMOTH_SEED = [
  ['강남역 알고리즘 스터디 모집 (매주 토요일)', ['서울특별시', '강남구', '역삼동'], 'https://open.kakao.com/o/algo', 'jung@codertown.dev'],
  ['판교 CS 면접 스터디 하실 분', ['경기도', '성남시', '분당구'], 'https://open.kakao.com/o/cs', 'han@codertown.dev'],
  ['홍대 모각코 (모여서 각자 코딩) 멤버 구해요', ['서울특별시', '마포구', '서교동'], '', 'kim@codertown.dev'],
  ['스프링 부트 JPA 책 스터디', ['서울특별시', '구로구', '구로동'], 'https://open.kakao.com/o/jpa', 'lee@codertown.dev'],
  ['광명 리액트 기초 스터디 (입문자 환영)', ['경기도', '광명시', '철산동'], '', DEMO_USER],
  ['부산 서면 정보처리기사 실기 스터디', ['부산광역시', '부산진구', '부전동'], 'https://open.kakao.com/o/jung', 'yoon@codertown.dev'],
  ['신촌 코딩테스트 대비 스터디 2기', ['서울특별시', '서대문구', '신촌동'], 'https://open.kakao.com/o/ct', 'park@codertown.dev'],
  ['대전 둔산동 클라우드/AWS 스터디', ['대전광역시', '서구', '둔산동'], '', 'choi@codertown.dev'],
  ['수원 영통 TypeScript 딥다이브', ['경기도', '수원시', '영통구'], 'https://open.kakao.com/o/ts', 'han@codertown.dev'],
];

const RECRUITS = [];
let _rno = 1, _pno = 1, _ppno = 100;

COKKIRI_SEED.forEach((s, i) => {
  const [title, subject, teamName, objectWeek, parts, writer] = s;
  const projectParts = [{ projectPartNo: _ppno++, partNo: 1, partName: '팀장', recruitCount: 1, currentCount: 1 }]
    .concat(parts.map(([partNo, recruitCount, currentCount]) => ({ projectPartNo: _ppno++, partNo, partName: PART_NAMES[partNo], recruitCount, currentCount })));
  RECRUITS.push({
    recruitNo: _rno++, category: 'cokkiri', title, writer, views: 40 + ((i * 37) % 180),
    bookmarkedBy: i % 3 === 0 ? ['kim@codertown.dev', 'park@codertown.dev'] : ['lee@codertown.dev'],
    firstRegDate: daysAgo(i * 2 + 1), lastModDate: i % 4 === 0 ? daysAgo(i * 2) : null,
    link: i % 2 === 0 ? 'https://open.kakao.com/o/' + teamName : '',
    status: false,
    content: `<h2>${teamName} 프로젝트 소개</h2><p>안녕하세요! <b>${subject}</b>를 함께 만들 팀원을 모집합니다.</p><h3>진행 방식</h3><ul><li>주 1회 온라인 회의 (디스코드)</li><li>GitHub Flow 기반 협업, PR 코드리뷰 필수</li><li>목표 기간: ${objectWeek}주</li></ul><h3>기술 스택</h3><p>React, Spring Boot, JPA, MySQL, AWS</p><blockquote><p>열정만 있다면 누구나 환영합니다 🙌</p></blockquote>`,
    project: { projectNo: _pno++, objectWeek, subject, teamName, projectParts },
  });
});

MAMMOTH_SEED.forEach((s, i) => {
  const [title, loc, link, writer] = s;
  RECRUITS.push({
    recruitNo: _rno++, category: 'mammoth', title, writer, views: 20 + ((i * 29) % 140),
    bookmarkedBy: i % 2 === 0 ? ['jung@codertown.dev'] : [],
    firstRegDate: daysAgo(i * 2 + 2, 10), lastModDate: null, link, status: false,
    location: { sido: loc[0], sigungu: loc[1], dong: loc[2], fullLocation: loc.join(' ') },
    content: `<p>${title}</p><h3>모임 안내</h3><ul><li>장소: ${loc.join(' ')} 인근 스터디카페</li><li>시간: 매주 토요일 오후 2시 ~ 5시</li><li>인원: 4~6명</li></ul><p>매주 문제 3개씩 풀고 서로 코드 리뷰를 진행합니다. 편하게 연락주세요!</p>`,
  });
});

/* 삭제된 게시글 예시 */
RECRUITS.push({
  recruitNo: _rno++, category: 'cokkiri', title: '(삭제된 게시글) 블록체인 프로젝트', writer: 'yoon@codertown.dev', views: 3,
  bookmarkedBy: [], firstRegDate: daysAgo(40), lastModDate: null, link: '', status: true, content: '',
  project: { projectNo: _pno++, objectWeek: 4, subject: '-', teamName: '-', projectParts: [{ projectPartNo: _ppno++, partNo: 1, partName: '팀장', recruitCount: 1, currentCount: 1 }] },
});

/* ---------- 코글(커뮤니티) ---------- */
const COGGLE_SEED = [
  ['T', 'React useEffect 무한루프 질문입니다', 'kim@codertown.dev'],
  ['C', '신입 백엔드 포트폴리오 어떻게 준비하셨나요?', 'park@codertown.dev'],
  ['D', '사이드 프로젝트 3개월 회고', 'lee@codertown.dev'],
  ['T', 'Spring Security + JWT 리프레시 토큰 저장 위치', DEMO_USER],
  ['T', 'JPA N+1 문제 fetch join vs EntityGraph', 'han@codertown.dev'],
  ['C', 'SI에서 서비스 회사로 이직 후기', 'yoon@codertown.dev'],
  ['D', '재택근무 1년차 루틴 공유합니다', 'choi@codertown.dev'],
  ['T', 'WebSocket STOMP 구독 중복 문제 해결법', DEMO_USER],
  ['T', 'CSS grid vs flex 언제 무엇을 쓰나요', 'park@codertown.dev'],
  ['C', '개발자 연봉 협상 팁 있을까요', 'jung@codertown.dev'],
  ['D', '맥북 vs 윈도우 노트북 개발용 추천', 'kim@codertown.dev'],
  ['T', 'Redux persist 새로고침시 상태 유지 질문', 'choi@codertown.dev'],
  ['T', 'OAuth2 카카오 로그인 팝업 postMessage 처리', 'lee@codertown.dev'],
  ['C', '코딩테스트 준비 기간 얼마나 걸리셨어요?', 'han@codertown.dev'],
  ['D', '오늘 첫 PR 머지됐습니다 🎉', 'yoon@codertown.dev'],
  ['T', 'Docker compose로 MySQL 띄울 때 한글 깨짐', 'jung@codertown.dev'],
  ['T', 'Git rebase vs merge 팀 컨벤션', 'kim@codertown.dev'],
  ['C', '부트캠프 수료 후 취업까지 과정', 'park@codertown.dev'],
  ['D', '개발 블로그 꾸준히 쓰는 법', 'choi@codertown.dev'],
  ['T', 'React 18 StrictMode에서 useEffect 두 번 실행', 'han@codertown.dev'],
  ['T', 'MySQL 인덱스 설계 질문 (복합 인덱스 순서)', 'lee@codertown.dev'],
  ['D', '주말 모각코 후기', 'jung@codertown.dev'],
];

const COGGLES = COGGLE_SEED.map((s, i) => ({
  coggleNo: i + 1, category: s[0], title: s[1], writer: s[2],
  views: 15 + ((i * 41) % 230),
  likedBy: i % 2 === 0 ? ['park@codertown.dev', 'lee@codertown.dev'] : ['kim@codertown.dev'],
  firstRegDate: daysAgo(i + 1, 9 + (i % 10)), lastModDate: i % 5 === 0 ? daysAgo(i, 20) : null, status: false,
  content: s[0] === 'T'
    ? `<p>${s[1]}</p><p>아래처럼 작성했는데 의도대로 동작하지 않습니다.</p><pre><code>useEffect(() => {\n  fetchData().then(setData);\n}, [data]);</code></pre><p>의존성 배열을 어떻게 구성해야 할까요? 조언 부탁드립니다 🙏</p>`
    : `<p>${s[1]}</p><p>평소 고민하던 내용을 정리해봤어요. 다른 분들의 경험도 궁금합니다.</p><ol><li>목표를 작게 쪼개기</li><li>매일 조금씩 기록하기</li><li>함께하는 사람 찾기</li></ol>`,
}));
COGGLES.push({
  coggleNo: COGGLES.length + 1, category: 'D', title: '삭제된 글입니다', writer: 'kim@codertown.dev', views: 2, likedBy: [],
  firstRegDate: daysAgo(30), lastModDate: null, status: true, content: '',
});

let _cno = 1000;
const COMMENTS = []; // { commentNo, coggleNo, parentNo, depth, writer, mention, content, firstRegDate, status }
function addComment(coggleNo, writer, content, parentNo = null, mention = null, n = 0) {
  const c = { commentNo: ++_cno, coggleNo, parentNo, depth: parentNo ? 2 : 1, writer, mention, content, firstRegDate: daysAgo(n, 11 + (_cno % 9)), status: false };
  COMMENTS.push(c);
  return c;
}
(function seedComments() {
  const a = addComment(1, 'park@codertown.dev', 'deps에 data가 들어가 있어서 setData 할 때마다 다시 실행되는 구조네요.\n빈 배열로 바꿔보세요!', null, null, 0);
  addComment(1, 'kim@codertown.dev', '감사합니다!\n해결됐어요 😊', a.commentNo, 'park@codertown.dev', 0);
  addComment(1, DEMO_USER, '저도 같은 문제 겪었는데 도움이 됐습니다.', a.commentNo, 'park@codertown.dev', 0);
  const b = addComment(1, 'lee@codertown.dev', 'eslint react-hooks 플러그인 켜두면 이런 실수를 잡아줍니다.', null, null, 0);
  b.status = false;
  const d = addComment(1, 'yoon@codertown.dev', '삭제된 댓글 예시', null, null, 0); d.status = true;
  const e = addComment(4, 'lee@codertown.dev', 'HttpOnly 쿠키에 리프레시 토큰을 두는 편이 안전합니다.', null, null, 1);
  addComment(4, DEMO_USER, '쿠키로 옮겨보겠습니다. 감사합니다!', e.commentNo, 'lee@codertown.dev', 1);
  addComment(8, 'kim@codertown.dev', 'useEffect cleanup에서 unsubscribe 해주는게 핵심이죠 👍', null, null, 2);
  addComment(2, 'han@codertown.dev', '깃허브 README 정리가 생각보다 중요했어요.', null, null, 3);
  addComment(3, 'choi@codertown.dev', '회고 잘 읽었습니다! 다음 프로젝트도 응원해요.', null, null, 2);
})();

/* ---------- 내 프로젝트 (마이페이지 > 프로젝트) ---------- */
function pu(userProjectNo, email, personalStatus = 'JOIN') { return { userProjectNo, personalStatus, email }; }
const MY_PROJECTS = [
  {
    projectNo: 5, teamName: '스터디온', objectWeek: 8, startDate: '2024-02-01T00:00:00', expectedEndDate: '2024-03-28T00:00:00',
    projectStatus: 'RUN', lastClosingDate: null, myPartNo: 1,
    parts: [
      { partNo: 1, partName: '팀장', recruitCount: 1, currentCount: 1, users: [pu(1, DEMO_USER)] },
      { partNo: 5, partName: '프론트엔드', recruitCount: 1, currentCount: 1, users: [pu(2, 'park@codertown.dev')] },
      { partNo: 6, partName: '백엔드', recruitCount: 1, currentCount: 1, users: [pu(3, 'lee@codertown.dev')] },
      { partNo: 4, partName: '퍼블리셔', recruitCount: 1, currentCount: 0, users: [] },
    ],
  },
  {
    projectNo: 1, teamName: '코더타운', objectWeek: 8, startDate: null, expectedEndDate: null,
    projectStatus: 'RECRUIT', lastClosingDate: null, myPartNo: 5,
    parts: [
      { partNo: 1, partName: '팀장', recruitCount: 1, currentCount: 1, users: [pu(4, 'kim@codertown.dev')] },
      { partNo: 5, partName: '프론트엔드', recruitCount: 2, currentCount: 1, users: [pu(5, DEMO_USER)] },
      { partNo: 6, partName: '백엔드', recruitCount: 2, currentCount: 0, users: [] },
      { partNo: 3, partName: '디자이너', recruitCount: 1, currentCount: 0, users: [] },
    ],
  },
  {
    projectNo: 6, teamName: '득근득근', objectWeek: 10, startDate: '2023-09-01T00:00:00', expectedEndDate: '2023-11-10T00:00:00',
    projectStatus: 'CLOSED', lastClosingDate: '2023-11-15T00:00:00', myPartNo: 5,
    parts: [
      { partNo: 1, partName: '팀장', recruitCount: 1, currentCount: 1, users: [pu(6, 'yoon@codertown.dev')] },
      { partNo: 5, partName: '프론트엔드', recruitCount: 2, currentCount: 2, users: [pu(7, DEMO_USER, 'END'), pu(8, 'choi@codertown.dev', 'END')] },
      { partNo: 6, partName: '백엔드', recruitCount: 1, currentCount: 1, users: [pu(9, 'han@codertown.dev', 'QUIT')] },
    ],
  },
];

/* ---------- 채팅 ---------- */
const CHAT_ROOMS = [
  {
    chatRoomNo: 'room-1', cokkiriNo: 5, isRoomMaker: false, isConfirm: false, friend: 'lee@codertown.dev', friendConnected: true,
    newMsgCount: 2, projectPartNo: 0, partName: '퍼블리셔', projectTitle: '스터디 매칭 플랫폼 MVP 개발 (주 2회 온라인)',
    messages: [
      { sender: 'lee@codertown.dev', message: '안녕하세요! 퍼블리셔 파트 지원했습니다.', chatSendDate: daysAgo(0, 9), isReaded: true },
      { sender: DEMO_USER, message: '반갑습니다 😊\n포트폴리오 링크 공유 가능하실까요?', chatSendDate: daysAgo(0, 10), isReaded: true },
      { sender: 'lee@codertown.dev', message: '네! https://github.com/lee-dev 입니다.', chatSendDate: daysAgo(0, 11), isReaded: false },
      { sender: 'lee@codertown.dev', message: '언제 미팅 가능하세요?', chatSendDate: daysAgo(0, 12), isReaded: false },
    ],
  },
  {
    chatRoomNo: 'room-2', cokkiriNo: 1, isRoomMaker: true, isConfirm: false, friend: 'kim@codertown.dev', friendConnected: false,
    newMsgCount: 0, partName: '프론트엔드', projectTitle: 'React + Spring 커뮤니티 플랫폼 팀원 모집',
    messages: [
      { sender: DEMO_USER, message: '프론트엔드 파트 참여 요청드립니다!', chatSendDate: daysAgo(3, 15), isReaded: true },
      { sender: 'kim@codertown.dev', message: '확인했습니다. 내부 논의 후 연락드릴게요.', chatSendDate: daysAgo(3, 16), isReaded: true },
    ],
  },
  {
    chatRoomNo: 'room-3', cokkiriNo: 6, isRoomMaker: true, isConfirm: true, friend: 'yoon@codertown.dev', friendConnected: false,
    newMsgCount: 1, partName: '프론트엔드', projectTitle: '헬스 루틴 기록 앱 Flutter/Spring 팀원',
    messages: [
      { sender: DEMO_USER, message: '참여 신청합니다.', chatSendDate: daysAgo(20, 13), isReaded: true },
      { sender: 'yoon@codertown.dev', message: '수락했습니다! 슬랙 초대 보내드릴게요 🙌', chatSendDate: daysAgo(19, 18), isReaded: false },
    ],
  },
];

/* ---------- 알림 ---------- */
const NOTIFICATIONS = [
  { notificationNo: 1, coggleNo: 4, commentNo: 1006, from: 'lee@codertown.dev', mentionNickname: '', replyCondition: 'MYPOST', commentContent: 'HttpOnly 쿠키에 리프레시 토큰을 두는 편이 안전합니다.', firstRegDate: daysAgo(1), isClicked: false },
  { notificationNo: 2, coggleNo: 8, commentNo: 1008, from: 'kim@codertown.dev', mentionNickname: '', replyCondition: 'MYPOST', commentContent: 'useEffect cleanup에서 unsubscribe 해주는게 핵심이죠 👍', firstRegDate: daysAgo(2), isClicked: false },
  { notificationNo: 3, coggleNo: 1, commentNo: 1002, from: 'kim@codertown.dev', mentionNickname: '박프론트', replyCondition: 'MYMENTIONPOST', commentContent: '감사합니다! 해결됐어요 😊', firstRegDate: daysAgo(0), isClicked: true },
];

/* ---------- 주소 (맘모스 모임 위치) ---------- */
const ADDRESS = {
  '서울특별시': { '강남구': ['역삼동', '삼성동', '논현동', '대치동'], '마포구': ['서교동', '합정동', '망원동'], '구로구': ['구로동', '신도림동'], '서대문구': ['신촌동', '연희동'], '송파구': ['잠실동', '문정동'] },
  '경기도': { '성남시': ['분당구', '수정구', '중원구'], '광명시': ['철산동', '하안동', '소하동'], '수원시': ['영통구', '팔달구', '장안구'], '고양시': ['일산동구', '덕양구'] },
  '인천광역시': { '연수구': ['송도동', '연수동'], '남동구': ['구월동'] },
  '부산광역시': { '부산진구': ['부전동', '전포동'], '해운대구': ['우동', '중동'] },
  '대구광역시': { '중구': ['동성로'], '수성구': ['범어동'] },
  '대전광역시': { '서구': ['둔산동', '탄방동'], '유성구': ['봉명동'] },
  '광주광역시': { '서구': ['치평동'] },
  '울산광역시': { '남구': ['삼산동'] },
  '세종특별자치시': { '세종시': ['나성동'] },
  '강원도': { '춘천시': ['효자동'] },
  '충청북도': { '청주시': ['복대동'] },
  '충청남도': { '천안시': ['불당동'] },
};
