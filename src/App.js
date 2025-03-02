import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LiveMatches from "./components/LiveMatches";
import Scorecard from "./components/Scorecard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LiveMatches />} />
        <Route path="/scorecard" element={<Scorecard />} />
      </Routes>
    </Router>
  );
};

export default App;
