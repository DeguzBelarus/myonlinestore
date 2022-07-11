import { FC, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getAuthMessage, setAuthMessage, getRegistrationEmail } from "../../app/userSlice";
import "./AuthMessage.scss"

export const AuthMessage: FC = () => {
   const messageWrapper: any = useRef(null)

   const authMessage: string = useAppSelector(getAuthMessage)
   const registrationEmail: string = useAppSelector(getRegistrationEmail)
   const location = window.location.pathname

   useEffect(() => {
      messageWrapper.current.style.transitionDuration = "0s"
   }, [location])

   useEffect(() => {
      if (authMessage) {
         messageWrapper.current.style.transitionDuration = "0.2s"
      }
   }, [authMessage])
   return <div
      className={authMessage
         ? registrationEmail
            ? "message-container active registration-page"
            : "message-container active"
         : "message-container"}
      ref={messageWrapper}>
      <p className="message-paragraph">{authMessage}</p>
   </div>
}