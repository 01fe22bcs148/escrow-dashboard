import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (value) => {
    if (!value.trim()) {
      return 'Email is required.';
    }
    // Simple email pattern
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = validateEmail(email);
    setError(msg);
    setTouched(true);
    if (!msg) {
      onLogin(email.trim());
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched) {
      setError(validateEmail(value));
    }
  };

  return (
    <div className="login-container">
      <h2 className="section-title">User Login</h2>
      <p className="section-description">
        Please enter a valid email ID to access the Stock Broker Client Dashboard.
      </p>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label className="form-label">
          Email Address
          <input
            type="email"
            className={`form-input ${error ? 'input-error' : ''}`}
            placeholder="name@example.com"
            value={email}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
          />
        </label>
        {error && <div className="error-text">{error}</div>}

        <button
          type="submit"
          className="primary-button"
        >
          Login
        </button>
      </form>
    </div>
  );
}
