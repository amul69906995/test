import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Short polling function that continuously fetches stock data
const shortPolling = async (stockId, duration, dispatch) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/stocks/${stockId}`,
      { duration }
    );

    console.log("short polling data", data);

    // Update Redux state after every poll
    dispatch(updateStockData(data));

    if (data.status === "COMPLETE") return data;

    await new Promise(resolve => setTimeout(resolve, 2000));

    return await shortPolling(stockId, duration, dispatch);
  } catch (error) {
    console.error("Polling error:", error);
  }
};

// Redux Thunk: Calls shortPolling and updates state
export const fetchAStockData = createAsyncThunk(
  "fetchStockData",
  async ({ stockId, duration }, { dispatch }) => {
    return await shortPolling(stockId, duration, dispatch);
  }
);

// Redux slice
const stockDataSlice = createSlice({
  name: "stockData",
  initialState: { data: [], status: "idle" },
  reducers: {
    updateStockData: (state, action) => {
      state.data = action.payload; // Updates state after every poll
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAStockData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAStockData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      });
  },
});

// Export action and reducer
export const { updateStockData } = stockDataSlice.actions;
export default stockDataSlice.reducer;

