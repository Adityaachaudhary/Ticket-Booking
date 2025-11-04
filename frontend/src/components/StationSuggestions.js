import React, { useState, useEffect } from 'react';

const MAJOR_STATIONS = [
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
  { code: 'SBC', name: 'Bangalore City', city: 'Bangalore' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
  { code: 'LJN', name: 'Lucknow Junction', city: 'Lucknow' },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna' },
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati' },
  { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi' },
  { code: 'TVC', name: 'Trivandrum Central', city: 'Thiruvananthapuram' },
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar' },
  { code: 'VSKP', name: 'Visakhapatnam', city: 'Visakhapatnam' },
  { code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada' },
  { code: 'MAO', name: 'Madgaon', city: 'Goa' },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu' }
];

const StationSuggestions = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (value.length > 1) {
      const filtered = MAJOR_STATIONS.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.city.toLowerCase().includes(value.toLowerCase()) ||
        station.code.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleSuggestionClick = (station) => {
    onChange(station.city);
    setShowSuggestions(false);
  };

  return (
    <div className="station-input-container">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => value.length > 1 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        required
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((station) => (
            <div
              key={station.code}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(station)}
            >
              <div className="station-info">
                <span className="station-name">{station.name}</span>
                <span className="station-code">({station.code})</span>
              </div>
              <span className="station-city">{station.city}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StationSuggestions;