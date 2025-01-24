"use client";

// import { ColorModeToggle } from "../components/color-mode-toggle";
import LeaveRequestForm from "../components/LeaveRequestForm/LeaveRequestForm";
import { useEffect, useState } from "react";
import "../styles/form.css";

export default function Home() {
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      leaveType: "Sick Leave",
      startDate: "01/02/2025",
      endDate: "03/02/2025",
      reason: "Fever and rest",
      status: "Approved",
    },
    {
      id: 2,
      leaveType: "Casual Leave",
      startDate: "10/02/2025",
      endDate: "12/02/2025",
      reason: "Family trip",
      status: "Pending",
    },
  ]);

  const [enableForm, setEnableForm] = useState(false);

  const handleNewRequest = () => {
    setEnableForm(true);
  };

  return (
    <>
      {/* {enableForm ? ( */}
      <LeaveRequestForm setEnableForm={setEnableForm} />
      {/* ) : (
        <div className="leave-request-container">
          <div className="leave-request-header">
            <h2>Leave Requests</h2>
            <button className="create-leave-btn" onClick={handleNewRequest}>
              + Create New Leave Request
            </button>
          </div>
          <table className="leave-request-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{request.leaveType}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.reason}</td>
                  <td>
                    <span
                      className={`status-label ${
                        request.status === "Approved"
                          ? "approved"
                          : request.status === "Pending"
                          ? "pending"
                          : "rejected"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}
    </>
  );
}
