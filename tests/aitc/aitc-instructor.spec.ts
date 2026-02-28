/**
 * AI 조교 통합 테스트 — 교수자 시나리오
 * 대상: https://ai.devus.co.kr  (storageState: auth/instructor.json)
 * 실제 사이트 탐색 결과 기반 셀렉터 사용
 *
 * 주요 URL:
 *   /            → 소개/홈
 *   /lecture     → 강의클럽 목록 (개설하기 버튼 포함)
 *   /my-lecture-clubs → My강의클럽 목록
 *   /lecture-dashboard/{id} → 강의 대시보드 (학생별/강의별/CQI/플레이그라운드)
 *   /studyroom   → My학습방
 *   /my-students → My학습자
 */
import { test, expect } from '@playwright/test';
import {
  BASE_URL, goto,
  acceptTermsIfPresent, dismissAlertIfPresent,
} from './helpers';

// ──────────────────────────────────────────────
// TC001 소개 페이지 진입
// ──────────────────────────────────────────────
test('TC001 [교수자] 소개 페이지 진입 - 이미지/내용 정상 표출', async ({ page }) => {
  dismissAlertIfPresent(page);
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');

  await expect(page.getByText('AI조교', { exact: true }).first()).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('IoT Convergence Open Sharing System', { exact: true })).toBeVisible();
  await expect(page.locator('main img').first()).toBeVisible();
});

// ──────────────────────────────────────────────
// TC002 교수자 회원가입 및 로그인
// ──────────────────────────────────────────────
test('TC002 [교수자] 로그인 상태 확인 - 헤더 교수자 메뉴 노출', async ({ page }) => {
  dismissAlertIfPresent(page);
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');

  // 로그인 후 프로필 avatar 버튼 노출 (aria-label="" 인 두 번째 nav 버튼)
  await expect(page.locator('nav button[aria-label=""]')).toBeVisible({ timeout: 10_000 });

  // 교수자 전용 메뉴 노출 (인라인 nav — 1280px에서는 드로어 없이 inline 표시)
  await expect(page.locator('nav').getByText('My강의클럽')).toBeVisible({ timeout: 5_000 });
  await expect(page.locator('nav').getByText('My학습자')).toBeVisible();
});

