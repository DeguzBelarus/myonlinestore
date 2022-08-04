import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";

import { checkAuthorizationAsync } from "./app/userSlice";
import { useRoutes } from "./hooks/useRoutes"
import { NavBar } from "./components/NavBar/NavBar"
import { Footer } from "./components/Footer/Footer";

function App() {
   const dispatch = useAppDispatch()
   const routes = useRoutes()

   useEffect(() => {
      if (localStorage.getItem("MyOnlineStoreToken")) {
         const token: any = localStorage.getItem("MyOnlineStoreToken")
         dispatch(checkAuthorizationAsync(token))
      }
   }, [])
   return (
      <>
         <NavBar />
         {routes}
         <Footer />
      </>
   );
}

export default App;
