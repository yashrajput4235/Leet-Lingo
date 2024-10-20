import React, { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Loader2, Mic, MicOff } from 'lucide-react'

export default function Interview({ questions, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const mediaRecorder = useRef(null)
  const audioChunks = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        setLoading(true)
        
        const formData = new FormData()
        formData.append('audio', audioBlob)

        try {
          const response = await fetch('http://127.0.0.1:8080/score', {
            method: 'POST',
            body: formData,
          })
          const result = await response.json()
          setAnswers([...answers, result])
          
          if (currentQuestionIndex === questions.length - 1) {
            onComplete([...answers, result])
          } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
          }
        } catch (error) {
          console.error('Error scoring answer:', error)
        }
        
        setLoading(false)
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
      setIsRecording(false)
    }
  }

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardTitle className="text-2xl font-bold">Interview Session</CardTitle>
        <p className="text-sm opacity-80">Answer the questions to the best of your ability</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h2>
          <span className="text-sm text-gray-500">{currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="text-lg font-medium">{questions[currentQuestionIndex]}</p>
        <div className="flex justify-center">
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-sm font-medium">Processing your answer...</span>
            </div>
          ) : (
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center space-x-2 px-6 py-3 text-lg font-semibold transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-5 h-5" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Start Recording</span>
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}