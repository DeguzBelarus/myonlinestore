import { FC, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { getAuthStatus, setRegistrationEmail, setAuthMessage, loginAsync, getAuthMessage } from "../../app/userSlice";
import { getCurrentLanguage } from "../../app/globalSlice";
import { StayLoggedIn } from "../StayLoggedIn/StayLoggedIn";
import "./LoginForm.scss"

interface Props {
   isAuth: boolean,
   previousRoute: string
}

export const LoginForm: FC<Props> = ({ isAuth, previousRoute }) => {
   const registrationEmailInput: any = useRef(null)

   const dispatch = useAppDispatch()
   const navigate = useNavigate()

   const authMessage: string = useAppSelector(getAuthMessage)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const authStatus: string = useAppSelector(getAuthStatus)
   const [loginFormData, setloginFormData]: any = useState({
      email: "", password: "", lang: currentLanguage
   })
   const [registrationEmail, setRegistrationEmailLocal]: any = useState("")

   const loginFormDataUpdate = (event: any) => {
      setloginFormData({ ...loginFormData, [event.target.name]: event.target.value })
   }

   const registrationEmailUpdate = (event: any) => {
      setRegistrationEmailLocal(event.target.value)
   }

   const registrationPageEnter = () => {
      if (!registrationEmail) return
      if (registrationEmail.length < 8 ||
         !registrationEmail.includes("@") ||
         !registrationEmail.includes(".") ||
         registrationEmail.length > 254) {
         return dispatch(setAuthMessage("The specified email is incorrect"))
      }

      registrationEmailInput.current.value = ""
      dispatch(setRegistrationEmail(registrationEmail))
      navigate("/registration")
   }

   const registrationPageEnterKey = (event: any) => {
      if (event.key === "Enter") {
         if (!registrationEmail) return
         if (registrationEmail.length < 8 ||
            !registrationEmail.includes("@") ||
            !registrationEmail.includes(".") ||
            registrationEmail.length > 254) {
            return dispatch(setAuthMessage("The specified email is incorrect"))
         }

         registrationEmailInput.current.value = ""
         dispatch(setRegistrationEmail(registrationEmail))
         navigate("/registration")
      }
   }

   const loginSubmit = (event: any) => {
      event.preventDefault()
      if (loginFormData.email.length < 8 ||
         !loginFormData.email.includes("@") ||
         !loginFormData.email.includes(".") ||
         loginFormData.email.length > 254) {
         return dispatch(setAuthMessage("The specified email is incorrect"))
      }
      if (loginFormData.password.length < 8) {
         return dispatch(setAuthMessage("The minimum password length is 8 characters"))
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
            placeholder="Enter your email"
            title="Enter your email"
            required
            autoFocus
            autoComplete="off"
            minLength={8}
            maxLength={254}
            onChange={loginFormDataUpdate}
         />
         <span className="placeholder-immitator">Enter your email</span>
         <div className="line"></div>
      </label>
      <label htmlFor="password-input">
         <input
            type="password"
            id="password-input"
            name="password"
            placeholder="Enter your password"
            title="Enter your password"
            required
            autoComplete="off"
            minLength={8}
            maxLength={254}
            onChange={loginFormDataUpdate}
         />
         <span className="placeholder-immitator">Enter your password</span>
         <div className="line"></div>
      </label>
      <div className="buttons">
         <button
            type="submit"
            className={authStatus === "loading" ? "login-button active" : "login-button"}
            disabled={authStatus === "loading"}
         >Login</button>
         <button
            type="button"
            className="registration-button"
            disabled={authStatus === "loading"}
            onClick={registrationPageEnter}
         >Registration</button>
         <StayLoggedIn />
      </div>
      <label
         htmlFor="registration-email-input"
         className="registration-email-label">
         <input
            type="email"
            id="registration-email-input"
            name="registration-email"
            placeholder="Enter registration email"
            title="Enter registration email"
            autoComplete="off"
            minLength={8}
            maxLength={254}
            onChange={registrationEmailUpdate}
            onKeyDown={registrationPageEnterKey}
            ref={registrationEmailInput}
            form="off"
         />
      </label>
      <div
         className={authMessage
            ? "message-container active"
            : "message-container"}>
         <p className="message-paragraph">{authMessage}</p>
      </div>
   </form >
}