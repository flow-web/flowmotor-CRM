import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mic, Zap } from 'lucide-react';
import ChatMode from './ChatMode';
import CallMode from './CallMode';

const TABS = [
  { id: 'chat', label: 'Ghostwriter', icon: MessageSquare },
  { id: 'call', label: 'Co-Pilot', icon: Mic },
];

export default function CompanionLayout() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="h-dvh flex flex-col" style={{ backgroundColor: '#0A0A0A', color: '#E0E0E0' }}>
      {/* --- Top Bar --- */}
      <header
        className="flex items-center justify-between px-4 h-14 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#666' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#00FF88')}
          onMouseLeave={e => (e.currentTarget.style.color = '#666')}
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">CRM</span>
        </Link>

        <div className="flex items-center gap-2">
          <Zap size={16} style={{ color: '#00FF88' }} />
          <span
            className="text-sm font-bold tracking-widest uppercase"
            style={{ fontFamily: 'monospace', color: '#FFFFFF' }}
          >
            Flow Companion
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: '#00FF88',
              boxShadow: '0 0 6px #00FF88',
            }}
          />
          <span className="text-xs hidden sm:inline" style={{ color: '#666', fontFamily: 'monospace' }}>
            ONLINE
          </span>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        {activeTab === 'chat' && <ChatMode />}
        {activeTab === 'call' && <CallMode />}
      </main>

      {/* --- Bottom Tab Bar --- */}
      <nav
        className="flex shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200"
              style={{
                backgroundColor: isActive ? 'rgba(0,255,136,0.06)' : 'transparent',
                color: isActive ? '#00FF88' : '#666',
                borderTop: isActive ? '2px solid #00FF88' : '2px solid transparent',
              }}
            >
              <Icon size={20} />
              <span className="text-[11px] font-medium tracking-wide uppercase" style={{ fontFamily: 'monospace' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
