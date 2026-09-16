import SettingsForm from '@/components/SettingsForm';
import { getSettings } from '@/actions/settingsActions';
import { Settings as SettingsIcon } from 'lucide-react';

export const metadata = {
  title: 'System Settings - Admin',
};

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B132B] tracking-tight flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3 text-blue-600" />
            Global Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">Manage pricing engines and global configuration parameters.</p>
        </div>
      </div>
      
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
