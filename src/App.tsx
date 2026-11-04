import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  BookOpen,
  Boxes,
  ChartNoAxesCombined,
  ChevronRight,
  Code2,
  GraduationCap,
  Layers,
  LogOut,
  Menu,
  Play,
  Search,
  X,
  Zap,
  CheckCircle2,
  RotateCcw,
  SkipBack,
  SkipForward,
  Pause,
  Check,
  Cpu,
  LogIn,
  UserPlus,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { topics, Topic } from './data/topics';
import { allAlgorithmComplexities } from './data/complexities';
import {
  Stack,
  Queue,
  LinkedList,
  BinarySearchTree,
  AVLTree,
  BinaryHeap,
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
  heapSortSteps,
  linearSearchSteps,
  binarySearchSteps,
  bfsSteps,
  dfsSteps,
  jobSequencingSteps,
  eightQueensSteps,
} from './engine/dsa';
import {
  saveProgress,
  getProgress,
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  User,
} from './services/api';

const navItems = [
  ['Overview', '/', Activity] as const,
  ['Learn DSA', '/learn', BookOpen] as const,
  ['Visual Playground', '/playground', Boxes] as const,
  ['Algorithms', '/algorithms', Code2] as const,
  ['Complexity', '/complexity', ChartNoAxesCombined] as const,
];

// -------------------------------------------------------------
// IN-APP AUTHENTICATION ALERT MODAL
// -------------------------------------------------------------
interface AuthAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionMessage?: string;
  onQuickDemoLogin?: () => void;
}

