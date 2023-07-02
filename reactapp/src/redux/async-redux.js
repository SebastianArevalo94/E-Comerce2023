import { getAllDB, getByName as getByName2, getByCategory } from "../services/products-service";
import {GetCategories} from "../services/categories.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllAsync = createAsyncThunk("get/getAllGames", getAllDB);
export const getByCategoryAsync = createAsyncThunk("get/getAllGames", getByCategory);
export const getByName = createAsyncThunk("get/getByName", getByName2);
export const getOneUser = createAsyncThunk("get/getOneUser")
export const GetAllCategories = createAsyncThunk("get/getAllCategories", GetCategories)