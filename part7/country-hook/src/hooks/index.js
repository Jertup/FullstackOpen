import { useState, useEffect } from 'react';

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (!name) {
      setCountry(null);
      return;
    }
    fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
      .then(response => {
        if (!response.ok) {
          setCountry({ found: false });
          return;
        }
        return response.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setCountry({ found: true, data: data[0] });
        } else {
          setCountry({ found: false });
        }
      })
      .catch(() => setCountry({ found: false }));
  }, [name]);

  return country;
};

export { useCountry };