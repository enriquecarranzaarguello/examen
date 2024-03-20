import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
//import type { SuppliersSliceType,  } from "@typing/types";

const initialState = {};

export const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {},
});
export const {} = suppliersSlice.actions;

export default suppliersSlice.reducer;
