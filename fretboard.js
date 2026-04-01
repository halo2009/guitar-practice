const NOTES = [
  "C", "C#/Db", "D", "D#/Eb", "E", "F",
  "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"
];

const TUNING = ["E", "A", "D", "G", "B", "E"];
const STRING_THICKNESS = [4, 3.5, 3, 2.6, 2.1, 1.7];

const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  majorPentatonic: [0, 2, 4, 7, 9],
  minorPentatonic: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10]
};

const SCALE_LABELS = {
  major: "Major",
  naturalMinor: "Natural Minor",
  majorPentatonic: "Major Pentatonic",
  minorPentatonic: "Minor Pentatonic",
  blues: "Blues",
  dorian: "Dorian",
  phrygian: "Phrygian",
  lydian: "Lydian",
  mixolydian: "Mixolydian",
  locrian: "Locrian"
};

const state = {
  viewMode: "all",
  selectedNote: "C",
  selectedKey: "C",
  selectedScale: "major",
  selectedPattern: 1,
  fretCount: 12
};

const elements = {
  viewMode: document.getElementById("viewMode"),
  noteSelect: document.getElementById("noteSelect"),
  keySelect: document.getElementById("keySelect"),
  scaleSelect: document.getElementById("scaleSelect"),
  patternSelect: document.getElementById("patternSelect"),
  fretCount: document.getElementById("fretCount"),
  resetBtn: document.getElementById("resetBtn"),
  fretboard: document.getElementById("fretboard"),
  fretNumbers: document.getElementById("fretNumbers"),
  inlays: document.getElementById("inlays"),
  boardTitle: document.getElementById("boardTitle"),
  boardSubtitle: document.getElementById("boardSubtitle"),
  patternInfo: document.getElementById("patternInfo"),
  positionRangeBadge: document.getElementById("positionRangeBadge"),
  positionRangeText: document.getElementById("positionRangeText"),
  patternBarWrap: document.getElementById("patternBarWrap"),
  patternBarFill: document.getElementById("patternBarFill"),
  patternStartLabel: document.getElementById("patternStartLabel"),
  patternEndLabel: document.getElementById("patternEndLabel"),
  noteGroup: document.getElementById("noteGroup"),
  keyGroup: document.getElementById("keyGroup"),
  scaleGroup: document.getElementById("scaleGroup"),
  patternGroup: document.getElementById("patternGroup")
};

