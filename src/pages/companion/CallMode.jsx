import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
  Copy,
  X,
} from 'lucide-react';
import { transcribeSpeech } from '../../services/ai/companion';
import { CHEAT_SHEET, ALERT_KEYWORDS, LANG_META } from './quickMessages';

const LANGUAGES = ['de', 'it', 'nl', 'en'];

function Toast({ message, visible }) {
  return (
    <div
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-medium pointer-events-none transition-all duration-300"
      style={{
        backgroundColor: '#00FF88',
        color: '#0A0A0A',
        fontFamily: 'monospace',
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : -8}px)`,
      }}
    >
      {message}
    </div>
  );
}

export default function CallMode({ tabBarHeight = 60 }) {
  const [callLang, setCallLang] = useState('de');
  const [recordState, setRecordState] = useState('idle'); // idle | recording | processing
  const [transcripts, setTranscripts] = useState([]);
  const [alert, setAlert] = useState(null);
  const [cheatOpen, setCheatOpen] = useState(false);
  const [cheatSearch, setCheatSearch] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });

  const scrollRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message: msg });
    toastTimer.current = setTimeout(() => setToast({ visible: false, message: '' }), 1500);
  }, []);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copie !');
    } catch {
      showToast('Erreur copie');
    }
  }, [showToast]);

  // Auto-scroll transcripts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Check for alert keywords in transcripts
  const checkAlerts = useCallback((text) => {
    const lower = text.toLowerCase();
    const keywords = ALERT_KEYWORDS[callLang] || ALERT_KEYWORDS.de;
    for (const kw of keywords) {
      if (lower.includes(kw.word.toLowerCase())) {
        setAlert(kw);
        // Try vibration
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
        setTimeout(() => setAlert(null), 4000);
        return;
      }
    }
  }, [callLang]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        setRecordState('processing');
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });

        // Stop all tracks
        stream.getTracks().forEach(t => t.stop());

        try {
          const results = await transcribeSpeech(blob);
          setTranscripts(prev => [...prev, ...results]);
          // Check for alerts in each result
          results.forEach(r => checkAlerts(r.original));
        } catch {
          // silent
        }
        setRecordState('idle');
      };

      recorder.start();
      setRecordState('recording');
    } catch {
      showToast('Micro non disponible');
      setRecordState('idle');
    }
  }, [checkAlerts, showToast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
  }, []);

  const handleMicClick = useCallback(() => {
    if (recordState === 'idle') {
      startRecording();
    } else if (recordState === 'recording') {
      stopRecording();
    }
  }, [recordState, startRecording, stopRecording]);

  // Filter cheat sheet
  const filteredCheat = cheatSearch.trim()
    ? CHEAT_SHEET.filter(item => {
        const s = cheatSearch.toLowerCase();
        return (
          item.fr.toLowerCase().includes(s) ||
          item[callLang]?.toLowerCase().includes(s)
        );
      })
    : CHEAT_SHEET;

  return (
    <div
      className="flex flex-col h-full"
      style={{ touchAction: 'manipulation' }}
    >
      <Toast message={toast.message} visible={toast.visible} />

      {/* ============================================ */}
      {/* SCROLLABLE TOP: Alert + Transcripts + Cheat  */}
      {/* ============================================ */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-3 pb-2">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">

          {/* --- Alert Banner (floats at top when active) --- */}
          {alert && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: alert.severity === 'danger'
                  ? 'rgba(255,51,68,0.12)'
                  : alert.severity === 'warning'
                  ? 'rgba(255,170,0,0.12)'
                  : 'rgba(0,140,255,0.12)',
                border: `1px solid ${
                  alert.severity === 'danger'
                    ? 'rgba(255,51,68,0.3)'
                    : alert.severity === 'warning'
                    ? 'rgba(255,170,0,0.3)'
                    : 'rgba(0,140,255,0.3)'
                }`,
                animation: 'alertFlash 0.5s ease-out',
              }}
            >
              <AlertTriangle
                size={18}
                style={{
                  color: alert.severity === 'danger' ? '#FF3344' : alert.severity === 'warning' ? '#FFAA00' : '#5BA8FF',
                }}
              />
              <div className="flex-1">
                <div
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{
                    color: alert.severity === 'danger' ? '#FF3344' : alert.severity === 'warning' ? '#FFAA00' : '#5BA8FF',
                    fontFamily: 'monospace',
                  }}
                >
                  ALERTE : "{alert.word}"
                </div>
                <div className="text-xs" style={{ color: '#AAA', fontFamily: 'monospace' }}>
                  {alert.meaning}
                </div>
              </div>
            </div>
          )}

          {/* --- Live Transcript Area --- */}
          <div
            ref={scrollRef}
            className="rounded-xl p-3 min-h-[180px]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {transcripts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12" style={{ color: '#333' }}>
                <Mic size={28} />
                <span className="text-xs mt-2 text-center" style={{ fontFamily: 'monospace', color: '#444' }}>
                  Les transcriptions apparaitront ici
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {transcripts.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      touchAction: 'manipulation',
                    }}
                    onClick={() => copyToClipboard(t.translation)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px]" style={{ color: '#555', fontFamily: 'monospace' }}>
                        {t.timestamp}
                      </span>
                      <Copy size={10} style={{ color: '#555' }} />
                    </div>
                    <p className="text-xs mb-1" style={{ color: '#CCC', fontFamily: 'monospace' }}>
                      {t.original}
                    </p>
                    <p className="text-xs" style={{ color: '#5BA8FF', fontFamily: 'monospace' }}>
                      {t.translation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Cheat Sheet (collapsible, in scroll area) --- */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <button
              onClick={() => setCheatOpen(!cheatOpen)}
              className="flex items-center gap-2 w-full px-4 py-3 transition-all duration-200 active:scale-[0.99]"
              style={{ color: '#AAA', touchAction: 'manipulation', minHeight: '48px' }}
            >
              <span className="text-xs font-medium uppercase tracking-wider" style={{ fontFamily: 'monospace' }}>
                Lexique technique
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: '#00FF88', fontFamily: 'monospace' }}>
                {CHEAT_SHEET.length}
              </span>
              <div className="flex-1" />
              {cheatOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {cheatOpen && (
              <div className="px-4 pb-4">
                {/* Search */}
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    minHeight: '44px',
                  }}
                >
                  <Search size={14} style={{ color: '#555' }} />
                  <input
                    type="text"
                    value={cheatSearch}
                    onChange={e => setCheatSearch(e.target.value)}
                    placeholder="Rechercher..."
                    className="flex-1 text-xs outline-none bg-transparent"
                    style={{ color: '#E0E0E0', fontFamily: 'monospace' }}
                  />
                  {cheatSearch && (
                    <button
                      onClick={() => setCheatSearch('')}
                      style={{ color: '#666', minWidth: '32px', minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-label="Effacer la recherche"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Table */}
                <div className="max-h-[280px] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                    {/* Header */}
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: '#0A0A0A', color: '#00FF88', fontFamily: 'monospace' }}>
                      Francais
                    </div>
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: '#0A0A0A', color: '#00FF88', fontFamily: 'monospace' }}>
                      {LANG_META[callLang]?.label || 'Allemand'}
                    </div>

                    {/* Rows */}
                    {filteredCheat.map((item, i) => (
                      <div key={`row-${i}`} className="contents">
                        <div
                          className="px-3 py-2.5 text-xs"
                          style={{
                            backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : '#0A0A0A',
                            color: '#CCC',
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.fr}
                        </div>
                        <div
                          className="px-3 py-2.5 text-xs cursor-pointer transition-colors duration-200 active:bg-white/10"
                          style={{
                            backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : '#0A0A0A',
                            color: '#E0E0E0',
                            fontFamily: 'monospace',
                            touchAction: 'manipulation',
                            minHeight: '40px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          onClick={() => copyToClipboard(item[callLang] || item.de)}
                        >
                          {item[callLang] || item.de}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* BOTTOM DOCK: Language + Mic button (thumb zone) */}
      {/* ============================================ */}
      <div
        className="shrink-0"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: '#0A0A0A',
        }}
      >
        {/* Language selector row */}
        <div className="flex items-center justify-center gap-1.5 px-4 pt-3 pb-2">
          {LANGUAGES.map(lang => {
            const meta = LANG_META[lang];
            const isActive = callLang === lang;
            return (
              <button
                key={lang}
                onClick={() => setCallLang(lang)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95"
                style={{
                  fontFamily: 'monospace',
                  backgroundColor: isActive ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#00FF88' : '#888',
                  border: isActive ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  minHeight: '40px',
                  touchAction: 'manipulation',
                }}
              >
                <span>{meta.flag}</span>
                <span>{meta.short}</span>
              </button>
            );
          })}
        </div>

        {/* Mic button + status */}
        <div className="flex flex-col items-center pb-3 pt-1">
          {/* Status label */}
          <span
            className="text-[11px] uppercase tracking-wider mb-2"
            style={{
              color: recordState === 'recording' ? '#FF3344' : '#555',
              fontFamily: 'monospace',
            }}
          >
            {recordState === 'recording'
              ? 'Enregistrement... Touchez pour arreter'
              : recordState === 'processing'
              ? 'Transcription en cours...'
              : 'Touchez pour enregistrer'}
          </span>

          {/* Big Mic button */}
          <button
            onClick={handleMicClick}
            disabled={recordState === 'processing'}
            className="relative flex items-center justify-center rounded-full transition-all duration-300 active:scale-95"
            style={{
              width: 72,
              height: 72,
              backgroundColor:
                recordState === 'recording'
                  ? 'rgba(255,51,68,0.2)'
                  : recordState === 'processing'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,255,136,0.1)',
              border: `2px solid ${
                recordState === 'recording'
                  ? '#FF3344'
                  : recordState === 'processing'
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,255,136,0.4)'
              }`,
              boxShadow:
                recordState === 'recording'
                  ? '0 0 30px rgba(255,51,68,0.3), 0 0 60px rgba(255,51,68,0.1)'
                  : recordState === 'idle'
                  ? '0 0 20px rgba(0,255,136,0.1)'
                  : 'none',
              cursor: recordState === 'processing' ? 'wait' : 'pointer',
              touchAction: 'manipulation',
            }}
            aria-label={recordState === 'recording' ? 'Arreter l enregistrement' : 'Demarrer l enregistrement'}
          >
            {/* Pulsing ring when recording */}
            {recordState === 'recording' && (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '2px solid rgba(255,51,68,0.4)',
                  animation: 'micPulse 1.5s ease-out infinite',
                }}
              />
            )}

            {recordState === 'processing' ? (
              <Loader2 size={32} className="animate-spin" style={{ color: '#888' }} />
            ) : recordState === 'recording' ? (
              <MicOff size={32} style={{ color: '#FF3344' }} />
            ) : (
              <Mic size={32} style={{ color: '#00FF88' }} />
            )}
          </button>
        </div>
      </div>

      {/* --- CSS Animations (injected inline) --- */}
      <style>{`
        @keyframes micPulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes alertFlash {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
