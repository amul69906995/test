import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Global AbortController to cancel previous polling
let globalAbortController = null;

// Short polling function that continuously fetches stock data
const shortPolling = async (stockId, duration, dispatch, signal) => {
  try {
    while (true) {
      if (signal.aborted) {
        console.log("Polling stopped due to duration change.");
        return null;
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/stocks/${stockId}`,
        { duration },
        { signal }
      );

      console.log("Short polling data:", data);

      // Dispatch live updates to Redux
      dispatch(updateStockData(data));

      if (data.status === "COMPLETE") return data;

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 2000);
        signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          console.log("Polling aborted during wait.");
          reject(new Error("Polling Aborted"));
        });
      });
    }
  } catch (error) {
    if (axios.isCancel(error) || error.message === "Polling Aborted") {
      console.log("Polling stopped.");
      return null;
    }
    console.error("Polling error:", error);
  }
};

// Redux Thunk: Calls shortPolling and updates state
export const fetchAStockData = createAsyncThunk(
  "fetchStockData",
  async ({ stockId, duration }, { dispatch }) => {
    // Cancel previous polling
    if (globalAbortController) {
      globalAbortController.abort();
    }

    // Create a new AbortController for the new request
    globalAbortController = new AbortController();

    // Reset state before new polling starts
    dispatch(resetStockData());

    return await shortPolling(stockId, duration, dispatch, globalAbortController.signal);
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
    resetStockData: (state) => {
      state.data = [];
      state.status = "idle";
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

// Export actions and reducer
export const { updateStockData, resetStockData } = stockDataSlice.actions;
export default stockDataSlice.reducer;


