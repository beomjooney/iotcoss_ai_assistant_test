import { Button } from 'src/stories/components';
import { NoneLayout } from '../src/stories/Layout';
import React from 'react';

export function Error404() {
  return (
    <div style={{ textAlign: 'center', padding: 340 }}>
      서비스 이용에 불편을 드려 죄송합니다.
      <br />
      요청하신 페이지를 표시할 수 없습니다.
      <br />
      <br />
      <Button size="small" color="primary" onClick={() => (location.href = '/')}>
        메인으로 이동
      </Button>
    </div>
  );
}

export default Error404;

Error404.Layout = NoneLayout;
