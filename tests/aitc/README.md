# AI 조교 통합 테스트 (AITC)

`aitc.xlsx` 의 **AI조교_테스트_학습자 / AI조교_테스트_교수자** 시트를 기반으로 작성된 Playwright E2E 통합 테스트입니다.

## 파일 구조

```
tests/aitc/
├── playwright.config.ts       # Playwright 설정
├── helpers.ts                 # 공통 헬퍼 (로그인, 네비게이션 등)
├── aitc-student.spec.ts       # 학습자 테스트 TC001~TC019
├── aitc-instructor.spec.ts    # 교수자 테스트 TC001~TC025
└── README.md
```

## 사전 준비

### 1. hosts 파일 설정
```
127.0.0.1  dsuai.localhost
```
- Windows: `C:\Windows\System32\drivers\etc\hosts`

### 2. Playwright 설치 확인
```bash
npx playwright install chromium
```

### 3. 테스트 계정 설정
`helpers.ts` 의 `STUDENT` / `INSTRUCTOR` 객체를 수정하거나 환경변수로 설정:
```bash
export TEST_STUDENT_ID=실제_학번
export TEST_STUDENT_PW=실제_비밀번호
export TEST_INSTRUCTOR_ID=실제_교번
export TEST_INSTRUCTOR_PW=실제_비밀번호
```

### 4. 개발 서버 실행
```bash
# dsuai.localhost:3001 에서 서버가 실행 중이어야 함
yarn dev
```

## 실행 방법

```bash
# 전체 실행
npx playwright test tests/aitc/ --config tests/aitc/playwright.config.ts

# 학습자 테스트만
npx playwright test tests/aitc/aitc-student.spec.ts --config tests/aitc/playwright.config.ts

# 교수자 테스트만
npx playwright test tests/aitc/aitc-instructor.spec.ts --config tests/aitc/playwright.config.ts

# 특정 TC만 (예: TC006 AI 조교 질의)
npx playwright test tests/aitc/aitc-student.spec.ts --grep "TC006" --config tests/aitc/playwright.config.ts

# UI 모드 (디버깅용)
npx playwright test tests/aitc/ --config tests/aitc/playwright.config.ts --ui

# HTML 리포트 보기
npx playwright show-report tests/aitc/playwright-report
```

## 테스트 케이스 목록

### 학습자 (aitc-student.spec.ts)

| TC | 화면 | 시나리오 |
|---|---|---|
| TC001 | 소개 페이지 | 소개 페이지 진입 - 이미지/내용 정상 표출 |
| TC002 | 로그인 | 학생 회원가입 및 로그인 |
| TC003 | 강의 클럽 | 강의클럽 참여하기 |
| TC004 | 강의 클럽 | 강의클럽 목록 확인 (회차별) |
| TC005 | 강의 클럽 | 강의클럽 상세보기 (기간/현황/주제/키워드/스킬/인원) |
| TC006 | AI 조교 | AI 조교 질의 (우측 하단 버튼, 질문 입력, 답변 확인) |
| TC007 | 강의 클럽 | Q&A 보기 (회차별 질문/AI 답변 내역) |
| TC008 | 강의 클럽 | 총평 피드백 보기 |
| TC009 | 나의 학습방 | 가입한 클럽 목록/학습 캘린더/즐겨찾기 |
| TC010 | 마이페이지 | 프로필 보기 |
| TC011 | 마이페이지 | 프로필 수정 |
| TC012 | 마이페이지 | 교수자 권한 요청 |
| TC013 | 마이페이지 | 내 지도교수자 관리 |
| TC014 | 마이페이지 | 클럽 즐겨찾기 목록 |
| TC015 | 마이페이지 | 내 친구관리 |
| TC016 | 마이페이지 | 커뮤니티 작성글 |
| TC017 | 마이페이지 | 개인정보관리 |
| TC018 | 마이페이지 | 비밀번호 변경 |
| TC019 | 마이페이지 | 휴대전화 번호 변경 |

### 교수자 (aitc-instructor.spec.ts)

| TC | 화면 | 시나리오 |
|---|---|---|
| TC001 | 소개 페이지 | 소개 페이지 진입 |
| TC002 | 로그인 | 교수자 회원가입 및 로그인 |
| TC003 | 강의 클럽 | 강의클럽 개설하기 (설정 항목 포함) |
| TC004 | 강의 클럽 | 강의클럽 목록 확인 |
| TC005 | 강의 클럽 | 상세보기 - MY 클럽 → 대시보드 이동 |
| TC006 | 강의 클럽 | 상세보기 - 타 클럽 → 학생과 동일 |
| TC007 | 강의 클럽 | Q&A 보기 |
| TC008 | AI 조교 | AI 조교 팝업 - 클럽/회차 선택, 학습자 질의 확인 |
| TC009 | MY 강의클럽 | 강의클럽 대시보드 (인원/정보/질의/미응답/피드백) |
| TC010 | MY 강의클럽 | CQI 보고서 생성 |
| TC011 | MY 강의클럽 | 플레이그라운드 |
| TC012 | MY 강의클럽 | 학습 총평 - AI 피드백 생성 |
| TC013 | MY 강의클럽 | 학생별 보기 |
| TC014 | MY 강의클럽 | 강의별 보기 |
| TC015 | MY 강의클럽 | 강의클럽 관리하기 (설정 수정) |
| TC016 | 마이페이지 | 프로필 보기 |
| TC017 | 마이페이지 | 프로필 수정 |
| TC018 | 마이페이지 | 교수자 권한 요청 |
| TC019 | 마이페이지 | 내 지도교수자 관리 |
| TC020 | 마이페이지 | 클럽 즐겨찾기 목록 |
| TC021 | 마이페이지 | 내 친구관리 |
| TC022 | 마이페이지 | 커뮤니티 작성글 |
| TC023 | 마이페이지 | 개인정보관리 |
| TC024 | 마이페이지 | 비밀번호 변경 |
| TC025 | 마이페이지 | 휴대전화 번호 변경 |
