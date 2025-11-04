import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import "./SearchSection.css";
import { movieForMeApiURL } from '../APIs/config';
import SearchBar from './AutoComplete';

interface SearchSectionProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  searchByDescription: boolean;
  toggleSearchByDescription: () => void;
  handleSearchMovies: () => void;
  inputsDisabled: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  searchByDescription,
  toggleSearchByDescription,
  handleSearchMovies,
  inputsDisabled
}) => {
  return (
    <section className='searchSection'>
      <h1>Ready to find your next movie?</h1>

      <ToggleSwitch
        label="Search by Description"
        checked={searchByDescription}
        onChange={toggleSearchByDescription}
        disabled={inputsDisabled}
      />

      <div className={`searchSection ${searchByDescription ? "hideSection" : "showSection"}`}>
        <h2>Search similar movies by Title</h2>
        <SearchBar searchValue={title}
        setSearchValue={setTitle}
        searchAPIURL = {`${movieForMeApiURL}search/title`}
        />
      </div>

      <div className={`searchSection ${searchByDescription ? "showSection" : "hideSection"}`}>
        <h2>Search similar movies by Description</h2>
        <textarea value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={inputsDisabled} />
      </div>

      <button onClick={handleSearchMovies}
        disabled={inputsDisabled}>
        Search
      </button>
    </section>
  );
};

export default SearchSection;
