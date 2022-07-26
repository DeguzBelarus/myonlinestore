// products types methods
export function getTypes(url: string) {
   try {
      return fetch(url, {
         method: "GET",
         headers: {
            "Content-Type": "application/json"
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}

export function createType(url: string, body: any, token: string) {
   try {
      return fetch(url, {
         method: "POST",
         body: body,
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}

export function updateType(url: string, body: any, token: string) {
   try {
      return fetch(url, {
         method: "PUT",
         body: body,
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}

export function deleteType(url: string, token: string) {
   try {
      return fetch(url, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}
// products types methods

// products brands methods
export function getBrands(url: string) {
   try {
      return fetch(url, {
         method: "GET",
         headers: {
            "Content-Type": "application/json"
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}

export function createBrand(url: string, body: any, token: string) {
   try {
      return fetch(url, {
         method: "POST",
         body: body,
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}

export function updateBrand(url: string, body: any, token: string) {
   try {
      return fetch(url, {
         method: "PUT",
         body: body,
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}

export function deleteBrand(url: string, token: string) {
   try {
      return fetch(url, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}
// products brands methods

// products methods
export function getProducts(url: string) {
   try {
      return fetch(url, {
         method: "GET",
         headers: {
            "Content-Type": "application/json"
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}

export function createProduct(url: string, body: any, token: string) {
   try {
      return fetch(url, {
         method: "POST",
         body: body,
         headers: {
            "Authorization": `Bearer ${token}`
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}

export function deleteProduct(url: string, token: string) {
   try {
      return fetch(url, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}
// products methods