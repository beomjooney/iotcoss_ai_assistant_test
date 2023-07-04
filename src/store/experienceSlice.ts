import { StateCreator } from 'zustand';
import { Experience } from 'src/models/experiences';

export interface ExperienceSlice {
  experiences: Experience[];
  setExperiences: (any) => void;
}

export const createExperienceSlice: StateCreator<ExperienceSlice> = set => ({
  experiences: [],
  setExperiences: experiences => set(state => (state.experiences = experiences)),
});
