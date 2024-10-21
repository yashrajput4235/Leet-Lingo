import React, { useState } from 'react'
import UserForm from './components/UserForm/UserForm'
import Interview from './components/Interview/Interview'
import Report from './components/Report/Report'

export default function App() {
  const [stage, setStage] = useState('form')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch('http://127.0.0.1:8080/get_questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: formData.company,
          role: formData.role,
        }),
      })
      const data = await response.json()
      setQuestions(data.questions)
      setStage('interview')
      showNotification("Your personalized interview questions have been prepared.", "success")
    } catch (error) {
      console.error('Error fetching questions:', error)
      showNotification("Failed to fetch interview questions. Please try again later.", "error")
    }
  }

  const handleInterviewComplete = (results) => {
    setAnswers(results)
    setStage('report')
    showNotification("Your interview responses have been analyzed.", "success")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-400 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">LeetLingo Interview Prep</h1>
        {stage === 'form' && <UserForm onSubmit={handleFormSubmit} />}
        {stage === 'interview' && (
          <Interview
            questions={questions}
            onComplete={handleInterviewComplete}
          />
        )}
        {stage === 'report' && <Report answers={answers} />}
      </div>
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
    </div>
  )
}