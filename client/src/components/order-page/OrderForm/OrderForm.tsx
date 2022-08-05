import { FC, useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   addOrderAsync,
   getAuthStatus,
   ProductInCartModified,
   CartProduct,
   getProductsInCart,
   BuyerInfoObject,
   getToken,
   deleteAllCartProductAsync,
   getUserId
} from "../../../app/userSlice";
import { getCurrentLanguage } from "../../../app/globalSlice";
import "./OrderForm.scss"

interface Props {
   setIsOrderConfirmed: any
}

export const OrderForm: FC<Props> = ({ setIsOrderConfirmed }) => {
   const orderForm = useRef<HTMLFormElement>(null)

   const dispatch = useAppDispatch()

   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const token: string = useAppSelector(getToken)
   const userId: string = useAppSelector(getUserId)
   const authStatus: string = useAppSelector(getAuthStatus)
   const productsInCart: CartProduct[] = useAppSelector(getProductsInCart)
   const [productsInCartModified, setProductsInCartModified] = useState<ProductInCartModified[]>([])
   const [buyerInfo, setBuyerInfo] = useState<BuyerInfoObject>({
      firstname: "",
      lastname: "",
      city: "",
      adress: "",
      zipcode: 0,
      phone: 0
   })

   const sortCartProductsMethod = (previous: ProductInCartModified, next: ProductInCartModified) => {
      switch (true) {
         case previous.cartProductid > next.cartProductid:
            return 1
         case previous.cartProductid < next.cartProductid:
            return -1
         default:
            return 0
      }
   }

   const productsInCartModifiedUpdation = () => {
      setProductsInCartModified(
         productsInCart
            .map((cartItem: CartProduct, index, array) => {
               const productId: number = cartItem.productId

               return {
                  cartItemId: cartItem.id,
                  cartProductid: productId,
                  cartId: cartItem.cartId,
                  productId: cartItem.productId,
                  productName: cartItem.details?.name,
                  productPrice: cartItem.details?.price,
                  productRating: cartItem.details?.rating,
                  productPoster: cartItem.details?.poster,
                  productTypeId: cartItem.details?.productTypeId,
                  productBrandId: cartItem.details?.productBrandId,
                  quantity: array.filter((cartItem: CartProduct) => cartItem.productId === productId).length,
                  sum: array.reduce((sum: number, cartItem: CartProduct) => {
                     if (cartItem.productId === productId) {
                        return sum += cartItem.details?.price || sum
                     } else return sum
                  }, 0)
               }
            })
            .sort(sortCartProductsMethod)
            .reduce((unique: ProductInCartModified[], cartItemModified: ProductInCartModified) => {
               return unique.find((uniqueElement: ProductInCartModified) => uniqueElement.cartProductid === cartItemModified.cartProductid) ? unique : [...unique, cartItemModified]
            }, [])
      )
   }

   const buyerInfoUpdation = (event: any) => {
      setBuyerInfo({ ...buyerInfo, [event.target.name]: event.target.value })
   }

   const orderConfirnation = (event: any) => {
      event.preventDefault()
      if (!buyerInfo.firstname
         || !buyerInfo.lastname
         || !buyerInfo.city
         || !buyerInfo.adress
         || !buyerInfo.zipcode
         || !buyerInfo.phone
         || !productsInCartModified.length) return

      dispatch(addOrderAsync({
         lang: currentLanguage, token: token, data: {
            buyerInfo: buyerInfo,
            orderInfo: productsInCartModified
         }
      }))
      dispatch(deleteAllCartProductAsync({ id: userId, token: token, lang: currentLanguage }))
      orderForm.current?.reset()
      setIsOrderConfirmed(true)
   }

   useEffect(() => {
      productsInCartModifiedUpdation()
   }, [])
   return <div className="order-form-wrapper">
      <form className="order-form" onSubmit={orderConfirnation} ref={orderForm}>
         <label htmlFor="firstname-input">
            {currentLanguage === "ru" ? "Имя:" : "First name:"}
         </label>
         <input
            id="firstname-input"
            type="text"
            name="firstname"
            required
            placeholder={
               currentLanguage === "ru" ? "Введите имя" : "Enter the name"}
            onChange={buyerInfoUpdation} />

         <label htmlFor="lastname-input">
            {currentLanguage === "ru" ? "Фамилия:" : "Last name:"}
         </label>
         <input
            id="lastname-input"
            type="text"
            name="lastname"
            required
            placeholder={
               currentLanguage === "ru" ? "Введите фамилию" : "Enter the last name"}
            onChange={buyerInfoUpdation} />

         <label htmlFor="city-input">
            {currentLanguage === "ru" ? "Город:" : "City:"}
         </label>
         <input
            id="city-input"
            type="text"
            name="city"
            required
            placeholder={
               currentLanguage === "ru" ? "Введите город" : "Enter the city"}
            onChange={buyerInfoUpdation} />

         <label htmlFor="adress-input">
            {currentLanguage === "ru" ? "Адрес:" : "Adress:"}
         </label>
         <input
            id="adress-input"
            type="text"
            name="adress"
            required
            placeholder={
               currentLanguage === "ru" ? "Введите адрес" : "Enter the adress"}
            onChange={buyerInfoUpdation} />

         <label htmlFor="zipcode-input">
            {currentLanguage === "ru" ? "Почтовый индекс:" : "Zip code:"}
         </label>
         <input
            id="zipcode-input"
            type="number"
            name="zipcode"
            required
            placeholder={
               currentLanguage === "ru" ? "Введите индекс" : "Enter the zip code"}
            onChange={buyerInfoUpdation} />

         <label htmlFor="phone-input">
            {currentLanguage === "ru" ? "Телефон:" : "Phone number:"}
         </label>
         <input
            id="phone-input"
            type="number"
            name="phone"
            required
            placeholder={
               currentLanguage === "ru" ? "Введите телефон" : "Enter the phone number"}
            onChange={buyerInfoUpdation} />

         <label htmlFor="comment-input">
            {currentLanguage === "ru" ? "Комментарий:" : "Comment:"}
         </label>
         <textarea
            id="comment-input"
            name="comment"
            rows={3}
            cols={33}
            maxLength={99}
            placeholder={
               currentLanguage === "ru" ? "До 99 символов" : "Up to 99 characters"}
            onChange={buyerInfoUpdation} />

         <button
            type="submit"
            className="confirm-order-button">
            {authStatus === "loading"
               ? currentLanguage === "ru"
                  ? "Обработка..."
                  : "Processing..."
               : currentLanguage === "ru"
                  ? "Подтверждаю"
                  : "Confirm"}
         </button>
      </form>
   </div>
}