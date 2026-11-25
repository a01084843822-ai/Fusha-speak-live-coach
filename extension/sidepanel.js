/**
 * @license
 * Fusha-Speak Live Coach - Side Panel Controller
 * Persistent sidebar companion with not-allowed error handling and blue theme.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const spThemeToggleBtn = document.getElementById('spThemeToggleBtn');
  const tabItems = document.querySelectorAll('.tab-item');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Tashkeel Tab
  const spArabicInput = document.getElementById('spArabicInput');
  const spDiacritizeBtn = document.getElementById('spDiacritizeBtn');
  const spClearBtn = document.getElementById('spClearBtn');
  const spTashkeelOutput = document.getElementById('spTashkeelOutput');
  const spCopyBtn = document.getElementById('spCopyBtn');
  const spSpeakBtn = document.getElementById('spSpeakBtn');
  const spCopyStatus = document.getElementById('spCopyStatus');

  // Speech Tab
  const spTargetText = document.getElementById('spTargetText');
  const spListenTargetBtn = document.getElementById('spListenTargetBtn');
  const spMicBtn = document.getElementById('spMicBtn');
  const spMicStatus = document.getElementById('spMicStatus');
  const spMicErrorGuide = document.getElementById('spMicErrorGuide');
  const spEvalBox = document.getElementById('spEvalBox');
  const spScoreBadge = document.getElementById('spScoreBadge');
  const spEvalFeedback = document.getElementById('spEvalFeedback');
  const spWordBreakdown = document.getElementById('spWordBreakdown');
  const spMakharijTips = document.getElementById('spMakharijTips');

  // Dialogue Tab
  const spScenarioSelect = document.getElementById('spScenarioSelect');
  const spDialogueList = document.getElementById('spDialogueList');

  let currentTargetSentence = spTargetText.textContent.trim();
  let isRecording = false;
  let recognitionInstance = null;

  // Theme Sync
  function initTheme() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['theme'], (result) => {
          if (result && result.theme === 'light') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            spThemeToggleBtn.textContent = '☀️';
          } else {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            spThemeToggleBtn.textContent = '🌙';
          }
        });
      }
    } catch (e) {
      console.warn('Sidepanel theme init warning:', e);
    }
  }

  spThemeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', !isDark);
    document.documentElement.classList.toggle('light', isDark);
    spThemeToggleBtn.textContent = isDark ? '☀️' : '🌙';

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ theme: newTheme });
    }
  });

  // Tab switching
  tabItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabItems.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('active');
    });
  });

  // Tashkeel
  spDiacritizeBtn.addEventListener('click', () => {
    const raw = spArabicInput.value.trim();
    if (!raw) return;
    if (window.FushaRulesEngine && window.FushaRulesEngine.diacritize) {
      spTashkeelOutput.textContent = window.FushaRulesEngine.diacritize(raw);
      spCopyStatus.textContent = 'ھەرىكەتلەندۈرۈلدى ✓';
      setTimeout(() => { spCopyStatus.textContent = ''; }, 2000);
    }
  });

  spClearBtn.addEventListener('click', () => {
    spArabicInput.value = '';
    spTashkeelOutput.textContent = 'ھەرىكەتلەندۈرۈلگەن فۇسھا تېكىستى بۇ يەردە كۆرۈنىدۇ...';
  });

  spCopyBtn.addEventListener('click', async () => {
    const text = spTashkeelOutput.textContent.trim();
    if (text) {
      await navigator.clipboard.writeText(text);
      spCopyStatus.textContent = 'كۆچۈرۈۋېلىندى ✓';
      setTimeout(() => { spCopyStatus.textContent = ''; }, 2000);
    }
  });

  function speak(text, rate = 1.0) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ar-SA';
    utt.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arVoice) utt.voice = arVoice;
    window.speechSynthesis.speak(utt);
  }

  spSpeakBtn.addEventListener('click', () => {
    speak(spTashkeelOutput.textContent.trim(), 1.0);
  });

  spListenTargetBtn.addEventListener('click', () => {
    speak(currentTargetSentence, 0.95);
  });

  // Speech Recognition with preflight getUserMedia
  spMicBtn.addEventListener('click', () => {
    if (isRecording) {
      stopMic();
    } else {
      startMic();
    }
  });

  async function startMic() {
    if (spMicErrorGuide) spMicErrorGuide.style.display = 'none';

    // 1. Preflight getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          spMicStatus.textContent = 'مىكروفون رۇخسىتى بېرىلمىگەن (not-allowed).';
          if (spMicErrorGuide) spMicErrorGuide.style.display = 'block';
          return;
        }
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      spMicStatus.textContent = 'بۇ كۆرگۈچتە ئاۋاز بايقاش تېخنىكىسى يوق.';
      return;
    }

    try {
      recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'ar-SA';
      recognitionInstance.interimResults = false;

      recognitionInstance.onstart = () => {
        isRecording = true;
        spMicBtn.classList.add('recording');
        spMicStatus.textContent = 'ئاڭلاۋاتىدۇ... نىشان جۈملىنى ئوقۇڭ';
      };

      recognitionInstance.onresult = (evt) => {
        const transcript = evt.results[0][0].transcript;
        evaluateSpeech(transcript);
      };

      recognitionInstance.onerror = (evt) => {
        if (evt.error === 'not-allowed') {
          spMicStatus.textContent = 'مىكروفون كاشىلىسى (not-allowed). رۇخسەتنى تەكشۈرۈڭ.';
          if (spMicErrorGuide) spMicErrorGuide.style.display = 'block';
        } else {
          spMicStatus.textContent = 'خاتالىق: ' + evt.error;
        }
        stopMic();
      };

      recognitionInstance.onend = () => {
        stopMic();
      };

      recognitionInstance.start();
    } catch (err) {
      spMicStatus.textContent = 'قوزغىلىش خاتالىقى: ' + err.message;
      if (spMicErrorGuide) spMicErrorGuide.style.display = 'block';
      stopMic();
    }
  }

  function stopMic() {
    isRecording = false;
    spMicBtn.classList.remove('recording');
    if (recognitionInstance) {
      try { recognitionInstance.stop(); } catch (e) {}
      recognitionInstance = null;
    }
  }

  function evaluateSpeech(spoken) {
    spMicStatus.textContent = 'ئاڭلاندى: ' + spoken;
    spEvalBox.style.display = 'block';

    if (!window.FushaRulesEngine) return;
    const result = window.FushaRulesEngine.evaluatePronunciation(currentTargetSentence, spoken);

    spScoreBadge.textContent = result.score + ' نومۇر';
    spScoreBadge.style.background = result.score >= 80 ? 'rgba(37, 99, 235, 0.15)' : 'rgba(239, 68, 68, 0.15)';
    spScoreBadge.style.color = result.score >= 80 ? '#60a5fa' : '#f87171';
    spEvalFeedback.textContent = result.feedback;

    spWordBreakdown.innerHTML = '';
    result.detailedWords.forEach((w) => {
      const chip = document.createElement('div');
      chip.className = 'word-chip ' + w.status;
      chip.innerHTML = `<span>${w.target}</span><span class="word-chip-sub">${w.spoken} (${w.label})</span>`;
      spWordBreakdown.appendChild(chip);
    });

    spMakharijTips.innerHTML = '';
    if (result.makharijTips && result.makharijTips.length > 0) {
      result.makharijTips.forEach((t) => {
        const tipDiv = document.createElement('div');
        tipDiv.className = 'makharij-tip-box';
        tipDiv.innerHTML = `<strong>💡 ${t.title}:</strong> ${t.message}`;
        spMakharijTips.appendChild(tipDiv);
      });
    }
  }

  // Dialogues
  function renderScenario(id) {
    if (!window.FushaScenarios) return;
    const scen = window.FushaScenarios.getScenarioById(id);
    if (!scen) return;

    spDialogueList.innerHTML = '';
    scen.dialogues.forEach((d) => {
      const box = document.createElement('div');
      box.className = 'section-card';
      if (d.speaker === 'coach') {
        box.innerHTML = `
          <div class="card-title">
            <span style="color: var(--accent-sky); font-weight: bold;">🎙️ ${d.name}</span>
            <button class="icon-btn play-audio-btn" data-text="${d.arabic.replace(/"/g, '&quot;')}">🔊 ئاڭلاش</button>
          </div>
          <div class="arabic-text">${d.arabic}</div>
          <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">${d.uyghur}</div>
        `;
      } else {
        box.innerHTML = `
          <div class="card-title">
            <span style="color: #60a5fa; font-weight: bold;">👤 ${d.name}</span>
            <span style="font-size: 10px; color: var(--text-muted);">سىزنىڭ نۆۋىتىڭىز</span>
          </div>
          <div style="font-size: 12px; margin-bottom: 6px;">${d.promptUyghur}</div>
          <div class="arabic-text" style="color: #38bdf8; background: var(--bg-tertiary); padding: 8px 10px; border-radius: 6px;">${d.targetArabic}</div>
          <div style="font-size: 11px; color: var(--warning); margin: 6px 0;">💡 ${d.hints}</div>
          <button class="btn-primary start-drill-btn" data-target="${d.targetArabic.replace(/"/g, '&quot;')}">
            🎙️ بۇ جۈملىنى سۆزلەپ باھالاش
          </button>
        `;
      }
      spDialogueList.appendChild(box);
    });

    spDialogueList.querySelectorAll('.play-audio-btn').forEach((b) => {
      b.addEventListener('click', () => speak(b.getAttribute('data-text'), 1.0));
    });

    spDialogueList.querySelectorAll('.start-drill-btn').forEach((b) => {
      b.addEventListener('click', () => {
        currentTargetSentence = b.getAttribute('data-target');
        spTargetText.textContent = currentTargetSentence;
        const tab = document.querySelector('[data-tab="sp-speech"]');
        if (tab) tab.click();
        spMicBtn.click();
      });
    });
  }

  spScenarioSelect.addEventListener('change', (e) => {
    renderScenario(e.target.value);
  });

  initTheme();
  renderScenario('islamic_seminar');
});
