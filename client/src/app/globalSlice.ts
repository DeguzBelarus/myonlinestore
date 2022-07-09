import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface GlobalState {
   currentLanguage: string
}

const initialState = {
   currentLanguage: "ru"
} as GlobalState

export const globalSlice = createSlice({
   name: "global",
   initialState,
   reducers: {
      setCurrentLanguage(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.currentLanguage = action.payload
         } else {
            state.currentLanguage = initialState.currentLanguage
         }
      }
   }
})

export const {
   setCurrentLanguage
} = globalSlice.actions

export const getCurrentLanguage = (state: RootState) => state.global.currentLanguage

export default globalSlice.reducer