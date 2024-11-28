import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Add a CSS file for styling

import { io } from "socket.io-client";
const socket = io("http://localhost:8000/");

function App() {
  const [teams, setTeams] = useState([]);
  const [bidData, setBidData] = useState({
    teamid: "",
    playerid: "",
    amount: "",
  });
  const [bids, setBids] = useState({});

  async function getTeamData() {
    try {
      const res = await axios.get("http://localhost:8000/");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    socket.on("error", (data) => {
      console.log(data);
    });

    socket.on("update", (data) => {
      console.log("updating");
      getTeamData();
    });
    socket.on("bid-placed", (data) => {
      console.log("bidding placed");

      const { playerid, teamid, amount } = data;

      setBids((prevBids) => ({
        ...prevBids,
        [playerid]: {  timer: 20},
      }));
    });

    getTeamData();
  }, []);

  function handleInputChange(e) {
    setBidData({ ...bidData, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setBids((prevBids) => {
        const updatedBids = { ...prevBids };

        Object.keys(updatedBids).forEach((playerid) => {
          if (updatedBids[playerid].timer > 0) {
            updatedBids[playerid].timer -= 1;
          }
        });

        return updatedBids;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const { teamid, playerid, amount } = bidData;
    if (!teamid || !playerid || !amount) {
      return;
    }

    socket.emit("bid", {
      teamid: +teamid,
      playerid: +playerid,
      amount: +amount,
    });

    setBidData({ teamid: "", playerid: "", amount: "" });
  }

  return (
    <div className="container">
      <form className="bidding-form" onSubmit={handleSubmit}>
        <h2>Place Your Bid</h2>
        <div className="form-group">
          <label htmlFor="teamid">Team ID:</label>
          <input
            type="text"
            id="teamid"
            name="teamid"
            value={bidData.teamid}
            onChange={handleInputChange}
            placeholder="Enter Team ID"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="playerid">Player ID:</label>
          <input
            type="text"
            id="playerid"
            name="playerid"
            value={bidData.playerid}
            onChange={handleInputChange}
            placeholder="Enter Player ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Bid Amount:</label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={bidData.amount}
            onChange={handleInputChange}
            placeholder="Enter Bid Amount"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Place Bid
        </button>
      </form>

      <div>
        {teams.map((team, index) => (
          <div className="team-table" key={team.teamid}>
            <h2>
              {team.team} - {team.teamid}
            </h2>
            <table>
              <thead>
                <tr>
                  <th>Player Id</th>
                  <th>Player Name</th>
                  <th>Role</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {team.players.map((player) => (
                  <tr
                    key={player.playerid}
                    className={
                      player.status ? "status-available" : "status-placed"
                    }
                  >
                    <td>{player.playerid}</td>
                    <td>{player.fullname}</td>
                    <td>{player.role}</td>
                    <td>{player.baseprice} lacs</td>
                    <td>
                      {player.status ? "Available" : "Placed"}
                    </td>
                    <td>
                      {bids[player.playerid]?.timer > 0
                        ? `${bids[player.playerid].timer}s`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
