/**
 * @license
 * Fusha-Speak Live Coach - Action Popup Controller
 * 100% production ready, zero telemetry, blue theme, not-allowed mic fix.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Preset sentences for Pronunciation Coach tab
  const PRESET_SENTENCES = [
    {
      arabic: 'أَبْحَثُ عَنْ مُعْجَمٍ لُغَوِيٍّ مُعْتَمَدٍ، وَكُتُبٍ فِي فَصَاحَةِ اللِّسَانِ.',
      desc: '1. ئەلمۇئجەمۇل ۋەسىيتنى ئىزدەش'
    },
    {
      arabic: 'إِنَّ اللُّغَةَ الْعَرَبِيَّةَ الْفُصْحَى مِفْتَاحُ فَهْمِ الْكِتَابِ وَالسُّنَّةِ النَّبَوِيَّةِ.',
      desc: '2. ئىلىم ۋە نەبىۋى ھەدىس'
    },
    {
      arabic: 'تَفَضَّلْ يَا سَيِّدِي، هَذَا جَوَازِي، وَهَدَفِي مِنْ هَذِهِ الرِّحْلَةِ هُوَ الدِّرَاسَةُ.',
      desc: '3. ئايرودرومدا پاسپورت سۇنۇش'
    },
    {
      arabic: 'جَزَاكَ اللهُ خَيْرًا يَا دُكْتُورُ، نَسْأَلُ اللهَ الشِّفَاءَ وَالْعَافِيَةَ.',
      desc: '4. دوختۇرغا تەشەككۈر دۇئاسى'
    }
  ];

  // DOM Elements
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const sidePanelBtn = document.getElementById('sidePanelBtn');
  const tabItems = document.querySelectorAll('.tab-item');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Tab 1 Elements (Tashkeel)
  const arabicInput = document.getElementById('arabicInput');
  const diacritizeBtn = document.getElementById('diacritizeBtn');
  const clearTashkeelBtn = document.getElementById('clearTashkeelBtn');
  const tashkeelOutput = document.getElementById('tashkeelOutput');
  const copyTashkeelBtn = document.getElementById('copyTashkeelBtn');
  const speakTashkeelBtn = document.getElementById('speakTashkeelBtn');
  const copyStatusText = document.getElementById('copyStatusText');
  const samplePills = document.querySelectorAll('.sample-pill');

  // Tab 2 Elements (Pronunciation)
  const presetTargetSelect = document.getElementById('presetTargetSelect');
  const targetSentenceText = document.getElementById('targetSentenceText');
  const listenTargetBtn = document.getElementById('listenTargetBtn');
  const recordMicBtn = document.getElementById('recordMicBtn');
  const micStatusLabel = document.getElementById('micStatusLabel');
  const micErrorGuide = document.getElementById('micErrorGuide');
  const openSidePanelFixBtn = document.getElementById('openSidePanelFixBtn');
  const evaluationSection = document.getElementById('evaluationSection');
  const scoreBadge = document.getElementById('scoreBadge');
  const evaluationFeedback = document.getElementById('evaluationFeedback');
  const wordBreakdown = document.getElementById('wordBreakdown');
  const makharijTipsContainer = document.getElementById('makharijTipsContainer');

  // Tab 3 Elements (Scenarios)
  const scenarioSelector = document.getElementById('scenarioSelector');
  const scenarioDescription = document.getElementById('scenarioDescription');
  const dialogueContainer = document.getElementById('dialogueContainer');

  // State
  let isRecording = false;
  let recognitionInstance = null;
  let currentTargetSentence = PRESET_SENTENCES[0].arabic;

  // 1. Theme Management (Local Storage + Chrome Storage)
  function initTheme() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['theme'], (result) => {
          if (result && result.theme === 'light') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            themeToggleBtn.textContent = '☀️';
          } else {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            themeToggleBtn.textContent = '🌙';
          }
        });
      } else {
        const saved = localStorage.getItem('fusha_theme');
        if (saved === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          themeToggleBtn.textContent = '☀️';
        }
      }
    } catch (e) {
      console.warn('Storage theme init error:', e);
    }
  }

  themeToggleBtn.addEventListener('click', () => {
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', !isDark);
      document.documentElement.classList.toggle('light', isDark);
      themeToggleBtn.textContent = isDark ? '☀️' : '🌙';

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ theme: newTheme });
      } else {
        localStorage.setItem('fusha_theme', newTheme);
      }
    } catch (err) {
      console.error('Failed to toggle theme:', err);
    }
  });

  // 2. Open Side Panel Handler
  function openSidePanel() {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ action: 'openSidePanel' }, (response) => {
          if (chrome.runtime.lastError || (response && !response.success)) {
            micStatusLabel.textContent = 'كۆرگۈچنىڭ يان بالدىقى (Side Panel) سىنبەلگىسىنى بىۋاسىتە بېسىپ ئېچىڭ.';
          }
        });
      }
    } catch (err) {
      console.warn('Side panel invocation:', err);
    }
  }

  sidePanelBtn.addEventListener('click', openSidePanel);
  if (openSidePanelFixBtn) {
    openSidePanelFixBtn.addEventListener('click', openSidePanel);
  }

  // 3. Tab Switching
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

  // 4. Tab 1: Tashkeel Execution
  diacritizeBtn.addEventListener('click', () => {
    try {
      const rawText = arabicInput.value.trim();
      if (!rawText) {
        tashkeelOutput.textContent = 'ئالدى بىلەن بىرەر ئەرەبچە تېكىست ياكى سۆز كىرگۈزۈڭ.';
        tashkeelOutput.style.color = 'var(--text-muted)';
        return;
      }

      tashkeelOutput.style.color = 'var(--text-main)';
      if (window.FushaRulesEngine && window.FushaRulesEngine.diacritize) {
        const diacritized = window.FushaRulesEngine.diacritize(rawText);
        tashkeelOutput.textContent = diacritized;
      } else {
        tashkeelOutput.textContent = rawText;
      }

      copyStatusText.textContent = 'ھەرىكەتلەندۈرۈلدى ✓';
      setTimeout(() => { copyStatusText.textContent = ''; }, 2500);
    } catch (err) {
      console.error('Diacritize error:', err);
      tashkeelOutput.textContent = 'خاتالىق كۆرۈلدى: ' + err.message;
    }
  });

  clearTashkeelBtn.addEventListener('click', () => {
    arabicInput.value = '';
    tashkeelOutput.textContent = 'ھەرىكەتلەندۈرۈلگەن تېكىست بۇ يەردە كۆرۈنىدۇ...';
    tashkeelOutput.style.color = 'var(--text-muted)';
    copyStatusText.textContent = '';
  });

  samplePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const sampleText = pill.getAttribute('data-text');
      if (sampleText) {
        arabicInput.value = sampleText;
        diacritizeBtn.click();
      }
    });
  });

  copyTashkeelBtn.addEventListener('click', async () => {
    try {
      const text = tashkeelOutput.textContent.trim();
      if (text) {
        await navigator.clipboard.writeText(text);
        copyStatusText.textContent = 'كۆچۈرۈۋېلىندى ✓';
        setTimeout(() => { copyStatusText.textContent = ''; }, 2000);
      }
    } catch (err) {
      console.warn('Clipboard write fallback:', err);
    }
  });

  speakTashkeelBtn.addEventListener('click', () => {
    const text = tashkeelOutput.textContent.trim();
    if (text) {
      speakArabic(text, 1.0);
    }
  });

  function speakArabic(text, speed = 1.0) {
    try {
      if (!('speechSynthesis' in window)) {
        alert('كۆرگۈچىڭىز ئاۋاز چىقىرىپ ئوقۇشنى قوللىمىدى.');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = speed;

      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find((v) => v.lang.startsWith('ar') || v.lang.includes('SA'));
      if (arVoice) {
        utterance.voice = arVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis error:', err);
    }
  }

  // 5. Tab 2: Pronunciation Coach with NOT-ALLOWED FIX
  presetTargetSelect.addEventListener('change', (e) => {
    const idx = parseInt(e.target.value, 10);
    if (PRESET_SENTENCES[idx]) {
      currentTargetSentence = PRESET_SENTENCES[idx].arabic;
      targetSentenceText.textContent = currentTargetSentence;
      evaluationSection.style.display = 'none';
      micStatusLabel.textContent = 'كۇنۇپكىنى بېسىپ نىشان جۈملىنى فۇسھا تەلەپپۇزدا ئوقۇڭ...';
    }
  });

  listenTargetBtn.addEventListener('click', () => {
    speakArabic(currentTargetSentence, 0.9);
  });

  recordMicBtn.addEventListener('click', () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });

  async function startRecording() {
    if (micErrorGuide) micErrorGuide.style.display = 'none';

    // 1. Check navigator.mediaDevices preflight to prompt/verify permissions
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (permErr) {
        console.warn('getUserMedia permission warning:', permErr);
        if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
          micStatusLabel.textContent = 'مىكروفون رۇخسىتى بېرىلمىگەن (not-allowed).';
          if (micErrorGuide) micErrorGuide.style.display = 'block';
          return;
        }
      }
    }

    // 2. Initialize Web Speech Recognition
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        micStatusLabel.textContent = 'كۆرگۈچىڭىزدە Web Speech Recognition تېخنىكىسى تېپىلمىدى.';
        return;
      }

      recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'ar-SA';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {
        isRecording = true;
        recordMicBtn.classList.add('recording');
        micStatusLabel.textContent = 'ئاڭلاۋاتىدۇ... ئەدەبىي فۇسھادا سۆزلەڭ';
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handlePronunciationResult(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          micStatusLabel.textContent = 'مىكروفون كاشىلىسى (not-allowed): يان كۆزنەكنى ئېچىپ ئىجازەت بېرىڭ.';
          if (micErrorGuide) micErrorGuide.style.display = 'block';
        } else {
          micStatusLabel.textContent = 'ئاۋاز سىگنالى خاتالىقى (' + event.error + ')';
        }
        stopRecording();
      };

      recognitionInstance.onend = () => {
        stopRecording();
      };

      recognitionInstance.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      micStatusLabel.textContent = 'مىكروفون قوزغىتىش مەغلۇپ بولدى: ' + err.message;
      if (micErrorGuide) micErrorGuide.style.display = 'block';
      stopRecording();
    }
  }

  function stopRecording() {
    isRecording = false;
    recordMicBtn.classList.remove('recording');
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {}
      recognitionInstance = null;
    }
  }

  function handlePronunciationResult(spokenText) {
    micStatusLabel.textContent = 'ئاڭلانغان نۇتۇق: ' + spokenText;
    evaluationSection.style.display = 'block';

    if (!window.FushaRulesEngine || !window.FushaRulesEngine.evaluatePronunciation) {
      evaluationFeedback.textContent = 'باھالاش ماتورى يۈكلەنمىدى.';
      return;
    }

    const evaluation = window.FushaRulesEngine.evaluatePronunciation(currentTargetSentence, spokenText);

    scoreBadge.textContent = evaluation.score + ' نومۇر';
    if (evaluation.score >= 80) {
      scoreBadge.style.background = 'rgba(37, 99, 235, 0.15)';
      scoreBadge.style.color = '#60a5fa';
    } else if (evaluation.score >= 50) {
      scoreBadge.style.background = 'rgba(245, 158, 11, 0.15)';
      scoreBadge.style.color = '#fbbf24';
    } else {
      scoreBadge.style.background = 'rgba(239, 68, 68, 0.15)';
      scoreBadge.style.color = '#f87171';
    }

    evaluationFeedback.textContent = evaluation.feedback;

    wordBreakdown.innerHTML = '';
    evaluation.detailedWords.forEach((item) => {
      const chip = document.createElement('div');
      chip.className = 'word-chip ' + item.status;
      chip.innerHTML = `
        <span>${item.target}</span>
        <span class="word-chip-sub">${item.spoken} (${item.label})</span>
      `;
      wordBreakdown.appendChild(chip);
    });

    makharijTipsContainer.innerHTML = '';
    if (evaluation.makharijTips && evaluation.makharijTips.length > 0) {
      evaluation.makharijTips.forEach((tip) => {
        const tipBox = document.createElement('div');
        tipBox.className = 'makharij-tip-box';
        tipBox.innerHTML = `<strong>💡 ${tip.title}:</strong> ${tip.message}`;
        makharijTipsContainer.appendChild(tipBox);
      });
    }
  }

  // 6. Tab 3: Situational Dialogues (Rendering full 36 sentences)
  function renderScenario(scenarioId) {
    try {
      if (!window.FushaScenarios) return;
      const scenario = window.FushaScenarios.getScenarioById(scenarioId);
      if (!scenario) return;

      scenarioDescription.textContent = scenario.description;
      dialogueContainer.innerHTML = '';

      scenario.dialogues.forEach((step) => {
        const card = document.createElement('div');
        card.className = 'section-card';
        card.style.marginBottom = '8px';
        card.style.padding = '10px';

        if (step.speaker === 'coach') {
          card.innerHTML = `
            <div class="card-title">
              <span style="color: var(--accent-sky); font-weight: bold;">🎙️ ${step.name}</span>
              <button class="icon-btn play-bubble-btn" data-text="${step.arabic.replace(/"/g, '&quot;')}">🔊 ئاڭلاش</button>
            </div>
            <div class="arabic-text" style="color: var(--text-main); font-size: 16px; margin-bottom: 4px;">
              ${step.arabic}
            </div>
            <div style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">
              ${step.uyghur}
            </div>
          `;
        } else {
          card.innerHTML = `
            <div class="card-title">
              <span style="color: #60a5fa; font-weight: bold;">👤 ${step.name}</span>
              <span style="font-size: 10px; color: var(--text-muted);">سىزنىڭ نۆۋىتىڭىز</span>
            </div>
            <div style="font-size: 11px; color: var(--text-main); margin-bottom: 6px;">
              ${step.promptUyghur}
            </div>
            <div class="arabic-text" style="color: #38bdf8; font-size: 15px; background: var(--bg-tertiary); padding: 6px 8px; border-radius: 4px; margin-bottom: 4px;">
              ${step.targetArabic}
            </div>
            <div style="font-size: 10px; color: var(--warning); margin-bottom: 8px;">
              💡 ئەسكەرتىش: ${step.hints}
            </div>
            <div class="button-row">
              <button class="btn-primary practice-mic-btn" data-target="${step.targetArabic.replace(/"/g, '&quot;')}">
                🎙️ بۇ جۈملىنى سۆزلەپ مەشىق قىلىش
              </button>
            </div>
          `;
        }

        dialogueContainer.appendChild(card);
      });

      dialogueContainer.querySelectorAll('.play-bubble-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const text = btn.getAttribute('data-text');
          if (text) speakArabic(text, 1.0);
        });
      });

      dialogueContainer.querySelectorAll('.practice-mic-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-target');
          if (target) {
            currentTargetSentence = target;
            targetSentenceText.textContent = target;
            const speechTab = document.querySelector('[data-tab="tab-speech"]');
            if (speechTab) speechTab.click();
            recordMicBtn.click();
          }
        });
      });
    } catch (err) {
      console.error('Render scenario error:', err);
    }
  }

  scenarioSelector.addEventListener('change', (e) => {
    renderScenario(e.target.value);
  });

  initTheme();
  renderScenario('islamic_seminar');
});
