import React from 'react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option>All notifications</option>
                  <option>Important only</option>
                  <option>None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Connections only</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Privacy Settings</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Share my assessment results with potential employers
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Allow AI to analyze my profile for job recommendations
                </label>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Change Password</h2>
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Current Password"
                className="block w-full rounded-md border-gray-300 shadow-sm"
              />
              <input
                type="password"
                placeholder="New Password"
                className="block w-full rounded-md border-gray-300 shadow-sm"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="block w-full rounded-md border-gray-300 shadow-sm"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;