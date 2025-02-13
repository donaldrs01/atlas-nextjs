import { auth } from "../auth";
import SignOutButton from "./SignOutButton";

export default async function LoggedInUser() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="flex flex-col gap-2 items-center bg-gray-100 rounded-lg">
      {/* Show user profile if available, otherwise show placeholder */}
      <div className="flex items-center gap-3 w-full pl-2">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt="User profile image"
            className="w-8 h-8 rounded-full text-sm"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
        )}
        <span>{session.user.name || "User"}</span>
      </div>
      <div className="w-full">
        <SignOutButton />
      </div>
    </div>
  );
}
