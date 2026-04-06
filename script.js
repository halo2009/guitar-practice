const NOTES = [
  "C", "C#/Db", "D", "D#/Eb", "E", "F",
  "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"
];

const NOTE_INDEX = {
  "C": 0,
  "C#/Db": 1, "C#": 1, "Db": 1,
  "D": 2,
  "D#/Eb": 3, "D#": 3, "Eb": 3,
  "E": 4,
  "F": 5,
  "F#/Gb": 6, "F#": 6, "Gb": 6,
  "G": 7,
  "G#/Ab": 8, "G#": 8, "Ab": 8,
  "A": 9,
  "A#/Bb": 10, "A#": 10, "Bb": 10,
  "B": 11
};

const STRINGS = [
  { num: 1, open: "E", label: "1(E)" },
  { num: 2, open: "B", label: "2(B)" },
  { num: 3, open: "G", label: "3(G)" },
  { num: 4, open: "D", label: "4(D)" },
  { num: 5, open: "A", label: "5(A)" },
  { num: 6, open: "E", label: "6(E)" }
];

const SCALE_LIBRARY = {
  major: [
    { id: "major", label: "Major (Ionian)", intervals: [0, 2, 4, 5, 7, 9, 11] }
  ],
  minor3: [
    { id: "natural_minor", label: "Natural Minor (Aeolian)", intervals: [0, 2, 3, 5, 7, 8, 10] },
    { id: "harmonic_minor", label: "Harmonic Minor", intervals: [0, 2, 3, 5, 7, 8, 11] },
    { id: "melodic_minor", label: "Melodic Minor", intervals: [0, 2, 3, 5, 7, 9, 11] }
  ],
  mode: [
    { id: "ionian", label: "Ionian (Major)", intervals: [0, 2, 4, 5, 7, 9, 11] },
    { id: "dorian", label: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10] },
    { id: "phrygian", label: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10] },
    { id: "lydian", label: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11] },
    { id: "mixolydian", label: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10] },
    { id: "aeolian", label: "Aeolian (Natural Minor)", intervals: [0, 2, 3, 5, 7, 8, 10] },
    { id: "locrian", label: "Locrian", intervals: [0, 1, 3, 5, 6, 8, 10] }
  ],
  blues: [
    { id: "minor_blues", label: "Minor Blues", intervals: [0, 3, 5, 6, 7, 10] },
    { id: "major_blues", label: "Major Blues", intervals: [0, 2, 3, 4, 7, 9] }
  ],
  pentatonic: [
    { id: "major_pentatonic", label: "Major Pentatonic", intervals: [0, 2, 4, 7, 9] },
    { id: "minor_pentatonic", label: "Minor Pentatonic", intervals: [0, 3, 5, 7, 10] }
  ]
};

const SCALE_CATEGORY_LABELS = {
  major: "메이저",
  minor3: "마이너 3개",
  mode: "모드",
  blues: "블루스",
  pentatonic: "펜타토닉"
};

const CHORD_TYPES = [
  { value: "M" }, { value: "m" }, { value: "7" }, { value: "M7" },
  { value: "m7" }, { value: "sus4" }, { value: "7sus4" }, { value: "dim7" },
  { value: "m7(b5)" }, { value: "6" }, { value: "m6" }, { value: "mM7" },
  { value: "7(#5)" }, { value: "M7(#5)" }
];

const CHROMATIC_PIANO = [
  { label: "C", isBlack: false, semitone: 0 },
  { label: "C#/Db", isBlack: true, left: "14.2%", semitone: 1 },
  { label: "D", isBlack: false, semitone: 2 },
  { label: "D#/Eb", isBlack: true, left: "28.5%", semitone: 3 },
  { label: "E", isBlack: false, semitone: 4 },
  { label: "F", isBlack: false, semitone: 5 },
  { label: "F#/Gb", isBlack: true, left: "57.2%", semitone: 6 },
  { label: "G", isBlack: false, semitone: 7 },
  { label: "G#/Ab", isBlack: true, left: "71.4%", semitone: 8 },
  { label: "A", isBlack: false, semitone: 9 },
  { label: "A#/Bb", isBlack: true, left: "85.7%", semitone: 10 },
  { label: "B", isBlack: false, semitone: 11 }
];

