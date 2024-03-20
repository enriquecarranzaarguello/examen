import {
  configureStore,
  combineReducers,
  EnhancedStore,
} from '@reduxjs/toolkit';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import generalReducer from '../slices/generalSlice';
import agentReducer from '../slices/agentSlice';
import supplierReducer from '../slices/suppliersSlice';
import marketingSlice from '../slices/marketingSlice';
import hotelSlice from '../slices/hotelSlice';
import dealsSlice from '@context/slices/dealsSlice';

import localForage from 'localforage';

import flightSliceReducer, {
  flightTypeChangeMiddleware,
} from '../slices/flightSlice/flightSlice';

const agentsPersistConfig = {
  key: 'agent',
  // TODO remember ro check storage for test
  storage: localForage,
};

const generalPersistConfig = {
  key: 'general',
  storage: localForage,
  whitelist: ['currency'],
};

const flightsPersistConfig = {
  key: 'flights',
  storage: localForage,
  whitelist: [
    'segments',
    'passengers',
    'class',
    'flightType',
    'selectedFlight',
  ],
};

const hotelsPersistConfig = {
  key: 'hotels',
  storage: localForage,
  whitelist: [
    'results',
    'filteredResults',
    'destinations',
    'searchParams',
    'filter',
    'resultId',
    'loadingTotal',
    'loadingProgress',
    'selectedRoom',
  ],
};

const rootReducer = combineReducers({
  general: persistReducer(generalPersistConfig, generalReducer),
  agent: persistReducer(agentsPersistConfig, agentReducer),
  supplier: supplierReducer,
  flights: persistReducer(flightsPersistConfig, flightSliceReducer),
  marketing: marketingSlice,
  hotels: persistReducer(hotelsPersistConfig, hotelSlice),
  deals: dealsSlice,
});

export const store: EnhancedStore = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(flightTypeChangeMiddleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