function AuthAlertModal({ isOpen, onClose, actionMessage, onQuickDemoLogin }: AuthAlertModalProps) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '460px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: '#FEE2E2', color: '#991B1B', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
          <ShieldAlert size={28} />
        </div>

        <span className="eyebrow" style={{ color: '#991B1B' }}>AUTHENTICATION REQUIRED</span>
        <h2 style={{ fontFamily: 'var(--font-display)', margin: '8px 0 10px', fontSize: '20px', color: 'var(--text-main)' }}>
          Please Sign In or Register
        </h2>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 20px' }}>
          {actionMessage || 'You must be registered or logged in as a student to access interactive learning, mark topics as completed, and track progress on your personal dashboard.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="primary-btn"
            style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
            onClick={() => {
              onClose();
              navigate('/login');
            }}
          >
            <LogIn size={16} /> Sign In to Your Account
          </button>

          <button
            className="secondary-btn"
            style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
            onClick={() => {
              onClose();
              navigate('/register');
            }}
          >
            <UserPlus size={16} /> Register New Student Account
          </button>

          {onQuickDemoLogin && (
            <button
              type="button"
              className="soft-btn"
              style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '12px' }}
              onClick={() => {
                onClose();
                onQuickDemoLogin();
              }}
            >
              ⚡ Instant Demo Student Sign In (Alan Turing)
            </button>
          )}

          <button
            className="soft-btn"
            style={{ width: '100%', padding: '8px', justifyContent: 'center', color: 'var(--text-muted)' }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SIDEBAR & TOPBAR
// -------------------------------------------------------------
function Sidebar({
  close,
  currentUser,
  onLogout,
}: {
  close: () => void;
  currentUser: User | null;
  onLogout: () => void;
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <GraduationCap size={22} />
        </div>
        <span>
          DSA<span className="accent">Hub</span>
          <small>LEARN • VISUALIZE • MASTER</small>
        </span>
      </div>

      <div className="nav-label">CURRICULUM</div>
      <nav>
        {navItems.map(([name, path, Icon]) => (
          <NavLink
            onClick={close}
            end={path === '/'}
            to={path}
            key={path}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <Icon size={18} />
            {name}
            {path === '/playground' && <span className="nav-new">ADVANCED</span>}
            {path === '/complexity' && <span className="nav-new">ALL CASES</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <div className="upgrade-icon">
            <Cpu size={17} />
          </div>
          <b>C++ Native Engine</b>
          <p>Backed by native C++ HashMaps, AVL Trees, and Graph traversals.</p>
          <div style={{ fontSize: '11px', color: 'var(--sage-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>● C++ Engine Active</span>
          </div>
        </div>

        {currentUser ? (
          <div className="profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div className="avatar">
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'S'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <b style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>
                  {currentUser.name}
                </b>
                <small>Logged In Student</small>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="icon-btn"
              title="Sign Out"
              style={{ width: '32px', height: '32px', color: '#DC2626' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-line)' }}>
            <NavLink
              to="/login"
              onClick={close}
              className="secondary-btn"
              style={{ flex: 1, padding: '8px 10px', fontSize: '11.5px', textDecoration: 'none', justifyContent: 'center' }}
            >
              <LogIn size={14} /> Sign In
            </NavLink>
            <NavLink
              to="/register"
              onClick={close}
              className="primary-btn"
              style={{ flex: 1, padding: '8px 10px', fontSize: '11.5px', textDecoration: 'none', justifyContent: 'center' }}
            >
              <UserPlus size={14} /> Join
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
}

function Layout({
  children,
  currentUser,
  completedCount,
  onLogout,
}: {
  children: React.ReactNode;
  currentUser: User | null;
  completedCount: number;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const currentTitle = useMemo(() => {
    const match = navItems.find(([_, path]) => path === location.pathname);
    if (match) return match[0];
    if (location.pathname === '/login') return 'Student Login';
    if (location.pathname === '/register') return 'Student Registration';
    return 'Learning Hub';
  }, [location.pathname]);

  return (
    <div className="app-shell">
      {open && <div className="mobile-scrim" onClick={() => setOpen(false)} />}
      <div className={open ? 'sidebar-wrap show' : 'sidebar-wrap'}>
        <Sidebar close={() => setOpen(false)} currentUser={currentUser} onLogout={onLogout} />
      </div>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <Menu />
          </button>
          <div className="breadcrumb">
            DSA Hub <span>/</span> <b>{currentTitle}</b>
          </div>
          <div className="top-actions">
            <div className="status-pill">
              <span /> C++ Native Backend
            </div>

            {currentUser ? (
              <NavLink
                to="/"
                className="top-avatar"
                style={{ textDecoration: 'none', display: 'grid', placeItems: 'center', position: 'relative' }}
                title={`Logged in as ${currentUser.name}`}
              >
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'S'}
                {completedCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '16px',
                      height: '16px',
                      background: 'var(--sage-dark)',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      fontSize: '9px',
                      fontWeight: 700,
                      display: 'grid',
                      placeItems: 'center',
                      border: '2px solid #FFFFFF',
                    }}
                  >
                    {completedCount}
                  </span>
                )}
              </NavLink>
            ) : (
              <NavLink to="/login" className="primary-btn" style={{ padding: '7px 14px', fontSize: '11.5px', textDecoration: 'none' }}>
                <LogIn size={14} /> Student Login
              </NavLink>
            )}
          </div>
        </header>

        <div className="page">{children}</div>
      </main>
    </div>
  );
}

function Heading({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}>{desc}</p>
      </div>
      {action}
    </div>
  );
}

function Stat({ icon: Icon, label, value, note }: { icon: any; label: string; value: string; note: string }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <div className="stat-icon">
          <Icon size={18} />
        </div>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

// -------------------------------------------------------------
// DEDICATED LOGIN & REGISTRATION PAGES
// -------------------------------------------------------------
function LoginPage({ onLoginSuccess }: { onLoginSuccess: (user: User) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      onLoginSuccess(res.user);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('student@dsahub.edu');
    setPassword('password123');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto' }}>
      <div className="panel" style={{ padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="brand-mark" style={{ margin: '0 auto 14px', width: '48px', height: '48px' }}>
            <GraduationCap size={26} />
          </div>
          <span className="eyebrow">STUDENT AUTHENTICATION</span>
          <h2 style={{ fontFamily: 'var(--font-display)', margin: '6px 0', fontSize: '22px' }}>
            Sign In to DSA Hub
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
            Sign in to access your personal dashboard, mark completed topics, and run laboratory experiments.
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', fontSize: '12.5px', marginBottom: '18px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Student Email Address</label>
            <input
              className="form-input"
              type="email"
              required
              placeholder="student@dsahub.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-btn"
            style={{ width: '100%', marginTop: '10px', padding: '12px', justifyContent: 'center' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>

          <button
            type="button"
            className="soft-btn"
            onClick={handleDemoFill}
            style={{ width: '100%', marginTop: '12px', padding: '10px', justifyContent: 'center', fontSize: '12px' }}
          >
            ⚡ Auto-fill Demo Student Credentials
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <NavLink to="/register" style={{ color: 'var(--sage-dark)', fontWeight: 700, textDecoration: 'none' }}>
            Register new account here
          </NavLink>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onRegisterSuccess }: { onRegisterSuccess: (user: User) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerUser(name, email, password);
      onRegisterSuccess(res.user);
      navigate('/');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (err?.code === 'ERR_NETWORK'
            ? 'Cannot reach the registration server. If it is running on your laptop, connect both devices to the same Wi-Fi and open the laptop address shown in its terminal (not localhost).'
            : err?.message || 'Registration failed'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto' }}>
      <div className="panel" style={{ padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="brand-mark" style={{ margin: '0 auto 14px', width: '48px', height: '48px' }}>
            <GraduationCap size={26} />
          </div>
          <span className="eyebrow">NEW STUDENT REGISTRATION</span>
          <h2 style={{ fontFamily: 'var(--font-display)', margin: '6px 0', fontSize: '22px' }}>
            Create Student Account
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
            Register to start with a fresh dashboard and track your individual DSA progress.
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', fontSize: '12.5px', marginBottom: '18px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Student Full Name</label>
            <input
              className="form-input"
              type="text"
              autoComplete="name"
              required
              placeholder="e.g. Grace Hopper"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Student Email Address</label>
            <input
              className="form-input"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="student@dsahub.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password (min 6 characters)</label>
            <input
              className="form-input"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-btn"
            style={{ width: '100%', marginTop: '10px', padding: '12px', justifyContent: 'center' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <NavLink to="/login" style={{ color: 'var(--sage-dark)', fontWeight: 700, textDecoration: 'none' }}>
            Sign In here
          </NavLink>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// RESPECTIVE STUDENT DASHBOARD
// -------------------------------------------------------------
function Dashboard({
  currentUser,
  doneList,
  onToggleDone,
  onSelectTopic,
  onRequireAuth,
}: {
  currentUser: User | null;
  doneList: string[];
  onToggleDone: (id: string, e: React.MouseEvent) => void;
  onSelectTopic: (topic: Topic) => void;
  onRequireAuth: (message: string) => void;
}) {
  const syllabusDone = currentUser ? doneList.length : 0;
  const pct = Math.round((syllabusDone / topics.length) * 100);

  const unitStats = useMemo(() => {
    const unitList = ['Unit I', 'Unit II', 'Unit III', 'Unit IV', 'Unit V'];
    return unitList.map((unitName) => {
      const list = topics.filter((t) => t.unit === unitName);
      const finished = currentUser ? list.filter((t) => doneList.includes(t.id)).length : 0;
      return {
        unit: unitName,
        total: list.length,
        finished,
        pct: list.length ? Math.round((finished / list.length) * 100) : 0,
      };
    });
  }, [currentUser, doneList]);

  const completedTopicsList = useMemo(() => {
    if (!currentUser) return [];
    return topics.filter((t) => doneList.includes(t.id));
  }, [currentUser, doneList]);

  const standing = useMemo(() => {
    if (!currentUser) return 'Guest Visitor';
    if (pct === 100) return 'DSA Master';
    if (pct >= 60) return 'Algorithm Specialist';
    if (pct >= 25) return 'Data Structure Scholar';
    return 'Foundational Student';
  }, [currentUser, pct]);

  return (
    <>
      <div className="welcome-banner">
        <div className="welcome-copy">
          <div className="welcome-tag">
            <span /> {currentUser ? `RESPECTIVE DASHBOARD: ${currentUser.name.toUpperCase()}` : 'STUDENT WORKSPACE (GUEST PREVIEW)'}
          </div>
          <h1>
            {currentUser ? `Welcome back, ${currentUser.name}.` : 'Master Algorithms & Data Structures.'}
            <br />
            <em>Calm. Natural. Rigorous.</em>
          </h1>
          <p>
            {currentUser
              ? `You have personally completed ${syllabusDone} of ${topics.length} syllabus topics (${pct}% mastery). Your progress is recorded in your personal student profile in the C++ backend.`
              : `You are viewing DSA Hub in guest preview. Sign in or register to unlock your own personal dashboard, save topic completions, and interact with live laboratories.`}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {currentUser ? (
              <NavLink className="primary-btn" to="/learn">
                Browse DSA Curriculum <ChevronRight size={16} />
              </NavLink>
            ) : (
              <button
                className="primary-btn"
                onClick={() => onRequireAuth('Please sign in or register with your student account to study the DSA curriculum.')}
              >
                Browse DSA Curriculum <ChevronRight size={16} />
              </button>
            )}

            <NavLink className="secondary-btn" to="/complexity">
              Explore All Complexities <ChevronRight size={16} />
            </NavLink>

            {!currentUser && (
              <NavLink className="soft-btn" to="/login">
                Sign In to Save Progress <LogIn size={14} />
              </NavLink>
            )}
          </div>
        </div>

        <div className="hero-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-core">
            <Layers size={44} />
          </div>
          <div className="float-chip chip-a">AVL Tree</div>
          <div className="float-chip chip-b">O(V + E)</div>
          <div className="float-chip chip-c">C++ Engine</div>
          <div className="float-chip chip-d">8-Queens</div>
        </div>
      </div>

      {currentUser ? (
        <div className="student-profile-panel">
          <div className="student-card-left">
            <div className="student-card-avatar">
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'S'}
            </div>
            <div className="student-card-details">
              <h3>{currentUser.name}</h3>
              <p>
                Student ID: <b>{currentUser.id}</b> • {currentUser.email}
              </p>
              <div className="student-badges">
                <span className="student-badge">
                  <Check size={12} /> {standing}
                </span>
                <span className="student-badge">
                  <Cpu size={12} /> C++ Storage Synchronized
                </span>
                <span className="student-badge">Autonomous CSE</span>
              </div>
            </div>
          </div>

          <div className="student-progress-summary">
            <div className="progress-header">
              <span>Your Personal Syllabus Mastery</span>
              <b>{pct}%</b>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>{syllabusDone} Topics Mastered</span>
              <span>{topics.length - syllabusDone} Topics Remaining</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="guest-callout-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--sage-pale)', color: 'var(--sage-dark)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <b style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                Guest Preview Mode — Respective Dashboard Locked
              </b>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Student progress, completion records, and laboratory modifications are strictly private to each student. Sign in or register to activate your personal dashboard.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <NavLink to="/login" className="primary-btn" style={{ padding: '8px 14px', fontSize: '12px', textDecoration: 'none' }}>
              <LogIn size={14} /> Student Login
            </NavLink>
            <NavLink to="/register" className="secondary-btn" style={{ padding: '8px 14px', fontSize: '12px', textDecoration: 'none' }}>
              <UserPlus size={14} /> Register Account
            </NavLink>
          </div>
        </div>
      )}

      {currentUser && (
        <>
          <div className="section-head" style={{ marginTop: '10px' }}>
            <div>
              <div className="eyebrow">SYLLABUS PROGRESSION</div>
              <h2>Unit-by-Unit Completion Breakdown</h2>
            </div>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              5 Autonomous CSE Units
            </span>
          </div>

          <div className="unit-progress-grid">
            {unitStats.map((u) => (
              <div className="unit-progress-card" key={u.unit}>
                <div className="unit-name">{u.unit}</div>
                <div className="unit-count">
                  {u.finished} / {u.total} <small style={{ fontWeight: 500, fontSize: '11px', color: 'var(--text-muted)' }}>topics</small>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${u.pct}%` }} />
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'right' }}>
                  {u.pct}% Completed
                </div>
              </div>
            ))}
          </div>

          <div className="completed-topics-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="eyebrow">STUDENT PORTFOLIO</span>
                <h3 style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--text-main)' }}>
                  Your Completed Topics ({syllabusDone})
                </h3>
              </div>
              {syllabusDone > 0 && (
                <span style={{ fontSize: '12px', color: 'var(--sage-dark)', fontWeight: 700 }}>
                  Active Student Record
                </span>
              )}
            </div>

            {syllabusDone === 0 ? (
              <p style={{ margin: '14px 0 0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                You have not marked any topics as completed yet. Explore the syllabus topics below, study the concepts, and click <b>"Mark Done"</b> on each module you master to log your progress into your student dashboard.
              </p>
            ) : (
              <div className="completed-chip-list">
                {completedTopicsList.map((t) => (
                  <div className="completed-chip" key={t.id}>
                    <Check size={14} />
                    <span>{t.title}</span>
                    <span style={{ fontSize: '10.5px', opacity: 0.75 }}>({t.unit})</span>
                    <button
                      className="icon-btn"
                      style={{ width: '22px', height: '22px', marginLeft: '4px' }}
                      title="Study Details"
                      onClick={() => onSelectTopic(t)}
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="section-head">
        <div>
          <div className="eyebrow">YOUR SYLLABUS PERFORMANCE</div>
          <h2>{currentUser ? `${currentUser.name}'s Dashboard` : 'DSA Learning Dashboard'}</h2>
        </div>
        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {currentUser ? `Student Email: ${currentUser.email}` : 'Sign in to record your own progress'}
        </span>
      </div>

      <div className="stats-grid">
        <Stat icon={BookOpen} label="Course Modules" value={`${topics.length}`} note="Full 5-Unit Syllabus" />
        <Stat icon={CheckCircle2} label="Topics Mastered" value={`${syllabusDone} / ${topics.length}`} note={currentUser ? `${pct}% Personal Mastery` : 'Requires Student Login'} />
        <Stat icon={Activity} label="Interactive Lab" value="Trees & Graphs" note="BST, AVL, Heap, BFS, DFS" />
        <Stat icon={Cpu} label="Backend Engine" value="C++ Native" note="Chained HashMap Storage" />
      </div>

      <div className="section-head">
        <div>
          <div className="eyebrow">CURRICULUM UNITS</div>
          <h2>Core DSA Syllabus Topics</h2>
        </div>
        {currentUser ? (
          <NavLink className="primary-btn" to="/learn" style={{ padding: '8px 14px', fontSize: '11.5px' }}>
            View All {topics.length} Syllabus Modules <ChevronRight size={14} />
          </NavLink>
        ) : (
          <button
            className="primary-btn"
            style={{ padding: '8px 14px', fontSize: '11.5px' }}
            onClick={() => onRequireAuth('Please sign in or register to view all syllabus modules.')}
          >
            View All {topics.length} Syllabus Modules <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="topic-grid">
        {topics.slice(0, 6).map((t) => {
          const isDone = currentUser ? doneList.includes(t.id) : false;

          return (
            <div
              key={t.id}
              className="topic-card"
              onClick={() => {
                if (!currentUser) {
                  onRequireAuth(`Sign in or register to study the full syllabus content for "${t.title}".`);
                } else {
                  onSelectTopic(t);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="topic-card-top">
                <span className="unit-tag">{t.unit}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isDone && (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--sage-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={13} /> Completed
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{t.level}</span>
                </div>
              </div>

              <h3>{t.title}</h3>
              <p>{t.desc}</p>

              <div className="topic-meta">
                <span>Time: {t.complexity}</span>
                <span>Space: {t.spaceComplexity}</span>
              </div>

              <div className="topic-footer" onClick={(e) => e.stopPropagation()}>
                <button
                  className={`mark-btn ${isDone ? 'done' : ''}`}
                  onClick={(e) => {
                    if (!currentUser) {
                      e.preventDefault();
                      onRequireAuth(`Please sign in or register to mark "${t.title}" as completed.`);
                    } else {
                      onToggleDone(t.id, e);
                    }
                  }}
                >
                  <Check size={14} />
                  {isDone ? 'Finished' : 'Mark Done'}
                </button>

                <button
                  className="soft-btn"
                  style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 700, border: 'none', background: 'transparent' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentUser) {
                      onRequireAuth(`Please sign in or register to study "${t.title}".`);
                    } else {
                      onSelectTopic(t);
                    }
                  }}
                >
                  {currentUser ? 'Study' : 'Sign In to Study'} <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// -------------------------------------------------------------
// LEARN DSA MODULE
// -------------------------------------------------------------
function Learn({
  currentUser,
  doneList,
  onToggleDone,
  onSelectTopic,
  onRequireAuth,
}: {
  currentUser: User | null;
  doneList: string[];
  onToggleDone: (id: string, e: React.MouseEvent) => void;
  onSelectTopic: (topic: Topic) => void;
  onRequireAuth: (message: string) => void;
}) {
  const [unitFilter, setUnitFilter] = useState<string>('All');
  const [query, setQuery] = useState('');

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchUnit = unitFilter === 'All' || t.unit === unitFilter;
      const q = query.toLowerCase();
      const matchQuery =
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.syllabusTopic.toLowerCase().includes(q);
      return matchUnit && matchQuery;
    });
  }, [unitFilter, query]);

  return (
    <>
      <Heading
        eyebrow="COURSE CONTENT"
        title="DSA Course Syllabus &amp; Foundations"
        desc="Exhaustive study curriculum across Units I to V with theoretical foundations, asymptotic formulas, and operations."
      />

      {!currentUser && (
        <div className="guest-callout-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--sage-pale)', color: 'var(--sage-dark)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <b style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                Student Registration Required to Study &amp; Track Progress
              </b>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                You are currently exploring in guest preview mode. Register or log in with your student credentials to view full theoretical materials, code operations, and mark syllabus topics completed.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <NavLink to="/login" className="primary-btn" style={{ padding: '7px 12px', fontSize: '12px', textDecoration: 'none' }}>
              <LogIn size={13} /> Sign In
            </NavLink>
            <NavLink to="/register" className="secondary-btn" style={{ padding: '7px 12px', fontSize: '12px', textDecoration: 'none' }}>
              <UserPlus size={13} /> Register
            </NavLink>
          </div>
        </div>
      )}

      <div className="filter-row">
        <div className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, algorithms, or concepts..."
          />
        </div>

        <div className="filter-tabs">
          {['All', 'Unit I', 'Unit II', 'Unit III', 'Unit IV', 'Unit V'].map((unit) => (
            <button
              className={unitFilter === unit ? 'filter active' : 'filter'}
              onClick={() => setUnitFilter(unit)}
              key={unit}
            >
              {unit === 'All' ? 'All Units' : unit}
            </button>
          ))}
        </div>
      </div>

      <div className="topic-grid">
        {filteredTopics.map((t) => {
          const isDone = currentUser ? doneList.includes(t.id) : false;

          return (
            <div
              key={t.id}
              className="topic-card"
              onClick={() => {
                if (!currentUser) {
                  onRequireAuth(`Please sign in or register to open full study materials for "${t.title}".`);
                } else {
                  onSelectTopic(t);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="topic-card-top">
                <span className="unit-tag">{t.unit}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isDone && (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--sage-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={13} /> Completed
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{t.level}</span>
                </div>
              </div>

              <h3>{t.title}</h3>
              <p>{t.desc}</p>

              <div className="topic-meta">
                <span>Time: {t.complexity}</span>
                <span>Space: {t.spaceComplexity}</span>
              </div>

              <div className="topic-footer" onClick={(e) => e.stopPropagation()}>
                <button
                  className={`mark-btn ${isDone ? 'done' : ''}`}
                  onClick={(e) => {
                    if (!currentUser) {
                      e.preventDefault();
                      onRequireAuth(`Please sign in or register to mark "${t.title}" as done.`);
                    } else {
                      onToggleDone(t.id, e);
                    }
                  }}
                >
                  <Check size={14} />
                  {isDone ? 'Finished' : 'Mark Done'}
                </button>

                <button
                  className="soft-btn"
                  style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 700, border: 'none', background: 'transparent' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentUser) {
                      onRequireAuth(`Please sign in or register to study "${t.title}".`);
                    } else {
                      onSelectTopic(t);
                    }
                  }}
                >
                  {currentUser ? 'Study Details' : 'Sign In to Study'} <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// -------------------------------------------------------------
// COMPREHENSIVE COMPLEXITY MODULE
// -------------------------------------------------------------
function ComplexityView() {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const list = useMemo(() => {
    return allAlgorithmComplexities.filter((item) => {
      const matchCat = filter === 'All' || item.category === filter;
      const q = search.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(q) ||
        item.bestTime.toLowerCase().includes(q) ||
        item.worstTime.toLowerCase().includes(q) ||
        item.paradigm.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [filter, search]);

  return (
    <>
      <Heading
        eyebrow="ASYMPTOTIC MASTER MATRIX"
        title="Algorithm Complexities in All Cases"
        desc="Exhaustive reference for every algorithm in DSA: Best Case (Ω), Average Case (Θ), Worst Case (O), Space Complexity, Stability, and Paradigms."
      />

      <div className="complexity-hero">
        <div>
          <span className="eyebrow">ASYMPTOTIC ORDER SCALE</span>
          <h2>Visual Scale: From Instant to Intractable</h2>
          <p>
            O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ) &lt; O(n!).
            Analyzing algorithms in Best, Average, and Worst cases guarantees predictability across sparse, random, and pathological inputs.
          </p>
        </div>
        <div className="big-o">
          O<span>(n log n)</span>
        </div>
      </div>

      <div className="filter-row">
        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by algorithm name or complexity (e.g. O(n log n))..."
          />
        </div>

        <div className="filter-tabs">
          {['All', 'Sorting', 'Searching', 'Trees & Heaps', 'Graph Algorithms', 'Dynamic Programming', 'Backtracking'].map((cat) => (
            <button
              className={filter === cat ? 'filter active' : 'filter'}
              onClick={() => setFilter(cat)}
              key={cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="panel" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-line)', color: 'var(--text-main)' }}>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>Algorithm</th>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>Category &amp; Paradigm</th>
              <th style={{ padding: '14px 18px', fontWeight: 700, color: '#065F46' }}>Best Time (Ω)</th>
              <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--sage-dark)' }}>Avg Time (Θ)</th>
              <th style={{ padding: '14px 18px', fontWeight: 700, color: '#991B1B' }}>Worst Time (O)</th>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>Worst Space</th>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>In-Place</th>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>Stable</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, idx) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  background: idx % 2 === 1 ? 'rgba(232, 234, 215, 0.25)' : '#FFFFFF',
                }}
              >
                <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--sage-dark)' }}>
                  <div>{item.name}</div>
                  <small style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '11px', display: 'block', marginTop: '3px' }}>
                    {item.notes}
                  </small>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: 600 }}>{item.category}</div>
                  <small style={{ color: 'var(--text-muted)' }}>{item.paradigm}</small>
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#065F46', fontFamily: 'monospace' }}>
                  {item.bestTime}
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--sage-dark)', fontFamily: 'monospace' }}>
                  {item.avgTime}
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#991B1B', fontFamily: 'monospace' }}>
                  {item.worstTime}
                </td>
                <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 600 }}>
                  {item.worstSpace}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: item.inPlace ? 'var(--sage-pale)' : '#F3F4F6', color: item.inPlace ? 'var(--sage-dark)' : 'var(--text-muted)' }}>
                    {item.inPlace ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: item.stable === true ? 'var(--sage-pale)' : item.stable === false ? '#FEE2E2' : '#F3F4F6', color: item.stable === true ? 'var(--sage-dark)' : item.stable === false ? '#991B1B' : 'var(--text-muted)' }}>
                    {item.stable === true ? 'Yes' : item.stable === false ? 'No' : 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// VISUAL PLAYGROUND
// -------------------------------------------------------------
function Playground({
  currentUser,
  onRequireAuth,
}: {
  currentUser: User | null;
  onRequireAuth: (message: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'BST' | 'AVL' | 'Heap' | 'Graph' | 'Stack' | 'Queue' | 'Linked List'>('BST');

  // BST State
  const [bst] = useState(() => new BinarySearchTree([50, 30, 70, 20, 40, 60, 80]));
  const [bstInput, setBstInput] = useState('45');
  const [bstMessage, setBstMessage] = useState('Binary Search Tree initialized with balanced keys.');
  const [bstRenderTick, setBstRenderTick] = useState(0);

  // AVL Tree State
  const [avl] = useState(() => new AVLTree([40, 20, 60, 10, 30, 50, 70]));
  const [avlInput, setAvlInput] = useState('25');
  const [avlMessage, setAvlMessage] = useState('AVL Tree self-balancing with factor calculation.');
  const [avlRenderTick, setAvlRenderTick] = useState(0);

  // Heap Tree State
  const [isMaxHeap, setIsMaxHeap] = useState(false);
  const [heap, setHeap] = useState(() => new BinaryHeap([15, 28, 42, 53, 67, 74, 91], false));
  const [heapInput, setHeapInput] = useState('10');
  const [heapMessage, setHeapMessage] = useState('Min-Heap priority queue active.');

  // Graph State
  const graphData: Record<string, string[]> = useMemo(
    () => ({
      A: ['B', 'C'],
      B: ['A', 'D', 'E'],
      C: ['A', 'F'],
      D: ['B'],
      E: ['B', 'F'],
      F: ['C', 'E'],
    }),
    []
  );
  const [graphMode, setGraphMode] = useState<'BFS' | 'DFS'>('BFS');
  const [graphSteps, setGraphSteps] = useState<any[]>([]);
  const [graphStepIdx, setGraphStepIdx] = useState(0);
  const [graphPlaying, setGraphPlaying] = useState(false);

  // Linear Stack/Queue/List State
  const [stack] = useState(() => new Stack([12, 24, 36]));
  const [stackInput, setStackInput] = useState('48');
  const [stackItems, setStackItems] = useState<number[]>([12, 24, 36]);
  const [stackMessage, setStackMessage] = useState('Stack ready.');

  const [queue] = useState(() => new Queue([10, 20, 30]));
  const [queueInput, setQueueInput] = useState('40');
  const [queueItems, setQueueItems] = useState<number[]>([10, 20, 30]);
  const [queueMessage, setQueueMessage] = useState('Queue ready.');

  const [linkedList] = useState(() => new LinkedList([5, 15, 25, 35]));
  const [listInput, setListInput] = useState('45');
  const [listItems, setListItems] = useState<number[]>([5, 15, 25, 35]);
  const [listMessage, setListMessage] = useState('Linked list ready.');

  const checkAuth = (actionName: string): boolean => {
    if (!currentUser) {
      onRequireAuth(`Please sign in or register to execute "${actionName}" and modify data structures in the lab.`);
      return false;
    }
    return true;
  };

  const startGraphTraversal = (mode: 'BFS' | 'DFS') => {
    if (!checkAuth(`Run Graph ${mode} Traversal`)) return;
    setGraphMode(mode);
    const steps = mode === 'BFS' ? bfsSteps(graphData, 'A') : dfsSteps(graphData, 'A');
    setGraphSteps(steps);
    setGraphStepIdx(0);
    setGraphPlaying(false);
  };

  useEffect(() => {
    if (activeTab === 'Graph' && !graphSteps.length) {
      const steps = bfsSteps(graphData, 'A');
      setGraphSteps(steps);
      setGraphStepIdx(0);
    }
  }, [activeTab, graphSteps.length]);

  useEffect(() => {
    if (!graphPlaying || activeTab !== 'Graph') return;
    const interval = setInterval(() => {
      setGraphStepIdx((prev) => {
        if (prev >= graphSteps.length - 1) {
          setGraphPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1100);
    return () => clearInterval(interval);
  }, [graphPlaying, activeTab, graphSteps.length]);

  function renderBinaryTree(node: any): React.ReactNode {
    if (!node) return null;
    return (
      <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
        <div className="tree-bubble">
          {node.value}
          {node.balanceFactor !== undefined && (
            <span className="tree-factor-badge" title={`Balance Factor: ${node.balanceFactor}`}>
              {node.balanceFactor}
            </span>
          )}
        </div>
        {(node.left || node.right) && (
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ borderTop: '2px solid var(--border-line)', paddingTop: '8px' }}>
              {node.left ? renderBinaryTree(node.left) : <div style={{ width: '38px', height: '38px' }} />}
            </div>
            <div style={{ borderTop: '2px solid var(--border-line)', paddingTop: '8px' }}>
              {node.right ? renderBinaryTree(node.right) : <div style={{ width: '38px', height: '38px' }} />}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Heading
        eyebrow="INTERACTIVE LABORATORY"
        title="Advanced Data Structure Playground"
        desc="Interactive simulation of BST, AVL self-balancing trees, Min/Max Heaps, advanced Graph traversals, and dynamic structures."
      />

      {!currentUser && (
        <div className="guest-callout-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--sage-pale)', color: 'var(--sage-dark)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <b style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                Interactive Laboratory Operations Locked in Guest Mode
              </b>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Inserting keys, deleting nodes, balancing AVL rotations, priority heap operations, and running graph traversals require student authentication.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <NavLink to="/login" className="primary-btn" style={{ padding: '7px 12px', fontSize: '12px', textDecoration: 'none' }}>
              <LogIn size={13} /> Sign In
            </NavLink>
            <NavLink to="/register" className="secondary-btn" style={{ padding: '7px 12px', fontSize: '12px', textDecoration: 'none' }}>
              <UserPlus size={13} /> Register
            </NavLink>
          </div>
        </div>
      )}

      <div className="play-layout">
        <section className="panel playground-panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">VISUAL STAGE</span>
              <h2>{activeTab} Simulator</h2>
            </div>
            <span className="live-label">
              <span /> {currentUser ? 'STUDENT ACTIVE' : 'PREVIEW MODE'}
            </span>
          </div>

          <div className="kind-tabs">
            {(['BST', 'AVL', 'Heap', 'Graph', 'Stack', 'Queue', 'Linked List'] as const).map((tab) => (
              <button
                className={activeTab === tab ? 'kind-tab selected' : 'kind-tab'}
                onClick={() => setActiveTab(tab)}
                key={tab}
              >
                {tab === 'BST'
                  ? 'Binary Search Tree'
                  : tab === 'AVL'
                  ? 'AVL Tree (Self-Balancing)'
                  : tab === 'Heap'
                  ? 'Heap Tree (Priority Queue)'
                  : tab === 'Graph'
                  ? 'Advanced Graphs (BFS / DFS)'
                  : tab}
              </button>
            ))}
          </div>

          {activeTab === 'BST' && (
            <div>
              <div className="visual-stage" style={{ minHeight: '300px' }}>
                <div className="visual-caption">BST HIERARCHICAL NODE TOPOLOGY</div>
                <div className="tree-canvas">{renderBinaryTree(bst.root)}</div>
              </div>

              <div className="operation-area">
                <label className="field-label">BST Operations (Value)</label>
                <div className="inline-form">
                  <input
                    type="number"
                    value={bstInput}
                    onChange={(e) => setBstInput(e.target.value)}
                    placeholder="Enter key"
                  />
                  <button
                    className="primary-btn"
                    onClick={() => {
                      if (!checkAuth('Insert Key into BST')) return;
                      const v = Number(bstInput);
                      bst.insert(v);
                      setBstMessage(`Inserted ${v} into Binary Search Tree.`);
                      setBstRenderTick((t) => t + 1);
                    }}
                  >
                    Insert Key
                  </button>
                  <button
                    className="soft-btn"
                    onClick={() => {
                      if (!checkAuth('Search Key in BST')) return;
                      const v = Number(bstInput);
                      const path = bst.search(v);
                      setBstMessage(path.includes(v) ? `Found ${v}! Traversal search path: ${path.join(' → ')}` : `${v} not in BST. Traversed: ${path.join(' → ')}`);
                    }}
                  >
                    Search Key
                  </button>
                  <button
                    className="soft-btn"
                    onClick={() => {
                      if (!checkAuth('Delete Key from BST')) return;
                      const v = Number(bstInput);
                      bst.delete(v);
                      setBstMessage(`Deleted key ${v} from BST.`);
                      setBstRenderTick((t) => t + 1);
                    }}
                  >
                    Delete Key
                  </button>
                </div>
              </div>

              <div className="message-box">
                <Activity size={18} />
                <span>{bstMessage}</span>
              </div>
            </div>
          )}

          {activeTab === 'AVL' && (
            <div>
              <div className="visual-stage" style={{ minHeight: '300px' }}>
                <div className="visual-caption">AVL TREE • FACTOR BADGES (LEFT - RIGHT HEIGHT)</div>
                <div className="tree-canvas">{renderBinaryTree(avl.root)}</div>
              </div>

              <div className="operation-area">
                <label className="field-label">AVL Key Insertion (Trigger Rotations)</label>
                <div className="inline-form">
                  <input
                    type="number"
                    value={avlInput}
                    onChange={(e) => setAvlInput(e.target.value)}
                    placeholder="Enter key"
                  />
                  <button
                    className="primary-btn"
                    onClick={() => {
                      if (!checkAuth('Insert into AVL Tree')) return;
                      const v = Number(avlInput);
                      avl.insert(v);
                      setAvlMessage(`Inserted ${v}. Rotation applied: ${avl.lastRotation}. Balance factor maintained in [-1, 0, 1].`);
                      setAvlRenderTick((t) => t + 1);
                    }}
                  >
                    Insert Key
                  </button>
                </div>
              </div>

              <div className="message-box">
                <Activity size={18} />
                <span>{avlMessage}</span>
              </div>
            </div>
          )}

          {activeTab === 'Heap' && (
            <div>
              <div className="visual-stage" style={{ minHeight: '260px' }}>
                <div className="visual-caption">
                  {isMaxHeap ? 'MAX-HEAP CONTIGUOUS ARRAY MAPPING' : 'MIN-HEAP CONTIGUOUS ARRAY MAPPING'}
                </div>

                <div className="visual-items" style={{ marginBottom: '20px' }}>
                  {heap.items.map((val, idx) => (
                    <div className="visual-node" key={idx}>
                      <b>{val}</b>
                      <small>Index [{idx}]</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="operation-area">
                <label className="field-label">Heap Operations</label>
                <div className="inline-form">
                  <input
                    type="number"
                    value={heapInput}
                    onChange={(e) => setHeapInput(e.target.value)}
                    placeholder="Value"
                  />
                  <button
                    className="primary-btn"
                    onClick={() => {
                      if (!checkAuth('Insert into Heap')) return;
                      const v = Number(heapInput);
                      heap.insert(v);
                      setHeapMessage(`Inserted ${v}. Sifted up to maintain heap property.`);
                    }}
                  >
                    Insert
                  </button>
                  <button
                    className="soft-btn"
                    onClick={() => {
                      if (!checkAuth('Extract Root from Heap')) return;
                      const root = heap.extractRoot();
                      setHeapMessage(root !== undefined ? `Extracted Root: ${root}` : 'Heap is empty.');
                    }}
                  >
                    Extract Root
                  </button>
                </div>
              </div>

              <div className="message-box">
                <Activity size={18} />
                <span>{heapMessage}</span>
              </div>
            </div>
          )}

          {activeTab === 'Graph' && (
            <div>
              <div className="visual-stage" style={{ minHeight: '260px' }}>
                <div className="visual-caption">NETWORK GRAPH (VERTICES A TO F)</div>

                <div className="graph-nodes-cluster">
                  {Object.keys(graphData).map((v) => {
                    const step = graphSteps[graphStepIdx];
                    const isActive = step?.current === v;
                    const isVisited = step?.visited?.includes(v);
                    const isQueued = step?.queue?.includes(v);

                    return (
                      <div
                        key={v}
                        className={`graph-vertex ${
                          isActive ? 'active' : isVisited ? 'visited' : isQueued ? 'queued' : ''
                        }`}
                      >
                        {v}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="player-controls">
                <button
                  className="soft-btn"
                  onClick={() => startGraphTraversal('BFS')}
                >
                  Breadth-First Search (BFS)
                </button>
                <button
                  className="soft-btn"
                  onClick={() => startGraphTraversal('DFS')}
                >
                  Depth-First Search (DFS)
                </button>

                <button
                  className="primary-btn"
                  onClick={() => {
                    if (!checkAuth('Play Graph Simulation')) return;
                    setGraphPlaying(!graphPlaying);
                  }}
                >
                  {graphPlaying ? (
                    <>
                      <Pause size={16} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={16} /> {graphStepIdx > 0 ? 'Resume' : 'Play Traversal'}
                    </>
                  )}
                </button>
              </div>

              <div className="message-box">
                <Activity size={18} />
                <span>{graphSteps[graphStepIdx]?.message || 'Select traversal and click Play.'}</span>
              </div>
            </div>
          )}

          {activeTab === 'Stack' && (
            <div>
              <div className="visual-stage" style={{ minHeight: '260px' }}>
                <div className="visual-caption">LIFO (LAST IN, FIRST OUT) STACK TOWER</div>
                <div className="visual-items stack-view">
                  {stackItems.map((val, idx) => (
                    <div className="visual-node" key={idx}>
                      <b>{val}</b>
                      <small>{idx === stackItems.length - 1 ? 'TOP' : `[${idx}]`}</small>
                    </div>
                  ))}
                  {!stackItems.length && <div style={{ color: 'var(--text-muted)' }}>Stack is empty</div>}
                </div>
              </div>

              <div className="operation-area">
                <div className="inline-form">
                  <input
                    type="number"
                    value={stackInput}
                    onChange={(e) => setStackInput(e.target.value)}
                    placeholder="Value"
                  />
                  <button
                    className="primary-btn"
                    onClick={() => {
                      if (!checkAuth('Push to Stack')) return;
                      const v = Number(stackInput);
                      stack.push(v);
                      setStackItems([...stack.items]);
                      setStackMessage(`Pushed ${v} to top of stack.`);
                    }}
                  >
                    Push
                  </button>
                  <button
                    className="soft-btn"
                    onClick={() => {
                      if (!checkAuth('Pop from Stack')) return;
                      const v = stack.pop();
                      setStackItems([...stack.items]);
                      setStackMessage(v !== undefined ? `Popped ${v} from stack.` : 'Stack Underflow.');
                    }}
                  >
                    Pop
                  </button>
                </div>
              </div>

              <div className="message-box">
                <Activity size={18} />
                <span>{stackMessage}</span>
              </div>
            </div>
          )}

          {activeTab === 'Queue' && (
            <div>
              <div className="visual-stage" style={{ minHeight: '220px' }}>
                <div className="visual-caption">FIFO (FIRST IN, FIRST OUT) QUEUE PIPE</div>
                <div className="visual-items">
                  {queueItems.map((val, idx) => (
                    <div className="visual-node" key={idx}>
                      <b>{val}</b>
                      <small>{idx === 0 ? 'FRONT' : idx === queueItems.length - 1 ? 'REAR' : `[${idx}]`}</small>
                    </div>
                  ))}
                  {!queueItems.length && <div style={{ color: 'var(--text-muted)' }}>Queue is empty</div>}
                </div>
              </div>

              <div className="operation-area">
                <div className="inline-form">
                  <input
                    type="number"
                    value={queueInput}
                    onChange={(e) => setQueueInput(e.target.value)}
                    placeholder="Value"
                  />
                  <button
                    className="primary-btn"
                    onClick={() => {
                      if (!checkAuth('Enqueue into Queue')) return;
                      const v = Number(queueInput);
                      queue.enqueue(v);
                      setQueueItems([...queue.items]);
                      setQueueMessage(`Enqueued ${v} at rear.`);
                    }}
                  >
                    Enqueue
                  </button>
                  <button
                    className="soft-btn"
                    onClick={() => {
                      if (!checkAuth('Dequeue from Queue')) return;
                      const v = queue.dequeue();
                      setQueueItems([...queue.items]);
                      setQueueMessage(v !== undefined ? `Dequeued ${v} from front.` : 'Queue Underflow.');
                    }}
                  >
                    Dequeue
                  </button>
                </div>
              </div>

              <div className="message-box">
                <Activity size={18} />
                <span>{queueMessage}</span>
              </div>
            </div>
          )}

          {activeTab === 'Linked List' && (
            <div>
              <div className="visual-stage" style={{ minHeight: '220px' }}>
                <div className="visual-caption">DYNAMIC LINKED LIST REFERENCE CHAIN</div>
                <div className="visual-items">
                  {listItems.map((val, idx) => (
                    <React.Fragment key={idx}>
                      <div className="visual-node">
                        <b>{val}</b>
                        <small>{idx === 0 ? 'HEAD' : `Node #${idx + 1}`}</small>
                      </div>
                      {idx < listItems.length - 1 && (
                        <span style={{ fontSize: '20px', color: 'var(--sage-dark)', fontWeight: 700 }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                  {!listItems.length && <div style={{ color: 'var(--text-muted)' }}>List is empty</div>}
                </div>
              </div>

              <div className="operation-area">
                <div className="inline-form">
                  <input
                    type="number"
                    value={listInput}
                    onChange={(e) => setListInput(e.target.value)}
                    placeholder="Value"
                  />
                  <button
                    className="primary-btn"
                    onClick={() => {
                      if (!checkAuth('Append to Linked List')) return;
                      const v = Number(listInput);
                      linkedList.append(v);
                      setListItems(linkedList.toArray());
                      setListMessage(`Appended ${v} to end.`);
                    }}
                  >
                    Append
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => {
                      if (!checkAuth('Reverse Linked List')) return;
                      linkedList.reverse();
                      setListItems(linkedList.toArray());
                      setListMessage('Reversed linked list in-place.');
                    }}
                  >
                    Reverse List
                  </button>
                </div>
              </div>

              <div className="message-box">
                <Activity size={18} />
                <span>{listMessage}</span>
              </div>
            </div>
          )}
        </section>

        <aside className="panel side-panel">
          <span className="eyebrow">DSA LABORATORY SPECIFICATION</span>
          <h3>{activeTab} Architecture</h3>
          <p>
            {activeTab === 'BST'
              ? 'Binary Search Trees arrange keys so left child < parent < right child. Offers O(log n) average time for lookup, insertion, and deletion.'
              : activeTab === 'AVL'
              ? 'Invented by Adelson-Velsky and Landis (1962). Automatically rebalances via 4 rotation types (LL, RR, LR, RL) when balance factors deviate.'
              : activeTab === 'Heap'
              ? 'A complete binary tree satisfying the heap invariant. Enables priority queues with O(1) root access and O(log n) insertion/extraction.'
              : activeTab === 'Graph'
              ? 'Graphs model interconnected entities. Breadth-First Search (BFS) computes level-order paths via queues; Depth-First Search (DFS) searches deeply via recursion.'
              : activeTab === 'Stack'
              ? 'LIFO ordering makes Stacks foundational for recursion call stacks, undo mechanisms, and syntax parsing.'
              : activeTab === 'Queue'
              ? 'FIFO ordering makes Queues vital for CPU scheduling, asynchronous message buffers, and BFS graph explorations.'
              : 'Dynamic linked nodes enable O(1) prepend and append operations without contiguous memory reallocation.'}
          </p>

          <div className="complexity-list">
            <div>
              <span>Insertion</span>
              <b>{activeTab === 'BST' || activeTab === 'AVL' || activeTab === 'Heap' ? 'O(log n)' : 'O(1)'}</b>
            </div>
            <div>
              <span>Deletion</span>
              <b>{activeTab === 'BST' || activeTab === 'AVL' || activeTab === 'Heap' ? 'O(log n)' : 'O(1) / O(n)'}</b>
            </div>
            <div>
              <span>Search / Lookup</span>
              <b>{activeTab === 'BST' || activeTab === 'AVL' ? 'O(log n)' : activeTab === 'Graph' ? 'O(V + E)' : 'O(n)'}</b>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// ALGORITHM STUDIO
// -------------------------------------------------------------
function Algorithms({
  currentUser,
  onRequireAuth,
}: {
  currentUser: User | null;
  onRequireAuth: (message: string) => void;
}) {
  const [algo, setAlgo] = useState('Merge Sort');
  const [rawInput, setRawInput] = useState('38, 27, 43, 3, 9, 82, 10');
  const [target, setTarget] = useState('43');
  const [steps, setSteps] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(false);

  const arr = useMemo(
    () =>
      rawInput
        .split(',')
        .map(Number)
        .filter(Number.isFinite),
    [rawInput]
  );

  const generateSteps = () => {
    if (!currentUser) {
      onRequireAuth(`Please sign in or register to run ${algo} simulation and generate step-by-step executions.`);
      return;
    }

    let s: any[] = [];
    if (algo === 'Merge Sort') s = mergeSortSteps(arr);
    else if (algo === 'Quick Sort') s = quickSortSteps(arr);
    else if (algo === 'Heap Sort') s = heapSortSteps(arr);
    else if (algo === 'Bubble Sort') s = bubbleSortSteps(arr);
    else if (algo === 'Selection Sort') s = selectionSortSteps(arr);
    else if (algo === 'Insertion Sort') s = insertionSortSteps(arr);
    else if (algo === 'Linear Search') s = linearSearchSteps(arr, Number(target));
    else if (algo === 'Binary Search') s = binarySearchSteps(arr, Number(target));
    else if (algo === 'Job Sequencing') {
      s = jobSequencingSteps([
        { id: 'J1', deadline: 2, profit: 100 },
        { id: 'J2', deadline: 1, profit: 19 },
        { id: 'J3', deadline: 2, profit: 27 },
        { id: 'J4', deadline: 1, profit: 25 },
        { id: 'J5', deadline: 3, profit: 15 },
      ]);
    } else if (algo === '8-Queens Problem') {
      s = eightQueensSteps(4);
    }

    setSteps(s);
    setIdx(0);
    setRunning(false);
  };

  useEffect(() => {
    if (currentUser) {
      generateSteps();
    }
  }, [algo, currentUser]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setIdx((i) => {
        if (i >= steps.length - 1) {
          setRunning(false);
          return i;
        }
        return i + 1;
      });
    }, 900 / speed);
    return () => clearInterval(interval);
  }, [running, steps.length, speed]);

  const current = steps[idx];

  return (
    <>
      <Heading
        eyebrow="ALGORITHM STUDIO"
        title="Dynamic Algorithm Simulations"
        desc="Interactive step-by-step simulations of classic Divide &amp; Conquer, Sorting, Greedy, and Backtracking algorithms."
      />

      {!currentUser && (
        <div className="guest-callout-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--sage-pale)', color: 'var(--sage-dark)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <b style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                Algorithm Studio Locked in Guest Mode
              </b>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Running step-by-step execution traces, benchmark comparisons, and interactive algorithm animations requires student authentication.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <NavLink to="/login" className="primary-btn" style={{ padding: '7px 12px', fontSize: '12px', textDecoration: 'none' }}>
              <LogIn size={13} /> Sign In
            </NavLink>
            <NavLink to="/register" className="secondary-btn" style={{ padding: '7px 12px', fontSize: '12px', textDecoration: 'none' }}>
              <UserPlus size={13} /> Register
            </NavLink>
          </div>
        </div>
      )}

      <div className="panel algorithm-panel">
        <div className="algorithm-controls">
          <div>
            <label className="field-label">Algorithm</label>
            <select
              value={algo}
              onChange={(e) => {
                setAlgo(e.target.value);
                setSteps([]);
                setRunning(false);
              }}
            >
              <optgroup label="Divide & Conquer & Sorting">
                <option>Merge Sort</option>
                <option>Quick Sort</option>
                <option>Heap Sort</option>
                <option>Bubble Sort</option>
                <option>Selection Sort</option>
                <option>Insertion Sort</option>
              </optgroup>
              <optgroup label="Searching">
                <option>Linear Search</option>
                <option>Binary Search</option>
              </optgroup>
              <optgroup label="Greedy & Backtracking">
                <option>Job Sequencing</option>
                <option>8-Queens Problem</option>
              </optgroup>
            </select>
          </div>

          {!['Job Sequencing', '8-Queens Problem'].includes(algo) && (
            <div className="input-grow">
              <label className="field-label">Array (Comma separated)</label>
              <input
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="e.g. 38, 27, 43, 3, 9, 82, 10"
              />
            </div>
          )}

          {algo.includes('Search') && (
            <div>
              <label className="field-label">Target</label>
              <input
                style={{ width: '90px' }}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
          )}

          <button className="primary-btn" onClick={generateSteps}>
            <Play size={16} /> Run Algorithm
          </button>
        </div>

        <div className="algo-stage">
          <div className="stage-top">
            <span>{algo.toUpperCase()} SIMULATION CANVAS</span>
            <span>
              STEP {steps.length ? idx + 1 : 0} / {steps.length}
            </span>
          </div>

          {!currentUser ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Lock size={32} style={{ margin: '0 auto 12px', color: 'var(--sage-dark)' }} />
              <h3 style={{ margin: '0 0 6px', color: 'var(--text-main)' }}>Student Login Required</h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px' }}>
                Please sign in or register to execute step-by-step visualizations.
              </p>
              <button
                className="primary-btn"
                onClick={() => onRequireAuth(`Sign in or register to execute ${algo} simulation.`)}
              >
                Sign In to Run Simulation
              </button>
            </div>
          ) : (
            <>
              {!['Job Sequencing', '8-Queens Problem'].includes(algo) && (
                <div className="bars">
                  {(current?.array || arr).map((val: number, i: number) => {
                    const isActive = current?.active?.includes(i) || current?.index === i;
                    const isFound = current?.found && current?.index === i;
                    const maxVal = Math.max(...arr, 20);
                    const heightPct = Math.max(14, Math.min(100, (val / maxVal) * 85 + 15));

                    return (
                      <div className={`bar-wrap ${isActive ? 'bar-active' : ''}`} key={i}>
                        <div
                          className="bar"
                          style={{
                            height: `${heightPct}%`,
                            background: isFound
                              ? 'linear-gradient(180deg, #10B981, #059669)'
                              : undefined,
                          }}
                        >
                          <b>{val}</b>
                        </div>
                        <small>{i}</small>
                      </div>
                    );
                  })}
                </div>
              )}

              {algo === 'Job Sequencing' && (
                <div style={{ padding: '30px 10px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    {(current?.scheduled || []).map((slot: string | null, sIdx: number) => (
                      <div
                        key={sIdx}
                        style={{
                          width: '160px',
                          padding: '20px 12px',
                          borderRadius: '12px',
                          border: '2px dashed var(--border-line)',
                          background: slot ? 'var(--sage-pale)' : '#FFFFFF',
                          color: 'var(--sage-dark)',
                          fontWeight: 700,
                        }}
                      >
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          TIME SLOT {sIdx + 1}
                        </div>
                        <div style={{ fontSize: '15px' }}>{slot || 'Vacant Slot'}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '20px', fontWeight: 700, fontSize: '16px', color: 'var(--sage-dark)' }}>
                    Total Cumulative Profit: ${current?.totalProfit || 0}
                  </div>
                </div>
              )}

              {algo === '8-Queens Problem' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 60px)',
                      border: '3px solid var(--sage-dark)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    {[0, 1, 2, 3].map((row) =>
                      [0, 1, 2, 3].map((col) => {
                        const isDark = (row + col) % 2 === 1;
                        const hasQueen = current?.board?.[row] === col;
                        const isConflict = hasQueen && current?.isConflict && current?.activeRow === row;

                        return (
                          <div
                            key={`${row}-${col}`}
                            style={{
                              width: '60px',
                              height: '60px',
                              display: 'grid',
                              placeItems: 'center',
                              background: isConflict
                                ? '#F87171'
                                : isDark
                                ? 'var(--sage-pale)'
                                : '#FFFFFF',
                              fontSize: '24px',
                              fontWeight: 700,
                              color: 'var(--sage-dark)',
                              transition: 'background 0.2s',
                            }}
                          >
                            {hasQueen ? '♛' : ''}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              <div className="step-message">
                {current?.message || 'Press Play or Step Forward to run algorithm simulation.'}
              </div>
            </>
          )}
        </div>

        {currentUser && (
          <div className="player-controls">
            <button
              className="icon-btn"
              onClick={() => {
                setIdx(0);
                setRunning(false);
              }}
              title="Restart"
            >
              <SkipBack size={16} />
            </button>
            <button
              className="primary-btn"
              onClick={() => setRunning(!running)}
            >
              {running ? (
                <>
                  <Pause size={16} /> Pause
                </>
              ) : (
                <>
                  <Play size={16} /> {idx > 0 ? 'Resume' : 'Play'}
                </>
              )}
            </button>
            <button
              className="icon-btn"
              onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
              title="Next Step"
            >
              <SkipForward size={16} />
            </button>

            <div className="speed-control">
              <label>Speed:</label>
              <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                <option value="0.5">0.5×</option>
                <option value="1">1×</option>
                <option value="2">2×</option>
                <option value="4">4×</option>
              </select>
            </div>

            <button
              className="soft-btn"
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
            >
              Previous Step
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// -------------------------------------------------------------
// TOPIC DETAIL MODAL
// -------------------------------------------------------------
function TopicDetailModal({
  topic,
  onClose,
  isDone,
  onToggleDone,
}: {
  topic: Topic | null;
  onClose: () => void;
  isDone: boolean;
  onToggleDone: (id: string, e: React.MouseEvent) => void;
}) {
  if (!topic) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="unit-tag">{topic.unit} • {topic.category}</span>
            <h2 style={{ margin: '8px 0 2px', fontSize: '20px', color: 'var(--text-main)' }}>
              {topic.title}
            </h2>
            <small style={{ color: 'var(--text-muted)' }}>Syllabus: {topic.syllabusTopic}</small>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ margin: '16px 0', lineHeight: 1.7, fontSize: '13.5px', color: 'var(--text-body)' }}>
          {topic.fullTheory}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '20px 0' }}>
          <div className="info-card" style={{ padding: '14px', background: 'var(--bg-subtle)' }}>
            <span className="eyebrow">TIME COMPLEXITY</span>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--sage-dark)', marginTop: '4px' }}>
              {topic.complexity}
            </div>
          </div>
          <div className="info-card" style={{ padding: '14px', background: 'var(--bg-subtle)' }}>
            <span className="eyebrow">SPACE COMPLEXITY</span>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--sage-dark)', marginTop: '4px' }}>
              {topic.spaceComplexity}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>CORE OPERATIONS</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {topic.operations.map((op, i) => (
              <span key={i} style={{ padding: '4px 10px', background: 'var(--sage-pale)', borderRadius: '6px', fontSize: '12px', color: 'var(--sage-dark)', fontWeight: 600 }}>
                {op}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>APPLICATIONS</span>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {topic.applications.map((app, i) => (
              <li key={i}>{app}</li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-line)', paddingTop: '16px' }}>
          <button
            className={`mark-btn ${isDone ? 'done' : ''}`}
            onClick={(e) => onToggleDone(topic.id, e)}
          >
            <Check size={16} />
            {isDone ? 'Topic Completed' : 'Mark Topic as Completed'}
          </button>

          <button className="primary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN APP COMPONENT
// -------------------------------------------------------------
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [authAlertMessage, setAuthAlertMessage] = useState<string | null>(null);
  const [doneList, setDoneList] = useState<string[]>([]);

  // When student logs in, fetch their specific progress
  useEffect(() => {
    if (currentUser) {
      getProgress().then((progress) => {
        setDoneList(progress || []);
      });
    } else {
      setDoneList([]); // Guests always start with clean 0 progress
    }
  }, [currentUser]);

  const handleToggleDone = async (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!currentUser) {
      setAuthAlertMessage('Please sign in or register to record completed syllabus topics.');
      return;
    }

    try {
      const updated = await saveProgress(topicId);
      setDoneList(updated);
    } catch {
      setAuthAlertMessage('Authentication required to save progress.');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setDoneList([]);
  };

  const handleQuickDemoLogin = async () => {
    try {
      const res = await loginUser('student@dsahub.edu', 'password123');
      setCurrentUser(res.user);
      setAuthAlertMessage(null);
    } catch (err) {
      console.error('Quick demo login error:', err);
    }
  };

  return (
    <>
      <Layout
        currentUser={currentUser}
        completedCount={currentUser ? doneList.length : 0}
        onLogout={handleLogout}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                currentUser={currentUser}
                doneList={doneList}
                onToggleDone={handleToggleDone}
                onSelectTopic={setSelectedTopic}
                onRequireAuth={(msg) => setAuthAlertMessage(msg)}
              />
            }
          />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={setCurrentUser} />}
          />
          <Route
            path="/register"
            element={<RegisterPage onRegisterSuccess={setCurrentUser} />}
          />
          <Route
            path="/learn"
            element={
              <Learn
                currentUser={currentUser}
                doneList={doneList}
                onToggleDone={handleToggleDone}
                onSelectTopic={setSelectedTopic}
                onRequireAuth={(msg) => setAuthAlertMessage(msg)}
              />
            }
          />
          <Route
            path="/playground"
            element={
              <Playground
                currentUser={currentUser}
                onRequireAuth={(msg) => setAuthAlertMessage(msg)}
              />
            }
          />
          <Route
            path="/algorithms"
            element={
              <Algorithms
                currentUser={currentUser}
                onRequireAuth={(msg) => setAuthAlertMessage(msg)}
              />
            }
          />
          <Route path="/complexity" element={<ComplexityView />} />
          <Route
            path="*"
            element={
              <Dashboard
                currentUser={currentUser}
                doneList={doneList}
                onToggleDone={handleToggleDone}
                onSelectTopic={setSelectedTopic}
                onRequireAuth={(msg) => setAuthAlertMessage(msg)}
              />
            }
          />
        </Routes>

        <footer className="footer">
          <div>
            <b>DSA Hub</b> • Department of Computer Science and Engineering
          </div>
          <span>Sage Serenity Palette • Native C++ Backend Engine</span>
        </footer>
      </Layout>

      <TopicDetailModal
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
        isDone={selectedTopic && currentUser ? doneList.includes(selectedTopic.id) : false}
        onToggleDone={handleToggleDone}
      />

      <AuthAlertModal
        isOpen={Boolean(authAlertMessage)}
        onClose={() => setAuthAlertMessage(null)}
        actionMessage={authAlertMessage || undefined}
        onQuickDemoLogin={handleQuickDemoLogin}
      />
    </>
  );
}
