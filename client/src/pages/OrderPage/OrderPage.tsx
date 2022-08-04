import { FC } from "react";
import { useAppSelector } from "../../app/hooks";

import { getCurrentLanguage } from "../../app/globalSlice";
import { getProductsInCart, CartProduct } from "../../app/userSlice";
import { OrderForm } from "../../components/order-page/OrderForm/OrderForm";

import "./OrderPage.scss"

export const OrderPage: FC = () => {
   const productsInCart: CartProduct[] = useAppSelector(getProductsInCart)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)

   return <div className="order-page-wrapper">
      <span className="total-cost-span">
         {`${productsInCart.reduce((sum: number, cartItem: CartProduct) => {
            return sum += cartItem.details?.price || sum
         }, 0)} `}
         USD
      </span>
      <h2 className="heading-text">
         {currentLanguage === "ru" ? "Оформление заказа:" : "Making a purchase:"}
      </h2>
      <OrderForm />
   </div>
}