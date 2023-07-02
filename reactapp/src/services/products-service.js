import { url } from "../utils/url";

export const getAllDB = async () => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/Products/GetAllProducts`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        let json = await resp.json();
        json.response = JSON.parse(json.response)
        return json;
    } catch (error) {
        console.log(error);
    }
};

export const getByCategory = async (category) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/Products/GetByCategory/${category}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const json = await resp.json();
        json.response = JSON.parse(json.response)
        return json;
    } catch (error) {
        console.log(error);
    }
};

export const getByName = async (name) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/Products/GetByName/${name}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const json = await resp.json();
        json.response = JSON.parse(json.response)
        return json;
    } catch (error) {
        console.log(error);
    }
};

export const getOne = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/Products/GetById/${id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};

export const createProduct = async (game) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/Products/Create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(game),
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};

export const searchProduct = async (name) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/Products/GetByName/${name}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const json = await resp.json(resp);
        return json;
    } catch (error) {
        console.log(error);
    }
};

export const updateProduct = async (game, id) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/Products/Edit/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(game),
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};

export const deleteProduct = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${url}/api/Products/Delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const json = await resp.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};