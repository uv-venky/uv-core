export type ActionName = string;
export type ActionParams<T extends ActionName> = any[];
export type ActionOutput<T extends ActionName> = Promise<any>;