const NATURAL_NOTES = ["C", "D", "E", "F", "G", "A", "B"];
const FRET_COUNT = 12;
const PROGRESSION_PATTERNS = [
  { label: "2-5-1", degrees: [2, 5, 1] },
  { label: "1-6-2-5", degrees: [1, 6, 2, 5] },
  { label: "1-5-6-4", degrees: [1, 5, 6, 4] },
  { label: "6-2-5-1", degrees: [6, 2, 5, 1] }
];

// tabs
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

// fretboard
const keySelect = document.getElementById("keySelect");
const scaleCategorySelect = document.getElementById("scaleCategorySelect");
const scaleSelect = document.getElementById("scaleSelect");
const noteFilterSelect = document.getElementById("noteFilterSelect");
const showScaleBtn = document.getElementById("showScaleBtn");
const showAllBtn = document.getElementById("showAllBtn");
const scaleNotesOutput = document.getElementById("scaleNotesOutput");
const fretboard = document.getElementById("fretboard");

// random
const generateProgressBtn = document.getElementById("generateProgressBtn");
const generateSetBtn = document.getElementById("generateSetBtn");
const randomChordOutput = document.getElementById("randomChordOutput");
const chordTypesSummary = document.getElementById("chordTypesSummary");

// ear
const earModeSelect = document.getElementById("earModeSelect");
const startOctaveSelect = document.getElementById("startOctaveSelect");
const octaveSpanSelect = document.getElementById("octaveSpanSelect");
const difficultySelect = document.getElementById("difficultySelect");
const newQuestionBtn = document.getElementById("newQuestionBtn");
const playQuestionBtn = document.getElementById("playQuestionBtn");
const earQuestionBox = document.getElementById("earQuestionBox");
const singleNoteAnswerWrap = document.getElementById("singleNoteAnswerWrap");
const answerPiano = document.getElementById("answerPiano");
const majorMinorAnswerWrap = document.getElementById("majorMinorAnswerWrap");
const earResult = document.getElementById("earResult");

// harmony
const harmonyKeySelect = document.getElementById("harmonyKeySelect");
const harmonyScaleCategorySelect = document.getElementById("harmonyScaleCategorySelect");
const harmonyScaleSelect = document.getElementById("harmonyScaleSelect");
const harmonyScaleNotes = document.getElementById("harmonyScaleNotes");
const harmonyDegrees = document.getElementById("harmonyDegrees");
const diatonicTriads = document.getElementById("diatonicTriads");
const diatonicSevenths = document.getElementById("diatonicSevenths");
const harmonyChordSelect = document.getElementById("harmonyChordSelect");
const chordTonesBox = document.getElementById("chordTonesBox");
const chordTensionsBox = document.getElementById("chordTensionsBox");
const progressionSelect = document.getElementById("progressionSelect");
const transposeSelect = document.getElementById("transposeSelect");
const applyTransposeBtn = document.getElementById("applyTransposeBtn");
const progressionBox = document.getElementById("progressionBox");
const transposeBox = document.getElementById("transposeBox");
const circleOfFifthsBox = document.getElementById("circleOfFifthsBox");
const secondaryDominantsBox = document.getElementById("secondaryDominantsBox");
const relatedIIm7Box = document.getElementById("relatedIIm7Box");
const tritoneSubBox = document.getElementById("tritoneSubBox");
const modalInterchangeBox = document.getElementById("modalInterchangeBox");
const specialScalesBox = document.getElementById("specialScalesBox");

let fretMode = "scale";
let currentQuestion = null;
let audioCtx = null;
let lastProgressionChords = [];

init();

function init() {
  initTabs();
  initSharedKeyOptions();
  initFretboardControls();
  initRandomChord();
  initEarTraining();
  initHarmony();
  renderChordTypesSummary();
  renderFretboard();
  renderAnswerPiano();
  updateEarModeUI();
  renderHarmony();
}

