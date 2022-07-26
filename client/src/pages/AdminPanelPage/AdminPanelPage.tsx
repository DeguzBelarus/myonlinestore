import { FC, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";

import { getCurrentLanguage } from "../../app/globalSlice";
import { AdminPanelActions } from "../../components/admin-panel/AdminPanelActions/AdminPanelActions";
import { BrandsManagement } from "../../components/admin-panel/BrandsManagement/BrandsManagement";
import { ProductsManagement } from "../../components/admin-panel/ProductsManagement/ProductsManagement";
import { TypesManagement } from "../../components/admin-panel/TypesManagement/TypesManagement";
import { UsersManagement } from "../../components/admin-panel/UsersManagement/UsersManagement";
import "./AdminPanelPage.scss"

interface Props {
   type: string
}

export const AdminPanelPage: FC<Props> = ({ type }) => {
   const currentLanguage = useAppSelector(getCurrentLanguage)

   useEffect(() => {
      document.title = currentLanguage === "ru" ? "MyOnlineStore: Админ Панель" : "MyOnlineStore: Admin Panel"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
   }, [currentLanguage])
   return <div className="admin-panel-wrapper">
      {type === "general" && <AdminPanelActions />}
      {type === "types" && <TypesManagement />}
      {type === "brands" && <BrandsManagement />}
      {type === "products" && <ProductsManagement />}
      {type === "users" && <UsersManagement />}
   </div>
}