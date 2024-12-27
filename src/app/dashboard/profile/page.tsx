"use client";

import React, { useEffect, useState } from "react";
import { Submission } from "@/entity/submissions";
import { User } from "@/entity/users";
import { Idea } from "@/entity/ideas";
import { Role, Status } from "@/entity/enum"; // Assuming we have a status enum for the ideas

export default function Profile() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Idea[]>([]);
  const [approvedIdeas, setApprovedIdeas] = useState<Idea[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"promote" | "demote" | null>(
    null
  );

  const getAuthToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setError("Authorization token is missing.");
      return;
    }

    const fetchUserProfileAndData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user profile (role and data)
        const profileResponse = await fetch("/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!profileResponse.ok)
          throw new Error("Failed to fetch user profile");
        const user = await profileResponse.json();
        setUserRole(user.user.role);

        const userDetailsResponse = await fetch(`/api/user/${user.user.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (userDetailsResponse.ok){
            setUserDetails(await userDetailsResponse.json());
        }

        // Fetch data based on role
        if (user.user.role === "employee") {
          const submissionsResponse = await fetch("/api/idea", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const ideaData: Idea[] = await submissionsResponse.json();
          const submittedIdeas: Idea[] = ideaData.filter(
            (idea) => idea?.submittedBy?.id === user.user.userId
          );
          setSubmissions(submittedIdeas);
        }

        if (user.user.role === "innovation_manager") {
          const approvedIdeasResponse = await fetch("/api/idea", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const ideasDats: Idea[] = await approvedIdeasResponse.json();
          const reviewedIdeas: Idea[] = ideasDats.filter(
            (idea) => idea.status !== Status.PENDING
          );
          setApprovedIdeas(reviewedIdeas);
        }

        if (user.user.role === "system_admin") {
          const usersResponse = await fetch("/api/user", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const allUsers: User[] = await usersResponse.json();
          setUsers(allUsers);
        }
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndData();
  }, []);

  const handleUserAction = (user: User, action: "promote" | "demote") => {
    setSelectedUser(user);
    setActionType(action);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setActionType(null);
  };

  const confirmAction = async () => {
    const token = getAuthToken();
    if (!token || !selectedUser || !actionType) return;

    try {
      const response = await fetch(`/api/user/${selectedUser.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        closeModal();
        // Optionally, you can re-fetch users data to update the list
        setFeedback( "User role updated." )
        setTimeout(() =>{
            window.location.reload();
        },1500)
        
      } else {
        setError("Failed to update user role.");
      }
    } catch (err) {
      setError("Failed to update user role.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl bg-teal-500 rounded-lg shadow-lg p-6 bg-opacity-25">
        <h1 className="text-3xl font-bold text-teal-500 text-center mb-6">
          Profile
        </h1>

        {loading && <div className="text-teal-500">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {feedback && <div className="text-yellow-500 mb-4">{feedback}</div>}

        {/* User Details */}
        {userDetails && (
          <div className="bg-teal-900 rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold text-teal-300 mb-4">
              User Details
            </h2>
            <div className="space-y-2 text-teal-300">
              <p>
                <strong>Name:</strong> {userDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Role:</strong> {userRole === Role.SYSTEM_ADMIN? "SYSTEM ADMIN": userRole === Role.INNOVATION_MANAGER? "INNOVATION MANAGER": "EMPLOYEE"}     
              </p>
              <p>
                <strong>Points:</strong> {userDetails.points || "N/A"}
              </p>
              <p>
                <strong>Joined At:</strong>{" "}
                {new Date(userDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {userRole === "employee" && (
          <div>
            <h2 className="text-2xl font-semibold text-teal-300 mb-4">
              Your Submitted Ideas
            </h2>
            <div className="space-y-4">
              {submissions.map((idea) => (
                <div
                  key={idea.id}
                  className="border border-teal-500 rounded-lg p-4 bg-teal-900"
                >
                  <h3 className="text-xl font-semibold text-teal-300">
                    {idea.title}
                  </h3>
                  <p className="text-md text-gray-300">
                    Submitted At: {new Date(idea.submittedAt).toLocaleString()}
                  </p>
                  <p
                    className={`mt-3 font-semibold ${
                      idea.status === Status.APPROVED
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    Status: {idea.status.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {userRole === "innovation_manager" && (
          <div>
            <h2 className="text-2xl font-semibold text-teal-300 mb-4">
              Approved/Rejected Ideas
            </h2>
            <div className="space-y-4">
              {approvedIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="border border-teal-500 rounded-lg p-4 bg-teal-900"
                >
                  <h3 className="text-xl font-semibold text-teal-300">
                    {idea.title}
                  </h3>
                  <p className="text-md text-gray-300">
                    Submitted At: {new Date(idea.submittedAt).toLocaleString()}
                  </p>
                  <p
                    className={`mt-3 font-semibold ${
                      idea.status === Status.APPROVED
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    Status: {idea.status.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {userRole === "system_admin" && (
          <div>
            <h2 className="text-2xl font-semibold text-teal-300 mb-4">
              All Users
            </h2>
            <div className="space-y-4">
              {users
                .filter((user) => user.id !== selectedUser?.id) // Exclude the current system admin
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center p-4 border border-teal-500 rounded-lg bg-teal-900"
                  >
                    <div className="flex flex-col">
                      <div className="text-teal-300 text-center text-lg">
                        {user.name}
                      </div>
                      <div className="text-teal-300 text-center text-sm">
                        {user.role.toUpperCase()}
                      </div>
                    </div>

                    <div>
                      {user.role === Role.EMPLOYEE ? (
                        <button
                          onClick={() => handleUserAction(user, "promote")}
                          className="text-teal-500 hover:text-teal-900 bg-teal-100 rounded-sm bg-opacity-40 hover:bg-teal-300  py-1 px-2"
                        >
                          Promote
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user, "demote")}
                          className="ml-4 text-teal-500 hover:text-teal-900 bg-teal-100 rounded-sm bg-opacity-40 hover:bg-teal-300 py-1 px-2 "
                        >
                          Demote
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {selectedUser && actionType && (
        <div className="fixed inset-0 flex items-center justify-center bg-teal bg-opacity-50 z-50">
          <div className="bg-teal-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-teal-300 mb-4">
              Are you sure to {actionType} &quot;{selectedUser.name}&quot; to{" "}
              {actionType === "promote" ? "Innovation Manager" : "Employee"}?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={confirmAction}
                className="bg-teal-500 hover:bg-teal-400 text-white py-2 px-4 rounded"
              >
                Confirm
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
