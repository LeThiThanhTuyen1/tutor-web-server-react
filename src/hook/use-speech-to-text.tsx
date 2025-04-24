import { useEffect, useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "regenerator-runtime";

// Options interface for customization
interface SpeechToTextOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  grammar?: string;
}

const useSpeechToText = (options: SpeechToTextOptions = {}) => {
  const {
    transcript,
    listening: isListening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  // Warn about unsupported grammar
  useEffect(() => {
    if (options.grammar) {
      console.warn(
        "Grammar is not fully supported by react-speech-recognition or most browsers."
      );
    }
  }, [options.grammar]);

  // Start listening with provided options
  const startListening = useCallback(() => {
    if (browserSupportsSpeechRecognition && !isListening) {
      resetTranscript(); // Clear previous transcript
      SpeechRecognition.startListening({
        continuous: options.continuous ?? false,
        interimResults: options.interimResults ?? true,
        language: options.lang ?? "en-US",
      });
    }
  }, [
    browserSupportsSpeechRecognition,
    isListening,
    options.continuous,
    options.interimResults,
    options.lang,
  ]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (browserSupportsSpeechRecognition && isListening) {
      SpeechRecognition.stopListening();
    }
  }, [browserSupportsSpeechRecognition, isListening]);

  // Check browser support
  if (!browserSupportsSpeechRecognition) {
    console.error("Speech recognition is not supported in this browser.");
  }

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
};

export default useSpeechToText;
