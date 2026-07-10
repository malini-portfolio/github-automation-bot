import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="app-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="main-content">
                <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
            </main>
        </div>
    );
}

export default App;
    