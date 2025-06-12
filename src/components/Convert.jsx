import React, { useState, useRef, useEffect } from 'react';

import { Renderer, RendererBackends, Stave, StaveNote, Voice, Formatter, Accidental, Beam, Articulation, } from 'vexflow';

import {
  parseNote,
  toMidi,
  fromMidi,
  formatNote
} from '../noteUtils.js';

function Convert() {

  const styles = {
    container: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 16rem)', // Adjust based on header/footer height
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    section: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'semibold',
      marginBottom: '0.5rem',
      color: '#1f2937'
    },
    subsectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 650,
      marginBotton: '0.5rem',
      color: 'rgba(0.5, 0.5, 0.5, 0.7)',
      display: 'flex'
    },
    noteTypeSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    expressionSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    notationArea: {
      minHeight: '150px',
      border: '3px solid #2563eb',
      borderRadius: '0.5rem',
      backgroundColor: '#f9fafb',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      transition: 'height 0.3s ease',
    },
    controlPanel: {
      border: '3px solid green',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '0.5rem',
    },
    controlRow: {
      display: 'flex',
      padding: '0.5rem',
      gap: '0.5rem',
      alignItems: 'center',
      justifyContent: 'center',
    },
    customizationRow: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start'
    },
    graphicInputRow: {
      border: '3px solid purple',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 2px rgab(0, 0, 0, 0.1)'
    },
    noteInput: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.5rem'
    },
    noteButtons: {
      display: 'flex',
      gap: '1rem',
      flex: 1,
      justifyContent: 'center',
      padding: '2rem 1rem',
    },
    noteButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      border: '3px solid black',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '1rem',
      transition: 'all 0.2s',
      minWidth: '3rem',
      minHeight: '3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    noteButtonActive: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    sideControls: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    sideButton: {
      minWidth: '3rem',
      minHeight: '3rem',
      fontSize: '1.2rem',
      fontWeight: 600,
      padding: '0.25rem',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      border: '3px solid black',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      transition: 'all 0.2s',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sideButtonActive: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    currentNoteDisplay: {
      padding: '1rem',
      backgroundColor: '#f0f9ff',
      border: '3px solid #0ea5e9',
      borderRadius: '0.5rem',
      color: '#0c4a6e',
      minHeight: '4rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addNoteButton: {
      backgroundColor: '#10b981',
      color: 'white',
      border: '2px solid rgba(64, 64, 64, 0.5)',
      padding: '1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '1rem',
      width: '32%',
    },
    smallButton: {
      padding: '0.25rem',
      fontSize: '1.875rem',
      height: '2rem',
      minWidth: '3rem',
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.25rem',
      flexWrap: 'wrap',
    },
    button: {
      padding: '0.5rem 1rem',
      backgroundColor: '#2563eb',
      color: 'white',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    buttonHover: {
      backgroundColor: '#1d4ed8',
    },
    secondaryButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    secondaryButtonHover: {
      backgroundColor: '#f3f4f6',
      borderColor: '#9ca3af',
    },
    input: {
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      width: '100%',
    },
    divider: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      margin: '1rem 0',
    },
    
  };

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const pianoContainer = useRef(null);
  const saxContainer = useRef(null);
  const noteContainer = useRef(null);

  const [containerHeight, setContainerHeight] = useState(150);
  const STAVE_HEIGHT = 120;
  const STAVE_MARGIN = 40;
  const NOTES_PER_STAVE = 10

  function renderNotes(container, noteString) {
    if (!container.current) return;

    try {
      const tokens = noteString.split(' ');
      const notes = tokens
        .filter(token => token.includes(','))
        .map(token => {
          const [notePart, extra] = token.split(',');
          const [duration, dot, accent, connected] = extra.split('/');

          const validDuration = duration.toLowerCase() || 'q';
          if (notePart.toLowerCase() === 'r/4') {
            const restNote = new StaveNote({ keys: ['r/4'], duration: validDuration + 'r' });
            restNote.setKeyLine(0, 3);
            return restNote;
          }

          const staveNote = new StaveNote({ keys: [notePart], duration: validDuration, dots: dot ? 1 : 0 });

          if (notePart.includes('#')) {
            staveNote.addModifier(new Accidental('#'), 0);
          } else if (notePart.includes('b')) {
            staveNote.addModifier(new Accidental('b'), 0);
          }
          
          if (accent !== '') {
            let articulationMap = {
              'a': Articulation.ACCENT,
              't': Articulation.TENUTO,
              's': Articulation.STACCATO
            };
            staveNote.addModifier(new Articulation(articulationMap[accent], 0));
          }
          
          // Store the connected flag as a property on the note for later beam processing
          staveNote.isConnected = connected === 'true';
          staveNote.setFlagStyle({
            strokeStyle: "transparent",
            fillStyle:   "transparent",
          });
          staveNote.durationType = validDuration;
          
          return staveNote;
        });
        
      console.log('Notes: ', notes);

      // MULTIPLE VOICES AND STAVES DEPENDING ON NOTES
      const numStaves = Math.max(1, Math.ceil(notes.length / NOTES_PER_STAVE));
      const totalHeight = (numStaves * STAVE_HEIGHT) + (2 * STAVE_MARGIN);
      setContainerHeight(totalHeight);

      container.current.innerHTML = '';
      const renderer = new Renderer(container.current, RendererBackends.SVG);
      const context = renderer.getContext();
      const width = container.current.clientWidth;
      renderer.resize(width-50, containerHeight);

      console.log('Width: ', width);

      for (let i = 0; i < numStaves; i++) {
        const staveNotes = notes.slice(i * NOTES_PER_STAVE, (i + 1) * NOTES_PER_STAVE);
        const voice = new Voice({
          num_beats: staveNotes.length,
          beat_value: notes.length,
        });
        voice.setStrict(false);
        voice.addTickables(staveNotes);

        const stave = new Stave(10, 40 + (i * 120), width - 70);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(context).draw();

        new Formatter().joinVoices([voice]).format([voice], width - 150);
        voice.draw(context, stave);
        
        // Process beams after drawing the notes
        processBeams(staveNotes, context);
      }
    } catch (err) {
      console.error('Error rendering: ', err);
    }
  }

  // Helper function to process beams for a set of notes
  function processBeams(notes, context) {
    if (!notes || notes.length < 2) return;
    
    // Find groups of consecutive notes that should be beamed together
    let currentGroup = [];
    let currentDuration = null;
    
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      
      // Skip rests and notes that can't be beamed (whole, half notes)
      if (note.duration.includes('r') || 
          note.duration === 'w' || 
          note.duration === 'h') {
        // If we have a current group, create a beam for it
        if (currentGroup.length >= 2) {
          new Beam(currentGroup).setContext(context).draw();
        }
        currentGroup = [];
        currentDuration = null;
        continue;
      }
      
      // If this note is connected and has the same duration type as the current group
      if (note.isConnected && (currentDuration === null || note.durationType === currentDuration)) {
        if (currentGroup.length === 0) {
          // Start a new group with this note
          currentGroup.push(note);
          currentDuration = note.durationType;
        } else {
          // Add to the current group
          currentGroup.push(note);
        }
      } else {
        // This note is not connected or has a different duration
        // If we have a current group, create a beam for it
        if (currentGroup.length >= 2) {
          new Beam(currentGroup).setContext(context).draw();
        }
        
        // Start a new group if this note is connected
        if (note.isConnected) {
          currentGroup = [note];
          currentDuration = note.durationType;
        } else {
          currentGroup = [];
          currentDuration = null;
        }
      }
    }
    
    // Create a beam for the last group if needed
    if (currentGroup.length >= 2) {
      new Beam(currentGroup).setContext(context).draw();
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      renderNotes(pianoContainer, inputText);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputText]);

  useEffect(() => {
      if (outputText) {
        renderNotes(saxContainer, outputText);
      }
  }, [outputText]);
  
  useEffect(() => {
    renderCurrent();
  })

  function onConvert() {
    try {
      const transposed = inputText
        .split(' ')
        .map(token => {
          if (!token.includes(',')) return token;
          const [notePart, extra] = token.split(',');
          if (notePart === 'r/4') {
            return token;
          } else {
            const pNote = parseNote(notePart);
            const pMidi = toMidi(pNote);
            const sMidi = pMidi + 9;
            const sNote = formatNote(fromMidi(sMidi));
            return `${sNote},${extra}`;
          }
        })
        .join(' ');

      setOutputText(transposed);
    } catch (err) {
      console.error('Error converting: ', err);
      setOutputText('Error in conversion. Check input format.');
    }
  }

  function renderCurrent() {
    noteContainer.current.innerHTML = '';
    const width = noteContainer.current.clientWidth;
    const height = 175;
    setCurNote(`${curPitch}${curAccidental}/${curOctave},${curDuration}/${curDot}/${curAccent}/${curConnect}`);

    try {
      const renderer = new Renderer(noteContainer.current, RendererBackends.SVG);
      renderer.resize(width, height);
      const context = renderer.getContext();

      const staveWidth = Math.min(60, width / 2);
      const stave = new Stave((width - staveWidth) / 2, 25, staveWidth);
      

      const notePart = `${curPitch}${curAccidental}/${curOctave}`;
      const validDuration = curDuration.toLowerCase() || 'q';
      

      let curStaveNote;
      if (notePart.toLowerCase() === 'r/4') {
        curStaveNote = new StaveNote({ keys: ['r/4'], duration: validDuration });
      } else {
        curStaveNote = new StaveNote({ keys: [notePart], duration: validDuration, dots: curDot ? 1 : 0 });
        if (curAccidental !== '') {
          curStaveNote.addModifier(new Accidental(curAccidental), 0);
        }

        if (curAccent !== '') {
          curStaveNote.addModifier(new Articulation(curAccent), 0);
        }
      }

      const voice = new Voice({
        num_beats: 1,
        beat_value: 4,
      });

      voice.setStrict(false);
      voice.addTickable(curStaveNote);

      new Formatter().joinVoices([voice]).format([voice], staveWidth - 50);

      stave.setContext(context).draw();
      voice.draw(context, stave);
    } catch (err) {
      console.log('Error rendering: ', err);
    } 
  };

  function addCurNote() {
    setInputText(inputText + '   ' + curNote);
    console.log("Notes: ", inputText);
  }

  function removePrevNote() {
    console.log("Removing note: ", inputText.split(' '))
    const notes = inputText.trim().split(/\s+/);
    if (notes.length > 0) {
      notes.pop(); // Remove the last note
      setInputText(notes.join('  '));
    }
  }

  function addRestNote() {
    setInputText(inputText + '   ' + `r/4,${curDuration}/${curDot}//`);
  }

  const NOTES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const NOTE_TYPES = [
    { symbol: '𝅘𝅥𝅯', value: '16' },
    { symbol: '♪', value: '8' },
    { symbol: '♩', value: 'q' },
    { symbol: '𝅗𝅥', value: 'h' },
    { symbol: '𝅝', value: 'w' },
  ];
  const EXPRESSIONS = [
    { symbol: '>', value: 'a' },
    { symbol: '-', value: 't' },
    { symbol: '·', value: 's' },
    { symbol: '⌒', value: 'slur' },
  ]
  const ACCIDENTALS = ['#', '♮', 'b'];
  const [curOctave, setCurOctave] = useState(4);          // octave number
  const [curAccidental, setCurAccidental] = useState('');  // 0 is natural, 1 is sharp, -1 is flat
  const [curAccent, setCurAccent] = useState('');         // 'a' is accent, 't' is tenuto, 's' is staccato
  const [curSlur, setCurSlur] = useState(false);          // True will add a slur until turned off
  const [curDuration, setCurDuration] = useState('q');    // '16' == 1/16, '8' == 1/8, 'q' == 1/4, 'h' == 1/2, 'w' == 1/1
  const [curDot, setCurDot] = useState(false);            // adds a dot or not
  const [curConnect, setCurConnect] = useState(false);    // connecting eight or sixteenth notes
  const [curPitch, setCurPitch] = useState('A');          // format is `{pitch+accidental}/{octave}/{duration}/{dot}/{accent}/{connected}
  const [curNote, setCurNote] = useState(`${curPitch}${curAccidental}/${curOctave},${curDuration}/${curDot}/${curAccent}/${curConnect}`);

  return (
    <main style={styles.container}>
      <div style={styles.mainContent}>
        {/* Piano Input Section */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Piano Input</h3>
          
          <div style={styles.controlPanel}>

            <div style={styles.graphicInputRow}>
              <div style={styles.noteInput}>
                <div style={styles.sideControls}>
                  <button style={styles.sideButton} onClick={() => setCurOctave(curOctave + 1)}>↑</button>
                  <button style={styles.sideButton}>{curOctave}</button>
                  <button style={styles.sideButton} onClick={() => setCurOctave(curOctave - 1)}>↓</button>
                </div>

                <div style={styles.noteButtons}>
                  {NOTES.map(note => (
                    <button
                      key={note}
                      style={{
                        ...styles.noteButton,
                        ...(curPitch === note ? styles.noteButtonActive : {})
                      }}
                      onClick={() => setCurPitch(note)}
                    >
                      {note}
                    </button>
                  ))}
                </div>

                <div style={styles.sideControls}>
                  {ACCIDENTALS.map(accident => (
                    <button
                      key={accident}
                      style={{
                        ...styles.sideButton,
                        ...(curAccidental === accident ? styles.sideButtonActive : {})
                      }}
                      onClick={() => setCurAccidental(accident === '#' ? '#' : accident === 'b' ? 'b' : '')}
                    >
                      {accident}
                    </button> 
                  ))}
                </div>
              </div>

              <div style={styles.controlRow}>
                <button style={styles.addNoteButton} onClick={() => addCurNote()}>
                  Add Current Note
                </button>
                <button style={{...styles.addNoteButton, backgroundColor: '#ef4444'}} onClick={() => removePrevNote()}>
                  Remove Previous Note
                </button>
                <button style={{...styles.addNoteButton, backgroundColor: '#696969'}} onClick={() => addRestNote()}>
                  Add Rest
                </button>
              </div>
              
              <div style={styles.customizationRow}>
                <div style={styles.noteTypeSection}>
                  <h3 style={styles.subsectionTitle}>Note Duration</h3>
                  <div style={styles.buttonGroup}>
                    {NOTE_TYPES.map(noteType => (
                      <button
                        style={{
                          ...styles.noteButton,
                          ...styles.smallButton,
                          ...(curDuration === noteType.value ? styles.noteButtonActive : {})
                        }}
                        onClick={() => setCurDuration(noteType.value)}
                      >
                        {noteType.symbol}
                      </button>
                    ))}
                    <button
                      style={{
                        ...styles.noteButton,
                        ...styles.smallButton,
                        ...(curConnect === true ? styles.noteButtonActive : {})
                      }}
                      onClick={() => setCurConnect(!curConnect)}
                    >
                      ♫
                    </button>
                    <button
                      style={{ 
                        ...styles.noteButton,
                        ...styles.smallButton,
                        ...(curDot === true ? styles.noteButtonActive : {})
                      }}
                      onClick={() => setCurDot(!curDot)}
                    >
                      .
                    </button>
                  </div>
                </div>
                
                <div style={styles.expressionSection}>
                  <h3 style={styles.subsectionTitle}>Expressions</h3>
                  <div style={styles.buttonGroup}>
                    {EXPRESSIONS.map(expression => (
                      <button
                        style={{
                          ...styles.noteButton,
                          ...styles.smallButton,
                          ...(curAccent === expression.value || (expression.value === 'slur' && curSlur) ? styles.noteButtonActive : {}),
                          ...{ fontWeight: 500 },
                        }}
                        onClick={() => {
                          if (expression.value === 'slur') {
                            setCurSlur(!curSlur);
                          } else {
                            setCurAccent(curAccent === expression.value ? '' : expression.value);
                          }
                        }}
                      >
                        {expression.symbol}
                      </button>
                    ))
                    }
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.notationArea} ref={noteContainer}></div>

            <div style={styles.controlRow}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={styles.input}
                placeholder="Enter notes: C/4,q D/4,q E/4,q"
              />
            </div>
            
            <div style={styles.controlRow}>
              <button 
                style={styles.secondaryButton}
                onClick={() => setInputText('C/4,q D/4,q E/4,q F/4,q')}
              >
                Reset Example
              </button>

              <button
                style={styles.secondaryButton}
                onClick={() => renderNotes(pianoContainer, inputText)}
              >
                Render input
              </button>

              <button 
                style={styles.secondaryButton}
                onClick={() => setInputText('')}
              >
                Clear
              </button>
            </div>
          </div>
          
          {/* Piano Notation */}
          <div style={styles.notationArea} ref={pianoContainer}></div>
        </section>
        
        {/* Conversion Controls */}
        <section style={{...styles.section, margin: 'auto', flex: '0 0 auto' }}>
          <div style={{...styles.controlPanel, flex: '1', justifyContent: 'center'}}>
            <button 
              style={{...styles.button, padding: '1rem'}}
              onClick={onConvert}
            >
              Convert to Alto Sax →
            </button>
          </div>
        </section>
        
        {/* Alto Sax Output Section */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Alto Saxophone Output</h3>
          
          {/* Sax Notation */}
          <div style={styles.notationArea} ref={saxContainer}></div>
          
          <div style={styles.controlPanel}>
            <div style={styles.controlRow}>
              <textarea 
                style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                placeholder="Converted notes will appear here"
              />
            </div>
            <div style={styles.controlRow}>
              <button 
                style={styles.secondaryButton}
                onClick={() => navigator.clipboard.writeText(outputText)}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Convert;
