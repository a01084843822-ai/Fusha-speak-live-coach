/**
 * @license
 * Fusha-Speak Live Coach (ئەرەب تىلى نۇتۇق ۋە مۇھىت مەشقاۋۇلى)
 * Enterprise-grade Chrome Extension Suite & Interactive Workbench
 * Royal Blue Edition with 36 authentic dialogue sentences & not-allowed mic fix.
 */

import React, { useState, useEffect } from 'react';
import {
  Mic,
  Sparkles,
  MessageSquare,
  Download,
  FileText,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import SidePanelSimulator from './components/SidePanelSimulator';
import TashkeelLab from './components/TashkeelLab';
import DialoguesView from './components/DialoguesView';
import ExtensionExporter from './components/ExtensionExporter';
import DocsViewer from './components/DocsViewer';

// Raw imports for Enterprise PRD and SPEC documents
import prdRaw from '../PRD.md?raw';
import specRaw from '../SPEC.md?raw';

type ActiveView = 'sidepanel' | 'tashkeel' | 'dialogues' | 'extension' | 'docs';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('sidepanel');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-uyghur selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Bar Contract (3 Zones) */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element wordmark) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-blue-900/30">
              ف
            </div>
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); setActiveView('sidepanel'); }}
              className="text-base font-bold text-slate-100 hover:text-blue-400 transition-colors whitespace-nowrap"
            >
              فۇسھا مەشقاۋۇلى
            </a>
          </div>

          {/* Zone 2: 4-5 Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setActiveView('sidepanel')}
              className={`hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                activeView === 'sidepanel' ? 'text-blue-400 border-b-2 border-blue-500' : ''
              }`}
            >
              يان مەشقاۋۇل (Side Panel)
            </button>
            <button
              onClick={() => setActiveView('tashkeel')}
              className={`hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                activeView === 'tashkeel' ? 'text-blue-400 border-b-2 border-blue-500' : ''
              }`}
            >
              ھەرىكەت تەجرىبىخانىسى
            </button>
            <button
              onClick={() => setActiveView('dialogues')}
              className={`hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                activeView === 'dialogues' ? 'text-blue-400 border-b-2 border-blue-500' : ''
              }`}
            >
              مۇھىت سۆھبەتلىرى (36 جۈملە)
            </button>
            <button
              onClick={() => setActiveView('extension')}
              className={`hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                activeView === 'extension' ? 'text-blue-400 border-b-2 border-blue-500' : ''
              }`}
            >
              Chrome قىستۇرمىسى
            </button>
            <button
              onClick={() => setActiveView('docs')}
              className={`hover:text-blue-400 transition-colors whitespace-nowrap py-1 ${
                activeView === 'docs' ? 'text-blue-400 border-b-2 border-blue-500' : ''
              }`}
            >
              PRD & SPEC تەلەپ پۈتۈكى
            </button>
          </nav>

          {/* Zone 3: Primary Action & Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="رەڭ كۆرۈنۈشىنى ئالماشتۇرۇش"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>

            <a
              href="/fusha-speak-chrome-extension.zip"
              download="fusha-speak-chrome-extension.zip"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-blue-900/40 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>قاچىلاش بولىقىنى چۈشۈرۈش (.zip)</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Editorial Trust & Value Banner */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>نۆل تېلېمېتىرىيە (Zero Telemetry)</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>100% يەرلىك كۈتۈپخانا (خىتاي مۇلازىمەتلىرىدىن تامامەن خالىي)</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">
              شەرقىي تۈركىستان ئىلىم مەرىپىتى ئۈچۈن پادىشاھ كۆك رەڭ ئۇسلۇبىدا تۈزۈلدى
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300">
              Manifest V3
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300">
              Side Panel API
            </span>
          </div>
        </div>

        {/* View Switcher Container */}
        {activeView === 'sidepanel' && <SidePanelSimulator />}
        {activeView === 'tashkeel' && <TashkeelLab />}
        {activeView === 'dialogues' && <DialoguesView />}
        {activeView === 'extension' && <ExtensionExporter />}
        {activeView === 'docs' && <DocsViewer prdContent={prdRaw} specContent={specRaw} />}
      </main>

      {/* Quiet Enterprise Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-slate-300">
              Fusha-Speak Live Coach (ئەرەب تىلى نۇتۇق ۋە مۇھىت مەشقاۋۇلى)
            </div>
            <div>
              ئەدەبىي ئەرەب تىلى تەلەپپۇزى، ئاپتوماتىك ھەرىكەت قويۇش ۋە 36 ئەمەلىي دىئالوگ يان سىستېمىسى.
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>ئەھلى سۈننەت ئەخلاقى ۋە ئىلىم پرىنسىپى</span>
            <span>·</span>
            <span>نەشرى: v1.1.0 (Royal Blue Edition)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
