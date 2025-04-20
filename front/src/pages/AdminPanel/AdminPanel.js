// src/components/AdminPanel/AdminPanel.js
import React, { useState } from "react";
import "./AdminPanel.css";
import Halls from "./Halls/Halls";
import Movies from "./Movies/Movies";
import Seats from "./Seats/Seats";
import Seances from "./Seances/Seances";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("halls");

  return (
    <div className="admin-panel">
      <div className="tabs">
        <button
          className={activeTab === "halls" ? "active-tab" : ""}
          onClick={() => setActiveTab("halls")}
        >
          Залы
        </button>
        <button
          className={activeTab === "movies" ? "active-tab" : ""}
          onClick={() => setActiveTab("movies")}
        >
          Фильмы
        </button>
        <button
          className={activeTab === "seats" ? "active-tab" : ""}
          onClick={() => setActiveTab("seats")}
        >
          Места
        </button>
        <button
          className={activeTab === "seances" ? "active-tab" : ""}
          onClick={() => setActiveTab("seances")}
        >
          Сеансы
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "halls" && <Halls />}
        {activeTab === "movies" && <Movies />}
        {activeTab === "seats" && <Seats />}
        {activeTab === "seances" && <Seances />}
      </div>
    </div>
  );
};

export default AdminPanel;
