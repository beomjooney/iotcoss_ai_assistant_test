/**
 * 인증 셋업 — 교수자/학습자 storageState 저장
 * 실제 사이트 탐색 결과 기반:
 *   - /account/login 접속 → JS 로딩 대기 → 이메일/비밀번호 입력 → 로그인 버튼
 *   - 로그인 성공 시 / 로 리디렉션
 *   - auth-store (localStorage) + access_token (cookie) 에 세션 저장
 */

import { test as setup, expect } from '@playwright/test';
import path from 'path';

const BASE = 'https://iotcoss.devus.co.kr';
const INSTRUCTOR_AUTH = path.join(__dirname, 'auth/instructor.json');
const STUDENT_AUTH    = path.join(__dirname, 'auth/student.json');

const INSTRUCTOR = { id: 'sjqa1@sejong.ac.kr', password: 'sjqa' };
const STUDENT    = { id: 'sjqa2@sejong.ac.kr', password: 'sjqa' };

async function doLogin(page: any, cred: { id: string; password: string }) {
  await page.goto(`${BASE}/account/login`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  // LMS 로그인 / 일반 로그인 탭 중 "일반 로그인" 선택
  const generalLoginBtn = page.getByRole('button', { name: '일반 로그인' });
  await generalLoginBtn.waitFor({ state: 'visible', timeout: 10_000 });
  await generalLoginBtn.click();
  await page.waitForTimeout(800);

  // placeholder 기반 이메일 입력 (실제 화면: "이메일을 입력해주세요.")
  const emailInput = page.getByPlaceholder('이메일을 입력해주세요.');
  await emailInput.waitFor({ state: 'visible', timeout: 15_000 });

  await emailInput.fill(cred.id);
  await page.getByPlaceholder('비밀번호를 입력해주세요.').fill(cred.password);

  // 로그인 버튼 클릭 (form 내 검정 버튼)
  await page.getByRole('button', { name: '로그인' }).last().click();

  // 로그인 성공 → 홈으로 리디렉션
  await page.waitForURL(`${BASE}/`, { timeout: 20_000 });

  // auth-store 가 localStorage 에 저장될 때까지 대기
  await page.waitForFunction(
    () => {
      const s = localStorage.getItem('auth-store');
      return s && JSON.parse(s)?.state?.logged === true;
    },
    { timeout: 10_000 },
  );
}

setup('교수자 로그인 저장', async ({ page }) => {
  await doLogin(page, INSTRUCTOR);
  await page.context().storageState({ path: INSTRUCTOR_AUTH });
  console.log('✅ 교수자 auth 저장:', INSTRUCTOR_AUTH);
});

setup('학습자 로그인 저장', async ({ page }) => {
  await doLogin(page, STUDENT);
  await page.context().storageState({ path: STUDENT_AUTH });
  console.log('✅ 학습자 auth 저장:', STUDENT_AUTH);
});
