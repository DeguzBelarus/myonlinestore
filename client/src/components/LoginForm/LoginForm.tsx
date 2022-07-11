import { FC, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import {
   getAuthStatus,
   setRegistrationEmail,
   setAuthMessage,
   loginAsync,
} from "../../app/userSlice";
import { getCurrentLanguage } from "../../app/globalSlice";
import { StayLoggedIn } from "../StayLoggedIn/StayLoggedIn";
import { AuthMessage } from "../AuthMessage/AuthMessage";
import "./LoginForm.scss"

interface Props {
   isAuth: boolean,
   previousRoute: string
}

export const LoginForm: FC<Props> = ({ isAuth, previousRoute }) => {
   const registrationEmailInput: any = useRef(null)

   const dispatch = useAppDispatch()
   const navigate = useNavigate()

   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const authStatus: string = useAppSelector(getAuthStatus)
   const [loginFormData, setLoginFormData]: any = useState({
      email: "", password: "", lang: currentLanguage
   })
   const [registrationEmail, setRegistrationEmailLocal]: any = useState("")

   const loginFormDataUpdate = (event: any) => {
      setLoginFormData({ ...loginFormData, [event.target.name]: event.target.value })
   }

   const registrationEmailUpdate = (event: any) => {
      setRegistrationEmailLocal(event.target.value)
   }

   const registrationPageEnter = () => {
      if (!registrationEmail) return
      if (registrationEmail.length < 8 ||
         !registrationEmail.includes("@") ||
         !registrationEmail.includes(".") ||
         registrationEmail.length > 255) {
         return dispatch(setAuthMessage(currentLanguage === "ru"
            ? "Указанный адрес электронной почты неверный"
            : "The specified email is incorrect"))
      }

      registrationEmailInput.current.value = ""
      dispatch(setRegistrationEmail(registrationEmail))
      navigate("/registration")
      dispatch(setAuthMessage(""))
   }

   const registrationPageEnterKey = (event: any) => {
      if (event.key === "Enter") {
         if (!registrationEmail) return
         if (registrationEmail.length < 8 ||
            !registrationEmail.includes("@") ||
            !registrationEmail.includes(".") ||
            registrationEmail.length > 255) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Указанный адрес электронной почты неверный"
               : "The specified email is incorrect"))
         }

         registrationEmailInput.current.value = ""
         dispatch(setRegistrationEmail(registrationEmail))
         navigate("/registration")
         dispatch(setAuthMessage(""))
      }
   }

   const loginSubmit = (event: any) => {
      event.preventDefault()
      if (loginFormData.email.length < 8 ||
         !loginFormData.email.includes("@") ||
         !loginFormData.email.includes(".") ||
         loginFormData.email.length > 255) {
         return dispatch(setAuthMessage(currentLanguage === "ru"
            ? "Указанный адрес электронной почты неверный"
            : "The specified email is incorrect"))
      }
      if (loginFormData.password.length < 8) {
         return dispatch(setAuthMessage(currentLanguage === "ru"
            ? "Минимальная длина пароля составляет 8 символов"
            : "The minimum password length is 8 characters"))
      }
      if (loginFormData.password.length > 255) {
         return dispatch(setAuthMessage(currentLanguage === "ru"
            ? "Максимальная длина пароля составляет 255 символов"
            : "The maximum password length is 255 characters"))
      }

      dispatch(loginAsync(JSON.stringify(loginFormData)))
   }

   useEffect(() => {
      if (isAuth) {
         navigate(previousRoute)
      }

      return () => {
         dispatch(setAuthMessage(""))
      }
   }, [isAuth])

   return <form id="login-form" onSubmit={loginSubmit} >
      <label htmlFor="email-input">
         <input
            type="email"
            id="email-input"
            name="email"
            placeholder={currentLanguage === "ru" ? "Введите Ваш email" : "Enter your email"}
            title={currentLanguage === "ru" ? "Введите Ваш email" : "Enter your email"}
            pattern="[^@\s]+@[^@\s]+\.[^@\s]{2,4}"
            required
            autoFocus
            autoComplete="off"
            minLength={8}
            maxLength={255}
            onChange={loginFormDataUpdate}
         />
         <span className="placeholder-immitator">{currentLanguage === "ru" ? "Введите Ваш email" : "Enter your email"}</span>
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
            onChange={loginFormDataUpdate}
         />
         <span className="placeholder-immitator">{currentLanguage === "ru" ? "Введите Ваш пароль" : "Enter your password"}</span>
         <div className="line"></div>
      </label>

      <div className="buttons">
         <button
            type="submit"
            className={authStatus === "loading" ? "login-button active" : "login-button"}
            disabled={authStatus === "loading"}
         >{currentLanguage === "ru" ? "Вход" : "Login"}</button>
         <button
            type="button"
            className="registration-button"
            disabled={authStatus === "loading"}
            onClick={registrationPageEnter}
         >{currentLanguage === "ru" ? "Регистрация" : "Registration"}</button>
         <StayLoggedIn />
      </div>
      <label
         htmlFor="registration-email-input"
         className="registration-email-label">
         <input
            type="email"
            id="registration-email-input"
            name="registration-email"
            placeholder={currentLanguage === "ru" ? "Введите регистрационный email" : "Enter registration email"}
            title={currentLanguage === "ru" ? "Введите регистрационный email" : "Enter registration email"}
            pattern="[^@\s]+@[^@\s]+\.[^@\s]{2,4}"
            autoComplete="off"
            minLength={8}
            maxLength={255}
            onChange={registrationEmailUpdate}
            onKeyDown={registrationPageEnterKey}
            ref={registrationEmailInput}
            form="off"
         />
      </label>

      <AuthMessage />
   </form >
}