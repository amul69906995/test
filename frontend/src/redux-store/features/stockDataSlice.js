import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const shortPolling = async (stockId, duration, signal) => {
  if (signal.aborted) return; // Stop polling if aborted
  
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/stocks/${stockId}`,
      { duration },
      { signal }
    );

    console.log("short polling data", data);

    if (data.status === "COMPLETE") return data;

    await new Promise(resolve => setTimeout(resolve, 2000));

    return await shortPolling(stockId, duration, signal);
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Polling cancelled.");
    } else {
      console.error("Polling error:", error);
    }
  }
};
export const fetchAStockData = createAsyncThunk(
  "fetchStockData",
  async ({ stockId, duration, abortController }) => {
    return await shortPolling(stockId, duration, abortController.signal);
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
