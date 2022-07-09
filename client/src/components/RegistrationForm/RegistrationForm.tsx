import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./RegistrationForm.scss"

interface Props {
   isAuth: boolean,
   previousRoute: string
}

export const RegistrationForm: FC<Props> = ({ isAuth, previousRoute }) => {
   const navigate = useNavigate()

   useEffect(() => {
      if (isAuth) {
         navigate(previousRoute)
      }
   }, [isAuth])
   return <form
      className="registration-form"
   ></form>
}