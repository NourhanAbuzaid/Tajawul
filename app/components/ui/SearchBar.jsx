import React, { useState, useEffect } from "react";
import styles from "./Search.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { WhiteLoading } from "./Loading";

const ENDPOINTS = {
  all: "/Search",
  user: "/Search/user",
  destination: "/Search/destination",
  trip: "/Search/trip",
  event: "/Search/event",
};

const SearchBar = ({ searchType = "all", size = "default" }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const endpoint = ENDPOINTS[searchType] || ENDPOINTS.all;

  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      const url =
        searchType === "all"
          ? `${baseUrl}${endpoint}?query=${query}&mode=wildcard`
          : `${baseUrl}${endpoint}?query=${query}`;

      const res = await fetch(url);
      const data = await res.json();

      if (searchType === "destination") {
        setResults(data.destinations || []);
      } else if (searchType === "user") {
        setResults(data.users || []);
      } else if (searchType === "trip") {
        setResults(data.trips || []);
      } else if (searchType === "event") {
        setResults(data.events || []);
      } else {
        setResults(data); // For "all"
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder={`Search ${
            searchType !== "all" ? searchType : "anything"
          }...`}
          value={query}
          onChange={handleChange}
          className={`${styles.searchInput} ${
            size === "large" ? styles.searchInputLarge : ""
          }`}
        />
        <div className={styles.searchIcon}>
          {isLoading ? <WhiteLoading /> : <SearchIcon sx={{ fontSize: 34 }} />}
        </div>
      </div>
      {results && (
        <div className={styles.searchResults}>
          {searchType === "all" && (
            <>
              <Section
                title="Users"
                data={results.users}
                renderItem={(u) => `${u.firstName} ${u.lastName}`}
              />
              <Section
                title="Destinations"
                data={results.destinations}
                renderItem={(d) => d.name}
              />
              <Section
                title="Trips"
                data={results.trips}
                renderItem={(t) => t.title}
              />
              <Section
                title="Events"
                data={results.events}
                renderItem={(e) => e.name}
              />
            </>
          )}
          {searchType !== "all" && Array.isArray(results) && (
            <Section
              title={searchType}
              data={results}
              renderItem={(item) => item.name || item.title}
            />
          )}
        </div>
      )}
    </div>
  );
};

const Section = ({ title, data, renderItem }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className={styles.section}>
      <h3>{title}</h3>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{renderItem(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
