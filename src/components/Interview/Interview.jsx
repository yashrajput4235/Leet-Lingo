import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, Mic, MicOff } from 'lucide-react';

const Interview = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setLoading(true);
        
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
          const response = await fetch('http://127.0.0.1:8080/score', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          setAnswers([...answers, result]);
          
          if (currentQuestionIndex === questions.length - 1) {
            onComplete([...answers, result]);
          } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          }
        } catch (error) {
          console.error('Error scoring answer:', error);
        }
        
        setLoading(false);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg">{questions[currentQuestionIndex]}</p>
        <div className="flex justify-center">
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center space-x-2 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Start Recording</span>
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Interview;