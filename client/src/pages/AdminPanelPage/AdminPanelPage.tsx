import { FC, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";

import { setAdminPanelPageIsActive } from "../../app/shopSlice";
import "./AdminPanelPage.scss"

interface Props {
   type: string
}

export const AdminPanelPage: FC<Props> = ({ type }) => {
   const dispatch = useAppDispatch()

   useEffect(() => {
      dispatch(setAdminPanelPageIsActive(true))

      return () => {
         dispatch(setAdminPanelPageIsActive(false))
      }
   }, [])
   return <div className="admin-panel-wrapper"></div>
}