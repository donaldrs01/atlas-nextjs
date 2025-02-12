import bcrypt from "bcryptjs";
import { db } from "@vercel/postgres";
import { users, topics, questions } from "../../lib/placeholder-data";
import { revalidatePath } from "next/cache";

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  await client.sql`DELETE FROM users`;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedTopics() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS topics (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL
    );
  `;

  await client.sql`DELETE FROM topics`;

  const insertedTopics = await Promise.all(
    topics.map(
      (topic) => client.sql`
        INSERT INTO topics (id, title)
        VALUES (${topic.id}, ${topic.title})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedTopics;
}

async function seedQuestions() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS questions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      topic_id UUID NOT NULL,
      votes INT NOT NULL,
      answer_id UUID
    );
  `;

  await client.sql`DELETE FROM questions`;

  const insertedQuestions = await Promise.all(
    questions.map(
      (question) => client.sql`
        INSERT INTO questions (id, title, topic_id, votes)
        VALUES (${question.id}, ${question.title}, ${question.topic}, ${question.votes})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedQuestions;
}

async function seedAnswers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS answers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      answer VARCHAR(255) NOT NULL,
      question_id UUID NOT NULL
    );
  `;

  await client.sql`DELETE FROM answers`;

  const answers = [
    {
      id: "0b93d8dc-6e43-49e3-b59f-b67531247612",
      answer:
        "It's a new feature in TypeScript that makes it easier to write type-safe code.",
      question_id: "0b93d8dc-6e43-49e3-b59f-b67531247612",
    },
  ];

  const insertedAnswers = await Promise.all(
    answers.map(
      (answer) => client.sql`
        INSERT INTO answers (id, answer, question_id)
        VALUES (${answer.id}, ${answer.answer}, ${answer.question_id})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedAnswers;
}

async function clearData() {
  await client.sql`DROP TABLE IF EXISTS questions`;
  await client.sql`DROP TABLE IF EXISTS topics`;
  await client.sql`DROP TABLE IF EXISTS users`;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await clearData();
    await seedUsers();
    await seedTopics();
    await seedQuestions();
    await seedAnswers();
    await client.sql`COMMIT`;

    revalidatePath("/", "layout");

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}