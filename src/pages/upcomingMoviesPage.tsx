import React from "react";
import { getUpcomingMovies } from "../api/tmdb-api";
import { BaseMovieProps, DiscoverMovies } from "../types/interfaces";
import PageTemplate from '../components/templateMovieListPage';
import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";

const UpcomingMoviesPage: React.FC = () => {
    const { data, error, isLoading, isError } = useQuery<DiscoverMovies, Error>("upcoming", getUpcomingMovies);
    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return <h1>{error.message}</h1>;
    }

    const movies = data ? data.results: [];
    return (
        <PageTemplate
            title='Upcoming Movies'
            movies={movies}
            action={(movie: BaseMovieProps) => {
                return <AddToFavouritesIcon {...movie} />
            }}
        />
    )
};

export default UpcomingMoviesPage