# Fusha-Speak Live Coach (ئەرەب تىلى نۇتۇق ۋە مۇھىت مەشقاۋۇلى)
## تېخنىكىلىق لايىھە پۈتۈكى (Technical Specification - SPEC)
**نەشرى:** 1.1.0 (Enterprise Architecture)  
**سۇپا ئۆلچىمى:** Google Chrome Manifest V3  
**ھالىتى:** پۈتكەن ۋە تامامەن دەلىللەنگەن (Approved for Implementation)  
**ئاساسىي كۆرۈنۈش ئۇسلۇبى:** پادىشاھ كۆكى (Royal Azure Blue / #2563eb)  

---

### 1. سىستېما كۆرۈنۈشى ۋە ئارخىتېكتۇرا (System Architecture)

```
+-----------------------------------------------------------------------+
|                       Google Chrome Browser                           |
+-----------------------------------------------------------------------+
|  +--------------------+   +----------------------------------------+  |
|  |  Action Popup      |   |        Chrome Side Panel               |  |
|  |  (360px x 560px)   |   |   (sidepanel.html / sidepanel.js)      |  |
|  |  - Instant Tashkeel|   |   - Full Screen Voice Dialogue Coach   |  |
|  |  - Quick Reader    |   |   - Permanent Mic Permission Origin    |  |
|  |  - Blue UI Accent  |   |   - 36 Practical Situational Dialogues |  |
|  +---------+----------+   +-------------------+--------------------+  |
|            |                                  |                       |
|            +-----------------+----------------+                       |
|                              |                                        |
|                              v                                        |
|     +-------------------------------------------------------+         |
|     |              Core Rules & Analysis Engine             |         |
|     |               (extension/rules_engine.js)             |         |
|     |  * Local Morphological Diacritizer (Tashkeel)         |         |
|     |  * Fusha Phonetic Distance & Alignment Scorer         |         |
|     |  * Harakat & Makharij Diagnostic Rulebook             |         |
|     +------------------------+------------------------------+         |
|                              |                                        |
|            +-----------------+------------------+                     |
|            |                                    |                     |
|            v                                    v                     |
|  +---------------------+             +---------------------+          |
|  |  Web Speech API     |             | chrome.storage.local|          |
|  |  * getUserMedia     |             | * User Progress     |          |
|  |    Permission Prechk|             | * Audio Settings    |          |
|  |  * SpeechRecognition|             | * Bookmarks & Notes |          |
|  |    (ar-SA / ar)     |             | (100% Local Encrypted)         |
|  |  * SpeechSynthesis  |             |                     |          |
|  +---------------------+             +---------------------+          |
+-----------------------------------------------------------------------+
```

---

### 2. Manifest V3 سەپلىمىسى ۋە بىخەتەرلىك ھۆججىتى (Manifest V3 Specification)

#### 2.1. ئەڭ تۆۋەن ئىجازەت (Least Privilege Principle):
- `permissions`:
  - `"sidePanel"`: تور كۆرگۈچنىڭ يان تەرىپىدە دائىملىق كۆزنەك ئېچىش ئۈچۈن.
  - `"storage"`: ئابۇنتنىڭ ئۆگىنىش تارىخى، نومۇرلىرى ۋە تاللىشىنى يەرلىكتە ساقلاش ئۈچۈن.
- تاشقى تور رۇخسىتى: نۆل! (`host_permissions` قۇرۇق قالدۇرۇلىدۇ).

#### 2.2. Content Security Policy (CSP):
```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline';"
}
```

---

### 3. مىكروفون رۇخسىتى ۋە «not-allowed» خاتالىقىنى تۈپتىن ھەل قىلىش تېخنىكىسى

#### 3.1. «not-allowed» خاتالىقىنىڭ كېلىپ چىقىش تۈپ سەۋەبى:
Google Chrome كۆرگۈچىنىڭ Manifest V3 بىخەتەرلىك مېخانىزمىدا:
1. `popup.html` (Action Popup) ۋاقىتلىق ئېچىلىپ يېپىلىدىغان كۆزنەك بولغانلىقى ئۈچۈن، Chrome كۆرگۈچى مىكروفون رۇخسىتى سوراش كۆپۈكچىسىنى (Permission Dialog) كۆرسەتمەي، سۈكۈت بويىچە `event.error = 'not-allowed'` (NotAllowedError) چىقىرىپ تاشلايدۇ.
2. ئەگەر كۆرگۈچنىڭ مەزكۇر قىستۇرما تەۋەلىكىگە (`chrome-extension://<ID>`) ئىلگىرى بىرەر قېتىممۇ مىكروفون رۇخسىتى بېرىلمىگەن بولسا، `recognition.start()` بىۋاسىتە چەكلىنىدۇ.

#### 3.2. تېخنىكىلىق ھەل قىلىش پىلانى (Architectural Resolution):
1. **Preflight Permission Check (`getUserMedia` تەكشۈرۈش):**
   - مىكروفون كۇنۇپكىسى بېسىلغاندا بىۋاسىتە `recognition.start()` قىلماي، ئالدى بىلەن `navigator.mediaDevices.getUserMedia({ audio: true })` قوزغىتىلىدۇ.
   - ئىجازەت تەستىقلانغان ھامان ئۈن سىگنالى دەرھال توختىتىلىپ (`stream.getTracks().forEach(t => t.stop())`)، ئارقىدىن `recognition.start()` ئىشقا كىرىدۇ.
2. **Side Panel دا مەڭگۈلۈك ئىجازەت بېرىش تەۋسىيەسى:**
   - Chrome كۆرگۈچىنىڭ «Side Panel» (يان كۆزنەك) سىستېمىسى دائىملىق كۆزنەك بولغانلىقى ئۈچۈن، مىكروفون رۇخسىتى كۆزنىكىنى نورمال كۆرسىتەلەيدۇ ۋە بىر قېتىم بېرىلگەن ئىجازەت مەڭگۈ كۈچكە ئىگە بولىدۇ.
   - ئەگەر `popup.html` دا `not-allowed` چىقسا، سىستېما سۈزۈك تۈردە ئۇيغۇرچە يېتەكچى چىقىرىپ، «يان كۆزنەككە ئۆتۈش» ياكى كۆرگۈچ ئادرېس تاختىسىدىكى مىكروفوننى قوزغاش كۇنۇپكىسىنى سۇنىدۇ.
3. **تەقلىدىي سىناق كاپالىتى (Interactive Simulator Fallback):**
   - ئاۋاز ئۈسكۈنىسى بولمىغان، ياكى تور كۆرگۈچ سىستېمىسىنىڭ ئاۋاز بېرىشى مەنئى قىلىنغان مۇھىتلاردىمۇ تەلەپپۇز نومۇرى چىقىرىش، مەخرەج ئانالىزى ۋە سۆزمۇ-سۆز سېلىشتۇرۇش ماتورى كاشىلىسىز خىزمەت قىلىدۇ.

---

### 4. 36 جۈملىلىك ھەقىقىي مۇھىت دىئالوگ سىستېمىسى (36-Sentence Scenario Syllabus)

ھۆججەتتە 6 مۇستەقىل ئەمەلىي مۇھىت، ھەر بىر مۇھىتتا دەل 6 نۆۋەتتىن جەمئىي 36 ئەمەلىي فۇسھا نۇتۇق جۈملىسى تۈزۈلگەن:

```typescript
interface ScenarioSchema {
  id: string;
  title: string;
  arabicTitle: string;
  level: 'ئاساس' | 'ئوتتۇرا' | 'ئالىي';
  dialogues: Array<{
    speaker: 'coach' | 'user';
    name: string;
    arabic?: string;
    uyghur?: string;
    promptUyghur?: string;
    targetArabic?: string;
    hints?: string;
  }>; // Minimum 6 dialogues per scenario = 36 total sentences
}
```

---

### 5. كۆرۈنمە يۈز رەڭ ۋە لايىھە ئۆلچىمى (Blue Accent Standard)

- **ئاساسىي كۆك رەڭ كوئوردىناتى:**
  - `Accent Color`: `#2563eb` (Royal Azure Blue)
  - `Accent Hover`: `#1d4ed8`
  - `Accent Glow / Soft`: `rgba(37, 99, 235, 0.15)`
  - `Text Light Accent`: `#38bdf8` (Sky Blue)
- بارلىق كۇنۇپكا، ئاۋاز دولقۇنى ۋە تەلەپپۇز كۆرسەتكۈچلىرىدە تەلەپ بويىچە كۆك رەڭ ئاساس قىلىندى.
