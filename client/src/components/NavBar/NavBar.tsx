import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import {
   getIsAuth,
   getUserRole,
   setIsAuth,
   setUserRole,
   setUserId,
   setUserNickname,
   setToken
} from "../../app/userSlice";
import {
   getSelectionMode,
   setSelectionMode,
   getShopPageIsActive,
   getAuthorizationPageIsActive,
   getAdminPanelPageIsActive,
   getProductPageIsActive,
   getRouteId,
   setPreviousRoute,
   getCartPageIsActive
} from "../../app/shopSlice";
import { getCurrentLanguage } from "../../app/globalSlice";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import mainLogo from "../../assets/main-logo.png"
import "./NavBar.scss"

export const NavBar: FC = () => {
   const navigate = useNavigate()
   const dispatch = useAppDispatch()

   const isAuth: boolean = useAppSelector(getIsAuth)
   const userRole: string = useAppSelector(getUserRole)
   const selectionMode: boolean = useAppSelector(getSelectionMode)
   const shopPageIsActive: boolean = useAppSelector(getShopPageIsActive)
   const cartPageIsActive: boolean = useAppSelector(getCartPageIsActive)
   const authorizationPageIsActive: boolean = useAppSelector(getAuthorizationPageIsActive)
   const adminPanelPageIsActive: boolean = useAppSelector(getAdminPanelPageIsActive)
   const productPageIsActive: boolean = useAppSelector(getProductPageIsActive)
   const routeId: string | null = useAppSelector(getRouteId)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)

   const selectionModeHandler = () => {
      if (!selectionMode) {
         dispatch(setSelectionMode(true))
      } else {
         dispatch(setSelectionMode(false))
      }
   }

   const loginPageEnter = () => {
      navigate("/login")

      switch (true) {
         case shopPageIsActive:
            return dispatch(setPreviousRoute("/shop"))
         case adminPanelPageIsActive:
            return dispatch(setPreviousRoute("/admin"))
         case productPageIsActive:
            return dispatch(setPreviousRoute(`/shop/product/${routeId}`))
         case cartPageIsActive:
            return dispatch(setPreviousRoute("/shop/cart"))
      }
   }

   const adminPanelPageEnter = () => {
      navigate("/admin")
   }

   const logout = () => {
      dispatch(setIsAuth(false))
      dispatch(setToken(null))
      dispatch(setUserRole("USER"))
      dispatch(setUserId(null))
      dispatch(setUserNickname(null))

      if (localStorage.getItem("MyOnlineStoreToken")) {
         localStorage.removeItem("MyOnlineStoreToken")
      }
   }

   return <div className="navbar">
      <div className="navbar-actions-wrapper">
         <Link
            to="/shop"
            className="logo-link"
         >
            <img src={mainLogo} className="main-logo" alt="main logo" />
            MyOnlineStore</Link>
         {shopPageIsActive &&
            <button
               type="button"
               className="selection-mode-button"
               onClick={selectionModeHandler}
            >{currentLanguage === "ru" ? "Выбрать товары" : "Choose Products"}</button>}
      </div>
      <div className="navbar-buttons-wrapper">
         {!isAuth
            ? <>
               <LanguageSwitcher />
               {!authorizationPageIsActive &&
                  <button
                     type="button"
                     className="authorization-page-button"
                     onClick={loginPageEnter}
                  >{currentLanguage === "ru" ? "Авторизация" : "Authorization"}</button>}
            </>
            : userRole === "ADMIN"
               ? <>
                  <LanguageSwitcher />
                  {!adminPanelPageIsActive &&
                     <button
                        type="button"
                        className="adminpanel-page-button"
                        onClick={adminPanelPageEnter}
                     >{currentLanguage === "ru" ? "Админ панель" : "Admin Panel"}</button>}
                  <button
                     type="button"
                     className="logout-button"
                     onClick={logout}
                  >{currentLanguage === "ru" ? "Выйти" : "Logout"}</button>
               </>
               : <>
                  <LanguageSwitcher />
                  <button
                     type="button"
                     className="logout-button"
                     onClick={logout}
                  >{currentLanguage === "ru" ? "Выйти" : "Logout"}</button>
               </>}
      </div>
      {shopPageIsActive &&
         <div className={!selectionMode ? "navbar-selection-bar" : "navbar-selection-bar active"}></div>}
   </div>
}