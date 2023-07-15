import { url } from "../utils/url";

export const GetTipoAcciones = async () => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/Acciones/GetTipoAcciones`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};
