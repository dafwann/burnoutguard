import { NextRequest, NextResponse } from "next/server";

const HF_API = "https://dielnich-burnoutguard-api.hf.space/predict";

const DEFAULT_VALUES = {
  Gender: "Male",
  Tuition: "No",
  Physical_Exercise: "No",
  Family_Income_Level: "Low",
  University_Type: "National University",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const requiredFields = [
      "Age",
      "Study_Hours",
      "Class_Attendance",
      "Exam_Frequency",
      "Assignment_Load",
      "Sleep_Hours",
      "Social_Media_Use",
      "Screen_Time",
      "Peer_Pressure",
      "Family_Support",
      "Anxiety_Level",
    ];

    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        return NextResponse.json(
          { error: `${field} wajib diisi` },
          { status: 400 }
        );
      }
    }

    const hfPayload = {
      ...body,
      ...DEFAULT_VALUES,
    };

    const res = await fetch(HF_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hfPayload),
    });

    if (!res.ok) {
      const errorText = await res.text();

      return NextResponse.json(
        {
          error: "Prediction service error",
          status: res.status,
          detail: errorText,
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (err) {
    console.error("[/api/predict]", err);

    return NextResponse.json(
      {
        error:
          "Gagal terhubung ke server prediksi. Coba beberapa saat lagi.",
      },
      {
        status: 500,
      }
    );
  }
}