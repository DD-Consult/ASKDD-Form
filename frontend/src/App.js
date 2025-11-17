import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OnboardingForm from './components/OnboardingForm';
import AdminDashboard from './components/AdminDashboard';
import ThankYou from './components/ThankYou';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OnboardingForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;