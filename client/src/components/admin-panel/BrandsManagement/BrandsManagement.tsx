import { FC } from "react";

import { CRUDModeSwitcher } from "../CRUDModeSwitcher/CRUDModeSwitcher";
import "./BrandsManagement.scss"

export const BrandsManagement: FC = () => {
   return <div className="brands-management-wrapper">
      <CRUDModeSwitcher />
   </div>
}