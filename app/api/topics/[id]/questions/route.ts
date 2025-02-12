import { NextRequest, NextResponse } from "next/server";
import { fetchQuestions } from "@/lib/data";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id?: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Topic ID is required" },
        { status: 400 }
      );
    }

    const questions = await fetchQuestions(id);
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