function getCssPixelValue(variableName, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function getLayoutSizes() {
  return {
    nutWidth: getCssPixelValue("--nut-width", 20),
    fretWidth: getCssPixelValue("--fret-width", 76)
  };
}

function getNoteIndex(note) {
  return NOTES.indexOf(note);
}

function getNoteAtFret(openNote, fret) {
  const startIndex = getNoteIndex(openNote);
  return NOTES[(startIndex + fret) % 12];
}

function buildScale(root, scaleType) {
  const rootIndex = getNoteIndex(root);
  const intervals = SCALE_INTERVALS[scaleType];
  return intervals.map(interval => NOTES[(rootIndex + interval) % 12]);
}

function createOptions(selectElement) {
  NOTES.forEach(note => {
    const option = document.createElement("option");
    option.value = note;
    option.textContent = note;
    selectElement.appendChild(option);
  });
}

function getRootFretOnString(openStringNote, targetNote) {
  const openIndex = getNoteIndex(openStringNote);
  const targetIndex = getNoteIndex(targetNote);
  return (targetIndex - openIndex + 12) % 12;
}

function getBasePositionFret(key) {
  const lowERoot = getRootFretOnString("E", key);
  const aStringRoot = getRootFretOnString("A", key);
  const candidates = [lowERoot, aStringRoot].filter(fret => fret <= 5);

  if (candidates.length > 0) {
    return Math.min(...candidates);
  }

  return Math.min(lowERoot, aStringRoot);
}

function getRawPatternWindow(patternNumber) {
  const base = getBasePositionFret(state.selectedKey);

  const windows = {
    1: [base, base + 3],
    2: [base + 2, base + 5],
    3: [base + 4, base + 7],
    4: [base + 7, base + 10],
    5: [base + 9, base + 12]
  };

  return windows[patternNumber];
}

function clampPatternWindowToVisibleRange(patternNumber) {
  const [rawStart, rawEnd] = getRawPatternWindow(patternNumber);
  const visibleMin = 0;
  const visibleMax = state.fretCount;

  let start = Math.max(rawStart, visibleMin);
  let end = Math.min(rawEnd, visibleMax);

  if (start > visibleMax) {
    start = visibleMax;
    end = visibleMax;
  }

  if (end < visibleMin) {
    start = visibleMin;
    end = visibleMin;
  }

  if (start > end) {
    start = end;
  }

  return [start, end];
}

function getPatternWindow() {
  return clampPatternWindowToVisibleRange(state.selectedPattern);
}

function isFretInPatternWindow(fret) {
  const [start, end] = getPatternWindow();
  return fret >= start && fret <= end;
}

function isPatternStartFret(fret) {
  const [start] = getPatternWindow();
  return fret === start;
}

function isPatternEndFret(fret) {
  const [, end] = getPatternWindow();
  return fret === end;
}

function updateControlVisibility() {
  elements.noteGroup.classList.toggle("hidden-group", state.viewMode !== "note");

  const showScaleControls = state.viewMode === "scale" || state.viewMode === "pattern";
  elements.keyGroup.classList.toggle("hidden-group", !showScaleControls);
  elements.scaleGroup.classList.toggle("hidden-group", !showScaleControls);

  elements.patternGroup.classList.toggle("hidden-group", state.viewMode !== "pattern");
}

function updatePatternMeta() {
  if (state.viewMode !== "pattern") {
    elements.positionRangeBadge.textContent = "전체";
    elements.positionRangeText.textContent = "현재는 전체 지판을 보고 있다.";
    elements.patternBarWrap.classList.remove("active");
    return;
  }

  const [start, end] = getPatternWindow();
  elements.positionRangeBadge.textContent = `${start}~${end}프렛`;
  elements.positionRangeText.textContent = `패턴 ${state.selectedPattern}은 현재 화면 기준 ${start}프렛부터 ${end}프렛까지 표시한다.`;
  elements.patternBarWrap.classList.add("active");
  elements.patternStartLabel.textContent = `${start}프렛`;
  elements.patternEndLabel.textContent = `${end}프렛`;

  const totalWidthPercent = state.fretCount === 0 ? 100 : (100 / state.fretCount);
  const left = start * totalWidthPercent;
  const width = Math.max((end - start + 1) * totalWidthPercent, totalWidthPercent);

  elements.patternBarFill.style.left = `${left}%`;
  elements.patternBarFill.style.width = `${Math.min(width, 100 - left)}%`;
}

function updateBoardText() {
  if (state.viewMode === "all") {
    elements.boardTitle.textContent = "전체 음 보기";
    elements.boardSubtitle.textContent = "기타 지판의 모든 음을 표시한다.";
    elements.patternInfo.textContent = "전체 지판 기준으로 표시 중";
    return;
  }

  if (state.viewMode === "note") {
    elements.boardTitle.textContent = `${state.selectedNote} 보기`;
    elements.boardSubtitle.textContent = `${state.selectedNote} 음만 기타 지판에 표시한다.`;
    elements.patternInfo.textContent = "선택한 음의 위치만 확인하는 모드";
    return;
  }

  if (state.viewMode === "scale") {
    const label = SCALE_LABELS[state.selectedScale];
    elements.boardTitle.textContent = `${state.selectedKey} ${label}`;
    elements.boardSubtitle.textContent = `${state.selectedKey} 키의 ${label} 스케일 전체를 표시한다.`;
    elements.patternInfo.textContent = "전체 지판에서 스케일 흐름을 확인하는 모드";
    return;
  }

  const label = SCALE_LABELS[state.selectedScale];
  const [start, end] = getPatternWindow();
  elements.boardTitle.textContent = `${state.selectedKey} ${label} 패턴 ${state.selectedPattern}`;
  elements.boardSubtitle.textContent = `${start}프렛부터 ${end}프렛까지의 포지션 패턴을 표시한다.`;
  elements.patternInfo.textContent = `패턴 ${state.selectedPattern} · ${start}~${end}프렛 포지션`;
}

function renderFretNumbers() {
  const { nutWidth, fretWidth } = getLayoutSizes();
  elements.fretNumbers.innerHTML = "";
  elements.fretNumbers.style.gridTemplateColumns =
    `${nutWidth}px repeat(${state.fretCount}, ${fretWidth}px)`;

  const openCell = document.createElement("div");
  openCell.className = "fret-number";
  openCell.textContent = "OPEN";

  if (state.viewMode === "pattern" && isFretInPatternWindow(0)) {
    openCell.classList.add("pattern-active");
  }

  if (state.viewMode === "pattern" && (isPatternStartFret(0) || isPatternEndFret(0))) {
    openCell.classList.add("pattern-edge");
  }

  elements.fretNumbers.appendChild(openCell);

  for (let fret = 1; fret <= state.fretCount; fret += 1) {
    const cell = document.createElement("div");
    cell.className = "fret-number";
    cell.textContent = String(fret);

    if (state.viewMode === "pattern" && isFretInPatternWindow(fret)) {
      cell.classList.add("pattern-active");
    }

    if (state.viewMode === "pattern" && (isPatternStartFret(fret) || isPatternEndFret(fret))) {
      cell.classList.add("pattern-edge");
    }

    elements.fretNumbers.appendChild(cell);
  }
}

function calculateBoardWidth() {
  const { nutWidth, fretWidth } = getLayoutSizes();
  return nutWidth + (state.fretCount * fretWidth);
}

function getFretCenterX(fret) {
  const { nutWidth, fretWidth } = getLayoutSizes();

  if (fret === 0) {
    return nutWidth / 2;
  }

  return nutWidth + (fret - 0.5) * fretWidth;
}

function renderInlays() {
  elements.inlays.innerHTML = "";
  elements.inlays.style.width = `${calculateBoardWidth()}px`;

  const singleInlayFrets = [3, 5, 7, 9, 15];
  const doubleInlayFrets = [12];

  singleInlayFrets.forEach(fret => {
    if (fret <= state.fretCount) {
      const dot = document.createElement("div");
      dot.className = "inlay-dot";
      dot.style.left = `${getFretCenterX(fret)}px`;
      elements.inlays.appendChild(dot);
    }
  });

  doubleInlayFrets.forEach(fret => {
    if (fret <= state.fretCount) {
      const dot = document.createElement("div");
      dot.className = "double-inlay";
      dot.style.left = `${getFretCenterX(fret)}px`;
      elements.inlays.appendChild(dot);
    }
  });
}

function shouldUseSmallText(note) {
  return note.includes("/");
}

function getDotClass(note, scaleNotes, rootNote, fret) {
  if (state.viewMode === "all") {
    return "all";
  }

  if (state.viewMode === "note") {
    return note === state.selectedNote ? "selected-note" : "hidden";
  }

  if (state.viewMode === "scale") {
    if (note === rootNote) {
      return "root-note";
    }

    if (scaleNotes.includes(note)) {
      return "scale-note";
    }

    return "hidden";
  }

  if (state.viewMode === "pattern") {
    if (!isFretInPatternWindow(fret)) {
      return "hidden";
    }

    if (note === rootNote) {
      return "root-note";
    }

    if (scaleNotes.includes(note)) {
      return "scale-note";
    }

    return "hidden";
  }

  return "hidden";
}

function renderFretboard() {
  const { nutWidth, fretWidth } = getLayoutSizes();

  elements.fretboard.innerHTML = "";
  elements.fretboard.style.width = `${calculateBoardWidth()}px`;

  const scaleNotes =
    state.viewMode === "scale" || state.viewMode === "pattern"
      ? buildScale(state.selectedKey, state.selectedScale)
      : [];

  const rootNote =
    state.viewMode === "scale" || state.viewMode === "pattern"
      ? state.selectedKey
      : null;

  TUNING.forEach((openNote, stringIndex) => {
    const row = document.createElement("div");
    row.className = "string-row";
    row.style.gridTemplateColumns = `${nutWidth}px repeat(${state.fretCount}, ${fretWidth}px)`;
    row.style.setProperty("--string-thickness", `${STRING_THICKNESS[stringIndex]}px`);

    for (let fret = 0; fret <= state.fretCount; fret += 1) {
      const cell = document.createElement("div");
      cell.className = "fret-cell";

      if (fret === 0) {
        cell.classList.add("open-position");
      }

      if (state.viewMode === "pattern" && isFretInPatternWindow(fret)) {
        cell.classList.add("pattern-window");
      }

      if (state.viewMode === "pattern" && (isPatternStartFret(fret) || isPatternEndFret(fret))) {
        cell.classList.add("pattern-edge");
      }

      const note = getNoteAtFret(openNote, fret);
      const dotClass = getDotClass(note, scaleNotes, rootNote, fret);

      const dot = document.createElement("div");
      dot.className = `note-dot ${dotClass}`;

      if (shouldUseSmallText(note)) {
        dot.classList.add("small-text");
      }

      dot.textContent = note;

      cell.appendChild(dot);
      row.appendChild(cell);
    }

    elements.fretboard.appendChild(row);
  });
}

function renderAll() {
  updateControlVisibility();
  updateBoardText();
  updatePatternMeta();
  renderFretNumbers();
  renderFretboard();
  renderInlays();
}

function resetState() {
  state.viewMode = "all";
  state.selectedNote = "C";
  state.selectedKey = "C";
  state.selectedScale = "major";
  state.selectedPattern = 1;
  state.fretCount = 12;

  elements.viewMode.value = state.viewMode;
  elements.noteSelect.value = state.selectedNote;
  elements.keySelect.value = state.selectedKey;
  elements.scaleSelect.value = state.selectedScale;
  elements.patternSelect.value = String(state.selectedPattern);
  elements.fretCount.value = String(state.fretCount);

  renderAll();
}

function bindEvents() {
  elements.viewMode.addEventListener("change", (event) => {
    state.viewMode = event.target.value;
    renderAll();
  });

  elements.noteSelect.addEventListener("change", (event) => {
    state.selectedNote = event.target.value;
    renderAll();
  });

  elements.keySelect.addEventListener("change", (event) => {
    state.selectedKey = event.target.value;
    renderAll();
  });

  elements.scaleSelect.addEventListener("change", (event) => {
    state.selectedScale = event.target.value;
    renderAll();
  });

  elements.patternSelect.addEventListener("change", (event) => {
    state.selectedPattern = Number(event.target.value);
    renderAll();
  });

  elements.fretCount.addEventListener("change", (event) => {
    state.fretCount = Number(event.target.value);
    renderAll();
  });

  elements.resetBtn.addEventListener("click", resetState);

  window.addEventListener("resize", () => {
    renderAll();
  });
}

function init() {
  createOptions(elements.noteSelect);
  createOptions(elements.keySelect);

  elements.noteSelect.value = state.selectedNote;
  elements.keySelect.value = state.selectedKey;
  elements.scaleSelect.value = state.selectedScale;
  elements.patternSelect.value = String(state.selectedPattern);
  elements.viewMode.value = state.viewMode;
  elements.fretCount.value = String(state.fretCount);

  bindEvents();
  renderAll();
}

init();