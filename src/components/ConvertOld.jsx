import React, { useState, useRef, useEffect } from 'react';
import { Renderer, RendererBackends, Stave, StaveNote, Voice, Formatter } from 'vexflow';
import {
  parseNote,
  toMidi,
  fromMidi,
  formatNote
} from '../noteUtils.js';

function Convert() {
  console.log("Component rendering");
  
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
    },
    notationArea: {
      height: '300px',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      backgroundColor: '#f9fafb',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    controlPanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '0.375rem',
    },
    controlRow: {
      display: 'flex',
      gap: '0.5rem',
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

  const [inputText, setInputText] = useState('C/4,q D/4,q E/4,q F/4,q');
  const [outputText, setOutputText] = useState('');
  
  const pianoContainer = useRef(null);
  const saxContainer = useRef(null);

  // Improved render function with fixes for multiple notes
  function renderNotes(container, noteString) {
    if (!container.current) return;
    
    // Clear previous content
    container.current.innerHTML = '';
    
    // Create renderer
    const renderer = new Renderer(container.current, RendererBackends.SVG);
    const context = renderer.getContext();
    const width = container.current.clientWidth;
    
    // Create stave
    const stave = new Stave(10, 10, width - 20);
    stave.addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();
    
    try {
      // Parse and create notes with error handling
      const tokens = noteString.split(' ');
      const notes = tokens
        .filter(token => token.includes(','))
        .map(token => {
          const [notePart, duration] = token.split(',');
          
          // Validate and default to quarter note if empty
          const validDuration = duration || 'q';
          return new StaveNote({ 
            keys: [notePart], 
            duration: validDuration 
          });
        });
      
      // Only render if we have valid notes
      if (notes.length > 0) {
        // Create voice with flexible beat count
        const voice = new Voice({ 
          num_beats: notes.length, 
          beat_value: 4,
          resolution: Renderer.RESOLUTION
        }).setMode(Voice.Mode.SOFT);
        
        voice.addTickables(notes);
        
        // Format and draw
        new Formatter().joinVoices([voice]).format([voice], width - 40);
        voice.draw(context, stave);
      }
    } catch (error) {
      console.error('Rendering error:', error);
    }
  }

  // Render piano input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      renderNotes(pianoContainer, inputText);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputText]);

  // Render sax output
  useEffect(() => {
    if (outputText) {
      renderNotes(saxContainer, outputText);
    }
  }, [outputText]);

  // Improved conversion function
  function onConvert() {
    try {
      const transposed = inputText
        .split(' ')
        .map(token => {
          if (!token.includes(',')) return token;
          
          const [notePart, duration] = token.split(',');
          const note = parseNote(notePart);
          const midi0 = toMidi(note);
          const midi1 = midi0 + 9; // Transpose up 9 semitones
          const newNote = formatNote(fromMidi(midi1));
          return `${newNote},${duration}`;
        })
        .join(' ');
      
      setOutputText(transposed);
    } catch (error) {
      console.error('Conversion error:', error);
      setOutputText('Error in conversion. Check input format.');
    }
  }

  return (
    <main style={styles.container}>
      <div style={styles.mainContent}>
        {/* Piano Input Section */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Piano Input</h3>
          
          <div style={styles.controlPanel}>
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