function initTabs() {
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

function initSharedKeyOptions() {
  NOTES.forEach((note) => {
    const op1 = document.createElement("option");
    op1.value = note;
    op1.textContent = note;
    keySelect.appendChild(op1);

    const op2 = document.createElement("option");
    op2.value = note;
    op2.textContent = note;
    harmonyKeySelect.appendChild(op2);
  });

  keySelect.value = "C";
  harmonyKeySelect.value = "C";
}

function buildScaleCategoryOptions(selectEl) {
  selectEl.innerHTML = "";
  Object.entries(SCALE_CATEGORY_LABELS).forEach(([value, label]) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    selectEl.appendChild(opt);
  });
}

function populateScaleSelect(category, selectEl) {
  selectEl.innerHTML = "";
  SCALE_LIBRARY[category].forEach((scale) => {
    const opt = document.createElement("option");
    opt.value = scale.id;
    opt.textContent = scale.label;
    selectEl.appendChild(opt);
  });
}

function getScaleById(category, scaleId) {
  return SCALE_LIBRARY[category].find((s) => s.id === scaleId);
}

function getScaleNoteIndexes(rootLabel, scaleObj) {
  const rootIndex = NOTE_INDEX[rootLabel];
  return scaleObj.intervals.map((interval) => (rootIndex + interval) % 12);
}

function getScaleNoteLabels(rootLabel, scaleObj) {
  return getScaleNoteIndexes(rootLabel, scaleObj).map((i) => NOTES[i]);
}

function joinWithDash(arr) {
  return arr.join(" - ");
}

// ---------------- 지판 ----------------
function initFretboardControls() {
  buildScaleCategoryOptions(scaleCategorySelect);
  scaleCategorySelect.value = "major";
  populateScaleSelect("major", scaleSelect);

  const none = document.createElement("option");
  none.value = "";
  none.textContent = "필터 없음";
  noteFilterSelect.appendChild(none);

  NOTES.forEach((note) => {
    const opt = document.createElement("option");
    opt.value = note;
    opt.textContent = note;
    noteFilterSelect.appendChild(opt);
  });

  scaleCategorySelect.addEventListener("change", () => {
    populateScaleSelect(scaleCategorySelect.value, scaleSelect);
    renderFretboard();
  });

  keySelect.addEventListener("change", renderFretboard);
  scaleSelect.addEventListener("change", renderFretboard);
  noteFilterSelect.addEventListener("change", renderFretboard);

  showScaleBtn.addEventListener("click", () => {
    fretMode = "scale";
    showScaleBtn.classList.add("active-mode");
    showAllBtn.classList.remove("active-mode");
    renderFretboard();
  });

  showAllBtn.addEventListener("click", () => {
    fretMode = "all";
    showAllBtn.classList.add("active-mode");
    showScaleBtn.classList.remove("active-mode");
    renderFretboard();
  });
}

