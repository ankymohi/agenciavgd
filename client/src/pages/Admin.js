import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Upload, CreditCard, Menu, X, Trash2, Edit } from "lucide-react";

const API_URL = "http://localhost:5000/api/admin";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [media, setMedia] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  // ✅ Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("API fetch failed, using demo data:", err);
        // fallback demo data if API fails
        setUsers([
          { _id: 1, name: "John Doe", email: "john@example.com", plan: "Premium", status: "active" },
          { _id: 2, name: "Jane Smith", email: "jane@example.com", plan: "Starter", status: "active" },
          { _id: 3, name: "Mike Johnson", email: "mike@example.com", plan: "Prime VIP", status: "inactive" },
        ]);
      }
    };
    fetchUsers();
  }, [token]);

  // ✅ Delete user
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir usuário.");
    }
  };

  // ✅ Change user plan
  const handlePlanChange = async (id, plan) => {
    try {
      await axios.put(
        `${API_URL}/users/${id}/plan`,
        { plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u._id === id ? { ...u, plan } : u)));
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar plano.");
    }
  };

  // ✅ File upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const fileType = file.type.startsWith("image/") ? "image" : "video";
      const fileSize = (file.size / (1024 * 1024)).toFixed(2) + "MB";
      const reader = new FileReader();

      reader.onload = (event) => {
        const newMedia = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: fileType,
          size: fileSize,
          preview: event.target.result,
        };
        setMedia((prev) => [...prev, newMedia]);
      };

      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // ✅ Delete media
  const handleDeleteMedia = (id) => {
    setMedia(media.filter((m) => m.id !== id));
  };

  // ✅ Delete subscription
  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "250px" : "0",
          backgroundColor: "#0f172a",
          color: "white",
          transition: "width 0.3s",
          overflow: "hidden",
          position: "fixed",
          height: "100vh",
          zIndex: 1000,
        }}
      >
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h2 style={{ margin: 0, fontSize: "24px" }}>Admin Panel</h2>
            <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
              <X size={24} />
            </button>
          </div>

          <button
            onClick={() => setActiveTab("users")}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "10px",
              backgroundColor: activeTab === "users" ? "#8b5cf6" : "transparent",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "16px",
            }}
          >
            <Users size={20} />
            Users
          </button>

          <button
            onClick={() => setActiveTab("media")}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "10px",
              backgroundColor: activeTab === "media" ? "#8b5cf6" : "transparent",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "16px",
            }}
          >
            <Upload size={20} />
            Media
          </button>

          <button
            onClick={() => setActiveTab("subscriptions")}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: activeTab === "subscriptions" ? "#8b5cf6" : "transparent",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "16px",
            }}
          >
            <CreditCard size={20} />
            Subscriptions
          </button>
        </div>
      </div>

      {/* Header + Content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? "250px" : "0", transition: "margin-left 0.3s" }}>
        <div style={{ backgroundColor: "white", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Menu size={24} />
          </button>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Dashboard</h1>
        </div>

        <div style={{ padding: "30px" }}>
          {activeTab === "users" && <p>Users list appears here.</p>}
          {activeTab === "media" && <p>Media manager appears here.</p>}
          {activeTab === "subscriptions" && <p>Subscriptions manager appears here.</p>}
        </div>
      </div>
    </div>
  );
}
