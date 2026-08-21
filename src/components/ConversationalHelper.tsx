import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowRight,
  Phone,
  Mic,
  MicOff,
  Sparkles,
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Provider, CategoryId } from '../types';
import { CATEGORIES, getEstimatedDistance } from '../data/mockData';
import { DirectCallModal } from './DirectCallModal';

interface ConversationalHelperProps {
  providers: Provider[];
  selectedTown: string;
  onBookProvider: (provider: Provider) => void;
  onSelectProvider: (provider: Provider) => void;
}

interface DiagnosisResult {
  detectedProblem: string;
  recommendedCategories: { id: CategoryId; name: string; emoji: string; reason: string }[];
  matchedProviders: Provider[];
}

export const ConversationalHelper: React.FC<ConversationalHelperProps> = ({
  providers,
  selectedTown,
  onBookProvider,
  onSelectProvider,
}) => {
  const [problemText, setProblemText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [callingProvider, setCallingProvider] = useState<Provider | null>(null);

  const sampleProblems = [
    '“Water is dripping from the ceiling”',
    '“Fan is making grinding noise & running slow”',
    '“Bike won’t start in the morning”',
    '“Need Class 10 math home teacher”',
    '“Wi-Fi router is showing red light”',
  ];

  // Voice recognition support
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your problem.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Supports Hindi / English mix
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setProblemText(transcript);
        setIsListening(false);
        handleDiagnose(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleDiagnose = (inputToUse?: string) => {
    const text = inputToUse || problemText;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setDiagnosis(null);

    setTimeout(() => {
      const lower = text.toLowerCase();
      const recCategories: { id: CategoryId; name: string; emoji: string; reason: string }[] = [];

      if (lower.includes('water') || lower.includes('ceiling') || lower.includes('leak') || lower.includes('roof') || lower.includes('chhat')) {
        recCategories.push({
          id: 'plumber',
          name: 'Plumber',
          emoji: '🔧',
          reason: 'For internal pipe leaks, water tank overflow, or joint sealing.',
        });
        recCategories.push({
          id: 'mason',
          name: 'Mason / Mistri',
          emoji: '🧱',
          reason: 'For roof waterproofing, slab crack repair, or plaster patching.',
        });
      } else if (lower.includes('fan') || lower.includes('bijli') || lower.includes('switch') || lower.includes('wire') || lower.includes('spark') || lower.includes('light')) {
        recCategories.push({
          id: 'electrician',
          name: 'Electrician',
          emoji: '⚡',
          reason: 'For motor capacitor replacement, switchboard checks, or coil repair.',
        });
      } else if (lower.includes('bike') || lower.includes('car') || lower.includes('scooty') || lower.includes('tyre') || lower.includes('puncture') || lower.includes('engine')) {
        recCategories.push({
          id: 'bike_repair',
          name: 'Two-Wheeler Mechanic',
          emoji: '🏍️',
          reason: 'For carburettor, spark plug, battery or starting issues.',
        });
        recCategories.push({
          id: 'puncture',
          name: 'Puncture & Tyre Service',
          emoji: '🛞',
          reason: 'For tubeless puncture, tube patch, or valve replacement.',
        });
      } else if (lower.includes('tutor') || lower.includes('math') || lower.includes('study') || lower.includes('padhai') || lower.includes('class') || lower.includes('exam')) {
        recCategories.push({
          id: 'tutor',
          name: 'Home / School Tutor',
          emoji: '📚',
          reason: 'For 1-on-1 school tuition, CBSE/HP board syllabus help.',
        });
      } else if (lower.includes('wifi') || lower.includes('internet') || lower.includes('mobile') || lower.includes('laptop') || lower.includes('phone')) {
        recCategories.push({
          id: 'internet_help',
          name: 'Internet / Wi-Fi Technician',
          emoji: '📶',
          reason: 'For fiber cable checking, router setup, and LAN wiring.',
        });
        recCategories.push({
          id: 'mobile_repair',
          name: 'Mobile Repair Specialist',
          emoji: '📱',
          reason: 'For hardware screen, battery replacement, or software reset.',
        });
      } else {
        // General repair default
        recCategories.push({
          id: 'repair',
          name: 'Appliance Repair',
          emoji: '🛠️',
          reason: 'General local home equipment troubleshooting.',
        });
        recCategories.push({
          id: 'electrician',
          name: 'Electrician',
          emoji: '⚡',
          reason: 'General wiring & power supply diagnosis.',
        });
      }

      // Find matching nearby providers
      const catIds = recCategories.map((c) => c.id);
      const matched = providers.filter((p) => catIds.includes(p.category)).slice(0, 3);

      setDiagnosis({
        detectedProblem: text,
        recommendedCategories: recCategories,
        matchedProviders: matched.length > 0 ? matched : providers.slice(0, 2),
      });

      setIsAnalyzing(false);
    }, 250);
  };

  return (
    <section className="py-10 sm:py-14 bg-[#FFF9F3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soft White Editorial Card */}
        <div className="relative rounded-3xl bg-white border border-[#EFE4DC] p-6 sm:p-9 shadow-xs space-y-6 overflow-hidden">
          
          {/* Header */}
          <div className="space-y-1.5 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEE7F4] text-[#493548] text-xs font-bold shadow-2xs">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Simple Service Guidance</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#493548] tracking-tight">
              Not sure who to call?
            </h2>
            <p className="text-xs sm:text-sm text-[#766D75] font-medium">
              Just describe what is broken in Hindi, Pahadi, or English. We’ll guide you to the right person.
            </p>
          </div>

          {/* Input Box with Voice Button */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={2}
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="Example: Water is coming from the ceiling / Paani tapak raha hai..."
                className="w-full p-4 pr-24 rounded-2xl bg-[#FFF9F3] border-2 border-[#EFE4DC] focus:border-[#493548] focus:bg-white text-sm text-[#29242A] placeholder-[#766D75]/60 focus:outline-hidden transition-all resize-none font-medium"
              />

              {/* Voice Search Button */}
              <div className="absolute right-3 bottom-3.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse border-red-600'
                      : 'bg-white text-[#493548] border-[#EFE4DC] hover:bg-[#EEE7F4]'
                  }`}
                  title="Speak in Hindi / Pahadi / English"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleDiagnose()}
                  disabled={!problemText.trim() || isAnalyzing}
                  className="px-4 py-2.5 rounded-xl bg-[#493548] hover:bg-[#352334] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isAnalyzing ? <span>Thinking...</span> : <span>Help Me</span>}
                </button>
              </div>
            </div>

            {/* Quick Example Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-[#766D75]">Try asking:</span>
              {sampleProblems.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const clean = p.replace(/“|”/g, '');
                    setProblemText(clean);
                    handleDiagnose(clean);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EEE7F4] hover:bg-[#E2D6EB] text-[#493548] font-medium transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Section 17 Diagnosis Output */}
          {diagnosis && (
            <div className="space-y-4 pt-4 border-t border-[#F6F0FA] animate-in fade-in duration-200">
              
              {/* Guidance Box */}
              <div className="p-4 rounded-2xl bg-[#FEF9EB] border border-[#F4D98B] space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <h4 className="font-display font-black text-sm text-[#493548]">
                    Suggested Local Trades for this Problem:
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {diagnosis.recommendedCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-3 bg-white rounded-xl border border-[#EFE4DC] space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.emoji}</span>
                        <span className="font-display font-black text-sm text-[#29242A]">
                          {cat.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#766D75] leading-relaxed">
                        {cat.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Nearby People */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#766D75] uppercase tracking-wider">
                  Recommended nearby people in {selectedTown}:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {diagnosis.matchedProviders.map((pro) => (
                    <div
                      key={pro.id}
                      className="p-4 rounded-2xl bg-white border border-[#EFE4DC] flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#EEE7F4]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h5 className="font-display font-black text-sm text-[#29242A] truncate">
                            {pro.name}
                          </h5>
                          <p className="text-xs text-[#766D75] truncate">{pro.title}</p>
                          <div className="flex items-center gap-1.5 text-xs text-[#493548] font-bold">
                            <MapPin className="w-3 h-3 text-[#766D75]" />
                            <span>{pro.town}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setCallingProvider(pro)}
                          className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                          title="Call"
                        >
                          <Phone className="w-4 h-4 fill-white" />
                        </button>
                        <button
                          onClick={() => onBookProvider(pro)}
                          className="px-3 py-2 rounded-xl bg-[#493548] text-white text-xs font-bold hover:bg-[#352334] transition-colors cursor-pointer"
                        >
                          Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Direct Call Modal */}
      <DirectCallModal
        isOpen={!!callingProvider}
        onClose={() => setCallingProvider(null)}
        provider={callingProvider}
      />

    </section>
  );
};
