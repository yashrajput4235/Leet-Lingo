import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from '../ui/badge'

export default function Report({ answers }) {
  const overallScores = answers.map((answer, index) => ({
    question: `Q${index + 1}`,
    score: answer.scores.overall_score
  }))

  const averageScores = {
    accent: answers.reduce((acc, curr) => acc + curr.scores.accent.score, 0) / answers.length,
    clarity: answers.reduce((acc, curr) => acc + curr.scores.clarity_and_articulation.score, 0) / answers.length,
    confidence: answers.reduce((acc, curr) => acc + curr.scores.confidence_and_tone.score, 0) / answers.length,
    vocabulary: answers.reduce((acc, curr) => acc + curr.scores.vocabulary_and_language_use.score, 0) / answers.length
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-500'
    if (score >= 6) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardTitle className="text-3xl font-bold">Interview Report</CardTitle>
        <p className="text-sm opacity-80">Your performance analysis</p>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg">Your Scores</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(averageScores).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="font-semibold capitalize">{key}</p>
                    <Badge variant="outline" className={`mt-1 ${getScoreColor(value)}`}>
                      {value.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4">Overall Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overallScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {answers.map((answer, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <p className="text-sm italic">{answer.transcription}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold">Overall Score:</span>
                    <Badge variant="outline" className={`ml-2 ${getScoreColor(answer.scores.overall_score)}`}>
                      {answer.scores.overall_score.toFixed(2)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-semibold">Accent:</span>
                    <Badge variant="outline" className={`ml-2 ${getScoreColor(answer.scores.accent.score)}`}>
                      {answer.scores.accent.score.toFixed(2)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-semibold">Clarity:</span>
                    <Badge variant="outline" className={`ml-2 ${getScoreColor(answer.scores.clarity_and_articulation.score)}`}>
                      {answer.scores.clarity_and_articulation.score.toFixed(2)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-semibold">Confidence:</span>
                    <Badge variant="outline" className={`ml-2 ${getScoreColor(answer.scores.confidence_and_tone.score)}`}>
                      {answer.scores.confidence_and_tone.score.toFixed(2)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-semibold">Vocabulary:</span>
                    <Badge variant="outline" className={`ml-2 ${getScoreColor(answer.scores.vocabulary_and_language_use.score)}`}>
                      {answer.scores.vocabulary_and_language_use.score.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}