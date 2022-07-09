import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { setAuthorizationPageIsActive, getPreviousRoute } from "../../app/shopSlice";
import { getIsAuth } from "../../app/userSlice";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { RegistrationForm } from "../../components/RegistrationForm/RegistrationForm";
import "./AuthorizationPage.scss"

interface Props {
   type: string
}

export const AuthorizationPage: FC<Props> = ({ type }) => {
   const dispatch = useAppDispatch()

   const isAuth = useAppSelector(getIsAuth)
   const previousRoute = useAppSelector(getPreviousRoute)

   useEffect(() => {
      dispatch(setAuthorizationPageIsActive(true))

      return () => {
         dispatch(setAuthorizationPageIsActive(false))
      }
   }, [])
   return <div className="authorization-page-wrapper">
      {type === "login"
         ? <LoginForm isAuth={isAuth} previousRoute={previousRoute} />
         : <RegistrationForm isAuth={isAuth} previousRoute={previousRoute} />}
   </div>
}