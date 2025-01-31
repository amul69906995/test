import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux-store/store.js'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StockList from './components/StockList.jsx';
import StockDetails from './components/StockDetails.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<StockList />} />
          <Route path="/stock/:id" element={<StockDetails />} />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>,
)
