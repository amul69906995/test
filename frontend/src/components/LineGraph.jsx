import { useSelector } from "react-redux";
import { Line, Scatter } from "react-chartjs-2";
import { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const LineGraph = () => {
  const { data, status } = useSelector((state) => state.stockData);
  const [chartType, setChartType] = useState('line'); // State to toggle chart type
  
  // Format data for Chart.js (X: timestamp, Y: price)
  const chartData = {
    labels: data?.data?.map(item => item.timestamp), // X-axis: timestamp
    datasets: [
      {
        label: 'Price',  // Y-axis: price
        data: data?.data?.map(item => ({ x: item.timestamp, y: item.price })),  // Y-axis: price
        borderColor: 'rgba(75, 192, 192, 1)',  // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Fill color under the line for area chart
        tension: 0.1,  // Smoothness of the line
        fill: chartType === 'area' ? true : false, // Fill for area chart
      },
    ],
  };

  // Chart options (you can customize them as needed)
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Timestamp',
        },
        type: 'category', // X-axis is based on the timestamps
        ticks: {
          maxRotation: 90, // Rotate labels if needed
          autoSkip: true,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
        },
        beginAtZero: false,  // Y-axis doesn't start at 0, based on the data range
      },
    },
    plugins: {
      legend: {
        position: 'top',  // Position of the legend
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: $${context.raw.toFixed(2)}`; // Tooltip display for each point
          }
        }
      }
    }
  };

  // Toggle the chart type (line, area, scatter)
  const toggleChartType = (type) => {
    setChartType(type);
  };

  return (
    <div>
      <h1>Line Graph</h1>
      
      {/* Chart Type Toggle */}
      <div>
        <button onClick={() => toggleChartType('line')}>Line</button>
        <button onClick={() => toggleChartType('area')}>Area</button>
        <button onClick={() => toggleChartType('scatter')}>Scatter</button>
      </div>

      
        
          {chartType === 'line' && <Line data={chartData} options={options} />}
          {chartType === 'area' && <Line data={chartData} options={options} />}
          {chartType === 'scatter' && <Scatter data={chartData} options={options} />}
        
      
    </div>
  );
}

export default LineGraph;


