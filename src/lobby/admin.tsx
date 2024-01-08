import React from 'react';
import axios from 'axios';
import { LineChart, XAxis, YAxis, Line, Tooltip, ResponsiveContainer } from 'recharts';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3Time from 'd3-time';

interface AdminProp {
  server: string;
}

interface AdminState {
  playerData: any[];
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
    this.state = { playerData: [] };
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
    const data = await this.getPlayerData();

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

    this.state.playerData = data.map((d) => {
      return { created_at: new Date(d.created_at) };
    });
  }

  render() {
    const binnedData = d3Array
      .bin<{ created_at: Date }, Date>()
      .value((d) => d.created_at)
      .thresholds((_value, min, max) => {
        return d3Scale.scaleUtc().domain([min, max]).ticks(d3Time.utcMonth);
      })(this.state.playerData);

    const newPlayerData = binnedData.map((b) => {
      return { created_at: b.x0, players: b.length };
    });

    return (
      <div style={baseStyle}>
        <h3>
          Users: <span className="badge">{this.state.playerData.length}</span>
        </h3>
        <ResponsiveContainer width="95%" height={300}>
          <LineChart data={newPlayerData}>
            <XAxis dataKey="created_at" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="players" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