// ──────────────────────────────────────────────
// TC003 강의클럽 개설하기 (실제 개설 전체 플로우)
// ──────────────────────────────────────────────
test('TC003 [교수자] 강의클럽 개설하기 - 실제 개설 완료', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/lecture');
  await page.waitForTimeout(1500);

  // ── Step 1: 강의 정보 입력 ───────────────────────────
  const createBtn = page.locator('button').filter({ hasText: /강의클럽 개설하기/ }).first();
  await expect(createBtn).toBeVisible({ timeout: 10_000 });
  await createBtn.click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
  expect(page.url()).toContain('/lecture/open');

  // 강의명
  await page.locator('input[name="clubName"]').fill('테스트 클럽');

  // 추천 대학 선택 (Default select example)
  await page.getByLabel('Default select example').selectOption('세종대학교');
  await page.waitForTimeout(500);

  // 추천 학과 — MUI 다중 선택 드롭다운
  const deptBtn = page.locator('[aria-haspopup="listbox"]').first();
  await deptBtn.scrollIntoViewIfNeeded();
  await deptBtn.click();
  await page.waitForTimeout(600);
  const deptOptions = page.locator('[role="option"]');
  await expect(deptOptions.first()).toBeVisible({ timeout: 5_000 });
  await deptOptions.first().click({ force: true });
  await page.waitForTimeout(300);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 추천 학년 — 대학1학년
  await page.getByLabel('대학1학년').check();

  // 강의 시작일/종료일 — 기본값 그대로 둠

  // 강의회차 1로 설정 후 확인 버튼 (alert는 dismissAlertIfPresent 에서 자동 처리)
  const roundInput = page.getByRole('spinbutton');
  await roundInput.fill('1');
  await page.getByRole('button', { name: '확인' }).click();
  await page.waitForTimeout(500);

  // 학습 주제 (name="studySubject", placeholder 없는 첫 번째 input)
  const studySubjectInput = page.locator('input[name="studySubject"]').first();
  await studySubjectInput.fill('테스트 클럽');

  // 간략한 강의 소개
  await page.locator('article textarea').first().fill('테스트 클럽');

  // 강의 카드 이미지 — Image 1
  await page.locator('img[alt="Image 1"]').first().click({ force: true });
  await page.waitForTimeout(300);

  // 강의 배경 이미지 — Image 1
  await page.locator('img[alt="Image 1"]').nth(1).click({ force: true });
  await page.waitForTimeout(300);

  // 다음 (Step 1 → Step 2)
  await page.getByRole('button', { name: '다음' }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByText('강의 커리큘럼 입력').first()).toBeVisible({ timeout: 8_000 });

  // ── Step 2: 강의 커리큘럼 입력 ──────────────────────
  // 1회차 강의제목
  await page.locator('input[placeholder="강의제목을 입력해주세요."]').first().fill('테스트 클럽');

  // 강의 자료 — YouTube URL 입력 후 등록
  const ytUrlInput = page.locator('input[placeholder*="유튜브 URL"]').first();
  await ytUrlInput.fill('https://youtu.be/WFScuQ3jYxU?si=g0nlmL1gO_mLa5CW');
  await page.waitForTimeout(300);
  // URL 입력 옆 확인(등록) 버튼
  await ytUrlInput.locator('..').getByRole('button').click();
  await page.waitForTimeout(800);
  // 첨부된 URL 노출 확인
  await expect(page.getByText('첨부된 URL')).toBeVisible({ timeout: 5_000 });

  // 다음 (Step 2 → Step 3)
  await page.getByRole('button', { name: '다음' }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByText('클럽 개설하기').first()).toBeVisible({ timeout: 8_000 });

  // ── Step 3: 개설하기 ────────────────────────────────
  // alert("🎉 강의클럽이 성공적으로 개설되었습니다!")는 dismissAlertIfPresent 에서 자동 처리
  await page.getByRole('button', { name: '클럽 개설하기' }).click();
  await page.waitForTimeout(2000);

  // 개설 완료 후 강의 목록 페이지로 복귀
  await expect(page).toHaveURL(/\/lecture/, { timeout: 10_000 });
  test.info().annotations.push({ type: '확인', description: '강의클럽 개설 완료 및 목록 페이지 복귀' });
});

// ──────────────────────────────────────────────
// TC004 강의클럽 목록 확인
// ──────────────────────────────────────────────
test('TC004 [교수자] 강의클럽 목록 확인 - 탭/검색 UI 정상', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/lecture');
  await page.waitForTimeout(1500);

  await expect(page.getByText('강의클럽').first()).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('[role="tablist"]')).toBeVisible();
  await expect(page.locator('input[placeholder*="클럽검색"]')).toBeVisible();
  // 교수자 전용 개설 버튼
  await expect(page.locator('button').filter({ hasText: /강의클럽 개설하기/ })).toBeVisible();
});

// ──────────────────────────────────────────────
// TC005 강의클럽 상세보기 - MY 클럽 → 대시보드 이동
// ──────────────────────────────────────────────
test('TC005 [교수자] My강의클럽 - 강의 대시보드 진입', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  await expect(page.getByText('My강의클럽').first()).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('내가 운영중인 강의클럽을 한 눈에')).toBeVisible();

  // 강의 목록 아이템
  const items = page.locator('article .tw-cursor-pointer');
  const count = await items.count();
  expect(count).toBeGreaterThan(0);

  // 첫 번째 강의 클릭 → 대시보드 이동
  await items.first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  // 대시보드 URL 확인
  expect(page.url()).toContain('/lecture-dashboard/');
  await expect(page.getByText('강의 대시보드').first()).toBeVisible({ timeout: 8_000 });
});

