import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { from, timer } from "rxjs";
import { switchMap } from "rxjs/operators";
import { BaseApi } from "./Api";


export const useItemFetcher = <T,>(api: BaseApi<T>): [T | undefined, Dispatch<SetStateAction<T | undefined>>]=> {
  const [ state, setState ] = useState<T>();
  useEffect(() => {
    api.fetchItem().then(v => setState(v));
  }, []);
  return [state, setState];
}


export const useItemsFetcher = <T,>(api: BaseApi<T>): [T[] | undefined, Dispatch<SetStateAction<T[] | undefined>>]=> {
  const [ state, setState ] = useState<T[]>();
  useEffect(() => {
    api.fetchItems().then(v => setState(v));
  }, []);
  return [state, setState];
}


export const useWatcher = <T,>(callback: () => Promise<T>): [T | undefined, Dispatch<SetStateAction<T | undefined>>]=> {
  const [ state, setState ] = useState<T>();
  const obs = timer(0, 2000).pipe(switchMap(() => from(callback())));
  useEffect(() => {
    const sub = obs.subscribe(data => setState(data))

    return () => sub.unsubscribe();
  }, [])

  return [state, setState];
}
