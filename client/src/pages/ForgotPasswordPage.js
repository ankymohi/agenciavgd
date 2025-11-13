import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../Login.css"; // reuse your existing login styles
import logo from "../assets/logo.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Por favor, insira seu e-mail.");
      setIsSuccess(false);
      return;
    }

    const url =
      window.location.hostname === "localhost"
        ? "http://localhost:5000/api/auth/forgot-password"
        : "https://hnyclb.online/api/auth/forgot-password";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro desconhecido");

      setMessage("Link de redefinição enviado! Verifique seu e-mail 📩");
      setIsSuccess(true);
      setEmail("");
    } catch (error) {
      setMessage(error.message || "Erro ao enviar link de redefinição");
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
            Redefina sua senha em poucos segundos.
          </p>
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
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-button">
              Enviar Link de Redefinição
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="back-button"
            >
              <ArrowLeft size={16} style={{ marginRight: "6px" }} />
              Voltar para Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
