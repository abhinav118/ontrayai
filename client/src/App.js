import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfilePage from './components/ProfilePage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LandingPage from './LandingPage';
import Planner from './components/Planner';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
