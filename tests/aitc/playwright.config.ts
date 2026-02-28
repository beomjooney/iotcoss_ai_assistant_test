import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const RESULTS_DIR = path.join(__dirname, 'test-results');

export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: [
    ['html', { outputFolder: path.join(__dirname, 'playwright-report'), open: 'never' }],
    ['list'],
    ['json', { outputFile: path.join(RESULTS_DIR, 'results.json') }],
  ],
  use: {
    baseURL: 'https://iotcoss.devus.co.kr',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 900 },
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  },
  outputDir: path.join(RESULTS_DIR, 'artifacts'),
  timeout: 45_000,
  expect: { timeout: 12_000 },

  projects: [
    /* 1. 인증 세팅 (가장 먼저 실행) */
    {
      name: 'setup-instructor',
      testMatch: /auth\.setup\.ts/,
    },
    /* 2. 교수자 테스트 */
    {
      name: 'instructor',
      testMatch: /aitc-instructor\.spec\.ts/,
      dependencies: ['setup-instructor'],
      use: {
        storageState: path.join(__dirname, 'auth/instructor.json'),
      },
    },
    /* 3. 학습자 테스트 */
    {
      name: 'student',
      testMatch: /aitc-student\.spec\.ts/,
      dependencies: ['setup-instructor'],
      use: {
        storageState: path.join(__dirname, 'auth/student.json'),
      },
    },
    /* 4. 교수자+학습자 통합 순차 시나리오 (storageState는 각 Phase describe 블록에서 관리) */
    {
      name: 'combined',
      testMatch: /aitc-combined\.spec\.ts/,
      dependencies: ['setup-instructor'],
      retries: 0, // 모듈 범위 clubId 변수 보존을 위해 재시도 비활성화
    },
  ],
});
