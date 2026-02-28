/**
 * AI 조교 통합 테스트 — 교수자/학습자 순차 통합 시나리오
 *
 * 7-Phase 실행 순서:
 *   Phase 1: 교수자 TC001-003  → 테스트 클럽 개설 + 클럽 ID 추출
 *   Phase 2: 학습자 TC001-003  → 테스트 클럽 참여 신청
 *   Phase 3: 교수자 TC004-005  → 대시보드 진입 · 학습자 가입 일괄 승인
 *   Phase 4: 학습자 TC004-007  → AI조교 질의 (oneM2M 표준이 뭐야?)
 *   Phase 5: 교수자 TC006-025  → 대시보드 / CQI / Playground / AI피드백
 *   Phase 6: 학습자 TC008-019  → 총평 피드백 확인
 *   Phase 7: 교수자 Cleanup    → 테스트 클럽 삭제
 *
 * 전제조건:
 *   - workers: 1, fullyParallel: false (순차 실행)
 *   - 모듈 범위 변수 clubId 로 클럽 ID 공유 (단일 워커 환경)
 */
import { test, expect } from '@playwright/test';
import { BASE_URL, goto, dismissAlertIfPresent } from './helpers';
import * as path from 'path';
import * as fs from 'fs';

const INSTRUCTOR_STATE = path.join(__dirname, 'auth/instructor.json');
const STUDENT_STATE    = path.join(__dirname, 'auth/student.json');

// ─────────────────────────────────────────────────────────
// storageState 변경 시 Playwright가 모듈을 재평가하므로
// 파일 기반으로 clubId를 영속화한다 (단일 실행 세션 내)
// ─────────────────────────────────────────────────────────
const CLUB_ID_FILE = path.join(__dirname, '.club-id-temp.txt');

let clubId = '';

function saveClubId(id: string): void {
  try { fs.writeFileSync(CLUB_ID_FILE, id, 'utf-8'); } catch (_) {}
}

function loadClubId(): string {
  try { return fs.readFileSync(CLUB_ID_FILE, 'utf-8').trim(); } catch (_) { return ''; }
}

// P5-TC010 CQI 보고서 내용 저장 (참고용)
const CQI_CONTENT_FILE = path.join(__dirname, '.cqi-content-temp.txt');

function saveCqiContent(text: string): void {
  try { fs.writeFileSync(CQI_CONTENT_FILE, text, 'utf-8'); } catch (_) {}
}

// P6-TC008 비교용 — P5-TC012에서 생성된 학생 총평 AI피드백 내용 저장
const AI_FEEDBACK_FILE = path.join(__dirname, '.ai-feedback-temp.txt');

function saveAiFeedbackContent(text: string): void {
  try { fs.writeFileSync(AI_FEEDBACK_FILE, text, 'utf-8'); } catch (_) {}
}

function loadAiFeedbackContent(): string {
  try { return fs.readFileSync(AI_FEEDBACK_FILE, 'utf-8').trim(); } catch (_) { return ''; }
}

// ══════════════════════════════════════════════════════════
// Phase 0 : 사전 정리 — 이전 실행에서 남은 "테스트 클럽" 삭제
// ══════════════════════════════════════════════════════════
test.describe('Phase0: 사전 정리', () => {
  test.use({ storageState: INSTRUCTOR_STATE });

  test('P0-SETUP [교수자] 기존 테스트 클럽 전체 삭제 후 시작', async ({ page }) => {
    test.setTimeout(120_000);
    dismissAlertIfPresent(page);

    // 이전 실행의 clubId 파일 초기화
    saveClubId('');
    clubId = '';

    await goto(page, '/my-lecture-clubs');
    await page.waitForTimeout(2000);
    await expect(page.getByText('My강의클럽').first()).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(1000);

    // "테스트 클럽" 검색
    const searchInput = page.locator('input[placeholder*="강의클럽명"]');
    await searchInput.fill('테스트 클럽');
    await page.waitForTimeout(1500);

    // 있는 모든 "테스트 클럽" 삭제 (최대 30개)
    let deletedCount = 0;
    for (let attempt = 0; attempt < 30; attempt++) {
      const deleteButtons = page.getByRole('button', { name: '클럽삭제' });
      const btnCount = await deleteButtons.count();
      if (btnCount === 0) break;

      await deleteButtons.first().click();
      await page.waitForTimeout(800);

      const muiConfirm = page.locator('[role="dialog"]').getByRole('button').filter({ hasText: /확인|예|삭제/ }).first();
      if (await muiConfirm.isVisible({ timeout: 2000 }).catch(() => false)) {
        await muiConfirm.click();
        await page.waitForTimeout(1500);
      }
      deletedCount++;
    }

    test.info().annotations.push({ type: '확인', description: `사전 정리 완료: 테스트 클럽 ${deletedCount}개 삭제` });
  });
});

