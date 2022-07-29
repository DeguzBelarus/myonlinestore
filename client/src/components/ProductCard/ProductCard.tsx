import { FC } from "react";

import { CurrentProduct } from "../../app/productSlice";
import "./ProductCard.scss"

interface Props {
   productData: CurrentProduct
}

export const ProductCard: FC<Props> = ({ productData }) => {
   return <div className="product-card-wrapper">
      <span>{productData.name}</span>
      <img
         className="product-poster"
         src={`/${productData.productTypeId}/${productData.productBrandId}/${productData.name}/${productData.poster}`}
         alt="a product preview" />
      <span>{productData.price} $</span>
   </div>
}