import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Report = ({ answers }) => {
  const overallScores = answers.map((answer, index) => ({
    question: `Q${index + 1}`,
    score: answer.scores.overall_score
  }));

  const averageScores = {
    accent: answers.reduce((acc, curr) => acc + curr.scores.accent.score, 0) / answers.length,
    clarity: answers.reduce((acc, curr) => acc + curr.scores.clarity_and_articulation.score, 0) / answers.length,
    confidence: answers.reduce((acc, curr) => acc + curr.scores.confidence_and_tone.score, 0) / answers.length,
    vocabulary: answers.reduce((acc, curr) => acc + curr.scores.vocabulary_and_language_use.score, 0) / answers.length
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Interview Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overallScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {answers.map((answer, index) => (
            <Card key={index} className="p-4">
              <h3 className="font-bold mb-2">Question {index + 1}</h3>
              <p className="text-sm mb-2">{answer.transcription}</p>
              <div className="space-y-2">
                <p><span className="font-semibold">Overall Score:</span> {answer.scores.overall_score.toFixed(2)}</p>
                <p><span className="font-semibold">Accent:</span> {answer.scores.accent.score.toFixed(2)}</p>
                <p><span className="font-semibold">Clarity:</span> {answer.scores.clarity_and_articulation.score.toFixed(2)}</p>
                <p><span className="font-semibold">Confidence:</span> {answer.scores.confidence_and_tone.score.toFixed(2)}</p>
                <p><span className="font-semibold">Vocabulary:</span> {answer.scores.vocabulary_and_language_use.score.toFixed(2)}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <h3 className="font-bold mb-4">Average Scores</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">Accent</p>
              <p>{averageScores.accent.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Clarity</p>
              <p>{averageScores.clarity.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Confidence</p>
              <p>{averageScores.confidence.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Vocabulary</p>
              <p>{averageScores.vocabulary.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};

export default Report;