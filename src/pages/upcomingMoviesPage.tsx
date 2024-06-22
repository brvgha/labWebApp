import React, { useEffect, useState } from "react";
import { getUpcomingMovies } from "../api/tmdb-api";
import { BaseMovieProps } from "../types/interfaces";
import PageTemplate from '../components/templateMovieListPage';

const UpcomingMoviesPage: React.FC = () => {
    const [movies, setMovies] = useState<BaseMovieProps[]>([]);
    const favourites = movies.filter(m => m.favourite)
    localStorage.setItem('favourites', JSON.stringify(favourites))
    // New function
    const addToFavourites = (movieId: number) => {
        const updatedMovies = movies.map((m: BaseMovieProps) =>
        m.id === movieId ? { ...m, favourite: true } : m
        );
        setMovies(updatedMovies);
    };
    useEffect(() => {
        getUpcomingMovies().then(movies => {
            setMovies(movies);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <PageTemplate
            title='Discover Movies'
            movies={movies}
            action={addToFavourites}
        />
    )
};

export default UpcomingMoviesPage