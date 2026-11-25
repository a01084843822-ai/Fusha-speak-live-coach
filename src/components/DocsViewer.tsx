/**
 * @license
 * Fusha-Speak Live Coach - Enterprise Documentation Viewer
 * Displays full PRD.md and SPEC.md with clean Uyghur typography and blue accents.
 */

import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Search,
  BookMarked,
  ShieldAlert,
  Terminal,
  Download
} from 'lucide-react';

interface Props {
  prdContent: string;
  specContent: string;
}

export default function DocsViewer({ prdContent, specContent }: Props) {
  const [docType, setDocType] = useState<'prd' | 'spec'>('prd');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const activeContent = docType === 'prd' ? prdContent : specContent;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    const filename = docType === 'prd' ? 'PRD.md' : 'SPEC.md';
    const blob = new Blob([activeContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl">
            <button
              onClick={() => setDocType('prd')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
                docType === 'prd'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>مەھسۇلات تەلەپ پۈتۈكى (PRD.md)</span>
            </button>
            <button
              onClick={() => setDocType('spec')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
                docType === 'spec'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>تېخنىكىلىق لايىھە پۈتۈكى (SPEC.md)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span>كۆچۈرۈلدى</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Markdown نى كۆچۈرۈش</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownloadMd}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ھۆججەتنى چۈشۈرۈش</span>
          </button>
        </div>
      </div>

      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm text-slate-100">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
              {docType === 'prd' ? 'مەھسۇلات ئۆلچىمى (Blue Accent)' : 'ئىنژېنېرلىق لايىھەسى (Blue Accent)'}
            </span>
            <h1 className="text-2xl font-bold text-slate-100 mt-1">
              {docType === 'prd'
                ? 'PRD: ئەرەب تىلى نۇتۇق ۋە مۇھىت مەشقاۋۇلى (36 جۈملىلىك ھەقىقىي دىئالوگ)'
                : 'SPEC: Chrome Extension Manifest V3 كارخانا تېخنىكا پۈتۈكى (not-allowed ھەل قىلىندى)'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              نەشرى: v1.1.0 · پۈتۈنلەي دەلىللەنگەن · شەرقىي تۈركىستان كىملىكى ۋە ئەخلاقىي مىزانلىرىغا تولۇق ئۇيغۇن
            </p>
          </div>

          <div className="uyghur-prose text-sm text-slate-200 leading-loose space-y-4">
            {activeContent.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (trimmed.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-2xl font-bold text-slate-100 mt-6 mb-3">
                    {trimmed.replace(/^# /, '')}
                  </h1>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-xl font-bold text-blue-400 mt-5 mb-2.5">
                    {trimmed.replace(/^## /, '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-sky-300 mt-4 mb-2">
                    {trimmed.replace(/^### /, '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('#### ')) {
                return (
                  <h4 key={idx} className="text-base font-semibold text-slate-200 mt-3 mb-1.5">
                    {trimmed.replace(/^#### /, '')}
                  </h4>
                );
              }
              if (trimmed.startsWith('```')) {
                return (
                  <pre
                    key={idx}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-xs font-mono text-slate-300 my-4 text-left"
                    dir="ltr"
                  >
                    <code>{trimmed.replace(/```[a-z]*\n?/g, '')}</code>
                  </pre>
                );
              }
              return (
                <p key={idx} className="text-slate-200/90 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
