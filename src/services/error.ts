export function isInstanceOfAPIError(object: unknown): object is ApiError {
  return object instanceof ApiError && ('redirectUrl' in object || 'notFound' in object);
}

export class ApiError extends Error {
  redirectUrl = '';
  code = '';
  notFound = false;
}

export class NotFoundError extends ApiError {
  constructor(public path: string) {
    super(path);
    this.path = path;
  }
  override name = 'NotFoundError';
  override message = '잘못된 API 경로입니다.';
  override notFound = true;
}

export class ForbiddenError extends ApiError {
  override name = 'ForbiddenError';
  override message = '접근 권한이 없습니다.';
  override redirectUrl = '/';
}

export class AuthError extends ApiError {
  constructor(public responseCode: string = '') {
    super();
    this.name = 'AuthError';
    this.message = '이메일 계정 또는 암호가 일치하지 않습니다.\n 다시 한번 확인해 주세요.';
    this.redirectUrl = '/account/login';
  }
}

export class LoginError extends ApiError {
  override name = 'LoginError';
  override message = '로그인에 실패 했습니다.';
  override redirectUrl = '/account/login';
  override code = 'C4999';
}
