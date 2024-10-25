import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import BaseUrl from './services/api'

// to import all pages
import { MenuMain } from './pages/menu'
import { KitchenMain } from './pages/kitchen'
import { ManagerMain } from './pages/manager'
import { KioskMain } from './pages/kiosk';
import { PosMain } from './pages/pos'
import { AuthMain } from './pages/auth'

function App() {
  const [array, setArray] = useState([]);

  // how to fetch api
  const fetchAPI = async () => {
    const response = await BaseUrl.get("/api/users"); 
    setArray(response.data.users);
  };

  // how to fetch on load
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Router>
      <div className="App" style={{
          backgroundImage: './assets/inspiration.png', 
          backgroundSize: 'contain',              
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',          
          minHeight: '100vh',                    
          color: '#fff'          
      }}>
        <header className="App-header">
          <nav>
            <Link to="/">Home</Link>  
          </nav>
          <nav>
            <Link to="/menu">Menu Board</Link>  -  <Link to="/kitchen">Kitchen</Link>  -  <Link to="/manager">Manager</Link>  
          </nav>
          <nav>
            <Link to="/kiosk">Customer Kiosk</Link>  -  <Link to="/pos">Cashier POS</Link>  -  <Link to="/auth">Login</Link> 
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <p>{array.join(", ")}</p>
                </div>
              }
            />
            <Route path="/menu" element={<MenuMain />} />
            <Route path="/kitchen" element={<KitchenMain />} />
            <Route path="/manager" element={<ManagerMain />} />
            <Route path="/kiosk" element={<KioskMain />} />
            <Route path="/pos" element={<PosMain />} />
            <Route path="/auth" element={<AuthMain />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
