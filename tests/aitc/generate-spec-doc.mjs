/**
 * AI 조교 통합 테스트 명세서 Word 문서 생성 스크립트
 * 실행: node tests/aitc/generate-spec-doc.mjs
 */

import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle,
  ShadingType, convertInchesToTwip, PageOrientation,
  TableLayoutType, VerticalAlign, PageBreak,
} from '../../node_modules/docx/dist/index.mjs';
import { writeFileSync } from 'fs';

// ─────────────────────── 색상 상수 ───────────────────────
const COLOR = {
  HEADER_BG: '1F4E79',    // 진파랑 (테이블 헤더)
  SUBHEADER_BG: '2E75B6', // 중간 파랑
  SECTION_BG: 'BDD7EE',   // 연파랑 (섹션 구분)
  ROW_ALT: 'DEEAF1',      // 교대 행 색
  WHITE: 'FFFFFF',
  TEXT_DARK: '1F1F1F',
  TEXT_WHITE: 'FFFFFF',
  ACCENT: 'ED7D31',
};

// ─────────────────────── 공통 스타일 ───────────────────────
const FONT = '맑은 고딕';

function txt(text, opts = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: opts.size ?? 20,
    bold: opts.bold ?? false,
    color: opts.color ?? COLOR.TEXT_DARK,
    italics: opts.italics ?? false,
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: FONT, bold: true, size: 32, color: COLOR.HEADER_BG })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: FONT, bold: true, size: 26, color: COLOR.SUBHEADER_BG })],
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: FONT, bold: true, size: 22, color: COLOR.TEXT_DARK })],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    alignment: opts.align ?? AlignmentType.LEFT,
    children: [txt(text, opts)],
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
    children: [txt(text, { size: 19 })],
  });
}

function emptyLine() {
  return new Paragraph({ children: [txt('')], spacing: { before: 60, after: 60 } });
}

// ─────────────────────── 셀 생성 헬퍼 ───────────────────────
function cell(text, opts = {}) {
  const bg = opts.bg ?? COLOR.WHITE;
  const bold = opts.bold ?? false;
  const color = opts.color ?? COLOR.TEXT_DARK;
  const align = opts.align ?? AlignmentType.CENTER;
  const size = opts.size ?? 18;
  const colSpan = opts.colSpan ?? 1;

  return new TableCell({
    columnSpan: colSpan,
    verticalAlign: VerticalAlign.CENTER,
    shading: { fill: bg, type: ShadingType.CLEAR, color: 'auto' },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: align,
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({ text: String(text), font: FONT, size, bold, color }),
        ],
      }),
    ],
  });
}

function headerRow(cols) {
  return new TableRow({
    tableHeader: true,
    children: cols.map(c =>
      cell(c.text, { bg: COLOR.HEADER_BG, bold: true, color: COLOR.TEXT_WHITE, size: 18, align: AlignmentType.CENTER, colSpan: c.span ?? 1 })
    ),
  });
}

function dataRow(cols, isAlt = false) {
  return new TableRow({
    children: cols.map(c =>
      cell(c.text, {
        bg: isAlt ? COLOR.ROW_ALT : COLOR.WHITE,
        bold: c.bold ?? false,
        align: c.align ?? AlignmentType.CENTER,
        size: 17,
      })
    ),
  });
}