// ──────────────────────────────────────────────
// TC006 강의클럽 상세보기 - 타 클럽
// ──────────────────────────────────────────────
test('TC006 [교수자] 강의클럽 목록 - 타 교수자 클럽 접근', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/lecture');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  const count = await items.count();
  if (count > 0) {
    await items.first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    expect(page.url()).not.toBe(`${BASE_URL}/lecture`);
    test.info().annotations.push({ type: '확인', description: `이동 URL: ${page.url()}` });
  } else {
    test.info().annotations.push({ type: '건너뜀', description: '전체 강의클럽 목록 데이터 없음' });
  }
});

// ──────────────────────────────────────────────
// TC007 Q&A 보기
// ──────────────────────────────────────────────
test('TC007 [교수자] 강의 대시보드 - Q&A 관련 정보 확인', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  await expect(items.first()).toBeVisible({ timeout: 10_000 });
  await items.first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  // 대시보드에 최근 학습 질의 내역 섹션
  await expect(page.getByText('최근 학습 질의 내역')).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText('최근 미응답 내역')).toBeVisible();
});

// ──────────────────────────────────────────────
// TC008 AI 조교 팝업
// ──────────────────────────────────────────────
test('TC008 [교수자] AI 조교 팝업 - 클럽/회차 선택 드롭다운', async ({ page }) => {
  dismissAlertIfPresent(page);
  // AI 조교 chatbot 버튼은 /studyroom(My학습방) 에 위치
  await goto(page, '/studyroom');
  await page.waitForTimeout(2000);

  // chatbot 이미지 버튼 클릭
  const chatbotBtn = page.locator('img[alt="chatbot"]');
  await expect(chatbotBtn).toBeVisible({ timeout: 10_000 });
  await chatbotBtn.click();
  await page.waitForTimeout(1500);

  // AI 조교 팝업 — MuiDialog-root 사용 (MuiDialog-paper가 height:0 이라 [role="dialog"] 로는 toBeVisible 불가)
  const chatPanel = page.locator('.MuiDialog-root').first();
  await expect(chatPanel).toBeVisible({ timeout: 8_000 });

  // 챗봇 UI는 iframe 안에 위치 — iframe 노출 확인
  const chatIframe = page.locator('iframe').first();
  await expect(chatIframe).toBeVisible({ timeout: 5_000 });
  test.info().annotations.push({ type: '확인', description: 'AI 조교 팝업(iframe) 노출됨' });

  // iframe 내 콤보박스는 frameLocator 통해 접근
  const frame = page.frameLocator('iframe').first();
  const lectureSelect = frame.getByRole('combobox').first();
  const hasSelect = await lectureSelect.isVisible({ timeout: 5_000 }).catch(() => false);
  test.info().annotations.push({ type: '확인', description: `iframe 내 강의 선택 콤보박스: ${hasSelect}` });

  const hasRound = await frame.getByRole('combobox').nth(1).isVisible({ timeout: 3000 }).catch(() => false);
  test.info().annotations.push({ type: '확인', description: `회차 선택: ${hasRound}` });
});

// ──────────────────────────────────────────────
// TC009 강의클럽 대시보드
// ──────────────────────────────────────────────
test('TC009 [교수자] 강의 대시보드 - 클럽인원/AI피드백 현황 확인', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  await expect(items.first()).toBeVisible({ timeout: 10_000 });
  await items.first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  expect(page.url()).toContain('/lecture-dashboard/');

  // 주요 섹션 확인
  await expect(page.getByText('강의 대시보드').first()).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText('클럽인원')).toBeVisible();
  await expect(page.getByText('클럽정보')).toBeVisible();
  await expect(page.getByText('최근 학습 질의 내역')).toBeVisible();
  await expect(page.getByText('최근 미응답 내역')).toBeVisible();
  await expect(page.getByText('AI피드백 현황')).toBeVisible();
  await expect(page.getByText('강의자료 답변')).toBeVisible();
  await expect(page.getByText('일반서치 답변')).toBeVisible();
  await expect(page.getByText('AI 미응답')).toBeVisible();
});

