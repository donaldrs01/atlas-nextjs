import { AnswerForm } from "@/components/AnswerForm";
import { AnswerList } from "@/components/AnswerList";
import { QuestionHeading } from "@/components/QuestionHeading";
import { fetchQuestion, fetchAnswers } from "@/lib/data";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Fetch actual question from the DB
  const { id } = await params;
  const question = await fetchQuestion(id);
  const answers = await fetchAnswers(id);

  if (!question) {
    return <div className="text-red-500">Question not found</div>;
  }

  return (
    <div className="w-auto mx-auto p-6">
      {/* Question Heading */}
      <div className="mb-6">
        <QuestionHeading title={question.title} />
      </div>

      {/* Answer Form */}
      <div className="mb-6">
        <AnswerForm questionId={question.id} />
      </div>
      {/* Answer List */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
        <AnswerList answers={answers} questionId={question.id} />
      </div>
    </div>
  );
}
