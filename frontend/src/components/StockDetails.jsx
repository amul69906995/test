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
  const { data, status } = useSelector((state) => state.stockData);
  const selectedStock = stocks.find((stock) => stock.id === id);
  const [currentDuration, setCurrentDuration] = useState(null);
  const [abortController, setAbortController] = useState(null);
  
  useEffect(() => {
    if (selectedStock && selectedStock.available?.length > 0) {
      setCurrentDuration(selectedStock.available[0]); // Set to the first available duration
    }
  }, [selectedStock]);

  useEffect(() => {
    if (selectedStock && currentDuration) {
      if (abortController) abortController.abort(); // Cancel previous polling
      const newAbortController = new AbortController();
      setAbortController(newAbortController);

      dispatch(fetchAStockData({ stockId: id, duration: currentDuration, abortController: newAbortController }));
    }
  }, [id, currentDuration, dispatch, selectedStock]);

  const handleDurationChange = (duration) => {
    setCurrentDuration(duration);
  };

  return (
    <>
      <StockList />
      <StockInfo stock={selectedStock} />
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
      <LineGraph data={data} status={status} />
    </>
  );
};

export default StockDetails;