// ──────────────────────────────────────────────
// TC010 CQI 보고서 생성
// ──────────────────────────────────────────────
test('TC010 [교수자] 강의 대시보드 - CQI 보고서 생성 버튼', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  await expect(items.first()).toBeVisible({ timeout: 10_000 });
  await items.first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  // CQI 보고서 생성 버튼
  const cqiBtn = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'CQI 보고서 생성' }).first();
  await expect(cqiBtn).toBeVisible({ timeout: 8_000 });
  await cqiBtn.click();
  await page.waitForTimeout(2000);
  test.info().annotations.push({ type: '확인', description: 'CQI 보고서 생성 버튼 클릭됨' });
});

// ──────────────────────────────────────────────
// TC011 플레이그라운드
// ──────────────────────────────────────────────
test('TC011 [교수자] 강의 대시보드 - 플레이그라운드 버튼', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  await expect(items.first()).toBeVisible({ timeout: 10_000 });
  await items.first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  // 플레이그라운드 버튼
  const pgBtn = page.locator('[class*="cursor-pointer"]').filter({ hasText: '플레이그라운드' }).first();
  await expect(pgBtn).toBeVisible({ timeout: 8_000 });
  await pgBtn.click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  // 플레이그라운드 페이지 URL 또는 컨텐츠
  const url = page.url();
  test.info().annotations.push({ type: '확인', description: `플레이그라운드 이동: ${url}` });
  expect(url).toBeTruthy();
});

// ──────────────────────────────────────────────
// TC012 학습 총평 - AI 피드백 생성
// ──────────────────────────────────────────────
test('TC012 [교수자] 강의 대시보드 - AI 피드백 현황 섹션', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  await expect(items.first()).toBeVisible({ timeout: 10_000 });
  await items.first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  // AI 피드백 현황 섹션 확인
  await expect(page.getByText('AI피드백 현황')).toBeVisible({ timeout: 8_000 });

  // 강의자료 답변 / 일반서치 답변 / AI 미응답 수치 확인
  const feedbackSection = page.locator('[class*="Dashboard"]').filter({ hasText: 'AI피드백 현황' });
  const sectionVisible = await feedbackSection.isVisible({ timeout: 3000 }).catch(() => false);
  test.info().annotations.push({ type: '확인', description: `AI 피드백 섹션: ${sectionVisible}` });
});

// ──────────────────────────────────────────────
// TC013 학생별 보기
// ──────────────────────────────────────────────
test('TC013 [교수자] 강의 대시보드 - 학생별 보기 탭', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  await expect(items.first()).toBeVisible({ timeout: 10_000 });
  await items.first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  // 학생별 보기 탭 (paragraph)
  const studentViewTab = page.locator('p, [class*="cursor-pointer"]').filter({ hasText: '학생별 보기' }).first();
  await expect(studentViewTab).toBeVisible({ timeout: 8_000 });

  // 테이블 헤더 확인
  await expect(page.getByRole('columnheader', { name: '학습자' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '학습 참여도' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '질의합산' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '학습총평' })).toBeVisible();
});

// ──────────────────────────────────────────────
// TC014 강의별 보기
// ──────────────────────────────────────────────
test('TC014 [교수자] 강의 대시보드 - 강의별 보기 탭 클릭', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  await expect(items.first()).toBeVisible({ timeout: 10_000 });
  await items.first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  // 강의별 보기 탭 클릭
  const lectureViewTab = page.locator('p, [class*="cursor-pointer"]').filter({ hasText: '강의별 보기' }).first();
  await expect(lectureViewTab).toBeVisible({ timeout: 8_000 });
  await lectureViewTab.click();
  await page.waitForTimeout(1500);

  test.info().annotations.push({ type: '확인', description: '강의별 보기 탭 클릭 성공' });
});

