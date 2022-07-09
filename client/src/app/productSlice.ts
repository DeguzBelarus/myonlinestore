import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store"
import { createType, getTypes, createBrand, getBrands, createProduct, getProducts } from "./productAPI"

export interface CurrentProduct {
   id: number,
   name: string,
   price: number,
   rating: number,
   poster: string,
   typeId: number,
   brandId: number,
   description: {}[]
}

interface ProductState {
   types: {}[],
   brands: {}[],
   products: {}[],
   currentProduct: CurrentProduct,
   totalProducts: number | null,
   productStatus: "idle" | "loading" | "failed"
}

const initialState = {
   types: [],
   brands: [],
   products: [],
   currentProduct: {
      id: 0, name: "", price: 0, rating: 0, poster: "", typeId: 0, brandId: 0, description: []
   },
   totalProducts: null,
   productStatus: "idle"
} as ProductState

// thunks 
// types thunks
export const createTypeAsync = createAsyncThunk(
   "product/types/create",
   async (body: any) => {
      const url = `${process.env.REACT_APP_API_URL}/api/type`
      const response: any = createType(url, JSON.stringify(body.data), body.token)
      return await response.json()
   }
)

export const getTypesAsync = createAsyncThunk(
   "product/types/get",
   async () => {
      const url = `${process.env.REACT_APP_API_URL}/api/type`
      const response: any = await getTypes(url)
      return await response.json()
   }
)
// types thunks

// brands thunks
export const createBrandAsync = createAsyncThunk(
   "product/brands/create",
   async (body: any) => {
      const url = `${process.env.REACT_APP_API_URL}/api/brand`
      const response: any = createBrand(url, JSON.stringify(body.data), body.token)
      return await response.json()
   }
)

export const getBrandsAsync = createAsyncThunk(
   "product/brands/get",
   async () => {
      const url = `${process.env.REACT_APP_API_URL}/api/brand`
      const response: any = await getBrands(url)
      return await response.json()
   }
)
// brands thunks

// products thunks
export const createProductAsync = createAsyncThunk(
   "product/create",
   async (body: any) => {
      const url = `${process.env.REACT_APP_API_URL}/api/product`
      const response: any = await createProduct(url, body.data, body.token)
      return await response.json()
   }
)

export interface GetProductsQueryParams {
   page?: number,
   limit?: number,
   typeId?: number,
   brandId?: number
}

export const getProductsAsync = createAsyncThunk(
   "product/get/all",
   async (params: GetProductsQueryParams) => {
      const { page, limit, typeId, brandId } = params

      if (page || limit || typeId || brandId) {
         const urlSearchParams = new URLSearchParams()
         if (page) {
            urlSearchParams.append("page", `${page}`)
         }
         if (limit) {
            urlSearchParams.append("limit", `${limit}`)
         }
         if (typeId) {
            urlSearchParams.append("typeId", `${typeId}`)
         }
         if (brandId) {
            urlSearchParams.append("brandId", `${brandId}`)
         }
         const url = `${process.env.REACT_APP_API_URL}/api/product?${urlSearchParams}`
         const response: any = await getProducts(url)
         return await response.json()
      } else {
         const url = `${process.env.REACT_APP_API_URL}/api/product`
         const response: any = await getProducts(url)
         return await response.json()
      }
   }
)

export const getProductAsync = createAsyncThunk(
   "product/get/one",
   async (id: string) => {
      const url = `${process.env.REACT_APP_API_URL}/api/product/${id}`
      const response: any = await getProducts(url)
      return await response.json()
   }
)
// products thunks
// thunks 

export const productSlice = createSlice({
   name: "product",
   initialState,
   reducers: {
      setProductsTypes(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.types = action.payload
         } else {
            state.types = initialState.types
         }
      }, setProductsBrands(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.brands = action.payload
         } else {
            state.brands = initialState.brands
         }
      }, setProducts(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.products = action.payload
         } else {
            state.products = initialState.products
         }
      }, setCurrentProduct(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.currentProduct = action.payload
         } else {
            state.currentProduct = initialState.currentProduct
         }
      }
   }, extraReducers: (builder) => {
      builder

         // get types cases
         .addCase(getTypesAsync.pending, (state) => {
            state.productStatus = "loading"
         })
         .addCase(getTypesAsync.fulfilled, (state, action) => {
            state.productStatus = "idle"
            state.types = action.payload
         })
         .addCase(getTypesAsync.rejected, (state, action) => {
            state.productStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // get types cases

         // get brands cases
         .addCase(getBrandsAsync.pending, (state) => {
            state.productStatus = "loading"
         })
         .addCase(getBrandsAsync.fulfilled, (state, action) => {
            state.productStatus = "idle"
            state.brands = action.payload
         })
         .addCase(getBrandsAsync.rejected, (state, action) => {
            state.productStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // get brands cases

         // get products cases
         .addCase(getProductsAsync.pending, (state) => {
            state.productStatus = "loading"
         })
         .addCase(getProductsAsync.fulfilled, (state, action) => {
            state.productStatus = "idle"
            state.products = action.payload.rows
            state.totalProducts = action.payload.count
         })
         .addCase(getProductsAsync.rejected, (state, action) => {
            state.productStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // get products cases

         // get one product cases
         .addCase(getProductAsync.pending, (state) => {
            state.productStatus = "loading"
         })
         .addCase(getProductAsync.fulfilled, (state, action) => {
            state.productStatus = "idle"
            state.currentProduct = action.payload
         })
         .addCase(getProductAsync.rejected, (state, action) => {
            state.productStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
      // get one product cases
   }
})

export const {
   setProductsTypes,
   setProductsBrands,
   setCurrentProduct,
   setProducts
} = productSlice.actions

export const getProductsTypes = (state: RootState) => state.product.types
export const getProductsBrands = (state: RootState) => state.product.brands
export const getAllProducts = (state: RootState) => state.product.products
export const getCurrentProduct = (state: RootState) => state.product.currentProduct
export const getTotalProducts = (state: RootState) => state.product.totalProducts

export default productSlice.reducer