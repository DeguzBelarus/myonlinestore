import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getIsAuth } from "../../app/userSlice";
import { setProductIsDragged, setDraggedProduct } from "../../app/shopSlice";
import { CurrentProduct } from "../../app/productSlice";
import "./ProductCard.scss"

interface Props {
   productData: CurrentProduct
}

export const ProductCard: FC<Props> = ({ productData }) => {
   const dispatch = useAppDispatch()

   const isAuth: boolean = useAppSelector(getIsAuth)

   const dragStartHandler = (event: any) => {
      if (isAuth) {
         dispatch(setProductIsDragged(true))
         dispatch(setDraggedProduct(productData))
         event.currentTarget.setAttribute("class", "product-card-wrapper product-dragging")
      }
   }

   const dragEndHandler = (event: any) => {
      if (isAuth) {
         dispatch(setProductIsDragged(false))
         event.currentTarget.setAttribute("class", "product-card-wrapper")
      }
   }
   return <div
      className={isAuth ? "product-card-wrapper logged" : "product-card-wrapper"}
      draggable={isAuth}
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}>
      <span>{productData.name}</span>
      <img
         className="product-poster"
         draggable={false}
         src={`/${productData.productTypeId}/${productData.productBrandId}/${productData.name}/${productData.poster}`}
         alt="a product preview" />
      <span>{productData.price} $</span>
   </div>
}