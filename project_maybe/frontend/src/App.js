import React, {useState, useEffect} from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import { Login } from './Login';
import { SignUp } from './Signup';
export function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    });
  }, []);

  function handleLogin(user) {
    setUser(user);
}
  function handleLogout(){
    setUser(null);
  }
return (
  <div className="App">
      <header className="App-header">
          {/* <Navbar user={user} setUser={setUser} onLogout={handleLogout}/> */}
              <Routes>
              {/* <Route path="/"  /> */}
                  {/* <Route path="/" element={<Home user={user} eventsArray={eventsArray}/>} />
                  <Route path="/venues" element={<Venues venuesArray={venuesArray}/>} />
                  {/* <Route path="/events" element={<Events eventsArray={eventsArray} search={search}/>} /> */}
                  {/* <Route path="/events" element={<Events addEvent={addEvent} eventsArray={eventsArray} user={user}/>} /> */} 
                  <Route path="/login" element={<Login handleLogin={handleLogin}/>} />
                  <Route path="/signup" element={<SignUp setUser={setUser}/>} />
                  {/* <Route path="/profile" element={<Profile user={user} handleLogout={handleLogout} handleUpdate={handleUpdate} setUser={setUser} tix={tixArray} deleteEvent={deleteEvent}/>} /> */}
                  <Route path="/" element={<button onClick={handleLogout}>Logout</button>} />
              </Routes>
      </header>
  </div>
);
}
