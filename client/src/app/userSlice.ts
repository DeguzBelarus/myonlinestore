import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {
   authorization,
   checkAuthorization,
   getAllUsers,
   deleteUser,
   updateUser
} from "./userAPI"
import jwtDecode from "jwt-decode"

export interface UserObject {
   id: number,
   email: string,
   password: string,
   nickname: string,
   role: string
}

interface UserState {
   token: string,
   isAuth: boolean,
   role: string,
   userId: string | null,
   nickname: string | null,
   isStayLoggedIn: boolean,
   registrationEmail: string,
   authMessage: string,
   users: UserObject[],
   authStatus: "idle" | "loading" | "failed"
}

const initialState = {
   token: "",
   isAuth: false,
   role: "USER",
   userId: null,
   nickname: null,
   isStayLoggedIn: true,
   registrationEmail: "",
   authMessage: "",
   users: [],
   authStatus: "idle"
} as UserState

// thunks 
export const registrationAsync = createAsyncThunk(
   "user/registration",
   async (body: any) => {
      const url = `/api/user/registration`
      const response: any = await authorization(url, body)
      const result = await response.json()
      if (result.token) {
         return { userData: jwtDecode(result.token), responseData: result }
      } else {
         return result
      }
   }
)

export const loginAsync = createAsyncThunk(
   "user/login",
   async (body: any) => {
      const url = `/api/user/login`
      const response: any = await authorization(url, body)
      const result = await response.json()
      if (result.token) {
         return { userData: jwtDecode(result.token), responseData: result }
      } else {
         return result
      }
   }
)

export const checkAuthorizationAsync = createAsyncThunk(
   "user/checkauthorization",
   async (token: string) => {
      const url = `/api/user/authcheck`
      const response: any = await checkAuthorization(url, token)
      const result = await response.json()
      if (result.token) {
         return { userData: jwtDecode(result.token), responseData: result }
      } else {
         return result
      }
   }
)

export interface UpdateUserRequestObject {
   token: string,
   data: { nickname: string, lang: string, role: string },
   userId: string
}

export const updateUserAsync = createAsyncThunk(
   "user/update",
   async (body: UpdateUserRequestObject) => {
      const url = `/api/user/${body.userId}`
      const response: any = await updateUser(url, JSON.stringify(body.data), body.token)
      return await response.json()
   }
)

export interface DeleteUserRequestObject {
   id: string,
   token: string,
   lang: string
}

export const deleteUserAsync = createAsyncThunk(
   "user/delete",
   async (data: DeleteUserRequestObject) => {
      const url = `/api/user/${data.id}/delete?${data.lang}`
      const response: any = await deleteUser(url, data.token)
      return await response.json()
   }
)

export const getAllUsersAsync = createAsyncThunk(
   "user/getall",
   async (token: string) => {
      const url = `/api/user`
      const response: any = await getAllUsers(url, token)
      return await response.json()
   }
)
// thunks 

