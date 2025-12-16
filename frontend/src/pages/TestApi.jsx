import { useEffect, useMemo, useState } from "react";
import exportPdf from "../components/exportPdf";

export default function TestApi() {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState({}); // { [category]: Option[] }
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/options")
      .then((res) => res.json())
      .then(setOptions)
      .catch((e) => setError(e.message));
  }, []);

  const grouped = useMemo(() => {
    return options.reduce((acc, o) => {
      (acc[o.category] ||= []).push(o);
      return acc;
    }, {});
  }, [options]);

  const basePrice = 60000;

  const total = useMemo(() => {
    const selectedArrays = Object.values(selected); // Option[][]
    const extras = selectedArrays
      .flat()
      .reduce((sum, o) => sum + Number(o.price_modifier || 0), 0);
    return basePrice + extras;
  }, [selected]);

  const toggleOption = (category, option) => {
    setSelected((prev) => {
      const current = prev[category] || [];
      const exists = current.some((x) => x.id === option.id);

      const nextCategory = exists
        ? current.filter((x) => x.id !== option.id)
        : [...current, option];

      return { ...prev, [category]: nextCategory };
    });
  };

  const clearCategory = (category) => {
    setSelected((prev) => ({ ...prev, [category]: [] }));
  };

  if (error) return <pre>Error: {error}</pre>;
  if (!options.length) return <pre>Loading...</pre>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Car Configurator</h1>
      <h2>Total: {total}</h2>

      {Object.entries(grouped).map(([category, items]) => {
        const selectedInCategory = selected[category] || [];

        return (
          <div key={category} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h3 style={{ margin: 0 }}>{category}</h3>
              <button
                onClick={() => clearCategory(category)}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: "white",
                }}
              >
                Clear
              </button>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
              {items.map((option) => {
                const isSelected = selectedInCategory.some((x) => x.id === option.id);

                return (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(category, option)}
                    style={{
                      padding: 12,
                      border: isSelected ? "2px solid black" : "1px solid #ccc",
                      borderRadius: 8,
                      cursor: "pointer",
                      minWidth: 160,
                      textAlign: "left",
                      background: isSelected ? "#f5f5f5" : "white",
                    }}
                  >
                    <div>
                      <b>{option.name}</b>
                    </div>
                    <div style={{ fontSize: 12 }}>{option.description}</div>
                    <div style={{ marginTop: 6 }}>+{Number(option.price_modifier)}</div>
                  </button>
                );
              })}
            </div>

            <p>
              Selected:{" "}
              <b>
                {selectedInCategory.length
                  ? selectedInCategory.map((o) => o.name).join(", ")
                  : "None"}
              </b>
            </p>
            
          </div>
        );
      })}
      <div className="pdf-button">
        <button onClick={() => exportPdf({ selected, basePrice, total })}
        style={{
        padding: 10,
        borderRadius: 8,
        border: "1px solid #ccc",
        cursor: "pointer",
        marginBottom: 16,
        }}>
        Export PDF
      </button>

      </div>
    </div>
    
  );
}
