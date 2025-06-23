import type React from "react";
import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface SearchBarProps {
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  isListening: boolean;
  transcript: string;
  startStopListening: () => void;
  resetTranscript: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  location,
  setLocation,
  isListening,
  transcript,
  resetTranscript,
}) => {
  const wasListening = useRef(isListening);

  useEffect(() => {
    if (wasListening.current && !isListening && transcript) {
      setLocation((prev) => {
        const newLocation = prev + (prev && transcript ? " " : "") + transcript;
        resetTranscript();
        return newLocation;
      });
    }
    wasListening.current = isListening;
  }, [isListening, transcript, setLocation, resetTranscript]);

  const inputValue = isListening
    ? location + (transcript ? " " + transcript : "")
    : location;

  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MapPin className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Nhập địa điểm..."
        value={inputValue} 
        onChange={(e) => setLocation(e.target.value)}
        className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>
  );
};

export default SearchBar;