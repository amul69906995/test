import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAStockData } from "../redux-store/features/stockDataSlice";
import { Typography, Button, Box } from "@mui/material";
import StockList from './StockList.jsx';
import StockInfo from "./StockInfo";
import LineGraph from "./LineGraph.jsx";

const StockDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { stocks } = useSelector((state) => state.stocks);
  const selectedStock = stocks.find((stock) => stock.id === id);
  const [currentDuration, setCurrentDuration] = useState(null);

  // Set initial duration when stock is selected
  useEffect(() => {
    if (selectedStock && selectedStock.available.length > 0) {
      setCurrentDuration(selectedStock.available[0]);
    }
  }, [selectedStock]);

  // Fetch stock data when stock ID or duration changes
  useEffect(() => {
    if (selectedStock && currentDuration) {
      console.log("Dispatching polling:", id, currentDuration);
      dispatch(fetchAStockData({ stockId: id, duration: currentDuration }));
    }
  }, [id, currentDuration, dispatch, selectedStock]);

  // Change duration and reset state
  const handleDurationChange = (duration) => {
    setCurrentDuration(duration);
  };

  return (
    <>
      <StockList />
      
      {/* Stock Info Section */}
      <StockInfo stock={selectedStock} />

      {/* Inline Duration Selection */}
      <Box mt={2}>
        <Typography variant="h6">Select Duration</Typography>
        <Box display="flex" gap={2} mt={1}>
          {selectedStock?.available.map((duration) => (
            <Button
              key={duration}
              variant={currentDuration === duration ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleDurationChange(duration)}
            >
              {duration}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Graph Component */}
      <LineGraph />
    </>
  );
};

export default StockDetails;



