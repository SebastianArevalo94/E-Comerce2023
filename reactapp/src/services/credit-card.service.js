import { url } from "../utils/url";

export const CreateCC = async (creditCard, id_user) => {
    try {
        const token = localStorage.getItem("token");
        creditCard.Id_User = id_user;
        const resp = await fetch(`${url}/api/CreditCard/CreateCC`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(creditCard) // Enviar el objeto body que contiene creditCard y id_user
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};


export const CreateCC2 = async (creditCard) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/CreditCard/CreateCC`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(creditCard)
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};

export const GetCCByUser = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/CreditCard/GetCCByUser/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};

export const GetCCById = async (id) => {
    try {
        function capitalizeObjectKeys(obj) {
            var capitalizedObj = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                    capitalizedObj[capitalizedKey] = obj[key];
                }
            }
            return capitalizedObj;
        }
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/CreditCard/GetCCById/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        let json = await resp.json();
        json.results = capitalizeObjectKeys(json.results);
        return json;
    } catch (error) {
        console.log(error);
    }
}

export const EditCC = async (cc) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/CreditCard/EditCC/${cc.Id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(cc)
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};

export const DeleteCC = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/CreditCard/DeleteCC/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};