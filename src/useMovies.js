import { useEffect, useState } from "react";

const KEY = "a981d1a5";

export const useMovies = (query) => {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    // callback?.();

    const controller = new AbortController()

    // async function fetchMovies() {}
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
        { signal: controller.signal });
        
        if(!res.ok) throw new Error("Someting went wrong with fetching movies");
        
        const data = await res.json()
        if(data.Response === "False") throw new Error("Movie not found")

        setMovies(data.Search);
        // console.log(data.Search)
        setError("")
      } catch (err) {
        if(err.name !== "AbortError") {
          setError(err.message);
          console.error(err.message)
        }
      } finally {
        setIsLoading(false);
      }
    }
    if(query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // handleCloseMovie();
    fetchMovies();

    return () => {
      controller.abort();
    }

  }, [query]);

  return { movies, isLoading, error };
}

// We can do a export default. It's just to reconise with function.