import { url } from "../utils/url";

export const GetFacturasByUser = async (user) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/Facturas/GetFacturasByUser/${user}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};


export const GenerarFactura = async (newFactura) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/Facturas/GenerarFactura`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newFactura)
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};
