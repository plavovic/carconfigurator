import React, { useEffect, useMemo, useState } from "react";
import "./Configurator.css";
import { fetchModels } from "../api/models";
import { http } from "../api/http";
import { ConfiguratorProvider, useConfigurator } from "../context/ConfiguratorContext";
import ModelCard from "../components/ModelCard";
import OptionCard from "../components/OptionCard";
import exportPdf from "../components/exportPdf";
import NavBar from "../components/NavBar";

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

function Stepper() {
  const { model, setModel, selected, setSelected, toggleOption, clearCategory, total, basePrice } = useConfigurator();
  const [models, setModels] = useState([]);
  const [options, setOptions] = useState([]);
  const [step, setStep] = useState(1); // 1: model, 2: options, 3: summary
  const [error, setError] = useState("");
  const [previewImages, setPreviewImages] = useState(null);
  const [currentImageAngle, setCurrentImageAngle] = useState('threeQuarter'); // front, threeQuarter, side, rear, interior

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
        const o = await http.get(model ? `/api/options?modelId=${model.id}` : "/api/options");
        setOptions(o);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [model]);

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

  // When changing model, reset selections
  useEffect(() => {
    setSelected({});
  }, [model, setSelected]);

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
          <div className="models-grid">
            {models.map((m) => (
              <ModelCard
                key={m.id}
                model={m}
                image={modelImages[m.name] || TaycanImage}
                selected={model?.id === m.id}
                onSelect={() => setModel(m)}
              />)
            )}
          </div>
          <div className="sticky-pricebar">
            <span>{model ? `${model.name} selected` : "Choose a model to continue"}</span>
            <button disabled={!model} onClick={() => setStep(2)} className="btn-primary">Next</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24, height: 'calc(100vh - 200px)' }}>
            {/* Live Preview Section - Fixed */}
            <div style={{ position: 'sticky', top: 20, alignSelf: 'start' }}>
              <h3>Live Preview</h3>
              <div style={{ background: '#f9f9f9', borderRadius: 12, padding: 16 }}>
                {previewImages && previewImages[currentImageAngle] && (
                  <img 
                    src={previewImages[currentImageAngle]} 
                    alt="Car preview"
                    style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    onError={(e) => {
                      // Fallback to static image
                      e.target.src = modelImages[model?.name] || TaycanImage;
                    }}
                  />
                )}
                {/* Image angle selector */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
                  {['front', 'threeQuarter', 'side', 'rear', 'interior'].map(angle => (
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
                  ))}
                </div>
              </div>
            </div>

            {/* Options Section - Scrollable */}
            <div style={{ overflowY: 'auto', paddingRight: 12 }}>
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
                        style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 8, background: "white" }}
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
            </div>
          </div>
          <div className="sticky-pricebar">
            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={() => setStep(3)} className="btn-primary">Review</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2>Summary</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              {/* Show multiple angles in summary */}
              <div style={{ marginBottom: 16 }}>
                {previewImages ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {previewImages.front && (
                      <div>
                        <img src={previewImages.front} alt="Front view" style={{ width: "100%", borderRadius: 8 }} />
                        <p style={{ textAlign: 'center', fontSize: 12, color: '#666', margin: '4px 0' }}>Front</p>
                      </div>
                    )}
                    {previewImages.threeQuarter && (
                      <div>
                        <img src={previewImages.threeQuarter} alt="3/4 view" style={{ width: "100%", borderRadius: 8 }} />
                        <p style={{ textAlign: 'center', fontSize: 12, color: '#666', margin: '4px 0' }}>3/4 View</p>
                      </div>
                    )}
                    {previewImages.rear && (
                      <div>
                        <img src={previewImages.rear} alt="Rear view" style={{ width: "100%", borderRadius: 8 }} />
                        <p style={{ textAlign: 'center', fontSize: 12, color: '#666', margin: '4px 0' }}>Rear</p>
                      </div>
                    )}
                    {previewImages.interior && (
                      <div>
                        <img src={previewImages.interior} alt="Interior" style={{ width: "100%", borderRadius: 8 }} />
                        <p style={{ textAlign: 'center', fontSize: 12, color: '#666', margin: '4px 0' }}>Interior</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <img src={modelImages[model?.name] || TaycanImage} alt={model?.name} style={{ width: "100%", objectFit: "contain" }} />
                )}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{model?.name}</div>
              <div>Base: ${basePrice.toLocaleString()}</div>
              <div style={{ marginTop: 12 }}>
                {Object.entries(selected).map(([cat, items]) => (
                  <div key={cat} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>{cat}</div>
                    <ul style={{ margin: 0 }}>
                      {items.map((i) => (
                        <li key={i.id}>{i.name} (+${Number(i.price_modifier || 0)})</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 18 }}>Total: ${total.toLocaleString()}</div>
            </div>
          </div>
          <div className="sticky-pricebar">
            <button onClick={() => setStep(2)}>Back</button>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => exportPdf({ selected, basePrice, total })}>Export PDF</button>
            </div>
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
