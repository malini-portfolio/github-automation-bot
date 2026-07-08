import "./Sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>GitHub Bot</h2>

            <ul>
                <li>🏠 Dashboard</li>
                <li>📁 Repositories</li>
                <li>⚙ Rules</li>
                <li>🔔 Notifications</li>
                <li>📈 Activity</li>
                <li>🚪 Logout</li>
            </ul>
        </div>
    );
}

export default Sidebar;