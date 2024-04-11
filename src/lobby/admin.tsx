import React from 'react';
import axios from 'axios';
import { LineChart, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3Time from 'd3-time';

interface AdminProp {
  server: string;
}

export interface LatestGames {
  complete: any[];
  ongoing: any[];
}

interface AdminState {
  playerData: any[];
  gameData: any[];
  roomData: any[];
  latestPlayers: any[];
  latestGames: LatestGames;
}

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

const HOUR = 60 * 60 * 1000;

const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 4 * WEEK;

export class ITCGAdmin extends React.Component<AdminProp, AdminState> {
  state: AdminState;

  constructor(prop: AdminProp) {
    super(prop);
    this.state = {
      playerData: [],
      gameData: [],
      roomData: [],
      latestPlayers: [],
      latestGames: { ongoing: [], complete: [] },
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

  async getLatestGames(): Promise<LatestGames> {
    const resp = await axios
      .get('/stats/games/latest', {
        baseURL: this.props.server,
        timeout: 5000,
        withCredentials: true,
      })
      .catch((err) => {
        console.error(err);
      });

    if (resp) return resp.data;
    return { ongoing: [], complete: [] };
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

  async getLatestPlayers(): Promise<any[]> {
    const resp = await axios
      .get('/stats/users/latest', {
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
    const [playerData, gameData, roomData, latestPlayers, latestGames] =
      await Promise.all([
        this.getPlayerData(),
        this.getGameData(),
        this.getRoomData(),
        this.getLatestPlayers(),
        this.getLatestGames(),
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

    this.setState({
      playerData: playerData.map((d) => {
        return { created_at: new Date(d.created_at) };
      }),
      gameData: gameData.map((d) => {
        return {
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
          gameover: d.gameover,
        };
      }),
      roomData,
      latestPlayers,
      latestGames,
    });
  }

  roomTable() {
    const rooms = this.state.roomData.map((r) => {
      return (
        <tr>
          <td>{r.p1}</td>
          <td>{r.p2}</td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Guest</th>
          </tr>
        </thead>
        <tbody>{rooms.reverse()}</tbody>
      </table>
    );
  }

  completeGameTable() {
    const games = this.state.latestGames.complete.map((g) => {
      return (
        <tr>
          <td>{new Date(g.ended).toLocaleDateString()}</td>
          <td>{g.winner}</td>
          <td>{g.loser}</td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Winner</th>
            <th>Loser</th>
          </tr>
        </thead>
        <tbody>{games.reverse()}</tbody>
      </table>
    );
  }

  ongoingGameTable() {
    const games = this.state.latestGames.ongoing.map((g) => {
      return (
        <tr>
          <td>{g.p1}</td>
          <td>{g.p2}</td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Player 1</th>
            <th>Player 2</th>
          </tr>
        </thead>
        <tbody>{games.reverse()}</tbody>
      </table>
    );
  }

  userTable() {
    const players = this.state.latestPlayers.map((u) => {
      return (
        <tr>
          <td>{new Date(u.created_at).toLocaleDateString()}</td>
          <td>{u.username}</td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>{players.reverse()}</tbody>
      </table>
    );
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
      (g) => g.gameover?.winner === '0'
    ).length;
    const unfinishedGames = this.state.gameData.filter((g) => !g.gameover).length;
    const totalGames = this.state.gameData.length;
    const startingAdvantage = Math.trunc(
      (startingWins / (totalGames - unfinishedGames)) * 100
    );

    const orderedGameTimeMS = this.state.gameData
      .filter((g) => !!g.gameover)
      .map((g) => {
        return g.updatedAt.getTime() - g.createdAt.getTime();
      })
      .sort((a, b) => (a > b ? 1 : -1));

    const p95Idx =
      Math.ceil((95 / 100) * this.state.gameData.filter((g) => !!g.gameover).length) - 1;
    const p95GameTimeMin = (orderedGameTimeMS[p95Idx] / 1000 / 60).toFixed(1);

    const p75Idx =
      Math.ceil((75 / 100) * this.state.gameData.filter((g) => !!g.gameover).length) - 1;
    const p75GameTimeMin = (orderedGameTimeMS[p75Idx] / 1000 / 60).toFixed(1);

    const p50Idx =
      Math.ceil((50 / 100) * this.state.gameData.filter((g) => !!g.gameover).length) - 1;
    const p50GameTimeMin = (orderedGameTimeMS[p50Idx] / 1000 / 60).toFixed(1);

    const p25Idx =
      Math.ceil((25 / 100) * this.state.gameData.filter((g) => !!g.gameover).length) - 1;
    const p25GameTimeMin = (orderedGameTimeMS[p25Idx] / 1000 / 60).toFixed(1);

    const binnedGameData = d3Array
      .bin<{ createdAt: Date }, Date>()
      .value((d) => d.createdAt)
      .thresholds((_value, min, max) => {
        return d3Scale.scaleTime().domain([min, max]).ticks(d3Time.utcMonth);
      })(this.state.gameData);

    const newGameData = binnedGameData.map((b) => {
      return { created_at: b.x0, players: b.length };
    });

    const now = Date.now();
    const userChangeDay = this.state.playerData.filter(
      (pl) => now - pl.created_at.valueOf() < DAY
    ).length;
    const userDayBadge = `badge ${userChangeDay > 0 ? 'success' : ''}`;
    const userChangeWeek = this.state.playerData.filter(
      (pl) => now - pl.created_at.valueOf() < WEEK
    ).length;
    const userWeekBadge = `badge ${userChangeWeek > 0 ? 'success' : ''}`;
    const userChangeMonth = this.state.playerData.filter(
      (pl) => now - pl.created_at.valueOf() < MONTH
    ).length;
    const userMonthBadge = `badge ${userChangeMonth > 0 ? 'success' : ''}`;
    const gameChangeDay = this.state.gameData.filter(
      (pl) => now - pl.updatedAt.valueOf() < DAY
    ).length;
    const gameDayBadge = `badge ${gameChangeDay > 0 ? 'success' : ''}`;
    const gameChangeWeek = this.state.gameData.filter(
      (pl) => now - pl.updatedAt.valueOf() < WEEK
    ).length;
    const gameWeekBadge = `badge ${gameChangeWeek > 0 ? 'success' : ''}`;
    const gameChangeMonth = this.state.gameData.filter(
      (pl) => now - pl.updatedAt.valueOf() < MONTH
    ).length;
    const gameMonthBadge = `badge ${gameChangeMonth > 0 ? 'success' : ''}`;

    return (
      <div style={baseStyle}>
        <div className="row" style={{ width: '100%' }}>
          <div className="col sm-8">
            <h4>
              Users: <span className="badge primary">{this.state.playerData.length}</span>{' '}
              - - - - - - Day: <span className={userDayBadge}>{userChangeDay}</span> Week:{' '}
              <span className={userWeekBadge}>{userChangeWeek}</span> Month:{' '}
              <span className={userMonthBadge}>{userChangeMonth}</span>
            </h4>
            <ResponsiveContainer height={150}>
              <LineChart data={newPlayerData}>
                <XAxis dataKey="created_at" />
                <YAxis />
                <Line type="monotone" dataKey="players" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="col sm-4 padding-top margin-top">
            <h4 className="margin-none">Newest Users</h4>
            {this.userTable()}
          </div>
          <div className="col sm-8">
            <h4>
              Games: <span className="badge primary">{totalGames}</span> - - - - - - Day:{' '}
              <span className={gameDayBadge}>{gameChangeDay}</span> Week:{' '}
              <span className={gameWeekBadge}>{gameChangeWeek}</span> Month:{' '}
              <span className={gameMonthBadge}>{gameChangeMonth}</span>
            </h4>
            <ResponsiveContainer height={150}>
              <LineChart data={newGameData}>
                <XAxis dataKey="created_at" />
                <YAxis />
                <Line type="monotone" dataKey="players" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="col sm-4 padding-top margin-top">
            <h4 className="margin-none">Latest Games</h4>
            {this.completeGameTable()}
          </div>
          <div className="col sm-4">
            <h4 className="margin-none padding-top">
              Starting Adv: <span className="badge">{startingAdvantage}%</span>
            </h4>
            <h4 className="margin-none padding-top">
              p95 Game Time (min): <span className="badge">{p95GameTimeMin}</span>
            </h4>
            <h4 className="margin-none padding-top">
              p75 Game Time (min): <span className="badge">{p75GameTimeMin}</span>
            </h4>
            <h4 className="margin-none padding-top">
              p50 Game Time (min): <span className="badge">{p50GameTimeMin}</span>
            </h4>
            <h4 className="margin-none padding-top">
              p25 Game Time (min): <span className="badge">{p25GameTimeMin}</span>
            </h4>
          </div>
          <div className="col sm-4">
            <h4 className="margin-none padding-top">Rooms</h4>
            {this.roomTable()}
          </div>
          <div className="col sm-4">
            <h4 className="margin-none padding-top">Ongoing Games</h4>
            {this.ongoingGameTable()}
          </div>
        </div>
      </div>
    );
  }
}
