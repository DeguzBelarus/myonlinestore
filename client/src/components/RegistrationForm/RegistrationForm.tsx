import { FC, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { getCurrentLanguage } from "../../app/globalSlice";
import {
   getRegistrationEmail,
   setAuthMessage,
   getAuthStatus,
   setRegistrationEmail,
   registrationAsync
} from "../../app/userSlice";
import { AuthMessage } from "../AuthMessage/AuthMessage";
import "./RegistrationForm.scss"

interface Props {
   isAuth: boolean,
   previousRoute: string,
}

export const RegistrationForm: FC<Props> = ({ isAuth, previousRoute }) => {
   const confirmPasswordInput: any = useRef(null)

   const dispatch = useAppDispatch()
   const navigate = useNavigate()

   const registrationEmail: string = useAppSelector(getRegistrationEmail)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const authStatus: string = useAppSelector(getAuthStatus)
   const [registrationFormData, setRegistrationFormData]: any = useState({
      email: registrationEmail, password: "", lang: currentLanguage, nickname: ""
   })

   const registrationFormDataUpdate = (event: any) => {
      setRegistrationFormData({ ...registrationFormData, [event.target.name]: event.target.value })
   }

   const loginPageEnter = () => {
      navigate("/login")
      dispatch(setRegistrationEmail(""))
      dispatch(setAuthMessage(""))
   }

   const registrationSubmit = (event: any) => {
      event.preventDefault()
      switch (true) {
         case registrationFormData.nickname.length < 2:
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Минимальная длина никнейма - 2 символа"
               : "The minimum nickname length is 2 characters"))
         case registrationFormData.nickname.length > 10:
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Максимальная длина никнейма - 10 символов"
               : "The maximum nickname length is 10 characters"))
         case registrationFormData.password.length < 8:
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Минимальная длина пароля - 8 символов"
               : "The minimum password length is 8 characters"))
         case registrationFormData.password.length > 255:
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Максимальная длина пароля - 255 символов"
               : "The maximum password length is 255 characters"))
         case registrationFormData.password !== confirmPasswordInput.current.value:
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Пароли не совпадают"
               : "Passwords don't match"))
      }

      dispatch(registrationAsync(JSON.stringify(registrationFormData)))
   }

   useEffect(() => {
      if (!registrationEmail) {
         navigate("/login")
      }

      if (isAuth) {
         navigate(previousRoute)
      }

      return () => {
         dispatch(setRegistrationEmail(""))
         dispatch(setAuthMessage(""))
      }
   }, [isAuth])

   useEffect(() => {
      setRegistrationFormData({ ...registrationFormData, lang: currentLanguage })
   }, [currentLanguage])
   return <form id="registration-form" onSubmit={registrationSubmit}>
      <h2 className="registration-email-header">{currentLanguage === "ru"
         ? "Регистрация:"
         : "Registration:"}</h2>
      <p className="heading-paragraph">{registrationEmail}</p>

      <label htmlFor="nickname-input">
         <input
            type="text"
            id="nickname-input"
            name="nickname"
            placeholder={currentLanguage === "ru" ? "Введите Ваш никнейм" : "Enter your nickname"}
            title={currentLanguage === "ru" ? "Введите Ваш никнейм" : "Enter your nickname"}
            required
            autoFocus
            autoComplete="off"
            minLength={2}
            maxLength={10}
            onChange={registrationFormDataUpdate}
         />
         <span className="placeholder-immitator">
            {currentLanguage === "ru" ? "Введите Ваш никнейм" : "Enter your nickname"}
         </span>
         <div className="line"></div>
      </label>
      <label htmlFor="password-input">
         <input
            type="password"
            id="password-input"
            name="password"
            placeholder={currentLanguage === "ru" ? "Введите Ваш пароль" : "Enter your password"}
            title={currentLanguage === "ru" ? "Введите Ваш пароль" : "Enter your password"}
            required
            autoComplete="off"
            minLength={8}
            maxLength={255}
            onChange={registrationFormDataUpdate}
         />
         <span className="placeholder-immitator">
            {currentLanguage === "ru" ? "Введите Ваш пароль" : "Enter your password"}
         </span>
         <div className="line"></div>
      </label>
      <label htmlFor="password-confirm-input">
         <input
            type="password"
            id="password-confirm-input"
            placeholder={currentLanguage === "ru" ? "Подтвердите Ваш пароль" : "Confirm your password"}
            title={currentLanguage === "ru" ? "Подтвердите Ваш пароль" : "Confirm your password"}
            required
            autoComplete="off"
            minLength={8}
            maxLength={255}
            ref={confirmPasswordInput}
         />
         <span className="placeholder-immitator">
            {currentLanguage === "ru" ? "Подтвердите Ваш пароль" : "Confirm your password"}
         </span>
         <div className="line"></div>
      </label>

      <div className="buttons">
         <button
            type="button"
            className="loginpage-enter-button"
            disabled={authStatus === "loading"}
            onClick={loginPageEnter}
         >{currentLanguage === "ru" ? "Назад" : "Back"}</button>
         <button
            type="submit"
            className={authStatus === "loading"
               ? currentLanguage === "ru"
                  ? "register-button active ru"
                  : "register-button active"
               : currentLanguage === "ru"
                  ? "register-button ru"
                  : "register-button "}
            disabled={authStatus === "loading"}
         >{currentLanguage === "ru" ? "Зарегистрироваться" : "Register"}</button>
      </div>

      <AuthMessage />
   </form>
}