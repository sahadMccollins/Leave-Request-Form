"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import "../../styles/holidayCard.css";

const PublicHolidays = () => {
  const [country, setCountry] = useState("ae");
  const [year, setYear] = useState(2025);
  const [holidays, setHolidays] = useState([]);
  const [showUpcoming, setShowUpcoming] = useState({
    value: true,
    label: "Upcoming Holidays",
  });

  const fetchHolidays = async () => {
    const cacheKey = `holidays_${country}_2025`;
    const cachedData = localStorage.getItem(cacheKey);

    try {
      if (cachedData) {
        // If data exists in localStorage, use it
        setHolidays(JSON.parse(cachedData));
      } else {
        // If no cached data, fetch from the API
        const response = await fetch(
          `https://calendarific.com/api/v2/holidays?api_key=S7dMwhk7xoM17r3UHmtiKcGkYZ2YNcC4&country=${country}&year=2025&type=national`
        );

        const data = await response.json();

        // Cache the fetched data
        localStorage.setItem(cacheKey, JSON.stringify(data.response.holidays));
        setHolidays(data.response.holidays);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [country]);

  const handleCountry = (country) => {
    setCountry(country);
  };

  const upcomingHolidays = holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date.iso);
    return holidayDate >= new Date(); // Compare with today's date
  });

  const holidaysToShow = showUpcoming.value ? upcomingHolidays : holidays;

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <div className="go-back-container">
          <a href="/">
            <button className="go-back-button">
              <i>&#8592;</i> Go Back
            </button>
          </a>
        </div>
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Public Holidays 2025</h1>
            <p className="card-description">
              View public holidays for UAE and India
            </p>
          </div>
          <div className="card-content">
            <div className="tabs">
              <button
                className={`tab-button ${country === "ae" && "active"}`}
                data-country="uae"
                onClick={() => handleCountry("ae")}
              >
                UAE
              </button>
              <button
                onClick={() => handleCountry("in")}
                className={`tab-button ${country === "in" && "active"}`}
                data-country="india"
              >
                India
              </button>
            </div>

            <Select
              id="dateFilter"
              options={[
                { value: true, label: "Upcoming Holidays" },
                { value: false, label: "All Holidays" },
              ]}
              value={showUpcoming}
              onChange={(option) => setShowUpcoming(option)}
              className="form-select"
              classNamePrefix="custom-select"
            />

            <br />

            <div className="holidays-list">
              {holidaysToShow.length === 0 ? (
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
              ) : (
                holidaysToShow.map((holiday, index) => (
                  <div
                    className="holiday-item"
                    key={`${holiday.date.iso}-${index}`}
                  >
                    <span className="holiday-name">{holiday.name}</span>
                    <span className="holiday-date">
                      {new Date(holiday.date.iso).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicHolidays;
