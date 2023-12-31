import { useEffect, useRef, useState } from "react";
import StarRating from './StarRating';
import { useMovies } from "./useMovies";
import { useLocaleStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "a981d1a5";

export default function App() {

  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");

  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocaleStorageState([], "watched");

  const handleSelectMovie = (id) => {
    setSelectedId(selectId => 
      selectId === id 
      ? null 
      : id
    );
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  const handleAddWatch = (movie) => {
    setWatched(watched => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]))
  }

  const handleDeleteWatched = (id) =>  {
    setWatched(watched => watched.filter(movie => movie.imdbId !== id))
  }

  return (
    <>
      <NavBar>
        <Search query={query} onQuery={setQuery} onCloseMovie={handleCloseMovie} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>

        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          { isLoading && <Loader /> }
          { !isLoading && !error && 
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} /> 
          }
          { error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId 
            ? <MovieDetails 
                selectedId={selectedId} 
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatch}
                watched={watched}
                movies={movies}
              />
            :<>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          
          }
        </Box>
      </Main>
    </>
  );
}

const Loader = () => {
  return <p className="loader">Loading...</p>
}

const ErrorMessage = ({message}) => {
  return <p className="error"><span>⛔</span>{message}<span>⛔</span></p>
}

const NavBar = ({children}) => {

  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  )
}

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

const NumResult = ({movies}) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

const Search = ({query, onQuery, onCloseMovie}) => {

  const inputEl = useRef(null);

  const actionEnter = () => {
    if(document.activeElement === inputEl.current) return;
    inputEl.current.focus()
    onQuery('');
    onCloseMovie();
  }

  useKey("Enter", actionEnter)

  // useEffect(() => {
  
  //   const callback = (e) => {
  //     if(document.activeElement === inputEl.current) return;
  //     if(e.code === "Enter") {
  //       inputEl.current.focus()
  //       onQuery('');
  //       onCloseMovie();
  //     };
      
  //   }
  //   document.addEventListener('keydown', callback)

  //   return () => document.removeEventListener("keydown", callback)
  // }, [onQuery, onCloseMovie])

  //NotGood
  // useEffect(() => {
  //   const el = document.querySelector(".search");
  //   console.log(el);
  //   el.focus();
  // }, [])



  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onQuery(e.target.value)}
      ref={inputEl}
    />
  )
}

const Main = ({children}) => {

  return (
    <main className="main">
      {children}
    </main>
  )
}

const  Box = ({ children }) => {

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        children
      )}
    </div>
  )
}

const MovieList = ({movies, onSelectMovie}) => {

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie 
          movie={movie} 
          key={movie.imdbID} 
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  )
}

const Movie = ({movie, onSelectMovie}) => {

  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

const MovieDetails = ({selectedId, onCloseMovie, onAddWatched, watched, movies}) => {

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('')

  const countRef = useRef(0);

  useEffect(() => {
    if(userRating) countRef.current++;
  }, [userRating])

  const isWatched = watched.map((movie) => movie.imdbId).includes(selectedId);
  const watchedUserRating = watched.find(movie => movie.imdbId === selectedId)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // Wrong !!!!!
  // if(imdbRating > 8) {const [isTop, setIsTop] = useState(true)}

  useKey("Escape", onCloseMovie);

  // useEffect(() => {

  //   const callBack = (e) => {
  //     if(e.code === "Escape") {
  //       onCloseMovie();
  //     }
  //   }
  //   document.addEventListener("keydown", callBack)
    
  //   return () =>{
  //     document.removeEventListener("keydown", callBack)
  //   }
  // }, [onCloseMovie])

  useEffect(() => {
    const getMovieDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}&plot=full`);
        const data = await res.json();
        setMovie(data)
        if(!res.ok) throw new Error("Something went wrong")
      } catch (err) {
        console.error(err.message)
      } finally {
        setIsLoading(false);
      }
      
      
    }
    getMovieDetails();
  },[selectedId])

  useEffect(() => {
    if(!title) return;
    document.title = `Movie | ${title}`

    // return function() {}
    return () => {
      document.title = "UsePopcorn";
      // console.log(`Clean up effect for movie ${title}`)
    }

  }, [title])

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(' ').at(0),
      userRating,
      countRatingDecision: countRef.current,
    }

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }



  return (
    <div className="details">
      {isLoading ? <Loader /> : 
      <>
        <header>
          <button 
            className="btn-back"
            onClick={onCloseMovie}
          >
            &larr;
          </button>
          <img src= {poster} alt={`Poster of ${title} movie`} />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>{genre}</p>
            <p><span>⭐</span>{imdbRating} IMDB rating</p>
          </div>
        </header>
        <section>
        <div className="rating">
    
          {!isWatched ?
            <>
            <StarRating 
              maxRating={10} 
              size={24}
              onSetRating={setUserRating}
            />
            {userRating > 0 && (<button 
              className="btn-add"
              onClick={handleAdd}
            >
              + Add to list
            </button> )
            }
          </>
          : <p>You rated this movie <span>🌟</span> {watchedUserRating}</p>
          }
        
        </div>
          <p><em>{plot}</em></p>
          <p>Starring {actors}</p>
          <p>Directed by {director}</p>
        </section>
      </>
      }
    </div>
  )
}

const WatchedSummary = ({watched}) => {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

const WatchedMoviesList = ({watched, onDeleteWatched}) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbId} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  )
}

const WatchedMovie = ({movie, onDeleteWatched}) => {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button 
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbId)}
        >X</button>

      </div>
    </li>
  )
}