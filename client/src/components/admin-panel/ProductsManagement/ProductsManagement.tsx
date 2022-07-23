import { FC, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   getProductsAsync,
   GetProductsQueryParams,
   getAllProducts,
   CurrentProduct
} from "../../../app/productSlice";
import {
   getCurrentPage,
   getProductsPerPage,
   getSelectedType,
   getSelectedBrand
} from "../../../app/shopSlice";
import { getAdminEditingType } from "../../../app/shopSlice";
import { getToken } from "../../../app/userSlice";
import { getCurrentLanguage } from "../../../app/globalSlice";
import { CRUDModeSwitcher } from "../CRUDModeSwitcher/CRUDModeSwitcher";
import "./ProductsManagement.scss"

export const ProductsManagement: FC = () => {
   const dispatch = useAppDispatch()

   const allProducts = useAppSelector(getAllProducts)
   const token: string | null = useAppSelector(getToken)
   const adminEditingType: string = useAppSelector(getAdminEditingType)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const currentPage: number = useAppSelector(getCurrentPage)
   const productsPerPage: number = useAppSelector(getProductsPerPage)
   const selectedType: number = useAppSelector(getSelectedType)
   const selectedBrand: number = useAppSelector(getSelectedBrand)
   const getProductsQueryParams: GetProductsQueryParams = {
      limit: productsPerPage,
      page: currentPage,
      typeId: selectedType,
      brandId: selectedBrand
   }

   useEffect(() => {
      dispatch(getProductsAsync(getProductsQueryParams))
   }, [adminEditingType])
   return <div className="products-management-wrapper">
      <CRUDModeSwitcher type="othermanagement" />
   </div>
}