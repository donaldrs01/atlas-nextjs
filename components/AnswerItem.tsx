import { setAcceptedAnswer } from "@/lib/actions";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export function AnswerItem({
  answer,
  questionId,
}: {
  answer: { id: string; answer: string; is_accepted: boolean };
  questionId: string;
}) {
  return (
    <div className="p-3 border-b flex items-center">
      <p className="flex-grow text-gray-900">{answer.answer}</p>
      {/* Mark accepted answer */}
      <form action={setAcceptedAnswer}>
        <input type="hidden" name="question_id" value={questionId} />
        <input type="hidden" name="answer_id" value={answer.id} />
        {/* Button Icon */}
        <button type="submit">
          <CheckCircleIcon
            className={`h-6 w-6 ${
              answer.is_accepted
                ? "text-green-500"
                : "text-gray-300 hover:text-green-500"
            }`}
          />
        </button>
      </form>
    </div>
  );
}
