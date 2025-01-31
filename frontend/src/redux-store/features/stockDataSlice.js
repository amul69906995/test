import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const shortPolling=async(stockId,duration)=>{
  const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/stocks/${stockId}`, { duration });
  console.log("short polling data",data);
  if(data.status==='COMPLETE')return data;
    await new Promise(resolve => setTimeout(resolve,2000))
    await shortPolling(stockId,duration);
}
export const fetchAStockData = createAsyncThunk(
  "fetchStockData",
  async ({ stockId, duration }) => {
   return await shortPolling(stockId,duration)
  }
);


const stockDataSlice = createSlice({
  name: "stockData",
  initialState: { data: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAStockData.pending, (state) => { state.status = "loading"; })
      .addCase(fetchAStockData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      });
  },
});

export default stockDataSlice.reducer;
