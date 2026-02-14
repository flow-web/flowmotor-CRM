import { useState, useRef, useCallback } from 'react';
import {
  ClipboardPaste,
  Copy,
  Check,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  detectLanguage,
  translateMessage,
  suggestCounterArguments,
} from '../../services/ai/companion';
import { QUICK_MESSAGES, LANG_META } from './quickMessages';

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

export default function ChatMode() {
  const [sellerText, setSellerText] = useState('');
  const [selectedLang, setSelectedLang] = useState('de');
  const [detectedLang, setDetectedLang] = useState(null);

  // Translation state
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState(null);

  // Strategy state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [strategies, setStrategies] = useState([]);

  // Quick actions
  const [quickLang, setQuickLang] = useState('de');
  const [quickExpanded, setQuickExpanded] = useState(true);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: '' });
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

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSellerText(text);
        processMessage(text);
      }
    } catch {
      showToast('Acces presse-papier refuse');
    }
  }, []);

  const processMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Detect language
    const lang = detectLanguage(text);
    setDetectedLang(lang);

    // Translate
    setIsTranslating(true);
    setTranslation(null);
    try {
      const result = await translateMessage(text, lang);
      setTranslation(result.translatedText);
    } catch {
      setTranslation('Erreur de traduction');
    }
    setIsTranslating(false);

    // Get strategies
    setIsAnalyzing(true);
    setStrategies([]);
    try {
      const strats = await suggestCounterArguments(text, { language: lang });
      setStrategies(strats);
    } catch {
      // silent
    }
    setIsAnalyzing(false);
  }, []);

  const handleSubmitText = useCallback(() => {
    if (sellerText.trim()) {
      processMessage(sellerText);
    }
  }, [sellerText, processMessage]);

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <Toast message={toast.message} visible={toast.visible} />

      {/* --- Language Selector for Quick Actions --- */}
      <div className="flex items-center gap-1">
        {LANGUAGES.map(lang => {
          const meta = LANG_META[lang];
          const isActive = quickLang === lang;
          return (
            <button
              key={lang}
              onClick={() => setQuickLang(lang)}
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

      {/* --- Input Area --- */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <textarea
          value={sellerText}
          onChange={e => setSellerText(e.target.value)}
          placeholder="Collez le message du vendeur..."
          rows={4}
          className="w-full resize-none text-sm outline-none placeholder:text-gray-600"
          style={{
            backgroundColor: 'transparent',
            color: '#E0E0E0',
            fontFamily: 'monospace',
          }}
        />
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handlePaste}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: 'rgba(0,255,136,0.1)',
              color: '#00FF88',
              border: '1px solid rgba(0,255,136,0.25)',
              fontFamily: 'monospace',
              minHeight: '48px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(0,255,136,0.2)';
              e.currentTarget.style.borderColor = 'rgba(0,255,136,0.5)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(0,255,136,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(0,255,136,0.1)';
              e.currentTarget.style.borderColor = 'rgba(0,255,136,0.25)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ClipboardPaste size={16} />
            COLLER
          </button>

          <button
            onClick={handleSubmitText}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: sellerText.trim() ? '#00FF88' : 'rgba(255,255,255,0.05)',
              color: sellerText.trim() ? '#0A0A0A' : '#555',
              border: '1px solid transparent',
              fontFamily: 'monospace',
              minHeight: '48px',
            }}
          >
            <Sparkles size={16} />
            ANALYSER
          </button>

          {detectedLang && (
            <div
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{
                backgroundColor: 'rgba(0,255,136,0.08)',
                color: '#00FF88',
                border: '1px solid rgba(0,255,136,0.2)',
                fontFamily: 'monospace',
              }}
            >
              <span>{LANG_META[detectedLang]?.flag}</span>
              <span>{LANG_META[detectedLang]?.short}</span>
            </div>
          )}
        </div>
      </div>

      {/* --- Translation Output --- */}
      {(isTranslating || translation) && (
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{
                  backgroundColor: 'rgba(0,140,255,0.15)',
                  color: '#5BA8FF',
                  fontFamily: 'monospace',
                }}
              >
                FR
              </div>
              <span className="text-xs" style={{ color: '#666', fontFamily: 'monospace' }}>
                Traduction
              </span>
            </div>
            {translation && (
              <button
                onClick={() => copyToClipboard(translation)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200"
                style={{ color: '#888', fontFamily: 'monospace' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00FF88')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >
                <Copy size={12} />
                Copier
              </button>
            )}
          </div>

          {isTranslating ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 size={14} className="animate-spin" style={{ color: '#00FF88' }} />
              <span className="text-xs" style={{ color: '#666', fontFamily: 'monospace' }}>
                Traduction en cours...
              </span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: '#CCC', fontFamily: 'monospace' }}>
              {translation}
            </p>
          )}
        </div>
      )}

      {/* --- AI Strategy Suggestions --- */}
      {(isAnalyzing || strategies.length > 0) && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: '#FFAA00' }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#FFAA00', fontFamily: 'monospace' }}>
              Strategies suggerees
            </span>
          </div>

          {isAnalyzing ? (
            <div className="flex items-center gap-2 py-4 justify-center">
              <Loader2 size={16} className="animate-spin" style={{ color: '#FFAA00' }} />
              <span className="text-xs" style={{ color: '#666', fontFamily: 'monospace' }}>
                Analyse du message...
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {strategies.map((strat, i) => (
                <button
                  key={i}
                  onClick={() => copyToClipboard(strat.message)}
                  className="text-left rounded-xl p-4 transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)';
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,136,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: 'rgba(255,170,0,0.15)',
                        color: '#FFAA00',
                        fontFamily: 'monospace',
                      }}
                    >
                      #{i + 1}
                    </span>
                    <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                      {strat.label}
                    </span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: '#888' }}>
                    {strat.description}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#AAA', fontFamily: 'monospace' }}>
                    {strat.message.length > 120 ? strat.message.slice(0, 120) + '...' : strat.message}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-[10px]" style={{ color: '#555', fontFamily: 'monospace' }}>
                    <Copy size={10} />
                    Cliquer pour copier
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- Quick Actions (Stream Deck) --- */}
      <div>
        <button
          onClick={() => setQuickExpanded(!quickExpanded)}
          className="flex items-center gap-2 mb-3 w-full"
        >
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#00FF88', fontFamily: 'monospace' }}>
            Actions rapides
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(0,255,136,0.15)' }} />
          {quickExpanded ? (
            <ChevronUp size={14} style={{ color: '#00FF88' }} />
          ) : (
            <ChevronDown size={14} style={{ color: '#00FF88' }} />
          )}
        </button>

        {quickExpanded && (
          <div className="grid grid-cols-3 gap-2">
            {(QUICK_MESSAGES[quickLang] || QUICK_MESSAGES.de).map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => copyToClipboard(item.message)}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#CCC',
                    minHeight: '72px',
                    padding: '12px 8px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,255,136,0.4)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,136,0.08)';
                    e.currentTarget.style.color = '#00FF88';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.color = '#CCC';
                  }}
                >
                  <Icon size={18} />
                  <span className="text-[11px] font-medium text-center leading-tight" style={{ fontFamily: 'monospace' }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
