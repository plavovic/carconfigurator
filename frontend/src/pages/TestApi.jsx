import { useEffect, useMemo, useState } from "react";

export default function TestApi() {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/options")
      .then(res => res.json())
      .then(setOptions)
      .catch(e => setError(e.message));
  }, []);

  const grouped = useMemo(() => {
    return options.reduce((acc, o) => {
      (acc[o.category] ||= []).push(o);
      return acc;
    }, {});
  }, [options]);

  const basePrice = 60000;
  const total = basePrice + Object.values(selected).reduce(
    (sum, o) => sum + Number(o.price_modifier),
    0
  );

  if (error) return <pre>Error: {error}</pre>;
  if (!options.length) return <pre>Loading...</pre>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Car Configurator</h1>
      <h2>Total: {total}</h2>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={{ marginBottom: 24 }}>
          <h3>{category}</h3>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {items.map(option => {
              const isSelected = selected[category]?.id === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() =>
                    setSelected(prev => ({ ...prev, [category]: option }))
                  }
                  style={{
                    padding: 12,
                    border: isSelected ? "2px solid black" : "1px solid #ccc",
                    borderRadius: 8,
                    cursor: "pointer",
                    minWidth: 160,
                    textAlign: "left"
                  }}
                >
                  <div><b>{option.name}</b></div>
                  <div style={{ fontSize: 12 }}>{option.description}</div>
                  <div style={{ marginTop: 6 }}>
                    +{Number(option.price_modifier)}
                  </div>
                </button>
              );
            })}
          </div>

          <p>
            Selected: <b>{selected[category]?.name || "None"}</b>
          </p>
        </div>
      ))}
    </div>
  );
}