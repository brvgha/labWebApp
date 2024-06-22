import React, { useContext } from "react"
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromMustWatch from "../components/cardIcons/removeFromMustWatch";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/movieFilterUI";

const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};
const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};


const MustWatchMoviesPage: React.FC = () => {
    const { mustwatch: movieIds } = useContext(MoviesContext);
    const { filterValues, setFilterValues, filterFunction } = useFiltering(
        [titleFiltering, genreFiltering]
    );
    console.log(movieIds);

  // Create an array of queries and run them in parallel.
  const mustWatchMoviesQuery = useQueries(
    movieIds.map((movieId: { toString: () => string; }) => {
      return {
        queryKey: ["movie", movieId],
        queryFn: () => getMovie(movieId.toString()),
      };
    })
  );

  // Check if any of the parallel queries is still loading.
  const isLoading = mustWatchMoviesQuery.find((m) => m.isLoading === true);

  if (isLoading) {
    return <Spinner />;
  }

  const allMustWatch = mustWatchMoviesQuery.map((q) => q.data);
  const displayedMovies = allMustWatch
    ? filterFunction(allMustWatch)
    : [];

  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value: value };
    const updatedFilterSet =
      type === "title" ? [changedFilter, filterValues[1]] : [filterValues[0], changedFilter];
    setFilterValues(updatedFilterSet);
  };


  return (
    <>
      <PageTemplate
        title="Must Wacth Upcoming Movies"
        movies={displayedMovies}
        action={(movie) => {
          return (
          <>
            <RemoveFromMustWatch {...movie} />
          </>
          );
        }}
      />
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
      />
    </>
  );
};

export default MustWatchMoviesPage;