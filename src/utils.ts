export const encodeParams = (params: {[key: string]: undefined | null | string | number}): string => {
  return Object.keys(params)
    .map(key => [key, params[key]])
    .filter(([_, value]) =>
      value !== null && value !== undefined)
    .map(([key, value]) =>
      `${ key }=${encodeURIComponent((value as any).toString())}`)
    .join('&');
}
