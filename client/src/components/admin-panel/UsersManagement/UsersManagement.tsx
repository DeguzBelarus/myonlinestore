import { FC } from "react";

import { CRUDModeSwitcher } from "../CRUDModeSwitcher/CRUDModeSwitcher";
import "./UsersManagement.scss"

export const UsersManagement: FC = () => {
   return <div className="users-management-wrapper">
      <CRUDModeSwitcher />
   </div>
}