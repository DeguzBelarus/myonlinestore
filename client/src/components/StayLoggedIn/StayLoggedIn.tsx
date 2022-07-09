import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getIsStayLoggedIn, setIsStayLoggedIn, getAuthStatus } from "../../app/userSlice";
import "./StayLoggedIn.scss"

export const StayLoggedIn: FC = () => {
   const dispatch = useAppDispatch()

   const isStayLoggedIn: boolean = useAppSelector(getIsStayLoggedIn)
   const authStatus: string = useAppSelector(getAuthStatus)

   const isStayLoggedInHandler = () => {
      if (authStatus === "loading") return
      dispatch(setIsStayLoggedIn())
   }

   return <div className="stay-logged-in-wrapper">
      <div className="checkbox">
         <input
            type="checkbox"
            id="stay-logged-in-checkbox"
            title="Stay logged in"
            disabled={authStatus === "loading"}
            defaultChecked={isStayLoggedIn} />
         <label
            htmlFor="stay-logged-in-checkbox"
            onClick={isStayLoggedInHandler}>Stay logged in</label>
      </div>
   </div>
}