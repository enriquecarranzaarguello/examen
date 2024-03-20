import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface DealsType {
  deals: any[];
  adults: any[];
  childs: any[];
}

const initialState: DealsType = {
  deals: [],
  adults: [],
  childs: [],
};

export const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    clearState: state => {
      state.adults = [];
      state.childs = [];
    },
    addTravelerDeals: (state, action) => {
      const { payload } = action;

      const updatedGuestIndex = state.adults.findIndex(
        (adult: any) => adult.id === payload.id
      );

      if (updatedGuestIndex !== -1) {
        state.adults[updatedGuestIndex] = payload;
      } else {
        state.adults.push(payload);
      }
    },
    addTravelerChild: (state, action) => {
      const { payload } = action;

      let updatedChildIndex = state.childs.findIndex(
        (child: any) => child.id === payload.id
      );

      if (updatedChildIndex !== -1 && updatedChildIndex) {
        state.childs = [
          ...state.childs.slice(0, updatedChildIndex),
          payload,
          ...state.childs.slice(updatedChildIndex + 1),
        ];
      } else {
        state.childs = [...state.childs, payload];
      }
    },
    setDeals: (state, action) => {
      const { payload } = action;
      state.deals.push(payload);
    },
  },
});

export const { addTravelerDeals, addTravelerChild, clearState, setDeals } =
  dealsSlice.actions;
export default dealsSlice.reducer;
