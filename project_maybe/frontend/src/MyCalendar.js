import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendar({user, userTasks}) {
  const [date, setDate] = useState(new Date());

  function handleDateChange(newDate) {
    setDate(newDate);
  }

  // Function to check if a date has a task due
  function hasTaskDue(date) {
    return userTasks.some(task => task.due_date === date.toISOString().slice(0, 10));
  }

  // Function to generate the content for each date tile
  function tileContent({ date, view }) {
    if (view === 'month' && hasTaskDue(date)) {
      return (
        <div className="text-red-500 font-bold">
          &bull;
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <div className='mx-auto'>
      <h2 className="text-3xl text-center my-20 font-semibold mb-4">My Calendar</h2>
      <div className="mx-auto items-center p-4 rounded-lg shadow-md">
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={tileContent}
          className="text-gray-800 mx-auto rounded-lg font-sans "
          prevLabel={<i className="fas fa-chevron-left"></i>}
          nextLabel={<i className="fas fa-chevron-right"></i>}
          style={{ width: "1000px" }}
        />
      </div>
    </div>
  );
}

export default MyCalendar;

