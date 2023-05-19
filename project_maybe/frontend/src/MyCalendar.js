import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendar({user, userTasks, client, clientProjects}) {
  const [date, setDate] = useState(new Date());
  console.log(client)
  function handleDateChange(newDate) {
    setDate(newDate);
  }

  // Function to check if a date has a task due
  function userHasTaskDue(date) {
    return userTasks?.some(task => task.due_date === date.toISOString().slice(0, 10) && task.complete !== true && task.user_id === user.id);
  }
  function userDidTaskDue(date) {
    return userTasks?.some(task => task.due_date === date.toISOString().slice(0, 10) && task.complete === true && task.user_id === user.id);
  }
  function clientHasProjectDue(date) {
    return clientProjects?.some(project => project.end_date === date.toISOString().slice(0, 10) && project.complete !== true);
  }
  function clientsProjectDone(date) {
    return clientProjects?.some(project => project.end_date === date.toISOString().slice(0, 10) && project.complete === true);
  }



  // Function to generate the content for each date tile
  function userTileContent({ date, view }) {
    if (view === 'month' && userHasTaskDue(date)) {
      return (
        <div className="text-red-500 font-bold">
          &bull;
        </div>
      );
    } else if(view === 'month' && userDidTaskDue(date)){
        return (
            <div className="text-emerald-500 font-bold">
              &bull;
            </div>
          );
    }else {
        return null;
    }
  }
  function clientTileContent({ date, view }) {
    if (view === 'month' && clientHasProjectDue(date)) {
      return (
        <div className="text-red-500 font-bold">
          &bull;
        </div>
      );
    } else if(view === 'month' && clientsProjectDone(date)){
        return (
            <div className="text-emerald-500 font-bold">
              &bull;
            </div>
          );
    }else {
        return null;
    }
  }


  return (
   user? (<div className='mx-auto my-auto z-3'>
    <div className='my-3'>
        <h2 className="text-3xl  text-violet-500 text-center my-19 font-semibold mb-4">My Calendar</h2>
        <div className="mx-auto items-center p-4 rounded-lg shadow-md">
            <Calendar
                onChange={handleDateChange}
                value={date}
                tileContent={userTileContent}
                className="text-gray-500 mx-auto z-1 rounded-lg font-sans bg-slate-800 !important"
                // prevLabel={<i className="fas fa-chevron-left"></i>}
                // nextLabel={<i className="fas fa-chevron-right"></i>}   
            />
  </div></div>
  
</div>) : client ? ( 
    <div className='mx-auto my-auto z-3'>
        <div className='my-3'>
            <h2 className="text-3xl  text-violet-500 text-center my-19 font-semibold mb-4">My Calendar</h2>
            <div className="mx-auto items-center p-4 rounded-lg shadow-md">
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    tileContent={clientTileContent}
                    className="text-gray-500 mx-auto z-1 rounded-lg font-sans bg-slate-800 !important"
                    // prevLabel={<i className="fas fa-chevron-left"></i>}
                    // nextLabel={<i className="fas fa-chevron-right"></i>}   
                />
      </div></div>
      
    </div>) : (<div><h1>How Did You Get Here? Turn Back Now</h1></div>)
  )
}

export default MyCalendar;

