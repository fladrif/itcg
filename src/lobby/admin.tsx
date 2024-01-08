import React from 'react';
import axios from 'axios';
import { LineChart, XAxis, YAxis, Line, Tooltip } from 'recharts';
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
      return { created_at: b.x0, num: b.length };
    });

    return (
      <div style={baseStyle}>
        <h3>
          Users: <span className="badge">{this.state.playerData.length}</span>
        </h3>
        <LineChart width={1000} height={300} data={newPlayerData}>
          <XAxis dataKey="created_at" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="num" stroke="#8884d8" />
        </LineChart>
      </div>
    );
  }
}
