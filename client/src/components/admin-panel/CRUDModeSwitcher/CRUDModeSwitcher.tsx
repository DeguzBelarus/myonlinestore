import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { getProductStatus } from "../../../app/productSlice";
import { getCurrentLanguage } from "../../../app/globalSlice";
import { setAdminEditingType, getAdminEditingType } from "../../../app/shopSlice";
import "./CRUDModeSwitcher.scss"

export const CRUDModeSwitcher: FC = () => {
   const dispatch = useAppDispatch()

   const adminEditingType: string = useAppSelector(getAdminEditingType)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const productStatus: string = useAppSelector(getProductStatus)

   const setAdminEditingTypeRead = () => {
      dispatch(setAdminEditingType("read"))
   }

   const setAdminEditingTypeCreate = () => {
      dispatch(setAdminEditingType("create"))
   }

   const setAdminEditingTypeUpdate = () => {
      dispatch(setAdminEditingType("update"))
   }

   const setAdminEditingTypeDelete = () => {
      dispatch(setAdminEditingType("delete"))
   }

   return <div className="crud-mode-switcher-wrapper">
      <div className={adminEditingType === "read" ? "crud-mode-button active" : "crud-mode-button"}
         onClick={setAdminEditingTypeRead}>
         <span className="crud-mode-span">
            {adminEditingType === "read" && productStatus === "loading"
               ? "..."
               : currentLanguage === "ru"
                  ? "Просмотр"
                  : "View"}
         </span>
      </div>
      <div className={adminEditingType === "create" ? "crud-mode-button active" : "crud-mode-button"}
         onClick={setAdminEditingTypeCreate}>
         <span className="crud-mode-span">
            {adminEditingType === "create" && productStatus === "loading"
               ? "..."
               : currentLanguage === "ru"
                  ? "Добавить"
                  : "Add"}
         </span>
      </div>
      <div className={adminEditingType === "update" ? "crud-mode-button active" : "crud-mode-button"}
         onClick={setAdminEditingTypeUpdate}>
         <span className="crud-mode-span">
            {adminEditingType === "update" && productStatus === "loading"
               ? "..."
               : currentLanguage === "ru"
                  ? "Изменить"
                  : "Edit"}
         </span>
      </div>
      <div className={adminEditingType === "delete" ? "crud-mode-button active" : "crud-mode-button"}
         onClick={setAdminEditingTypeDelete}>
         <span className="crud-mode-span">
            {adminEditingType === "delete" && productStatus === "loading"
               ? "..."
               : currentLanguage === "ru"
                  ? "Удалить"
                  : "Delete"}
         </span>
      </div>
   </div>
}