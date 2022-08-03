import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { setCartPageIsActive } from "../../app/shopSlice";
import { getCurrentLanguage } from "../../app/globalSlice";
import { getProductsInCart, CartProduct } from "../../app/userSlice";
import { CartProductItem } from "../../components/cart/CartProductItem/CartProductItem";
import "./ShoppingCartPage.scss"

export interface ProductInCartModified {
   cartItemId: number,
   cartProductid: number,
   cartId: number,
   productId: number,
   productName?: string,
   productPrice?: number,
   productRating?: number,
   productPoster?: string,
   productTypeId?: number,
   productBrandId?: number,
   quantity: number,
   sum: number
}

export const ShoppingCartPage: FC = () => {
   const dispatch = useAppDispatch()
   const navigate = useNavigate()

   const currentLanguage = useAppSelector(getCurrentLanguage)
   const productsInCart: CartProduct[] = useAppSelector(getProductsInCart)
   const [productsInCartModified, setProductsInCartModified] = useState<ProductInCartModified[]>([])

   const sortCartProductsMethod = (previous: ProductInCartModified, next: ProductInCartModified) => {
      switch (true) {
         case previous.cartProductid > next.cartProductid:
            return 1
         case previous.cartProductid < next.cartProductid:
            return -1
         default:
            return 0
      }
   }

   const orderPageEnter = () => {
      if (!productsInCart.length) return
      navigate("/shop/order")
   }

   useEffect(() => {
      document.title = currentLanguage === "ru" ? "MyOnlineStore: Ваша Корзина" : "MyOnlineStore: Your Cart"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
   }, [currentLanguage])

   useEffect(() => {
      setProductsInCartModified(
         productsInCart
            .map((cartItem: CartProduct, index, array) => {
               const productId: number = cartItem.productId

               return {
                  cartItemId: cartItem.id,
                  cartProductid: productId,
                  cartId: cartItem.cartId,
                  productId: cartItem.productId,
                  productName: cartItem.details?.name,
                  productPrice: cartItem.details?.price,
                  productRating: cartItem.details?.rating,
                  productPoster: cartItem.details?.poster,
                  productTypeId: cartItem.details?.productTypeId,
                  productBrandId: cartItem.details?.productBrandId,
                  quantity: array.filter((cartItem: CartProduct) => cartItem.productId === productId).length,
                  sum: array.reduce((sum: number, cartItem: CartProduct) => {
                     if (cartItem.productId === productId) {
                        return sum += cartItem.details?.price || sum
                     } else return sum
                  }, 0)
               }
            })
            .sort(sortCartProductsMethod)
            .reduce((unique: ProductInCartModified[], cartItemModified: ProductInCartModified) => {
               return unique.find((uniqueElement: ProductInCartModified) => uniqueElement.cartProductid === cartItemModified.cartProductid) ? unique : [...unique, cartItemModified]
            }, [])
      )
   }, [productsInCart])

   useEffect(() => {
      dispatch(setCartPageIsActive(true))

      return () => {
         dispatch(setCartPageIsActive(false))
      }
   }, [])
   return <div className="shopping-cart-page-wrapper">
      <div className={productsInCartModified.length ? "cart-items-wrapper" : "cart-items-wrapper empty"}>
         {productsInCartModified.length
            ? productsInCartModified.map((cartItemModified: ProductInCartModified) => {
               return <CartProductItem data={cartItemModified} key={cartItemModified.cartProductid} />
            })
            : <span
               className="about-emptiness-span">
               {currentLanguage === "ru"
                  ? "Ваша Корзина пуста :("
                  : "Your Shopping cart is empty :("}
            </span>}
      </div>
      <div className="lower-block">
         <p className="total-cost-paragraph">
            {currentLanguage === "ru" ? "Итого: " : "Total: "}
            <span>
               {`${productsInCart.reduce((sum: number, cartItem: CartProduct) => {
                  return sum += cartItem.details?.price || sum
               }, 0)} `}
               USD
            </span>
         </p>
         <button
            type="button"
            className="order-page-transition-button"
            disabled={!productsInCart.length}
            onClick={orderPageEnter}>
            {currentLanguage === "ru" ? "Заказать" : "Order"}
         </button>
      </div>
   </div>
}