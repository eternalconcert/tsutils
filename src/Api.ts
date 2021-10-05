import { encodeParams } from './utils';


export class BaseApi<T> {
  url: string;
  constructor(url: string) {
    this.url = url
  }

  fetchItem = (params?: any): Promise<T> => fetch(
    `${this.url}/${params ? `?${encodeParams(params)}` : '' }`)
    .then(val => val.json()).then(r => r.item);

  fetchItems = (params?: any): Promise<T[]> => fetch(
      `${this.url}/${params ? `?${encodeParams(params)}` : '' }`)
    .then(val => val.json()).then(r => r.items);
}

export const nodesApi = new BaseApi<Node>('/api/nodes');
