import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Crown,
  Download,
  Play,
  Lock,
  Star,
  Calendar,
  TrendingUp,
  Heart,
  User,
  Settings,
  LogOut,
  Search,
  Filter,
  Grid,
  List,
} from "lucide-react";
import "../Dashboard.css";
import { useNavigate } from "react-router-dom"; // ✅ add this line
import logo from "../assets/logo.png";
export default function SubscriberDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [likedItems, setLikedItems] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // ✅ Get user first
  const user = JSON.parse(localStorage.getItem("user"));
  const plan = user?.plan?.toLowerCase() || "basic"; // fallback to 'basic' if not found

  // ✅ Then define your CDN URL
  const CDN_BASE_URL = `https://imagesadult.b-cdn.net/${plan}/`;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/images/${plan}`)
      .then((res) => setImages(res.data))
      .catch((err) => console.error("Error loading images:", err));
  }, [plan]);

  const [userInfo, setUserInfo] = useState({
    name: "Usuário",
    email: "usuario@email.com",
    plan: "Nenhum Plano",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const planName = user.plan
        ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1)
        : "Nenhum Plano";

      setUserInfo({
        name: user.name || "Usuário",
        email: user.email || "usuario@email.com",
        plan: planName,
      });
    }
  }, []);

  const navigate = useNavigate();
  // Inside your SubscriberDashboard component
  const [planInfo, setPlanInfo] = useState({
    name: "Nenhum Plano",
    status: "Inativo",
    validUntil: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.plan) {
      let planName = user.plan.charAt(0).toUpperCase() + user.plan.slice(1);
      let validity = new Date();
      validity.setFullYear(validity.getFullYear() + 1); // 1-year validity

      setPlanInfo({
        name: `Plano ${planName}`,
        status: "Ativo ✅",
        validUntil: validity.toLocaleDateString("pt-BR"),
      });
    } else {
      setPlanInfo({
        name: "Nenhum Plano",
        status: "Inativo ❌",
        validUntil: null,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    navigate("/login"); // Redirect to login page
    window.location.reload(); // Optional: reload to reset state
  };

  const userPlan = {
    name: "Premium",
    tier: "premium",
    expiryDate: "2025-12-30",
    mediaAccess: 70,
    mediaViewed: 45,
  };

  const mediaContent = images.map((img, index) => ({
    id: index + 1,
    type: "photo",
    title: img.name,
    date: new Date().toISOString(),
    locked: false,
    thumbnail: `${CDN_BASE_URL}${img.name}`,
    views: Math.floor(Math.random() * 500) + 50,
  }));

  const toggleLike = (id) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredContent = mediaContent.filter((item) => {
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (activeTab === "all") return true;
    if (activeTab === "photos") return item.type === "photo";
    if (activeTab === "videos") return item.type === "video";
    if (activeTab === "favorites") return likedItems.includes(item.id);
    return true;
  });
  // Pagination setup
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate indexes
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContent.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

  if (!user || user.plan === "free") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Circles */}
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: "40px",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        ></div>
        <div
          style={{
            position: "fixed",
            top: "160px",
            right: "40px",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "pulse 4s ease-in-out infinite 1s",
          }}
        ></div>

        {/* Content Container */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          {/* Lock Icon */}
          <div
            style={{
              width: "100px",
              height: "100px",

              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",

              animation: "bounce 3s ease-in-out infinite",
            }}
          >
            <img src={logo} alt="VGD Logo" />
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(2rem, 8vw, 4.5rem)",
              fontWeight: "bold",
              marginBottom: "20px",
              background:
                "linear-gradient(90deg, rgb(153 17 27), rgb(228 193 153), rgb(210 19 37))",

              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            You're on the Free Plan
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 3vw, 1.5rem)",
              color: "#d1d5db",
              marginBottom: "15px",
              maxWidth: "600px",
            }}
          >
            Unlock a world of exclusive premium content
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              color: "#9ca3af",
              marginBottom: "40px",
            }}
          >
            <TrendingUp size={16} style={{ color: "#ec4899" }} />
            <span>Join 10,000+ premium subscribers</span>
          </div>

          {/* Feature Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "15px",
              width: "100%",
              maxWidth: "900px",
              marginBottom: "40px",
            }}
          >
            {[
              { Icon: Star, text: "Unlimited HD Photos" },
              { Icon: Play, text: "Exclusive Videos" },
              { Icon: Download, text: "Download Access" },
              { Icon: Heart, text: "VIP Community" },
              { Icon: Crown, text: "Priority Support" },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "20px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      background:
                        "linear-gradient(90deg, rgb(153 17 27), rgb(228 193 153), rgb(210 19 37))",
                      borderRadius: "8px",
                    }}
                  >
                    <feature.Icon size={18} color="white" />
                  </div>
                  <Lock size={14} style={{ color: "#9ca3af" }} />
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#d1d5db",
                  }}
                >
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/CheckoutPage")}
            style={{
              background:
                "linear-gradient(90deg, rgb(153 17 27), rgb(228 193 153), rgb(210 19 37))",
              color: "#fff",
              border: "none",
              padding: "18px 48px",
              borderRadius: "50px",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 40px rgba(236, 72, 153, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 15px 50px rgba(236, 72, 153, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 10px 40px rgba(236, 72, 153, 0.4)";
            }}
          >
            <Crown size={24} />
            View Subscription Plans
            <Star size={24} />
          </button>

          <p
            style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "30px" }}
          >
            🔒 Secure payment • Cancel anytime • No hidden fees
          </p>

          {/* Trust Badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "30px",
              justifyContent: "center",
              fontSize: "13px",
              color: "#9ca3af",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#10b981" }}>✓</span>
              <span>SSL Encrypted</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#10b981" }}>✓</span>
              <span>Money-back Guarantee</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#10b981" }}>✓</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* CSS Animation */}
        <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <div className="dashboard-logo">
              <img src={logo} alt="VGD Logo" />
            </div>
            <div>
              <p className="dashboard-subtitle">Área do Assinante</p>
            </div>
          </div>

          <div className="dashboard-header-right">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="icon-button"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="icon-button"
            >
              <Settings size={20} />
            </button>
            <div className="profile-dropdown-wrapper">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="profile-avatar"
              >
                <User size={20} />
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-info">
                      <div className="profile-dropdown-avatar">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="profile-dropdown-name">
                          {" "}
                          {userInfo.name}
                        </p>
                        <p className="profile-dropdown-email">
                          {userInfo.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-dropdown-menu">
                    <button className="profile-dropdown-item"onClick={() => setShowSettings(true)}>
                      <User size={16} />
                      <span>Meu Perfil</span>
                    </button>
                    <button className="profile-dropdown-item"onClick={() => {
                setShowSettings(false);
                navigate("/CheckoutPage");
              }}>
                      <Crown size={16} />
                      <span>Minha Assinatura</span>
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="profile-dropdown-item"
                    >
                      <Settings size={16} />
                      <span>Configurações</span>
                    </button>
                    <div className="profile-dropdown-divider"></div>
                    <button onClick={handleLogout} className="logout-button">
                      <LogOut size={20} />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showSearch && (
          <div className="search-bar-wrapper">
            <div className="search-bar-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar conteúdo..."
                className="search-input"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="search-clear"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </header>

     {/* Settings Modal */}
{showSettings && (
  <div className="modal-overlay" onClick={() => setShowSettings(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title">Configurações</h2>
        <button onClick={() => setShowSettings(false)} className="modal-close">
          ✕
        </button>
      </div>

      {/* Profile Edit Section */}
      <div className="modal-body">
        <div className="settings-section">
          <h3 className="settings-section-title">Editar Perfil</h3>
          <div className="settings-form">
            <label className="settings-label">Nome</label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              className="settings-input"
            />

           

            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("user")) || {};
                const updatedUser = {
                  ...user,
                  name: userInfo.name,
                  email: userInfo.email,
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                alert("Perfil atualizado com sucesso!");
                setShowSettings(false);
                window.location.reload(); // refresh dashboard with new info
              }}
              className="save-button"
            >
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-section">
          <h3 className="settings-section-title">Senha e Segurança</h3>
          <button className="settings-item"onClick={() => {
                setShowSettings(false);
                navigate("/CheckoutPage");
              }}>
            <div className="settings-item-content">
              <Lock size={20} />
              <div className="settings-item-text">
                <p>Alterar Senha</p>
                <span>Atualize sua senha de login</span>
              </div>
            </div>
            <span className="settings-item-arrow">›</span>
          </button>
        </div>

        {/* Subscription Section */}
        <div className="settings-section">
          <h3 className="settings-section-title">Assinatura</h3>
          <div className="settings-items">
            <button
              className="settings-item"
              onClick={() => {
                setShowSettings(false);
                navigate("/CheckoutPage");
              }}
            >
              <div className="settings-item-content">
                <Crown size={20} className="text-yellow" />
                <div className="settings-item-text">
                  <p>Plano Premium</p>
                  <span>{planInfo.validUntil || "Ativo"}</span>
                </div>
              </div>
              <span className="settings-item-arrow">›</span>
            </button>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-button">
          <LogOut size={20} />
          <span>Sair da Conta</span>
        </button>
      </div>
    </div>
  </div>
)}

      {/* User Stats Banner */}
      <section className="stats-banner">
        <div className="stats-banner-card">
          <div className="stats-banner-header">
            <div className="stats-banner-icon">
              <Crown size={32} />
            </div>
            <div className="stats-banner-info">
              <div className="stats-banner-title-row">
                <h2 className="stats-banner-title"> {planInfo.name}</h2>
                <span className="stats-badge">Ativo</span>
              </div>
              <p className="stats-banner-date">
                Válido até{" "}
                {new Date(userPlan.expiryDate).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <section className="quick-stats">
            <div className="quick-stats-grid">
              <div className="quick-stat-card">
                <div className="quick-stat-icon quick-stat-icon-purple">
                  <TrendingUp size={20} />
                </div>
                <div className="quick-stat-info">
                  <div className="quick-stat-number">156</div>
                  <div className="quick-stat-label">Total Views</div>
                </div>
              </div>

              <div className="quick-stat-card">
                <div className="quick-stat-icon quick-stat-icon-pink">
                  <Heart size={20} />
                </div>
                <div className="quick-stat-info">
                  <div className="quick-stat-number">{likedItems.length}</div>
                  <div className="quick-stat-label">Favoritos</div>
                </div>
              </div>

              <div className="quick-stat-card">
                <div className="quick-stat-icon quick-stat-icon-orange">
                  <Download size={20} />
                </div>
                <div className="quick-stat-info">
                  <div className="quick-stat-number">28</div>
                  <div className="quick-stat-label">Downloads</div>
                </div>
              </div>

              <div className="quick-stat-card">
                <div className="quick-stat-icon quick-stat-icon-green">
                  <Calendar size={20} />
                </div>
                <div className="quick-stat-info">
                  <div className="quick-stat-number">47</div>
                  <div className="quick-stat-label">Dias Restantes</div>
                </div>
              </div>
            </div>
          </section>
          <br></br>

          <div className="progress-section">
            <div className="progress-header">
              <span>Progresso de visualização</span>
              <span>
                {Math.round(
                  (userPlan.mediaViewed / userPlan.mediaAccess) * 100
                )}
                %
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    (userPlan.mediaViewed / userPlan.mediaAccess) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="content-filters">
          <div className="filter-tabs">
            <button
              onClick={() => setActiveTab("all")}
              className={`filter-tab ${
                activeTab === "all" ? "filter-tab-active" : ""
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`filter-tab ${
                activeTab === "photos" ? "filter-tab-active" : ""
              }`}
            >
              📷 Fotos
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`filter-tab ${
                activeTab === "videos" ? "filter-tab-active" : ""
              }`}
            >
              🎥 Vídeos
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`filter-tab ${
                activeTab === "favorites" ? "filter-tab-active" : ""
              }`}
            >
              ❤️ Favoritos
            </button>
          </div>

          <div className="content-controls">
            <div className="item-count">
              {filteredContent.length}{" "}
              {filteredContent.length === 1 ? "item" : "itens"}
            </div>
            <div className="view-controls">
              <button className="control-button">
                <Filter size={18} />
              </button>
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`view-button ${
                    viewMode === "grid" ? "view-button-active" : ""
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`view-button ${
                    viewMode === "list" ? "view-button-active" : ""
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Grid/List */}
        <div className={viewMode === "grid" ? "media-grid" : "media-list"}>
          {currentItems.map((item) => (
            <div
              key={item.id}
              className={viewMode === "grid" ? "media-card" : "media-list-item"}
            >
              {viewMode === "grid" ? (
                <>
                  <div className="media-thumbnail-wrapper">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className={`media-thumbnail ${
                        item.locked ? "media-locked-blur" : ""
                      }`}
                    />

                    {item.locked && (
                      <div className="media-locked-overlay">
                        <Lock size={32} />
                        <p className="media-locked-text">VIP Only</p>
                      </div>
                    )}

                    {!item.locked && (
                      <>
                        {item.type === "video" && (
                          <div className="video-duration">
                            <Play size={12} />
                            {item.duration}
                          </div>
                        )}

                        <button
                          onClick={() => toggleLike(item.id)}
                          className={`like-button ${
                            likedItems.includes(item.id)
                              ? "like-button-active"
                              : ""
                          }`}
                        >
                          <Heart
                            size={16}
                            className={
                              likedItems.includes(item.id) ? "heart-filled" : ""
                            }
                          />
                        </button>

                        <div className="media-hover-overlay">
                          <div className="media-actions">
                            <button
                              className="action-button action-button-primary"
                              onClick={() => setSelectedImage(item.thumbnail)}
                            >
                              {item.type === "video" ? "Assistir" : "Ver"}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="media-info">
                    <h3 className="media-title">{item.title}</h3>
                    <div className="media-meta">
                      <span>
                        {new Date(item.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                      <span className="media-views">{item.views} views</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="list-thumbnail-wrapper">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className={`list-thumbnail ${
                        item.locked ? "media-locked-blur" : ""
                      }`}
                    />
                    {item.locked && (
                      <div className="list-locked-overlay">
                        <Lock size={20} />
                      </div>
                    )}
                    {!item.locked && item.type === "video" && (
                      <div className="list-play-overlay">
                        <Play size={20} />
                      </div>
                    )}
                  </div>

                  <div className="list-info">
                    <h3 className="list-title">{item.title}</h3>
                    <div className="list-meta">
                      <span>
                        {item.type === "video" ? "🎥 Vídeo" : "📷 Foto"}
                      </span>
                      <span className="list-date">
                        {new Date(item.date).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="list-views">{item.views} views</span>
                    </div>
                  </div>

                  {!item.locked && (
                    <div className="list-actions">
                      <button
                        onClick={() => toggleLike(item.id)}
                        className={`list-like-button ${
                          likedItems.includes(item.id) ? "list-like-active" : ""
                        }`}
                      >
                        <Heart
                          size={16}
                          className={
                            likedItems.includes(item.id) ? "heart-filled" : ""
                          }
                        />
                      </button>
                      <button className="list-action-button">
                        {item.type === "video" ? "Assistir" : "Ver"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
{/* Pagination Controls */}
{totalPages > 1 && (
  <div className="pagination">
    <button 
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
      disabled={currentPage === 1}
    >
      ← Prev
    </button>
    
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={currentPage === index + 1 ? "active" : ""}
      >
        {index + 1}
      </button>
    ))}
    
    <button 
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
      disabled={currentPage === totalPages}
    >
      Next →
    </button>
  </div>
)}

        {filteredContent.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Heart size={40} />
            </div>
            <h3 className="empty-title">Nenhum conteúdo encontrado</h3>
            <p className="empty-text">Tente selecionar um filtro diferente</p>
          </div>
        )}
      </section>

      {/* Upgrade Banner */}
      <section className="upgrade-banner">
        <div className="upgrade-card">
          <Crown size={48} className="upgrade-icon" />
          <h3 className="upgrade-title">Desbloqueie Conteúdo VIP</h3>
          <p className="upgrade-text">
            Faça upgrade para o plano Prime VIP e tenha acesso a 120 mídias
            exclusivas, grupo VIP e muito mais!
          </p>
          <button className="upgrade-button"onClick={() => {
                setShowSettings(false);
                navigate("/CheckoutPage");
              }}>💬 Fazer Upgrade Agora</button>
        </div>
      </section>
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
          onClick={() => setSelectedImage(null)}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            // Detect screenshot shortcuts
            if (
              e.key === "PrintScreen" ||
              (e.metaKey &&
                e.shiftKey &&
                (e.key === "3" || e.key === "4" || e.key === "5")) || // Mac
              (e.metaKey && e.shiftKey && e.key === "s") || // Mac Shift+Cmd+S
              (e.ctrlKey && e.key === "p") || // Print
              e.key === "F12" // DevTools
            ) {
              e.preventDefault();
              alert("⚠️ Screenshots are not allowed for content protection");
            }
          }}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              width: "48px",
              height: "48px",
              backgroundColor: "#dc2626",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              border: "2px solid white",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
              zIndex: 1000000,
              userSelect: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#b91c1c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#dc2626")
            }
          >
            ✕
          </button>

          {/* Image Container with Protection */}
          <div
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              userSelect: "none",
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
            }}
          >
            <img
              src={selectedImage}
              alt="Preview"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: "8px",
                pointerEvents: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
                WebkitUserDrag: "none",
                WebkitTouchCallout: "none",
              }}
            />

            {/* Invisible Protection Overlay */}
            <div
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                cursor: "default",
                userSelect: "none",
              }}
            />

            {/* Watermark Overlay */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "rgba(255, 255, 255, 0.15)",
                fontSize: "48px",
                fontWeight: "bold",
                pointerEvents: "none",
                userSelect: "none",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                whiteSpace: "nowrap",
              }}
            >
              hnyclb.online
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
