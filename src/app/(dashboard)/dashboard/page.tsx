const stats = [
  { label: "Total Users", value: "2,845", change: "+12%", up: true },
  { label: "Revenue", value: "$48,290", change: "+8.1%", up: true },
  { label: "Active Sessions", value: "1,203", change: "-3.2%", up: false },
  { label: "Conversion Rate", value: "3.6%", change: "+0.4%", up: true },
];

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-8">Welcome back, Andre.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              {s.label}
            </p>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p
              className={`text-xs mt-1 font-medium ${
                s.up ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {s.change} vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Recent activity</h2>
        <p className="text-sm text-slate-400">No recent activity to display.</p>
      </div>
    </div>
  );
}
