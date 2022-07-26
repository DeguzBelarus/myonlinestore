import { FC, useEffect } from "react";
import { Params, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getCurrentLanguage } from "../../app/globalSlice";
import { setRoutId, setProductPageIsActive } from "../../app/shopSlice"
import { setCurrentProduct, getCurrentProduct, getProductAsync, CurrentProduct } from "../../app/productSlice";
import "./ProductPage.scss"

export const ProductPage: FC = () => {
   const dispatch = useAppDispatch()

   const { id }: Params<string> = useParams()
   const currentLanguage = useAppSelector(getCurrentLanguage)
   const currentProduct: CurrentProduct = useAppSelector(getCurrentProduct)

   useEffect(() => {
      document.title = currentLanguage === "ru" ? "MyOnlineStore: Страница Товара" : "MyOnlineStore: Product's Page"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
   }, [currentLanguage])

   useEffect(() => {
      dispatch(setProductPageIsActive(true))
      dispatch(setRoutId(id))

      return () => {
         dispatch(setProductPageIsActive(false))
         dispatch(setCurrentProduct(null))
         dispatch(setRoutId(""))
      }
   }, [])

   return <div className="product-page-wrapper"></div>
}