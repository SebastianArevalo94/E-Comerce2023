import { url } from "../utils/url";

export const GetAdminLog = async (objFilter) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Log/GetAdminLog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(objFilter),
    });
    const json = await resp.json();
    //json.results.forEach(log => log.fecha = new Date(log.fecha));
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const GetLogByUser = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Log/GetLogByUser/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await resp.json();
    json.results.forEach((log) => (log.fecha = new Date(log.fecha)));
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const GetFacturaByLog = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Facturas/GetFacturaBylog/${id}`, {
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

export const GetInfoUserAuthByLog = async (log) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Log/GetLogUserAuthBylog/${log}`, {
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
