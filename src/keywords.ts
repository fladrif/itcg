export const keywords = ['confused', 'fierce', 'stealthy', 'tough'] as const;
export type Keywords = typeof keywords;
export type Keyword = Keywords[number];
