// src/pages/VoiceToText.js

import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone } from 'react-icons/fa';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function VoiceToText() {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition. Try using Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const speech = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += speech + ' ';
        } else {
          interim += speech;
        }
      }

      setTranscript(prev => prev + final);
      setInterimTranscript(interim);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleSpeak = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Tell me about you</h1>
      <div style={styles.micCircle} onClick={handleSpeak}>
        <FaMicrophone size={60} color={listening ? 'red' : 'black'} />
      </div>
      <p style={styles.instruction}>{listening ? 'Listening...' : 'Click to speak'}</p>

      <div style={styles.transcriptBox}>
        <p><strong>You said:</strong> {transcript}</p>
        {interimTranscript && (
          <p style={{ color: '#555', fontStyle: 'italic' }}>{interimTranscript}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    padding: '50px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: 30,
  },
  micCircle: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    border: '2px solid black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 20,
  },
  transcriptBox: {
    maxWidth: 600,
    backgroundColor: '#e2e8f0',
    padding: 20,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 100,
    width: '80%',
  },
};

export default VoiceToText;
