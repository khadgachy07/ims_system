"use client";

import { Role, Status } from "@/entity/enum";
import { Idea } from "@/entity/ideas";
import { User } from "@/entity/users";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [createIdeaModalOpen, setCreateIdeaModalOpen] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDescription, setNewIdeaDescription] = useState("");

  // Retrieve the JWT token (modify as per your storage method)
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
      redirect("/login");
      return;
    }

    const fetchUserRoleAndIdeas = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user role
        const roleResponse = await fetch("/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!roleResponse.ok) throw new Error("Failed to fetch user role");
        const user = await roleResponse.json();
        setUserRole(user.user.role);

        // Fetch ideas
        const ideasResponse = await fetch("/api/idea", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!ideasResponse.ok) throw new Error("Failed to fetch ideas");
        const data: Idea[] = await ideasResponse.json();
        setIdeas(data);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleAndIdeas();
  }, []);

  const handleIncentive = async (user: User) => {
    console.log(user);
    const token = getAuthToken();
    if (!token) {
      alert("Authorization token is missing.");
      return;
    }
    try {
      const response = await fetch(`/api/incentive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!response.ok) throw new Error("Failed to give incentive");
      const data = await response.text();
      setFeedback(data);
      setTimeout( () => {
        window.location.reload();
      },1500)
    } catch (err) {
      console.error("Failed to give incentive.", err);
    }
  };

  const handleAction = async (
    id: number,
    action: string,
    body?: { status: Status }
  ) => {
    const token = getAuthToken();
    if (!token) {
      alert("Authorization token is missing.");
      return;
    }

    try {
      const response = await fetch(`/api/idea/${id}/${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        setFeedback(`Failed to ${action}: ${errorDetails}`);
        closeModal();
        return;
      }
      setFeedback(
        `${action.charAt(0).toUpperCase() + action.slice(1)} successful!`
      );
      setSelectedIdea(null);
      setTimeout( () => {
        window.location.reload();
      },1500)
    } catch (err) {
      setFeedback(`Failed to ${action}. Please try again.`);
      console.error(err);
    }
  };

  const handleCreateIdea = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("Authorization token is missing.");
      return;
    }

    if (!newIdeaTitle || !newIdeaDescription) {
      setFeedback("Title and description are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newIdeaTitle,
          description: newIdeaDescription,
        }),
      });

      if (!response.ok) throw new Error(`${response.text()}`);
      // setIdeas((prevIdeas) => [...prevIdeas, newIdea]);
      setFeedback("Idea created successfully!");
      setCreateIdeaModalOpen(false);
      setNewIdeaTitle("");
      setNewIdeaDescription("");
      setLoading(false);
      setTimeout( () => {
        window.location.reload();
      },1500)
    } catch (err) {
      setFeedback("Failed to create idea. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (idea: Idea) => setSelectedIdea(idea);

  const closeModal = () => {
    setSelectedIdea(null);
    setCreateIdeaModalOpen(false);
  };
  const filteredIdeas =
    ideas?.filter((idea) => {
      if (userRole === Role.SYSTEM_ADMIN) {
        return (
          idea.status === Status.APPROVED || idea.status === Status.REJECTED
        );
      }
      return idea.status === Status.PENDING;
    }) ?? [];

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl  bg-teal-500 rounded-lg shadow-lg p-6 bg-opacity-25">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-500 text-center mb-6">
            Idea Dashboard
          </h1>

          {userRole === Role.EMPLOYEE && (
            <button
              onClick={() => setCreateIdeaModalOpen(true)}
              className="mb-6 bg-teal-500 hover:bg-teal-400 text-white py-2 px-4 rounded"
            >
              Create New Idea
            </button>
          )}
        </div>
        {/* // create a new idea buttom that open modal to create idea */}
        {/* ... (rest of the code) */}
        {loading && <div className="text-teal-500">Loading ideas...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {feedback && <div className="text-yellow-500 mb-4">{feedback}</div>}
        <div className="space-y-6">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => openModal(idea)}
              className="border border-teal-500 rounded-lg p-4 bg-teal-900 cursor-pointer hover:bg-teal-600"
            >
              <h3 className="text-xl font-semibold text-teal-300">
                {idea.title}
              </h3>
              <p className="text-md text-gray-300">Votes: {idea.votes}</p>
              {idea.status && (
                <p
                  className={`mt-3 font-semibold ${
                    idea.status === Status.APPROVED
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  Status: {idea.status.toUpperCase()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedIdea && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-teal bg-opacity-50 z-50"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="bg-teal-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2
              id="modal-title"
              className="text-2xl font-bold text-teal-300 mb-4"
            >
              {selectedIdea.title}
            </h2>
            <p id="modal-submittedBy" className="text-md text-gray-300 mb-6">
              SubmittedBy: {selectedIdea?.submittedBy?.name || "Unknown"}
            </p>
            <p id="modal-votes" className="text-md text-gray-300 mb-6">
              Votes: {selectedIdea.votes}
            </p>
            <p id="modal-description" className="text-md text-gray-300 mb-6">
              {selectedIdea.description}
            </p>

            {userRole === Role.EMPLOYEE && (
              <button
                onClick={() => handleAction(selectedIdea.id, "vote")}
                className="w-full bg-teal-500 hover:bg-teal-400 text-white py-2 px-4 rounded mb-4"
              >
                Vote
              </button>
            )}
            {userRole === Role.SYSTEM_ADMIN && selectedIdea?.submittedBy && (
              <button
                onClick={() => handleIncentive(selectedIdea.submittedBy)}
                className="w-full bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded mb-4"
              >
                Give Incentive
              </button>
            )}
            {userRole === Role.INNOVATION_MANAGER && (
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    handleAction(selectedIdea.id, "review", {
                      status: Status.APPROVED,
                    })
                  }
                  className="w-1/2 bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    handleAction(selectedIdea.id, "review", {
                      status: Status.REJECTED,
                    })
                  }
                  className="w-1/2 bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded"
                >
                  Reject
                </button>
              </div>
            )}
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {createIdeaModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-teal bg-opacity-50 z-50">
          <div className="bg-teal-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-teal-300 mb-4">
              Create New Idea
            </h2>
            <input
              type="text"
              value={newIdeaTitle}
              onChange={(e) => setNewIdeaTitle(e.target.value)}
              placeholder="Idea Title"
              className="w-full mb-4 p-2 border border-teal-500 rounded bg-teal-900 text-teal-300"
            />
            <textarea
              value={newIdeaDescription}
              onChange={(e) => setNewIdeaDescription(e.target.value)}
              placeholder="Idea Description"
              className="w-full mb-4 p-2 border border-teal-500 rounded bg-teal-900 text-teal-300"
            ></textarea>
            <button
              onClick={handleCreateIdea}
              className="w-full bg-teal-500 hover:bg-teal-400 text-white py-2 px-4 rounded mb-4"
            >
              Submit
            </button>
            <button
              onClick={closeModal}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
