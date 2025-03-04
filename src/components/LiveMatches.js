import React, { useEffect, useState } from "react";
import axios from "axios";

const Matches = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  const fetchLiveMatches = async () => {
    try {
      const response = await axios.get("https://cricapi2.onrender.com/live-matches");
      setLiveMatches(response.data.live_matches);
    } catch (error) {
      console.error("Error fetching live matches:", error);
    }
  };

  const fetchUpcomingMatches = async () => {
    try {
      const response = await axios.get("https://cricapi2.onrender.com/upcoming-matches");
      setUpcomingMatches(response.data.upcoming_matches);
    } catch (error) {
      console.error("Error fetching upcoming matches:", error);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
    fetchUpcomingMatches();
    const interval = setInterval(() => {
      fetchLiveMatches();
      fetchUpcomingMatches();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold text-center mb-10 text-yellow-400">🏏 Cricket Matches</h1>

      {/* Live Matches */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b border-yellow-400 pb-2">🔥 Live Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveMatches.length > 0 ? (
            liveMatches.map((match, index) => (
              <div key={index} className="relative bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                {/* Blinking Red LIVE Tag */}
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                  LIVE 🔴
                </div>

                <h3 className="text-xl font-semibold text-yellow-300">{match.team1} 🆚 {match.team2}</h3>
                <p className="text-gray-300 mt-2">📅 {match.date_time}</p>
                <p className="text-green-400 font-bold mt-1">{match.status}</p>
                <p className="text-gray-200">{match.format} - 📍 {match.venue}</p>
                <p className="text-lg font-medium mt-2">{match.score1} / {match.score2}</p>
                {match.scorecard_url && (
                  <a
                    href={`/scorecard?url=${encodeURIComponent(match.scorecard_url)}`}
                    className="text-blue-400 hover:underline mt-3 inline-block"
                  >
                    📜 View Scorecard
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No live matches available.</p>
          )}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 border-b border-yellow-400 pb-2">🚀 Upcoming Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingMatches.length > 0 ? (
            upcomingMatches.map((match, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-xl font-semibold text-yellow-300">{match.team1} 🆚 {match.team2}</h3>
                <p className="text-gray-300 mt-2">📅 {match.date_time}</p>
                <p className="text-green-400 font-bold mt-1">{match.status}</p>
                <p className="text-gray-200">{match.format} - 📍 {match.venue}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No upcoming matches available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Matches;
