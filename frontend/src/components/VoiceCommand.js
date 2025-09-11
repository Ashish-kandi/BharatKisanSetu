import  { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function VoiceCommand() {
  const language = 'en-IN'; // Fixed language

  // Navigation and logout commands only
  const commands = [
    {
      command: [
        'go to home', 'go back home', 'back to home', 'landing page',
        'తిరిగి హోమ్‌కు వెళ్ళు', 'హోమ్ పేజీకి వెళ్ళు', 'హోమ్', 'home', 'main page',
      ],
      callback: () => window.location.assign('/'),
    },
    {
      command: [
        'go to farmer login', 'open farmer login', 'farmer login',
        'రైతు లాగిన్', 'రైతు లాగిన్ తెరువు', 'రైతుల లాగిన్',
      ],
      callback: () => window.location.assign('/farmer-login'),
    },
    {
      command: [
        'go to consumer login', 'open consumer login', 'consumer login',
        'వినియోగదారుల లాగిన్', 'వినియోగదారులు లాగిన్', 'కన్స్యూమర్ లాగిన్',
      ],
      callback: () => window.location.assign('/consumer-login'),
    },
    {
      command: [
        'go to dashboard', 'open dashboard', 'farmer dashboard',
        'డాష్‌బోర్డ్‌కు వెళ్ళు', 'రైతు డాష్‌బోర్డ్ తెరువు',
      ],
      callback: () => window.location.assign('/farmer-dashboard'),
    },
    {
      command: [
        'show products', 'view products', 'go to products', 'open products',
        'ఉత్పత్తులు చూపించు', 'ఉత్పత్తులు',
      ],
      callback: () => window.location.assign('/products'),
    },
    {
      command: [
        'logout', 'log out', 'లాగ్ అవుట్', 'లాగ్ అవుట్ చేయి',
      ],
      callback: () => {
        localStorage.clear();
        window.location.assign('/');
      },
    },
  ];

  const { browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }
    SpeechRecognition.startListening({
      continuous: true,
      language,
    });
    return () => SpeechRecognition.stopListening();
  }, [browserSupportsSpeechRecognition, language]);

  // No status display rendered
  return null;
}

export default VoiceCommand;
