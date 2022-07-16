import { FC, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   getBrandsAsync,
   getProductsBrands,
   TypeOrBrandObject,
   createBrandAsync,
   deleteBrandAsync,
   DeleteBrandRequestObject,
   updateBrandAsync,
   UpdateBrandRequestObject
} from "../../../app/productSlice";
import { getAdminEditingType } from "../../../app/shopSlice";
import { getToken } from "../../../app/userSlice";
import { getCurrentLanguage } from "../../../app/globalSlice";
import { CRUDModeSwitcher } from "../CRUDModeSwitcher/CRUDModeSwitcher";
import "./BrandsManagement.scss"

export const BrandsManagement: FC = () => {
   const brandNameInput: any = useRef(null)

   const dispatch = useAppDispatch()

   const productsBrands: TypeOrBrandObject[] = useAppSelector(getProductsBrands)
   const token: string | null = useAppSelector(getToken)
   const adminEditingType: string = useAppSelector(getAdminEditingType)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const [brandName, setBrandName]: any = useState("")
   const [brandId, setBrandId]: any = useState(null)
   const [updatingMode, setUpdatingMode]: any = useState(false)
   const [brandNameInputDefaultValue, setBrandNameInputDefaultValue]: any = useState("")

   const brandNameHandler = (event: any) => {
      setBrandName(event.target.value)
   }

   const updatingModeHandler = (id: number, name: string) => {
      if (updatingMode && (brandId === String(id))) {
         setUpdatingMode(false)
         setBrandId(null)
         brandNameInput.current.value = ""
      } else {
         if (brandNameInput.current) {
            brandNameInput.current.value = name
         }
         setBrandNameInputDefaultValue(name)
         setUpdatingMode(true)
         setBrandId(String(id))
      }
   }

   const updatingModeOff = () => {
      setUpdatingMode(false)
      setBrandId(null)
      setBrandNameInputDefaultValue("")
   }

   const productsBrandAdd = (event: any) => {
      event.preventDefault()
      const newBrandName = brandNameInput.current.value
      if (!newBrandName) return
      if (productsBrands.some((type) => type.name === newBrandName)) return

      brandNameInput.current.value = ""
      dispatch(createBrandAsync({ data: { name: brandName }, token: token }))
   }

   const productsBrandUpdate = (event: any) => {
      event.preventDefault()
      if (!brandNameInput.current.value) return
      const data: UpdateBrandRequestObject = {
         data: { name: brandName, lang: currentLanguage },
         token: token,
         brandId: brandId
      }
      dispatch(updateBrandAsync(data))
   }

   const productsBrandDelete = (id: number) => {
      const data: DeleteBrandRequestObject = { id: String(id), token: token, lang: currentLanguage }
      dispatch(deleteBrandAsync(data))
   }

   const sortBrandsMethod = (previous: TypeOrBrandObject, next: TypeOrBrandObject) => {
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
      setBrandId(null)
      dispatch(getBrandsAsync())
   }, [adminEditingType])

   useEffect(() => {
      dispatch(getBrandsAsync())
   }, [])
   return <div className="brands-management-wrapper">
      <CRUDModeSwitcher />

      {adminEditingType === "read" &&
         <div className="management-items-wrapper">
            {[...productsBrands].sort(sortBrandsMethod).map((brand: TypeOrBrandObject) => {
               return <div className="management-item" key={brand.id}><span>{brand.name}</span></div>
            })}
         </div>}

      {adminEditingType === "create" &&
         <>
            <form className="brand-management-form" onSubmit={productsBrandAdd}>
               <input
                  type="text"
                  placeholder={currentLanguage === "ru" ? "Введите новое имя бренда" : "Enter new brand name"}
                  autoFocus
                  onChange={brandNameHandler}
                  ref={brandNameInput} />

               <div className="buttons">
                  <button type="submit" className="add-button">{currentLanguage === "ru"
                     ? "Добавить" : "Add"}</button>
                  <button type="reset" className="reset-button">{currentLanguage === "ru"
                     ? "Очистить" : "Clear"}</button>
               </div>
            </form>

            <div className="management-items-wrapper">
               {[...productsBrands].sort(sortBrandsMethod).map((brand: TypeOrBrandObject) => {
                  return <div className="management-item" key={brand.id}><span>{brand.name}</span></div>
               })}
            </div>
         </>}

      {adminEditingType === "update" &&
         <>
            {updatingMode && <form className="brand-management-form" onSubmit={productsBrandUpdate}>
               <input
                  type="text"
                  placeholder={currentLanguage === "ru" ? "Введите новое имя бренда" : "Enter new brand name"}
                  autoFocus
                  defaultValue={brandNameInputDefaultValue}
                  onChange={brandNameHandler}
                  ref={brandNameInput} />

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
               {[...productsBrands].sort(sortBrandsMethod).map((brand: TypeOrBrandObject) => {
                  return <div className="management-item" key={brand.id}>
                     <span>{brand.name}</span>
                     <button
                        type="button"
                        className={brandId === String(brand.id) ? "update-button active" : "update-button"}
                        onClick={() => updatingModeHandler(brand.id, brand.name)}>
                        {brandId === String(brand.id)
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
            {[...productsBrands].sort(sortBrandsMethod).map((brand: TypeOrBrandObject) => {
               return <div className="management-item" key={brand.id}>
                  <span>{brand.name}</span>
                  <button type="button" className="delete-button" onClick={() => productsBrandDelete(brand.id)}>
                     {currentLanguage === "ru"
                        ? "удалить" : "delete"}
                  </button>
               </div>
            })}
         </div>}
   </div>
}