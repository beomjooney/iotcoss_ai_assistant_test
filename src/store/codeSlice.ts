import { StateCreator } from 'zustand';
import { Code } from 'src/models/code';

export interface CodeSlice {
  jobGroups: Code[];
  setJobGroups: (any) => void;
  contentTypes: Code[];
  setContentTypes: (any) => void;
  paymentTypes: Code[];
  setPaymentTypes: (any) => void;
  placeTypes: Code[];
  setPlaceTypes: (any) => void;
}

export const createCodeSlice: StateCreator<CodeSlice> = set => ({
  jobGroups: [],
  setJobGroups: jobGroups => set(state => (state.jobGroups = jobGroups)),
  contentTypes: [],
  setContentTypes: contentTypes => set(state => (state.contentTypes = contentTypes)),
  paymentTypes: [],
  setPaymentTypes: paymentTypes => set(state => (state.paymentTypes = paymentTypes)),
  placeTypes: [],
  setPlaceTypes: placeTypes => set(state => (state.placeTypes = placeTypes)),
});
