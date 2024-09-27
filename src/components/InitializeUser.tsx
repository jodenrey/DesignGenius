import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs"; // Import useUser

const InitializeUser = () => {
  const { isSignedIn } = useAuth(); // useAuth for auth status
  const { user } = useUser(); // useUser for user details

  useEffect(() => {
    if (isSignedIn && user) {
      const userId = user.id;
      const email = user.emailAddresses[0]?.emailAddress || "";

      fetch("/api/user-initialization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          email,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to initialize user");
          }
          return res.json();
        })
        .then((data) => console.log("User initialized", data))
        .catch((error) => console.error("Error initializing user:", error));
    }
  }, [isSignedIn, user]);

  return null;
};

export default InitializeUser;
