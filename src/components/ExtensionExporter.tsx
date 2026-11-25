/**
 * @license
 * Fusha-Speak Live Coach - Chrome Extension Exporter & Code Inspector
 * Royal Blue Edition
 */

import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  FolderArchive,
  FileCode,
  Copy,
  Check,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { EXTENSION_FILES, ExtensionFileItem } from '../data/extensionFiles';

export default function ExtensionExporter() {
  const [selectedFile, setSelectedFile] = useState<ExtensionFileItem>(EXTENSION_FILES[0]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(selectedFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      EXTENSION_FILES.forEach((file) => {
        const relativePath = file.path.replace(/^extension\//, '');
        zip.file(relativePath, file.content);
      });

      const readmeContent = `# Fusha-Speak Live Coach (ئەرەب تىلى نۇتۇق ۋە مۇھىت مەشقاۋۇلى)
## Google Chrome Extension (Manifest V3) - Royal Blue Edition

### قانداق قاچىلايسىز؟ (Installation Guide)
1. بۇ قىسقۇچنى بىرەر ئورۇنغا چىقىرىڭ (Extract).
2. Google Chrome كۆرگۈچىڭىزنى ئېچىپ، ئادرېس كۆزنىكىگە يېزىڭ: chrome://extensions
3. ئوڭ ئۈستى تەرەپتىكى «ئاچقۇچى ھالىتى» (Developer mode) نى ئېچىڭ.
4. سول ئۈستىدىكى «ئېچىلغان قىستۇرمىنى يۈكلەش» (Load unpacked) كۇنۇپكىسىنى بېسىپ، بۇ مۇندەرىجىنى تاللاڭ.
5. قىستۇرما تەييار!

### مىكروفون (not-allowed) كاشىلىسىنىڭ ئالدىنى ئېلىش:
- قىستۇرمىنى ئاچقاندىن كېيىن كۆرگۈچنىڭ يان تاختىسى (Side Panel) كۆزنىكىدە ئىشلەتسىڭىز، مىكروفون رۇخسىتى بىرلا قېتىم مەڭگۈلۈك ئېچىلىدۇ.
`;
      zip.file('README.md', readmeContent);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fusha-speak-chrome-extension-v3.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to create ZIP package:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with 1-click Download */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Manifest V3 تولۇق ئۆلچەمگە ئۇيغۇن كارخانا قىستۇرمىسى (كۆك رەڭ نۇسخىسى)</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Chrome غا تەييار «Load Unpacked» بولىقى (36 جۈملە)
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            36 جۈملىلىك ھەقىقىي مۇھىت سۆھبىتى، مىكروفون رۇخسەت ھەل قىلىش چارىسى ۋە كۆك رەڭلىك Awwwards دىزاين ئۆلچىمى بىلەن تەييارلاندى.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="/fusha-speak-chrome-extension.zip"
            download="fusha-speak-chrome-extension.zip"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 shadow-lg shadow-blue-900/30 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>قىستۇرما بولىقىنى چۈشۈرۈش (.zip - 33.8 KB)</span>
          </a>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 bg-blue-950/40 border border-blue-500/40 rounded-xl text-blue-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>«fusha-speak-chrome-extension.zip» مۇۋەپپەقىيەتلىك چۈشۈرۈلدى! تۆۋەندىكى قاچىلاش باسقۇچى بويىچە Chrome غا يۈكلەڭ.</span>
        </div>
      )}

      {/* 4-Step Illustrated Chrome Installation Guide */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>Google Chrome غا قاچىلاشنىڭ 4 تېز باسقۇچى:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <div className="font-semibold text-slate-200">ھۆججەتنى يېشىش</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              چۈشۈرۈلگەن Zip ھۆججىتىنى ئوڭ چېكىپ «بۇ يەرگە چىقىرىش» (Extract) ئارقىلىق بىر قىسقۇچقا يېشىڭ.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <div className="font-semibold text-slate-200">قىستۇرمىلارنى ئېچىش</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Chrome نىڭ ئادرېس بالدىقىغا <code className="text-blue-400 bg-slate-900 px-1 py-0.5 rounded">chrome://extensions</code> دەپ كىرگۈزۈڭ.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <div className="font-semibold text-slate-200">ئاچقۇچى ھالىتى</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              ئوڭ ئۈستىدىكى «Developer mode» (ئاچقۇچى ھالىتى) كۇنۇپكىسىنى قوزغىتىپ قويۇڭ.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <div className="font-semibold text-slate-200">Load Unpacked</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              سول تەرەپتىكى «Load unpacked» كۇنۇپكىسىنى بېسىپ، يېشىلگەن قىسقۇچنى تاللاڭ؛ شۇ ھامان ئىشقا كىرىشىدۇ!
            </p>
          </div>
        </div>
      </div>

      {/* Code Inspector & File Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <FolderArchive className="w-4 h-4 text-blue-400" />
              <span>قىستۇرما ھۆججەتلىرى ({EXTENSION_FILES.length})</span>
            </span>
            <span className="text-slate-500 text-[11px]">Manifest V3</span>
          </div>

          <div className="space-y-1">
            {EXTENSION_FILES.map((file) => (
              <button
                key={file.name}
                onClick={() => {
                  setSelectedFile(file);
                  setCopiedCode(false);
                }}
                className={`w-full p-2.5 rounded-xl text-right transition-colors flex items-center justify-between text-xs ${
                  selectedFile.name === file.name
                    ? 'bg-blue-950/40 border border-blue-500/50 text-blue-300 font-semibold'
                    : 'bg-slate-950/40 hover:bg-slate-950 border border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono text-[11.5px] truncate">{file.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase">{file.language}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">{selectedFile.description}</div>
            <div className="text-slate-500 font-mono text-[10px]">{selectedFile.path}</div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-200 font-bold">{selectedFile.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {selectedFile.language}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>كۆچۈرۈلدى</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>كودنى كۆچۈرۈش</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-slate-950 flex-1 overflow-x-auto text-left" dir="ltr">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