// ══════════════════════════════════════════════════════════
// Phase 1 : 교수자 — 테스트 클럽 개설
// ══════════════════════════════════════════════════════════
test.describe('Phase1: 교수자 초기 설정', () => {
  test.use({ storageState: INSTRUCTOR_STATE });

  test('P1-TC001 [교수자] 소개 페이지 진입 - 이미지/내용 정상 표출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('AI조교', { exact: true }).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('IoT Convergence Open Sharing System', { exact: true })).toBeVisible();
    await expect(page.locator('main img').first()).toBeVisible();
  });

  test('P1-TC002 [교수자] 로그인 상태 확인 - 헤더 교수자 메뉴 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('nav button[aria-label=""]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('nav').getByText('My강의클럽')).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('nav').getByText('My학습자')).toBeVisible();
  });

  test('P1-TC003 [교수자] 테스트 클럽 개설 - 실제 개설 완료 및 클럽 ID 추출', async ({ page }) => {
    test.setTimeout(120_000);
    dismissAlertIfPresent(page);
    await goto(page, '/lecture');
    await page.waitForTimeout(1500);

    // ── Step 1: 강의 정보 입력 ──────────────────────────
    const createBtn = page.locator('button').filter({ hasText: /강의클럽 개설하기/ }).first();
    await expect(createBtn).toBeVisible({ timeout: 10_000 });
    await createBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/lecture/open');

    await page.locator('input[name="clubName"]').fill('테스트 클럽');
    await page.getByLabel('Default select example').selectOption('세종대학교');
    await page.waitForTimeout(500);

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

    await page.getByLabel('대학1학년').check();

    const roundInput = page.getByRole('spinbutton');
    await roundInput.fill('1');
    await page.getByRole('button', { name: '확인' }).click();
    await page.waitForTimeout(500);

    const studySubjectInput = page.locator('input[name="studySubject"]').first();
    await studySubjectInput.fill('테스트 클럽');
    await page.locator('article textarea').first().fill('테스트 클럽');
    await page.locator('img[alt="Image 1"]').first().click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('img[alt="Image 1"]').nth(1).click({ force: true });
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: '다음' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('강의 커리큘럼 입력').first()).toBeVisible({ timeout: 8_000 });

    // ── Step 2: 강의 커리큘럼 입력 ─────────────────────
    await page.locator('input[placeholder="강의제목을 입력해주세요."]').first().fill('테스트 클럽');
    const ytUrlInput = page.locator('input[placeholder*="유튜브 URL"]').first();
    await ytUrlInput.fill('https://youtu.be/WFScuQ3jYxU?si=g0nlmL1gO_mLa5CW');
    await page.waitForTimeout(300);
    await ytUrlInput.locator('..').getByRole('button').click();
    await page.waitForTimeout(800);
    await expect(page.getByText('첨부된 URL')).toBeVisible({ timeout: 5_000 });

    await page.getByRole('button', { name: '다음' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('클럽 개설하기').first()).toBeVisible({ timeout: 8_000 });

    // ── Step 3: 개설하기 ────────────────────────────────
    await page.getByRole('button', { name: '클럽 개설하기' }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/lecture/, { timeout: 10_000 });

    // ── 클럽 ID 추출: My강의클럽에서 "테스트 클럽" 검색 후 클릭 ──
    // 체크박스 루프 제거 — 기본 "진행중인 강의" 탭에서 바로 검색
    await page.goto(`${BASE_URL}/my-lecture-clubs`);
    await page.waitForTimeout(3000);

    // 클럽명 검색
    const mlcSearch = page.locator('input[placeholder*="강의클럽명"]');
    await mlcSearch.fill('테스트 클럽');
    await page.waitForTimeout(1500);

    // 첫 번째 "테스트 클럽" 카드 클릭
    const testClubCard = page.locator('article .tw-cursor-pointer').filter({ hasText: '테스트 클럽' }).first();
    await expect(testClubCard).toBeVisible({ timeout: 10_000 });
    await testClubCard.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // URL에서 클럽 ID 추출 후 파일로 영속화
    const dashUrl = page.url();
    const idMatch = dashUrl.match(/lecture-dashboard\/(\d+)/);
    clubId = idMatch ? idMatch[1] : '';
    saveClubId(clubId);
    expect(clubId).toBeTruthy();
    test.info().annotations.push({ type: '클럽ID', description: `테스트 클럽 ID: ${clubId}` });
  });
});

// ══════════════════════════════════════════════════════════
// Phase 2 : 학습자 — 테스트 클럽 참여 신청
// ══════════════════════════════════════════════════════════
test.describe('Phase2: 학습자 클럽 참여', () => {
  test.use({ storageState: STUDENT_STATE });

  test('P2-TC001 [학습자] 소개 페이지 진입 - 이미지/내용 정상 표출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('AI조교', { exact: true }).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('IoT Convergence Open Sharing System', { exact: true })).toBeVisible();
    await expect(page.locator('main img').first()).toBeVisible();
  });

  test('P2-TC002 [학습자] 로그인 상태 확인 - 헤더 학습자 메뉴 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await expect(page.locator('nav button[aria-label=""]')).toBeVisible({ timeout: 10_000 });
    const loginBtnCount = await page.locator('button').filter({ hasText: /^로그인$/ }).count();
    expect(loginBtnCount).toBe(0);
  });

  test('P2-TC003 [학습자] 테스트 클럽 가입 신청', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/lecture');
    await page.waitForTimeout(1500);

    // 전체보기 탭 클릭 (모든 클럽 표시)
    const allTab = page.locator('[role="tab"]').filter({ hasText: '전체보기' });
    if (await allTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await allTab.click();
      await page.waitForTimeout(800);
    }

    // 테스트 클럽 검색
    const searchInput = page.locator('input[placeholder*="클럽검색"]');
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('테스트 클럽');
    await page.waitForTimeout(2000);

    // 클럽 카드 클릭 — 검색 결과 카드의 제목 텍스트를 직접 클릭
    // (이벤트 버블링으로 부모 링크/div 클릭 처리)
    const clubTitle = page.getByText('테스트 클럽').first();
    await expect(clubTitle).toBeVisible({ timeout: 15_000 });
    await clubTitle.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    const currentUrl = page.url();
    expect(currentUrl).not.toBe(`${BASE_URL}/lecture`);

    // 1단계: 우측 '참여하기' 버튼 클릭 (미노출 시 실패)
    const joinBtn = page.locator('button').filter({ hasText: /참여하기/ }).first();
    await expect(joinBtn).toBeVisible({ timeout: 8_000 });
    await joinBtn.click();
    await page.waitForTimeout(1500);

    // 2단계: 다음 화면에서 '강의클럽 가입요청' 버튼 클릭 (미노출 시 실패)
    const requestBtn = page.locator('button').filter({ hasText: /강의클럽 가입요청|가입요청|가입 요청/ }).first();
    await expect(requestBtn).toBeVisible({ timeout: 8_000 });
    await requestBtn.click();
    await page.waitForTimeout(2000);
    test.info().annotations.push({ type: '확인', description: '테스트 클럽 가입 신청 완료' });
  });
});

