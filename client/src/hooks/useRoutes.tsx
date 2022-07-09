import { Routes, Route } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

import { getUserRole, getIsAuth } from "../app/userSlice";
import { AuthorizationPage } from "../pages/AuthorizationPage/AuthorizationPage";
import { ShopPage } from "../pages/ShopPage/ShopPage";
import { ProductPage } from "../pages/ProductPage/ProductPage";
import { ShoppingCartPage } from "../pages/ShoppingCartPage/ShoppingCartPage";
import { AdminPanelPage } from "../pages/AdminPanelPage/AdminPanelPage";

export const useRoutes = () => {
   const isAuth: boolean = useAppSelector(getIsAuth)
   const role: string = useAppSelector(getUserRole)

   if (isAuth) {
      if (role === "ADMIN") {
         return <Routes>
            <Route path="admin" element={<AdminPanelPage />}></Route>
            <Route path="shop">
               <Route path="/shop" element={<ShopPage />}></Route>
               <Route path="product/:id" element={<ProductPage />}></Route>
               <Route path="cart" element={<ShoppingCartPage />}></Route>
            </Route>
            <Route path="*" element={<ShopPage />}></Route>
         </Routes>
      }

      return <Routes>
         <Route path="shop">
            <Route path="/shop" element={<ShopPage />}></Route>
            <Route path="product/:id" element={<ProductPage />}></Route>
            <Route path="cart" element={<ShoppingCartPage />}></Route>
         </Route>
         <Route path="*" element={<ShopPage />}></Route>
      </Routes>
   }

   return <Routes>
      <Route path="login" element={<AuthorizationPage type="login" />}></Route>
      <Route path="registration" element={<AuthorizationPage type="registration" />}></Route>
      <Route path="shop">
         <Route path="/shop" element={<ShopPage />}></Route>
         <Route path="product/:id" element={<ProductPage />}></Route>
      </Route>
      <Route path="*" element={<ShopPage />}></Route>
   </Routes>
}