// ─────────────────────── TC 데이터 ───────────────────────
const STUDENT_TCS = [
  {
    id: 'TC001', screen: '소개 페이지', actor: '-',
    scenario: '소개 페이지 진입',
    steps: [
      '브라우저에서 http://dsuai.localhost:3001 접속',
      '페이지 로딩 완료 대기',
    ],
    expected: '소개 페이지의 이미지 및 텍스트 내용이 정상적으로 표출된다',
    method: 'UI 자동화',
    verify: ['이미지(img) 태그 1개 이상 노출', '본문 텍스트 50자 이상 존재', '페이지 URL 정상'],
  },
  {
    id: 'TC002', screen: '로그인 화면', actor: '학생',
    scenario: '학생 회원가입 및 로그인',
    steps: [
      '/account/login 페이지 접속',
      '학번 입력 필드에 학번 입력',
      '비밀번호 입력 필드에 비밀번호 입력',
      '로그인 버튼 클릭',
      '서비스 이용약관 동의 팝업 처리 (최초 1회)',
    ],
    expected: '학번/비밀번호 입력 후 서비스 이용약관 동의(최초 1회). 회원가입 및 로그인 완료',
    method: 'UI 자동화 (화면)',
    verify: ['로그인 폼 노출', '약관 동의 팝업 처리', '로그인 후 /account/login URL 미포함 확인'],
  },
  {
    id: 'TC003', screen: '강의 클럽', actor: '학생',
    scenario: '강의클럽 참여하기',
    steps: [
      '로그인 후 /lecture-list 이동',
      '원하는 강의클럽 선택 클릭',
      '참여하기 버튼 클릭',
    ],
    expected: '교수자 승인 후 강의 참여 완료 확인. 참여 신청 완료 메시지 또는 상태 변경 확인',
    method: 'UI 자동화',
    verify: ['강의클럽 목록 노출', '참여하기 버튼 노출', '참여 신청 후 상태(취소/대기/승인) 변경 확인'],
  },
  {
    id: 'TC004', screen: '강의 클럽', actor: '학생',
    scenario: '강의클럽 목록 확인',
    steps: [
      '로그인 후 /lecture-list 이동',
      '강의 목록 로딩 대기',
    ],
    expected: '회차별 강의 목록이 정상적으로 표출된다',
    method: 'UI 자동화',
    verify: ['강의 목록 아이템 1개 이상 존재', '강의 제목 텍스트 노출'],
  },
  {
    id: 'TC005', screen: '강의 클럽', actor: '학생',
    scenario: '강의클럽 상세보기',
    steps: [
      '로그인 후 /lecture-list 이동',
      '강의클럽 항목 클릭',
      '상세 페이지 로딩 대기',
    ],
    expected: '강의기간, 강의현황, 학습 주제, 학습 키워드, 학습 스킬, 참여 인원 정보가 확인된다',
    method: 'UI 자동화',
    verify: ['기간/현황/주제/키워드/스킬/인원 관련 텍스트 1개 이상 노출'],
  },
  {
    id: 'TC006', screen: 'AI 조교', actor: '학생',
    scenario: 'AI 조교 질의',
    steps: [
      '로그인 후 메인 페이지 이동',
      '우측 하단 AI 조교 버튼 클릭',
      '강의 선택 드롭다운에서 강의 선택',
      '텍스트 입력창에 질문 입력',
      '전송 버튼 클릭 또는 Enter 입력',
      'AI 답변 대기',
    ],
    expected: '우측 하단 AI 조교 버튼 클릭 후 강의 선택, 질문 입력 및 AI 답변 확인',
    method: 'UI 자동화',
    verify: [
      'AI 조교 버튼 노출',
      '팝업/패널 오픈',
      '강의 선택 드롭다운 존재',
      '질문 입력창 노출',
      '전송 후 응답 영역 존재',
    ],
  },
  {
    id: 'TC007', screen: '강의 클럽', actor: '학생',
    scenario: 'Q&A 보기',
    steps: [
      '로그인 후 강의클럽 상세 페이지 진입',
      'Q&A 보기 탭/버튼 클릭',
    ],
    expected: 'Q&A 보기 클릭 시 회차별 질문 내역과 AI 답변 내역이 확인된다',
    method: 'UI 자동화',
    verify: ['Q&A 버튼/탭 노출', '질문/답변 관련 텍스트 노출'],
  },
  {
    id: 'TC008', screen: '강의 클럽', actor: '학생',
    scenario: '총평 피드백 보기',
    steps: [
      '로그인 후 강의클럽 상세 페이지 진입',
      '총평 피드백 보기 버튼/탭 클릭',
    ],
    expected: '총평 피드백 보기 클릭 시 질문 내역 분석 총평이 확인된다',
    method: 'UI 자동화',
    verify: ['총평/피드백 버튼 노출', '총평 내용 텍스트 노출'],
  },
  {
    id: 'TC009', screen: '나의 학습방', actor: '학생',
    scenario: '가입한 클럽 확인',
    steps: [
      '로그인 후 /studyroom 이동',
      '가입된 강의클럽 목록 확인',
      '학습 캘린더 확인',
      '즐겨찾기(별 모양) 버튼 클릭하여 추가/해제',
    ],
    expected: '가입한 강의 클럽 리스트와 학습 캘린더 확인. 즐겨찾기 추가/해제 동작',
    method: 'UI 자동화',
    verify: ['클럽 목록 노출', '학습 캘린더 노출', '즐겨찾기 버튼 클릭 동작'],
  },
  {
    id: 'TC010', screen: '마이페이지', actor: '학생',
    scenario: '프로필 보기',
    steps: [
      '로그인 후 /account/my 이동',
      '프로필 보기 버튼 클릭 (있는 경우)',
    ],
    expected: '나의 프로필 정보(이름, 학번, 이메일 등)가 확인된다',
    method: 'UI 자동화',
    verify: ['프로필 영역 노출', '이름/학번/이메일 관련 텍스트 존재'],
  },
  {
    id: 'TC011', screen: '마이페이지', actor: '학생',
    scenario: '프로필 수정',
    steps: [
      '로그인 후 /account/my 이동',
      '프로필 수정 버튼 클릭',
      '수정 폼 노출 확인',
    ],
    expected: '프로필 수정 클릭 시 수정 가능한 폼이 열리고 입력 필드가 노출된다',
    method: 'UI 자동화',
    verify: ['프로필 수정 버튼 노출', '수정 폼 노출', '텍스트 입력 필드 존재'],
  },
  {
    id: 'TC012', screen: '마이페이지', actor: '학생',
    scenario: '교수자 권한 요청',
    steps: [
      '로그인 후 /account/my 이동',
      '교수자 권한 요청 버튼 클릭',
    ],
    expected: '교수자 권한 요청 클릭 후 관리자 승인 대기 안내 메시지가 표출된다',
    method: 'UI 자동화',
    verify: ['교수자 권한 요청 버튼 노출', '요청/신청/완료 관련 텍스트 노출'],
  },
  {
    id: 'TC013', screen: '마이페이지', actor: '학생',
    scenario: '내 지도교수자 관리',
    steps: [
      '로그인 후 /account/my/my-advisor-manager 이동',
      '지도교수자 신청하기 버튼 클릭',
      '교수자 선택 후 확인 클릭',
    ],
    expected: '지도교수자 신청하기 버튼 클릭 시 교수자 선택 다이얼로그가 노출되고 교수자 목록이 확인된다',
    method: 'UI 자동화',
    verify: ['지도교수자 신청 버튼 노출', '교수자 선택 다이얼로그 노출', '교수자 목록 존재'],
  },
  {
    id: 'TC014', screen: '마이페이지', actor: '학생',
    scenario: '클럽 즐겨찾기 목록',
    steps: [
      '로그인 후 /account/my/favorites 이동',
    ],
    expected: '즐겨찾기 해둔 클럽 목록이 정상 표출된다',
    method: 'UI 자동화',
    verify: ['즐겨찾기 페이지 로드', '목록 영역 노출', '즐겨찾기/관심 관련 텍스트 존재'],
  },
  {
    id: 'TC015', screen: '마이페이지', actor: '학생',
    scenario: '내 친구관리',
    steps: [
      '로그인 후 /account/my/friends 이동',
    ],
    expected: '나의 친구 신청 내역과 친구 목록이 확인된다',
    method: 'UI 자동화',
    verify: ['친구 관리 페이지 로드', '친구/신청 관련 텍스트 존재', '목록 영역 노출'],
  },
  {
    id: 'TC016', screen: '마이페이지', actor: '학생',
    scenario: '커뮤니티 작성글',
    steps: [
      '로그인 후 /account/my/activity 이동',
    ],
    expected: '내가 작성한 커뮤니티 글 목록이 확인된다',
    method: 'UI 자동화',
    verify: ['활동 페이지 로드', '커뮤니티/작성/게시 관련 텍스트 존재'],
  },
  {
    id: 'TC017', screen: '마이페이지', actor: '학생',
    scenario: '개인정보관리',
    steps: [
      '로그인 후 /account/my/member-edit 이동',
    ],
    expected: '나의 개인정보(이름, 이메일, 연락처 등)가 확인된다',
    method: 'UI 자동화',
    verify: ['개인정보 페이지 로드', '이름/이메일/연락처 관련 텍스트 존재'],
  },
  {
    id: 'TC018', screen: '마이페이지', actor: '학생',
    scenario: '비밀번호 변경',
    steps: [
      '로그인 후 /account/my 이동',
      '비밀번호 변경하기 버튼 클릭',
    ],
    expected: '비밀번호 변경 폼(입력 필드)이 노출된다',
    method: 'UI 자동화',
    verify: ['비밀번호 변경 버튼 노출', '비밀번호 입력 필드 노출'],
  },
  {
    id: 'TC019', screen: '마이페이지', actor: '학생',
    scenario: '휴대전화 번호 변경',
    steps: [
      '로그인 후 /account/my 이동',
      '휴대전화 변경하기 버튼 클릭 또는 /account/my/member-edit 이동',
    ],
    expected: '휴대전화 번호 변경 입력 폼이 노출된다',
    method: 'UI 자동화',
    verify: ['휴대전화 변경 버튼 또는 전화 입력 필드 노출'],
  },
];

