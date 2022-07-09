import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import globalReducer from './globalSlice';
import userReducer from './userSlice';
import productReducer from "./productSlice"
import shopReducer from "./shopSlice"

export const store = configureStore({
   reducer: {
      global: globalReducer,
      user: userReducer,
      product: productReducer,
      shop: shopReducer
   },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
   ReturnType,
   RootState,
   unknown,
   Action<string>
>;
