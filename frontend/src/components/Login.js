import React, { useState } from 'react';
import { login, signup } from '../services/trainApi';

const Login = ({ onLogin, setMessage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation
    if (!formData.username.trim()) {
      setMessage('Username is required!');
      return;
    }
    
    if (formData.username.includes(' ')) {
      setMessage('Username cannot contain spaces!');
      return;
    }
    
    if (formData.username.length < 3) {
      setMessage('Username must be at least 3 characters long!');
      return;
    }
    
    if (!formData.password) {
      setMessage('Password is required!');
      return;
    }
    
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long!');
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login(formData.username.trim(), formData.password);
      } else {
        result = await signup(formData.username.trim(), formData.password);
      }

      if (result.success) {
        if (isLogin) {
          onLogin(result.user);
        } else {
          setMessage('Sign up successful! Please login.');
          setIsLogin(true);
          setFormData({ username: '', password: '' });
        }
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="tabs">
        <button 
          className={`tab ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button 
          className={`tab ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username (min 3 characters)"
            minLength="3"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password (min 6 characters)"
            minLength="6"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>
    </div>
  );
};

export default Login;