import create from 'zustand';
import { persist } from 'zustand/middleware';
import { getCookie } from 'cookies-next';

export interface Session {
  token?: string;
  memberType: string;
  theme?: string;
  memberId?: string;
  beforeOnePick?: string;
  job?: string;
  tenantName?: string;
  memberName?: string;
  userAgent?: string;
  logged: boolean;
  roles?: any[];
}

export interface SessionStore {
  token?: string;
  memberType?: string;
  theme?: string;
  memberId?: string;
  memberName?: string;
  tenantName?: string;
  beforeOnePick?: string;
  job?: string;
  logged?: boolean;
  roles?: any[];
  update: (session: Session) => void;
}

function getSubdomain() {
  const { host } = typeof window !== 'undefined' && window.location;
  console.log(host);

  if (host) {
    // 호스트 이름에 '.'이 있으면 공백을 반환
    if (!host.includes('.')) {
      return ''; // 공백 반환
    }

    console.log(host);
    return host;
  }

  return null; // 서브도메인이 없는 경우
}

// TODO : TYPE
const useSessionStore = create<any>(
  persist(
    set => ({
      token: getCookie('access_token') ? String(getCookie('access_token')) : process.env['NEXT_PUBLIC_GUEST_TOKEN'],
      memberType: 'Guest',
      memberId: undefined,
      memberName: undefined,
      beforeOnePick: undefined,
      tenantName: getSubdomain()?.split('.')[0],
      menu: {},
      redirections: {},
      logged: false,
      roles: [],
      update(session) {
        set(state => ({
          ...state,
          ...session,
        }));
      },
    }),
    { name: 'auth-store' },
  ),
);

export { useSessionStore };
