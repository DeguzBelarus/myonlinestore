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
import "./NavBar.scss"

export const NavBar: FC = () => {
   const navigate = useNavigate()
   const dispatch = useAppDispatch()

   const isAuth = useAppSelector(getIsAuth)
   const userRole = useAppSelector(getUserRole)
   const selectionMode = useAppSelector(getSelectionMode)
   const shopPageIsActive = useAppSelector(getShopPageIsActive)
   const cartPageIsActive = useAppSelector(getCartPageIsActive)
   const authorizationPageIsActive = useAppSelector(getAuthorizationPageIsActive)
   const adminPanelPageIsActive = useAppSelector(getAdminPanelPageIsActive)
   const productPageIsActive = useAppSelector(getProductPageIsActive)
   const routeId = useAppSelector(getRouteId)

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
            dispatch(setPreviousRoute("/shop"))
            break
         case adminPanelPageIsActive:
            dispatch(setPreviousRoute("/admin"))
            break
         case productPageIsActive:
            dispatch(setPreviousRoute(`/shop/product/${routeId}`))
            break
         case cartPageIsActive:
            dispatch(setPreviousRoute("/shop/cart"))
            break
      }
   }

   const AdminPanelPageEnter = () => {
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
         >MyOnlineStore</Link>
         {shopPageIsActive &&
            <button
               type="button"
               className="selection-mode-button"
               onClick={selectionModeHandler}
            >Choose Products
            </button>}
      </div>
      <div className="navbar-buttons-wrapper">
         {!isAuth
            ? <>{!authorizationPageIsActive &&
               <button
                  type="button"
                  className="authorization-page-button"
                  onClick={loginPageEnter}
               >Authorization</button>}
            </>
            : userRole === "ADMIN"
               ? <>
                  {!adminPanelPageIsActive &&
                     <button
                        type="button"
                        className="adminpanel-page-button"
                        onClick={AdminPanelPageEnter}
                     >Admin Panel</button>}
                  <button
                     type="button"
                     className="logout-button"
                     onClick={logout}
                  >Logout</button>
               </>
               : <>
                  <button
                     type="button"
                     className="logout-button"
                     onClick={logout}
                  >Logout</button>
               </>}
      </div>
      {shopPageIsActive &&
         <div className={!selectionMode ? "navbar-selection-bar" : "navbar-selection-bar active"}></div>}
   </div>
}