function renderFretboard() {
  const root = keySelect.value;
  const category = scaleCategorySelect.value;
  const scaleObj = getScaleById(category, scaleSelect.value);
  const filterValue = noteFilterSelect.value;
  const filterIndex = filterValue === "" ? null : NOTE_INDEX[filterValue];

  const scaleIndexes = getScaleNoteIndexes(root, scaleObj);
  const scaleLabels = getScaleNoteLabels(root, scaleObj);

  scaleNotesOutput.textContent =
    fretMode === "scale" ? joinWithDash(scaleLabels) : joinWithDash(NOTES);

  let html = `<table class="fretboard-table"><thead><tr><th>줄/프렛</th>`;
  for (let fret = 0; fret <= FRET_COUNT; fret++) html += `<th>${fret}</th>`;
  html += `</tr></thead><tbody>`;

  STRINGS.forEach((stringData) => {
    html += `<tr><td>${stringData.label}</td>`;
    for (let fret = 0; fret <= FRET_COUNT; fret++) {
      const noteIndex = (NOTE_INDEX[stringData.open] + fret) % 12;
      const noteLabel = NOTES[noteIndex];
      let noteClass = "note";

      if (fretMode === "all") {
        if (filterIndex !== null) noteClass += noteIndex === filterIndex ? " filtered" : " dim";
      } else {
        if (scaleIndexes.includes(noteIndex)) {
          if (filterIndex !== null) {
            noteClass += noteIndex === filterIndex ? " filtered" : " dim";
          } else {
            noteClass += " scale";
          }
        } else {
          noteClass += " dim";
        }
      }

      const tdClass = [
        "string-cell",
        `string-${stringData.num}`,
        fret === 0 ? "open-string-col" : "fretboard-wood"
      ].join(" ");

      html += `<td class="${tdClass}"><div class="${noteClass}">${noteLabel}</div></td>`;
    }
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  fretboard.innerHTML = html;
}

// ---------------- 랜덤 코드 ----------------
function initRandomChord() {
  generateProgressBtn.addEventListener("click", () => {
    const chords = [];
    for (let i = 0; i < 4; i++) chords.push(createRandomChord());
    renderChordLine(chords, "4개 반복코드");
  });

  generateSetBtn.addEventListener("click", () => {
    const shuffledTypes = shuffleArray([...CHORD_TYPES]);
    const result = shuffledTypes.map((type) => ({
      chordText: `${NOTES[randomInt(0, NOTES.length - 1)]}${type.value}`,
      rootString: Math.random() < 0.5 ? 5 : 6
    }));
    renderChordLine(result, "전체 랜덤");
  });
}

function renderChordTypesSummary() {
  chordTypesSummary.textContent = CHORD_TYPES.map((c) => c.value).join(" · ");
}

function createRandomChord() {
  return {
    chordText: `${NOTES[randomInt(0, NOTES.length - 1)]}${CHORD_TYPES[randomInt(0, CHORD_TYPES.length - 1)].value}`,
    rootString: Math.random() < 0.5 ? 5 : 6
  };
}

function renderChordLine(chords, title) {
  const line = chords.map((ch) => `${ch.chordText} (R${ch.rootString})`).join(" - ");
  randomChordOutput.innerHTML = `<strong>${title}:</strong> ${line}`;
}

// ---------------- 귀훈련 ----------------
function initEarTraining() {
  earModeSelect.addEventListener("change", () => {
    updateEarModeUI();
    resetEarState();
  });

  startOctaveSelect.addEventListener("change", resetEarState);
  octaveSpanSelect.addEventListener("change", resetEarState);
  difficultySelect.addEventListener("change", resetEarState);

  newQuestionBtn.addEventListener("click", createQuestion);
  playQuestionBtn.addEventListener("click", playCurrentQuestion);

  majorMinorAnswerWrap.querySelectorAll("[data-mm-answer]").forEach((btn) => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.mmAnswer));
  });
}

function updateEarModeUI() {
  if (earModeSelect.value === "single-note") {
    singleNoteAnswerWrap.style.display = "block";
    majorMinorAnswerWrap.classList.remove("active");
  } else {
    singleNoteAnswerWrap.style.display = "none";
    majorMinorAnswerWrap.classList.add("active");
  }
}

function resetEarState() {
  currentQuestion = null;
  earQuestionBox.textContent = "새 문제를 눌러 시작해.";
  earResult.textContent = "-";
  earResult.classList.remove("ear-correct", "ear-wrong");
}

function renderAnswerPiano() {
  answerPiano.innerHTML = "";

  const whiteKeys = document.createElement("div");
  whiteKeys.className = "white-keys";

  CHROMATIC_PIANO.filter((n) => !n.isBlack).forEach((item) => {
    const key = document.createElement("button");
    key.type = "button";
    key.className = "white-key";
    key.dataset.note = item.label;
    key.setAttribute("aria-label", item.label);
    key.addEventListener("click", () => {
      animatePianoKey(key);
      if (earModeSelect.value === "single-note") checkAnswer(item.label);
    });
    whiteKeys.appendChild(key);
  });

  const blackKeys = document.createElement("div");
  blackKeys.className = "black-keys";

  CHROMATIC_PIANO.filter((n) => n.isBlack).forEach((item) => {
    const key = document.createElement("button");
    key.type = "button";
    key.className = "black-key";
    key.style.left = item.left;
    key.dataset.note = item.label;
    key.setAttribute("aria-label", item.label);
    key.addEventListener("click", () => {
      animatePianoKey(key);
      if (earModeSelect.value === "single-note") checkAnswer(item.label);
    });
    blackKeys.appendChild(key);
  });

  answerPiano.appendChild(whiteKeys);
  answerPiano.appendChild(blackKeys);
}

function animatePianoKey(el) {
  el.classList.add("active-press");
  setTimeout(() => el.classList.remove("active-press"), 120);
}