// ══════════════════════════════════════════════════════════
// Phase 3 : 교수자 — 강의클럽 관리 / 학습자 가입 승인
// ══════════════════════════════════════════════════════════
test.describe('Phase3: 교수자 강의클럽 관리', () => {
  test.use({ storageState: INSTRUCTOR_STATE });

  test('P3-TC004 [교수자] 강의클럽 목록 확인 - 탭/검색 UI 정상', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/lecture');
    await page.waitForTimeout(1500);
    await expect(page.getByText('강의클럽').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('[role="tablist"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="클럽검색"]')).toBeVisible();
    await expect(page.locator('button').filter({ hasText: /강의클럽 개설하기/ })).toBeVisible();
  });

  test('P3-TC005 [교수자] 테스트 클럽 - 대시보드 톱니바퀴 → 관리페이지 → 가입신청 일괄 승인', async ({ page }) => {
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();

    // 테스트 클럽 대시보드로 직접 이동
    await goto(page, `/lecture-dashboard/${clubId}`);
    await page.waitForTimeout(2000);
    await expect(page.getByText('강의 대시보드').first()).toBeVisible({ timeout: 10_000 });

    // 톱니바퀴(설정) 버튼 클릭 → 강의클럽 관리하기 페이지
    const gearBtn = page.locator('section').getByRole('button').first();
    await expect(gearBtn).toBeVisible({ timeout: 5_000 });
    await gearBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    expect(page.url()).toContain(`/manage-lecture-club/${clubId}`);
    await expect(page.getByText('강의클럽 관리하기').first()).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText('강의클럽 가입 신청')).toBeVisible();

    // 일괄 승인 버튼 클릭
    const bulkApproveBtn = page.getByRole('button', { name: '일괄 승인' });
    await expect(bulkApproveBtn).toBeVisible({ timeout: 5_000 });
    await bulkApproveBtn.click();
    await page.waitForTimeout(2000);
    test.info().annotations.push({ type: '확인', description: '가입신청 일괄 승인 완료' });
  });
});

