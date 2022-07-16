import { FC, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   getTypesAsync,
   getProductsTypes,
   ManagementItem,
   createTypeAsync,
   deleteTypeAsync,
   DeleteTypeRequestObject,
   updateTypeAsync,
   UpdateTypeRequestObject
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
   const [typeId, setTypeId]: any = useState(null)
   const [updatingMode, setupdatingMode]: any = useState(false)

   const typeNameHandler = (event: any) => {
      setTypeName(event.target.value)
   }

   const updatingModeHandler = (id: number) => {
      if (updatingMode && (typeId === String(id))) {
         setupdatingMode(false)
         setTypeId(null)
      } else {
         setupdatingMode(true)
         setTypeId(String(id))
      }
   }

   const productsTypeDelete = (id: number) => {
      const data: DeleteTypeRequestObject = { id: String(id), token: token, lang: currentLanguage }
      dispatch(deleteTypeAsync(data))
   }

   const productsTypeAdd = (event: any) => {
      event.preventDefault()
      const newTypeName = typeNameInput.current.value
      if (!newTypeName) return
      if (productsTypes.some((type) => type.name === newTypeName)) return

      typeNameInput.current.value = ""
      dispatch(createTypeAsync({ data: { name: typeName }, token: token }))
   }

   const productsTypeUpdate = (event: any) => {
      event.preventDefault()
      if (!typeNameInput.current.value) return
      typeNameInput.current.value = ""
      const data: UpdateTypeRequestObject = {
         data: { name: typeName, lang: currentLanguage },
         token: token,
         typeId: typeId
      }
      dispatch(updateTypeAsync(data))
   }

   useEffect(() => {
      setupdatingMode(false)
      setTypeId(null)
      dispatch(getTypesAsync())
   }, [adminEditingType])

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
         <>
            <form className="type-management-form" onSubmit={productsTypeAdd}>
               <input
                  type="text"
                  placeholder={currentLanguage === "ru" ? "Введите новое имя типа" : "Enter new type name"}
                  autoFocus
                  onChange={typeNameHandler}
                  ref={typeNameInput} />
               <div className="buttons">
                  <button type="submit" className="add-button">{currentLanguage === "ru"
                     ? "Добавить" : "Add"}</button>
                  <button type="reset" className="reset-button">{currentLanguage === "ru"
                     ? "Очистить" : "Clear"}</button>
               </div>
            </form>

            <div className="management-items-wrapper">
               {productsTypes.map((type: ManagementItem) => {
                  return <div className="management-item" key={type.id}><span>{type.name}</span></div>
               })}
            </div>
         </>
      }
      {adminEditingType === "update" &&
         <>
            {updatingMode && <form className="type-management-form" onSubmit={productsTypeUpdate}>
               <input
                  type="text"
                  placeholder={currentLanguage === "ru" ? "Введите новое имя типа" : "Enter new type name"}
                  autoFocus
                  onChange={typeNameHandler}
                  ref={typeNameInput} />
               <div className="buttons">
                  <button type="submit" className="change-button">{currentLanguage === "ru"
                     ? "Изменить" : "Change"}</button>
                  <button type="reset" className="reset-button">{currentLanguage === "ru"
                     ? "Очистить" : "Clear"}</button>
                  <button type="button" className="close-button" onClick={() => updatingModeHandler(typeId)}>X</button>
               </div>
            </form>
            }

            <div className="management-items-wrapper">
               {productsTypes.map((type: ManagementItem) => {
                  return <div className="management-item" key={type.id}>
                     <span>{type.name}</span>
                     <button
                        type="button"
                        className={typeId === String(type.id) ? "update-button active" : "update-button"}
                        onClick={() => updatingModeHandler(type.id)}>
                        {typeId === String(type.id)
                           ? "..."
                           : currentLanguage === "ru"
                              ? "изменить"
                              : "change"}
                     </button>
                  </div>
               })}
            </div>
         </>
      }
      {adminEditingType === "delete" &&
         <div className="management-items-wrapper">
            {productsTypes.map((type: ManagementItem) => {
               return <div className="management-item" key={type.id}>
                  <span>{type.name}</span>
                  <button type="button" className="delete-button" onClick={() => productsTypeDelete(type.id)}>X</button>
               </div>
            })}
         </div>}
   </div>
}