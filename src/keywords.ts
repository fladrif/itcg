export const keywords = ['confused', 'fierce', 'stealthy', 'tough'] as const;

type Keywords = typeof keywords;

export type Keyword = Keywords[number];
