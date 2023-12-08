import { ReactNode } from 'react';

export function toGrid(components: ReactNode[]): ReactNode {
  const cards = components.map((comp) => {
    return <div className="sm-6 col">{comp}</div>;
  });

  return <div className="row flex-edges">{cards}</div>;
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