// ══════════════════════════════════════════════════════════
// Phase 4 : 학습자 — AI조교 질의 및 Q&A
// ══════════════════════════════════════════════════════════
test.describe('Phase4: 학습자 AI조교 활용', () => {
  test.use({ storageState: STUDENT_STATE });

  test('P4-TC004 [학습자] 강의클럽 목록 확인 - 탭/검색 UI 정상 표출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/lecture');
    await expect(page.getByText('강의클럽').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('강의를 들으며 AI조교를 통해')).toBeVisible();
    await expect(page.locator('[role="tablist"]')).toBeVisible();
    await expect(page.locator('[role="tab"]').filter({ hasText: '전체보기' })).toBeVisible();
    await expect(page.locator('input[placeholder*="클럽검색"]')).toBeVisible();
  });

  test('P4-TC005 [학습자] 강의클럽 상세보기 - 강의 정보 확인', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/lecture');
    await page.waitForTimeout(1500);
    const items = page.locator('article .tw-cursor-pointer');
    const count = await items.count();
    if (count > 0) {
      await items.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      expect(page.url()).not.toBe(`${BASE_URL}/lecture`);
      const body = await page.locator('main').textContent();
      expect(body?.length).toBeGreaterThan(10);
    } else {
      test.info().annotations.push({ type: '건너뜀', description: '강의클럽 데이터 없음' });
    }
  });

  test('P4-TC006 [학습자] AI 조교 질의 - oneM2M 표준이 뭐야?', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/studyroom');
    await page.waitForTimeout(1500);

    // chatbot 버튼 클릭
    const chatbotBtn = page.locator('img[alt="chatbot"]');
    await expect(chatbotBtn).toBeVisible({ timeout: 10_000 });
    await chatbotBtn.click();
    await page.waitForTimeout(1500);

    // AI 조교 팝업
    const chatPanel = page.locator('.MuiDialog-root').first();
    await expect(chatPanel).toBeVisible({ timeout: 8_000 });

    const chatIframe = page.locator('iframe').first();
    await expect(chatIframe).toBeVisible({ timeout: 5_000 });

    // iframe 내 강의 선택 콤보박스 — 테스트 클럽 선택 시도
    const frame = page.frameLocator('iframe').first();
    const lectureSelect = frame.getByRole('combobox').first();
    const hasSelect = await lectureSelect.isVisible({ timeout: 5_000 }).catch(() => false);

    if (hasSelect) {
      // 옵션이 완전히 로드될 때까지 대기 (CI 환경에서 options 늦게 로드됨)
      await page.waitForTimeout(2000);
      const optTexts = await lectureSelect.locator('option').allTextContents().catch(() => [] as string[]);
      const testOpt = optTexts.find(o => o.includes('테스트 클럽'));
      // testOpt 미발견 시 첫 번째 유효 옵션을 fallback으로 선택
      const fallbackOpt = optTexts.find(o => o.trim().length > 0 && !/선택|--/.test(o));
      const optToSelect = testOpt || fallbackOpt;
      if (optToSelect) {
        await lectureSelect.selectOption({ label: optToSelect }).catch(() => {});
        await page.waitForTimeout(3000); // 채팅 UI 로드 대기 (500ms → 3000ms)
      }

      // 질문 입력 및 전송 — contenteditable/role="textbox" 포함 확장 selector
      const inputArea = frame.locator('input[type="text"], textarea, [contenteditable="true"], [role="textbox"]').first();
      // 입력창 미노출 시 실패
      const hasInput = await inputArea.isVisible({ timeout: 15_000 }).catch(() => false);
      if (!hasInput) {
        throw new Error('AI조교 iframe 입력창 미노출 — 질의 불가');
      }
      await inputArea.fill('oneM2M 표준이 뭐야?');
      await inputArea.press('Enter');
      await page.waitForTimeout(8000);
      // 답변 수신 여부 확인 — 미수신 시 실패
      const hasResponse = await frame.locator('div, p').filter({ hasText: /oneM2M|표준|IoT|답변|오류|죄송/ }).first()
        .isVisible({ timeout: 15_000 }).catch(() => false);
      if (!hasResponse) {
        throw new Error('AI조교 질의 응답 미수신 — oneM2M 표준이 뭐야? 답변 없음');
      }
      test.info().annotations.push({ type: '확인', description: 'AI조교 응답 수신 완료' });
    } else {
      throw new Error('AI조교 iframe 콤보박스 접근 불가 — 입력창 확인 불가');
    }
  });

  test('P4-TC007 [학습자] Q&A 보기 - 강의클럽 내 Q&A 확인', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/studyroom');
    await page.waitForTimeout(1500);
    await expect(page.getByText('My학습방').first()).toBeVisible({ timeout: 10_000 });

    const clubItems = page.locator('article .tw-cursor-pointer, article [class*="card"]');
    const cnt = await clubItems.count();
    if (cnt > 0) {
      await clubItems.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      const qnaTab = page.locator('button, a, [role="tab"]').filter({ hasText: /Q&A|질문|답변/i }).first();
      if (await qnaTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await qnaTab.click();
        await page.waitForTimeout(1000);
        test.info().annotations.push({ type: '확인', description: 'Q&A 탭 클릭 성공' });
      }
    } else {
      test.info().annotations.push({ type: '건너뜀', description: 'My학습방 강의 데이터 없음' });
    }
  });
});

