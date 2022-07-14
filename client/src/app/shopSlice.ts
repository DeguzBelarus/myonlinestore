import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface ShopState {
   selectionMode: boolean,
   shopPageIsActive: boolean,
   authorizationPageIsActive: boolean,
   adminPanelPageIsActive: boolean,
   productPageIsActive: boolean,
   cartPageIsActive: boolean,
   selectedType: string | null,
   selectedBrand: string | null,
   currentPage: number,
   productsPerPage: number,
   previousRoute: string,
   routId: string | null,
   adminEditingType: "read" | "create" | "update" | "delete"
}

const initialState = {
   selectionMode: false,
   shopPageIsActive: false,
   authorizationPageIsActive: false,
   adminPanelPageIsActive: false,
   productPageIsActive: false,
   cartPageIsActive: false,
   selectedType: null,
   selectedBrand: null,
   currentPage: 1,
   productsPerPage: 20,
   previousRoute: "",
   routId: null,
   adminEditingType: "read"
} as ShopState

export const shopSlice = createSlice({
   name: "shop",
   initialState,
   reducers: {
      setSelectionMode(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.selectionMode = action.payload
         } else {
            state.selectionMode = initialState.selectionMode
         }
      }, setShopPageIsActive(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.shopPageIsActive = action.payload
         } else {
            state.shopPageIsActive = initialState.shopPageIsActive
         }
      }, setAuthorizationPageIsActive(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.authorizationPageIsActive = action.payload
         } else {
            state.authorizationPageIsActive = initialState.authorizationPageIsActive
         }
      }, setAdminPanelPageIsActive(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.adminPanelPageIsActive = action.payload
         } else {
            state.adminPanelPageIsActive = initialState.adminPanelPageIsActive
         }
      }, setSelectedType(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.selectedType = action.payload
         } else {
            state.selectedType = initialState.selectedType
         }
      }, setSelectedBrand(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.selectedBrand = action.payload
         } else {
            state.selectedBrand = initialState.selectedBrand
         }
      }, setCurrentPage(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.currentPage = action.payload
         } else {
            state.currentPage = initialState.currentPage
         }
      }, setProductsPerPage(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.productsPerPage = action.payload
         } else {
            state.productsPerPage = initialState.productsPerPage
         }
      }, setPreviousRoute(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.previousRoute = action.payload
         } else {
            state.previousRoute = initialState.previousRoute
         }
      }, setProductPageIsActive(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.productPageIsActive = action.payload
         } else {
            state.productPageIsActive = initialState.productPageIsActive
         }
      }, setRoutId(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.routId = action.payload
         } else {
            state.routId = initialState.routId
         }
      }, setCartPageIsActive(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.cartPageIsActive = action.payload
         } else {
            state.cartPageIsActive = initialState.cartPageIsActive
         }
      }, setAdminEditingType(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.adminEditingType = action.payload
         } else {
            state.adminEditingType = initialState.adminEditingType
         }
      }
   }
})

export const {
   setSelectionMode,
   setShopPageIsActive,
   setAuthorizationPageIsActive,
   setAdminPanelPageIsActive,
   setSelectedType,
   setSelectedBrand,
   setCurrentPage,
   setProductsPerPage,
   setPreviousRoute,
   setProductPageIsActive,
   setRoutId,
   setCartPageIsActive,
   setAdminEditingType
} = shopSlice.actions

export const getSelectionMode = (state: RootState) => state.shop.selectionMode
export const getShopPageIsActive = (state: RootState) => state.shop.shopPageIsActive
export const getProductPageIsActive = (state: RootState) => state.shop.productPageIsActive
export const getAuthorizationPageIsActive = (state: RootState) => state.shop.authorizationPageIsActive
export const getAdminPanelPageIsActive = (state: RootState) => state.shop.adminPanelPageIsActive
export const getCartPageIsActive = (state: RootState) => state.shop.cartPageIsActive
export const getSelectedType = (state: RootState) => state.shop.selectedType
export const getSelectedBrand = (state: RootState) => state.shop.selectedBrand
export const getCurrentPage = (state: RootState) => state.shop.currentPage
export const getProductsPerPage = (state: RootState) => state.shop.productsPerPage
export const getPreviousRoute = (state: RootState) => state.shop.previousRoute
export const getRouteId = (state: RootState) => state.shop.routId
export const getAdminEditingType = (state: RootState) => state.shop.adminEditingType

export default shopSlice.reducer