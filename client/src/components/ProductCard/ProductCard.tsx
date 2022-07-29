import { FC, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";

import { setProductIsDragged, setDraggedProduct } from "../../app/shopSlice";
import { CurrentProduct } from "../../app/productSlice";
import "./ProductCard.scss"

interface Props {
   productData: CurrentProduct
}

export const ProductCard: FC<Props> = ({ productData }) => {
   const dispatch = useAppDispatch()

   const dragStartHandler = () => {
      dispatch(setProductIsDragged(true))
      dispatch(setDraggedProduct(productData))
   }

   const dragEndHandler = () => {
      dispatch(setProductIsDragged(false))
   }
   return <div
      className="product-card-wrapper"
      draggable={true}
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}>
      <span>{productData.name}</span>
      <img
         className="product-poster"
         src={`/${productData.productTypeId}/${productData.productBrandId}/${productData.name}/${productData.poster}`}
         alt="a product preview" />
      <span>{productData.price} $</span>
   </div>
}