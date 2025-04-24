"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/cn";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "regenerator-runtime";

// Define OpenAI API response type
interface OpenAIChatResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

// Assume apiKey is a string (update based on your axiosInstance)
const apiKey: string = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ""; // Use env variable or config

function VoiceChat() {
  const { listening, transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [thinking, setThinking] = useState(false);
  const [aiText, setAiText] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function callGpt3API(message: string): Promise<string> {
    if (!message.trim()) return "";
    setThinking(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: message,
              },
            ],
            model: "gpt-3.5-turbo",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}`
        );
      }

      const data: OpenAIChatResponse = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      setThinking(false);
      return data.choices[0].message.content;
    } catch (err) {
      setThinking(false);
      setError(
        err instanceof Error ? err.message : "Failed to fetch AI response"
      );
      return "";
    }
  }

  useEffect(() => {
    if (!listening && transcript && !thinking) {
      callGpt3API(transcript).then((response) => {
        if (response) {
          const speechSynthesis = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.lang = "en-US";
          speechSynthesis.speak(utterance);
          setAiText(response);
        }
      });
    }
  }, [transcript, listening]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Sorry, your browser does not support speech recognition.</p>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Tabs defaultValue="chat">
        <TabsList className="w-full">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Voice Chat with TutorConnect
            </h2>
            <p>
              {listening
                ? "Go ahead, I'm listening..."
                : "Click the button and ask me anything"}
            </p>
            <button
              className={cn(
                "px-4 py-2 rounded-md",
                listening
                  ? "bg-red-500 text-white"
                  : "bg-primary text-primary-foreground",
                "hover:opacity-90 transition-opacity"
              )}
              onClick={() => {
                if (listening) {
                  SpeechRecognition.stopListening();
                } else {
                  SpeechRecognition.startListening({
                    continuous: false,
                    language: "en-US",
                  });
                }
              }}
              disabled={thinking}
              aria-label={listening ? "Stop listening" : "Start voice chat"}
            >
              {listening
                ? "Stop Listening"
                : "Ask me anything about TutorConnect"}
            </button>
            {transcript && (
              <div className="p-2 border rounded-md dark:border-gray-600">
                <strong>You said:</strong> {transcript}
              </div>
            )}
            {thinking && <div className="text-gray-500">Thinking...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {aiText && (
              <div className="p-2 border rounded-md dark:border-gray-600">
                <strong>AI Response:</strong> {aiText}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Chat History</h2>
            {aiText ? (
              <ul className="list-disc pl-5">
                <li>
                  <strong>You:</strong> {transcript}
                  <br />
                  <strong>AI:</strong> {aiText}
                </li>
              </ul>
            ) : (
              <p>No chat history yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default VoiceChat;
