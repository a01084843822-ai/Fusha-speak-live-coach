/**
 * @license
 * Fusha-Speak Live Coach - Situational Dialogues View
 * Royal Blue Edition with 36 authentic dialogue sentences.
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Volume2,
  Mic,
  Award,
  BookOpen,
  Compass,
  HeartPulse,
  Coffee,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { ALL_SCENARIOS, Scenario } from '../data/scenarios';
import { evaluatePronunciation, EvaluationResult } from '../data/rules_engine';

export default function DialoguesView() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('islamic_seminar');
  const [activeEvaluation, setActiveEvaluation] = useState<{ stepIndex: number; result: EvaluationResult } | null>(null);

  const filteredScenarios = activeCategory === 'all'
    ? ALL_SCENARIOS
    : ALL_SCENARIOS.filter((s) => s.category === activeCategory);

  const currentScenario: Scenario = ALL_SCENARIOS.find((s) => s.id === selectedScenarioId) || ALL_SCENARIOS[0];

  const totalSentenceCount = ALL_SCENARIOS.reduce((sum, s) => sum + s.dialogues.length, 0);

  const speak = (text: string, rate: number = 1.0) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ar-SA';
    utt.rate = rate;
    window.speechSynthesis.speak(utt);
  };

  const handleSimulateStepPractice = (stepIndex: number, targetText: string, accuracy: number) => {
    let mockSpoken = targetText;
    if (accuracy === 80) {
      mockSpoken = targetText.replace(/ع/g, 'ء').replace(/ح/g, 'ه');
    }
    const evalRes = evaluatePronunciation(targetText, mockSpoken);
    setActiveEvaluation({ stepIndex, result: evalRes });
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">مۇھىت تۈرلىرى:</span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl">
            {[
              { id: 'all', label: 'ھەممىسى' },
              { id: 'ئىلىم', label: 'ئىلىم ۋە مەرىپەت' },
              { id: 'سەپەر', label: 'ساياھەت ۋە سەپەر' },
              { id: 'مەدەنىيەت', label: 'ئەدەبىيات ۋە مەدەنىيەت' },
              { id: 'تۇرمۇش', label: 'كۈندىلىك تۇرمۇش' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
            جەمئىي {totalSentenceCount} ئەمەلىي جۈملە
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenarios Sidebar Selector */}
        <div className="lg:col-span-4 space-y-2.5">
          {filteredScenarios.map((scen) => (
            <button
              key={scen.id}
              onClick={() => {
                setSelectedScenarioId(scen.id);
                setActiveEvaluation(null);
              }}
              className={`w-full p-4 rounded-2xl border text-right transition-all flex flex-col gap-1.5 ${
                selectedScenarioId === scen.id
                  ? 'bg-slate-900 border-blue-500/60 shadow-md ring-1 ring-blue-500/30'
                  : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {scen.dialogues.length} جۈملە
                </span>
                <span className="text-xs font-bold text-slate-100">
                  {scen.title}
                </span>
              </div>
              <div className="text-sm font-arabic font-semibold text-blue-400">
                {scen.arabicTitle}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {scen.description}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Scenario Active Dialogue Stage */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">
                مۇھىت سۆھبىتى: {currentScenario.category} · دەرىجىسى: {currentScenario.level}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentScenario.dialogues.length} باسقۇچلۇق دىئالوگ
              </span>
            </div>
            <h3 className="text-2xl font-bold font-arabic text-slate-100">
              {currentScenario.arabicTitle}
            </h3>
            <p className="text-xs text-slate-400">{currentScenario.description}</p>
          </div>

          {/* Dialogue Turns */}
          <div className="space-y-4">
            {currentScenario.dialogues.map((turn, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  turn.speaker === 'coach'
                    ? 'bg-slate-950/70 border-slate-800'
                    : 'bg-blue-950/20 border-blue-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        turn.speaker === 'coach'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {turn.name}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {turn.speaker === 'coach' ? 'مەشقاۋۇل' : 'سىزنىڭ نۆۋىتىڭىز'}
                    </span>
                  </div>

                  {turn.speaker === 'coach' && turn.arabic && (
                    <button
                      onClick={() => speak(turn.arabic || '', 1.0)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>ئاڭلاش</span>
                    </button>
                  )}
                </div>

                {turn.speaker === 'coach' ? (
                  <div className="space-y-2">
                    <div className="font-arabic text-lg text-slate-100 leading-loose">
                      {turn.arabic}
                    </div>
                    <div className="text-xs text-slate-400 border-t border-slate-800/60 pt-2 leading-relaxed">
                      {turn.uyghur}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-slate-300">
                      {turn.promptUyghur}
                    </div>
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-lg font-arabic text-sky-300 leading-loose select-all">
                      {turn.targetArabic}
                    </div>
                    {turn.hints && (
                      <div className="text-xs text-amber-400/90 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>تەلەپپۇز ئەسكەرتىشى: {turn.hints}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => speak(turn.targetArabic || '', 1.0)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>نىشان نۇتۇقنى ئاڭلاش</span>
                      </button>

                      <button
                        onClick={() => handleSimulateStepPractice(idx, turn.targetArabic || '', 100)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>نۇتۇق سۆزلەپ باھالاش (تولۇق)</span>
                      </button>

                      <button
                        onClick={() => handleSimulateStepPractice(idx, turn.targetArabic || '', 80)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs"
                      >
                        <span>مەخرەج سىنىقى (كەمتۈك سېلىشتۇرۇش)</span>
                      </button>
                    </div>

                    {activeEvaluation && activeEvaluation.stepIndex === idx && (
                      <div className="mt-3 p-3.5 bg-slate-950 border border-blue-500/30 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">بۇ باسقۇچتىكى تەلەپپۇزىڭىز:</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">
                            {activeEvaluation.result.score} نومۇر
                          </span>
                        </div>
                        <p className="text-slate-300">{activeEvaluation.result.feedback}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {activeEvaluation.result.detailedWords.map((w, wIdx) => (
                            <span
                              key={wIdx}
                              className={`px-2 py-1 rounded text-[11px] font-arabic ${
                                w.status === 'correct'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {w.target}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
