import { FC, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";

import { getCurrentLanguage } from "../../app/globalSlice";
import "./ShoppingCartPage.scss"

export const ShoppingCartPage: FC = () => {
   const currentLanguage = useAppSelector(getCurrentLanguage)

   useEffect(() => {
      document.title = currentLanguage === "ru" ? "MyOnlineStore: Ваша Корзина" : "MyOnlineStore: Your Cart"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
   }, [currentLanguage])
   return <div className="shopping-cart-page-wrapper"></div>
}