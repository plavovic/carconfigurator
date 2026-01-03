import React, { useEffect, useMemo, useState } from "react";
import "./Configurator.css";
import { fetchModels } from "../api/models";
import { http } from "../api/http";
import { ConfiguratorProvider, useConfigurator } from "../context/ConfiguratorContext";
import ModelCard from "../components/ModelCard";
import OptionCard from "../components/OptionCard";
import exportPdf from "../components/exportPdf";
import NavBar from "../components/NavBar";
import carreraImageMatrix from "../data/carreraImageMatrix.json";
import taycanImageMatrix from "../data/taycanImageMatrix.json";
import macanImageMatrix from "../data/macanImageMatrix.json";
import cayenneImageMatrix from "../data/cayenneImageMatrix.json";
import { interiorImageLinks, taycanInteriorImageLinks, macanInteriorImageLinks, cayenneInteriorImageLinks } from "../api/imageLinks";

import TaycanImage from "../images/porschetaycan.png";
import NineElevenImage from "../images/porsche911.png";
import CayenneImage from "../images/porschecayenne.png";
import MacanImage from "../images/porschemacan.png";

const modelImages = {
  Taycan: TaycanImage,
  "911": NineElevenImage,
  "911 Carrera": NineElevenImage,
  Cayenne: CayenneImage,
  Macan: MacanImage,
};

const angleOptions = ['threeQuarter', 'side', 'rear', 'interior'];

