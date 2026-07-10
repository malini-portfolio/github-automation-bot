import "./RepoCard.css";
import { FiFolder, FiLock, FiUnlock, FiStar, FiActivity } from "react-icons/fi";
import { useState } from "react";

function RepoCard({ repo, onToggleWebhook }) {
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        if (!onToggleWebhook) return;
        setLoading(true);
        try {
            await onToggleWebhook(repo.repo_id);
        } catch (error) {
            console.error("Error toggling webhook:", error);
        }
        setLoading(false);
    };

    return (
        <div className={`repo-card ${repo.webhook_installed ? "webhook-active" : ""}`}>
            <div className="repo-header">
                <div className="repo-title-wrapper">
                    <FiFolder className="repo-icon" />
                    <h3 className="repo-name">{repo.name}</h3>
                </div>
                <span className={`privacy-badge ${repo.private ? "private" : "public"}`}>
                    {repo.private ? <FiLock /> : <FiUnlock />}
                    {repo.private ? "Private" : "Public"}
                </span>
            </div>

            <p className="repo-fullname">{repo.full_name}</p>

            <div className="repo-body">
                <div className="repo-stat-item">
                    <FiStar className="stat-icon star" />
                    <span>{repo.stargazers_count || 0} Stars</span>
                </div>
                <div className="repo-stat-item">
                    <span className="branch-indicator">branch:</span>
                    <span className="branch-name">{repo.default_branch || "main"}</span>
                </div>
            </div>

            <div className="repo-footer">
                <div className="webhook-status">
                    <span className={`status-dot ${repo.webhook_installed ? "active" : ""}`}></span>
                    <span className="status-text">
                        {repo.webhook_installed ? "Webhook Active" : "No Webhook"}
                    </span>
                </div>
                <button 
                    className={`webhook-action-btn ${repo.webhook_installed ? "disconnect" : "connect"}`}
                    onClick={handleConnect}
                    disabled={loading}
                >
                    {loading ? (
                        "Updating..."
                    ) : repo.webhook_installed ? (
                        "Disconnect"
                    ) : (
                        <>
                            <FiActivity style={{ marginRight: "6px" }} />
                            Connect Webhook
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default RepoCard;