export const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setIsAuth(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.isAuth = action.payload
         } else {
            state.isAuth = initialState.isAuth
         }
      }, setUserId(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.userId = action.payload
         } else {
            state.userId = initialState.userId
         }
      }, setUserNickname(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.nickname = action.payload
         } else {
            state.nickname = initialState.nickname
         }
      }, setUserRole(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.role = action.payload
         } else {
            state.role = initialState.role
         }
      }, setAuthMessage(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.authMessage = action.payload
         } else {
            state.authMessage = initialState.authMessage
         }
      }, setIsStayLoggedIn(state: any) {
         if (state.isStayLoggedIn) {
            state.isStayLoggedIn = false
         } else {
            state.isStayLoggedIn = initialState.isStayLoggedIn
         }
      }, setToken(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.token = action.payload
         } else {
            state.token = initialState.token
         }
      }, setRegistrationEmail(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.registrationEmail = action.payload
         } else {
            state.registrationEmail = initialState.registrationEmail
         }
      }
   }, extraReducers: (builder) => {
      builder

         // login
         .addCase(loginAsync.pending, (state) => {
            state.authStatus = "loading"
         })
         .addCase(loginAsync.fulfilled, (state, action) => {
            state.authStatus = "idle"

            if (action.payload.userData) {
               state.isAuth = true
               state.userId = action.payload.userData.id
               state.nickname = action.payload.userData.nickname
               state.role = action.payload.userData.role
               state.authMessage = action.payload.responseData.message
               state.token = action.payload.responseData.token

               if (state.isStayLoggedIn) {
                  localStorage.setItem("MyOnlineStoreToken", action.payload.responseData.token)
               }
            } else {
               state.authMessage = action.payload.message
            }
         })
         .addCase(loginAsync.rejected, (state, action) => {
            state.authStatus = "failed"
            state.authMessage = String(action.error.message)
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // login

         // check authorization
         .addCase(checkAuthorizationAsync.pending, (state) => {
            state.authStatus = "loading"
         })
         .addCase(checkAuthorizationAsync.fulfilled, (state, action) => {
            state.authStatus = "idle"

            if (action.payload.userData) {
               state.isAuth = true
               state.userId = action.payload.userData.id
               state.nickname = action.payload.userData.nickname
               state.role = action.payload.userData.role
               state.token = action.payload.responseData.token

               if (state.isStayLoggedIn) {
                  localStorage.setItem("MyOnlineStoreToken", action.payload.responseData.token)
               }
            } else {
               state.authMessage = action.payload.message
            }
         })
         .addCase(checkAuthorizationAsync.rejected, (state, action) => {
            state.authStatus = "failed"
            state.isAuth = initialState.isAuth
            state.userId = initialState.userId
            state.nickname = initialState.nickname
            state.role = initialState.role
            state.authMessage = initialState.authMessage
            state.token = initialState.token
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // check authorization

         // registration
         .addCase(registrationAsync.pending, (state) => {
            state.authStatus = "loading"
         })
         .addCase(registrationAsync.fulfilled, (state, action) => {
            state.authStatus = "idle"

            if (action.payload.userData) {
               state.isAuth = true
               state.userId = action.payload.userData.id
               state.nickname = action.payload.userData.nickname
               state.role = action.payload.userData.role
               state.authMessage = action.payload.responseData.message
               state.token = action.payload.responseData.token

               if (state.isStayLoggedIn) {
                  localStorage.setItem("MyOnlineStoreToken", action.payload.responseData.token)
               }
            } else {
               state.authMessage = action.payload.message
            }
         })
         .addCase(registrationAsync.rejected, (state, action) => {
            state.authStatus = "failed"
            state.authMessage = String(action.error.message)
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // registration

         // get users
         .addCase(getAllUsersAsync.pending, (state) => {
            state.authStatus = "loading"
         })
         .addCase(getAllUsersAsync.fulfilled, (state, action) => {
            state.authStatus = "idle"
            state.users = action.payload
         })
         .addCase(getAllUsersAsync.rejected, (state, action) => {
            state.authStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // get users

         // update user
         .addCase(updateUserAsync.pending, (state) => {
            state.authStatus = "loading"
         })
         .addCase(updateUserAsync.fulfilled, (state, action) => {
            state.authStatus = "idle"
            state.users = action.payload
         })
         .addCase(updateUserAsync.rejected, (state, action) => {
            state.authStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // update user

         // delete user
         .addCase(deleteUserAsync.pending, (state) => {
            state.authStatus = "loading"
         })
         .addCase(deleteUserAsync.fulfilled, (state, action) => {
            state.authStatus = "idle"
            state.users = action.payload
         })
         .addCase(deleteUserAsync.rejected, (state, action) => {
            state.authStatus = "failed"
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
      // delete user
   }
})

export const {
   setIsAuth,
   setAuthMessage,
   setIsStayLoggedIn,
   setToken,
   setUserId,
   setUserNickname,
   setUserRole,
   setRegistrationEmail
} = userSlice.actions

export const getIsAuth = (state: RootState) => state.user.isAuth
export const getUserId = (state: RootState) => state.user.userId
export const getUserNickname = (state: RootState) => state.user.nickname
export const getUserRole = (state: RootState) => state.user.role
export const getAuthMessage = (state: RootState) => state.user.authMessage
export const getAuthStatus = (state: RootState) => state.user.authStatus
export const getIsStayLoggedIn = (state: RootState) => state.user.isStayLoggedIn
export const getToken = (state: RootState) => state.user.token
export const getRegistrationEmail = (state: RootState) => state.user.registrationEmail
export const getUsers = (state: RootState) => state.user.users

export default userSlice.reducer