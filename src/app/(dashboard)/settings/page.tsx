export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
      <p className="text-sm text-slate-500 mb-8">Manage your account preferences.</p>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Full name</label>
              <input
                type="text"
                defaultValue="Andre"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
              <input
                type="email"
                defaultValue="andreswartz2507@gmail.com"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Preferences</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-indigo-600 h-4 w-4" />
            <span className="text-sm text-slate-700">Email notifications</span>
          </label>
        </div>

        <div className="p-6 flex justify-end">
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
