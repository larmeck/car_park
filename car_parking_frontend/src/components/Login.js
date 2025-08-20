import { useState } from "react";
import { login } from "../api";
import '../styles/App.css';

export default function Login({ navigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [banner, setBanner] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner(null);

    const res = await login(email, password);

    if (res.error) {
      setBanner(res.error);
    } else {
      setBanner(res.success);
      // Store the token from the response in local storage
      localStorage.setItem('token', res.token);
      // Pass the token up to the parent component
      onLogin(res.token);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="centered-card">
      <h2 className="card-title">Login</h2>
      {banner && (
        <div className={`alert ${banner.toLowerCase().includes('error') ? 'alert-danger' : 'alert-success'}`}>
          {banner}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input 
            type="email" 
            className="form-control" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            className="form-control" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
      <p className="text-center mt-3 link-text" onClick={() => navigate('register')}>
        Don't have an account? Register
      </p>
    </div>
  );
}