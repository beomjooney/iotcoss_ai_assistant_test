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
  override name = 'AuthError';
  override message = '로그인이 필요한 페이지입니다.';
  // override redirectUrl = '/account/login';
}

export class LoginError extends ApiError {
  override name = 'LoginError';
  override message = '로그인에 실패 했습니다.';
  // override redirectUrl = '/account/login';
  override code = 'C4999';
}
