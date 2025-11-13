import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';
import logo from "../assets/logo.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Email validation (fix invalid domains)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Por favor, insira um email válido (ex: nome@dominio.com)!");
      setIsSuccess(false);
      return;
    }

    // ✅ Confirm password validation (signup only)
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage("As senhas não coincidem!");
      setIsSuccess(false);
      return;
    }

    const endpoint = isLogin ? 'login' : 'signup';
   const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

const url = `${API_BASE_URL}/api/auth/${endpoint}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro desconhecido');

      setMessage(data.message);
      setIsSuccess(true);

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // ✅ Redirect based on role
        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate('/admin-dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      } else {
        setTimeout(() => {
          setIsLogin(true);
          setMessage('');
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        }, 2000);
      }
    } catch (error) {
      setMessage(error.message);
      setIsSuccess(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg">
        <div className="login-bg-gradient"></div>
        <div className="login-bg-circle-1"></div>
        <div className="login-bg-circle-2"></div>
      </div>

      <div className="login-content">
        <div className="login-header">
          <div className="login-logo">
            <img src={logo} alt="VGD Logo" />
          </div>
          <p className="login-subtitle">
            {isLogin
              ? 'Entre para acessar conteúdo exclusivo'
              : 'Crie sua conta e acesse conteúdo premium'}
          </p>
        </div>

        <div className="login-card">
          {message && (
            <div className={`alert-message ${isSuccess ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="login-tabs">
            <button
              onClick={() => setIsLogin(true)}
              className={`login-tab ${isLogin ? 'login-tab-active' : ''}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`login-tab ${!isLogin ? 'login-tab-active' : ''}`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="form-input"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirmar Senha</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
              </div>
            )}

            {isLogin && (
              <div className="forgot-password">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="forgot-password-btn"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            )}

            <button type="submit" className="submit-button">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