function createQuestion() {
  earResult.textContent = "-";
  earResult.classList.remove("ear-correct", "ear-wrong");
  currentQuestion = null;

  if (earModeSelect.value === "single-note") {
    createSingleNoteQuestion();
  } else {
    createMajorMinorQuestion();
  }
}

function createSingleNoteQuestion() {
  const startOctave = Number(startOctaveSelect.value);
  const octaveSpan = Number(octaveSpanSelect.value);
  const difficulty = difficultySelect.value;
  const pool = [];

  for (let octave = startOctave; octave <= startOctave + octaveSpan; octave++) {
    CHROMATIC_PIANO.forEach((item) => {
      pool.push({ note: item.label, semitone: item.semitone, octave });
    });
  }

  let filteredPool = [...pool];
  if (difficulty === "easy") {
    filteredPool = filteredPool.filter((item) => !item.note.includes("#/"));
  } else if (difficulty === "hard") {
    filteredPool = shuffleArray(filteredPool);
  }

  const selected = filteredPool[randomInt(0, filteredPool.length - 1)];
  currentQuestion = {
    mode: "single-note",
    answer: selected.note,
    freq: getFrequencyFromSemitone(selected.semitone, selected.octave)
  };

  earQuestionBox.textContent =
    `음을 듣고 맞혀봐. 시작 옥타브 ${startOctave}, 옥타브 폭 ${octaveSpan}, 난이도 ${difficultyLabel(difficulty)}.`;

  playCurrentQuestion();
}

function createMajorMinorQuestion() {
  const startOctave = Number(startOctaveSelect.value);
  const octaveSpan = Number(octaveSpanSelect.value);
  const difficulty = difficultySelect.value;
  const possibleOctaves = [];

  for (let octave = startOctave; octave <= startOctave + octaveSpan; octave++) {
    possibleOctaves.push(octave);
  }

  const rootNatural = NATURAL_NOTES[randomInt(0, NATURAL_NOTES.length - 1)];
  const rootOctave = possibleOctaves[randomInt(0, possibleOctaves.length - 1)];
  const answer = Math.random() < 0.5 ? "Major" : "Minor";
  let voicingType = "close";

  if (difficulty === "normal") voicingType = Math.random() < 0.5 ? "close" : "open";
  if (difficulty === "hard") voicingType = Math.random() < 0.3 ? "close" : "open";

  currentQuestion = { mode: "major-minor", answer, rootNatural, rootOctave, voicingType };

  earQuestionBox.textContent =
    `코드를 듣고 메이저인지 마이너인지 맞혀봐. 시작 옥타브 ${startOctave}, 옥타브 폭 ${octaveSpan}, 난이도 ${difficultyLabel(difficulty)}.`;

  playCurrentQuestion();
}

function checkAnswer(selected) {
  if (!currentQuestion) return;

  if (selected === currentQuestion.answer) {
    earResult.textContent = `정답: ${currentQuestion.answer}`;
    earResult.classList.remove("ear-wrong");
    earResult.classList.add("ear-correct");
  } else {
    earResult.textContent = `오답: 정답은 ${currentQuestion.answer}`;
    earResult.classList.remove("ear-correct");
    earResult.classList.add("ear-wrong");
  }
}

function playCurrentQuestion() {
  if (!currentQuestion) return;
  ensureAudio();

  if (currentQuestion.mode === "single-note") {
    playTone(currentQuestion.freq, 1.0, "sine");
    return;
  }

  const rootFreq = getFrequencyFromNatural(currentQuestion.rootNatural, currentQuestion.rootOctave);
  const thirdRatio = currentQuestion.answer === "Major" ? Math.pow(2, 4 / 12) : Math.pow(2, 3 / 12);
  const fifthRatio = Math.pow(2, 7 / 12);

  const freqs = currentQuestion.voicingType === "open"
    ? [rootFreq, rootFreq * fifthRatio, rootFreq * thirdRatio * 2]
    : [rootFreq, rootFreq * thirdRatio, rootFreq * fifthRatio];

  playChord(freqs, 1.35);
}

