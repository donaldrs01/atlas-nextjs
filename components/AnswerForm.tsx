import { addAnswer } from "@/lib/actions";

export function AnswerForm({ questionId }: { questionId: string }) {
  return (
    <form
      action={addAnswer}
      className="mt-4 flex items-center border border-gray-300 rounded-lg bg-gray-50"
    >
      <input type="hidden" name="question_id" value={questionId} />

      {/* Answer input */}
      <input
        id="answer"
        name="answer"
        type="text"
        placeholder="Answer question"
        className="flex-grow text-md h-12 pl-4 bg-transparent"
      />

      {/* Answer/Submit Button */}
      <button
        type="submit"
        className="bg-secondary text-white px-6 py-3 text-sm font-medium transition hover:bg-primary/80 rounded-lg"
      >
        Answer
      </button>
    </form>
  );
}
