"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<{ location: string; phonenumber: string } | null>(null);
  const [formData, setFormData] = useState({ location: "", phonenumber: "" });
  const [formVisible, setFormVisible] = useState(false);

  const fetchUser = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch(`/api/user?email=${session.user.email}`);
      if (response.ok) {
        const user = await response.json();
        setUserDetails(user);

        if (!user.location || !user.phonenumber) {
          setFormVisible(true);
        }
      } else if (response.status === 404) {
        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: session.user.name,
            email: session.user.email,
          }),
        });
      }
    } catch (error) {
      console.error("Error fetching or creating user:", error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    try {
      const response = await fetch(`/api/user`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          ...formData,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserDetails(updatedUser);
        setFormVisible(false);
      } else {
        console.error("Failed to update user:", await response.json());
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUser();
    }
  }, [session]);

  if (session) {
    return (
      <>
        <h3>Welcome, {session?.user?.name || "User"}!</h3>
        {formVisible ? (
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>Location:</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                value={formData.phonenumber}
                onChange={(e) =>
                  setFormData({ ...formData, phonenumber: e.target.value })
                }
              />
            </div>
            <button type="submit">Save</button>
          </form>
        ) : (
          <div>
            <p>
              <strong>Location:</strong> {userDetails?.location}
            </p>
            <p>
              <strong>Phone Number:</strong> {userDetails?.phonenumber} 
            </p>
          </div>
        )}
       <button onClick={() => signOut()} className="btn btn-primary">
        Sign Out
      </button>
    </>
    );
  }
  
  return <button onClick={() => signIn()}>Sign In</button>;
}
