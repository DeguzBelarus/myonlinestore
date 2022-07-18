import { FC, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
   getAllUsersAsync,
   getUsers,
   UserObject,
   DeleteUserRequestObject,
   deleteUserAsync,
   UpdateUserRequestObject,
   updateUserAsync
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
   const [role, setRole]: any = useState("")
   const [userId, setUserId]: any = useState(null)
   const [updatingMode, setUpdatingMode]: any = useState(false)
   const [nicknameInputDefaultValue, setNicknameInputDefaultValue]: any = useState("")
   const [roleSelectDefaultValue, setRoleSelectDefaultValue]: any = useState("")

   const nicknameHandler = (event: any) => {
      setNickname(event.target.value)
   }

   const roleHandler = (event: any) => {
      setRole(event.target.value)
   }

   const updatingModeHandler = (id: number, nickname: string, role: string) => {
      if (updatingMode && (userId === String(id))) {
         setUpdatingMode(false)
         setUserId(null)
         nicknameInput.current.value = ""
         setRoleSelectDefaultValue("")
      } else {
         if (nicknameInput.current) {
            nicknameInput.current.value = nickname
         }
         setRoleSelectDefaultValue(role)
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

   const userUpdate = (event: any) => {
      event.preventDefault()
      if (!nicknameInput.current.value || !role) return
      const data: UpdateUserRequestObject = {
         data: { nickname: nickname, lang: currentLanguage, role: role },
         token: token,
         userId: userId
      }
      dispatch(updateUserAsync(data))
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

      {adminEditingType === "update" &&
         <>
            {updatingMode && <form className="user-management-form" onSubmit={userUpdate}>
               <input
                  type="text"
                  placeholder={currentLanguage === "ru" ? "Введите новый никнейм" : "Enter a new nickname"}
                  autoFocus
                  defaultValue={nicknameInputDefaultValue}
                  onChange={nicknameHandler}
                  ref={nicknameInput} />

               <select
                  title={currentLanguage === "ru" ? "Выберите новую роль" : "Select a new role"}
                  defaultValue={roleSelectDefaultValue}
                  onChange={roleHandler}>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MODER">MODER</option>
                  <option value="USER">USER</option>
               </select>

               <div className="buttons">
                  <button type="submit" className="change-button">{currentLanguage === "ru"
                     ? "Изменить" : "Change"}</button>
                  <button type="reset" className="reset-button">{currentLanguage === "ru"
                     ? "Очистить" : "Clear"}</button>
                  <button type="button" className="close-button" onClick={updatingModeOff}>&times;</button>
               </div>
            </form>
            }

            <div className="management-items-wrapper">
               {[...allUsers].sort(sortUsersMethod).map((user: UserObject) => {
                  return <div className="management-item" key={user.id}>
                     <span className="user-nickname-span">{user.nickname}</span>
                     <span className="user-email-span">{user.email}</span>
                     <span className="user-role-span">{user.role}</span>
                     <button type="button"
                        className={userId === String(user.id) ? "update-button active" : "update-button"}
                        onClick={() => updatingModeHandler(user.id, user.nickname, user.role)}>
                        {userId === String(user.id)
                           ? "..."
                           : currentLanguage === "ru"
                              ? "изменить"
                              : "change"}
                     </button>
                  </div>
               })}
            </div>
         </>}

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