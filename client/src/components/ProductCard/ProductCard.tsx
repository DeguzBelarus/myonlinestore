import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getIsAuth } from "../../app/userSlice";
import { setProductIsDragged, setDraggedProduct } from "../../app/shopSlice";
import { CurrentProduct } from "../../app/productSlice";
import cartIcon from "../../assets/cart-icon.svg"
import favoriteIcon from "../../assets/favorite-icon.svg"
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
         event.currentTarget.setAttribute("class", "product-card-wrapper logged")
      }
   }
   return <div
      className={isAuth ? "product-card-wrapper logged" : "product-card-wrapper"}
      draggable={isAuth}
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}>
      <span className="product-name-span">{productData.name}</span>
      <img
         className="product-poster"
         draggable={false}
         src={`/${productData.productTypeId}/${productData.productBrandId}/${productData.name}/${productData.poster}`}
         alt="a product preview" />
      <span className="product-price-span">{productData.price} $</span>
      <img
         className="cart-icon"
         src={cartIcon}
         alt="a product cart" />

      <img
         className="favorite-icon"
         src={favoriteIcon}
         alt="a product cart" />
   </div>
}