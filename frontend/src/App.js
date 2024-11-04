import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

// Import all pages
import { MenuMain } from './pages/menu';
import { KitchenMain } from './pages/kitchen';
import { ManagerMain } from './pages/manager';
import { KioskMain, KioskLanding, OrderSelection } from './pages/kiosk';
import { PosMain } from './pages/pos';
import { AuthMain } from './pages/auth';

//Import secondary pages
import { SignUpPage } from './pages/auth/SignUpPage.js';
import { SignUpError } from './pages/auth/SignUpError.js';
import { SignUpSuccess } from './pages/auth/SignUpSuccess.js';

function App() {
  return (
    <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="container-fluid d-flex justify-content-center vh-100 pt-5">
                  <header className="App-header">
                    <nav><Link to="/menu">Menu Board</Link></nav>
                    <nav><Link to="/kitchen">Kitchen</Link></nav>
                    <nav><Link to="/manager">Manager</Link></nav>
                    <nav><Link to="/kiosk">Customer Kiosk</Link></nav>
                    <nav><Link to="/pos">Cashier POS</Link></nav>
                    <nav><Link to="/auth">Login</Link></nav>
                  </header>
                </div>
              </>
            }
          />
          <Route path="/menu" element={<MenuMain />} />

          <Route path="/kitchen" element={<KitchenMain />} />

          <Route path="/manager" element={<ManagerMain />} />

          <Route path="/kiosk" element={<KioskLanding />} />
          <Route path="/kiosk/order" element={<KioskMain />} />
          <Route path="/kiosk/order/:itemName" element={<OrderSelection />} />

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
