import { FC, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   getTypesAsync,
   getProductsTypes,
   ManagementItem,
   createTypeAsync,
   deleteTypeAsync,
   DeleteRequestObject
} from "../../../app/productSlice";
import { getAdminEditingType } from "../../../app/shopSlice";
import { getToken } from "../../../app/userSlice";
import { getCurrentLanguage } from "../../../app/globalSlice";
import { CRUDModeSwitcher } from "../CRUDModeSwitcher/CRUDModeSwitcher";
import "./TypesManagement.scss"

export const TypesManagement: FC = () => {
   const typeNameInput: any = useRef(null)

   const dispatch = useAppDispatch()

   const productsTypes: ManagementItem[] = useAppSelector(getProductsTypes)
   const token: string | null = useAppSelector(getToken)
   const adminEditingType: string = useAppSelector(getAdminEditingType)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const [typeName, setTypeName]: any = useState("")

   const typeNameHandler = (event: any) => {
      setTypeName(event.target.value)
   }

   const productsTypeDelete = (id: number) => {
      const data: DeleteRequestObject = { id: String(id), token: token, lang: currentLanguage }
      dispatch(deleteTypeAsync(data))
   }

   const productsTypeAdd = (event: any) => {
      event.preventDefault()
      if (!typeNameInput.current.value) return
      typeNameInput.current.value = ""
      dispatch(createTypeAsync({ data: { name: typeName }, token: token }))
   }

   useEffect(() => {
      dispatch(getTypesAsync())
   }, [])
   return <div className="types-management-wrapper">
      <CRUDModeSwitcher />

      {adminEditingType === "read" &&
         <div className="management-items-wrapper">
            {productsTypes.map((type: ManagementItem) => {
               return <div className="management-item" key={type.id}><span>{type.name}</span></div>
            })}
         </div>}
      {adminEditingType === "create" &&
         <form className="type-management-form" onSubmit={productsTypeAdd}>
            <input
               type="text"
               placeholder="Enter new type name"
               onChange={typeNameHandler}
               ref={typeNameInput} />
            <div className="buttons">
               <button type="submit">Add</button>
               <button type="reset">Clear</button>
            </div>

            <div className="management-items-wrapper">
               {productsTypes.map((type: ManagementItem) => {
                  return <div className="management-item" key={type.id}><span>{type.name}</span></div>
               })}
            </div>
         </form>}
      {adminEditingType === "update" &&
         <div className="management-items-wrapper">
            {productsTypes.map((type: ManagementItem) => {
               return <div className="management-item" key={type.id}><span>{type.name}</span></div>
            })}
         </div>}
      {adminEditingType === "delete" &&
         <div className="management-items-wrapper">
            {productsTypes.map((type: ManagementItem) => {
               return <div className="management-item" key={type.id}>
                  <span>{type.name}</span>
                  <button type="button" onClick={() => productsTypeDelete(type.id)}>X</button>
               </div>
            })}
         </div>}
   </div>
}