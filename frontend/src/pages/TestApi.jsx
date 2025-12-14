
import { useEffect, useState } from "react";

function TestApi() {
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/options")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch options");
        return res.json();
      })
      .then(data => setOptions(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <pre>Error: {error}</pre>;
  if (!options.length) return <pre>Loading...</pre>;

  return <pre>{JSON.stringify(options, null, 2)}</pre>;
}

export default TestApi;
