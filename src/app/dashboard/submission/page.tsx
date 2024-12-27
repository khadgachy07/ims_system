"use client";

import React, { useEffect, useState } from "react";
import { Status } from "@/entity/enum";
import { Submission } from "@/entity/submissions";

export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

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
      return;
    }

    const fetchUserRoleAndSubmissions = async () => {
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

        // Fetch submissions
        const submissionsResponse = await fetch("/api/submission", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!submissionsResponse.ok) throw new Error("Failed to fetch submissions");
        const data: Submission[] = await submissionsResponse.json();
        setSubmissions(data);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleAndSubmissions();
  }, []);

  const openModal = (submission: Submission) => setSelectedSubmission(submission);
  const closeModal = () => setSelectedSubmission(null);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl bg-teal-500 rounded-lg shadow-lg p-6 bg-opacity-25">
        <h1 className="text-3xl font-bold text-teal-500 text-center mb-6">Submission Dashboard</h1>
        {loading && <div className="text-teal-500">Loading submissions...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="space-y-6">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              onClick={() => openModal(submission)}
              className="border border-teal-500 rounded-lg p-4 bg-teal-900 cursor-pointer hover:bg-teal-600"
            >
              <h3 className="text-xl font-semibold text-teal-300">{submission.idea?.name}</h3>
              <p className="text-md text-gray-300">Submitted By: {submission.submittedBy?.name || "Unknown"}</p>
              <p className="text-md text-gray-300">Submitted At: {new Date(submission.submittedAt).toLocaleString()}</p>
              {submission.syncStatus && (
                <p className="mt-3 font-semibold text-green-500">Sync Status: Synced</p>
              )}
              {!submission.syncStatus && (
                <p className="mt-3 font-semibold text-red-500">Sync Status: Not Synced</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedSubmission && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-teal bg-opacity-50 z-50"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="bg-teal-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 id="modal-title" className="text-2xl font-bold text-teal-300 mb-4">
              {selectedSubmission.idea?.name}
            </h2>
            <p id="modal-submittedBy" className="text-md text-gray-300 mb-4">
              Submitted By: {selectedSubmission.submittedBy?.name || "Unknown"}
            </p>
            <p id="modal-submittedAt" className="text-md text-gray-300 mb-4">
              Submitted At: {new Date(selectedSubmission.submittedAt).toLocaleString()}
            </p>
            <p id="modal-offlineStatus" className="text-md text-gray-300 mb-4">
              Offline Status: {selectedSubmission.offlineStatus ? "Offline" : "Online"}
            </p>
            <p id="modal-syncStatus" className="text-md text-gray-300 mb-4">
              Sync Status: {selectedSubmission.syncStatus ? "Synced" : "Not Synced"}
            </p>
            <div id="modal-incentives" className="text-md text-gray-300 mb-6">
              <p className="font-semibold">Incentives:</p>
              {selectedSubmission.incentive ? (
                <p>{selectedSubmission.incentive.name || "No Incentive"}</p>
              ) : (
                <p>No Incentive</p>
              )}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}