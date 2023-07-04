import create, { StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import { createThemeSlice, IThemeSlice } from './createThemeSlice';
import { createUserSlice, UserSlice } from './userSlice';
import { createCodeSlice, CodeSlice } from './codeSlice';
import { createExperienceSlice, ExperienceSlice } from './experienceSlice';
import { createSkillSlice, SkillSlice } from './skillSlice';

/**
 * Make sure to enforce type for each slice
 */

export const useStore = create<IThemeSlice & UserSlice & CodeSlice & ExperienceSlice & SkillSlice>()(
  persist(
    (set, get, api) => ({
      ...createThemeSlice(
        set as StoreApi<IThemeSlice>['setState'],
        get as StoreApi<IThemeSlice>['getState'],
        api as unknown as StoreApi<IThemeSlice>,
        [],
      ),
      ...createUserSlice(
        set as StoreApi<UserSlice>['setState'],
        get as StoreApi<UserSlice>['getState'],
        api as unknown as StoreApi<UserSlice>,
        [],
      ),
      ...createCodeSlice(
        set as StoreApi<CodeSlice>['setState'],
        get as StoreApi<CodeSlice>['getState'],
        api as unknown as StoreApi<CodeSlice>,
        [],
      ),
      ...createExperienceSlice(
        set as StoreApi<ExperienceSlice>['setState'],
        get as StoreApi<ExperienceSlice>['getState'],
        api as unknown as StoreApi<ExperienceSlice>,
        [],
      ),
      ...createSkillSlice(
        set as StoreApi<SkillSlice>['setState'],
        get as StoreApi<SkillSlice>['getState'],
        api as unknown as StoreApi<SkillSlice>,
        [],
      ),
    }),
    {
      name: 'app-storage',
      getStorage: () => localStorage,
      onRehydrateStorage: state => {
        // console.log('hydration starts');
        // console.log(state);

        // optional
        return (state, error) => {
          if (error) {
            // console.log('an error happened during hydration', error);
          } else {
            // console.log('hydration finished');
          }
        };
      },
    },
  ),
);

// TODO hydrate 에러 발생 - https://kbwplace.tistory.com/152
// - 새로고침하면 localStorage 접근 못해서 생기는 오류
// 해결책 -> useMemo써서 Hydrate처리..? (참고: https://codesandbox.io/s/ku82o?file=/lib/store.js:153-162)
