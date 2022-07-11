import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getIsStayLoggedIn, setIsStayLoggedIn, getAuthStatus } from "../../app/userSlice";
import { getCurrentLanguage } from "../../app/globalSlice";
import "./StayLoggedIn.scss"

export const StayLoggedIn: FC = () => {
   const dispatch = useAppDispatch()

   const isStayLoggedIn: boolean = useAppSelector(getIsStayLoggedIn)
   const authStatus: string = useAppSelector(getAuthStatus)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)

   const isStayLoggedInHandler = () => {
      if (authStatus === "loading") return
      dispatch(setIsStayLoggedIn())
   }

   return <div className="stay-logged-in-wrapper">
      <div className="checkbox">
         <input
            type="checkbox"
            id="stay-logged-in-checkbox"
            title={currentLanguage === "ru" ? "Сохранить вход" : "Stay logged in"}
            disabled={authStatus === "loading"}
            defaultChecked={isStayLoggedIn} />
         <label
            htmlFor="stay-logged-in-checkbox"
            onClick={isStayLoggedInHandler}>{currentLanguage === "ru" ? "Сохранить вход" : "Stay logged in"}</label>
      </div>
   </div>
}