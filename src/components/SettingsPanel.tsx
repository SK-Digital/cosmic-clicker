import React, { useEffect, useState } from 'react';

const SETTINGS_KEY = 'cosmicClickerSettings';

interface Settings {
  sfxVolume: number;
  highContrast: boolean;
  colorblind: boolean;
  reducedMotion: boolean;
}

const defaultSettings: Settings = {
  sfxVolume: 0.5,
  highContrast: false,
  colorblind: false,
  reducedMotion: false,
};

const SettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('settingsChanged'));
  }, [settings]);

  return (
    <div className="h-full flex flex-col bg-indigo-900/80 rounded-r-2xl shadow-2xl p-6 text-white max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Settings</h2>
        <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">×</button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Sound Effects Volume</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={settings.sfxVolume}
            onChange={e => setSettings(s => ({ ...s, sfxVolume: parseFloat(e.target.value) }))}
            className="w-full accent-indigo-400"
            aria-label="Sound Effects Volume"
          />
          <div className="text-xs text-indigo-200 mt-1">{Math.round(settings.sfxVolume * 100)}%</div>
        </div>
        <div className="space-y-3 pt-2 border-t border-indigo-800/40 mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={e => setSettings(s => ({ ...s, highContrast: e.target.checked }))}
              className="accent-indigo-400 w-4 h-4"
            />
            <span className="text-sm">High Contrast Mode</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.colorblind}
              onChange={e => setSettings(s => ({ ...s, colorblind: e.target.checked }))}
              className="accent-indigo-400 w-4 h-4"
            />
            <span className="text-sm">Colorblind-Friendly Mode</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={e => setSettings(s => ({ ...s, reducedMotion: e.target.checked }))}
              className="accent-indigo-400 w-4 h-4"
            />
            <span className="text-sm">Reduced Motion</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 