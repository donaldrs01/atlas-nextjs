import { HashtagIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type Props = {
  id: string;
  title: string;
};

export default function TopicLink({ id, title }: Props) {
  const href = `/ui/topics/${id}`;
  return (
    <a
      href={href}
      className={clsx(
        " hidden h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium md:flex hover:bg-primary-foreground md:flex-none md:justify-start md:p-2 md:px-3",
        {}
      )}
    >
      <HashtagIcon className="w-6" />
      <p className="hidden md:block">{title}</p>
    </a>
  );
}