const INSTRUCTOR_TCS = [
  {
    id: 'TC001', screen: '소개 페이지', actor: '-',
    scenario: '소개 페이지 진입',
    steps: ['브라우저에서 http://dsuai.localhost:3001 접속', '페이지 로딩 완료 대기'],
    expected: '소개페이지의 이미지/내용 정상표출',
    method: 'UI 자동화',
    verify: ['이미지 1개 이상 노출', '본문 텍스트 50자 이상'],
  },
  {
    id: 'TC002', screen: '로그인 화면', actor: '교수자',
    scenario: '교수자 회원가입 및 로그인',
    steps: [
      '/account/login 접속',
      '교번 입력',
      '비밀번호 입력',
      '교수자 탭 선택 (있는 경우)',
      '로그인 버튼 클릭',
      '서비스 이용약관 동의 (최초 1회)',
    ],
    expected: '교번/비밀번호 입력 후 서비스 이용약관 동의(최초 1회). 회원가입 및 로그인 완료',
    method: 'UI 자동화 (화면)',
    verify: ['로그인 폼 노출', '로그인 후 /account/login URL 미포함'],
  },
  {
    id: 'TC003', screen: '강의 클럽', actor: '교수자',
    scenario: '강의클럽 개설하기',
    steps: [
      '로그인 후 /lecture-list 이동',
      '강의클럽 개설하기 버튼 클릭',
      '강의 제목 입력',
      '설정 항목 구성 (아래 테스트 조건)',
    ],
    expected: '강의클럽 개설 폼이 노출되며 저장/완료 버튼이 활성화된다',
    method: 'UI 자동화',
    verify: [
      '개설하기 버튼 노출',
      '개설 폼 노출',
      '타 학습자 질의/답변 보기 설정 항목 확인',
      'AI 질문제한 설정 항목 확인',
      '강의자료 레퍼런스 제공 여부 설정 확인',
      '강의 언어/콘텐츠 언어/AI 대화 언어 선택 확인',
      '질문 제한 키워드 설정 확인',
      'AI 학습총평 실행 권한 설정 확인',
      'AI 학습총평 보기 권한 설정 확인',
      'AI 학습총평 최소 질문 수 설정 확인',
      '저장/완료 버튼 노출',
    ],
  },
  {
    id: 'TC004', screen: '강의 클럽', actor: '교수자',
    scenario: '강의클럽 목록 확인',
    steps: ['로그인 후 /lecture-list 이동', '강의 목록 로딩 대기'],
    expected: '강의클럽 목록에 내가 생성한 강의클럽이 확인된다',
    method: 'UI 자동화',
    verify: ['강의 목록 아이템 1개 이상 존재', '강의 제목 텍스트 노출'],
  },
  {
    id: 'TC005', screen: '강의 클럽', actor: '교수자',
    scenario: '강의클럽 상세보기 (MY 클럽)',
    steps: [
      '로그인 후 /lecture-list 이동',
      '내가 교수자로 운영하는 클럽 클릭',
    ],
    expected: 'MY 강의클럽의 강의 대시보드로 이동된다',
    method: 'UI 자동화',
    verify: ['클릭 후 lecture-list URL 미유지', '대시보드/관리 페이지로 이동 확인'],
  },
  {
    id: 'TC006', screen: '강의 클럽', actor: '교수자',
    scenario: '강의클럽 상세보기 (타 클럽)',
    steps: [
      '로그인 후 /lecture-list 이동',
      '타 교수자가 운영하는 클럽 클릭',
    ],
    expected: '학생과 동일한 강의 상세 뷰가 표출된다',
    method: 'UI 자동화',
    verify: ['강의/기간/현황/인원 관련 텍스트 노출'],
  },
  {
    id: 'TC007', screen: '강의 클럽', actor: '교수자',
    scenario: 'Q&A 보기',
    steps: [
      '로그인 후 강의클럽 상세/대시보드 진입',
      'Q&A 보기 탭/버튼 클릭',
    ],
    expected: 'Q&A 보기 클릭 시 회차별 학생 질문 내역과 AI 답변 내역이 확인된다',
    method: 'UI 자동화',
    verify: ['Q&A 버튼/탭 노출', '질문/답변 관련 텍스트 노출'],
  },
  {
    id: 'TC008', screen: 'AI 조교', actor: '교수자',
    scenario: 'AI 조교 팝업 활용',
    steps: [
      '로그인 후 메인 페이지 이동',
      '우측 하단 AI 조교 버튼 클릭',
      '팝업창에서 클럽 선택',
      '강의 회차 선택',
      '학습자 질의 내역 및 AI 답변 여부 확인',
    ],
    expected: '팝업창에서 클럽 및 강의 회차를 선택하면 학습자의 질문 내역과 AI 답변 여부 확인 가능',
    method: 'UI 자동화',
    verify: [
      'AI 조교 버튼 노출',
      '팝업 오픈',
      '클럽 선택 드롭다운 존재',
      '강의 회차 선택 드롭다운 존재',
      '학습자 질의 내역 영역 존재',
    ],
  },
  {
    id: 'TC009', screen: 'MY 강의클럽', actor: '교수자',
    scenario: '강의클럽 대시보드',
    steps: [
      '로그인 후 MY 강의클럽 대시보드 진입',
    ],
    expected: '클럽인원, 클럽정보, 전체 학습 보기, 최근 학습 질의 내역, 최근 미응답 내역, AI 피드백 현황이 확인된다',
    method: 'UI 자동화',
    verify: [
      '클럽 인원/클럽 정보 섹션 노출',
      '최근 학습 질의 내역 섹션 (학습자 AI 조교 질의 내역, 교수자 직접 대응 가능)',
      '최근 미응답 내역 섹션',
      'AI 피드백 현황 섹션 (강의자료 답변/일반서치 답변/AI 미응답 구분)',
    ],
  },
  {
    id: 'TC010', screen: 'MY 강의클럽', actor: '교수자',
    scenario: 'CQI 보고서 생성',
    steps: [
      'MY 강의클럽 대시보드 진입',
      'CQI 보고서 버튼/탭 클릭',
      '보고서 생성 실행',
    ],
    expected: '강의품질 개선에 활용할 CQI 보고서 초안이 생성되고 조회된다',
    method: 'UI 자동화',
    verify: ['CQI/보고서 버튼 노출', 'CQI/강의품질/개선 관련 텍스트 노출'],
  },
  {
    id: 'TC011', screen: 'MY 강의클럽', actor: '교수자',
    scenario: '플레이그라운드',
    steps: [
      'MY 강의클럽 대시보드 또는 /lecture-playground/{id} 진입',
    ],
    expected: 'AI 조교 테스트 및 질의응답 결과 분석 내용이 확인된다',
    method: 'UI 자동화',
    verify: ['플레이그라운드 페이지 로드', 'AI 조교/질의응답/테스트 관련 텍스트 노출'],
  },
  {
    id: 'TC012', screen: 'MY 강의클럽', actor: '교수자',
    scenario: '학습 총평 - AI 피드백 생성',
    steps: [
      'MY 강의클럽 대시보드 진입',
      '우측 상단 AI 피드백 생성 버튼 클릭',
      '총평 생성 완료 대기',
      '생성 결과 확인',
    ],
    expected: '우측 상단 AI 피드백 생성을 통해 총평이 생성되고 결과가 확인된다',
    method: 'UI 자동화',
    verify: ['AI 피드백 생성 버튼 노출', '생성 완료 후 피드백/총평 텍스트 노출'],
  },
  {
    id: 'TC013', screen: 'MY 강의클럽', actor: '교수자',
    scenario: '학생별 보기',
    steps: [
      'MY 강의클럽 대시보드 진입',
      '학생별 보기 탭/버튼 클릭',
    ],
    expected: '학생별 학습참여도와 답변/질의, 강의 회차별 AI답변/교수자답변이 확인된다',
    method: 'UI 자동화',
    verify: ['학생별 보기 탭 노출', '참여도/답변/질의/회차 관련 텍스트 노출'],
  },
  {
    id: 'TC014', screen: 'MY 강의클럽', actor: '교수자',
    scenario: '강의별 보기',
    steps: [
      'MY 강의클럽 대시보드 진입',
      '강의별 보기 탭/버튼 클릭',
    ],
    expected: '회차별 총 질의수와 AI답변 내역, 주요 질의응답이 상세하게 확인된다',
    method: 'UI 자동화',
    verify: ['강의별 보기 탭 노출', '회차/질의/AI 답변 관련 텍스트 노출'],
  },
  {
    id: 'TC015', screen: 'MY 강의클럽', actor: '교수자',
    scenario: '강의클럽 관리하기 (설정 수정)',
    steps: [
      'MY 강의클럽 대시보드 진입',
      '오른쪽 상단 톱니바퀴 버튼 클릭 또는 관리하기 버튼 클릭',
      '설정 항목 수정',
    ],
    expected: '강의클럽 수정 폼이 노출되며 TC003의 모든 설정 항목이 수정 가능하다',
    method: 'UI 자동화',
    verify: [
      '설정 버튼(톱니바퀴) 또는 관리하기 버튼 노출',
      '수정 폼 노출',
      '타 학습자 질의/답변 보기 설정 수정 가능',
      'AI 질문제한 수정 가능',
      '레퍼런스 제공 여부 수정 가능',
      '언어 설정 수정 가능',
      '질문 제한 키워드 수정 가능',
      'AI 학습총평 권한 설정 수정 가능',
    ],
  },
  {
    id: 'TC016', screen: '마이페이지', actor: '교수자',
    scenario: '프로필 보기',
    steps: ['로그인 후 /account/my 이동', '프로필 보기 버튼 클릭 (있는 경우)'],
    expected: '나의 프로필 정보가 확인된다',
    method: 'UI 자동화',
    verify: ['프로필 영역 노출', '이름/교번/이메일 관련 텍스트 존재'],
  },
  {
    id: 'TC017', screen: '마이페이지', actor: '교수자',
    scenario: '프로필 수정',
    steps: ['로그인 후 /account/my 이동', '프로필 수정 버튼 클릭'],
    expected: '프로필 수정 가능한 폼과 입력 필드가 노출된다',
    method: 'UI 자동화',
    verify: ['프로필 수정 버튼 노출', '수정 폼 노출', '텍스트 입력 필드 존재'],
  },
  {
    id: 'TC018', screen: '마이페이지', actor: '교수자',
    scenario: '교수자 권한 요청/확인',
    steps: ['로그인 후 /account/my 이동', '교수자 권한 관련 메뉴 확인'],
    expected: '교수자 권한 요청 또는 교수자 권한 보유 상태가 확인된다',
    method: 'UI 자동화',
    verify: ['교수자 권한 요청 또는 상태 확인 텍스트 노출'],
  },
  {
    id: 'TC019', screen: '마이페이지', actor: '교수자',
    scenario: '내 지도교수자 관리',
    steps: ['로그인 후 /account/my/my-advisor-manager 이동'],
    expected: '지도교수자 관련 페이지가 정상 로드된다',
    method: 'UI 자동화',
    verify: ['지도교수/advisor 관련 텍스트 노출'],
  },
  {
    id: 'TC020', screen: '마이페이지', actor: '교수자',
    scenario: '클럽 즐겨찾기 목록',
    steps: ['로그인 후 /account/my/favorites 이동'],
    expected: '즐겨찾기 해둔 클럽 목록이 표출된다',
    method: 'UI 자동화',
    verify: ['즐겨찾기 페이지 로드', '목록 영역 노출'],
  },
  {
    id: 'TC021', screen: '마이페이지', actor: '교수자',
    scenario: '내 친구관리',
    steps: ['로그인 후 /account/my/friends 이동'],
    expected: '친구 신청 내역과 친구 목록이 확인된다',
    method: 'UI 자동화',
    verify: ['친구 관련 텍스트 노출', '목록 영역 노출'],
  },
  {
    id: 'TC022', screen: '마이페이지', actor: '교수자',
    scenario: '커뮤니티 작성글',
    steps: ['로그인 후 /account/my/activity 이동'],
    expected: '내가 작성한 커뮤니티 글 목록이 확인된다',
    method: 'UI 자동화',
    verify: ['커뮤니티/작성/게시 관련 텍스트 노출'],
  },
  {
    id: 'TC023', screen: '마이페이지', actor: '교수자',
    scenario: '개인정보관리',
    steps: ['로그인 후 /account/my/member-edit 이동'],
    expected: '나의 개인정보가 확인된다',
    method: 'UI 자동화',
    verify: ['개인정보/이름/이메일 관련 텍스트 노출'],
  },
  {
    id: 'TC024', screen: '마이페이지', actor: '교수자',
    scenario: '비밀번호 변경',
    steps: ['로그인 후 /account/my 이동', '비밀번호 변경하기 버튼 클릭'],
    expected: '비밀번호 변경 폼이 노출된다',
    method: 'UI 자동화',
    verify: ['비밀번호 변경 버튼 노출', '비밀번호 입력 필드 노출'],
  },
  {
    id: 'TC025', screen: '마이페이지', actor: '교수자',
    scenario: '휴대전화 번호 변경',
    steps: ['로그인 후 /account/my 이동', '휴대전화 변경하기 버튼 클릭'],
    expected: '휴대전화 번호 변경 입력 폼이 노출된다',
    method: 'UI 자동화',
    verify: ['휴대전화 변경 버튼 또는 전화 입력 필드 노출'],
  },
];

