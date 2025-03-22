import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { email, answers } = await request.json();

  const questionnaire = await prisma.aiQuestionnaire.create({
    data: {
      email,
      answers: JSON.stringify(answers),
    },
  });

  return NextResponse.json(questionnaire.id);
}
