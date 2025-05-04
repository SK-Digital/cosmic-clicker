import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useGame, deleteAllProgress } from '../context/GameContext';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

const AuthPanel: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState<string | null>(null);
  const [signupMsg, setSignupMsg] = useState<string | null>(null);
  const [verificationMsg, setVerificationMsg] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const { dispatch, state, user: gameUser } = useGame();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Check for email verification event in URL
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type === 'email_confirmed') {
      setVerificationMsg('Email verified! You can now log in.');
      // Optionally, clear the query string
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  React.useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSignupMsg(null);
    setShowResend(false);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // Supabase error code for unverified email is '400' with a message containing 'Email not confirmed'
          if (error.message && error.message.toLowerCase().includes('email not confirmed')) {
            setError('Please verify your email before logging in.');
            setShowResend(true);
          } else {
            setError(error.message);
          }
          return;
        }
      } else {
        // On signup, include username in user_metadata
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } }
        });
        if (error) throw error;
        setSignupMsg('Signup successful! Check your email to verify your account before logging in.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      setSignupMsg('Verification email resent! Check your inbox.');
      setShowResend(false);
    } catch (err: any) {
      setError('Could not resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const handleUsernameEdit = () => {
    setNewUsername(user.user_metadata?.username || '');
    setEditingUsername(true);
    setUsernameMsg(null);
    setError(null);
  };

  const handleUsernameSave = async () => {
    setUsernameMsg(null);
    setError(null);
    if (!USERNAME_REGEX.test(newUsername)) {
      setError('Username must be 3-20 characters, alphanumeric or underscore.');
      return;
    }
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('id, user_metadata')
      .contains('user_metadata', { username: newUsername });
    if (fetchError) {
      setError('Could not check username uniqueness.');
      setLoading(false);
      return;
    }
    if (data && data.length > 0 && data[0].id !== user.id) {
      setError('Username is already taken.');
      setLoading(false);
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ data: { username: newUsername } });
    if (updateError) {
      setError(updateError.message);
    } else {
      setUsernameMsg('Username updated!');
      setEditingUsername(false);
      // Update game state and save
      dispatch({ type: 'LOAD_GAME', state: { ...state, username: newUsername } });
      if (user.id) {
        // Save to cloud
        import('../utils/gameUtils').then(utils => {
          utils.saveGameToCloud(user.id, { ...state, username: newUsername });
        });
      } else {
        // Save to local
        import('../utils/gameUtils').then(utils => {
          utils.saveGameToLocal({ ...state, username: newUsername });
        });
      }
    }
    setLoading(false);
  };

  if (user) {
    const displayName = user.user_metadata?.username || user.email;
    // Lifetime stats from state
    const stats = [
      { label: 'Lifetime Stardust Earned', value: state.totalStardustEarned },
      { label: 'Total Clicks', value: state.totalClicks },
      { label: 'Total Upgrades Bought', value: state.totalUpgradesBought },
      { label: 'Total Events Triggered', value: state.totalEventsTriggered },
      { label: 'Prestige Count', value: state.prestigeCount },
      { label: 'Cosmic Shards', value: state.prestigeCurrency },
    ];
    return (
      <div className="p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-2xl border-2 border-indigo-500 shadow-2xl text-white max-w-xs mx-auto mt-8">
        <div className="mb-2 text-center">
          <span className="font-bold text-indigo-200">{displayName}</span>
          {editingUsername ? (
            <div className="mt-3">
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                className="w-full mb-2 p-2 rounded bg-indigo-800 text-white border border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                maxLength={20}
                minLength={3}
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors"
                  onClick={handleUsernameSave}
                  disabled={loading}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold transition-colors"
                  onClick={() => setEditingUsername(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
              {error && <div className="text-pink-300 mt-2 text-center font-semibold">{error}</div>}
              {usernameMsg && <div className="text-green-300 mt-2 text-center font-semibold">{usernameMsg}</div>}
            </div>
          ) : (
            <button
              className="ml-2 text-xs text-indigo-300 underline hover:text-indigo-100"
              onClick={handleUsernameEdit}
              type="button"
            >
              Edit Username
            </button>
          )}
        </div>
        <div className="mb-2 text-center text-indigo-300 text-xs">{user.email}</div>
        {/* Lifetime Stats Section */}
        <div className="my-4 bg-indigo-800/60 rounded-lg p-3">
          <h3 className="text-indigo-300 text-sm font-semibold mb-2">Lifetime Stats</h3>
          <ul className="text-xs space-y-1">
            {stats.map(stat => (
              <li key={stat.label} className="flex justify-between">
                <span>{stat.label}:</span>
                <span className="font-mono text-indigo-100">{stat.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleLogout} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold mt-4 transition-colors" disabled={loading}>
          {loading ? 'Logging out...' : 'Logout'}
        </button>
        {/* Delete Progress Button */}
        <button
          className="w-full bg-pink-700 hover:bg-pink-800 text-white py-2 rounded-lg font-semibold mt-3 transition-colors"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Progress
        </button>
        {/* Themed Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-gradient-to-br from-pink-900 via-indigo-900 to-black border-2 border-pink-600 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative">
              <h2 className="text-2xl font-bold text-pink-400 mb-2">Delete All Progress?</h2>
              <p className="text-pink-200 mb-4 font-semibold">This action <span className='text-pink-400 font-bold'>cannot be undone</span>.<br/>All your game progress, stats, upgrades, and cloud saves will be <span className='text-pink-400 font-bold'>permanently deleted</span>.<br/>Are you absolutely sure?</p>
              <div className="flex gap-4 justify-center mt-6">
                <button
                  className="bg-pink-700 hover:bg-pink-800 text-white font-bold py-2 px-6 rounded shadow-lg border-2 border-pink-500 transition-colors"
                  onClick={async () => {
                    setDeleting(true);
                    await deleteAllProgress(user.id);
                    setDeleting(false);
                    setShowDeleteModal(false);
                    window.location.reload();
                  }}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
                </button>
                <button
                  className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-6 rounded shadow-lg border-2 border-indigo-500 transition-colors"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleAuth} className="p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-2xl border-2 border-indigo-500 shadow-2xl text-white max-w-xs mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-center text-indigo-200 drop-shadow">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      {verificationMsg && <div className="text-green-300 mb-3 text-center font-semibold">{verificationMsg}</div>}
      {signupMsg && <div className="text-green-300 mb-3 text-center font-semibold">{signupMsg}</div>}
      {mode === 'signup' && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-indigo-800 text-white border border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-3 p-2 rounded bg-indigo-800 text-white border border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-3 p-2 rounded bg-indigo-800 text-white border border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
      {error && <div className="text-pink-300 mb-3 text-center font-semibold">{error}</div>}
      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors mb-2" disabled={loading}>
        {loading ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Login' : 'Sign Up')}
      </button>
      {showResend && (
        <button type="button" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 rounded-lg font-semibold transition-colors mb-2" onClick={handleResendVerification} disabled={loading}>
          Resend Verification Email
        </button>
      )}
      <div className="mt-2 text-sm text-center text-indigo-200">
        {mode === 'login' ? (
          <span>Don&apos;t have an account? <button type="button" className="underline text-indigo-300 hover:text-indigo-100" onClick={() => setMode('signup')}>Sign Up</button></span>
        ) : (
          <span>Already have an account? <button type="button" className="underline text-indigo-300 hover:text-indigo-100" onClick={() => setMode('login')}>Login</button></span>
        )}
      </div>
    </form>
  );
};

export default AuthPanel; 