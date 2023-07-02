import { url } from "../utils/url";

export const GetCategories = async () => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Categorias/GetCategories`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await resp.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const CreateCategory = async (category) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Categorias/CreateCategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    const json = await resp.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const GetOneCategory = async (codigo) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Categorias/GetOneCategory/${codigo}`, {
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

export const EditCategory = async (category, codigo) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Categorias/EditCategory/${codigo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    const json = await resp.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const DeleteCategory = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Categorias/DeleteCategory/${id}`, {
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

export const GetCategoryByName = async (name) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(
      `${url}/api/Categorias/GetCategoryByName/${name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const json = await resp.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};
