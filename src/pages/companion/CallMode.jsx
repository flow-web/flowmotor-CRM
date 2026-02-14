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
} from 'lucide-react';
import { transcribeSpeech } from '../../services/ai/companion';
import { CHEAT_SHEET, ALERT_KEYWORDS, LANG_META } from './quickMessages';

const LANGUAGES = ['de', 'it', 'nl', 'en'];

function Toast({ message, visible }) {
  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-medium pointer-events-none transition-all duration-300"
      style={{
        backgroundColor: '#00FF88',
        color: '#0A0A0A',
        fontFamily: 'monospace',
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 8}px)`,
      }}
    >
      {message}
    </div>
  );
}

export default function CallMode() {
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
    <div className="flex flex-col h-full p-4 max-w-2xl mx-auto">
      <Toast message={toast.message} visible={toast.visible} />

      {/* --- Alert Banner --- */}
      {alert && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 transition-all duration-300"
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
          <div>
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

      {/* --- Language Selector --- */}
      <div className="flex items-center gap-1 mb-4">
        {LANGUAGES.map(lang => {
          const meta = LANG_META[lang];
          const isActive = callLang === lang;
          return (
            <button
              key={lang}
              onClick={() => setCallLang(lang)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                fontFamily: 'monospace',
                backgroundColor: isActive ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.03)',
                color: isActive ? '#00FF88' : '#888',
                border: isActive ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span>{meta.flag}</span>
              <span>{meta.short}</span>
            </button>
          );
        })}
      </div>

      {/* --- Big Microphone Button --- */}
      <div className="flex flex-col items-center py-6">
        <button
          onClick={handleMicClick}
          disabled={recordState === 'processing'}
          className="relative flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            width: 120,
            height: 120,
            backgroundColor:
              recordState === 'recording'
                ? 'rgba(255,51,68,0.15)'
                : recordState === 'processing'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.06)',
            border: `2px solid ${
              recordState === 'recording'
                ? '#FF3344'
                : recordState === 'processing'
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(255,255,255,0.12)'
            }`,
            boxShadow:
              recordState === 'recording'
                ? '0 0 40px rgba(255,51,68,0.25), 0 0 80px rgba(255,51,68,0.1)'
                : 'none',
            cursor: recordState === 'processing' ? 'wait' : 'pointer',
          }}
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
            <Loader2 size={40} className="animate-spin" style={{ color: '#888' }} />
          ) : recordState === 'recording' ? (
            <MicOff size={40} style={{ color: '#FF3344' }} />
          ) : (
            <Mic size={40} style={{ color: '#E0E0E0' }} />
          )}
        </button>

        <span
          className="mt-3 text-xs uppercase tracking-wider"
          style={{
            color: recordState === 'recording' ? '#FF3344' : '#666',
            fontFamily: 'monospace',
          }}
        >
          {recordState === 'recording'
            ? 'Enregistrement... Appuyez pour arreter'
            : recordState === 'processing'
            ? 'Transcription en cours...'
            : 'Appuyez pour enregistrer'}
        </span>
      </div>

      {/* --- Live Transcript Area --- */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto rounded-xl p-4 mb-4"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {transcripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8" style={{ color: '#444' }}>
            <Mic size={24} />
            <span className="text-xs mt-2" style={{ fontFamily: 'monospace' }}>
              Les transcriptions apparaitront ici
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transcripts.map((t, i) => (
              <div
                key={i}
                className="rounded-lg p-3 transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
                onClick={() => copyToClipboard(t.translation)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(0,255,136,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                }}
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

      {/* --- Cheat Sheet --- */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          onClick={() => setCheatOpen(!cheatOpen)}
          className="flex items-center gap-2 w-full px-4 py-3 transition-all duration-200"
          style={{ color: '#AAA' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
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
                      className="px-3 py-2 text-xs"
                      style={{
                        backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : '#0A0A0A',
                        color: '#CCC',
                        fontFamily: 'monospace',
                      }}
                    >
                      {item.fr}
                    </div>
                    <div
                      className="px-3 py-2 text-xs cursor-pointer transition-colors duration-200"
                      style={{
                        backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : '#0A0A0A',
                        color: '#E0E0E0',
                        fontFamily: 'monospace',
                      }}
                      onClick={() => copyToClipboard(item[callLang] || item.de)}
                      onMouseEnter={e => (e.currentTarget.style.color = '#00FF88')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#E0E0E0')}
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

      {/* --- CSS Animations (injected inline) --- */}
      <style>{`
        @keyframes micPulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes alertFlash {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