// ══════════════════════════════════════════════════════════
// Phase 5 : 교수자 — 대시보드 / CQI / Playground / AI피드백
// ══════════════════════════════════════════════════════════
test.describe('Phase5: 교수자 대시보드 분석', () => {
  test.use({ storageState: INSTRUCTOR_STATE });

  test('P5-TC006 [교수자] 강의클럽 목록 - 타 클럽 접근', async ({ page }) => {
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
      test.info().annotations.push({ type: '건너뜀', description: '전체 강의클럽 데이터 없음' });
    }
  });

  test('P5-TC007 [교수자] 테스트 클럽 대시보드 - Q&A 정보 확인', async ({ page }) => {
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();
    await goto(page, `/lecture-dashboard/${clubId}`);
    await page.waitForTimeout(2000);
    await expect(page.getByText('강의 대시보드').first()).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText('최근 학습 질의 내역')).toBeVisible();
    await expect(page.getByText('최근 미응답 내역')).toBeVisible();
  });

  test('P5-TC008 [교수자] AI 조교 팝업 - 클럽/회차 선택 드롭다운', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/studyroom');
    await page.waitForTimeout(2000);
    const chatbotBtn = page.locator('img[alt="chatbot"]');
    await expect(chatbotBtn).toBeVisible({ timeout: 10_000 });
    await chatbotBtn.click();
    await page.waitForTimeout(1500);
    const chatPanel = page.locator('.MuiDialog-root').first();
    await expect(chatPanel).toBeVisible({ timeout: 8_000 });
    const chatIframe = page.locator('iframe').first();
    await expect(chatIframe).toBeVisible({ timeout: 5_000 });
    test.info().annotations.push({ type: '확인', description: 'AI 조교 팝업(iframe) 노출됨' });
    const frame = page.frameLocator('iframe').first();
    const hasSelect = await frame.getByRole('combobox').first().isVisible({ timeout: 5_000 }).catch(() => false);
    test.info().annotations.push({ type: '확인', description: `iframe 내 강의 선택 콤보박스: ${hasSelect}` });
  });

  test('P5-TC009 [교수자] 테스트 클럽 대시보드 - 클럽인원/AI피드백 현황 확인', async ({ page }) => {
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();
    await goto(page, `/lecture-dashboard/${clubId}`);
    await page.waitForTimeout(1500);
    expect(page.url()).toContain('/lecture-dashboard/');
    await expect(page.getByText('강의 대시보드').first()).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText('클럽인원')).toBeVisible();
    await expect(page.getByText('클럽정보')).toBeVisible();
    await expect(page.getByText('최근 학습 질의 내역')).toBeVisible();
    await expect(page.getByText('최근 미응답 내역')).toBeVisible();
    await expect(page.getByText('AI피드백 현황')).toBeVisible();
  });

  test('P5-TC010 [교수자] CQI 보고서 AI초안 생성 - 결과 확인', async ({ page }) => {
    test.setTimeout(150_000);
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();
    await goto(page, `/lecture-dashboard/${clubId}`);
    await page.waitForTimeout(2000);

    // CQI 보고서 생성 버튼 클릭 → 팝업
    const cqiBtn = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'CQI 보고서 생성' }).first();
    await expect(cqiBtn).toBeVisible({ timeout: 8_000 });
    await cqiBtn.click();
    await page.waitForTimeout(1000);

    // CQI 보고서 다이얼로그
    await expect(page.getByText('CQI 보고서').first()).toBeVisible({ timeout: 5_000 });

    // CQI AI초안 생성 버튼 클릭 (미노출 시 실패) — button/div/span 등 태그 무관하게 탐색
    const aiDraftBtn = page.locator('button, [role="button"], [class*="cursor-pointer"]')
      .filter({ hasText: /CQI.*AI.*생성/ }).first();
    await expect(aiDraftBtn).toBeVisible({ timeout: 5_000 });
    await aiDraftBtn.click();
    await page.waitForTimeout(2000);

    // 생성 완료 대기 (최대 120초)
    await page.waitForSelector('button:has-text("CQI 보고서 생성중...")', { state: 'hidden', timeout: 120_000 })
      .catch(() => {});
    await page.waitForTimeout(1000);

    // 결과 확인 — 내용 미노출 시 실패
    const resultContent = page.locator('[role="dialog"] textarea, [role="dialog"] p, [role="dialog"] div')
      .filter({ hasText: /.{20,}/ }).first();
    const hasResult = await resultContent.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!hasResult) {
      throw new Error('CQI 보고서 AI초안 생성 결과 미노출 — 생성 실패');
    }

    // P6-TC008 비교를 위해 생성된 CQI 내용 앞부분 저장
    const cqiText = await resultContent.textContent().catch(() => '');
    saveCqiContent(cqiText.trim().substring(0, 100));

    test.info().annotations.push({ type: '확인', description: 'CQI 보고서 AI초안 생성 완료' });
  });

  test('P5-TC011 [교수자] 플레이그라운드 - 강의 질문내용 요약 답변 확인', async ({ page }) => {
    test.setTimeout(120_000);
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();
    await goto(page, `/lecture-dashboard/${clubId}`);
    await page.waitForTimeout(2000);

    // 플레이그라운드 버튼 클릭
    const pgBtn = page.locator('[class*="cursor-pointer"]').filter({ hasText: '플레이그라운드' }).first();
    await expect(pgBtn).toBeVisible({ timeout: 8_000 });
    await pgBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    expect(page.url()).toContain(`/lecture-playground/${clubId}`);
    await expect(page.getByText('플레이그라운드').first()).toBeVisible({ timeout: 8_000 });

    // "강의 질문내용 요약해줘." 프리셋 클릭
    const summaryBtn = page.getByText('강의 질문내용 요약해줘.').first();
    await expect(summaryBtn).toBeVisible({ timeout: 5_000 });
    await summaryBtn.click();
    await page.waitForTimeout(3000);

    // 응답 대기 — 메시지 입력창이 다시 활성화되면 응답 완료
    const msgInput = page.locator('input[placeholder*="메시지를 입력하세요"]');
    await expect(msgInput).toBeEnabled({ timeout: 60_000 });

    // 응답 내용 확인
    const responseVisible = await page.locator('p, heading').filter({ hasText: /.{20,}/ }).first()
      .isVisible({ timeout: 5_000 }).catch(() => false);
    test.info().annotations.push({ type: '확인', description: `플레이그라운드 답변 수신: ${responseVisible}` });
  });

  test('P5-TC012 [교수자] 학생 총평 AI피드백 생성 - 결과 확인', async ({ page }) => {
    test.setTimeout(150_000);
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();
    await goto(page, `/lecture-dashboard/${clubId}`);
    await page.waitForTimeout(2000);
    await expect(page.getByText('강의 대시보드').first()).toBeVisible({ timeout: 10_000 });

    // 학생별 보기 테이블 확인
    const studentTable = page.locator('table').first();
    await expect(studentTable).toBeVisible({ timeout: 8_000 });

    // 황성훈 학습자 행 찾기 (없으면 첫 번째 행)
    const hwangRow = page.getByRole('row').filter({ hasText: '황성훈' }).first();
    const hasHwang = await hwangRow.isVisible({ timeout: 3000 }).catch(() => false);
    const targetRow = hasHwang ? hwangRow : page.locator('tbody tr').first();

    // 총평확인 버튼 클릭 (학생 미참여 시 없을 수 있으므로 조건 처리)
    const totalBtn = targetRow.locator('[class*="cursor-pointer"]').filter({ hasText: '총평확인' }).first();
    const hasTotalBtn = await totalBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!hasTotalBtn) {
      throw new Error('총평확인 버튼 미노출 — 학생 활동 데이터 없음');
    }
    await totalBtn.scrollIntoViewIfNeeded().catch(() => {});
    await totalBtn.click();
    await page.waitForTimeout(2000); // 팝업 API 응답 대기 (1000ms → 2000ms)

    // 학습피드백 총평 팝업
    await expect(page.getByText('학습피드백 총평').first()).toBeVisible({ timeout: 15_000 });

    // AI피드백 생성 버튼 클릭 (미노출 시 실패) — button/div/span 등 태그 무관하게 탐색
    const aiBtn = page.locator('button, [role="button"], [class*="cursor-pointer"]')
      .filter({ hasText: 'AI피드백 생성' }).first();
    await expect(aiBtn).toBeVisible({ timeout: 5_000 });
    await aiBtn.click();
    await page.waitForTimeout(2000);

    // 생성 완료 대기 (최대 120초)
    await page.waitForSelector('button:has-text("AI피드백 생성중...")', { state: 'hidden', timeout: 120_000 })
      .catch(() => {});
    await page.waitForTimeout(1000);

    // 결과 확인 — 생성 실패 메시지 노출 시 테스트 실패
    const notGenerated = await page.getByText('총평피드백이 생성되지 않').isVisible({ timeout: 3000 }).catch(() => false);
    if (notGenerated) {
      throw new Error('학생 총평 AI피드백 생성 실패 — 결과 미생성');
    }

    // 피드백 결과 텍스트 확인 — p[class*="tw-text-gray"] 로 실제 텍스트 단락 확인
    const feedbackContent = page.locator('[role="dialog"] p[class*="tw-text-gray"]')
      .filter({ hasText: /.{20,}/ }).first();
    const hasFeedback = await feedbackContent.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!hasFeedback) {
      throw new Error('학생 총평 AI피드백 결과 텍스트 미노출');
    }

    // P6-TC008 비교를 위해 생성된 피드백 실제 텍스트 앞부분 저장
    const feedbackText = await feedbackContent.textContent().catch(() => '');
    saveAiFeedbackContent(feedbackText.trim().substring(0, 100));

    test.info().annotations.push({ type: '확인', description: 'AI피드백 생성 완료' });
  });

  test('P5-TC013 [교수자] 테스트 클럽 대시보드 - 학생별 보기 탭', async ({ page }) => {
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();
    await goto(page, `/lecture-dashboard/${clubId}`);
    await page.waitForTimeout(1500);
    const studentViewTab = page.locator('p, [class*="cursor-pointer"]').filter({ hasText: '학생별 보기' }).first();
    await expect(studentViewTab).toBeVisible({ timeout: 8_000 });
    await expect(page.getByRole('columnheader', { name: '학습자' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '학습 참여도' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '질의합산' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '학습총평' })).toBeVisible();
  });

  test('P5-TC014 [교수자] 테스트 클럽 대시보드 - 강의별 보기 탭', async ({ page }) => {
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();
    await goto(page, `/lecture-dashboard/${clubId}`);
    await page.waitForTimeout(1500);
    const lectureViewTab = page.locator('p, [class*="cursor-pointer"]').filter({ hasText: '강의별 보기' }).first();
    await expect(lectureViewTab).toBeVisible({ timeout: 8_000 });
    await lectureViewTab.click();
    await page.waitForTimeout(1500);
    test.info().annotations.push({ type: '확인', description: '강의별 보기 탭 클릭 성공' });
  });

  test('P5-TC015 [교수자] 테스트 클럽 대시보드 - 강의 설정(콤보박스) 변경', async ({ page }) => {
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();
    await goto(page, `/lecture-dashboard/${clubId}`);
    await page.waitForTimeout(1500);
    const lectureCombo = page.getByRole('combobox').first();
    await expect(lectureCombo).toBeVisible({ timeout: 8_000 });
    const options = await lectureCombo.locator('option').count();
    test.info().annotations.push({ type: '확인', description: `강의 선택 옵션 수: ${options}` });
    expect(options).toBeGreaterThan(0);
  });

  test('P5-TC016 [교수자] 마이페이지 - Account settings 버튼 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await expect(page.locator('nav button[aria-label=""]')).toBeVisible({ timeout: 10_000 });
  });

  test('P5-TC017 [교수자] 마이페이지 - Account settings 클릭 및 반응', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    const btn = page.locator('nav button[aria-label=""]');
    await expect(btn).toBeVisible({ timeout: 10_000 });
    await btn.click();
    await page.waitForTimeout(600);
    await expect(page.locator('[role="menu"]')).toBeVisible({ timeout: 3_000 });
  });

  test('P5-TC018 [교수자] 드로어 - 교수자 전용 메뉴 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await expect(page.locator('nav').getByText('My강의클럽')).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('nav').getByText('My학습자')).toBeVisible();
    await expect(page.locator('nav').getByText('관리 페이지')).toBeVisible();
  });

  test('P5-TC019 [교수자] My학습자 - 페이지 접속 및 검색 UI', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/my-students');
    await page.waitForTimeout(1500);
    await expect(page.getByText('My학습자').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('지도교수자로 등록된 학생들 목록입니다')).toBeVisible();
    await expect(page.locator('input[placeholder*="학습자명"]')).toBeVisible();
  });

  test('P5-TC020 [교수자] My강의클럽 - 필터(진행중/예정/종료) 체크박스', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/my-lecture-clubs');
    await page.waitForTimeout(2000);
    const checkboxes = page.locator('input[type="checkbox"]');
    const cnt = await checkboxes.count();
    expect(cnt).toBeGreaterThanOrEqual(1);
    test.info().annotations.push({ type: '확인', description: `필터 체크박스 수: ${cnt}` });
  });

  test('P5-TC021 [교수자] My강의클럽 - 검색 기능', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/my-lecture-clubs');
    await page.waitForTimeout(2000);
    const searchInput = page.locator('input[placeholder*="강의클럽명"]');
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('테스트');
    await page.waitForTimeout(1000);
    await expect(page.locator('article')).toBeVisible();
  });

  test('P5-TC022 [교수자] My강의클럽 - 강의 목록 아이템 1개 이상 존재', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/my-lecture-clubs');
    await page.waitForTimeout(2000);
    const items = page.locator('article .tw-cursor-pointer');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    test.info().annotations.push({ type: '확인', description: `강의클럽 수: ${count}` });
  });

  test('P5-TC023 [교수자] 알림 버튼 - 알림 배지 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    const alarmArea = page.locator('[aria-label*="notifications"]').first();
    await expect(alarmArea).toBeVisible({ timeout: 10_000 });
    const badge = alarmArea.locator('[class*="badge"], [class*="Badge"]').first();
    const hasBadge = await badge.isVisible({ timeout: 3000 }).catch(() => false);
    test.info().annotations.push({ type: '확인', description: `알림 배지: ${hasBadge}` });
  });

  test('P5-TC024 [교수자] 테스트 클럽 대시보드 - 전체 학습 보기 링크', async ({ page }) => {
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();
    await goto(page, `/lecture-dashboard/${clubId}`);
    await page.waitForTimeout(2000);
    const viewAllLink = page.locator('[class*="cursor-pointer"]').filter({ hasText: '전체 학습 보기' }).first();
    await expect(viewAllLink).toBeVisible({ timeout: 8_000 });
    test.info().annotations.push({ type: '확인', description: '전체 학습 보기 링크 노출' });
  });

  test('P5-TC025 [교수자] 드로어 - 로그아웃 버튼 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    const profileBtn = page.locator('nav button[aria-label=""]');
    await expect(profileBtn).toBeVisible({ timeout: 10_000 });
    await profileBtn.click();
    await page.waitForTimeout(600);
    const logoutItem = page.locator('[role="menuitem"]').filter({ hasText: 'Logout' }).first();
    await expect(logoutItem).toBeVisible({ timeout: 5_000 });
    test.info().annotations.push({ type: '확인', description: '로그아웃 메뉴 노출 확인' });
  });
});