function Stepper() {
  const { model, setModel, selected, setSelected, toggleOption, clearCategory, total, basePrice } = useConfigurator();
  const [models, setModels] = useState([]);
  const [options, setOptions] = useState([]);
  const [step, setStep] = useState(1); // 1: model, 2: options, 3: summary
  const [error, setError] = useState("");
  const [previewImages, setPreviewImages] = useState(null);
  const [currentImageAngle, setCurrentImageAngle] = useState('threeQuarter'); // available angles defined in angleOptions
  const [availableInventory, setAvailableInventory] = useState([]);
  const [inventoryError, setInventoryError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const m = await fetchModels();
        setModels(m);
      } catch (e) {
        // Fallback to static list if API not ready
        setModels([
          { id: 1, name: "Taycan", base_price: 103000 },
          { id: 2, name: "911 Carrera", base_price: 95000 },
          { id: 3, name: "Cayenne", base_price: 85000 },
          { id: 4, name: "Macan", base_price: 65000 },
        ]);
      }
      try {
        if (!model) {
          setOptions([]);
          setError("");
          return;
        }
        const o = await http.get(`/api/options?modelId=${model.id}`);
        setOptions(o);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [model]);

  useEffect(() => {
    if (!model && step !== 1) setStep(1);
  }, [model, step]);

  // Update preview images when selections change
  useEffect(() => {
    if (model && step === 2) {
      const updatePreview = async () => {
        try {
          // Get all selected option IDs
          const selectedOptionIds = Object.values(selected).flat().map(opt => opt.id);
          
          // Request preview images
          const images = await http.post('/api/configurations/preview', {
            modelId: model.id,
            optionIds: selectedOptionIds
          });
          
          setPreviewImages(images);
        } catch (e) {
          console.error('Failed to load preview images:', e);
          // Fallback to model's default images
          if (model.images) {
            setPreviewImages(model.images);
          }
        }
      };
      
      updatePreview();
    }
  }, [model, selected, step]);

  const grouped = useMemo(() => {
    return options.reduce((acc, o) => {
      (acc[o.category] ||= []).push(o);
      return acc;
    }, {});
  }, [options]);

  // Ensure a default 911 baseline is selected (Jet Black + 19" Standard) so preview has an image immediately
  useEffect(() => {
    if (!model || !options.length) return;
    const is911 = (model.name || '').includes('911');
    if (!is911) return;

    const jetBlack = options.find((o) => o.category === 'Exterior Color' && o.name.toLowerCase().includes('black'));
    const nineteenStd = options.find((o) => o.category === 'Wheels' && o.name.includes('19" Standard'));

    if (!jetBlack && !nineteenStd) return;

    setSelected((prev) => {
      const next = { ...prev };
      if (jetBlack && !(next['Exterior Color']?.length)) next['Exterior Color'] = [jetBlack];
      if (nineteenStd && !(next['Wheels']?.length)) next['Wheels'] = [nineteenStd];
      return next;
    });
  }, [model, options, setSelected]);

  // Ensure a default Interior is selected for ALL models (Black Leather)
  useEffect(() => {
    if (!model || !options.length) return;

    const blackLeather = options.find(
      (o) => o.category === 'Interior' && o.name.toLowerCase().includes('black')
    );

    if (!blackLeather) return;

    setSelected((prev) => {
      // Don't override an existing interior choice
      if (prev['Interior']?.length) return prev;
      return { ...prev, Interior: [blackLeather] };
    });
  }, [model, options, setSelected]);

  // Ensure a default Taycan baseline is selected (Jet Black + 19" Standard) so preview has an image immediately
  useEffect(() => {
    if (!model || !options.length) return;
    const isTaycan = (model.name || '') === 'Taycan';
    if (!isTaycan) return;

    const jetBlack = options.find((o) => o.category === 'Exterior Color' && o.name.toLowerCase().includes('black'));
    const nineteenStd = options.find((o) => o.category === 'Wheels' && o.name.includes('19" Standard'));

    if (!jetBlack && !nineteenStd) return;

    setSelected((prev) => {
      const next = { ...prev };
      if (jetBlack && !(next['Exterior Color']?.length)) next['Exterior Color'] = [jetBlack];
      if (nineteenStd && !(next['Wheels']?.length)) next['Wheels'] = [nineteenStd];
      return next;
    });
  }, [model, options, setSelected]);

  // Ensure a default Macan baseline is selected (Jet Black + 20" Standard) so preview has an image immediately
  useEffect(() => {
    if (!model || !options.length) return;
    const isMacan = (model.name || '') === 'Macan';
    if (!isMacan) return;

    const jetBlack = options.find((o) => o.category === 'Exterior Color' && o.name.toLowerCase().includes('black'));
    const twentyStd = options.find((o) => o.category === 'Wheels' && o.name.includes('20" Standard'));

    if (!jetBlack && !twentyStd) return;

    setSelected((prev) => {
      const next = { ...prev };
      if (jetBlack && !(next['Exterior Color']?.length)) next['Exterior Color'] = [jetBlack];
      if (twentyStd && !(next['Wheels']?.length)) next['Wheels'] = [twentyStd];
      return next;
    });
  }, [model, options, setSelected]);

  // Ensure a default Cayenne baseline is selected (Jet Black + 20" Standard) so preview has an image immediately
  useEffect(() => {
    if (!model || !options.length) return;
    const isCayenne = (model.name || '') === 'Cayenne';
    if (!isCayenne) return;

    const jetBlack = options.find((o) => o.category === 'Exterior Color' && o.name.toLowerCase().includes('black'));
    const twentyStd = options.find((o) => o.category === 'Wheels' && o.name.includes('20" Standard'));

    if (!jetBlack && !twentyStd) return;

    setSelected((prev) => {
      const next = { ...prev };
      if (jetBlack && !(next['Exterior Color']?.length)) next['Exterior Color'] = [jetBlack];
      if (twentyStd && !(next['Wheels']?.length)) next['Wheels'] = [twentyStd];
      return next;
    });
  }, [model, options, setSelected]);

  const selectedColor = selected['Exterior Color']?.[0]?.name;
  const selectedWheel = selected['Wheels']?.[0]?.name;
  const selectedInterior = selected['Interior']?.[0]?.name;

  const colorKey = useMemo(() => {
    if (!selectedColor) return null;
    const lc = selectedColor.toLowerCase();
    if (lc.includes('black')) return 'Black';
    if (lc.includes('white')) return 'White';
    if (lc.includes('grey') || lc.includes('gray')) return 'Grey';
    if (lc.includes('blue')) return 'Blue';
    if (lc.includes('yellow')) return 'Yellow';
    return null;
  }, [selectedColor]);

  const wheelKey = useMemo(() => {
    if (!selectedWheel) return null;
    const modelName = model?.name || '';
    if (modelName === 'Taycan') {
      const lc = selectedWheel.toLowerCase();
      if (lc.includes('19')) return '19" Standard';
      if (lc.includes('20')) return '20" Turbo Sport';
      if (lc.includes('21')) return '21" Mission E';
      return null;
    }
    if (modelName === 'Macan') {
      const lc = selectedWheel.toLowerCase();
      if (lc.includes('20')) return '20" Standard';
      if (lc.includes('21')) return '21" Offroad Style';
      if (lc.includes('22')) return '22" RS Spyder';
      return null;
    }
    if (modelName === 'Cayenne') {
      const lc = selectedWheel.toLowerCase();
      if (lc.includes('20')) return '20" Standard';
      if (lc.includes('21')) return '21" Exclusive';
      if (lc.includes('22')) return '22" Sport Design';
      return null;
    }
    const lc = selectedWheel.toLowerCase();
    if (lc.includes('19')) return '19" Standard';
    if (lc.includes('20') || lc.includes('classic')) return '20" Carrera Classic';
    if (lc.includes('21') || lc.includes('carrera s')) return '21" Carrera S';
    if (lc.includes('22') || lc.includes('turbo')) return '22" Turbo';
    return null;
  }, [selectedWheel, model]);

  const staticImagesCayenne = useMemo(() => {
    const name = model?.name || '';
    if (name !== 'Cayenne' || !colorKey || !wheelKey) return null;
    const byColor = cayenneImageMatrix[colorKey];
    const byWheel = byColor?.[wheelKey];
    if (!byWheel) return null;
    const result = {};
    angleOptions.forEach((angle) => {
      if (byWheel[angle]) result[angle] = byWheel[angle];
    });
    return Object.keys(result).length ? result : null;
  }, [model, colorKey, wheelKey]);

  const staticImagesMacan = useMemo(() => {
    const name = model?.name || '';
    if (name !== 'Macan' || !colorKey || !wheelKey) return null;
    const byColor = macanImageMatrix[colorKey];
    const byWheel = byColor?.[wheelKey];
    if (!byWheel) return null;
    const result = {};
    angleOptions.forEach((angle) => {
      if (byWheel[angle]) result[angle] = byWheel[angle];
    });
    return Object.keys(result).length ? result : null;
  }, [model, colorKey, wheelKey]);

  const staticImagesTaycan = useMemo(() => {
    const name = model?.name || '';
    if (name !== 'Taycan' || !colorKey || !wheelKey) return null;
    const byColor = taycanImageMatrix[colorKey];
    const byWheel = byColor?.[wheelKey];
    if (!byWheel) return null;
    const result = {};
    angleOptions.forEach((angle) => {
      if (byWheel[angle]) result[angle] = byWheel[angle];
    });
    return Object.keys(result).length ? result : null;
  }, [model, colorKey, wheelKey]);

  const staticImages911 = useMemo(() => {
    const name = model?.name || '';
    if (!name.includes('911') || !colorKey || !wheelKey) return null;
    const byColor = carreraImageMatrix[colorKey];
    const byWheel = byColor?.[wheelKey];
    if (!byWheel) return null;
    const result = {};
    angleOptions.forEach((angle) => {
      if (byWheel[angle]) result[angle] = byWheel[angle];
    });
    return Object.keys(result).length ? result : null;
  }, [model, colorKey, wheelKey]);

  const imagesToUse = useMemo(() => {
    const base = staticImages911 || staticImagesTaycan || staticImagesMacan || staticImagesCayenne || previewImages || null;
    if (!base) return null;
    const withInterior = { ...base };
    const interiorMap = (model?.name === 'Taycan')
      ? taycanInteriorImageLinks
      : (model?.name === 'Macan')
        ? macanInteriorImageLinks
        : (model?.name === 'Cayenne')
          ? cayenneInteriorImageLinks
        : interiorImageLinks;
    const interiorImg = selectedInterior && interiorMap[selectedInterior];
    if (interiorImg) withInterior.interior = interiorImg;
    return Object.keys(withInterior).length ? withInterior : null;
  }, [staticImages911, staticImagesTaycan, staticImagesMacan, staticImagesCayenne, previewImages, selectedInterior, model]);

  useEffect(() => {
    if (!imagesToUse) return;
    if (!imagesToUse[currentImageAngle]) {
      const firstAvailable = angleOptions.find((a) => imagesToUse[a]);
      if (firstAvailable) setCurrentImageAngle(firstAvailable);
    }
  }, [imagesToUse, currentImageAngle]);

  // When changing model, reset selections
  useEffect(() => {
    setSelected({});
  }, [model, setSelected]);

  // Load available inventory for the selected model on the review step.
  useEffect(() => {
    if (!model || step !== 3) {
      setAvailableInventory([]);
      setInventoryError("");
      return;
    }

    (async () => {
      try {
        setInventoryError("");
        const selectedOptionIds = Object.values(selected)
          .flat()
          .map((opt) => opt.id);

        const inv = await http.post('/api/inventory/available', {
          carModelId: model.id,
          selectedOptionIds,
        });

        setAvailableInventory(Array.isArray(inv) ? inv : []);
      } catch (e) {
        setAvailableInventory([]);
        setInventoryError(e.message || 'Failed to load available cars');
      }
    })();
  }, [model, step, selected]);

  return (
    <div className="configurator-page">
      <header>
        <NavBar />  
      </header>
      <div className="configurator-header">
        <h1 style={{ margin: 0 }}>Car Configurator</h1>
        <div style={{ color: "#666" }}>Total: ${total.toLocaleString()}</div>
      </div>

      {step === 1 && (
        <>
          <h2>Select a Model</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
            {models.length ? (
              models.map((m) => (
                <ModelCard
                  key={m.id}
                  model={m}
                  image={modelImages[m.name] || TaycanImage}
                  selected={model?.id === m.id}
                  onSelect={() => {
                    setModel(m);
                    setStep(2);
                  }}
                />
              ))
            ) : (
              <div style={{ color: '#666' }}>Loading models...</div>
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
            {/* Live Preview Section - Fixed */}
            <div style={{ position: 'sticky', top: 20, alignSelf: 'start' }}>
              <h3>Live Preview</h3>
              <div style={{ background: '#f9f9f9', borderRadius: 12, padding: 24 }}>
                {imagesToUse && imagesToUse[currentImageAngle] ? (
                  <img 
                    src={imagesToUse[currentImageAngle]} 
                    alt="Car preview"
                    style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    onError={(e) => {
                      // Fallback to static image
                      e.target.src = modelImages[model?.name] || TaycanImage;
                    }}
                  />
                ) : (
                  <img 
                    src={modelImages[model?.name] || TaycanImage}
                    alt="Car preview fallback"
                    style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                  />
                )}
                {/* Image angle selector */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {angleOptions.map(angle => (
                    imagesToUse && imagesToUse[angle] ? (
                      <button
                        key={angle}
                        onClick={() => setCurrentImageAngle(angle)}
                        style={{
                          padding: '6px 12px',
                          border: currentImageAngle === angle ? '2px solid black' : '1px solid #ccc',
                          borderRadius: 6,
                          background: currentImageAngle === angle ? '#f5f5f5' : 'white',
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        {angle === 'threeQuarter' ? '3/4' : angle.charAt(0).toUpperCase() + angle.slice(1)}
                      </button>
                    ) : null
                  ))}
                </div>
              </div>
              
              {/* Configuration Summary Panel */}
              <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: 12, padding: 20, marginTop: 16 }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Current Configuration</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ fontWeight: 500 }}>Model:</span>
                    <span style={{ color: '#666' }}>{model?.name}</span>
                  </div>
                  {selectedColor && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                      <span style={{ fontWeight: 500 }}>Color:</span>
                      <span style={{ color: '#666' }}>{selectedColor}</span>
                    </div>
                  )}
                  {selectedWheel && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                      <span style={{ fontWeight: 500 }}>Wheels:</span>
                      <span style={{ color: '#666' }}>{selectedWheel}</span>
                    </div>
                  )}
                  {selected['Interior']?.[0] && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                      <span style={{ fontWeight: 500 }}>Interior:</span>
                      <span style={{ color: '#666' }}>{selected['Interior'][0].name}</span>
                    </div>
                  )}
                  {(() => {
                    const excludeFromAccessories = ['Exterior Color', 'Interior', 'Wheels'];
                    const accessories = Object.entries(selected)
                      .filter(([category]) => !excludeFromAccessories.includes(category))
                      .flatMap(([_, items]) => items);
                    
                    if (accessories.length > 0) {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                          <span style={{ fontWeight: 500 }}>Accessories:</span>
                          <span style={{ color: '#666' }}>{accessories.length}</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>Total Price:</span>
                    <span style={{ fontWeight: 700, fontSize: 18, color: '#000' }}>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Options Section - Scrollable */}
            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              <h2>Customize Options</h2>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {Object.entries(grouped).map(([category, items]) => {
                const selectedInCategory = selected[category] || [];
                return (
                  <div key={category} style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <h3 style={{ margin: 0 }}>{category}</h3>
                      <button
                        onClick={() => clearCategory(category)}
                        style={{ 
                          padding: "8px 16px", 
                          border: "1px solid #d0d0d0", 
                          borderRadius: 6, 
                          background: "white",
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#666',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#f5f5f5';
                          e.target.style.borderColor = '#999';
                          e.target.style.color = '#333';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.borderColor = '#d0d0d0';
                          e.target.style.color = '#666';
                        }}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="options-grid" style={{ marginTop: 12 }}>
                      {items.map((o) => (
                        <OptionCard
                          key={o.id}
                          option={o}
                          selected={selectedInCategory.some((x) => x.id === o.id)}
                          onToggle={() => toggleOption(category, o)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: 16, marginTop: 32, paddingTop: 24, borderTop: '2px solid #e0e0e0' }}>
                <button 
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '14px 32px',
                    border: '2px solid #000',
                    borderRadius: 8,
                    background: 'white',
                    color: '#000',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  ← Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  style={{
                    flex: 1,
                    padding: '14px 32px',
                    border: 'none',
                    borderRadius: 8,
                    background: '#000',
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#333'}
                  onMouseLeave={(e) => e.target.style.background = '#000'}
                >
                  Review →
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2>Review Configuration</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, marginBottom: 32 }}>
            <div>
              {/* Show multiple angles in summary */}
              <div style={{ marginBottom: 16 }}>
                {imagesToUse ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                    {angleOptions.map((angle) => (
                      imagesToUse[angle] && (
                        <div key={angle}>
                          <img src={imagesToUse[angle]} alt={`${angle} view`} style={{ width: "100%", borderRadius: 8 }} />
                          <p style={{ textAlign: 'center', fontSize: 12, color: '#666', margin: '4px 0' }}>{angle === 'threeQuarter' ? '3/4 View' : angle.charAt(0).toUpperCase() + angle.slice(1)}</p>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <img src={modelImages[model?.name] || TaycanImage} alt={model?.name} style={{ width: "100%", objectFit: "contain" }} />
                )}
              </div>
            </div>
            <div>
              <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: 12, padding: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>{model?.name}</div>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>Base: ${basePrice.toLocaleString()}</div>
                
                <div style={{ maxHeight: '50vh', overflowY: 'auto', marginBottom: 20 }}>
                  {Object.entries(selected).length > 0 ? (
                    Object.entries(selected).map(([cat, items]) => (
                      items && (Array.isArray(items) ? items.length > 0 : true) && (
                        <div key={cat} style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: '#333', marginBottom: 8 }}>{cat}</div>
                          <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {(Array.isArray(items) ? items : [items]).map((i) => (
                              <li key={i.id} style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                                {i.name} <span style={{ color: '#999' }}>+${Number(i.price_modifier || 0).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))
                  ) : (
                    <div style={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}>No additional options selected</div>
                  )}
                </div>

                <div style={{ borderTop: '2px solid #000', paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Total Price:</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#000' }}>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Available cars for this model */}
              <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: 12, padding: 18, marginTop: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>
                  Available {model?.name || 'cars'}
                </div>
                {inventoryError ? (
                  <div style={{ fontSize: 12, color: 'red' }}>{inventoryError}</div>
                ) : availableInventory.length ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {availableInventory.map((unit) => (
                      <div
                        key={unit.id}
                        style={{
                          border: '1px solid #f0f0f0',
                          borderRadius: 10,
                          padding: 12,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {unit.label || `Unit #${unit.id}`}
                          </div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            {(unit.dealership_name || 'Dealership')} • {(unit.status || 'available')}
                          </div>
                        </div>

                        {unit.exactMatch ? (
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              border: '1px solid #000',
                              borderRadius: 999,
                              padding: '6px 10px',
                              color: '#000',
                              background: '#fff',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            EXACT MATCH
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}>
                    No available cars found for this model.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Styled Review Screen Buttons */}
          <div style={{ display: 'flex', gap: 20, marginTop: 40, paddingTop: 32, borderTop: '2px solid #e0e0e0', justifyContent: 'space-between' }}>
            <button 
              onClick={() => setStep(2)}
              style={{
                flex: 1,
                padding: '18px 36px',
                border: '2px solid #000',
                borderRadius: 12,
                background: 'white',
                color: '#000',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                letterSpacing: '0.3px',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#000';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateX(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#000';
                e.target.style.transform = 'translateX(0)';
                e.target.style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'translateX(-2px) scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'translateX(-2px)';
              }}
            >
              ← Back to Options
            </button>
            <button 
              onClick={async (e) => {
                const btn = e.currentTarget;
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Generating...';
                btn.disabled = true;
                try {
                  await exportPdf({ 
                    model, 
                    basePrice, 
                    total, 
                    selected, 
                    imagesToUse 
                  });
                  btn.innerHTML = 'PDF Created!';
                  setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                  }, 2000);
                } catch (err) {
                  console.error('PDF export error:', err);
                  btn.innerHTML = 'Error';
                  setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                  }, 2000);
                }
              }}
              style={{
                flex: 1,
                padding: '18px 36px',
                border: 'none',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #000 0%, #222 100%)',
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                letterSpacing: '0.3px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.25)';
                e.target.style.background = 'linear-gradient(135deg, #222 0%, #000 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.target.style.background = 'linear-gradient(135deg, #000 0%, #222 100%)';
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'translateY(-1px) scale(0.99)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'translateY(-3px)';
              }}
            >
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Configurator() {
  return (
    <ConfiguratorProvider>
      <Stepper />
    </ConfiguratorProvider>
  );
}
