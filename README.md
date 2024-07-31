# DSU-DevUs UI PC Web Service

## Command Info

---
- Run
  - `yarn dev`
- Build
  - `yarn build`
- Start
  - `yarn start`
  - 서버에서 실행
- Start dev
  - `start:dev`
  - 로컬에서 build 된 파일 실행

## Git Commit Naming

```
  (페이지명 or common) 동사 Add, Remove, Fix, Modify, Move, Refactor 내용
```

## Login후 subdomain query param sender account/login/index.tsx
```
useEffect(() => {
    if (isSuccess) {
      onSubmitLogin();

      const authStore = localStorage.getItem('auth-store');
      if (authStore) {
        try {
          const json = JSON.parse(authStore);
          if (json && json.state) {
            const jsonString = JSON.stringify(json.state);
            // 1. Base64 인코딩 (Node.js 환경에서는 Buffer를 사용)
            const encodedJson = Buffer.from(jsonString).toString('base64');

            // Continue with your logic here
            deleteCookie('access_token');
            localStorage.removeItem('auth-store');
            localStorage.removeItem('app-storage');

            console.log('loginData', loginData?.redirections?.home_url + `?accessToken=${loginData?.access_token}`);
            if (username == 're4@naver.com' || username === 're3@naver.com') {
              location.href = 'http://devus.localhost:3001' + `?authStore=${encodedJson}`;
            } else {
              location.href = loginData?.redirections?.home_url + `?authStore=${encodedJson}`;
            }

            deleteCookie('access_token');
            localStorage.removeItem('auth-store');
            localStorage.removeItem('app-storage');
          } else {
            console.error('Invalid authStore format: missing state property');
          }
        } catch (error) {
          console.error('Failed to parse authStore:', error);
        }
      } else {
        console.warn('authStore is not available in localStorage');
      }
    }
  }, [loginData]);
```
## 로그인시 컬러 변경 로직 /pages/index.tsx
```
  //First Color Change
  const COLOR_PRESETS = usePresets();
  const { setColorPresetName } = useColorPresetName();
  const { setColorPresets } = useColorPresets();
```

## subdomain 변경시 색상 변경 로직 /pages/dsu/index.tsx
```
  useEffect(() => {
    if (!COLOR_PRESETS || COLOR_PRESETS.length === 0) return;
    const preset = COLOR_PRESETS.find(preset => preset.name === 'sejong') || COLOR_PRESETS[0];
    setColorPresetName(preset.name);
    setColorPresets(preset.colors);
  }, []);
```

## subdomain 변경시 로직 /pages/dsu/index.tsx
  ```
  // session이 존재하는 경우에만 상태 업데이트를 수행
  useEffect(() => {
    if (session) {
      update(session);
    }
  }, [session, update]);
```
```
export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const { authStore } = context.query;
    let session: Session | null = null;

    if (authStore) {
      console.log('authStore', authStore);
      const authData = authStore;

      console.log('authData', authData);
      // 2. Base64 디코딩 (Node.js 환경에서는 Buffer를 사용)
      const decodedAuthStore = Buffer.from(authData, 'base64').toString('utf-8');
      console.log('parsedAuthStore', decodedAuthStore);
      session = JSON.parse(decodedAuthStore);
      console.log('session', session);
    } else {
      console.log('No authStore provided');
    }

    return {
      props: { session },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {},
    };
  }
};
```