function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function playTone(freq, duration = 1, type = "sine") {
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

function playChord(freqs, duration = 1.2) {
  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();

  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  master.connect(audioCtx.destination);

  freqs.forEach((freq) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.12, now);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + duration + 0.03);
  });
}

// ---------------- 화성학 ----------------
function initHarmony() {
  buildScaleCategoryOptions(harmonyScaleCategorySelect);
  harmonyScaleCategorySelect.value = "major";
  populateScaleSelect("major", harmonyScaleSelect);

  PROGRESSION_PATTERNS.forEach((p, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = p.label;
    progressionSelect.appendChild(opt);
  });

  for (let i = -6; i <= 6; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i === 0 ? "0 (원키)" : `${i > 0 ? "+" : ""}${i} semitone`;
    transposeSelect.appendChild(opt);
  }

  harmonyScaleCategorySelect.addEventListener("change", () => {
    populateScaleSelect(harmonyScaleCategorySelect.value, harmonyScaleSelect);
    renderHarmony();
  });

  harmonyKeySelect.addEventListener("change", renderHarmony);
  harmonyScaleSelect.addEventListener("change", renderHarmony);
  harmonyChordSelect.addEventListener("change", renderChordAnalysis);
  progressionSelect.addEventListener("change", renderHarmony);
  applyTransposeBtn.addEventListener("click", applyTranspose);
}

function renderHarmony() {
  const root = harmonyKeySelect.value;
  const category = harmonyScaleCategorySelect.value;
  const scaleObj = getScaleById(category, harmonyScaleSelect.value);

  const notes = getScaleNoteLabels(root, scaleObj);
  const triads = buildDiatonicTriads(root, scaleObj);
  const sevenths = buildDiatonicSevenths(root, scaleObj);

  harmonyScaleNotes.textContent = joinWithDash(notes);
  harmonyDegrees.textContent = joinWithDash(getDegreeLabels(scaleObj.intervals));
  diatonicTriads.innerHTML = triads.map((item) => `${item.degree} : ${item.chord}`).join("<br>");
  diatonicSevenths.innerHTML = sevenths.map((item) => `${item.degree} : ${item.chord}`).join("<br>");

  buildHarmonyChordSelect(sevenths);
  renderChordAnalysis();
  renderProgression(root, triads, sevenths);
  renderCircleOfFifths(root);
  renderAdvancedHarmony(root, triads, sevenths);
}

function getDegreeLabels(intervals) {
  const map = {
    0: "1", 1: "b2", 2: "2", 3: "b3", 4: "3", 5: "4",
    6: "#4 / b5", 7: "5", 8: "b6", 9: "6", 10: "b7", 11: "7"
  };
  return intervals.map((n) => map[n]);
}

function buildDiatonicTriads(root, scaleObj) {
  const notes = getScaleNoteLabels(root, scaleObj);
  const intervals = scaleObj.intervals;

  return notes.map((note, i) => {
    const third = normalizeToOctave(intervals[(i + 2) % notes.length] - intervals[i]);
    const fifth = normalizeToOctave(intervals[(i + 4) % notes.length] - intervals[i]);
    const quality = triadQuality(third, fifth);

    return {
      degree: romanDegree(i + 1, quality.kind),
      chord: note + quality.suffix,
      tones: [notes[i], notes[(i + 2) % notes.length], notes[(i + 4) % notes.length]]
    };
  });
}

function buildDiatonicSevenths(root, scaleObj) {
  const notes = getScaleNoteLabels(root, scaleObj);
  const intervals = scaleObj.intervals;

  return notes.map((note, i) => {
    const third = normalizeToOctave(intervals[(i + 2) % notes.length] - intervals[i]);
    const fifth = normalizeToOctave(intervals[(i + 4) % notes.length] - intervals[i]);
    const seventh = normalizeToOctave(intervals[(i + 6) % notes.length] - intervals[i]);
    const quality = seventhQuality(third, fifth, seventh);

    return {
      degree: romanDegree(i + 1, quality.kind),
      chord: note + quality.suffix,
      tones: [
        notes[i],
        notes[(i + 2) % notes.length],
        notes[(i + 4) % notes.length],
        notes[(i + 6) % notes.length]
      ]
    };
  });
}

