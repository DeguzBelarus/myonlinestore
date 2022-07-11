import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { setShopPageIsActive, setSelectionMode } from "../../app/shopSlice";
import { getCurrentLanguage, setCurrentLanguage } from "../../app/globalSlice";
import "./ShopPage.scss"

export const ShopPage: FC = () => {
   const navigate = useNavigate()
   const dispatch = useAppDispatch()

   const currentLanguage: string = useAppSelector(getCurrentLanguage)

   useEffect(() => {

   }, [currentLanguage])

   useEffect(() => {
      dispatch(setShopPageIsActive(true))
      navigate("/shop")

      if (navigator.language !== "ru" && navigator.language !== "ru-RU") {
         dispatch(setCurrentLanguage("en"))
      }

      document.title = currentLanguage === "ru" ? "MyOnlineStore: Главная страница" : "MyOnlineStore: Main page"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"

      return () => {
         dispatch(setShopPageIsActive(false))
         dispatch(setSelectionMode(false))
      }
   }, [])
   return <div className="shop-page-wrapper"></div>
}