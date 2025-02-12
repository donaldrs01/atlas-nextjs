import { Answer } from "@/lib/definitions";
import { AnswerItem } from "@/components/AnswerItem";

export function AnswerList({
  answers,
  questionId,
}: {
  answers: Answer[];
  questionId: string;
}) {
  if (!answers || answers.length === 0) {
    return <p className="text-gray-500">No answers yet.</p>;
  }

  return (
    <div className="mt-4">
      {answers.map((answer) => (
        <AnswerItem key={answer.id} answer={answer} questionId={questionId} />
      ))}
    </div>
  );
}
