import "./Sidebar.css";
import { FiGrid, FiGithub, FiSliders, FiBell, FiLogOut, FiCpu } from "react-icons/fi";

function Sidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: <FiGrid /> },
        { id: "repositories", label: "Repositories", icon: <FiGithub /> },
        { id: "rules", label: "Automation Rules", icon: <FiSliders /> },
        { id: "notifications", label: "Notifications", icon: <FiBell /> },
    ];

    return (
        <div className="sidebar">
            <div className="logo-container">
                <FiCpu className="logo-icon" />
                <h2 className="logo-text">GitAutoBot</h2>
            </div>

            <nav className="nav-menu">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={() => window.location.href = "/"}>
                    <span className="nav-icon"><FiLogOut /></span>
                    <span className="nav-label">Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;