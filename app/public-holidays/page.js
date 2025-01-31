"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import "../../styles/holidayCard.css";

const HOLIDAYS = {
  ae: [
    {
      name: "New Year's Day",
      date: "2025-01-01",
      note: "Public holiday, most businesses closed",
      isTBA: false,
    },
    {
      name: "Eid al-Fitr",
      date: "2025-03-31",
      note: "Religious holiday, celebrations vary",
      isTBA: true,
    },
    {
      name: "Eid al-Fitr Holiday",
      date: "2025-04-01",
      note: "Extended holiday for Eid celebrations",
      isTBA: true,
    },
    {
      name: "Eid al-Adha (Feast of Sacrifice)",
      date: "2025-06-07",
      note: "Major Islamic festival with prayers and animal sacrifices",
      isTBA: true,
    },
    {
      name: "Eid al-Adha Holiday",
      date: "2025-06-08",
      note: "Major Islamic festival with prayers and animal sacrifices",
      isTBA: true,
    },
    {
      name: "Al-Hijra (Islamic New Year)",
      date: "2025-06-27",
      note: "First day of the Islamic calendar",
      isTBA: true,
    },
    {
      name: "National Day",
      date: "2025-12-02",
      note: "Celebrates UAE's formation in 1971",
      isTBA: false,
    },
    {
      name: "National Day Holiday",
      date: "2025-12-03",
      note: "Celebrates UAE's formation in 1971",
      isTBA: true,
    },
  ],
  in: [
    {
      name: "Republic Day",
      date: "2025-01-26",
      note: "Marks the adoption of India's Constitution",
    },
    {
      name: "Independence Day",
      date: "2025-08-15",
      note: "Celebrates India's independence from British rule",
    },
    {
      name: "Mahatma Gandhi Jayanti",
      date: "2025-10-02",
      note: "Birthday of Gandhi",
    },
    {
      name: "Christmas",
      date: "2025-12-25",
      note: "Festival of lights, symbolizes victory of light over darkness",
    },
  ],
};

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
        setHolidays(JSON.parse(cachedData));
      } else {
        const response = await fetch(
          `https://calendarific.com/api/v2/holidays?api_key=S7dMwhk7xoM17r3UHmtiKcGkYZ2YNcC4&country=${country}&year=2025&type=national`
        );

        const data = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify(data.response.holidays));
        setHolidays(data.response.holidays);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  // useEffect(() => {
  //   fetchHolidays();
  // }, [country]);

  useEffect(() => {
    setHolidays(HOLIDAYS[country]);
  }, [country]);

  const handleCountry = (country) => {
    setCountry(country);
  };

  // const upcomingHolidays = holidays.filter((holiday) => {
  //   const holidayDate = new Date(holiday.date.iso);
  //   return holidayDate >= new Date();
  // });

  const upcomingHolidays = holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= new Date();
  });

  const holidaysToShow = showUpcoming.value ? upcomingHolidays : holidays;

  console.log("holidaystoshow", holidaysToShow);

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
              {/* {holidaysToShow.length === 0 ? (
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
              )} */}

              {holidaysToShow.length === 0 ? (
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
              ) : (
                holidaysToShow.map((holiday, index) => (
                  <div
                    className="holiday-item"
                    key={`${holiday.date}-${index}`}
                  >
                    <div className="holiday-info" style={{ maxWidth: "300px" }}>
                      <span className="holiday-name">{holiday.name}</span>
                      {holiday.isTBA && (
                        <span className="tba-text">
                          Date to be confirmed as per UAE Government
                          announcement
                        </span>
                      )}
                    </div>
                    <span className="holiday-date">
                      {new Date(holiday.date).toLocaleDateString("en-GB", {
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

            {country === "in" && (
              <div class="alert">
                <svg
                  class="alert-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p class="alert-description">
                  <strong>Regional holidays:</strong> Approval from HR is
                  required for recognizing and observing any regional holidays
                  not included in the standard company holiday calendar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicHolidays;
