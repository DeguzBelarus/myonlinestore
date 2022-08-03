import { FC } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   deleteCartProductAsync,
   addCartProductAsync,
   deleteCartProductsGroupAsync
} from "../../../app/userSlice";
import { getCurrentLanguage } from "../../../app/globalSlice";
import { getToken, getUserId } from "../../../app/userSlice";
import { ProductInCartModified } from "../../../pages/ShoppingCartPage/ShoppingCartPage";
import "./CartProductItem.scss"

interface Props {
   data: ProductInCartModified
}

export const CartProductItem: FC<Props> = ({ data }) => {
   const dispatch = useAppDispatch()

   const token: string = useAppSelector(getToken)
   const userId: string = useAppSelector(getUserId)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)

   const removeCartProductHandler = (id: string) => {
      dispatch(deleteCartProductAsync({ id: id, token: token, lang: currentLanguage }))
   }

   const removeCartProductsGroupHandler = (productId: number) => {
      dispatch(deleteCartProductsGroupAsync({ id: userId, productId: productId, token: token, lang: currentLanguage }))
   }

   const addProductToCart = () => {
      dispatch(addCartProductAsync({
         lang: currentLanguage,
         token: token,
         data: { id: userId, productId: data.productId }
      }))
   }
   return <div className="cart-product-item-wrapper">
      <img
         className="poster"
         src={`/${data.productTypeId}/${data.productBrandId}/${data.productName}/${data.productPoster}`}
         draggable={false}
         alt="a product preview" />
      <span>{data.productName}</span>
      <span>{`${data.productPrice} USD`}</span>

      <div className="quantity-block">
         <button
            type="button"
            className="remove-cart-product-button"
            onClick={() => removeCartProductHandler(data.cartItemId.toString())}>
            -</button>
         <span>{currentLanguage === "ru"
            ? `${data.quantity} шт.`
            : `${data.quantity} pcs.`}
         </span>
         <button
            type="button"
            className="add-cart-product-button"
            onClick={addProductToCart}>
            +</button>
         <span>{`${data.sum} USD`}</span>
      </div>
      <button
         type="button"
         className="remove-cart-products-group-button"
         onClick={() => removeCartProductsGroupHandler(data.productId)}>
         {currentLanguage === "ru" ? "Удалить" : "Remove"}
      </button>
   </div>
}