export type BurnoutLevel = 'Low' | 'Medium' | 'High'

export interface PredictInput {
  Age: number
  Gender: 'Male' | 'Female'
  Study_Hours: number
  Class_Attendance: number
  Tuition: 'Yes' | 'No'
  Exam_Frequency: number
  Assignment_Load: number
  Sleep_Hours: number
  Physical_Exercise: 'Yes' | 'No'
  Social_Media_Use: number
  Screen_Time: number
  Family_Income_Level: 'Low' | 'Medium' | 'High'
  Peer_Pressure: number
  Family_Support: number
  Anxiety_Level: number
  University_Type: string
}

export interface PredictResponse {
  prediction: BurnoutLevel
  confidence: number
  probabilities: Record<BurnoutLevel, number>
}

export interface PredictionRecord {
  id: string
  user_id: string
  prediction: BurnoutLevel
  confidence: number
  probabilities: Record<BurnoutLevel, number>
  input_data: PredictInput
  created_at: string
}