import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { AgentSliceType, ProfileType } from '@typing/types';

const initialState: AgentSliceType = {
  agent_id: '',
  email: '',
  profile: {
    full_name: '',
    photo: '',
    phone_country_code: '',
    phone_number: '',
    birthday: '',
    address: '',
    city: '',
    country: '',
    state_province: '',
    zip_code: '',
    web_site: '',
    type_specialize: [],
    area_specialize: [],
    languages: [],
    url_facebook: '',
    url_instagram: '',
    url_whatsapp: '',
    description: '',
  },
  agent_is_subscribed: false,
};

export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileType>) => {
      state.profile = action.payload;
    },
    setIdentifiers: (
      state,
      action: PayloadAction<{ agent_id: string; email: string }>
    ) => {
      state.agent_id = action.payload.agent_id;
      state.email = action.payload.email;
    },
    setPhone: (
      state,
      action: PayloadAction<{
        phone_number: string;
        phone_country_code: string;
      }>
    ) => {
      state.profile.phone_country_code = action.payload.phone_country_code;
      state.profile.phone_number = action.payload.phone_number;
    },
    setInitialStateAgent: state => {
      state.email = '';
      state.agent_id = '';
      state.profile = {
        full_name: '',
        photo: '',
        phone_country_code: '',
        phone_number: '',
        birthday: '',
        address: '',
        city: '',
        country: '',
        state_province: '',
        zip_code: '',
        web_site: '',
        type_specialize: [],
        area_specialize: [],
        languages: [],
        url_facebook: '',
        url_instagram: '',
        url_whatsapp: '',
        description: '',
      };
    },
    setValidSubscription: (state, action) => {
      state.agent_is_subscribed = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setProfile,
  setIdentifiers,
  setPhone,
  setInitialStateAgent,
  setValidSubscription,
} = agentSlice.actions;

export default agentSlice.reducer;
