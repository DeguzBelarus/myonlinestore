import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";

import { setShopPageIsActive, setSelectionMode } from "../../app/shopSlice";
import "./ShopPage.scss"

export const ShopPage: FC = () => {
   const navigate = useNavigate()
   const dispatch = useAppDispatch()

   useEffect(() => {
      dispatch(setShopPageIsActive(true))
      navigate("/shop")

      return () => {
         dispatch(setShopPageIsActive(false))
         dispatch(setSelectionMode(false))
      }
   }, [])
   return <div className="shop-page-wrapper"></div>
}