import { Card, CardContent, Typography } from "@mui/material";

const StockInfo = ({ stock }) => {
  if (!stock) {
    return (
      <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
        Nothing to display
      </Typography>
    );
  }

  return (
    <Card style={{ marginTop: "20px", padding: "10px" }}>
      <CardContent>
        <Typography variant="h5">{stock?.name}</Typography>
        <Typography variant="subtitle1">{stock?.symbol}</Typography>
        <Typography variant="body1">
          Available Durations: {stock?.available.join(", ")}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StockInfo;
