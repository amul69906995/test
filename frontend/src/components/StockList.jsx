import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MenuItem, Select, Typography, Skeleton } from "@mui/material";
import { fetchStocksList } from "../redux-store/features/stockSlice";

const StockList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { stocks, status } = useSelector((state) => state.stocks);
  const defaultLabel = "Select a Stock";
  
  const [currentStockSelected, setCurrentStockSelected] = useState(id || "");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStocksList());
    }
  }, [status, dispatch]);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5">Select a Stock</Typography>

      {status === "loading" ? (
        <Skeleton variant="rounded" width="100%" height={40} />
      ) : (
        <Select
          displayEmpty
          value={currentStockSelected}
          onChange={(e) => {
            setCurrentStockSelected(e.target.value);
            navigate(`/stock/${e.target.value}`);
          }}
          fullWidth
        >
          <MenuItem value="" disabled>
            {defaultLabel}
          </MenuItem>
          {stocks.map((stock) => (
            <MenuItem key={stock.id} value={stock.id}>
              {stock.name}
            </MenuItem>
          ))}
        </Select>
      )}

      {/* Show "Please select a stock" message if no stock is selected */}
      {!currentStockSelected && (
        <Typography variant="h6" align="center" style={{ marginTop: "20px", color: "gray" }}>
          Please select a stock
        </Typography>
      )}
    </div>
  );
};

export default StockList;




