import { FC } from "react";

import { CRUDModeSwitcher } from "../CRUDModeSwitcher/CRUDModeSwitcher";
import "./ProductsManagement.scss"

export const ProductsManagement: FC = () => {
   return <div className="products-management-wrapper">
      <CRUDModeSwitcher />
   </div>
}