import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import api from './services/api';

// Import all pages
import { MenuMain } from './pages/menu';
import { KitchenMain } from './pages/kitchen';
import { ManagerMain } from './pages/manager';
import { KioskMain } from './pages/kiosk';
import { PosMain } from './pages/pos';
import { AuthMain } from './pages/auth';

//Import secondary pages
import { SignUpPage } from './pages/auth/SignUpPage.js';
import { SignUpError } from './pages/auth/SignUpError.js';
import { SignUpSuccess } from './pages/auth/SignUpSuccess.js';

function App() {
  const [array, setArray] = useState([]);

  // Fetch API data
  const fetchAPI = async () => {
    const response = await api.get("/api/users"); 
    setArray(response.data.users);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <header className="App-header">
                <nav>
                  <Link to="/">Home</Link>
                </nav>
                <nav>
                  <Link to="/menu">Menu Board</Link> - <Link to="/kitchen">Kitchen</Link> - <Link to="/manager">Manager</Link>
                </nav>
                <nav>
                  <Link to="/kiosk">Customer Kiosk</Link> - <Link to="/pos">Cashier POS</Link> - <Link to="/auth">Login</Link>
                </nav>
              </header>
              <div>
                <p>{array.join(", ")}</p>
              </div>
            </>
          }
        />
        <Route path="/menu" element={<MenuMain />} />
        <Route path="/kitchen" element={<KitchenMain />} />
        <Route path="/manager" element={<ManagerMain />} />
        <Route path="/kiosk" element={<KioskMain />} />
        <Route path="/pos" element={<PosMain />} />
        <Route path="/auth" element={<AuthMain />} />
        <Route path="/auth/signup" element={<SignUpPage />}></Route>
        <Route path="/auth/signup/error" element={<SignUpError />}></Route>
        <Route path="/auth/signup/success" element={<SignUpSuccess />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
