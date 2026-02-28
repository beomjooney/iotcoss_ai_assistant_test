/**
 * 공통 헬퍼
 * - 실제 사이트: https://ai.devus.co.kr
 * - 세션: auth-store (localStorage) + access_token (cookie)
 * - /account/my 는 직접 URL 접근 불가 → SPA 내비게이션 필요
 */
import { Page, expect } from '@playwright/test';

export const BASE_URL = 'https://iotcoss.devus.co.kr';

export const INSTRUCTOR = {
  id:       process.env.TEST_INSTRUCTOR_ID || 'sjqa1@sejong.ac.kr',
  password: process.env.TEST_INSTRUCTOR_PW || 'sjqa',
};
export const STUDENT = {
  id:       process.env.TEST_STUDENT_ID || 'sjqa2@sejong.ac.kr',
  password: process.env.TEST_STUDENT_PW || 'sjqa',
};

/** 직접 URL 이동 + domcontentloaded 대기 */
export async function goto(page: Page, path: string) {
  await page.goto(`${BASE_URL}${path}`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
}

/** 드로어 메뉴 열기 */
export async function openDrawer(page: Page) {
  const drawerBtn = page.locator('button[aria-label="open drawer"], button').filter({ hasText: /open drawer/i }).last();
  const isOpen = await page.locator('[role="presentation"] .MuiDrawer-paper').isVisible().catch(() => false);
  if (!isOpen) {
    await drawerBtn.click();
    await page.waitForTimeout(400);
  }
}

/** 드로어 메뉴에서 항목 클릭 */
export async function clickDrawerMenu(page: Page, label: string) {
  await openDrawer(page);
  await page.locator('button').filter({ hasText: label }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(800);
}

/** Account settings 버튼(헤더 프로필 아이콘) → My페이지 SPA 이동 */
export async function gotoMyPage(page: Page) {
  // SPA 내비게이션: router.push('/account/my') 트리거
  await page.evaluate(() => {
    const event = new MouseEvent('click', { bubbles: true });
    const btn = document.querySelector('[aria-label="Account settings"] a, a[href*="/account/my"]') as HTMLElement;
    if (btn) btn.dispatchEvent(event);
  });

  // fallback: header Account settings 클릭 후 나타나는 메뉴에서 선택
  const myPageLink = page.locator('a[href*="/account/my"], button').filter({ hasText: /마이페이지|프로필|My페이지/i }).first();
  const hasLink = await myPageLink.isVisible({ timeout: 2000 }).catch(() => false);
  if (hasLink) {
    await myPageLink.click();
  } else {
    // Header Account settings 버튼 재클릭
    await page.locator('button[aria-label="Account settings"]').click();
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(800);
}

/** 서비스 이용약관 동의 팝업 처리 */
export async function acceptTermsIfPresent(page: Page) {
  await page.waitForTimeout(600);
  const dialog = page.locator('[role="dialog"]');
  const isVisible = await dialog.isVisible().catch(() => false);
  if (!isVisible) return;
  const checkboxes = dialog.locator('input[type="checkbox"]');
  const cnt = await checkboxes.count();
  for (let i = 0; i < cnt; i++) {
    const checked = await checkboxes.nth(i).isChecked().catch(() => true);
    if (!checked) await checkboxes.nth(i).check().catch(() => {});
  }
  const confirmBtn = dialog.locator('button').filter({ hasText: /동의|확인|완료|시작/i }).last();
  if (await confirmBtn.isVisible().catch(() => false)) await confirmBtn.click();
  await page.waitForTimeout(800);
}

/** alert 다이얼로그 자동 닫기 */
export async function dismissAlertIfPresent(page: Page) {
  page.on('dialog', d => d.accept().catch(() => {}));
}
