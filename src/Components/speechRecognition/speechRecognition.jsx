import React, { useEffect, useState, useRef } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './speechRecognition.css'
import microphone from "../../Assets/microphone.svg"

const SpeechToText = ({ setSearchQuery, onListeningChange }) => {

    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const timeoutRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    
    useEffect(() => {
        const updateSearchQuery = () => {
          setSearchQuery(transcript);  
        };
        updateSearchQuery();
    }, [transcript, setSearchQuery]);

    const startListening = () => {
      if(isListening) {
        SpeechRecognition.stopListening();
        setIsListening(false);
        onListeningChange(false);
      } else {
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

    if(!browserSupportsSpeechRecognition) {
        return null
    }

    return(
      <div className="speech-container"> 
        <button onClick={startListening}>
          <img 
            src={microphone} 
            alt='speech' 
            className={isListening ? 'listening' : ''}
          />
        </button>
      </div>  
    )
}

export default SpeechToText;