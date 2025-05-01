import React from 'react';

interface AchievementToastProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  onClose?: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ icon, name, description, onClose }) => {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl bg-indigo-800/90 shadow-2xl border border-indigo-400/40 animate-toast-in text-white min-w-[320px] max-w-xs pointer-events-auto relative"
      style={{ zIndex: 1000 }}
    >
      <div className="w-12 h-12 flex items-center justify-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-lg text-white truncate">{name}</div>
        <div className="text-indigo-200 text-sm truncate">{description}</div>
      </div>
      <span className="ml-2 text-green-400 font-bold text-2xl">✓</span>
      {onClose && (
        <button onClick={onClose} className="absolute top-2 right-2 text-white/60 hover:text-white text-lg">×</button>
      )}
    </div>
  );
};

export default AchievementToast; 