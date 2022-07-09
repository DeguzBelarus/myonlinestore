import { FC, useEffect } from "react";
import { Params, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { setRoutId, setProductPageIsActive } from "../../app/shopSlice"
import { setCurrentProduct, getCurrentProduct, getProductAsync, CurrentProduct } from "../../app/productSlice";
import "./ProductPage.scss"

export const ProductPage: FC = () => {
   const dispatch = useAppDispatch()

   const { id }: Params<string> = useParams()
   const currentProduct: CurrentProduct = useAppSelector(getCurrentProduct)

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