import { useMemo } from "react";
import Fuse from "fuse.js";

const useFuseSearch = function <T>(
  list: T[] | undefined,
  searchTerm: string,
  options?: Fuse.IFuseOptions<T>,
  searchOptions?: Fuse.FuseSearchOptions,
) {
  const fuse = useMemo(() => {
    if (list === undefined) {
      return undefined;
    }

    return new Fuse(list, options);
  }, [list, options]);

  const results = useMemo(() => {
    if (fuse === undefined) {
      return undefined;
    }

    return fuse.search(searchTerm, searchOptions);
  }, [fuse, searchOptions, searchTerm]);

  return results;
};

export default useFuseSearch;
