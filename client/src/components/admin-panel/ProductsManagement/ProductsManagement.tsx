import { FC, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   getProductsAsync,
   GetProductsQueryParams,
   getAllProducts,
   CurrentProduct,
   createProductAsync,
   getProductsTypes,
   getProductsBrands,
   TypeOrBrandObject,
   ProductDescriptionObject,
   DeleteProductRequestObject,
   deleteProductAsync,
   NewProduct
} from "../../../app/productSlice";
import {
   getCurrentPage,
   getProductsPerPage,
   getSelectedType,
   getSelectedBrand
} from "../../../app/shopSlice";
import { getAdminEditingType } from "../../../app/shopSlice";
import { getToken } from "../../../app/userSlice";
import { getCurrentLanguage } from "../../../app/globalSlice";
import { CRUDModeSwitcher } from "../CRUDModeSwitcher/CRUDModeSwitcher";
import "./ProductsManagement.scss"

export const ProductsManagement: FC = () => {
   const productNameInput: any = useRef(null)
   const productTypeSelect: any = useRef(null)
   const productBrandSelect: any = useRef(null)
   const productPriceInput: any = useRef(null)
   const productPosterInput: any = useRef(null)

   const dispatch = useAppDispatch()

   const allProducts = useAppSelector(getAllProducts)
   const productsTypes: TypeOrBrandObject[] = useAppSelector(getProductsTypes)
   const productsBrands: TypeOrBrandObject[] = useAppSelector(getProductsBrands)
   const token: string | null = useAppSelector(getToken)
   const adminEditingType: string = useAppSelector(getAdminEditingType)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const currentPage: number = useAppSelector(getCurrentPage)
   const productsPerPage: number = useAppSelector(getProductsPerPage)
   const selectedType: number = useAppSelector(getSelectedType)
   const selectedBrand: number = useAppSelector(getSelectedBrand)
   const getProductsQueryParams: GetProductsQueryParams = {
      limit: productsPerPage,
      page: currentPage,
      typeId: selectedType,
      brandId: selectedBrand
   }
   const [updatingMode, setUpdatingMode] = useState<boolean>(false)
   const [productId, setProductId] = useState<null | number>(null)
   const [productNameInputDefaultValue, setProductNameInputDefaultValue] = useState<string>("")
   const [productTypeSelectDefaultValue, setProductTypeSelectDefaultValue] = useState<string>("")
   const [productBrandSelectDefaultValue, setProductBrandSelectDefaultValue] = useState<string>("")
   const [productPriceInputDefaultValue, setProductPriceInputDefaultValue] = useState<string>("")
   const [productDescription, setProductDescription] = useState<ProductDescriptionObject[]>([])
   const [productFormdata, setProductFormdata] = useState<NewProduct>({
      name: "",
      price: 0,
      rating: 0,
      poster: "",
      productTypeId: 0,
      productBrandId: 0,
      description: productDescription
   })

   const productFormdataUpdate = (event: any) => {
      if (event.target.name === "price"
         || event.target.name === "typeId"
         || event.target.name === "brandId") {
         setProductFormdata({ ...productFormdata, [event.target.name]: Number(event.target.value) })
      } else {
         setProductFormdata({ ...productFormdata, [event.target.name]: event.target.value })
      }
   }

   const productPosterHandler = (event: any) => {
      setProductFormdata({ ...productFormdata, poster: event.target.files[0] })
   }

   // const updatingModeHandler = (id: number, name: string) => {
   //    if (updatingMode && (productId === String(id))) {
   //       // setUpdatingMode(false)
   //       // setBrandId(null)
   //       // brandNameInput.current.value = ""
   //    } else {
   //       // if (brandNameInput.current) {
   //       //    brandNameInput.current.value = name
   //       // }
   //       // setBrandNameInputDefaultValue(name)
   //       // setBrandName(name)
   //       // setUpdatingMode(true)
   //       // setBrandId(String(id))
   //    }
   // }

   const updatingModeOff = () => {
      setUpdatingMode(false)
      setProductId(null)
      setProductNameInputDefaultValue("")
      setProductTypeSelectDefaultValue("")
      setProductBrandSelectDefaultValue("")
      setProductPriceInputDefaultValue("")
   }

   const descriptionAdd = () => {
      setProductDescription([...productDescription, { id: Date.now(), title: "", description: "" }])
   }

   const descriptionRemove = (id: number) => {
      setProductDescription(productDescription.filter((property: ProductDescriptionObject) => {
         return property.id !== id
      }))
   }

   const descriptionUpdate = (key: string, value: string, id: number) => {
      setProductDescription(productDescription.map((property: ProductDescriptionObject) => {
         return property.id === id ? { ...property, [key]: value } : property
      }))
   }

   const productAdd = (event: any) => {
      event.preventDefault()
      if (!productFormdata.name
         || !productFormdata.price
         || !productFormdata.poster
         || !productFormdata.productTypeId
         || !productFormdata.productBrandId) return
      if (allProducts.some((product) => product.name === productFormdata.name)) return

      const bodyFprmdata = new FormData()
      bodyFprmdata.append("name", productFormdata.name)
      bodyFprmdata.append("price", `${productFormdata.price}`)
      bodyFprmdata.append("poster", productFormdata.poster)
      bodyFprmdata.append("productTypeId", `${productFormdata.productTypeId}`)
      bodyFprmdata.append("productBrandId", `${productFormdata.productBrandId}`)
      bodyFprmdata.append("description", JSON.stringify(productDescription))

      productNameInput.current.value = ""
      productTypeSelect.current.value = ""
      productBrandSelect.current.value = ""
      productPriceInput.current.value = ""
      productPosterInput.current.value = null

      dispatch(createProductAsync({ data: bodyFprmdata, token: token }))
      setProductDescription([])
      setProductFormdata({
         name: "",
         price: 0,
         rating: 0,
         poster: "",
         productTypeId: 0,
         productBrandId: 0,
         description: productDescription
      })
   }

   const productDelete = (id: number) => {
      const data: DeleteProductRequestObject = { id: String(id), token: token, lang: currentLanguage }
      dispatch(deleteProductAsync(data))
   }

   const sortProductsMethod = (previous: CurrentProduct, next: CurrentProduct) => {
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
      if (adminEditingType !== "create") {
         dispatch(getProductsAsync(getProductsQueryParams))
      }
   }, [adminEditingType])
   return <div className="products-management-wrapper">
      <CRUDModeSwitcher type="othermanagement" />

      {adminEditingType === "read" &&
         <div className="management-items-wrapper">
            {[...allProducts].sort(sortProductsMethod).map((product: CurrentProduct) => {
               return <div className="management-item" key={product.id}>
                  <span className="product-name-span">{product.name}</span>
                  <span className="product-brand-span">
                     {`${productsBrands[productsBrands.findIndex((brand: TypeOrBrandObject) => brand.id === product.productBrandId)].name}`}
                  </span>
                  <span className="product-type-span">
                     {`${productsTypes[productsTypes.findIndex((type: TypeOrBrandObject) => type.id === product.productTypeId)].name}`}
                  </span>
                  <span className="product-price-span">{product.price} USD</span>
                  <img
                     className="product-poster"
                     src={`/${product.productTypeId}/${product.productBrandId}/${product.name}/${product.poster}`}
                     alt="a product preview" />
               </div>
            })}
         </div>}

      {adminEditingType === "create" &&
         <>
            <form className="product-management-form" onSubmit={productAdd}>
               <input
                  type="text"
                  placeholder={currentLanguage === "ru" ? "Введите название товара" : "Enter a product name"}
                  autoFocus
                  name="name"
                  onChange={productFormdataUpdate}
                  ref={productNameInput} />

               <select
                  title={currentLanguage === "ru" ? "Выберите тип товара" : "Select a product type"}
                  name="productTypeId"
                  onChange={productFormdataUpdate}
                  ref={productTypeSelect}>
                  <option value="">
                     {currentLanguage === "ru"
                        ? " -- Выберите тип товара -- "
                        : " -- Select a product type -- "}
                  </option>
                  {productsTypes.map((type: TypeOrBrandObject) => {
                     return <option value={type.id} key={type.id}>{type.name}</option>
                  })}
               </select>

               <select
                  title={currentLanguage === "ru" ? "Выберите бренд товара" : "Select a product brand"}
                  name="productBrandId"
                  onChange={productFormdataUpdate}
                  ref={productBrandSelect}>
                  <option value="">
                     {currentLanguage === "ru"
                        ? " -- Выберите бренд товара -- "
                        : " -- Select a product brand -- "}
                  </option>
                  {productsBrands.map((brand: TypeOrBrandObject) => {
                     return <option value={brand.id} key={brand.id}>{brand.name}</option>
                  })}
               </select>

               <input
                  type="number"
                  placeholder={currentLanguage === "ru" ? "Введите цену товара" : "Enter a product price"}
                  name="price"
                  onChange={productFormdataUpdate}
                  ref={productPriceInput} />

               <input
                  type="file"
                  className={currentLanguage === "ru" ? "poster-input ru" : "poster-input"}
                  title={currentLanguage === "ru" ? "Выберите постер товара" : "Select a product poster"}
                  name="poster"
                  onChange={productPosterHandler}
                  ref={productPosterInput} />

               <div className="buttons">
                  <button type="submit" className="add-button">{currentLanguage === "ru"
                     ? "Добавить" : "Add"}</button>
                  <button type="reset" className="reset-button">{currentLanguage === "ru"
                     ? "Очистить" : "Clear"}</button>
               </div>
            </form>

            <div className="management-description-wrapper">
               <h4>{currentLanguage === "ru" ? "Описание:" : "Description:"}</h4>
               <button
                  className="add-property-button"
                  onClick={descriptionAdd}>{currentLanguage === "ru"
                     ? "Добавить свойство"
                     : "Add a property:"}</button>
               {[...productDescription].map((description: ProductDescriptionObject) => {
                  return <div className="description-item" key={description.id}>
                     <input
                        type="text"
                        name="title"
                        autoFocus
                        placeholder={currentLanguage === "ru" ? "Его название" : "Its title"}
                        onChange={(event: any) => descriptionUpdate("title", event.target.value, description.id)} />
                     <input
                        type="text"
                        name="description"
                        placeholder={currentLanguage === "ru" ? "Его значение" : "Its value"}
                        onChange={(event: any) => descriptionUpdate("description", event.target.value, description.id)} />
                     <button
                        className="remove-property-button"
                        onClick={() => descriptionRemove(description.id)}>&times;</button>
                  </div>
               })}
            </div>
         </>}

      {adminEditingType === "delete" &&
         <div className="management-items-wrapper">
            {[...allProducts].sort(sortProductsMethod).map((product: CurrentProduct) => {
               return <div className="management-item" key={product.id}>
                  <span className="product-name-span">{product.name}</span>
                  <span className="product-brand-span">
                     {`${productsBrands[productsBrands.findIndex((brand: TypeOrBrandObject) => brand.id === product.productBrandId)].name}`}
                  </span>
                  <span className="product-type-span">
                     {`${productsTypes[productsTypes.findIndex((type: TypeOrBrandObject) => type.id === product.productTypeId)].name}`}
                  </span>
                  <span className="product-price-span">{product.price} USD</span>
                  <img
                     className="product-poster"
                     src={`/${product.productTypeId}/${product.productBrandId}/${product.name}/${product.poster}`}
                     alt="a product preview" />
                  <button type="button" className="delete-button" onClick={() => productDelete(product.id)}>
                     {currentLanguage === "ru"
                        ? "удалить" : "delete"}
                  </button>
               </div>
            })}
         </div>}
   </div>
}