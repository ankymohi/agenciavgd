import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // quick UX: show a message then update user's plan by calling your update-plan API
    // NOTE: this is NOT secure — prefer server-side webhook verification
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status") || params.get("collection_status");
    if (status === "approved" || status === "paid") {
      // you can call your backend /api/auth/update-plan here to grant access (quick method)
      // fetch("http://localhost:5000/api/auth/update-plan", { ... })
      // then navigate to dashboard
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  }, [navigate]);

  return <div style={{ padding: 24 }}>Pagamento concluído — Obrigado! Redirecionando...</div>;
}
