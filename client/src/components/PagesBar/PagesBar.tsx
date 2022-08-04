import { FC } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { getCurrentPage, getProductsPerPage, setCurrentPage } from "../../app/shopSlice";
import { getTotalProducts } from "../../app/productSlice";
import "./PagesBar.scss"

export const PagesBar: FC = () => {
   const dispatch = useAppDispatch()

   const totalProducts: number = useAppSelector(getTotalProducts)
   const currentPage: number = useAppSelector(getCurrentPage)
   const productsPerPage: number = useAppSelector(getProductsPerPage)
   const totalPages: number = Math.ceil((totalProducts / productsPerPage))
   const isPrevPrevPage = currentPage - 2
   const isPrevPage = currentPage - 1
   const isNextPage = currentPage + 1
   const isNextNextPage = currentPage + 2

   const setCurrentPageHandler = (page: number) => {
      dispatch(setCurrentPage(page))
   }

   return <div className="pages-bar">
      {totalPages > 5 && currentPage !== 1
         && <div
            className="page-button"
            onClick={() => setCurrentPageHandler(1)}>
            {"<<"}
         </div>}

      {isPrevPrevPage > 0
         && <div
            className="page-button"
            onClick={() => setCurrentPageHandler(currentPage - 2)}>
            {currentPage - 2}
         </div>}

      {isPrevPage > 0
         && <div
            className="page-button"
            onClick={() => setCurrentPageHandler(currentPage - 1)}>
            {currentPage - 1}
         </div>}

      <div className="page-button current">{currentPage}</div>

      {isNextPage <= totalPages
         && <div
            className="page-button"
            onClick={() => setCurrentPageHandler(currentPage + 1)}>
            {currentPage + 1}
         </div>}

      {isNextNextPage <= totalPages
         && <div className="page-button"
            onClick={() => setCurrentPageHandler(currentPage + 2)}>
            {currentPage + 2}
         </div>}

      {totalPages > 5 && currentPage !== totalPages
         && <div
            className="page-button"
            onClick={() => setCurrentPageHandler(totalPages)}>
            {">>"}
         </div>}
   </div >
}