function triadQuality(third, fifth) {
  if (third === 4 && fifth === 7) return { suffix: "", kind: "major" };
  if (third === 3 && fifth === 7) return { suffix: "m", kind: "minor" };
  if (third === 3 && fifth === 6) return { suffix: "dim", kind: "diminished" };
  if (third === 4 && fifth === 8) return { suffix: "aug", kind: "augmented" };
  return { suffix: "(?)", kind: "other" };
}

function seventhQuality(third, fifth, seventh) {
  if (third === 4 && fifth === 7 && seventh === 11) return { suffix: "M7", kind: "major" };
  if (third === 4 && fifth === 7 && seventh === 10) return { suffix: "7", kind: "major" };
  if (third === 3 && fifth === 7 && seventh === 10) return { suffix: "m7", kind: "minor" };
  if (third === 3 && fifth === 6 && seventh === 10) return { suffix: "m7(b5)", kind: "diminished" };
  if (third === 3 && fifth === 6 && seventh === 9) return { suffix: "dim7", kind: "diminished" };
  if (third === 3 && fifth === 7 && seventh === 11) return { suffix: "mM7", kind: "minor" };
  return { suffix: "(?)", kind: "other" };
}

function romanDegree(number, kind) {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII"];
  const base = romans[number - 1];
  if (kind === "major" || kind === "augmented") return base;
  if (kind === "minor") return base.toLowerCase();
  if (kind === "diminished") return `${base.toLowerCase()}°`;
  return base;
}

function normalizeToOctave(diff) {
  let value = diff;
  while (value < 0) value += 12;
  while (value >= 12) value -= 12;
  return value;
}

function buildHarmonyChordSelect(sevenths) {
  harmonyChordSelect.innerHTML = "";
  sevenths.forEach((item, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = `${item.degree} : ${item.chord}`;
    harmonyChordSelect.appendChild(opt);
  });
}

function renderChordAnalysis() {
  const root = harmonyKeySelect.value;
  const category = harmonyScaleCategorySelect.value;
  const scaleObj = getScaleById(category, harmonyScaleSelect.value);
  const sevenths = buildDiatonicSevenths(root, scaleObj);
  const idx = Number(harmonyChordSelect.value || 0);
  const chord = sevenths[idx];
  const scaleNotes = getScaleNoteLabels(root, scaleObj);

  if (!chord) return;

  chordTonesBox.textContent = joinWithDash(chord.tones);
  const tensions = [
    scaleNotes[(idx + 1) % scaleNotes.length],
    scaleNotes[(idx + 3) % scaleNotes.length],
    scaleNotes[(idx + 5) % scaleNotes.length]
  ];
  chordTensionsBox.textContent = `9 : ${tensions[0]}   |   11 : ${tensions[1]}   |   13 : ${tensions[2]}`;
}

function renderProgression(root, triads, sevenths) {
  const pattern = PROGRESSION_PATTERNS[Number(progressionSelect.value || 0)];
  const source = sevenths;
  lastProgressionChords = pattern.degrees.map((d) => source[d - 1].chord);
  progressionBox.textContent = `${pattern.label} → ${lastProgressionChords.join(" - ")}`;
  transposeBox.textContent = "-";
}

function applyTranspose() {
  if (!lastProgressionChords.length) return;
  const semitones = Number(transposeSelect.value);
  const transposed = lastProgressionChords.map((ch) => transposeChordSymbol(ch, semitones));
  transposeBox.textContent = `${semitones === 0 ? "원키" : `${semitones > 0 ? "+" : ""}${semitones} semitone`} → ${transposed.join(" - ")}`;
}

function transposeChordSymbol(chord, semitones) {
  const root = getChordRoot(chord);
  const rest = chord.slice(root.length);
  const idx = NOTE_INDEX[root];
  return NOTES[(idx + semitones + 12) % 12] + rest;
}

function getChordRoot(chord) {
  const possible = Object.keys(NOTE_INDEX).sort((a, b) => b.length - a.length);
  return possible.find((p) => chord.startsWith(p)) || "C";
}

