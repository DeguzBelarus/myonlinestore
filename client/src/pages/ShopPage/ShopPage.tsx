import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
   getProductsAsync,
   getAllProducts,
   GetProductsQueryParams,
   CurrentProduct,
   getProductStatus,
   getBrandsAsync,
   getTypesAsync,
   setProducts
} from "../../app/productSlice";
import {
   setShopPageIsActive,
   setSelectionMode,
   getCurrentPage,
   getProductsPerPage,
   getSelectedType,
   getSelectedBrand
} from "../../app/shopSlice";
import { getCurrentLanguage, setCurrentLanguage } from "../../app/globalSlice";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { PagesBar } from "../../components/PagesBar/PagesBar";
import { ShopLoader } from "../../components/shop/ShopLoader/ShopLoader";
import "./ShopPage.scss"

export const ShopPage: FC = () => {
   const navigate = useNavigate()
   const dispatch = useAppDispatch()

   const allProducts = useAppSelector(getAllProducts)
   const productStatus: string = useAppSelector(getProductStatus)
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

   const productsSortMethod = (prevProduct: CurrentProduct, nextProduct: CurrentProduct) => {
      switch (true) {
         case prevProduct.name > nextProduct.name:
            return 1
         case prevProduct.name < nextProduct.name:
            return -1
         default:
            return 0
      }
   }

   useEffect(() => {
      document.title = currentLanguage === "ru" ? "MyOnlineStore: Главная страница" : "MyOnlineStore: Main page"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
   }, [currentLanguage])

   useEffect(() => {
      dispatch(setProducts([]))
      dispatch(getProductsAsync(getProductsQueryParams))
   }, [currentPage, productsPerPage, selectedType, selectedBrand])

   useEffect(() => {
      dispatch(getTypesAsync())
      dispatch(getBrandsAsync())
      dispatch(setShopPageIsActive(true))
      navigate("/shop")

      if (navigator.language !== "ru" && navigator.language !== "ru-RU") {
         dispatch(setCurrentLanguage("en"))
      }

      return () => {
         dispatch(setShopPageIsActive(false))
         dispatch(setSelectionMode(false))
      }
   }, [])
   return <div className="shop-page-wrapper">
      <div className={productStatus === "loading"
         ? "products-cards-wrapper loading"
         : "products-cards-wrapper"}>
         {productStatus !== "loading"
            ? [...allProducts].sort(productsSortMethod).map((product: CurrentProduct) => {
               return <ProductCard productData={product} key={product.id} />
            })
            : <ShopLoader />}
      </div>
      <PagesBar />
   </div>
}