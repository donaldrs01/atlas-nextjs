import { sql } from "@vercel/postgres";
import { Question, Topic, User, Answer } from "./definitions";

export async function fetchUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchTopics() {
  try {
    const data = await sql<Topic>`SELECT * FROM topics`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics.");
  }
}

export async function fetchTopic(id: string) {
  try {
    const data = await sql<Topic>`SELECT * FROM topics WHERE id = ${id}`;
    return data.rows && data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics.");
  }
}

export async function fetchQuestions(id: string) {
  try {
    const data =
      await sql<Question>`SELECT * FROM questions WHERE topic_id = ${id} ORDER BY votes DESC`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch questions.");
  }
}

// Fetch a single question by its ID
export async function fetchQuestion(questionId: string) {
  try {
    const data = await sql<Question>`
      SELECT * FROM questions 
      WHERE id = ${questionId};
    `;
    return data.rows[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch question.");
  }
}

export async function fetchAnswers(questionId: string) {
  try {
    const data = await sql<Answer>`
      SELECT * FROM answers
      WHERE question_id = ${questionId}
      ORDER BY is_accepted DESC, id ASC;
    `;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch answers.");
  }
}

export async function insertQuestion(
  question: Pick<Question, "title" | "topic_id" | "votes">
) {
  try {
    const data =
      await sql<Question>`INSERT INTO questions (title, topic_id, votes) VALUES (${question.title}, ${question.topic_id}, ${question.votes})`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add question.");
  }
}

export async function insertTopic(topic: Pick<Topic, "title">) {
  try {
    const data =
      await sql<Topic>`INSERT INTO topics (title) VALUES (${topic.title}) RETURNING id;`;
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add topic.");
  }
}

export async function insertAnswer(questionId: string, answer: string) {
  try {
    const data = await sql`
      INSERT INTO answers (question_id, answer)
      VALUES (${questionId}, ${answer})
      RETURNING *;
    `;
    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add answer.");
  }
}

export async function incrementVotes(id: string) {
  try {
    const data =
      await sql<Question>`UPDATE questions SET votes = votes + 1 WHERE id = ${id}`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to increment votes.");
  }
}

export async function markAsAccepted(questionId: string, answerId: string) {
  try {
    // Set accepted answer
    await sql`
      UPDATE questions
      SET answer_id = ${answerId}
      WHERE id = ${questionId};
    `;
    // Modify boolean state to mark selected answer as accepted
    await sql`
      UPDATE answers
      SET is_accepted = TRUE
      WHERE id = ${answerId};
    `;
    // Unmark all other answers as not accepted
    await sql`
      UPDATE answers
      SET is_accepted = FALSE
      WHERE question_id = ${questionId} and id != ${answerId};
    `;
  } catch (error) {
    console.error("DB error:", error);
    throw new Error("Error when marking accepted answer");
  }
}