function renderCircleOfFifths(root) {
  const right = ["C", "G", "D", "A", "E", "B", "F#/Gb", "C#/Db"];
  const left = ["C", "F", "A#/Bb", "D#/Eb", "G#/Ab", "C#/Db", "F#/Gb"];
  circleOfFifthsBox.innerHTML =
    `오른쪽(#+): ${right.map((n) => n === root ? `[${n}]` : n).join(" → ")}<br>` +
    `왼쪽(b+): ${left.map((n) => n === root ? `[${n}]` : n).join(" → ")}<br>` +
    `상대조: ${root} Major ↔ ${getRelativeMinor(root)} Minor`;
}

function getRelativeMinor(root) {
  return NOTES[(NOTE_INDEX[root] + 9) % 12];
}

function renderAdvancedHarmony(root, triads, sevenths) {
  secondaryDominantsBox.innerHTML = renderSecondaryDominants(triads);
  relatedIIm7Box.innerHTML = renderRelatedIIm7(triads);
  tritoneSubBox.innerHTML = renderTritoneSubs(triads);
  modalInterchangeBox.innerHTML = renderModalInterchange(root);
  specialScalesBox.innerHTML = renderSpecialScales(root);
}

function renderSecondaryDominants(triads) {
  const targets = [2, 3, 4, 5, 6];
  return targets.map((degree) => {
    const targetRoot = getChordRoot(triads[degree - 1].chord);
    const domRoot = NOTES[(NOTE_INDEX[targetRoot] + 7) % 12];
    return `V/${degree} → ${domRoot}7 → ${triads[degree - 1].chord}`;
  }).join("<br>");
}

function renderRelatedIIm7(triads) {
  const targets = [2, 3, 4, 5, 6];
  return targets.map((degree) => {
    const targetRoot = getChordRoot(triads[degree - 1].chord);
    const domRoot = NOTES[(NOTE_INDEX[targetRoot] + 7) % 12];
    const iim7Root = NOTES[(NOTE_INDEX[domRoot] + 7) % 12];
    return `${domRoot}7의 related iim7 → ${iim7Root}m7`;
  }).join("<br>");
}

function renderTritoneSubs(triads) {
  const tonicRoot = getChordRoot(triads[0].chord);
  const domRoot = NOTES[(NOTE_INDEX[tonicRoot] + 7) % 12];
  const subRoot = NOTES[(NOTE_INDEX[domRoot] + 6) % 12];
  return `${domRoot}7 → ${triads[0].chord}<br>${subRoot}7 → ${triads[0].chord}`;
}

function renderModalInterchange(root) {
  const idx = NOTE_INDEX[root];
  const bIII = NOTES[(idx + 3) % 12];
  const iv = NOTES[(idx + 5) % 12] + "m";
  const bVI = NOTES[(idx + 8) % 12];
  const bVII = NOTES[(idx + 10) % 12];
  return `iv → ${iv}<br>bIII → ${bIII}<br>bVI → ${bVI}<br>bVII → ${bVII}`;
}

function renderSpecialScales(root) {
  const harmonicMinor = SCALE_LIBRARY.minor3.find((s) => s.id === "harmonic_minor");
  const melodicMinor = SCALE_LIBRARY.minor3.find((s) => s.id === "melodic_minor");
  const wholeTone = [0, 2, 4, 6, 8, 10].map((i) => NOTES[(NOTE_INDEX[root] + i) % 12]);
  const diminished = [0, 2, 3, 5, 6, 8, 9, 11].map((i) => NOTES[(NOTE_INDEX[root] + i) % 12]);

  return `Harmonic Minor → ${joinWithDash(getScaleNoteLabels(root, harmonicMinor))}<br>` +
         `Melodic Minor → ${joinWithDash(getScaleNoteLabels(root, melodicMinor))}<br>` +
         `Whole Tone → ${joinWithDash(wholeTone)}<br>` +
         `Diminished → ${joinWithDash(diminished)}`;
}

// ---------------- util ----------------
function getFrequencyFromSemitone(semitone, octave) {
  const midiNumber = 12 * (octave + 1) + semitone;
  return 440 * Math.pow(2, (midiNumber - 69) / 12);
}

function getFrequencyFromNatural(note, octave) {
  const map = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  return getFrequencyFromSemitone(map[note], octave);
}

function difficultyLabel(value) {
  if (value === "easy") return "쉬움";
  if (value === "hard") return "어려움";
  return "보통";
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}