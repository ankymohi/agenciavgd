import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import "../Login.css"; // reuse same styles as login/forgot
import logo from "../assets/logo.png";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("Por favor, preencha ambos os campos.");
      setIsSuccess(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    const url =
      window.location.hostname === "localhost"
        ? "http://localhost:5000/api/auth/reset-password"
        : "https://hnyclb.online/api/auth/reset-password";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao redefinir senha");

      setIsSuccess(true);
      setMessage("Senha redefinida com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.message);
    } finally {
      setLoading(false);
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
          <p className="login-subtitle">Defina uma nova senha segura.</p>
        </div>

        <div className="login-card">
          {message && (
            <div className={`alert-message ${isSuccess ? "success" : "error"}`}>
              {isSuccess ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span style={{ marginLeft: "6px" }}>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Nova Senha</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Senha</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  className="form-input"
                />
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
