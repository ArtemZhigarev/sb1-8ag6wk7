import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { testConnection, saveSettings, loadSettings } from '../services/woocommerce';

const Settings: React.FC = () => {
  const [url, setUrl] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadSavedSettings = async () => {
      const wooSettings = await loadSettings();
      if (wooSettings) {
        setUrl(wooSettings.url);
        setConsumerKey(wooSettings.consumerKey);
        setConsumerSecret(wooSettings.consumerSecret);
      }
    };
    loadSavedSettings();
  }, []);

  const handleSave = async () => {
    await saveSettings({ url, consumerKey, consumerSecret });
    alert('Settings saved successfully!');
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      await testConnection({ url, consumerKey, consumerSecret });
      setTestStatus('success');
    } catch (error) {
      setTestStatus('error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">WooCommerce Integration Settings</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">Website URL</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="consumerKey" className="block text-sm font-medium text-gray-700">Consumer Key</label>
          <input
            type="text"
            id="consumerKey"
            value={consumerKey}
            onChange={(e) => setConsumerKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="consumerSecret" className="block text-sm font-medium text-gray-700">Consumer Secret</label>
          <input
            type="password"
            id="consumerSecret"
            value={consumerSecret}
            onChange={(e) => setConsumerSecret(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-5 w-5 mr-2" /> Save Settings
          </button>
          <button
            type="button"
            onClick={handleTestConnection}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <RefreshCw className="h-5 w-5 mr-2" /> Test Connection
          </button>
        </div>
      </form>
      {testStatus === 'testing' && <p className="mt-4 text-blue-600">Testing connection...</p>}
      {testStatus === 'success' && <p className="mt-4 text-green-600">Connection successful!</p>}
      {testStatus === 'error' && <p className="mt-4 text-red-600">Connection failed. Please check your settings.</p>}
    </div>
  );
};

export default Settings;