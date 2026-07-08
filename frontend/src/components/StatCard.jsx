function StatCard({ title, value }) {
    return (
        <div className="stat-card">
            <StatCard
    title="Repositories"
    value={repositories.length}
/>

<StatCard
    title="Notifications"
    value={notifications.length}
/>

<StatCard
    title="Rules"
    value="3"
/>
        </div>
    );
}

export default StatCard;