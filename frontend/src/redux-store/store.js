import { configureStore } from '@reduxjs/toolkit';
import  stockDataReducer  from './features/stockDataSlice';
import  stockReducer from './features/stockSlice';
export const store = configureStore({
  reducer: {
    stocks: stockReducer,      // Handles stock list
    stockData: stockDataReducer,  // Handles stock graph data
  },
});
