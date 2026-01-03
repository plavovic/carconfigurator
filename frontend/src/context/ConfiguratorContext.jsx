import React, { createContext, useContext, useMemo, useState } from "react";

const ConfiguratorContext = createContext(null);

export function ConfiguratorProvider({ children }) {
  const [model, setModel] = useState(null); // { id, name, base_price, image_url }
  const [selected, setSelected] = useState({}); // { [category]: Option[] }

  const basePrice = Number(model?.base_price || 0);

  const total = useMemo(() => {
    const extras = Object.values(selected)
      .flat()
      .reduce((sum, o) => sum + Number(o.price_modifier || 0), 0);
    return basePrice + extras;
  }, [selected, basePrice]);

  const exclusiveCategories = ["Wheels", "Exterior Color", "Color", "Interior"]; // only one selectable

  function toggleOption(category, option) {
    setSelected((prev) => {
      const current = prev[category] || [];
      const exists = current.some((x) => x.id === option.id);

      if (exclusiveCategories.includes(category)) {
        // single-select: either this option or none
        const nextCategory = exists ? [] : [option];
        return { ...prev, [category]: nextCategory };
      }

      const nextCategory = exists
        ? current.filter((x) => x.id !== option.id)
        : [...current, option];
      return { ...prev, [category]: nextCategory };
    });
  }

  function clearCategory(category) {
    setSelected((prev) => ({ ...prev, [category]: [] }));
  }

  const value = {
    model,
    setModel,
    selected,
    setSelected,
    toggleOption,
    clearCategory,
    basePrice,
    total,
  };

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) throw new Error("useConfigurator must be used within ConfiguratorProvider");
  return ctx;
}
