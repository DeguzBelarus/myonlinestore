import { FC } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { getCurrentLanguage, setCurrentLanguage } from "../../app/globalSlice";
import './LanguageSwitcher.scss'

export const LanguageSwitcher: FC = () => {
   const dispatch = useAppDispatch()

   const currentLanguage: string = useAppSelector(getCurrentLanguage)

   const currentLanguageHandler = () => {
      if (currentLanguage === "ru") {
         dispatch(setCurrentLanguage("en"))
      } else {
         dispatch(setCurrentLanguage("ru"))
      }
   }

   return <div
      className="language-switcher-wrapper"
      onClick={currentLanguageHandler}>
      <div className={currentLanguage === "ru"
         ? "lang-block-ru active"
         : "lang-block-ru"}>
         <span
            className={currentLanguage === "ru"
               ? "lang-name-span active"
               : "lang-name-span"}
         >Rus</span>
      </div>
      <div className={currentLanguage === "ru"
         ? "lang-block-en"
         : "lang-block-en active"}>
         <span
            className={currentLanguage === "ru"
               ? "lang-name-span"
               : "lang-name-span active"}
         >Eng</span>
      </div>
   </div >
}