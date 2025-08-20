import { useState } from "react";
import { register } from "../api";
import '../styles/App.css';

export default function Register({ navigate }) {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: ''
  });
  const [banner, setBanner] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner(null);

    // Password confirmation check
    if (formData.password !== formData.confirm_password) {
      setBanner("Error: Passwords do not match");
      return;
    }

    const res = await register(
      formData.email,
      formData.first_name,
      formData.last_name,
      formData.password
    );

    // Corrected logic to handle success or error banners
    if (res.error) {
      setBanner("Error: " + res.error);
    } else if (res.success) {
      setBanner("Success: " + res.success);
      
      // Clear form on success
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: ''
      });
      // Optionally navigate to login automatically
      // navigate('login');
    }
  };

  return (
    <div className="centered-card">
      <h2 className="card-title">Register</h2>
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
            name="email"
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            name="first_name"
            placeholder="First Name" 
            value={formData.first_name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            name="last_name"
            placeholder="Last Name" 
            value={formData.last_name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            className="form-control" 
            name="password"
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            className="form-control" 
            name="confirm_password"
            placeholder="Confirm Password" 
            value={formData.confirm_password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">Register</button>
      </form>
      <p className="text-center mt-3 link-text" onClick={() => navigate('login')}>
        Already have an account? Login
      </p>
    </div>
  );
}