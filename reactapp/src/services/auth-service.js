import { url } from "../utils/url";
import { GetIP } from "./location.service";

// export const signUp = async (user) => {
//   try {
//     const resp = await fetch(`${url}/api/Users/SignUp`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(user),
//     });
//     const json = await resp.json();
//     // if(json.token){
//     // 	localStorage.setItem('token', json.token);
//     // };
//     return json;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const signUp = async (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await GetIP();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const LogUserAuth = {
              usuario: 1,
              log: 0,
              tipoAccion: 3,
              latitud: position.coords.latitude,
              longitud: position.coords.longitude,
              ip: resp.ip,
              pais: resp.location.country,
              ciudad: resp.location.region,
            };
            const objSend = {
              usuario: user,
              logAuthUser: LogUserAuth,
            };
            try {
              const resp = await fetch(`${url}/api/Users/SignUp`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(objSend),
              });
              const json = await resp.json();
              if (json.status == 200) {
                localStorage.setItem("token", json.token);
              }
              resolve(json); // Resuelve la promesa con el resultado
            } catch (error) {
              console.log(error);
              reject(error); // Rechaza la promesa con el error
            }
          },
          (error) => {
            console.log(error.code);
            alert("Activa la ubicacion para iniciar sesion");
            reject(error); // Rechaza la promesa con el error
          }
        );
      }
    } catch (error) {
      console.log(error);
      reject(error); // Rechaza la promesa con el error
    }
  });
};


export const signIn = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await GetIP();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const LogUserAuth = {
              usuario: 1,
              log: 0,
              tipoAccion: 0,
              latitud: position.coords.latitude,
              longitud: position.coords.longitude,
              ip: resp.ip,
              pais: resp.location.country,
              ciudad: resp.location.region,
            };
            const objSend = {
              usuario: user,
              logAuthUser: LogUserAuth,
            };
            try {
              const resp = await fetch(`${url}/api/Users/Login`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(objSend),
              });
              const json = await resp.json();
              if (json.status == 200) {
                localStorage.setItem("token", json.token);
              }
              resolve(json); // Resuelve la promesa con el resultado
            } catch (error) {
              console.log(error);
              reject(error); // Rechaza la promesa con el error
            }
          },
          (error) => {
            console.log(error.code);
            alert("Activa la ubicacion para iniciar sesion");
            reject(error); // Rechaza la promesa con el error
          }
        );
      }
    } catch (error) {
      console.log(error);
      reject(error); // Rechaza la promesa con el error
    }
  });
};

// export const Logout = async (id) => {
//   try {
//     const token = localStorage.getItem("token");
//     const resp = await fetch(`${url}/api/Users/Logout/${id}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     const json = await resp.json();
//     return json;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const Logout = (userID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await GetIP();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const LogUserAuth = {
              usuario: userID,
              log: 0,
              tipoAccion: 0,
              latitud: position.coords.latitude,
              longitud: position.coords.longitude,
              ip: resp.ip,
              pais: resp.location.country,
              ciudad: resp.location.region,
            };
            try {
              const resp = await fetch(`${url}/api/Users/Logout`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(LogUserAuth),
              });
              const json = await resp.json();
              if (json.status == 200) {
                localStorage.setItem("token", json.token);
              }
              console.log(json);
              resolve(json); // Resuelve la promesa con el resultado
            } catch (error) {
              console.log(error);
              reject(error); // Rechaza la promesa con el error
            }
          },
          (error) => {
            console.log(error.code);
            alert("Activa la ubicacion para iniciar sesion");
            reject(error); // Rechaza la promesa con el error
          }
        );
      }
    } catch (error) {
      console.log(error);
      reject(error); // Rechaza la promesa con el error
    }
  });
}; 

export const GetUserById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Users/GetById/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await resp.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const EditUser = async (user, id) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Users/Edit/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
    const json = await resp.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};
