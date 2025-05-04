import React, { useEffect, useState } from 'react';
import { fetchLeaderboardTopN, formatNumber } from '../utils/gameUtils';

const LeaderboardPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchLeaderboardTopN(20)
      .then(setEntries)
      .catch(() => setError('Could not load leaderboard.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-full flex flex-col bg-indigo-900/80 rounded-r-2xl shadow-2xl p-6 text-white max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchLeaderboardTopN(20)
                .then(setEntries)
                .catch(() => setError('Could not load leaderboard.'))
                .finally(() => setLoading(false));
            }}
            className="text-white/70 hover:text-white text-lg px-2 py-1 rounded border border-indigo-700/50 bg-indigo-800/60 transition-colors disabled:opacity-50"
            disabled={loading}
            title="Refresh Leaderboard"
          >
            {loading ? 'Refreshing...' : '⟳'}
          </button>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl ml-2">×</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && <div className="text-indigo-200 text-center mt-8">Loading...</div>}
        {error && <div className="text-pink-300 text-center mt-8">{error}</div>}
        {!loading && !error && (
          <table className="w-full text-left mt-2">
            <thead>
              <tr className="text-indigo-300 border-b border-indigo-700/40">
                <th className="py-2 pr-2">#</th>
                <th className="py-2 pr-2">Player</th>
                <th className="py-2 pr-2">Stardust</th>
                <th className="py-2 pr-2">Prestige</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.userId} className="border-b border-indigo-800/30 hover:bg-indigo-800/40">
                  <td className="py-2 pr-2 font-bold text-indigo-200">{i + 1}</td>
                  <td className="py-2 pr-2 font-semibold text-white">{entry.username}</td>
                  <td className="py-2 pr-2 text-indigo-300">{formatNumber(entry.totalStardustEarned)}</td>
                  <td className="py-2 pr-2 text-purple-300">{entry.prestigeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPanel; 