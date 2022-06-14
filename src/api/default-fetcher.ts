const fetcher = <A>(url: RequestInfo) =>
  fetch(url).then((res) => res.json() as Promise<A>);

export default fetcher;
