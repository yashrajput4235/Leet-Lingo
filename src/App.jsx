import React, { useState } from 'react';
import UserForm from './components/UserForm/UserForm';
import Interview from './components/Interview/Interview';
import Report from './components/Report/Report';

const App = () => {
  const [stage, setStage] = useState('form');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

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
      });
      const data = await response.json();
      setQuestions(data.questions);
      setStage('interview');
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleInterviewComplete = (results) => {
    setAnswers(results);
    setStage('report');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {stage === 'form' && <UserForm onSubmit={handleFormSubmit} />}
        {stage === 'interview' && (
          <Interview
            questions={questions}
            onComplete={handleInterviewComplete}
          />
        )}
        {stage === 'report' && <Report answers={answers} />}
      </div>
    </div>
  );
};

export default App;