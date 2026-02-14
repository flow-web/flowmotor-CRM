import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ClipboardPaste,
  Copy,
  Loader2,
  Sparkles,
  Globe,
  X,
  ChevronDown,
  ChevronUp,
  Send,
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

export default function ChatMode({ tabBarHeight = 60 }) {
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
  const [quickExpanded, setQuickExpanded] = useState(false);

  // Language bottom-sheet
  const [langSheetOpen, setLangSheetOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);
  const scrollRef = useRef(null);

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

  // Scroll to bottom of results when new content arrives
  useEffect(() => {
    if (scrollRef.current && (translation || strategies.length > 0)) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [translation, strategies]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ touchAction: 'manipulation' }}
    >
      <Toast message={toast.message} visible={toast.visible} />

      {/* ============================================ */}
      {/* SCROLLABLE RESULTS AREA (top, grows upward)  */}
      {/* ============================================ */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-2"
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {/* Empty state */}
          {!translation && strategies.length === 0 && !isTranslating && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: '#333' }}>
              <Sparkles size={32} />
              <span className="text-xs mt-3 text-center leading-relaxed" style={{ fontFamily: 'monospace', color: '#444' }}>
                Collez un message vendeur ci-dessous
                <br />
                pour le traduire et obtenir des strategies
              </span>
            </div>
          )}

          {/* --- Pasted/Original text (shown as bubble) --- */}
          {sellerText.trim() && (translation || isTranslating) && (
            <div className="flex justify-end">
              <div
                className="rounded-2xl rounded-br-sm px-4 py-3 max-w-[85%]"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {detectedLang && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: 'rgba(0,255,136,0.1)',
                        color: '#00FF88',
                        fontFamily: 'monospace',
                      }}
                    >
                      {LANG_META[detectedLang]?.flag} {LANG_META[detectedLang]?.short}
                    </span>
                  </div>
                )}
                <p className="text-xs leading-relaxed" style={{ color: '#AAA', fontFamily: 'monospace' }}>
                  {sellerText.length > 200 ? sellerText.slice(0, 200) + '...' : sellerText}
                </p>
              </div>
            </div>
          )}

          {/* --- Translation Output (left-aligned bubble) --- */}
          {(isTranslating || translation) && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]"
                style={{
                  backgroundColor: 'rgba(0,140,255,0.08)',
                  border: '1px solid rgba(0,140,255,0.15)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
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
                    <span className="text-[10px]" style={{ color: '#666', fontFamily: 'monospace' }}>
                      Traduction
                    </span>
                  </div>
                  {translation && (
                    <button
                      onClick={() => copyToClipboard(translation)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200"
                      style={{ color: '#888', fontFamily: 'monospace', minWidth: '44px', minHeight: '44px', justifyContent: 'center' }}
                    >
                      <Copy size={14} />
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
                      className="text-left rounded-xl p-4 transition-all duration-200 active:scale-[0.98]"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        touchAction: 'manipulation',
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
                        Toucher pour copier
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* BOTTOM DOCK: Quick actions + Input area      */}
      {/* All in thumb zone, docked above tab bar      */}
      {/* ============================================ */}
      <div
        className="shrink-0"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: '#0A0A0A',
        }}
      >
        {/* --- Quick Actions (horizontal scroll strip) --- */}
        {quickExpanded && (
          <div
            className="px-3 pt-3 pb-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Language pills for quick messages */}
            <div className="flex items-center gap-1 mb-2">
              {LANGUAGES.map(lang => {
                const meta = LANG_META[lang];
                const isActive = quickLang === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setQuickLang(lang)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200"
                    style={{
                      fontFamily: 'monospace',
                      backgroundColor: isActive ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.03)',
                      color: isActive ? '#00FF88' : '#888',
                      border: isActive ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      minHeight: '36px',
                      touchAction: 'manipulation',
                    }}
                  >
                    <span>{meta.flag}</span>
                    <span>{meta.short}</span>
                  </button>
                );
              })}
            </div>

            {/* Horizontal scrollable quick message chips */}
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {(QUICK_MESSAGES[quickLang] || QUICK_MESSAGES.de).map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => copyToClipboard(item.message)}
                    className="flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-2 transition-all duration-200 active:scale-95"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#CCC',
                      minHeight: '40px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      touchAction: 'manipulation',
                    }}
                  >
                    <Icon size={14} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- Input bar (messaging-app style) --- */}
        <div className="px-3 py-2">
          <div className="max-w-2xl mx-auto flex items-end gap-2">
            {/* Toggle quick actions */}
            <button
              onClick={() => setQuickExpanded(!quickExpanded)}
              className="shrink-0 flex items-center justify-center rounded-full transition-all duration-200 active:scale-90"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: quickExpanded ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.06)',
                color: quickExpanded ? '#00FF88' : '#888',
                border: quickExpanded ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(255,255,255,0.08)',
                touchAction: 'manipulation',
              }}
              aria-label="Actions rapides"
            >
              {quickExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>

            {/* Paste button */}
            <button
              onClick={handlePaste}
              className="shrink-0 flex items-center justify-center rounded-full transition-all duration-200 active:scale-90"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(0,255,136,0.08)',
                color: '#00FF88',
                border: '1px solid rgba(0,255,136,0.2)',
                touchAction: 'manipulation',
              }}
              aria-label="Coller du presse-papier"
            >
              <ClipboardPaste size={18} />
            </button>

            {/* Text input (compact, single-line expanding to max 3 lines) */}
            <div
              className="flex-1 rounded-2xl overflow-hidden"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <textarea
                value={sellerText}
                onChange={e => setSellerText(e.target.value)}
                placeholder="Message du vendeur..."
                rows={1}
                className="w-full resize-none text-sm outline-none px-4 py-2.5"
                style={{
                  backgroundColor: 'transparent',
                  color: '#E0E0E0',
                  fontFamily: 'monospace',
                  maxHeight: '80px',
                  minHeight: '40px',
                  lineHeight: '1.4',
                }}
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                }}
              />
            </div>

            {/* Send/Analyze button */}
            <button
              onClick={handleSubmitText}
              disabled={!sellerText.trim()}
              className="shrink-0 flex items-center justify-center rounded-full transition-all duration-200 active:scale-90"
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: sellerText.trim() ? '#00FF88' : 'rgba(255,255,255,0.05)',
                color: sellerText.trim() ? '#0A0A0A' : '#555',
                touchAction: 'manipulation',
                cursor: sellerText.trim() ? 'pointer' : 'default',
              }}
              aria-label="Analyser le message"
            >
              {isTranslating || isAnalyzing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* LANGUAGE BOTTOM-SHEET (slides up from bottom) */}
      {/* ============================================ */}
      {langSheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={() => setLangSheetOpen(false)}
          />
          {/* Sheet */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl px-4 pt-4 pb-8"
            style={{
              backgroundColor: '#141414',
              border: '1px solid rgba(255,255,255,0.08)',
              borderBottom: 'none',
              paddingBottom: `calc(32px + env(safe-area-inset-bottom, 0px))`,
              animation: 'slideUp 0.25s ease-out',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: '#FFF', fontFamily: 'monospace' }}>
                Langue du vendeur
              </span>
              <button
                onClick={() => setLangSheetOpen(false)}
                className="flex items-center justify-center rounded-full"
                style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#888' }}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {LANGUAGES.map(lang => {
                const meta = LANG_META[lang];
                const isActive = quickLang === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      setQuickLang(lang);
                      setLangSheetOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 active:scale-[0.98]"
                    style={{
                      backgroundColor: isActive ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.04)',
                      border: isActive ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      touchAction: 'manipulation',
                      minHeight: '52px',
                    }}
                  >
                    <span className="text-xl">{meta.flag}</span>
                    <span className="text-sm font-medium" style={{ color: isActive ? '#00FF88' : '#CCC', fontFamily: 'monospace' }}>
                      {meta.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: '#00FF88' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* --- CSS Animations --- */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
