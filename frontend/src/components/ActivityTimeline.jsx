import "./ActivityTimeline.css";
import { FiArrowUpCircle, FiGitPullRequest, FiAlertCircle, FiPlusCircle } from "react-icons/fi";

function ActivityTimeline({ notifications }) {
    const getEventDetails = (eventType) => {
        switch (eventType) {
            case "push":
                return {
                    title: "Push Event Received",
                    class: "push",
                    icon: <FiArrowUpCircle />
                };
            case "pull_request":
                return {
                    title: "Pull Request Opened",
                    class: "pr",
                    icon: <FiGitPullRequest />
                };
            case "issues":
                return {
                    title: "Issue Created",
                    class: "issue",
                    icon: <FiAlertCircle />
                };
            default:
                return {
                    title: "Webhook Logged",
                    class: "default",
                    icon: <FiPlusCircle />
                };
        }
    };

    return (
        <div className="timeline-container">
            <h2 className="timeline-title">Recent Activity</h2>

            {notifications.length === 0 ? (
                <div className="timeline-empty">
                    <p>No activity found yet. Trigger a webhook or perform an action to populate this log.</p>
                </div>
            ) : (
                <div className="timeline-list">
                    {notifications.map((item) => {
                        const details = getEventDetails(item.event_type);
                        return (
                            <div className="timeline-card" key={item.id}>
                                <div className={`timeline-badge ${details.class}`}>
                                    {details.icon}
                                </div>
                                <div className="timeline-body">
                                    <div className="timeline-header">
                                        <h4 className="timeline-event-title">{details.title}</h4>
                                        <span className="timeline-time">
                                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="timeline-message">{item.message}</p>
                                    <div className="timeline-meta">
                                        <span className="timeline-repo-badge">{item.repository}</span>
                                        <span className="timeline-date-full">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ActivityTimeline;