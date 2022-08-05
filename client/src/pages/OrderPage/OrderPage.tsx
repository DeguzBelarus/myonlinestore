import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

import { getCurrentLanguage } from "../../app/globalSlice";
import { getProductsInCart, CartProduct } from "../../app/userSlice";
import { OrderForm } from "../../components/order-page/OrderForm/OrderForm";
import "./OrderPage.scss"

export const OrderPage: FC = () => {
   const navigate = useNavigate()

   const productsInCart: CartProduct[] = useAppSelector(getProductsInCart)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean>(false)
   const [returningCounter, setReturningCounter] = useState<number>(10)

   const retutningToTheShop = () => {
      navigate("/shop")
   }

   useEffect(() => {
      if (isOrderConfirmed) {
         let returnningValue = 10

         const returningPromise = new Promise((resolve, reject) => {
            const returningInterval = setInterval(() => {
               if (returnningValue === 0) {
                  clearInterval(returningInterval)
                  return resolve(returnningValue)
               }
               returnningValue--
               setReturningCounter(returnningValue)
            }, 1000)
         })
         returningPromise.then((returnningValue) => {
            if (returnningValue === 0) retutningToTheShop()
         })
      }
   }, [isOrderConfirmed])
   return <div className={!isOrderConfirmed
      ? "order-page-wrapper"
      : "order-page-wrapper confirmed"}>
      {!isOrderConfirmed
         ? <>
            <span className="total-cost-span">
               {`${productsInCart.reduce((sum: number, cartItem: CartProduct) => {
                  return sum += cartItem.details?.price || sum
               }, 0)} `}
               USD
            </span>
            <h2 className="heading-text">
               {currentLanguage === "ru" ? "Оформление заказа:" : "Making a purchase:"}
            </h2>
            <OrderForm setIsOrderConfirmed={setIsOrderConfirmed} />
         </>
         : <p className="confirmation-notifiaction">
            {currentLanguage === "ru"
               ? `Ваш заказ принят, вы вернётесь на главную страницу через ${returningCounter} секунд`
               : `Your order is accepted, you will return to the main page in ${returningCounter} seconds`}
         </p>}
   </div>
}