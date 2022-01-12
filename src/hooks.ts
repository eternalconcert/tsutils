import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { from, Observable, timer } from "rxjs";
import { switchMap } from "rxjs/operators";
import { BaseApi } from "./api";


export const useItemFetcher = <T,>(api: BaseApi<T>): [T | undefined, Dispatch<SetStateAction<T | undefined>>]=> {
  const [ state, setState ] = useState<T>();
  const abortController = new AbortController();

  useEffect(() => {
    api.fetchItem().then(v => setState(v));

    return () => abortController.abort();
  }, []);
  return [state, setState];
}


export const useItemsFetcher = <T,>(api: BaseApi<T>): [T[] | undefined, Dispatch<SetStateAction<T[] | undefined>>]=> {
  const [ state, setState ] = useState<T[]>();
  const abortController = new AbortController();

  useEffect(() => {
    api.fetchItems().then(v => setState(v));

    return () => abortController.abort();
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


export const useObservable = <T,>(obs: Observable<T>): T | null => {
  const [current, setCurrent] = useState<T | null>(null);
  const obsRef = useRef(obs);

  useEffect(() => {
    obsRef.current = obs;
    setCurrent(null);

    const sub = obs.subscribe((c) => { setCurrent(c); });
    return () => {
      sub.unsubscribe();
    };
  }, [obs]);

  return Object.is(obsRef.current, obs) ? current : null;
}
