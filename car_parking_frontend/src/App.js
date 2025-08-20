import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import ParkingLot from "./components/ParkingLot";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [page, setPage] = useState(token ? 'parking' : 'login');

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPage('login');
  }

  const navigate = (p) => setPage(p);

  // This function combines setting the token and navigating to the next page.
  const handleLogin = (jwtToken) => {
    setToken(jwtToken);
    setPage('parking');
  };

  return (
    <div>
      {token && <button className="logout-button" onClick={logout}>Logout</button>}
      
      {/* Pass the handleLogin function as the 'onLogin' prop */}
      {page === 'login' && <Login onLogin={handleLogin} navigate={navigate} />}
      
      {page === 'register' && <Register navigate={navigate} />}
      {page === 'parking' && token && <ParkingLot token={token} />}
    </div>
  );
}