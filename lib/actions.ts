"use server";
// Define your server actions here
import { revalidatePath } from "next/cache";
import {
  insertTopic,
  insertQuestion,
  incrementVotes,
  insertAnswer,
  markAsAccepted,
} from "./data";
import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";

export async function addTopic(data: FormData) {
  let topic;
  try {
    topic = await insertTopic({
      title: data.get("title") as string,
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add topic.");
  } finally {
    revalidatePath("/ui/topics/[id]", "page");
    topic && redirect(`/ui/topics/${topic.id}`);
  }
}

export async function addQuestion(question: FormData) {
  try {
    insertQuestion({
      title: question.get("title") as string,
      topic_id: question.get("topic_id") as string,
      votes: 0,
    });
    revalidatePath("/ui/topics/[id]", "page");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add question.");
  }
}

export async function addVote(data: FormData) {
  try {
    incrementVotes(data.get("id") as string);
    revalidatePath("/ui/topics/[id]", "page");
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to add vote.");
  }
}

export async function addAnswer(formData: FormData) {
  const questionId = formData.get("question_id") as string;
  const answerResponse = formData.get("answer") as string;

  if (!questionId || !answerResponse) {
    throw new Error("Question ID and an actual response are required.");
  }

  try {
    await insertAnswer(questionId, answerResponse);
    revalidatePath(`/ui/questions/${questionId}`);
  } catch (error) {
    console.error("Error with database:", error);
    throw new Error("Failed to add answer.");
  }
}

export async function setAcceptedAnswer(formData: FormData) {
  const questionId = formData.get("question_id") as string;
  const answerId = formData.get("answer_id") as string;

  if (!questionId || !answerId) {
    throw new Error("Question ID and Answer ID both required.");
  }

  try {
    await markAsAccepted(questionId, answerId);
    revalidatePath(`/ui/questions/${questionId}`);
  } catch (error) {
    console.error("Error marking answer as accepted:", error);
    throw new Error("Failed to mark accepted answer.");
  }
}
