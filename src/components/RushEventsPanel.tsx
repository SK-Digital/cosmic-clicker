import React from 'react';
import { useGame } from '../context/GameContext';
import { rushEvents } from '../context/GameContext';
import { Circle } from 'lucide-react';
import MeteorIcon from '/meteor.svg';

interface RushEventsPanelProps {
  onClose: () => void;
}

const getEventIcon = (icon: string) => {
  switch (icon) {
    case 'meteor':
      return (
        <img src="/icons/meteor.png" alt="Meteor" style={{ width: 32, height: 32 }} />
      );
    case 'blackhole':
      return (
        <img src="/icons/blackhole.png" alt="Black Hole" style={{ width: 32, height: 32 }} />
      );
    default:
      return null;
  }
};

const RushEventsPanel: React.FC<RushEventsPanelProps> = ({ onClose }) => {
  const { state } = useGame();
  const eventChance = state.eventChance;
  const now = Date.now();
  const activeEvents = state.activeEvents.filter(event => (event.startedAt + event.duration * 1000) > now);
  const minDisplayChance = 0.5; // Minimum displayed chance in percent

  return (
    <div className="h-full flex flex-col bg-indigo-900/80 rounded-r-2xl shadow-2xl p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Rush Events</h2>
        <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">×</button>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Active Events</h3>
          {activeEvents.length === 0 ? (
            <div className="text-indigo-200 text-center">No active rush events.</div>
          ) : (
            <ul className="space-y-2">
              {activeEvents.map(event => (
                <li key={event.id + '-' + event.startedAt} className="bg-indigo-800/60 rounded p-2 flex flex-col">
                  <span className="font-bold text-white flex items-center gap-2">{getEventIcon(rushEvents.find(e => e.id === event.id)?.icon || '')}{event.name}</span>
                  <span className="text-indigo-200 text-sm">Time left: {Math.max(0, Math.ceil((event.duration * 1000 - (Date.now() - event.startedAt)) / 1000))}s</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Possible Events</h3>
          <ul className="space-y-2">
            {rushEvents.map(event => {
              const chance = event.baseChance * eventChance * 100;
              const displayChance = Math.max(chance, minDisplayChance);
              return (
                <li key={event.id} className="bg-indigo-800/40 rounded p-2 flex flex-col">
                  <span className="font-bold text-white flex items-center gap-2">{getEventIcon(event.icon)}{event.name}</span>
                  <span className="text-indigo-200 text-sm">{event.description}</span>
                  <span className="text-indigo-300 text-xs mt-1">Chance: {displayChance.toFixed(1)}%</span>
                  <span className="text-indigo-300 text-xs">Multiplier: {event.multiplier}x</span>
                  <span className="text-indigo-300 text-xs">Duration: {event.duration}s</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RushEventsPanel; 