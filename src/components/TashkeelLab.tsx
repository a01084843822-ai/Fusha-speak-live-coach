/**
 * @license
 * Fusha-Speak Live Coach - Tashkeel & Morphology Lab
 * Royal Blue Edition
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Volume2,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle
} from 'lucide-react';
import { diacritize } from '../data/rules_engine';

const PRESET_CLASSICAL_QUOTES = [
  {
    title: 'ھەدىس شەرىف (ئەمەللەر نىيەتكە باغلىق)',
    text: 'انما الاعمال بالنيات وانما لكل امرئ ما نوى فمن كانت هجرته الى الله ورسوله فهجرته الى الله ورسوله'
  },
  {
    title: 'قۇرئان كەرىمدىن دۇئا (سۈرە تاھا)',
    text: 'رب اشرح لي صدري ويسر لي امري واحلل عقدة من لساني يفقهوا قولي'
  },
  {
    title: 'ئىلىم توغرىسىدا ھېكمەتلىك سۆز',
    text: 'العلم صيد والكتابة قيده قيد صيودك بالحبال الواثقة فمن الحماقة ان تصيد غزالة وتتركها بين الخلائق طالقة'
  },
  {
    title: 'ئەدەبىي سالام ۋە كۈتۈۋېلىش',
    text: 'السلام عليكم ورحمة الله وبركاته اهلا وسهلا بكم في دوحة العلم والمعرفة ونسال الله لكم التوفيق'
  }
];

const HARAKAT_LEGEND = [
  { symbol: 'ـَ', name: 'فەتھە (Fatha)', gram: 'نەسب ھالىتى', sound: 'ئوچۇق تاۋۇش (a)', desc: 'ئېغىز بوشلۇقىنى يۇقىرىغا ئېچىپ چىقىرىلىدۇ.' },
  { symbol: 'ـُ', name: 'زەممە (Damma)', gram: 'رەپئى ھالىتى', sound: 'پۈرۈشكەن تاۋۇش (u)', desc: 'لەۋلەر ئالدىغا پۈرۈشۈپ چىقىدۇ.' },
  { symbol: 'ـِ', name: 'كەسرە (Kasra)', gram: 'جەرر ھالىتى', sound: 'تۆۋەن تاۋۇش (i)', desc: 'ئاستىنقى تاڭلاي پەسلىتىلىدۇ.' },
  { symbol: 'ـْ', name: 'سۇكۇن (Sukun)', gram: 'جەزم ھالىتى', sound: 'تۇراقسىز تاۋۇش', desc: 'ھەرىكەت توختاپ ساپ ئۈزۈك تاۋۇش چىقىدۇ.' },
  { symbol: 'ـّ', name: 'شەددە (Shaddah)', gram: 'قاتلاش ھالىتى', sound: 'قوش كۈچلۈك تاۋۇش', desc: 'بىرىنچى ھەرپ تۇرغۇن، ئىككىنچىسى ھەرىكەتلىك.' },
  { symbol: 'ـً ـٌ ـٍ', name: 'تەنۋىن (Tanween)', gram: 'ئېنىقسىزلىق ئالامىتى', sound: 'an / un / in', desc: 'سۆز ئاخىرىدا تەلەپپۇز قىلىنىدىغان نۇن تاۋۇشى.' }
];

export default function TashkeelLab() {
  const [inputText, setInputText] = useState<string>(
    'العلم نور والجهل ظلام، وطالب العلم يسعى في مناكب الارض طلبا للفائدة والبركة.'
  );
  const [outputText, setOutputText] = useState<string>(() => diacritize(inputText));
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'sideBySide' | 'rules'>('sideBySide');

  const handleRunTashkeel = () => {
    if (!inputText.trim()) return;
    const res = diacritize(inputText.trim());
    setOutputText(res);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ar-SA';
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>ئاپتوماتىك ھەرىكەت (Tashkeel) ۋە مورفولوگىيە تەجرىبىخانىسى</span>
            </h2>
            <p className="text-xs text-slate-400">
              ئەرەب تىلىنىڭ كلاسسىك ۋە ھازىرقى زامان قائىدىلىرى بويىچە يەرلىك سىستېمىدا ھەرىكەت قويۇش ۋە تەلەپپۇز تەكشۈرۈش.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sideBySide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'sideBySide'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              ھەرىكەت سېلىشتۇرۇش
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'rules'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              ھەرىكەت قائىدىلىرى جەدۋىلى
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'sideBySide' ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">كلاسسىك تەييار ئۈلگىلەر:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRESET_CLASSICAL_QUOTES.map((quote, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(quote.text);
                    setOutputText(diacritize(quote.text));
                  }}
                  className="p-3 text-right bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/50 rounded-xl transition-all group"
                >
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 mb-1">
                    {quote.title}
                  </div>
                  <div className="text-[11px] font-arabic text-slate-400 truncate">
                    {quote.text}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">خام (ھەرىكەتسىز) ئەرەبچە تېكىست:</span>
                <span className="text-[11px] text-slate-500 font-mono">{inputText.length} ھەرپ</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="ئەرەبچە تېكىستنى بۇ يەرگە كىرگۈزۈڭ..."
                className="w-full h-44 p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-arabic text-lg leading-relaxed focus:outline-none focus:border-blue-500 resize-none flex-1"
              />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleRunTashkeel}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ھەرىكەت قويۇش (Diacritize)</span>
                </button>
                <button
                  onClick={() => { setInputText(''); setOutputText(''); }}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
                >
                  تازىلاش
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400">تولۇق ھەرىكەتلەندۈرۈلگەن تېكىست (فۇسھا):</span>
                {copied && (
                  <span className="text-xs text-blue-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> كۆچۈرۈۋېلىندى
                  </span>
                )}
              </div>
              <div className="w-full h-44 p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-arabic text-xl leading-loose overflow-y-auto flex-1 select-all">
                {outputText || <span className="text-slate-500 text-sm font-uyghur">ھەرىكەتلەندۈرۈلگەن نەتىجە بۇ يەردە كۆرۈنىدۇ...</span>}
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => speakText(outputText)}
                  disabled={!outputText}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <span>ئاۋازنى ئاڭلاش</span>
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>كۆچۈرۈش</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HARAKAT_LEGEND.map((h, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-right"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-arabic font-bold text-blue-400">
                    {h.symbol}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 font-arabic">
                    {h.name}
                  </span>
                </div>
                <div className="text-xs text-sky-400 font-medium">
                  {h.gram} · {h.sound}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>ئاپتوماتىك ھەرىكەتنىڭ گىرامماتىكىلىق يادروسى:</span>
            </h4>
            <p className="leading-relaxed">
              سىستېما ئەرەب تىلىدىكى شەمشىيە (Sun) ۋە قەمىرىيە (Moon) ھەرپلىرىنى، كۆپ ئۇچرايدىغان ئىسىم-پېئىل قېلىپلىرىنى، ھەرپۇل جەرر (حروف الجر) ۋە مەنبە لوغەتلىرىنى يەرلىك سىستېمىدا سېلىشتۇرۇش ئارقىلىق، يىراقتىكى مۇلازىمېتىرلارغا بېقىنماي تۇرۇپ توغرا ھەرىكەت قويۇپ بېرىدۇ.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
