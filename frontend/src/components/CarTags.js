import React from 'react';
import "./CarTags.css";

export default function CarTags({ fuelType, tags = [] }) {
    const normalize = (s) => (s || '').toString();

    // derive a friendly fuel label when fuelType is provided
    let fuelLabel = null;
    let fuelKey = null;
    if (fuelType) {
        const ft = normalize(fuelType).toLowerCase();
        fuelKey = ft.replace(/\s+/g, '-');
        if (ft === 'electric' || ft === 'ev') fuelLabel = 'Electric';
        else if (ft === 'gasoline' || ft === 'petrol' || ft === 'gas') fuelLabel = 'Gasoline';
        else if (ft === 'diesel') fuelLabel = 'Diesel';
        else fuelLabel = normalize(fuelType);
    }

    // If fuelType wasn't explicitly provided, detect it in the tags array
    const tagList = Array.isArray(tags) ? tags.filter(Boolean) : [];
    if (!fuelLabel) {
        for (const t of tagList) {
            const v = normalize(t).toLowerCase();
            if (v === 'electric' || v === 'ev') {
                fuelLabel = 'Electric';
                fuelKey = 'electric';
                break;
            }
            if (v === 'gasoline' || v === 'petrol' || v === 'gas') {
                fuelLabel = 'Gasoline';
                fuelKey = 'gasoline';
                break;
            }
            if (v === 'diesel') {
                fuelLabel = 'Diesel';
                fuelKey = 'diesel';
                break;
            }
        }
    }

    // build tag objects so we can add classes for fuel tags; remove the fuel tag from the normal tags
    const allTags = [];
    if (fuelLabel) allTags.push({ text: fuelLabel, type: 'fuel', key: fuelKey });
    tagList.forEach(t => {
        const v = normalize(t).toLowerCase();
        // skip if this tag was used as the fuel label to avoid duplicates
        if (fuelKey && (v === fuelKey || (fuelKey === 'electric' && (v === 'ev')))) return;
        allTags.push({ text: t, type: 'tag' });
    });

    if (allTags.length === 0) return null;

    return (
        <div className="car-tags">
            {allTags.map((t, i) => (
                <span
                    key={i}
                    className={
                        t.type === 'fuel'
                            ? `tag fuel ${'fuel-' + (t.key || '').toLowerCase()}`
                            : 'tag'
                    }
                >
                    {t.text}
                </span>
            ))}
        </div>
    );
}
