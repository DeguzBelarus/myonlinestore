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
            return dispatch(setAuthMessage("The minimum nickname length is 2 characters"))
         case registrationFormData.nickname.length > 10:
            return dispatch(setAuthMessage("The maximum nickname length is 10 characters"))
         case registrationFormData.password.length < 8:
            return dispatch(setAuthMessage("The minimum password length is 8 characters"))
         case registrationFormData.password.length > 255:
            return dispatch(setAuthMessage("The maximum password length is 255 characters"))
         case registrationFormData.password !== confirmPasswordInput.current.value:
            return dispatch(setAuthMessage("Passwords don't match"))
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
   return <form id="registration-form" onSubmit={registrationSubmit}>
      <h2 className="registration-email-header">Registration:</h2>
      <p className="heading-paragraph">{registrationEmail}</p>

      <label htmlFor="nickname-input">
         <input
            type="text"
            id="nickname-input"
            name="nickname"
            placeholder="Enter your nickname"
            title="Enter your nickname"
            required
            autoFocus
            autoComplete="off"
            minLength={2}
            maxLength={10}
            onChange={registrationFormDataUpdate}
         />
         <span className="placeholder-immitator">Enter your nickname</span>
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
            maxLength={255}
            onChange={registrationFormDataUpdate}
         />
         <span className="placeholder-immitator">Enter your password</span>
         <div className="line"></div>
      </label>
      <label htmlFor="password-confirm-input">
         <input
            type="password"
            id="password-confirm-input"
            placeholder="Confirm your password"
            title="Confirm your password"
            required
            autoComplete="off"
            minLength={8}
            maxLength={255}
            ref={confirmPasswordInput}
         />
         <span className="placeholder-immitator">Confirm your password</span>
         <div className="line"></div>
      </label>

      <div className="buttons">
         <button
            type="button"
            className="loginpage-enter-button"
            disabled={authStatus === "loading"}
            onClick={loginPageEnter}
         >Back</button>
         <button
            type="submit"
            className={authStatus === "loading" ? "register-button active" : "register-button"}
            disabled={authStatus === "loading"}
         >Register</button>
      </div>

      <AuthMessage />
   </form>
}