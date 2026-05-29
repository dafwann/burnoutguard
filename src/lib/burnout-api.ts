export async function predictBurnout(data: any) {
  const res = await fetch(
    'https://dielnich-burnoutguard-api.hf.space/predict',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch prediction')
  }

  return res.json()
}