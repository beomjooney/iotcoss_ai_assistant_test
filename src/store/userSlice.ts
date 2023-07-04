import { StateCreator } from 'zustand';
import { User } from 'src/models/user';

export interface UserSlice {
  user: User;
  setUser: (User) => void;
  hasResumeStory: any;
  setHasResumeStory: (any) => void;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = set => ({
  user: { memberId: null, memberType: 'Guest' }, // TODO 수정 필요
  setUser: user => set(state => (state.user = user)),
  hasResumeStory: {},
  setHasResumeStory: userResumeStory => set(state => (state.hasResumeStory = userResumeStory)),
});
