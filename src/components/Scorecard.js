import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Scorecard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const scorecardUrl = queryParams.get("url");

  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveScore, setLiveScore] = useState(null);
  const [matchId, setMatchId] = useState(null); // Store match ID for fetching live scores

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        const response = await axios.get(
          `https://cricapi2.onrender.com/scrape_scorecard?url=${encodeURIComponent(scorecardUrl)}`
        );
        setScorecard(response.data.scorecard);
        setMatchId(response.data.matchId); // Assume API provides a match ID to link live scores
      } catch (error) {
        console.error("Error fetching scorecard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (scorecardUrl) {
      fetchScorecard();
    }
  }, [scorecardUrl]);

  // Fetch live score separately
  useEffect(() => {
    const fetchLiveScore = async () => {
      if (!matchId) return;

      try {
        const liveResponse = await axios.get("https://cricapi2.onrender.com/live-matches");
        const liveMatch = liveResponse.data.live_matches.find(match => match.match_id === matchId);
        
        if (liveMatch) {
          setLiveScore(`${liveMatch.team1} ${liveMatch.score1} - ${liveMatch.team2} ${liveMatch.score2}`);
        }
      } catch (error) {
        console.error("Error fetching live score:", error);
      }
    };

    if (matchId) {
      fetchLiveScore();
      const interval = setInterval(fetchLiveScore, 10000); // Refresh every 10s
      return () => clearInterval(interval);
    }
  }, [matchId]);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-extrabold text-center text-blue-400 mb-6">
        Match Scorecard
      </h1>

      {/* Live Score Display */}
      {liveScore && (
        <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-4 rounded-lg shadow-md text-center mb-8">
          <h2 className="text-xl font-bold">Live Score</h2>
          <p className="text-lg font-semibold">{liveScore}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : scorecard ? (
        scorecard.map((innings, index) => (
          <div key={index} className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              {innings.team}
            </h2>

            {/* Batting Scorecard */}
            <h3 className="text-xl font-semibold text-green-400 mb-3">Batting</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 border border-gray-500">
                <thead className="bg-gray-600 text-white">
                  <tr>
                    {["Batter", "Runs", "Balls", "4s", "6s", "SR", "Dismissal"].map((col) => (
                      <th key={col} className="px-4 py-2 text-left text-sm font-medium">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {innings.players.map((player, i) => (
                    <tr key={i} className="hover:bg-gray-600">
                      {["player", "runs", "balls", "fours", "sixes", "strike_rate", "dismissal"].map((key) => (
                        <td key={key} className="px-4 py-2 text-sm">{player[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fall of Wickets */}
            <h3 className="text-xl font-semibold text-orange-400 mt-6 mb-3">
              Fall of Wickets
            </h3>
            <div className="bg-gray-700 p-4 rounded-md">
              <ul className="list-disc list-inside">
                {innings.fall_of_wickets.map((wicket, i) => (
                  <li key={i} className="text-sm">{wicket}</li>
                ))}
              </ul>
            </div>

            {/* Bowling Scorecard */}
            <h3 className="text-xl font-semibold text-red-400 mt-6 mb-3">
              Bowling
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 border border-gray-500">
                <thead className="bg-gray-600 text-white">
                  <tr>
                    {["Bowler", "Overs", "Maidens", "Runs", "Wickets", "No Balls", "Wides", "Economy"].map((col) => (
                      <th key={col} className="px-4 py-2 text-left text-sm font-medium">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {innings.bowlers.map((bowler, i) => (
                    <tr key={i} className="hover:bg-gray-600">
                      {["bowler", "overs", "maidens", "runs", "wickets", "no_balls", "wides", "economy"].map((key) => (
                        <td key={key} className="px-4 py-2 text-sm">{bowler[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-red-500">No scorecard data available.</p>
      )}
    </div>
  );
};

export default Scorecard;
