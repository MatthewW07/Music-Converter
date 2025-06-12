import React, { useState, useRef, useEffect } from 'react';
import { Renderer, RendererBackends, Stave, StaveNote, Voice, Formatter } from 'vexflow';
import {
  parseNote,
  toMidi,
  fromMidi,
  formatNote,
} from '../noteUtils.js';

function Convert2() {
  const styles = {
    container: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 16rem)',
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
    mainContentDesktop: {
      '@media (min-width: 768px)': {
        flexDirection: 'row',
      },
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
    input: {
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      width: '100%',
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
  };

  const applyMediaStyles = (baseStyle, mediaStyle) => {
    if (window.innerWidth >= 768) return { ...baseStyle, ...mediaStyle };
    return baseStyle;
  };

  // State to hold user input and transposed output
  const DEFAULT_TEMPLATE = 'C/4,q D/4,q E/4,q F/4,q';
  const [inputText, setInputText] = useState(DEFAULT_TEMPLATE);
  const [outputText, setOutputText] = useState('');

  // Refs for rendering
  const pianoRef = useRef(null);
  const saxRef = useRef(null);

  // On mount, render a constant example in the pianoRef
  useEffect(() => {
    if (!pianoRef.current) return;
    pianoRef.current.innerHTML = ''; // clear

    const renderer = new Renderer(pianoRef.current, RendererBackends.SVG);
    const context = renderer.getContext();

    const width = pianoRef.current.clientWidth;
    const stave = new Stave(10, 10, width - 20);
    stave.addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();

    const notes = [
      new StaveNote({ keys: ['c/4'], duration: 'q' }),
      new StaveNote({ keys: ['d/4'], duration: 'q' }),
      new StaveNote({ keys: ['e/4'], duration: 'q' }),
      new StaveNote({ keys: ['f/4'], duration: 'q' }),
    ];

    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    new Formatter().joinVoices([voice]).format([voice], width - 40);
    voice.draw(context, stave);
  }, []);

  function onConvert() {
    const transposed = inputText.replace(/([A-G][#b]?\/[0-9])/g, (match) => {
      const note = parseNote(match);
      const midi0 = toMidi(note);
      const midi1 = midi0 + 9;
      return formatNote(fromMidi(midi1));
    });
    setOutputText(transposed);

    // Render transposed constant example into saxRef
    if (saxRef.current) {
      saxRef.current.innerHTML = '';
      const renderer = new Renderer(saxRef.current, RendererBackends.SVG);
      const context = renderer.getContext();
      const width = saxRef.current.clientWidth;
      const stave = new Stave(10, 10, width - 20);
      stave.addClef('treble').addTimeSignature('4/4');
      stave.setContext(context).draw();

      // For demonstration, repeat same notes
      const notes = [
        new StaveNote({ keys: ['c/4'], duration: 'q' }),
        new StaveNote({ keys: ['d/4'], duration: 'q' }),
        new StaveNote({ keys: ['e/4'], duration: 'q' }),
        new StaveNote({ keys: ['f/4'], duration: 'q' }),
      ];
      const voice = new Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables(notes);
      new Formatter().joinVoices([voice]).format([voice], width - 40);
      voice.draw(context, stave);
    }
  }

  return (
    <main style={styles.container}>
      <h2 style={styles.title}>Piano to Alto Sax Converter</h2>
      <div style={applyMediaStyles(styles.mainContent, styles.mainContentDesktop)}>
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Piano Input (Constant Example)</h3>
          <div style={styles.notationArea} ref={pianoRef}></div>
        </section>
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Alto Sax Output (Constant Example)</h3>
          <div style={styles.notationArea} ref={saxRef}></div>
          <button onClick={onConvert} style={styles.button}>
            Render Output
          </button>
          <textarea
            value={outputText}
            readOnly
            style={{ ...styles.input, marginTop: '1rem' }}
          />
        </section>
      </div>
    </main>
  );
}

export default Convert2;


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
    mainContentDesktop: {
      '@media (min-width: 768px)': {
        flexDirection: 'row',
      }
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