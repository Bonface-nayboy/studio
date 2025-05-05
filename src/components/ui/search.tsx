"use client";
import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

export default function Search() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300); // debounce to avoid excessive API calls

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search?query=${term}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="p-4 bg-white min-h-screen">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="border p-2 rounded w-full mb-4 text-lg"
      />

      {loading && (
        <Box className="flex justify-center mt-4">
          <CircularProgress size={24} />
        </Box>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!loading && searchTerm.trim() && searchResults.length === 0 && (
        <p className="text-gray-600 mt-4">
          No results found for <strong>"{searchTerm}"</strong>
        </p>
      )}

      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {searchResults.map((result: any) => (
          <div key={result._id} className="border p-4 rounded shadow-sm">
            <img
              src={result.imageUrls?.[0] || "https://picsum.photos/seed/placeholder/400/300"}
              alt={result.name}
              className="w-full h-48 object-contain mb-2"
            />
            <h2 className="text-lg font-semibold">{result.name}</h2>
            {result.description && (
              <p className="text-gray-600 text-sm">{result.description}</p>
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
}
