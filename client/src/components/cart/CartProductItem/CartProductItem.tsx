import { FC } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   deleteCartProductAsync
} from "../../../app/userSlice";
import { getCurrentLanguage } from "../../../app/globalSlice";
import { CartProduct, getToken } from "../../../app/userSlice";
import "./CartProductItem.scss"

interface Props {
   data: CartProduct
}

export const CartProductItem: FC<Props> = ({ data }) => {
   const dispatch = useAppDispatch()

   const token: string = useAppSelector(getToken)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)

   const removeCartProductHandler = (id: string) => {
      dispatch(deleteCartProductAsync({ id: id, token: token, lang: currentLanguage }))
   }

   return <div className="cart-product-item-wrapper">
      <span>{data.details?.name}</span>
      <span>{`${data.details?.price} USD`}</span>
      <button
         className="remove-cart-product-button"
         onClick={() => removeCartProductHandler(data.id.toString())}>
         {currentLanguage === "ru"
            ? "Удалить"
            : "Remove"}
      </button>
   </div>
}