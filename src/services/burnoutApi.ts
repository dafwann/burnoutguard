import axios from 'axios'
import type { PredictInput, PredictResponse } from '@/types/burnout'

const apiClient = axios.create({
  baseURL: process.env.BURNOUT_API_URL,
  timeout: 30_000, // HuggingFace Spaces can cold-start
  headers: { 'Content-Type': 'application/json' },
})

export async function predictBurnout(input: PredictInput): Promise<PredictResponse> {
  const { data } = await apiClient.post<PredictResponse>('/predict', input)
  return data
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiClient.get('/')
    return true
  } catch {
    return false
  }
}