// ─────────────────────── 요약 테이블 생성 ───────────────────────
function makeSummaryTable(tcs, label) {
  const rows = [
    headerRow([
      { text: 'TC ID' },
      { text: '화면 구분' },
      { text: '액터' },
      { text: '시나리오' },
      { text: '테스트 방식' },
    ]),
    ...tcs.map((tc, i) =>
      dataRow([
        { text: tc.id, bold: true },
        { text: tc.screen },
        { text: tc.actor },
        { text: tc.scenario, align: AlignmentType.LEFT },
        { text: tc.method },
      ], i % 2 === 1)
    ),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows,
  });
}

// ─────────────────────── 상세 TC 테이블 ───────────────────────
function makeTcDetailTable(tc) {
  const labelCell = (text) =>
    cell(text, { bg: COLOR.SECTION_BG, bold: true, align: AlignmentType.LEFT, size: 18 });
  const valueCell = (text) =>
    cell(text, { bg: COLOR.WHITE, align: AlignmentType.LEFT, size: 17 });

  const stepsText = tc.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
  const verifyText = tc.verify.map(v => `• ${v}`).join('\n');

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      // 헤더
      new TableRow({
        tableHeader: true,
        children: [
          cell(`${tc.id}  |  ${tc.scenario}`, {
            bg: COLOR.SUBHEADER_BG,
            bold: true,
            color: COLOR.TEXT_WHITE,
            align: AlignmentType.LEFT,
            size: 20,
            colSpan: 2,
          }),
        ],
      }),
      new TableRow({ children: [labelCell('화면 구분'), valueCell(tc.screen)] }),
      new TableRow({ children: [labelCell('액터'), valueCell(tc.actor)] }),
      new TableRow({ children: [labelCell('테스트 방식'), valueCell(tc.method)] }),
      new TableRow({ children: [labelCell('테스트 단계'), valueCell(stepsText)] }),
      new TableRow({ children: [labelCell('예상 결과'), valueCell(tc.expected)] }),
      new TableRow({ children: [labelCell('검증 항목'), valueCell(verifyText)] }),
      new TableRow({ children: [labelCell('테스트 결과'), valueCell('□ 통과   □ 실패   □ 보류')] }),
      new TableRow({ children: [labelCell('비고'), valueCell('')] }),
    ],
  });
}