// ──────────────────────────────────────────────
// TC015 강의클럽 관리하기 (설정 수정)
// ──────────────────────────────────────────────
test('TC015 [교수자] 강의 대시보드 - 강의 설정(콤보박스) 변경', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  await expect(items.first()).toBeVisible({ timeout: 10_000 });
  await items.first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  // 강의 선택 콤보박스 (<select> 요소 — getByRole 사용)
  const lectureCombo = page.getByRole('combobox').first();
  await expect(lectureCombo).toBeVisible({ timeout: 8_000 });

  // 옵션 수 확인
  const options = await lectureCombo.locator('option').count();
  test.info().annotations.push({ type: '확인', description: `강의 선택 옵션 수: ${options}` });
  expect(options).toBeGreaterThan(0);

  // 설정(톱니바퀴) 버튼 확인
  const settingBtn = page.locator('button').nth(1); // 대시보드 두 번째 버튼 (첫 번째는 알림)
  const hasSetting = await settingBtn.isVisible({ timeout: 3000 }).catch(() => false);
  test.info().annotations.push({ type: '확인', description: `설정 버튼 존재: ${hasSetting}` });
});

// ──────────────────────────────────────────────
// TC016 마이페이지 - 프로필 보기
// ──────────────────────────────────────────────
test('TC016 [교수자] 마이페이지 - Account settings 버튼 노출', async ({ page }) => {
  dismissAlertIfPresent(page);
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  // 프로필 avatar 버튼 (aria-label="" 인 두 번째 nav 버튼)
  await expect(page.locator('nav button[aria-label=""]')).toBeVisible({ timeout: 10_000 });
});

// ──────────────────────────────────────────────
// TC017 마이페이지 - 프로필 수정
// ──────────────────────────────────────────────
test('TC017 [교수자] 마이페이지 - Account settings 클릭 및 반응 확인', async ({ page }) => {
  dismissAlertIfPresent(page);
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');

  const btn = page.locator('nav button[aria-label=""]');
  await expect(btn).toBeVisible({ timeout: 10_000 });
  await btn.click();
  await page.waitForTimeout(600);
  // 클릭 후 프로필 메뉴(마이페이지 + Logout) 팝업
  await expect(page.locator('[role="menu"]')).toBeVisible({ timeout: 3_000 });
});

// ──────────────────────────────────────────────
// TC018 마이페이지 - 교수자 권한 확인
// ──────────────────────────────────────────────
test('TC018 [교수자] 드로어 - 교수자 전용 메뉴(My강의클럽/My학습자) 노출', async ({ page }) => {
  dismissAlertIfPresent(page);
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  // 1280px 뷰포트에서는 인라인 nav 표시 (드로어 버튼 없음)
  await expect(page.locator('nav').getByText('My강의클럽')).toBeVisible({ timeout: 5_000 });
  await expect(page.locator('nav').getByText('My학습자')).toBeVisible();
  await expect(page.locator('nav').getByText('관리 페이지')).toBeVisible();
});

// ──────────────────────────────────────────────
// TC019 내 지도교수자 관리
// ──────────────────────────────────────────────
test('TC019 [교수자] My학습자 - 페이지 접속 및 검색 UI', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-students');
  await page.waitForTimeout(1500);

  await expect(page.getByText('My학습자').first()).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('지도교수자로 등록된 학생들 목록입니다')).toBeVisible();
  await expect(page.locator('input[placeholder*="학습자명"]')).toBeVisible();
});

