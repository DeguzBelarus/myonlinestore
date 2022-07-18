import { FC, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   getAllUsersAsync,
   getUsers,
   UserObject,
   DeleteUserRequestObject,
   deleteUserAsync
} from "../../../app/userSlice";
import { getAdminEditingType } from "../../../app/shopSlice";
import { getToken } from "../../../app/userSlice";
import { getCurrentLanguage } from "../../../app/globalSlice";
import { CRUDModeSwitcher } from "../CRUDModeSwitcher/CRUDModeSwitcher";
import "./UsersManagement.scss"

export const UsersManagement: FC = () => {
   const nicknameInput: any = useRef(null)

   const dispatch = useAppDispatch()

   const allUsers: UserObject[] = useAppSelector(getUsers)
   const token: string | null = useAppSelector(getToken)
   const adminEditingType: string = useAppSelector(getAdminEditingType)
   const currentLanguage: string = useAppSelector(getCurrentLanguage)
   const [nickname, setNickname]: any = useState("")
   const [userId, setUserId]: any = useState(null)
   const [updatingMode, setUpdatingMode]: any = useState(false)
   const [nicknameInputDefaultValue, setNicknameInputDefaultValue]: any = useState("")

   const nicknameHandler = (event: any) => {
      setNickname(event.target.value)
   }

   const updatingModeHandler = (id: number, nickname: string) => {
      if (updatingMode && (userId === String(id))) {
         setUpdatingMode(false)
         setUserId(null)
         nicknameInput.current.value = ""
      } else {
         if (nicknameInput.current) {
            nicknameInput.current.value = nickname
         }
         setNicknameInputDefaultValue(nickname)
         setUpdatingMode(true)
         setUserId(String(id))
      }
   }

   const updatingModeOff = () => {
      setUpdatingMode(false)
      setUserId(null)
      setNicknameInputDefaultValue("")
   }

   const userDelete = (id: number) => {
      const data: DeleteUserRequestObject = { id: String(id), token: token, lang: currentLanguage }
      dispatch(deleteUserAsync(data))
   }

   const sortUsersMethod = (previous: UserObject, next: UserObject) => {
      switch (true) {
         case previous.nickname > next.nickname || previous.role > next.role:
            return 1
         case previous.nickname < next.nickname || previous.role < next.role:
            return -1
         default:
            return 0
      }
   }

   useEffect(() => {
      setUpdatingMode(false)
      setUserId(null)
      dispatch(getAllUsersAsync(token))
   }, [adminEditingType])
   return <div className="users-management-wrapper">
      <CRUDModeSwitcher type="usermanagement" />

      {adminEditingType === "read" &&
         <div className="management-items-wrapper">
            {[...allUsers].sort(sortUsersMethod).map((user: UserObject) => {
               return <div className="management-item" key={user.id}>
                  <span className="user-nickname-span">{user.nickname}</span>
                  <span className="user-email-span">{user.email}</span>
                  <span className="user-role-span">{user.role}</span>
               </div>
            })}
         </div>}

      {adminEditingType === "delete" &&
         <div className="management-items-wrapper">
            {[...allUsers].sort(sortUsersMethod).map((user: UserObject) => {
               return <div className="management-item" key={user.id}>
                  <span className="user-nickname-span">{user.nickname}</span>
                  <span className="user-email-span">{user.email}</span>
                  <span className="user-role-span">{user.role}</span>
                  <button type="button" className="delete-button" onClick={() => userDelete(user.id)}>
                     {currentLanguage === "ru"
                        ? "удалить" : "delete"}
                  </button>
               </div>
            })}
         </div>}
   </div>
}