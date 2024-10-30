import { useState } from "react";
import api from '../../services/api'; // Axios instance with base URL
import '../../styles/auth.css';
import logo from '../../assets/beast_mode_logo.png'

function AuthMain() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", { username, password });
      setLoginMessage(response.data.message);
    } catch (error) {
      setLoginMessage("Login failed. Please try again.");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="container-fluid d-flex vh-100 align-items-center justify-content-center">
      <div className="row align-items-center justify-content-center w-100">
        <div className="col-md-4 col-sm-8">
        </div>
        <div className="col-md-4 offset-md-2 col-sm-8">
          <div className="login-container">
            <img src={logo} alt="Logo" className="img-fluid mb-3 w-10 h-10" />
            <h1>Welcome</h1>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control my-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control my-2"
              />
              <button type="submit" className="btn btn-primary mt-3">Login</button>
            </form>
            {loginMessage && <p>{loginMessage}</p>}
          </div>
        </div>
      </div>
    </div>

  );
}

export default AuthMain;
