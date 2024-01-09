import React from 'react';
import axios from 'axios';
import {
  Cell,
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3Time from 'd3-time';

interface AdminProp {
  server: string;
}

interface AdminState {
  playerData: any[];
  gameData: any[];
  roomData: any;
}

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGAdmin extends React.Component<AdminProp, AdminState> {
  state: AdminState;

  constructor(prop: AdminProp) {
    super(prop);
    this.state = {
      playerData: [],
      gameData: [],
      roomData: { allRooms: 0, openRooms: 0 },
    };
  }

  async getGameData(): Promise<any[]> {
    const resp = await axios
      .get('/stats/games', {
        baseURL: this.props.server,
        timeout: 5000,
        withCredentials: true,
      })
      .catch((err) => {
        console.error(err);
      });

    if (resp) return resp.data;
    return [];
  }

  async getRoomData(): Promise<any[]> {
    const resp = await axios
      .get('/stats/rooms', {
        baseURL: this.props.server,
        timeout: 5000,
        withCredentials: true,
      })
      .catch((err) => {
        console.error(err);
      });

    if (resp) return resp.data;
    return [];
  }

  async getPlayerData(): Promise<any[]> {
    const resp = await axios
      .get('/stats/users', {
        baseURL: this.props.server,
        timeout: 5000,
        withCredentials: true,
      })
      .catch((err) => {
        console.error(err);
      });

    if (resp) return resp.data;
    return [];
  }

  async componentDidMount() {
    const [playerData, gameData, roomData] = await Promise.all([
      this.getPlayerData(),
      this.getGameData(),
      this.getRoomData(),
    ]);

    // const data = [
    //   { created_at: '2024-01-08T06:59:49.067Z' },
    //   { created_at: '2024-02-08T06:59:49.067Z' },
    //   { created_at: '2024-03-08T06:59:49.067Z' },
    //   { created_at: '2024-04-08T06:59:49.067Z' },
    //   { created_at: '2024-05-08T06:59:49.067Z' },
    //   { created_at: '2024-06-08T06:59:49.067Z' },
    //   { created_at: '2024-07-08T06:59:49.067Z' },
    //   { created_at: '2024-08-08T06:59:49.067Z' },
    //   { created_at: '2024-09-08T06:59:49.067Z' },
    //   { created_at: '2024-10-08T06:59:49.067Z' },
    //   { created_at: '2024-11-08T06:59:49.067Z' },
    //   { created_at: '2024-12-08T06:59:49.067Z' },
    // ];

    this.state.playerData = playerData.map((d) => {
      return { created_at: new Date(d.created_at) };
    });
    this.state.gameData = gameData.map((d) => {
      return { createdAt: new Date(d.createdAt), gameover: d.gameover };
    });
    this.state.roomData = roomData;
  }

  render() {
    const binnedPlayerData = d3Array
      .bin<{ created_at: Date }, Date>()
      .value((d) => d.created_at)
      .thresholds((_value, min, max) => {
        return d3Scale.scaleTime().domain([min, max]).ticks(d3Time.utcMonth);
      })(this.state.playerData);

    const newPlayerData = binnedPlayerData.map((b) => {
      return { created_at: b.x0, players: b.length };
    });

    const startingWins = this.state.gameData.filter(
      (g) => g.gameover?.winner == 0
    ).length;
    const unfinishedGames = this.state.gameData.filter((g) => !g.gameover).length;
    const totalGames = this.state.gameData.length;
    const startingAdvantage = Math.trunc(
      (startingWins / (totalGames - unfinishedGames)) * 100
    );

    const binnedGameData = d3Array
      .bin<{ createdAt: Date }, Date>()
      .value((d) => d.createdAt)
      .thresholds((_value, min, max) => {
        return d3Scale.scaleTime().domain([min, max]).ticks(d3Time.utcMonth);
      })(this.state.gameData);

    const newGameData = binnedGameData.map((b) => {
      return { created_at: b.x0, players: b.length };
    });

    const roomData = [
      {
        name: 'Open',
        value: this.state.roomData.openRooms,
      },
      {
        name: 'Occupied',
        value: this.state.roomData.allRooms - this.state.roomData.openRooms,
      },
    ];

    const gameData = [
      {
        name: 'Completed',
        value: totalGames - unfinishedGames,
      },
      {
        name: 'Ongoing',
        value: unfinishedGames,
      },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
      <div style={baseStyle}>
        <h3>
          Users: <span className="badge">{this.state.playerData.length}</span>
        </h3>
        <ResponsiveContainer width="95%" height={200}>
          <LineChart data={newPlayerData}>
            <XAxis dataKey="created_at" />
            <YAxis />
            <Line type="monotone" dataKey="players" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        <h3>
          First Adv: <span className="badge">{startingAdvantage}%</span>
        </h3>
        <ResponsiveContainer width="95%" height={200}>
          <LineChart data={newGameData}>
            <XAxis dataKey="created_at" />
            <YAxis />
            <Line type="monotone" dataKey="players" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        <div className="row" style={{ width: '100%' }}>
          <div className="col-6">
            <h4>Rooms</h4>
            <ResponsiveContainer width="95%" height={200}>
              <PieChart>
                <Pie data={roomData} nameKey="name" dataKey="value" fill="#8884d8" label>
                  {roomData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="col-6">
            <h4>Games</h4>
            <ResponsiveContainer width="95%" height={200}>
              <PieChart>
                <Pie data={gameData} nameKey="name" dataKey="value" fill="#8884d8" label>
                  {gameData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}
