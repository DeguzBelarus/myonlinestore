import { FC, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";

import { setAdminPanelPageIsActive } from "../../app/shopSlice";
import "./AdminPanelPage.scss"

export const AdminPanelPage: FC = () => {
   const dispatch = useAppDispatch()

   useEffect(() => {
      dispatch(setAdminPanelPageIsActive(true))

      return () => {
         dispatch(setAdminPanelPageIsActive(false))
      }
   }, [])
   return <div className="admin-panel-wrapper"></div>
}