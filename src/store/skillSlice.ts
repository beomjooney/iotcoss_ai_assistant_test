import { StateCreator } from 'zustand';
import { Skill } from 'src/models/skills';

export interface SkillSlice {
  skills: Skill[];
  setSkills: (any) => void;
}

export const createSkillSlice: StateCreator<SkillSlice> = set => ({
  skills: [],
  setSkills: skills => set(state => (state.skills = skills)),
});
