import "./Dashboard.css";
import React, { useState, useEffect } from "react";
import API from "../services/api";
import ActivityTimeline from "../components/ActivityTimeline";
import ProfileCard from "../components/ProfileCard";
import RepoCard from "../components/RepoCard";
import { FiGrid, FiGithub, FiSliders, FiBell, FiSearch, FiSliders as FiSliderIcon, FiPlus, FiTrash2, FiAlertCircle } from "react-icons/fi";

function Dashboard({ activeTab, setActiveTab }) {
    const [profile, setProfile] = useState({});
    const [repositories, setRepositories] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortBy, setSortBy] = useState("name");

    // Interactive Automation Rules State (State-controlled demo)
    const [rules, setRules] = useState([
        { id: 1, repoName: "demo-bot-user/my-awesome-app", eventType: "push", actionType: "notification", active: true },
        { id: 2, repoName: "demo-bot-user/react-github-bot-ui", eventType: "pull_request", actionType: "notification", active: true },
        { id: 3, repoName: "demo-bot-user/secret-recipe-db", eventType: "issues", actionType: "log", active: false }
    ]);
    const [newRuleRepo, setNewRuleRepo] = useState("");
    const [newRuleEvent, setNewRuleEvent] = useState("push");
    const [newRuleAction, setNewRuleAction] = useState("notification");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const profileResponse = await API.get("/auth/profile/");
            setProfile(profileResponse.data);

            const repoResponse = await API.get("/github/repositories/");
            setRepositories(repoResponse.data);

            const notificationResponse = await API.get("/notifications/");
            setNotifications(notificationResponse.data);
        } catch (error) {
            console.error(error);
            setError(
                "Unable to load dashboard data. Please make sure the backend server is running."
            );
        }
        setLoading(false);
    };

    // Toggle Webhook Connection via registered backend API
    const handleToggleWebhook = async (repoId) => {
        try {
            const response = await API.post("/auth/connect/", { repo_id: repoId });
            if (response.data.status === "success") {
                // Update repositories locally
                setRepositories(prev => prev.map(repo => {
                    if (repo.repo_id === repoId) {
                        return { ...repo, webhook_installed: response.data.webhook_installed };
                    }
                    return repo;
                }));

                // Refresh activity log
                const notificationResponse = await API.get("/notifications/");
                setNotifications(notificationResponse.data);
            }
        } catch (err) {
            console.error("Error toggling repository webhook:", err);
        }
    };

    // Rules logic
    const handleCreateRule = (e) => {
        e.preventDefault();
        if (!newRuleRepo) return;
        const newRule = {
            id: Date.now(),
            repoName: newRuleRepo,
            eventType: newRuleEvent,
            actionType: newRuleAction,
            active: true
        };
        setRules([newRule, ...rules]);
        setNewRuleRepo("");
    };

    const toggleRuleActive = (ruleId) => {
        setRules(rules.map(rule => rule.id === ruleId ? { ...rule, active: !rule.active } : rule));
    };

    const deleteRule = (ruleId) => {
        setRules(rules.filter(rule => rule.id !== ruleId));
    };

    // Filtering/Sorting Repositories
    const filteredRepositories = repositories
        .filter((repo) => {
            const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase());
            const matchesFilter =
                filter === "all"
                    ? true
                    : filter === "public"
                    ? !repo.private
                    : repo.private;
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            }
            if (sortBy === "stars") {
                return (b.stargazers_count || 0) - (a.stargazers_count || 0);
            }
            return 0;
        });

    // ----------------------------------------------------
    // Tab Sub-renders
    // ----------------------------------------------------

    // 1. Dashboard Overview
    const renderOverview = () => {
        const activeWebhooksCount = repositories.filter(r => r.webhook_installed).length;
        const activeRulesCount = rules.filter(r => r.active).length;

        return (
            <div className="tab-content fade-in-up">
                {/* Stats row */}
                <div className="stats-row">
                    <div className="stat-card flex-stat" onClick={() => setActiveTab("repositories")}>
                        <div className="stat-icon-wrapper cyan">
                            <FiGithub />
                        </div>
                        <div className="stat-info">
                            <h3>{repositories.length}</h3>
                            <p>Repositories Loaded</p>
                            <span className="stat-subtext">{activeWebhooksCount} Active Webhooks</span>
                        </div>
                    </div>
                    <div className="stat-card flex-stat" onClick={() => setActiveTab("rules")}>
                        <div className="stat-icon-wrapper indigo">
                            <FiSliders />
                        </div>
                        <div className="stat-info">
                            <h3>{rules.length}</h3>
                            <p>Automation Rules</p>
                            <span className="stat-subtext">{activeRulesCount} Currently Active</span>
                        </div>
                    </div>
                    <div className="stat-card flex-stat" onClick={() => setActiveTab("notifications")}>
                        <div className="stat-icon-wrapper purple">
                            <FiBell />
                        </div>
                        <div className="stat-info">
                            <h3>{notifications.length}</h3>
                            <p>Notifications Received</p>
                            <span className="stat-subtext">Recent Webhook Logs</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard layout split */}
                <div className="dashboard-layout-grid">
                    <div className="dashboard-main-col">
                        <div className="section-header-row">
                            <h3>Repositories Preview</h3>
                            <button className="link-action-btn" onClick={() => setActiveTab("repositories")}>
                                View All Repositories
                            </button>
                        </div>
                        {loading ? (
                            <div className="loading-card">Loading Repositories...</div>
                        ) : repositories.length === 0 ? (
                            <div className="empty-state">No repositories connected.</div>
                        ) : (
                            <div className="repos-preview-grid">
                                {repositories.slice(0, 3).map(repo => (
                                    <RepoCard key={repo.id} repo={repo} onToggleWebhook={handleToggleWebhook} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="dashboard-side-col">
                        <div className="section-header-row">
                            <h3>Profile Details</h3>
                        </div>
                        {loading ? (
                            <div className="loading-card">Loading Profile...</div>
                        ) : (
                            <ProfileCard profile={profile} />
                        )}
                    </div>
                </div>

                <div className="dashboard-full-width-section">
                    <div className="section-header-row">
                        <h3>Recent Event Stream</h3>
                        <button className="link-action-btn" onClick={() => setActiveTab("notifications")}>
                            Full Activity Logs
                        </button>
                    </div>
                    {loading ? (
                        <div className="loading-card">Loading event logs...</div>
                    ) : (
                        <ActivityTimeline notifications={notifications.slice(0, 3)} />
                    )}
                </div>
            </div>
        );
    };

    // 2. Repositories Tab
    const renderRepositories = () => {
        return (
            <div className="tab-content fade-in-up">
                <div className="search-filter-bar">
                    <div className="search-wrapper">
                        <FiSearch className="search-bar-icon" />
                        <input
                            type="text"
                            placeholder="Search repositories..."
                            className="search-box-improved"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-wrapper">
                        <button
                            className={`filter-btn ${filter === "all" ? "active" : ""}`}
                            onClick={() => setFilter("all")}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === "public" ? "active" : ""}`}
                            onClick={() => setFilter("public")}
                        >
                            Public
                        </button>
                        <button
                            className={`filter-btn ${filter === "private" ? "active" : ""}`}
                            onClick={() => setFilter("private")}
                        >
                            Private
                        </button>
                        <select
                            className="sort-dropdown"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name">Sort A-Z</option>
                            <option value="stars">Sort by Stars</option>
                        </select>
                    </div>
                </div>

                <p className="repo-counter-text">
                    Showing {filteredRepositories.length} of {repositories.length} Repositories
                </p>

                {loading ? (
                    <div className="loading-card">Loading repositories...</div>
                ) : filteredRepositories.length === 0 ? (
                    <div className="empty-state">No repositories match your criteria. 🔍</div>
                ) : (
                    <div className="repos-full-grid">
                        {filteredRepositories.map((repo) => (
                            <RepoCard key={repo.id} repo={repo} onToggleWebhook={handleToggleWebhook} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // 3. Automation Rules Tab
    const renderRules = () => {
        return (
            <div className="tab-content fade-in-up">
                <div className="rules-layout">
                    {/* Rules Creator Card */}
                    <div className="rules-form-card">
                        <h3>Create Automation Rule</h3>
                        <p className="form-helper">Define rules to automatically trigger action tasks when specific repository webhooks occur.</p>
                        
                        <form onSubmit={handleCreateRule} className="rule-creation-form">
                            <div className="form-group">
                                <label>Target Repository</label>
                                <select 
                                    value={newRuleRepo} 
                                    onChange={(e) => setNewRuleRepo(e.target.value)}
                                    required
                                >
                                    <option value="">Select a repository...</option>
                                    {repositories.map(repo => (
                                        <option key={repo.id} value={repo.full_name}>
                                            {repo.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Trigger Event</label>
                                    <select 
                                        value={newRuleEvent} 
                                        onChange={(e) => setNewRuleEvent(e.target.value)}
                                    >
                                        <option value="push">Git Push</option>
                                        <option value="pull_request">Pull Request</option>
                                        <option value="issues">Issue opened</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Bot Action Task</label>
                                    <select 
                                        value={newRuleAction} 
                                        onChange={(e) => setNewRuleAction(e.target.value)}
                                    >
                                        <option value="notification">Send Notification</option>
                                        <option value="log">Log to DB Stream</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="submit-rule-btn">
                                <FiPlus style={{ marginRight: "6px" }} /> Create Rule
                            </button>
                        </form>
                    </div>

                    {/* Rules List Container */}
                    <div className="rules-list-container">
                        <h3>Configured Automation Rules</h3>
                        {rules.length === 0 ? (
                            <div className="empty-state">No automation rules configured yet.</div>
                        ) : (
                            <div className="rules-stack">
                                {rules.map(rule => (
                                    <div className="rule-card" key={rule.id}>
                                        <div className="rule-card-header">
                                            <span className={`event-tag ${rule.eventType}`}>
                                                {rule.eventType === "push" ? "Push" : rule.eventType === "pull_request" ? "PR" : "Issue"}
                                            </span>
                                            <div className="rule-actions">
                                                <div className="rule-toggle-wrapper">
                                                    <span className="status-label">{rule.active ? "Active" : "Inactive"}</span>
                                                    <input 
                                                        type="checkbox" 
                                                        className="rule-toggle-switch"
                                                        checked={rule.active}
                                                        onChange={() => toggleRuleActive(rule.id)}
                                                    />
                                                </div>
                                                <button className="delete-rule-btn" onClick={() => deleteRule(rule.id)}>
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className="rule-repo">{rule.repoName}</h4>
                                        <p className="rule-action-desc">
                                            Action: <strong>{rule.actionType === "notification" ? "Send dashboard alert" : "Write log entry"}</strong>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // 4. Notifications Tab
    const renderNotifications = () => {
        return (
            <div className="tab-content fade-in-up">
                <div className="notification-logs-card">
                    <div className="logs-card-header">
                        <h3>Raw Webhook Stream Logs</h3>
                        <button className="refresh-logs-btn" onClick={fetchData} disabled={loading}>
                            Refresh Logs
                        </button>
                    </div>
                    {loading ? (
                        <div className="loading-card">Refreshing Logs...</div>
                    ) : (
                        <ActivityTimeline notifications={notifications} />
                    )}
                </div>
            </div>
        );
    };

    // Base Frame
    return (
        <div className="dashboard-wrapper">
            {/* Header section */}
            <header className="main-header fade-in-up">
                <div className="header-title-container">
                    <h1 className="active-tab-title">
                        {activeTab === "dashboard" && "Dashboard Overview"}
                        {activeTab === "repositories" && "Repositories Manager"}
                        {activeTab === "rules" && "Automation Settings"}
                        {activeTab === "notifications" && "Event Timeline"}
                    </h1>
                    <p className="header-subtitle-text">GitHub webhook automations and repository analytics</p>
                </div>
                {profile.username && (
                    <div className="profile-indicator-pill" onClick={() => setActiveTab("dashboard")}>
                        <img src={profile.avatar} alt="User Profile" className="indicator-avatar" />
                        <span className="indicator-username">@{profile.username}</span>
                    </div>
                )}
            </header>

            {/* Content Switcher */}
            {activeTab === "dashboard" && renderOverview()}
            {activeTab === "repositories" && renderRepositories()}
            {activeTab === "rules" && renderRules()}
            {activeTab === "notifications" && renderNotifications()}
        </div>
    );
}

export default Dashboard;