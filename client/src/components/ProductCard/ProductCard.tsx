import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
   getIsAuth,
   addCartProductAsync,
   getToken,
   getUserId
} from "../../app/userSlice";
import { setProductIsDragged, setDraggedProduct } from "../../app/shopSlice";
import {
   CurrentProduct,
   TypeOrBrandObject,
   getProductsBrands
} from "../../app/productSlice";
import { getCurrentLanguage } from "../../app/globalSlice";
import cartIcon from "../../assets/cart-icon.svg"
import favoriteIcon from "../../assets/favorite-icon.svg"
import "./ProductCard.scss"

interface Props {
   productData: CurrentProduct
}

export const ProductCard: FC<Props> = ({ productData }) => {
   const dispatch = useAppDispatch()

   const isAuth: boolean = useAppSelector(getIsAuth)
   const productsBrands: TypeOrBrandObject[] = useAppSelector(getProductsBrands)
   const userId: string | null = useAppSelector(getUserId)
   const token: string | null = useAppSelector(getToken)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)

   const dragStartHandler = (event: any) => {
      if (isAuth) {
         dispatch(setProductIsDragged(true))
         dispatch(setDraggedProduct(productData))
         event.currentTarget.setAttribute("class", "product-card-wrapper product-dragging")
      }
   }

   const dragEndHandler = (event: any) => {
      if (isAuth) {
         dispatch(setProductIsDragged(false))
         event.currentTarget.setAttribute("class", "product-card-wrapper logged")
      }
   }

   const addProductToCart = () => {
      dispatch(addCartProductAsync({
         lang: currentLanguage,
         token: token,
         data: { id: userId, productId: productData.id }
      }))
   }
   return <div
      className={isAuth ? "product-card-wrapper logged" : "product-card-wrapper"}
      draggable={isAuth}
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}>
      <span className="product-name-span">{productData.name}</span>
      <span className="product-brand-span">{`${productsBrands[productsBrands
         .findIndex((brand: TypeOrBrandObject) => brand.id === productData.productBrandId)].name}`}</span>
      <img
         className="product-poster"
         draggable={false}
         src={`/${productData.productTypeId}/${productData.productBrandId}/${productData.name}/${productData.poster}`}
         alt="a product preview" />
      <span className="product-price-span">{productData.price} USD</span>

      {isAuth
         && <>
            <img
               className="favorite-icon"
               src={favoriteIcon}
               alt="a product cart" />

            <img
               className="cart-icon"
               src={cartIcon}
               onClick={addProductToCart}
               alt="a product cart" />
         </>}
   </div>
}