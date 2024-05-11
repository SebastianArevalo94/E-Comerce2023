import { url } from "../utils/url";

export const GetAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Users/GetAll`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await resp.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const GetOneUser = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Users/GetById/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await resp.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const CreateUser = async (user) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Users/Create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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

export const DeleteUser = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${url}/api/Users/Delete/${id}`, {
      method: "DELETE",
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
