import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getCurrentLanguage } from "../../app/globalSlice";
import { setAuthorizationPageIsActive, getPreviousRoute } from "../../app/shopSlice";
import { getIsAuth, setAuthMessage, setAuthStatus } from "../../app/userSlice";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { RegistrationForm } from "../../components/RegistrationForm/RegistrationForm";
import "./AuthorizationPage.scss"

interface Props {
   type: string
}

export const AuthorizationPage: FC<Props> = ({ type }) => {
   const dispatch = useAppDispatch()

   const currentLanguage = useAppSelector(getCurrentLanguage)
   const isAuth = useAppSelector(getIsAuth)
   const previousRoute = useAppSelector(getPreviousRoute)

   useEffect(() => {
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
   }, [currentLanguage])

   useEffect(() => {
      if (type === "login") {
         document.title = currentLanguage === "ru" ? "MyOnlineStore: Авторизация" : "MyOnlineStore: Authorization"
      } else {
         document.title = currentLanguage === "ru" ? "MyOnlineStore: Регистрация" : "MyOnlineStore: Registration"
      }
   }, [type])

   useEffect(() => {
      dispatch(setAuthorizationPageIsActive(true))
      dispatch(setAuthStatus("idle"))
      dispatch(setAuthMessage(""))

      return () => {
         dispatch(setAuthorizationPageIsActive(false))
      }
   }, [])
   return <div className="authorization-page-wrapper">
      {type === "login"
         ? <LoginForm
            isAuth={isAuth}
            previousRoute={previousRoute}
         />
         : <RegistrationForm
            isAuth={isAuth}
            previousRoute={previousRoute}
         />}
   </div>
}