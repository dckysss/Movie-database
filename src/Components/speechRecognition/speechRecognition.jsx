import React, { useEffect, useState, useRef } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './speechRecognition.css'
import microphone from "../../Assets/microphone.svg"
import voiceBeepOn from "./voicebeep.mp3"
import voiceBeepOff from "./voicebeepoff.mp3"


const SpeechToText = ({ setSearchQuery, onListeningChange }) => {

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const timeoutRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  let beepOn = new Audio(voiceBeepOn)
  let beepOff = new Audio(voiceBeepOff)

  useEffect(() => {
    const updateSearchQuery = () => {
      setSearchQuery(transcript);
    };
    updateSearchQuery();
  }, [transcript, setSearchQuery]);

  const startListening = () => {
    
    if (isListening) {
      beepOff.play()
      SpeechRecognition.stopListening();
      setIsListening(false);
      onListeningChange(false);
    } else {
      beepOn.play()
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-ID' });

      clearTimeout(timeoutRef.current);
      setIsListening(true);
      onListeningChange(true);
      timeoutRef.current = setTimeout(() => {
        SpeechRecognition.stopListening();
        setIsListening(false);
        onListeningChange(false);
      }, 6000);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return null
  }

  return (
    <div className="speech-container">
      <button onClick={startListening} className='speech-btn'>
        <img
          src={microphone}
          alt='speech'
          width="100%"
          height="100%"
          className={isListening ? 'listening' : ''}
        />
      </button>
    </div>
  )
}

export default SpeechToText;