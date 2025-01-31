"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
// import "../styles/LeaveRequestForm.css";

const leaveOptions = [
  { value: "Annual Leave", label: "Annual Leave" },
  { value: "Sick Leave", label: "Sick Leave" },
  { value: "Personal Leave", label: "Personal Leave" },
  { value: "Compensatory Leave", label: "Compensatory Leave" },
];
import "../../styles/form.css";

export default function LeaveRequestForm({ setEnableForm }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    leaveType: leaveOptions[0],
    startDate: null,
    endDate: null,
    reason: "",
    remarks: "",
    status: null,
    noOfDays: null,
  });
  const [loading, setLoading] = useState(false);
  const [leaveDays, setLeaveDays] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDateChange = (field, date) => {
    setFormData({ ...formData, [field]: date });

    if (field === "startDate" || field === "endDate") {
      const { startDate, endDate } = {
        ...formData,
        [field]: date,
      };

      if (startDate && endDate) {
        const diff =
          Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        setLeaveDays(diff > 0 ? diff : 0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const organizationDomain = "@mccollinsmedia.com"; // Replace with your organization's domain
      if (!formData.email.endsWith(organizationDomain)) {
        setLoading(false);
        alert("Please use your organization email to submit the form.");
        return;
      }

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          leaveType: formData.leaveType.value,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          remarks: formData.remarks,
          noOfDays: leaveDays,
          status: "pending",
          date: new Date(),
        }),
      };

      const response = await fetch("/api/leave-request", requestOptions);

      if (!response.ok) {
        throw new Error("Failed to submit the leave request");
      }

      const result = await response.json();
      console.log(result);

      // Reset the form after successful submission
      setFormData({
        name: "",
        email: "",
        leaveType: leaveOptions[0],
        startDate: null,
        endDate: null,
        reason: "",
        remarks: "",
      });
      setLeaveDays(0);
      setLoading(false);
      alert("Form Submitted Successfully!");
      // fetch("/api/leave-request", requestOptions).then(
      //   (response) => response.json(),
      //   setFormData({
      //     name: "",
      //     email: "",
      //     leaveType: leaveOptions[0],
      //     startDate: null,
      //     endDate: null,
      //     reason: "",
      //     remarks: "",
      //   }),
      //   setLeaveDays(0),
      //   alert("Form Submitted")
      // );
    } catch (error) {
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <>
      <div className="form-container">
        <div
          style={{
            // display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center",
            marginBottom: "20px",
            // flexWrap: "wrap",
          }}
        >
          <h1 className="form-title" style={{ margin: 0 }}>
            Leave Request Form
          </h1>
          <div style={{ textAlign: "center" }}>
            <a href="/public-holidays" className="form-link">
              View Public Holidays
            </a>
            <br />
            <a
              style={{ marginTop: "15px" }}
              href="/leave-form.pdf"
              className="form-link"
              download
            >
              Download Leave Form
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="form-textarea"
              type="text"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="form-textarea"
              type="email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="leaveType" className="form-label">
              Leave Type
            </label>
            <Select
              id="leaveType"
              options={leaveOptions}
              value={formData.leaveType}
              onChange={(option) =>
                setFormData({ ...formData, leaveType: option })
              }
              className="form-select"
              classNamePrefix="custom-select"
            />
          </div>
          {/* <div className="form-group">
          <label htmlFor="startDate" className="form-label">
            Start Date
          </label>
          <DatePicker
            selected={formData.startDate}
            onChange={(date) => handleDateChange("startDate", date)}
            dateFormat="dd/MM/yyyy"
            className="form-input"
            placeholderText="Select Start Date"
            id="startDate"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate" className="form-label">
            End Date
          </label>
          <DatePicker
            selected={formData.endDate}
            onChange={(date) => handleDateChange("endDate", date)}
            dateFormat="dd/MM/yyyy"
            className="form-input"
            placeholderText="Select End Date"
            id="endDate"
            required
          />
        </div> */}
          <div className="form-group date-group">
            <div className="form-date">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => handleDateChange("startDate", date)}
                dateFormat="dd/MM/yyyy"
                className="form-input"
                placeholderText="Select Start Date"
                id="startDate"
                required
              />
            </div>
            <div className="form-date">
              <label htmlFor="endDate" className="form-label">
                End Date
              </label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => handleDateChange("endDate", date)}
                dateFormat="dd/MM/yyyy"
                className="form-input"
                placeholderText="Select End Date"
                id="endDate"
                required
              />
            </div>
          </div>

          {leaveDays > 0 && (
            <div className="leave-days">
              Total Leave Days: <strong>{leaveDays}</strong>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="reason" className="form-label">
              Reason for Leave
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="form-textarea"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="remarks" className="form-label">
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              className="form-textarea"
            />
          </div>
          <button
            type="submit"
            className={`form-button ${loading ? "loading-btn" : ""}`}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : "Submit"}
          </button>

          {/* <button
          style={{ marginTop: "15px", backgroundColor: "gray" }}
          onClick={() => setEnableForm(false)}
          className="form-button"
        >
          Cancel
        </button> */}
        </form>
        {successMessage && (
          <p className="form-success-message">{successMessage}</p>
        )}
      </div>
    </>
  );
}
