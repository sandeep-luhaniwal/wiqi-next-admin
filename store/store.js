import { configureStore } from '@reduxjs/toolkit';
import countryReducer from './slices/countrySlice';
import countryCategoryReducer from './slices/countryCategorySlice';
import supportReducer from './slices/supportSlice';

export const store = configureStore({
  reducer: {
    country: countryReducer,
    countryCategory: countryCategoryReducer,
    support: supportReducer,
  },
});
