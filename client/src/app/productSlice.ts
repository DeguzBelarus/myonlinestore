import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store"
import {
   createType,
   getTypes,
   createBrand,
   getBrands,
   createProduct,
   getProducts,
   deleteType,
   updateType,
   deleteBrand,
   updateBrand
} from "./productAPI"

export interface ProductDescriptionObject {
   id: number,
   title: string,
   description: string
}

export interface CurrentProduct {
   id?: number,
   name: string,
   price: number,
   rating: number,
   poster: string,
   productTypeId: number,
   productBrandId: number,
   description: ProductDescriptionObject[]
}

export interface TypeOrBrandObject {
   id: number,
   name: string
}

interface ProductState {
   types: TypeOrBrandObject[],
   brands: TypeOrBrandObject[],
   products: CurrentProduct[],
   currentProduct: CurrentProduct,
   totalProducts: number | null,
   productStatus: "idle" | "loading" | "failed"
}

const initialState = {
   types: [],
   brands: [],
   products: [],
   currentProduct: {
      id: 0, name: "", price: 0, rating: 0, poster: "", productTypeId: 0, productBrandId: 0, description: []
   },
   totalProducts: null,
   productStatus: "idle"
} as ProductState

// thunks 
// types thunks
export const getTypesAsync = createAsyncThunk(
   "product/types/get",
   async () => {
      const url = `/api/type`
      const response: any = await getTypes(url)
      return await response.json()
   }
)

export const createTypeAsync = createAsyncThunk(
   "product/types/create",
   async (body: any) => {
      const url = `/api/type/add`
      const response: any = await createType(url, JSON.stringify(body.data), body.token)
      return await response.json()
   }
)

export interface UpdateTypeRequestObject {
   token: string,
   data: { name: string, lang: string },
   typeId: string
}

export const updateTypeAsync = createAsyncThunk(
   "product/types/update",
   async (body: UpdateTypeRequestObject) => {
      const url = `/api/type/${body.typeId}`
      const response: any = await updateType(url, JSON.stringify(body.data), body.token)
      return await response.json()
   }
)

export interface DeleteTypeRequestObject {
   id: string,
   token: string,
   lang: string
}

export const deleteTypeAsync = createAsyncThunk(
   "product/types/delete",
   async (data: DeleteTypeRequestObject) => {
      const url = `/api/type/${data.id}/delete?${data.lang}`
      const response: any = await deleteType(url, data.token)
      return await response.json()
   }
)
// types thunks

// brands thunks
export const getBrandsAsync = createAsyncThunk(
   "product/brands/get",
   async () => {
      const url = `/api/brand`
      const response: any = await getBrands(url)
      return await response.json()
   }
)

export const createBrandAsync = createAsyncThunk(
   "product/brands/create",
   async (body: any) => {
      const url = `/api/brand/add`
      const response: any = await createBrand(url, JSON.stringify(body.data), body.token)
      return await response.json()
   }
)

export interface UpdateBrandRequestObject {
   token: string,
   data: { name: string, lang: string },
   brandId: string
}

export const updateBrandAsync = createAsyncThunk(
   "product/brands/update",
   async (body: UpdateBrandRequestObject) => {
      const url = `/api/brand/${body.brandId}`
      const response: any = await updateBrand(url, JSON.stringify(body.data), body.token)
      return await response.json()
   }
)

export interface DeleteBrandRequestObject {
   id: string,
   token: string,
   lang: string
}

export const deleteBrandAsync = createAsyncThunk(
   "product/brands/delete",
   async (data: DeleteBrandRequestObject) => {
      const url = `/api/brand/${data.id}/delete?${data.lang}`
      const response: any = await deleteBrand(url, data.token)
      return await response.json()
   }
)
// brands thunks

// products thunks
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
         const url = `/api/product?${urlSearchParams}`
         const response: any = await getProducts(url)
         return await response.json()
      } else {
         const url = `/api/product`
         const response: any = await getProducts(url)
         return await response.json()
      }
   }
)

export const getProductAsync = createAsyncThunk(
   "product/get/one",
   async (id: string) => {
      const url = `/api/product/${id}`
      const response: any = await getProducts(url)
      return await response.json()
   }
)

export const createProductAsync = createAsyncThunk(
   "product/create",
   async (body: any) => {
      const url = `/api/product/add`
      const response: any = await createProduct(url, body.data, body.token)
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

         // types cases
         // get types
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
         // get types

         // create type
         .addCase(createTypeAsync.pending, (state) => {
            state.productStatus = "loading"
         })
         .addCase(createTypeAsync.fulfilled, (state, action) => {
            state.productStatus = "idle"
            state.types = action.payload
         })
         .addCase(createTypeAsync.rejected, (state, action) => {
            state.productStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // create type

         // update type
         .addCase(updateTypeAsync.pending, (state) => {
            state.productStatus = "loading"
         })
         .addCase(updateTypeAsync.fulfilled, (state, action) => {
            state.productStatus = "idle"
            state.types = action.payload
         })
         .addCase(updateTypeAsync.rejected, (state, action) => {
            state.productStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // update type

         // delete type
         .addCase(deleteTypeAsync.pending, (state) => {
            state.productStatus = "loading"
         })
         .addCase(deleteTypeAsync.fulfilled, (state, action) => {
            state.productStatus = "idle"
            state.types = action.payload
         })
         .addCase(deleteTypeAsync.rejected, (state, action) => {
            state.productStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // delete type
         // types cases

         // brands cases
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

         // create brand
         .addCase(createBrandAsync.pending, (state) => {
            state.productStatus = "loading"
         })
         .addCase(createBrandAsync.fulfilled, (state, action) => {
            state.productStatus = "idle"
            state.brands = action.payload
         })
         .addCase(createBrandAsync.rejected, (state, action) => {
            state.productStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // create brand

         // update brand
         .addCase(updateBrandAsync.pending, (state) => {
            state.productStatus = "loading"
         })
         .addCase(updateBrandAsync.fulfilled, (state, action) => {
            state.productStatus = "idle"
            state.brands = action.payload
         })
         .addCase(updateBrandAsync.rejected, (state, action) => {
            state.productStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // update brand

         // delete brand
         .addCase(deleteBrandAsync.pending, (state) => {
            state.productStatus = "loading"
         })
         .addCase(deleteBrandAsync.fulfilled, (state, action) => {
            state.productStatus = "idle"
            state.brands = action.payload
         })
         .addCase(deleteBrandAsync.rejected, (state, action) => {
            state.productStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // delete brand
         // brands cases

         // products cases
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
      // products cases
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
export const getProductStatus = (state: RootState) => state.product.productStatus

export default productSlice.reducer