import { FC, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   getTypesAsync,
   getProductsTypes,
   TypeOrBrandObject,
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

   const productsTypes: TypeOrBrandObject[] = useAppSelector(getProductsTypes)
   const token: string | null = useAppSelector(getToken)
   const adminEditingType: string = useAppSelector(getAdminEditingType)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const [typeName, setTypeName]: any = useState("")
   const [typeId, setTypeId]: any = useState(null)
   const [updatingMode, setUpdatingMode]: any = useState(false)
   const [typeNameInputDefaultValue, setTypeNameInputDefaultValue]: any = useState("")

   const typeNameHandler = (event: any) => {
      setTypeName(event.target.value)
   }

   const updatingModeHandler = (id: number, name: string) => {
      if (updatingMode && (typeId === String(id))) {
         setUpdatingMode(false)
         setTypeId(null)
         typeNameInput.current.value = ""
      } else {
         if (typeNameInput.current) {
            typeNameInput.current.value = name
         }
         setTypeNameInputDefaultValue(name)
         setTypeName(name)
         setUpdatingMode(true)
         setTypeId(String(id))
      }
   }

   const updatingModeOff = () => {
      setUpdatingMode(false)
      setTypeId(null)
      setTypeNameInputDefaultValue("")
   }

   const updatingModeOffOnEscape = (event: any) => {
      if (event.key === "Escape") {
         updatingModeOff()
      }
   }

   const productsTypeAdd = (event: any) => {
      event.preventDefault()
      const newTypeName = typeNameInput.current.value
      if (!typeName || !newTypeName) return
      if (productsTypes.some((type) => type.name === newTypeName)) return

      typeNameInput.current.value = ""
      dispatch(createTypeAsync({ data: { name: typeName }, token: token }))
   }

   const productsTypeUpdate = (event: any) => {
      event.preventDefault()
      const newTypeName = typeNameInput.current.value
      if (!typeName || !newTypeName) return
      if (productsTypes.some((type) => type.name === newTypeName)) return

      const data: UpdateTypeRequestObject = {
         data: { name: typeName, lang: currentLanguage },
         token: token,
         typeId: typeId
      }
      dispatch(updateTypeAsync(data))
   }

   const productsTypeDelete = (id: number) => {
      const data: DeleteTypeRequestObject = { id: String(id), token: token, lang: currentLanguage }
      dispatch(deleteTypeAsync(data))
   }

   const sortTypesMethod = (previous: TypeOrBrandObject, next: TypeOrBrandObject) => {
      switch (true) {
         case previous.name > next.name:
            return 1
         case previous.name < next.name:
            return -1
         default:
            return 0
      }
   }

   useEffect(() => {
      setUpdatingMode(false)
      setTypeId(null)
      dispatch(getTypesAsync())
   }, [adminEditingType])

   useEffect(() => {
      document.body.addEventListener("keydown", updatingModeOffOnEscape)
   }, [])
   return <div className="types-management-wrapper">
      <CRUDModeSwitcher type="othermanagement" />

      {adminEditingType === "read" &&
         <div className="management-items-wrapper">
            {[...productsTypes].sort(sortTypesMethod).map((type: TypeOrBrandObject) => {
               return <div className="management-item" key={type.id}><span>{type.name}</span></div>
            })}
         </div>}

      {adminEditingType === "create" &&
         <>
            <form className="type-management-form" onSubmit={productsTypeAdd}>
               <input
                  type="text"
                  placeholder={currentLanguage === "ru" ? "Введите новое название типа" : "Enter a new type name"}
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
               {[...productsTypes].sort(sortTypesMethod).map((type: TypeOrBrandObject) => {
                  return <div className="management-item" key={type.id}><span>{type.name}</span></div>
               })}
            </div>
         </>}

      {adminEditingType === "update" &&
         <>
            {updatingMode && <form className="type-management-form" onSubmit={productsTypeUpdate}>
               <input
                  type="text"
                  placeholder={currentLanguage === "ru" ? "Введите новое название типа" : "Enter a new type name"}
                  autoFocus
                  defaultValue={typeNameInputDefaultValue}
                  onChange={typeNameHandler}
                  ref={typeNameInput} />

               <div className="buttons">
                  <button type="submit" className="change-button">{currentLanguage === "ru"
                     ? "Изменить" : "Change"}</button>
                  <button type="reset" className="reset-button">{currentLanguage === "ru"
                     ? "Очистить" : "Clear"}</button>
                  <button type="button" className="close-button" onClick={updatingModeOff}>&times;</button>
               </div>
            </form>
            }

            <div className="management-items-wrapper">
               {[...productsTypes].sort(sortTypesMethod).map((type: TypeOrBrandObject) => {
                  return <div className="management-item" key={type.id}>
                     <span>{type.name}</span>
                     <button
                        type="button"
                        className={typeId === String(type.id) ? "update-button active" : "update-button"}
                        onClick={() => updatingModeHandler(type.id, type.name)}>
                        {typeId === String(type.id)
                           ? "..."
                           : currentLanguage === "ru"
                              ? "изменить"
                              : "change"}
                     </button>
                  </div>
               })}
            </div>
         </>}

      {adminEditingType === "delete" &&
         <div className="management-items-wrapper">
            {[...productsTypes].sort(sortTypesMethod).map((type: TypeOrBrandObject) => {
               return <div className="management-item" key={type.id}>
                  <span>{type.name}</span>
                  <button type="button" className="delete-button" onClick={() => productsTypeDelete(type.id)}>
                     {currentLanguage === "ru"
                        ? "удалить" : "delete"}
                  </button>
               </div>
            })}
         </div>}
   </div>
}