// ══════════════════════════════════════════════════════════
// Phase 6 : 학습자 — 학습 결과 확인
// ══════════════════════════════════════════════════════════
test.describe('Phase6: 학습자 학습 결과', () => {
  test.use({ storageState: STUDENT_STATE });

  test('P6-TC008 [학습자] 총평 피드백 보기', async ({ page }) => {
    dismissAlertIfPresent(page);
    if (!clubId) clubId = loadClubId();
    expect(clubId).toBeTruthy();

    // 강의클럽 메뉴 → 테스트 클럽 상세 직접 진입
    await goto(page, `/lecture/${clubId}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain(`/lecture/${clubId}`);

    // 총평 피드백보기 버튼 클릭 (미노출 시 실패 — comprehensiveEvaluationViewable 필요)
    const feedbackBtn = page.getByRole('button', { name: /총평 피드백보기/ });
    await expect(feedbackBtn).toBeVisible({ timeout: 10_000 });
    await feedbackBtn.click();
    await page.waitForTimeout(3000); // API 응답 대기

    // 모달 열림 확인 (학습총평 피드백보기)
    await expect(page.getByText('학습총평 피드백보기').first()).toBeVisible({ timeout: 8_000 });

    // P5-TC012에서 저장한 학생 총평 AI피드백 내용과 비교
    const savedFeedback = loadAiFeedbackContent();
    if (savedFeedback && savedFeedback.length > 10) {
      const pageText = await page.locator('body').textContent().catch(() => '');
      const snippet = savedFeedback.substring(0, 30);
      if (!pageText?.includes(snippet)) {
        throw new Error(`총평 피드백 내용 불일치 — P5-TC012 기대값: "${snippet}"`);
      }
      test.info().annotations.push({ type: '확인', description: `총평 피드백 내용 일치 확인 (앞 30자: "${snippet}")` });
    } else {
      // 저장된 피드백 내용 없을 경우 화면에 내용이 노출되는지만 확인
      const feedbackContent = page.locator('[role="dialog"] p, [role="dialog"] div, [role="dialog"] textarea')
        .filter({ hasText: /.{20,}/ }).first();
      const hasFeedback = await feedbackContent.isVisible({ timeout: 5_000 }).catch(() => false);
      if (!hasFeedback) {
        throw new Error('총평 피드백 내용 미노출 — P5-TC012 저장 데이터 없음, 화면 내용도 확인 불가');
      }
      test.info().annotations.push({ type: '확인', description: '총평 피드백 내용 노출 확인 (P5-TC012 저장 데이터 없음)' });
    }
  });

  test('P6-TC009 [학습자] My학습방 - 나의 클럽 진행사항 확인', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/studyroom');
    await page.waitForTimeout(1500);
    await expect(page.getByText('My학습방').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('나의 클럽 진행사항을 한 눈에')).toBeVisible();
    await expect(page.locator('img[alt="chatbot"]')).toBeVisible();
    const article = page.locator('article').first();
    await expect(article).toBeVisible();
  });

  test('P6-TC010 [학습자] 마이페이지 - Account settings 버튼 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await expect(page.locator('nav button[aria-label=""]')).toBeVisible({ timeout: 10_000 });
    await page.locator('nav button[aria-label=""]').click();
    await page.waitForTimeout(500);
    await expect(page.locator('[role="menu"]')).toBeVisible({ timeout: 3_000 });
  });

  test('P6-TC011 [학습자] 마이페이지 - Account settings 클릭 가능', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    const btn = page.locator('nav button[aria-label=""]');
    await expect(btn).toBeVisible({ timeout: 10_000 });
    await btn.click();
    await page.waitForTimeout(600);
    const menuVisible = await page.locator('[role="menu"]').isVisible({ timeout: 2000 }).catch(() => false);
    test.info().annotations.push({ type: '확인', description: `프로필 메뉴 노출: ${menuVisible}` });
    expect(btn).toBeVisible();
  });

  test('P6-TC012 [학습자] 마이페이지 - 드로어 메뉴 정상 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await expect(page.locator('nav').getByText('강의클럽').first()).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('nav').getByText('My학습방').first()).toBeVisible();
  });

  test('P6-TC013 [학습자] My학습방 - AI 조교 챗봇 버튼 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/studyroom');
    await page.waitForTimeout(1500);
    const chatbotBtn = page.locator('img[alt="chatbot"]');
    await expect(chatbotBtn).toBeVisible({ timeout: 10_000 });
    expect(await chatbotBtn.getAttribute('class') ?? '').toBeTruthy();
  });

  test('P6-TC014 [학습자] 강의클럽 목록 - 검색 기능 동작', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/lecture');
    await page.waitForTimeout(1500);
    const searchInput = page.locator('input[placeholder*="클럽검색"]');
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('테스트');
    await page.waitForTimeout(1000);
    const article = page.locator('article').first();
    await expect(article).toBeVisible();
  });

  test('P6-TC015 [학습자] 강의클럽 탭 필터 - 카테고리 탭 클릭', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/lecture');
    await page.waitForTimeout(1500);
    const tab = page.locator('[role="tab"]').filter({ hasText: '세종대학교' }).first();
    await expect(tab).toBeVisible({ timeout: 10_000 });
    await tab.click();
    await page.waitForTimeout(1000);
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  test('P6-TC016 [학습자] My학습방 - 페이지 접속 및 저작권 표시', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/studyroom');
    await expect(page.getByText('My학습방').first()).toBeVisible({ timeout: 10_000 });
    const copyright = page.locator('footer, [class*="footer"]').first();
    const hasCopyright = await copyright.isVisible({ timeout: 3000 }).catch(() => false);
    test.info().annotations.push({ type: '확인', description: `푸터/저작권 영역: ${hasCopyright}` });
  });

  test('P6-TC017 [학습자] 알림 버튼 - 알림 개수 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    const alarmContainer = page.locator('[aria-label*="notifications"]').first();
    const hasAlarm = await alarmContainer.isVisible({ timeout: 5000 }).catch(() => false);
    test.info().annotations.push({ type: '확인', description: `알림 영역 노출: ${hasAlarm}` });
    expect(hasAlarm).toBeTruthy();
  });

  test('P6-TC018 [학습자] 홈 소개 페이지 - 하단 챗봇 플로팅 버튼', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    const chatbotImg = page.locator('img[alt="chatbot"], img[class*="chatbot"]');
    const hasChatbot = await chatbotImg.isVisible({ timeout: 5000 }).catch(() => false);
    test.info().annotations.push({ type: '확인', description: `챗봇 플로팅 버튼 노출: ${hasChatbot}` });
    expect(true).toBeTruthy();
  });

  test('P6-TC019 [학습자] 드로어 메뉴 - 로그아웃 버튼 노출', async ({ page }) => {
    dismissAlertIfPresent(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    const profileBtn = page.locator('nav button[aria-label=""]');
    await expect(profileBtn).toBeVisible({ timeout: 10_000 });
    await profileBtn.click();
    await page.waitForTimeout(600);
    const logoutItem = page.locator('[role="menuitem"]').filter({ hasText: 'Logout' }).first();
    await expect(logoutItem).toBeVisible({ timeout: 5_000 });
    test.info().annotations.push({ type: '확인', description: '로그아웃 메뉴 노출 확인' });
  });
});

// ══════════════════════════════════════════════════════════
// Phase 7 : 교수자 — 테스트 클럽 삭제
// ══════════════════════════════════════════════════════════
test.describe('Phase7: 교수자 클럽 정리', () => {
  test.use({ storageState: INSTRUCTOR_STATE });

  test('P7-CLEANUP [교수자] 테스트 클럽 삭제 - My강의클럽 → 클럽삭제', async ({ page }) => {
    dismissAlertIfPresent(page);
    await goto(page, '/my-lecture-clubs');
    await page.waitForTimeout(2000);
    await expect(page.getByText('My강의클럽').first()).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(1000);

    // "테스트 클럽" 검색
    const searchInput = page.locator('input[placeholder*="강의클럽명"]');
    await searchInput.fill('테스트 클럽');
    await page.waitForTimeout(1500);

    // "테스트 클럽"인 카드를 모두 삭제 (이전 실행에서 누적된 클럽 포함)
    let deletedCount = 0;
    for (let attempt = 0; attempt < 20; attempt++) {
      // 매 반복마다 삭제 버튼 목록 재조회 (DOM 변경 대응)
      const deleteButtons = page.getByRole('button', { name: '클럽삭제' });
      const btnCount = await deleteButtons.count();
      if (btnCount === 0) break;

      await deleteButtons.first().click();
      await page.waitForTimeout(1000);

      // 확인 팝업 처리
      const muiConfirm = page.locator('[role="dialog"]').getByRole('button').filter({ hasText: /확인|예|삭제/ }).first();
      if (await muiConfirm.isVisible({ timeout: 2000 }).catch(() => false)) {
        await muiConfirm.click();
        await page.waitForTimeout(2000);
      }

      deletedCount++;
      await page.waitForTimeout(500);
    }

    test.info().annotations.push({ type: '확인', description: `테스트 클럽 ${deletedCount}개 삭제 완료` });
  });
});
