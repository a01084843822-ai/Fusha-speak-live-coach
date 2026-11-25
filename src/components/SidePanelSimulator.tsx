/**
 * @license
 * Fusha-Speak Live Coach - Side Panel Simulator
 * High-fidelity interactive simulation of the Chrome Side Panel companion.
 * Royal Blue Edition with not-allowed microphone error diagnosis and 36 dialogues.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Info,
  ExternalLink
} from 'lucide-react';
import {
  diacritize,
  evaluatePronunciation,
  EvaluationResult
} from '../data/rules_engine';
import { ALL_SCENARIOS, Scenario } from '../data/scenarios';

const SAMPLE_WEB_ARTICLES = [
  {
    title: 'تَارِيخُ اللُّغَةِ الْعَرَبِيَّةِ وَأَهَمِّيَّتُهَا',
    source: 'مَجَلَّةُ الْبَلَاغَةِ وَالْأَدَبِ',
    rawText: 'اللغة العربية من اقدم اللغات السامية واعظمها انتشارا في العالم. وهي لغة القران الكريم التي نزل بها الوحي على رسول الله صلى الله عليه وسلم.',
    snippet: 'ئەرەب تىلى دۇنيادىكى ئەڭ قەدىمىي ۋە كەڭ تارقالغان تىللارنىڭ بىرى بولۇپ، قۇرئان كەرىمنىڭ مۇقەددەس تىلىدۇر.'
  },
  {
    title: 'فَضْلُ طَلَبِ الْعِلْمِ فِي الْإِسْلَامِ',
    source: 'مَوْسُوعَةُ الْحَدِيثِ الشَّرِيفِ',
    rawText: 'طلب العلم فريضة على كل مسلم ومسلمة، ومن سلك طريقا يلتمس فيه علما سهل الله له به طريقا الى الجنة.',
    snippet: 'ئىلىم تەلەپ قىلىش ھەر بىر مۇسۇلمانغا پەرزدۇر؛ ئىلىم يولىدا ماڭغان كىشىگە ئاللاھ جەننەت يولىنى ئاسانلاشتۇرىدۇ.'
  },
  {
    title: 'أَهَمِّيَّةُ الْفَصَاحَةِ وَتَقْوِيمِ اللِّسَانِ',
    source: 'مَجْمَعُ اللُّغَةِ الْعَرَبِيَّةِ',
    rawText: 'الفصاحة هي خلو الكلام من التعقيد وتنافر الحروف، ومراعاة مخارج الحروف من الحلق واللسان والشفتين بدقة عالية.',
    snippet: 'فاساھەتلىك بولۇش گەپ-سۆزنىڭ مۇرەككەپلىكتىن ۋە ھەرپ زىددىيەتلىرىدىن پاكىز بولۇشىدۇر.'
  }
];

export default function SidePanelSimulator() {
  const [isSplitMode, setIsSplitMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'speech' | 'tashkeel' | 'dialogue'>('speech');
  const [selectedArticleIdx, setSelectedArticleIdx] = useState<number>(0);

  // Tashkeel state
  const [tashkeelInput, setTashkeelInput] = useState<string>('السلام عليكم ورحمة الله وبركاته، مرحبا بكم في الجامعة.');
  const [tashkeelResult, setTashkeelResult] = useState<string>('');
  const [copiedTashkeel, setCopiedTashkeel] = useState<boolean>(false);

  // Speech practice state
  const [targetSentence, setTargetSentence] = useState<string>(
    'أَبْحَثُ عَنْ مُعْجَمٍ لُغَوِيٍّ مُعْتَمَدٍ، وَكُتُبٍ فِي فَصَاحَةِ اللِّسَانِ.'
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingStatus, setRecordingStatus] = useState<string>('مىكروفوننى بېسىپ نىشان جۈملىنى ئوقۇڭ');
  const [micErrorNotAllowed, setMicErrorNotAllowed] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  // Dialogue selection
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('islamic_seminar');
  const currentScenario: Scenario = ALL_SCENARIOS.find((s) => s.id === selectedScenarioId) || ALL_SCENARIOS[0];

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setTashkeelResult(diacritize(tashkeelInput));
  }, []);

  const handleDiacritize = () => {
    if (!tashkeelInput.trim()) return;
    const res = diacritize(tashkeelInput.trim());
    setTashkeelResult(res);
  };

  const handleCopyTashkeel = async () => {
    if (!tashkeelResult) return;
    try {
      await navigator.clipboard.writeText(tashkeelResult);
      setCopiedTashkeel(true);
      setTimeout(() => setCopiedTashkeel(false), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const speakArabic = (text: string, rate: number = 1.0) => {
    if (!('speechSynthesis' in window)) {
      alert('كۆرگۈچىڭىز ئاۋاز تېخنىكىسىنى تولۇق قوللىمىدى.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar') || v.lang.includes('SA'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Robust voice recording with getUserMedia preflight to diagnose not-allowed error
  const startVoiceRecording = async () => {
    setMicErrorNotAllowed(false);

    // 1. Preflight permission check
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        console.warn('getUserMedia check:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicErrorNotAllowed(true);
          setRecordingStatus('مىكروفون رۇخسىتى بېرىلمىگەن (not-allowed).');
          return;
        }
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecordingStatus('كۆرگۈچىڭىزدە Web Speech Recognition تېخنىكىسى ئېچىلمىغان.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingStatus('ئاڭلاۋاتىدۇ... نىشان فۇسھا جۈملىنى ئوقۇڭ');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecordingStatus(`ئاڭلاندى: «${transcript}»`);
        const evalRes = evaluatePronunciation(targetSentence, transcript);
        setEvaluation(evalRes);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        if (event.error === 'not-allowed') {
          setMicErrorNotAllowed(true);
          setRecordingStatus('مىكروفون كاشىلىسى (not-allowed). ئادرېس تاختىسىدىن رۇخسەت بېرىڭ.');
        } else {
          setRecordingStatus(`ئاۋاز خاتالىقى: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Speech recognition exception:', err);
      setMicErrorNotAllowed(true);
      setRecordingStatus(`مىكروفوننى ئېچىشتا مەسىلە كۆرۈلدى: ${err.message}`);
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  // Instant simulator fallback for testing speech evaluation
  const handleSimulatePronunciation = (scorePreset: number) => {
    setMicErrorNotAllowed(false);
    let mockSpoken = targetSentence;
    if (scorePreset === 100) {
      mockSpoken = targetSentence;
    } else if (scorePreset === 80) {
      mockSpoken = targetSentence.replace(/ع/g, 'ء').replace(/ح/g, 'ه');
    } else {
      mockSpoken = 'أنا طالب في هذا اليوم';
    }
    setRecordingStatus(`سىناق سىگنالى: «${mockSpoken}»`);
    const evalRes = evaluatePronunciation(targetSentence, mockSpoken);
    setEvaluation(evalRes);
  };

  const handleSendArticleToTashkeel = (text: string) => {
    setTashkeelInput(text);
    const res = diacritize(text);
    setTashkeelResult(res);
    setActiveTab('tashkeel');
  };

  return (
    <div className="w-full space-y-4">
      {/* Simulation Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Chrome Side Panel جانلىق سىناق كۆزنىكى
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">ئۆلچەم كەڭلىكى: 380px · كۆك ئۇسلۇب</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSplitMode(!isSplitMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            {isSplitMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>پۈتۈن كۆزنەك</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>يانداش كۆرۈنۈش</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Dual Stage: Browser Window + Side Panel */}
      <div className={`grid gap-4 ${isSplitMode ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Left Side: Simulated Web Page in Chrome (when in split mode) */}
        {isSplitMode && (
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80"></span>
              </div>
              <div className="px-3 py-1 bg-slate-900 rounded-md text-slate-400 font-mono text-[11px] truncate max-w-xs">
                https://maktaba-fusha.org/articles/ilm-wa-adab
              </div>
              <span className="text-slate-400 text-[11px]">تور بەت كۆرۈنۈشى</span>
            </div>

            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              <div className="space-y-2">
                <span className="text-xs text-blue-400 font-medium">
                  {SAMPLE_WEB_ARTICLES[selectedArticleIdx].source}
                </span>
                <h2 className="text-xl font-bold font-arabic text-slate-100 leading-relaxed">
                  {SAMPLE_WEB_ARTICLES[selectedArticleIdx].title}
                </h2>
                <p className="text-xs text-slate-400">
                  {SAMPLE_WEB_ARTICLES[selectedArticleIdx].snippet}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                <p className="text-lg font-arabic text-slate-200 leading-loose text-justify">
                  {SAMPLE_WEB_ARTICLES[selectedArticleIdx].rawText}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-slate-400">
                    بۇ جۈملىنى يان تاختىدا ھەرىكەتلەندۈرۈپ ئاڭلىماقچىمۇ؟
                  </span>
                  <button
                    onClick={() => handleSendArticleToTashkeel(SAMPLE_WEB_ARTICLES[selectedArticleIdx].rawText)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-xs shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>يان تاختىغا ئەۋەتىپ ھەرىكەتلەندۈرۈش</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-400">باشقا ئوقۇشلۇق تېكىستلەر:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_WEB_ARTICLES.map((art, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedArticleIdx(idx)}
                      className={`p-3 text-right rounded-xl border transition-all text-xs ${
                        selectedArticleIdx === idx
                          ? 'bg-slate-800/90 border-blue-500/60 text-slate-100'
                          : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-arabic text-sm font-semibold truncate mb-1">
                        {art.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {art.snippet}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Side: The Actual Side Panel (380px standard) */}
        <div className={`${isSplitMode ? 'lg:col-span-5' : 'max-w-md mx-auto w-full'} bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col`}>
          {/* Side Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                ف
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-100">فۇسھا يان مەشقاۋۇلى</h3>
                <p className="text-[10px] text-slate-400">Chrome Side Panel Companion</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono">
                100% يەرلىك
              </span>
            </div>
          </div>

          {/* Side Panel Tab Bar */}
          <div className="flex items-center p-1 bg-slate-950/70 border-b border-slate-800 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('speech')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors ${
                activeTab === 'speech'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              نۇتۇق مەشقى
            </button>
            <button
              onClick={() => setActiveTab('tashkeel')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors ${
                activeTab === 'tashkeel'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ھەرىكەت قويۇش
            </button>
            <button
              onClick={() => setActiveTab('dialogue')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors ${
                activeTab === 'dialogue'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              سىنارىيە (36 جۈملە)
            </button>
          </div>

          {/* Tab 1: Live Pronunciation Speech Coach */}
          {activeTab === 'speech' && (
            <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
              {/* Target Sentence Card */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>نىشان فۇسھا جۈملىسى:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setAudioSpeed(audioSpeed === 1.0 ? 0.75 : audioSpeed === 0.75 ? 1.25 : 1.0)}
                      className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]"
                    >
                      {audioSpeed}x سۈرئەت
                    </button>
                  </div>
                </div>
                <div className="text-base font-arabic font-medium text-sky-300 leading-loose">
                  {targetSentence}
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => speakArabic(targetSentence, audioSpeed)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors text-[11px]"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>ئەسلى ئاۋازنى ئاڭلاش</span>
                  </button>
                </div>
              </div>

              {/* Microphone Button Stage */}
              <div className="flex flex-col items-center justify-center p-5 bg-slate-950/40 border border-slate-800/60 rounded-xl text-center space-y-3">
                <button
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-blue-400 border-2 border-blue-500/50 hover:border-blue-500'
                  }`}
                  title={isRecording ? 'توختىتىش' : 'سۆزلەش ئۈچۈن بېسىڭ'}
                >
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <div className="text-xs text-slate-300 font-medium">
                  {recordingStatus}
                </div>

                {/* Not-Allowed Error Diagnosis Box */}
                {micErrorNotAllowed && (
                  <div className="w-full p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-right text-[11px] text-rose-300 space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-rose-200">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>مىكروفون رۇخسىتى بېرىلمىگەن (not-allowed):</span>
                    </div>
                    <p className="text-rose-200/90 leading-relaxed">
                      Chrome كۆرگۈچىدە مىكروفون رۇخسىتى قوزغالمىغان بولۇشى مۇمكىن. تور كۆرگۈچنىڭ ئادرېس بالدىقىدىكى تەڭشەك بەلگىسىنى بېسىپ مىكروفونغا رۇخسەت بېرىڭ ياكى تۆۋەندىكى تېز سىناق كۇنۇپكىلىرى ئارقىلىق تەلەپپۇز باھالاش ماتورىنى بىۋاسىتە ئىشلىتىڭ.
                    </p>
                  </div>
                )}

                {/* Simulator fallback test triggers */}
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                  <span>تېز سىناق:</span>
                  <button
                    onClick={() => handleSimulatePronunciation(100)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-blue-400 text-[10px]"
                  >
                    تولۇق توغرا (100)
                  </button>
                  <button
                    onClick={() => handleSimulatePronunciation(80)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-400 text-[10px]"
                  >
                    مەخرەج خاتالىقى (80)
                  </button>
                </div>
              </div>

              {/* Evaluation Result Feedback */}
              {evaluation && (
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">باھالاش نەتىجىسى:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                        evaluation.score >= 85
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : evaluation.score >= 60
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {evaluation.score} نومۇر
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{evaluation.feedback}</p>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400">سۆزمۇ-سۆز تەكشۈرۈش:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {evaluation.detailedWords.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-1.5 px-2.5 rounded-lg border text-right ${
                            item.status === 'correct'
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                              : item.status === 'near'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          }`}
                        >
                          <div className="font-arabic text-sm">{item.target}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {item.spoken} ({item.label})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {evaluation.makharijTips && evaluation.makharijTips.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      {evaluation.makharijTips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-[11px] space-y-1"
                        >
                          <div className="font-semibold flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>{tip.title}</span>
                          </div>
                          <div className="text-amber-200/90 leading-relaxed">
                            {tip.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Tashkeel Engine */}
          {activeTab === 'tashkeel' && (
            <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
              <div className="space-y-2">
                <label className="block text-slate-400 font-medium">ئەرەبچە تېكىست كىرگۈزۈڭ:</label>
                <textarea
                  value={tashkeelInput}
                  onChange={(e) => setTashkeelInput(e.target.value)}
                  placeholder="ھەرىكەت قويماقچى بولغان ئەرەبچە تېكىستنى بۇ يەرگە يېزىڭ..."
                  className="w-full h-24 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-arabic text-base leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleDiacritize}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ھەرىكەت قويۇش</span>
                  </button>
                  <button
                    onClick={() => { setTashkeelInput(''); setTashkeelResult(''); }}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  >
                    تازىلاش
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>ھەرىكەتلەندۈرۈلگەن تېكىست:</span>
                  {copiedTashkeel && (
                    <span className="text-blue-400 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> كۆچۈرۈلدى
                    </span>
                  )}
                </div>
                <div className="text-base font-arabic text-slate-100 leading-loose min-h-[50px]">
                  {tashkeelResult || 'نەتىجە بۇ يەردە كۆرۈنىدۇ...'}
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => speakArabic(tashkeelResult, audioSpeed)}
                    disabled={!tashkeelResult}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-md transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>ئاۋازدا ئوقۇش</span>
                  </button>
                  <button
                    onClick={handleCopyTashkeel}
                    disabled={!tashkeelResult}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-md transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>كۆچۈرۈش</span>
                  </button>
                  <button
                    onClick={() => {
                      setTargetSentence(tashkeelResult);
                      setActiveTab('speech');
                    }}
                    disabled={!tashkeelResult}
                    className="flex items-center gap-1 px-2.5 py-1 bg-blue-700/60 hover:bg-blue-600 disabled:opacity-40 text-white rounded-md transition-colors"
                  >
                    <span>نۇتۇققا ئەۋەتىش</span>
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Dialogue Scenarios (36 sentences) */}
          {activeTab === 'dialogue' && (
            <div className="p-4 space-y-3.5 flex-1 overflow-y-auto text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">مۇھىت سىنارىيەسى (6 كۆرۈنۈش - 36 جۈملە):</label>
                <select
                  value={selectedScenarioId}
                  onChange={(e) => setSelectedScenarioId(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-uyghur focus:outline-none focus:border-blue-500"
                >
                  {ALL_SCENARIOS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.arabicTitle} - {s.dialogues.length} جۈملە)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">{currentScenario.description}</p>
              </div>

              <div className="space-y-3 pt-1">
                {currentScenario.dialogues.map((d, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border ${
                      d.speaker === 'coach'
                        ? 'bg-slate-950/80 border-slate-800/80 text-right'
                        : 'bg-blue-950/20 border-blue-800/40 text-right'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-bold ${d.speaker === 'coach' ? 'text-blue-400' : 'text-sky-400'}`}>
                        {d.name}
                      </span>
                      {d.speaker === 'coach' && d.arabic && (
                        <button
                          onClick={() => speakArabic(d.arabic || '', 1.0)}
                          className="p-1 hover:bg-slate-800 text-slate-300 rounded"
                          title="ئاڭلاش"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                        </button>
                      )}
                    </div>

                    {d.speaker === 'coach' ? (
                      <>
                        <div className="font-arabic text-sm text-slate-100 leading-relaxed mb-1">
                          {d.arabic}
                        </div>
                        <div className="text-[11px] text-slate-400">{d.uyghur}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-[11px] text-slate-300 mb-1.5">{d.promptUyghur}</div>
                        <div className="font-arabic text-sm text-sky-200 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 leading-relaxed mb-1.5">
                          {d.targetArabic}
                        </div>
                        {d.hints && (
                          <div className="text-[10px] text-amber-400/90 mb-2">
                            💡 ئەسكەرتىش: {d.hints}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            if (d.targetArabic) {
                              setTargetSentence(d.targetArabic);
                              setActiveTab('speech');
                            }
                          }}
                          className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>بۇ جۈملىنى مەشىق قىلىش</span>
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <span>نۆل تېلېمېتىرىيە · پۈتۈنلەي مەخپىي</span>
            <span>Manifest V3 Side Panel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
