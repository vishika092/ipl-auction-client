import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function getTeamData() {
      try {
        let res = await axios.get("http://5.75.237.233:8000/");
        setTeams(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getTeamData();
  }, []);
  return (
    <>
      <table border="1">
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Player Name</th>
            <th>Role</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) =>
            team.players.map((player) => (
              <tr key={player.id}>
                <td>{team.team}</td>
                <td>{player.fullname}</td>
                <td>{player.role}</td>
                <td>{player.baseprice}</td>
                <td>{player.status ? "Available" : "Placed"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default App;
