import React, { useState } from "react";
import { Check, Shield, Star, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./VGD.css";
import logo from "../assets/logo.png";

// Import local gallery images

import img1 from "../assets/photo1.jpg";
import img2 from "../assets/photo2.jpg";
import img3 from "../assets/photo3.jpg";
import img4 from "../assets/photo4.jpg";



export default function VGDSubscriptionPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const navigate = useNavigate();

  

  const plans = [
    {
      name: "Pack 1",
      price: "34,99",
      icon: <Star className="w-6 h-6" />,
      features: [
        "40 mídias exclusivas (fotos e vídeos)",
        "Qualidade HD",
        "Entrega imediata",
      ],
    },
    {
      name: "Pack 2",
      price: "74,99",
      icon: <Crown className="w-6 h-6" />,
      popular: true,
      features: [
        "70 mídias exclusivas (fotos e vídeos)",
        "Qualidade Full HD",
        "Atendimento prioritário",
      ],
    },
    {
      name: "Pack 3",
      price: "129,99",
      icon: <Sparkles className="w-6 h-6" />,
      features: [
        "120 mídias exclusivas (fotos e vídeos)",
        "Grupo VIP",
        "Descontos exclusivos em novos conteúdos",
        "Atendimento prioritário",
      ],
    },
  ];

  const faqs = [
    {
      question: "Como funciona a compra e o acesso aos conteúdos?",
      answer:
        "Após a confirmação do pagamento, você receberá acesso imediato ao conteúdo exclusivo diretamente na sua conta.",
    },
    {
      question: "As prévias são desfocadas. O conteúdo final também?",
      answer:
        "Não! As prévias são desfocadas apenas para proteção. Todo o conteúdo final é em alta qualidade, sem desfoque.",
    },
    {
      question: "Quais formas de pagamento você aceita?",
      answer:
        "Aceitamos PIX (instantâneo) e cartão de crédito em até 12x sem juros.",
    },
  ];

  const handlePlanClick = (planName) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.username) return setShowLoginToast(true);
      navigate("/CheckoutPage", { state: { plan: planName } });
    } catch {
      setShowLoginToast(true);
    }
  };

  const handleWatchNow = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.username) return setShowLoginToast(true);
      navigate("/dashboard");
    } catch {
      setShowLoginToast(true);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="vgd-page-container">
      {/* ✅ Login Toast */}
      {showLoginToast && (
        <>
          <div
            className="vgd-login-overlay"
            onClick={() => setShowLoginToast(false)}
          />
          <div className="vgd-login-toast">
            <div className="vgd-toast-icon-wrapper">
              <Shield className="vgd-toast-icon" />
            </div>
            <h3 className="vgd-toast-title">Login Necessário</h3>
            <p className="vgd-toast-message">
              Faça login para acessar este conteúdo exclusivo e começar a aproveitar!
            </p>
            <button
              className="vgd-toast-button"
              onClick={() => {
                setShowLoginToast(false);
                navigate("/login");
              }}
            >
              Fazer Login Agora
            </button>
          </div>
        </>
      )}

      {/* ✅ Header */}
      <header className="vgd-header">
        <div className="vgd-header-content">
          <div className="vgd-header-left">
            <div className="vgd-logo">
              <img src={logo} alt="VGD Logo" />
            </div>
          </div>
          <div className="vgd-auth-buttons">
            <button
              className="vgd-btn-login"
              onClick={() => navigate("/login")}
            >
              Seja um membro
            </button>
            <button
              className="vgd-btn-login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="vgd-btn-signup"
              onClick={() => navigate("/login")}
            >
              Sign Up
            </button>
            
          </div>
        </div>
      </header>

<section className="vgd-hero">
  <div className="vgd-hero-content">
    <h1 className="vgd-hero-title">
      Ele vem de moto, volta deixando saudade.<br />
      Nickboy — seu corre 
      <span className="vgd-hero-18-badge">+18 </span>
    </h1>
    <button className="vgd-hero-btn">Assine agora</button>
  </div>
</section>




      {/* GALLERY SECTION */}
      <section id="gallery" className="vgd-gallery">
        <h2 className="vgd-hero-title">Amostras (pré-visualização)</h2>
        <p>O conteúdo completo estará disponível após a compra de um plano.</p>
        <div className="vgd-gallery-grid">
          {[img1, img2, img3, img4,].map((image, i) => (
  <div key={i} className="vgd-gallery-item">
    <img src={image} alt={`Preview ${i + 1}`} />
    <span className="vgd-preview-badge">Prévia</span>
  </div>
))}

        </div>
      </section>

      {/* ✅ Subscription Plans */}
      <section className="vgd-section">
        <h3 className="vgd-section-title vgd-text-center">Planos de Assinatura</h3>
        <div className="vgd-plans-container">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`vgd-plan-card ${
                plan.popular ? "vgd-plan-popular" : ""
              }`}
            >
              {plan.popular && <div className="vgd-popular-badge">Mais Popular</div>}
              <div className="vgd-plan-icon">{plan.icon}</div>
              <h4 className="vgd-plan-name">{plan.name}</h4>
              <div className="vgd-plan-price">R$ {plan.price}</div>
              <ul className="vgd-features-list">
                {plan.features.map((feature, i) => (
                  <li key={i} className="vgd-feature-item">
                    <Check className="vgd-check-icon" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanClick(plan.name)}
                className="vgd-btn-primary vgd-btn-full"
              >
                🎬 Assinar Agora
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ FAQ */}
      <section className="vgd-section">
        <h3 className="vgd-section-title vgd-text-center">Dúvidas Frequentes</h3>
        <div className="vgd-faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`vgd-faq-item ${
                expandedFaq === index ? "vgd-faq-active" : ""
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="vgd-faq-button"
              >
                <span className="vgd-faq-question">{faq.question}</span>
                <span
                  className={`vgd-faq-arrow ${
                    expandedFaq === index ? "vgd-faq-arrow-open" : ""
                  }`}
                >
                  ▸
                </span>
              </button>
              {expandedFaq === index && (
                <div className="vgd-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="vgd-footer">
        <p className="vgd-footer-text">©️ 2025 Agência VGD — Todos os direitos reservados.</p>
        <p className="vgd-footer-subtext">
          Este site é destinado a maiores de 18 anos. Ao continuar,<br />
          você declara ser maior de idade.
        </p>
      </footer>

      {/* ✅ Floating Button */}
      <button
        onClick={handleWatchNow}
        className="vgd-floating-button"
        aria-label="Watch Now"
      >
        🎬
      </button>
    </div>
  );
}
