import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import userProfileImage from '../assets/user-profile.png';
import mockReminder from '../data/mocks/mockReminder';
import SupplementCard from '../components/SupplementCard';
import mockPillIntakes from '../data/mocks/mockPillIntakes';
import PillIntakeDetails from '../components/PillIntakeDetails';

export default function Dashboard() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isFutureDate = selectedDate > new Date();

  // Format Date to Day - Date, Year
  function formatDate(date) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });
    const dayNumber = date.getDate();
    const year = date.getFullYear();

    return `${dayName} ${monthName} ${dayNumber}, ${year}`;
  }

  // Check if the current date is the same as the selected date
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // Check if the selected date falls within the supplement's date range
  const supplementsForSelectedDate = mockReminder.filter((supplement) => {
    const supplementStartDate = new Date(supplement.startDate);
    let supplementEndDate = supplement.endDate
      ? new Date(supplement.endDate)
      : new Date();

    // If no end date is provided
    if (!supplement.endDate) {
      supplementEndDate = new Date('9999-12-31');
    }

    return (
      selectedDate >= supplementStartDate && selectedDate <= supplementEndDate
    );
  });

  // Check if pills were taken on a given date
  const pillTakenOnDate = (date) => {
    return mockPillIntakes.some(
      (intake) => intake.date.toDateString() === date.toDateString()
    );
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const pillDetailsForSelectedDate = selectedDate
    ? mockPillIntakes.filter(
        (intake) => intake.date.toDateString() === selectedDate.toDateString()
      )
    : [];

  // Filter only active supplements for the selected date
  const activeSupplementsForSelectedDate = supplementsForSelectedDate.filter(
    (supplement) => supplement.isActive
  );

  return (
    <>
      <main className="dashboard-container container">
        <section className="container-top">
          {/* <h1 className="accent">
            Pilpal Dashboard<span>✷</span>
          </h1> */}
          <p className="title-date">
            <span className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-asterisk"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                stroke-width="2.0"
                stroke="#000000"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12l8 -4.5" />
                <path d="M12 12v9" />
                <path d="M12 12l-8 -4.5" />
                <path d="M12 12l8 4.5" />
                <path d="M12 3v9" />
                <path d="M12 12l-8 4.5" />
              </svg>
            </span>
            {formatDate(new Date())}
          </p>
          <div className="greetings">
            <h2>
              Hi, Luwam! <br></br>Let’s make today a healthy one.
            </h2>
            <div className="profile-image-container">
              <img src={userProfileImage} alt="User Profile" />
            </div>
          </div>
        </section>
        <section className="container-bottom">
          <article className="container-left">
            <p className="today-title">
              <span className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-list-check"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="#000000"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />
                  <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />
                  <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />
                  <path d="M11 6l9 0" />
                  <path d="M11 12l9 0" />
                  <path d="M11 18l9 0" />
                </svg>
              </span>
              {isToday ? (
                <>
                  Your reminders for
                  <span> today</span>
                </>
              ) : (
                <>
                  Your reminders for
                  <span> {formatDate(selectedDate)}</span>
                </>
              )}
            </p>
            {/* Check if there are supplements for the selected date */}
            {activeSupplementsForSelectedDate.length > 0 ? (
              activeSupplementsForSelectedDate.map((reminder) => (
                <SupplementCard
                  key={reminder.id}
                  {...reminder}
                  isFutureDate={isFutureDate}
                />
              ))
            ) : (
              <div className="no-reminders">
                <p>
                  No reminders yet?<br></br> Let's get healthier together! 💪
                </p>
                <button
                  className="btn-main"
                  onClick={() => navigate('/add-new')}
                >
                  Start Tracking Your Supplements
                </button>
              </div>
            )}
          </article>
          <article className="container-right">
            <div className="container-right--box">
              <Calendar
                onChange={setDate}
                value={date}
                onClickDay={handleDayClick}
                tileContent={({ date, view }) =>
                  view === 'month' && pillTakenOnDate(date) ? (
                    <div className="pill-taken-indicator"></div>
                  ) : null
                }
              />
            </div>
            {/* Pill Intake & Skipped Details Display */}
            {selectedDate && (
              <PillIntakeDetails
                pillIntakes={pillDetailsForSelectedDate}
                selectedDate={selectedDate}
              />
            )}
          </article>
        </section>
      </main>
    </>
  );
}
