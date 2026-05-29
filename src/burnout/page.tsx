'use client'

import { useState } from 'react'
import { predictBurnout } from '@/lib/burnout-api'

export default function BurnoutPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function handlePredict() {
    setLoading(true)

    try {
      const data = await predictBurnout({
        Age: 24,
        Gender: 'Male',
        Study_Hours: 9,
        Class_Attendance: 71,
        Tuition: 'No',
        Exam_Frequency: 7,
        Assignment_Load: 4,
        Sleep_Hours: 6,
        Physical_Exercise: 'Yes',
        Social_Media_Use: 6,
        Screen_Time: 9,
        Family_Income_Level: 'Low',
        Peer_Pressure: 6,
        Family_Support: 3,
        Anxiety_Level: 5,
        University_Type: 'National University',
      })

      setResult(data)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={handlePredict}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {loading ? 'Predicting...' : 'Predict Burnout'}
      </button>

      {result && (
        <div className="mt-4">
          <p>Prediction: {result.prediction}</p>
          <p>
            Confidence: {(result.confidence * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  )
}