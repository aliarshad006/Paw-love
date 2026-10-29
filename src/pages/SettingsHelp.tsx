import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Trash2, Lock } from 'lucide-react';
import { logout, changePassword, getSession } from '../lib/accounts';

export const SettingsHelp: React.FC = () => {
  const { currentProfile, resetDemoCharacter, deleteCurrentProfile } = useApp();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-black text-purple-950 flex items-center gap-2"><Settings className="w-7 h-7" /> Settings</h1>
      <div className="bg-white rounded-2xl border border-pink-200 p-5 text-sm text-purple-900">
        <div className="font-extrabold flex items-center gap-2 mb-1"><Lock className="w-4 h-4" /> Privacy</div>
        Username and password only, no email. Passwords are stored as a hash. Do not reuse a real password. Your data is saved on this device and synced to the cloud when online.
      </div>
      <div className="flex flex-wrap gap-3">
        {currentProfile && (
          <button onClick={deleteCurrentProfile} className="px-4 py-2.5 rounded-xl bg-purple-950 text-white font-bold text-sm cursor-pointer">Delete my account</button>
        )}
        <button onClick={() => { resetDemoCharacter(); }} className="px-4 py-2.5 rounded-xl bg-purple-100 text-purple-900 font-bold text-sm cursor-pointer">Reset demo character</button>
        <button onClick={() => logout()} className="px-4 py-2.5 rounded-xl bg-pink-100 text-pink-800 font-bold text-sm cursor-pointer">Log out @{getSession()}</button>
        <button onClick={async () => { const o = prompt('Old password'); if (o === null) return; const n = prompt('New password (4+ characters)'); if (n === null) return; const r = await changePassword(o, n); alert(r.ok ? 'Password changed' : r.error); }} className="px-4 py-2.5 rounded-xl bg-purple-100 text-purple-900 font-bold text-sm cursor-pointer">Change password</button>
        <button onClick={() => { localStorage.clear(); location.reload(); }} className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm flex items-center gap-2 cursor-pointer"><Trash2 className="w-4 h-4" /> Wipe all data</button>
      </div>
    </div>
  );
};
