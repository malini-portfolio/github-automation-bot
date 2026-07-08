import "./Dashboard.css";
import { useEffect, useState } from "react";
import API from "../services/api";
import ActivityTimeline from "../components/ActivityTimeline";
function Dashboard() {
    const [profile, setProfile] = useState({});
    const [repositories, setRepositories] = useState([]);
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
    fetchData();
}, []);

const fetchData = async () => {
    try {
        const profileResponse =
            await API.get("/auth/profile/");

        setProfile(profileResponse.data);

        const repoResponse =
            await API.get("/github/repositories/");

        setRepositories(repoResponse.data);
        const notificationResponse =
            await API.get("/notifications/");
        setNotifications(notificationResponse.data);

    } catch (error) {
        console.log(error);
    }
};
    return (
        <div className="dashboard">

            <div className="header">
                <h1>GitHub Automation Bot</h1>
                <div className="user-box">
                    Welcome {profile.username} 👋
                </div>
            </div>

            <div className="stats-container">

                <div className="stat-card">
                    <h2>{repositories.length}</h2>
                    <p>Repositories</p>
                </div>

                <div className="stat-card">
                    <h2>{notifications.length}</h2>
                    <p>Notifications</p>
                </div>

                <div className="stat-card">
                    <h2>5</h2>
                    <p>Automation Rules</p>
                </div>

            </div>

            <div className="section-title">
                Repositories
            </div>

            <div className="repo-container">

                {
repositories.map((repo) => (
    <div className="repo-card" key={repo.id}>

        <h3>{repo.name}</h3>

        <p>
            ⭐ {repo.private ? "Private" : "Public"}
        </p>

        <p>
            🌿 Default Branch :
            {repo.default_branch}
        </p>

        <p>
            🔔 Automation Enabled
        </p>

    </div>
))
}

            </div>
            <ActivityTimeline
    notifications={notifications}
/>

            <div className="section-title">
                Recent Activity
            </div>

            

        </div>
    );
}

export default Dashboard;