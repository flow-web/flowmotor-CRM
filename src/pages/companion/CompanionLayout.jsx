import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mic, Zap } from 'lucide-react';
import ChatMode from './ChatMode';
import CallMode from './CallMode';

const TABS = [
  { id: 'chat', label: 'Ghostwriter', icon: MessageSquare },
  { id: 'call', label: 'Co-Pilot', icon: Mic },
];

const TAB_BAR_HEIGHT = 60; // px, excluding safe area

export default function CompanionLayout() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div
      className="h-dvh flex flex-col overflow-hidden"
      style={{
        backgroundColor: '#0A0A0A',
        color: '#E0E0E0',
        touchAction: 'manipulation',
      }}
    >
      {/* --- Top Bar (compact) --- */}
      <header
        className="flex items-center justify-between px-4 h-12 shrink-0"
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
          <Zap size={14} style={{ color: '#00FF88' }} />
          <span
            className="text-xs font-bold tracking-widest uppercase"
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

      {/* --- Main Content (scrollable, above tab bar) --- */}
      <main
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ paddingBottom: `${TAB_BAR_HEIGHT}px` }}
      >
        {activeTab === 'chat' && <ChatMode tabBarHeight={TAB_BAR_HEIGHT} />}
        {activeTab === 'call' && <CallMode tabBarHeight={TAB_BAR_HEIGHT} />}
      </main>

      {/* --- Bottom Tab Bar (fixed, with safe-area for iPhone notch) --- */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex shrink-0 z-40"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: '#0A0A0A',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          height: `calc(${TAB_BAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200"
              style={{
                backgroundColor: isActive ? 'rgba(0,255,136,0.06)' : 'transparent',
                color: isActive ? '#00FF88' : '#666',
                borderTop: isActive ? '2px solid #00FF88' : '2px solid transparent',
                height: `${TAB_BAR_HEIGHT}px`,
                touchAction: 'manipulation',
              }}
            >
              <Icon size={22} />
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
