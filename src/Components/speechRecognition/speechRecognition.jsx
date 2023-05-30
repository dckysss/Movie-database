import React, { useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './speechRecognition.css'
import microphone from "../../Assets/microphone.svg"

const SpeechToText = ({ setSearchQuery }) => {

    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    
    useEffect(() => {
        const updateSearchQuery = () => {
          setSearchQuery(transcript);  
        };
        updateSearchQuery();
    }, [transcript, setSearchQuery]);

    const startListening = () => {
      clearTimeout()
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-ID' });

      setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 6000);
    };

    if(!browserSupportsSpeechRecognition) {
        return null
    }

    return(
      <div> 
        <button onClick={startListening}><img src={microphone} alt='speech' /></button>
      </div>  
    )
}

export default SpeechToText;