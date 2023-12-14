import { ReactNode } from 'react';

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
