import { FC, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { setCartPageIsActive } from "../../app/shopSlice";
import { getCurrentLanguage } from "../../app/globalSlice";
import "./ShoppingCartPage.scss"

export const ShoppingCartPage: FC = () => {
   const dispatch = useAppDispatch()

   const currentLanguage = useAppSelector(getCurrentLanguage)

   useEffect(() => {
      document.title = currentLanguage === "ru" ? "MyOnlineStore: Ваша Корзина" : "MyOnlineStore: Your Cart"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
   }, [currentLanguage])

   useEffect(() => {
      dispatch(setCartPageIsActive(true))

      return () => {
         dispatch(setCartPageIsActive(false))
      }
   }, [])
   return <div className="shopping-cart-page-wrapper">Shopping cart</div>
}