import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { predictBurnout } from '@/services/burnoutApi'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const predictSchema = z.object({
  Age: z.number().int().min(16).max(60),
  Gender: z.enum(['Male', 'Female']),
  Study_Hours: z.number().min(0).max(24),
  Class_Attendance: z.number().min(0).max(100),
  Tuition: z.enum(['Yes', 'No']),
  Exam_Frequency: z.number().min(0).max(10),
  Assignment_Load: z.number().min(0).max(10),
  Sleep_Hours: z.number().min(0).max(24),
  Physical_Exercise: z.enum(['Yes', 'No']),
  Social_Media_Use: z.number().min(0).max(12),
  Screen_Time: z.number().min(0).max(24),
  Family_Income_Level: z.enum(['Low', 'Medium', 'High']),
  Peer_Pressure: z.number().min(0).max(10),
  Family_Support: z.number().min(0).max(10),
  Anxiety_Level: z.number().min(0).max(10),
  University_Type: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Validate input
    const body = await req.json()
    const parsed = predictSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // 3. Call AI API
    const result = await predictBurnout(parsed.data)

    // 4. Store in database
    await supabase.from('prediction_history').insert({
      user_id: user.id,
      prediction: result.prediction,
      confidence: result.confidence,
      probabilities: result.probabilities,
      input_data: parsed.data,
    })

    // 5. Return result
    return NextResponse.json(result)

  } catch (error) {
    console.error('[/api/predict]', error)
    return NextResponse.json(
      { error: 'Prediction failed. Please try again.' },
      { status: 500 }
    )
  }
}