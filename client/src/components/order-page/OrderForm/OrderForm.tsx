import { FC, useState } from "react";
import { useAppSelector } from "../../../app/hooks";

import { addOrderAsync, getAuthStatus } from "../../../app/userSlice";
import { getCurrentLanguage } from "../../../app/globalSlice";
import "./OrderForm.scss"

interface BuyerInfoObject {
   firstname: string,
   lastname: string,
   city: string
   adress: string,
   zipcode: number,
   phone: number,
   comment?: string
}

export const OrderForm: FC = () => {
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const authStatus: string = useAppSelector(getAuthStatus)

   const [buyerInfo, setBuyerInfo] = useState<BuyerInfoObject>({
      firstname: "",
      lastname: "",
      city: "",
      adress: "",
      zipcode: 0,
      phone: 0
   })

   return <div className="order-form-wrapper">
      <form className="order-form">

         <label htmlFor="firstname-input">
            {currentLanguage === "ru" ? "Имя:" : "First name:"}
         </label>
         <input id="firstname-input" type="text" name="firstname" required placeholder={
            currentLanguage === "ru" ? "Введите имя" : "Enter the name"} />

         <label htmlFor="lastname-input">
            {currentLanguage === "ru" ? "Фамилия:" : "Last name:"}
         </label>
         <input id="lastname-input" type="text" name="lastname" required placeholder={
            currentLanguage === "ru" ? "Введите фамилию" : "Enter the last name"} />

         <label htmlFor="city-input">
            {currentLanguage === "ru" ? "Город:" : "City:"}
         </label>
         <input id="city-input" type="text" name="city" required placeholder={
            currentLanguage === "ru" ? "Введите город" : "Enter the city"} />

         <label htmlFor="adress-input">
            {currentLanguage === "ru" ? "Адрес:" : "Adress:"}
         </label>
         <input id="adress-input" type="text" name="adress" required placeholder={
            currentLanguage === "ru" ? "Введите адрес" : "Enter the adress"} />

         <label htmlFor="zipcode-input">
            {currentLanguage === "ru" ? "Почтовый индекс:" : "Zip code:"}
         </label>
         <input id="zipcode-input" type="number" name="zipcode" required placeholder={
            currentLanguage === "ru" ? "Введите индекс" : "Enter the zip code"} />

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
         />

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
               currentLanguage === "ru" ? "До 99 символов" : "Up to 99 characters"} />

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