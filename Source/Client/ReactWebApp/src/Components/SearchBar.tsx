import { useEffect, useState, useRef } from 'react';
import './SearchBar.css';
import axios from 'axios';
import type{ ResultSuggestion } from '../Types';

interface SearchBarProps {
    searchValue: string;
    searchAPIURL: string;
    setSearchValue: (value: string) => void;
    suggestions: ResultSuggestion[];
    setSuggestions: (value: ResultSuggestion[]) => void;
}



const SearchBar: React.FC<SearchBarProps> = ({ searchValue, setSearchValue, searchAPIURL, suggestions, setSuggestions }) => {
    //const [suggestions, setSuggestions] = useState<Result[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const isSelecting = useRef(false);

    //Methods
    useEffect(() => {
        if (searchValue.length < 2) {
            setSuggestions([]);
            return;
        }

        if(isSelecting.current){
            isSelecting.current = false;
            return;
        }

        const delay = setTimeout(() => {
            fetchSuggestions(searchValue);
        }, 300);

        return () => clearTimeout(delay);
    }, [searchValue]);


    const fetchSuggestions = async (query: string) => {
        setIsLoading(true);
        try {
            const response = await axios.get(searchAPIURL, {
                params: { q: query },
            });
            setSuggestions(response.data);
            console.log(suggestions);
        } catch (error) {
            console.error("Error Searching:", error);
        } finally {
            setSearchValue(query);
            setIsLoading(false);
        }
    };

    return (
        <div className="autocomplete">
            <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search movies..."
            />

            {isLoading && <div className="autocomplete-loading">Loading...</div>}

            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((movie) => (
                        <li
                            key={movie.ID}
                            onClick={() => {
                                isSelecting.current = true;
                                setSearchValue(movie.Title);
                                setSuggestions([]);
                            }}
                        >
                            {movie.Title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;