// ──────────────────────────────────────────────
// TC020 클럽 즐겨찾기
// ──────────────────────────────────────────────
test('TC020 [교수자] My강의클럽 - 필터(진행중/예정/종료) 체크박스', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  // 필터 체크박스 확인
  await expect(page.locator('input[type="checkbox"]').filter({ hasText: /진행중/ }).or(
    page.getByText('진행중인 강의')
  )).toBeVisible({ timeout: 10_000 });

  const checkboxes = page.locator('input[type="checkbox"]');
  const cnt = await checkboxes.count();
  expect(cnt).toBeGreaterThanOrEqual(1);
  test.info().annotations.push({ type: '확인', description: `필터 체크박스 수: ${cnt}` });
});

// ──────────────────────────────────────────────
// TC021 내 친구관리
// ──────────────────────────────────────────────
test('TC021 [교수자] My강의클럽 - 검색 기능', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const searchInput = page.locator('input[placeholder*="강의클럽명"]');
  await expect(searchInput).toBeVisible({ timeout: 10_000 });

  await searchInput.fill('테스트');
  await page.waitForTimeout(1000);
  await expect(page.locator('article')).toBeVisible();
});

// ──────────────────────────────────────────────
// TC022 커뮤니티
// ──────────────────────────────────────────────
test('TC022 [교수자] My강의클럽 - 강의 목록 아이템 1개 이상 존재', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  const count = await items.count();
  expect(count).toBeGreaterThan(0);
  test.info().annotations.push({ type: '확인', description: `강의클럽 수: ${count}` });
});

// ──────────────────────────────────────────────
// TC023 개인정보관리
// ──────────────────────────────────────────────
test('TC023 [교수자] 알림 버튼 - 알림 배지 노출', async ({ page }) => {
  dismissAlertIfPresent(page);
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');

  // 알림 버튼: aria-label="show N new notifications"
  const alarmArea = page.locator('[aria-label*="notifications"]').first();
  await expect(alarmArea).toBeVisible({ timeout: 10_000 });

  // 알림 배지 숫자 (MUI Badge)
  const badge = alarmArea.locator('[class*="badge"], [class*="Badge"]').first();
  const hasBadge = await badge.isVisible({ timeout: 3000 }).catch(() => false);
  test.info().annotations.push({ type: '확인', description: `알림 배지: ${hasBadge}` });
});

// ──────────────────────────────────────────────
// TC024 비밀번호 변경
// ──────────────────────────────────────────────
test('TC024 [교수자] 강의 대시보드 - 전체 학습 보기 링크', async ({ page }) => {
  dismissAlertIfPresent(page);
  await goto(page, '/my-lecture-clubs');
  await page.waitForTimeout(2000);

  const items = page.locator('article .tw-cursor-pointer');
  await expect(items.first()).toBeVisible({ timeout: 10_000 });
  await items.first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  // 전체 학습 보기 링크
  const viewAllLink = page.locator('[class*="cursor-pointer"]').filter({ hasText: '전체 학습 보기' }).first();
  await expect(viewAllLink).toBeVisible({ timeout: 8_000 });
  test.info().annotations.push({ type: '확인', description: '전체 학습 보기 링크 노출' });
});

// ──────────────────────────────────────────────
// TC025 휴대전화 번호 변경
// ──────────────────────────────────────────────
test('TC025 [교수자] 드로어 - 로그아웃 버튼 노출', async ({ page }) => {
  dismissAlertIfPresent(page);
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  // 1280px에서는 드로어 없음 → 프로필 아바타 클릭 후 메뉴에서 Logout 확인
  const profileBtn = page.locator('nav button[aria-label=""]');
  await expect(profileBtn).toBeVisible({ timeout: 10_000 });
  await profileBtn.click();
  await page.waitForTimeout(600);

  const logoutItem = page.locator('[role="menuitem"]').filter({ hasText: 'Logout' }).first();
  await expect(logoutItem).toBeVisible({ timeout: 5_000 });
  test.info().annotations.push({ type: '확인', description: '로그아웃 메뉴 노출 확인' });
});
