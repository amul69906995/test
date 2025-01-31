import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchStocksList = createAsyncThunk("sfetchStocksList", async () => {
  console.log(import.meta.env.VITE_BACKEND_BASE_URL)
  const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/stocks`);
  console.log("fetchStocksList",data);
  return data;
});

const stockSlice = createSlice({
  name: "stocks",
  initialState: { stocks: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocksList.pending, (state) => { state.status = "loading"; })
      .addCase(fetchStocksList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stocks = action.payload;
      });
  },
});

export default stockSlice.reducer;
