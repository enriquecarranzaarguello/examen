import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { Currency, GeneralSliceType } from '@typing/types';

import { getChangeCurrency } from '@utils/axiosClients';
import config from '@config';

const initialCurrency: Currency = {
  selectedCurrency: 'USD',
  currencyNumber: 1.0,
  currencySymbol: '$',
};

const initialState: GeneralSliceType = {
  loading: false,
  currency: initialCurrency,
};

export const getCurrencyResponse = createAsyncThunk(
  'general/getCurrencyResponse',
  async (selectedCurrency: string, { dispatch, rejectWithValue }) => {
    const chooseCurrency = config.WHITELABELNAME === 'Volindo' ? 'USD' : 'MXN';
    const exchangeCurrencyCode = !!selectedCurrency
      ? selectedCurrency
      : chooseCurrency;
    getChangeCurrency(exchangeCurrencyCode)
      .then(response => {
        dispatch(
          setCurrency({
            selectedCurrency: exchangeCurrencyCode,
            currencySymbol: response.data[exchangeCurrencyCode][0],
            currencyNumber: response.data[exchangeCurrencyCode][1],
          })
        );
      })
      .catch(error => {
        rejectWithValue(error.toString());
      });
  }
);

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrency: (state, action) => {
      const { selectedCurrency, currencyNumber, currencySymbol } =
        action.payload;
      state.currency.selectedCurrency = selectedCurrency;
      state.currency.currencyNumber = currencyNumber;
      state.currency.currencySymbol = currencySymbol;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setCurrency } = generalSlice.actions;

export default generalSlice.reducer;