// ─────────────────────── 문서 조립 ───────────────────────
const children = [];

// ── 표지 ──
children.push(
  emptyLine(), emptyLine(), emptyLine(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text: 'AI 조교 통합 테스트', font: FONT, bold: true, size: 56, color: COLOR.HEADER_BG })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 100 },
    children: [new TextRun({ text: '테스트 케이스 명세서', font: FONT, bold: true, size: 40, color: COLOR.SUBHEADER_BG })],
  }),
  emptyLine(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: 'Test Case Specification', font: FONT, size: 28, color: '888888', italics: true })],
  }),
  emptyLine(), emptyLine(), emptyLine(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: '─────────────────────────────────', font: FONT, size: 24, color: COLOR.SUBHEADER_BG })],
  }),
  emptyLine(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [txt('시스템명 : AI 조교 (AITC)', { size: 22 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [txt('대상 서버 : http://dsuai.localhost:3001', { size: 22 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [txt('작성 기준 : aitc.xlsx (AI조교_테스트_학습자 / AI조교_테스트_교수자)', { size: 22 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [txt('테스트 도구 : Playwright (TypeScript)', { size: 22 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [txt(`작성일 : ${new Date().toLocaleDateString('ko-KR')}`, { size: 22 })],
  }),
  emptyLine(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: '─────────────────────────────────', font: FONT, size: 24, color: COLOR.SUBHEADER_BG })],
  }),
  // 페이지 나누기
  new Paragraph({ children: [new PageBreak()] }),
);

// ── 1. 개요 ──
children.push(heading1('1. 문서 개요'));

children.push(heading2('1.1 목적'));
children.push(para('본 문서는 AI 조교(AITC) 서비스에 대한 통합 테스트 케이스를 정의합니다. aitc.xlsx 의 학습자(AI조교_테스트_학습자) 및 교수자(AI조교_테스트_교수자) 시트에 정의된 시나리오를 Playwright E2E 자동화 테스트로 구현하였으며, 각 테스트 케이스의 목적·단계·예상결과·검증 항목을 명세합니다.'));

children.push(heading2('1.2 범위'));
children.push(bullet('학습자(학생) 테스트 케이스: TC001 ~ TC019 (총 19개)'));
children.push(bullet('교수자 테스트 케이스: TC001 ~ TC025 (총 25개)'));
children.push(bullet('테스트 대상 서버: http://dsuai.localhost:3001'));
children.push(bullet('테스트 도구: Playwright (TypeScript)'));

children.push(heading2('1.3 테스트 파일 구조'));
children.push(para('tests/aitc/'));
children.push(bullet('aitc-student.spec.ts   — 학습자 테스트 (TC001~TC019)'));
children.push(bullet('aitc-instructor.spec.ts — 교수자 테스트 (TC001~TC025)'));
children.push(bullet('helpers.ts             — 공통 헬퍼 (로그인, 네비게이션)'));
children.push(bullet('playwright.config.ts   — Playwright 설정'));

children.push(emptyLine());

children.push(heading2('1.4 테스트 실행 방법'));
children.push(bullet('전체 실행: npx playwright test tests/aitc/ --config tests/aitc/playwright.config.ts'));
children.push(bullet('학습자만: npx playwright test tests/aitc/aitc-student.spec.ts --config tests/aitc/playwright.config.ts'));
children.push(bullet('교수자만: npx playwright test tests/aitc/aitc-instructor.spec.ts --config tests/aitc/playwright.config.ts'));
children.push(bullet('특정 TC: --grep "TC006" 옵션 추가'));

children.push(heading2('1.5 사전 조건'));
children.push(bullet('hosts 파일에 127.0.0.1 dsuai.localhost 등록'));
children.push(bullet('개발 서버 실행 (yarn dev, dsuai.localhost:3001)'));
children.push(bullet('helpers.ts의 STUDENT / INSTRUCTOR 계정 설정 또는 환경변수 지정'));
children.push(bullet('Playwright Chromium 브라우저 설치: npx playwright install chromium'));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── 2. 학습자 요약 테이블 ──
children.push(heading1('2. 학습자 테스트 케이스'));
children.push(heading2('2.1 테스트 케이스 목록 요약'));
children.push(emptyLine());
children.push(makeSummaryTable(STUDENT_TCS, '학습자'));
children.push(emptyLine());

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── 학습자 상세 ──
children.push(heading2('2.2 테스트 케이스 상세'));
for (const tc of STUDENT_TCS) {
  children.push(emptyLine());
  children.push(makeTcDetailTable(tc));
  children.push(emptyLine());
}

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── 3. 교수자 요약 테이블 ──
children.push(heading1('3. 교수자 테스트 케이스'));
children.push(heading2('3.1 테스트 케이스 목록 요약'));
children.push(emptyLine());
children.push(makeSummaryTable(INSTRUCTOR_TCS, '교수자'));
children.push(emptyLine());

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── 교수자 상세 ──
children.push(heading2('3.2 테스트 케이스 상세'));
for (const tc of INSTRUCTOR_TCS) {
  children.push(emptyLine());
  children.push(makeTcDetailTable(tc));
  children.push(emptyLine());
}

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── 4. 체크리스트 ──
children.push(heading1('4. 테스트 체크리스트'));
children.push(emptyLine());

const checklistTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    headerRow([
      { text: '구분' },
      { text: 'TC ID' },
      { text: '시나리오' },
      { text: '통과' },
      { text: '실패' },
      { text: '보류' },
      { text: '비고' },
    ]),
    ...[
      ...STUDENT_TCS.map(tc => ({ group: '학습자', ...tc })),
      ...INSTRUCTOR_TCS.map(tc => ({ group: '교수자', ...tc })),
    ].map((tc, i) =>
      dataRow([
        { text: tc.group, bold: true },
        { text: tc.id, bold: true },
        { text: tc.scenario, align: AlignmentType.LEFT },
        { text: '□' },
        { text: '□' },
        { text: '□' },
        { text: '' },
      ], i % 2 === 1)
    ),
  ],
});

children.push(checklistTable);
children.push(emptyLine());

// ── 5. 테스트 결과 요약 ──
children.push(heading1('5. 테스트 결과 요약'));
children.push(emptyLine());

const resultTable = new Table({
  width: { size: 60, type: WidthType.PERCENTAGE },
  rows: [
    headerRow([{ text: '구분' }, { text: '전체' }, { text: '통과' }, { text: '실패' }, { text: '보류' }, { text: '통과율' }]),
    dataRow([
      { text: '학습자', bold: true },
      { text: '19' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
    ]),
    dataRow([
      { text: '교수자', bold: true },
      { text: '25' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
    ], true),
    dataRow([
      { text: '합계', bold: true },
      { text: '44' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
    ]),
  ],
});

children.push(resultTable);

// ─────────────────────── 문서 생성 ───────────────────────
const doc = new Document({
  creator: 'AITC Test Team',
  title: 'AI 조교 통합 테스트 케이스 명세서',
  description: 'aitc.xlsx 기반 Playwright E2E 통합 테스트 명세서',
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.2),
            right: convertInchesToTwip(1.2),
          },
        },
      },
      children,
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outPath = join(__dirname, 'AITC_테스트케이스_명세서.docx');
writeFileSync(outPath, buffer);
console.log('✅ 문서 생성 완료:', outPath);
