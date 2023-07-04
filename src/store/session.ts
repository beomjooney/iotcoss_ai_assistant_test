import create from 'zustand';
import { persist } from 'zustand/middleware';
import { getCookie } from 'cookies-next';

export interface Session {
  token?: string;
  memberType: string;
  memberId?: string;
  memberName?: string;
  userAgent?: string;
  logged: boolean;
  roles?: any[];
}

export interface SessionStore {
  token?: string;
  memberType?: string;
  memberId?: string;
  memberName?: string;
  logged?: boolean;
  roles?: any[];
  update: (session: Session) => void;
}

// TODO : TYPE
const useSessionStore = create<any>(
  persist(
    set => ({
      token: getCookie('access_token') ? String(getCookie('access_token')) : process.env['NEXT_PUBLIC_GUEST_TOKEN'],
      memberType: 'Guest',
      memberId: undefined,
      memberName: undefined,
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
