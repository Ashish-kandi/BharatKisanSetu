import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function TestMic() {
  const { transcript, listening } = useSpeechRecognition();

  return (
    <div>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <p>Listening: {listening ? 'on' : 'off'}</p>
      <p>Transcript: {transcript}</p>
    </div>
  );
}

export default TestMic;
