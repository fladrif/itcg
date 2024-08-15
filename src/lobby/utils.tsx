import { CountableTimeInterval, timeInterval } from 'd3-time';
import { ReactNode } from 'react';

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = 4 * WEEK;

export function toGrid(components: ReactNode[], size?: 'small'): ReactNode {
  const classSetting = size === 'small' ? 'sm-4 col' : 'sm-6 col';

  const cards = components.map((comp) => {
    return <div className={classSetting}>{comp}</div>;
  });

  return <div className="row flex">{cards}</div>;
}

export interface CardOpts {
  title: string;
  body: ReactNode;
  image?: ReactNode;
  links?: [string, ReactNode][];
}

export function timeHour(num: number): CountableTimeInterval {
  return timeInterval(
    (date: Date) => {
      date.setTime(
        date.getTime() -
          date.getMilliseconds() -
          date.getSeconds() * SECOND -
          date.getMinutes() * MINUTE
      );
    },
    (date, step) => {
      date.setTime(+date + step * (num * HOUR));
    },
    (start: Date, end: Date) => {
      return (end.getTime() - start.getTime()) / (num * HOUR);
    },
    (date) => {
      return date.getHours();
    }
  );
}

export function toCard(opts: CardOpts): ReactNode {
  return (
    <div className="card">
      {!!opts.image && opts.image}
      <div className="card-body">
        <h4 className="card-title">{opts.title}</h4>
        <p className="card-text">{opts.body} </p>
        {!!opts.links &&
          opts.links.map((link) => (
            <a className="card-link" href={link[0]}>
              {link[1]}
            </a>
          ))}
      </div>
    </div>
  );
}
