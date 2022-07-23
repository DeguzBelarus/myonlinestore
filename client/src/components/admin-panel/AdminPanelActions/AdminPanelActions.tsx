import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import { getCurrentLanguage } from "../../../app/globalSlice";
import { setAdminEditingType, setAdminPanelPageIsActive } from "../../../app/shopSlice";
import "./AdminPanelActions.scss"

export const AdminPanelActions: FC = () => {
   const navigate = useNavigate()
   const dispatch = useAppDispatch()

   const currentLanguage: string = useAppSelector(getCurrentLanguage)

   const typesManagmentPageEnter = () => {
      navigate("/admin/types")
   }

   const brandsManagmentPageEnter = () => {
      navigate("/admin/brands")
   }

   const productsManagmentPageEnter = () => {
      navigate("/admin/products")
   }

   const usersManagmentPageEnter = () => {
      navigate("/admin/users")
   }

   useEffect(() => {
      dispatch(setAdminEditingType("read"))
      dispatch(setAdminPanelPageIsActive(true))

      return () => {
         dispatch(setAdminPanelPageIsActive(false))
      }
   }, [])

   return <div className="actions-wrapper">
      <button
         type="button"
         className="admin-action-button"
         onClick={typesManagmentPageEnter}>
         {currentLanguage === "ru"
            ? "Управление типами"
            : "Types management"}
      </button>
      <button
         type="button"
         className="admin-action-button"
         onClick={brandsManagmentPageEnter}>
         {currentLanguage === "ru"
            ? "Управление брендами"
            : "Brands management"}
      </button>
      <button
         type="button"
         className="admin-action-button"
         onClick={productsManagmentPageEnter}>
         {currentLanguage === "ru"
            ? "Управление товарами"
            : "Products management"}
      </button>
      <button
         type="button"
         className="admin-action-button"
         onClick={usersManagmentPageEnter}>
         {currentLanguage === "ru"
            ? "Управление пользователями"
            : "Users management"}
      </button>
   </div>
}