import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState(null);

  const handleSubmit = async () => {
    try {
      setError("");
      setResponse(null);
      setFilteredResponse(null);

      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data) throw new Error("Invalid JSON format");

      const result = await axios.post("http://localhost:3000/bfhl", parsedJson);
      setResponse(result.data);
    } catch (err) {
      setError("Invalid JSON input or API error");
    }
  };

  const applyFilters = () => {
    if (!response) return;

    let filteredData = {};
    if (filters.includes("Alphabets"))
      filteredData.alphabets = response.alphabets;
    if (filters.includes("Numbers")) filteredData.numbers = response.numbers;
    if (filters.includes("Highest Lowercase Alphabet"))
      filteredData.highest_lowercase_alphabet =
        response.highest_lowercase_alphabet;

    setFilteredResponse(filteredData);
  };

  return (
    <div className="App">
      <h1>BFHL Test Project</h1>
      <textarea
        placeholder='Enter JSON (e.g., {"data": ["M", "1", "a", "4", "Z"]})'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p className="error">{error}</p>}
      {response && (
        <div>
          <h3>API Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
          <div>
            <h4>Filters:</h4>
            <select
              multiple
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions
                ).map((option) => option.value);
                setFilters(selectedOptions);
              }}
            >
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest Lowercase Alphabet">
                Highest Lowercase Alphabet
              </option>
            </select>
            <button onClick={applyFilters}>Apply Filters</button>
          </div>
          {filteredResponse && (
            <div>
              <h4>Filtered Response:</h4>
              <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;