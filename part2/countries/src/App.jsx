import { useState, useEffect } from 'react'

// Access your API key from .env.local (e.g., VITE_API_KEY)
const API_KEY = import.meta.env.VITE_API_KEY;
console.log(API_KEY);

function CountryInfo({ country }) {
  const {
    name: { common: nameCommon } = {},
    capital = [],
    area,
    population,
    languages = {},
    flags = {}
  } = country;

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!capital.length) return;
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(capital[0])}&aqi=no`;
    fetch(url)
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => setWeather(null));
  }, [capital]);

  return (
    <div>
      <h2>{nameCommon}</h2>
      <div>Capital: {capital.join(', ')}</div>
      <div>Area: {area} km²</div>
      <div>Population: {population}</div>
      <h3>Languages:</h3>
      <ul>
        {Object.values(languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      {flags.png && (
        <img
          src={flags.png}
          alt={nameCommon + ' flag'}
          width="240"
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#fff',
            display: 'block'
          }}
        />
      )}
      {weather && weather.current && (
        <div style={{marginTop: '1em'}}>
          <h3>Weather in {capital}</h3>
          <div>Temperature: {weather.current.temp_c}°C</div>
          <div>Condition: {weather.current.condition.text}</div>
          {weather.current.condition.icon && (
            <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
          )}
          <div>Wind: {weather.current.wind_kph} kph</div>
        </div>
      )}
    </div>
  );
}
function FilterInput({ filter, setFilter }) {
  return (
    <div>
      <label>find countries</label>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
    </div>
  );
}

function CountryList({ countries, onShow }) {
  return (
    <ul>
      {countries.map(country => (
        <li key={country.cca3}>
          {country.name.common}
          <button onClick={() => onShow(country.name.common)} style={{ marginLeft: 8 }}>show</button>
        </li>
      ))}
    </ul>
  );
}

function CountryDisplay({ filter, filteredCountries, setFilter }) {
  if (filter === '') return null;
  if (filteredCountries.length > 10) return <div>Too many matches</div>;
  if (filteredCountries.length === 1) return <CountryInfo country={filteredCountries[0]} />;
  return <CountryList countries={filteredCountries} onShow={setFilter} />;
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name && country.name.common && country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <FilterInput filter={filter} setFilter={setFilter} />
      <CountryDisplay filter={filter} filteredCountries={filteredCountries} setFilter={setFilter} />
    </>
  )
}

export default App
