# Image API Integration Guide

## Overview
This document describes the new image API system that uses Porsche's official image service instead of storing images in the database.

## System Architecture

### Image Service
Location: `backend/services/imageService.js`

The image service generates Porsche image URLs using their official API:
```
https://prs.porsche.com/iod/image/WW/{modelCode}/{angle}/{configCode}?clientId=icc
```

### Image Angles
- **1 (FRONT)**: Front view
- **2 (THREE_QUARTER)**: 3/4 front view  
- **3 (SIDE)**: Side view
- **4 (REAR)**: Rear view
- **5 (INTERIOR)**: Interior view

## Database Changes

### car_models Table
- Removed: `image_url`, `front_image_url`
- Added: 
  - `model_code` VARCHAR(50) - Porsche model code (e.g., 'Y1AEN1' for Taycan)
  - `config_code` VARCHAR(255) - Base configuration code for Porsche image API

### options Table
- Removed: `image_url`
- Added:
  - `option_code` VARCHAR(50) - Porsche option code
  - `hex_color` VARCHAR(7) - Hex color code for paint colors (e.g., '#000000')

## API Endpoints

### Models
- `GET /api/models` - Get all models with image arrays
- `GET /api/models/:id` - Get single model with images
- `GET /api/models/:id/images?configCode=...` - Get model images with custom config

### Options
- `GET /api/options?modelId=X&category=Y` - Get options with generated image URLs

### Configurations
- `GET /api/configurations/user/:userId` - Get user configurations with images
- `GET /api/configurations/:id` - Get configuration with images
- `POST /api/configurations` - Save new configuration
- `POST /api/configurations/preview` - Get preview images without saving

## Response Format

### Model Response
```json
{
  "id": 1,
  "name": "Taycan",
  "model_code": "Y1AEN1",
  "config_code": "N4Igxg9gdgZglgc...",
  "base_price": 103000,
  "images": {
    "front": "https://prs.porsche.com/iod/image/WW/Y1AEN1/1/...",
    "threeQuarter": "https://prs.porsche.com/iod/image/WW/Y1AEN1/2/...",
    "side": "https://prs.porsche.com/iod/image/WW/Y1AEN1/3/...",
    "rear": "https://prs.porsche.com/iod/image/WW/Y1AEN1/4/...",
    "interior": "https://prs.porsche.com/iod/image/WW/Y1AEN1/5/..."
  },
  "image_url": "...",  // Backward compatibility
  "front_image_url": "..."  // Backward compatibility
}
```

### Option Response
```json
{
  "id": 1,
  "category": "Exterior Color",
  "name": "Jet Black",
  "option_code": "C9X",
  "hex_color": "#000000",
  "price_modifier": 0,
  "image_url": "https://prs.porsche.com/iod/image/..."
}
```

## Frontend Integration

### Components Updated
1. **ModelCard.jsx** - Uses `model.images.threeQuarter` with fallback
2. **OptionCard.jsx** - Shows color swatches for paint colors, uses API images for other options
3. **Configurator.jsx** - Live preview with angle selector

### Live Preview Feature
The configurator now shows:
- Real-time updates as options are selected
- Multiple viewing angles (front, 3/4, side, rear, interior)
- Image angle selector buttons
- Fallback to static images if API fails

### Example Usage
```jsx
// Get preview images for current configuration
const images = await http.post('/api/configurations/preview', {
  modelId: model.id,
  optionIds: [1, 5, 8, 12]  // Selected option IDs
});

// Display specific angle
<img src={images.threeQuarter} alt="Preview" />
```

## Configuration Code Builder

### Current Status
The `buildConfigCode()` function in `imageService.js` is a placeholder. You need to implement Porsche's configuration code encoding based on their API documentation.

### Implementation Notes
1. Get Porsche's config code format documentation
2. Understand how options are encoded into the config string
3. Implement the builder to combine base config + selected options
4. Test with real Porsche API endpoints

## Migration Guide

### Database Migration
Run the updated `schema.sql` to:
1. Add new columns (`model_code`, `config_code`, `option_code`, `hex_color`)
2. Remove old columns (`image_url` in options)
3. Update sample data with proper codes

### Testing Checklist
- [ ] Models endpoint returns images array
- [ ] Options endpoint returns image URLs
- [ ] Preview endpoint generates correct images
- [ ] Frontend displays images with fallback
- [ ] Color swatches display correctly
- [ ] Angle selector works in configurator
- [ ] Summary page shows multiple angles

## Porsche Model Codes

### Known Codes
- **Taycan**: Y1AEN1
- **911/992**: 992
- **Cayenne**: E3
- **Macan**: 95B

### Configuration Code Format
The config code is a base64-like encoded string that contains:
- Model variant
- Selected options
- Colors, wheels, interior
- Technology packages

**Note**: You'll need to obtain the official encoding specification from Porsche to properly build custom config codes.

## Future Enhancements

1. **Config Code Builder**: Implement proper Porsche config encoding
2. **Caching**: Add CDN/caching layer for frequently accessed images
3. **Image Optimization**: Add loading states and progressive loading
4. **Fallback Strategy**: Implement smart fallbacks for missing images
5. **Option Combinations**: Validate compatible option combinations
6. **360° Views**: Add support for 360-degree car views if available

## Troubleshooting

### Images Not Loading
- Check if model has valid `model_code` and `config_code`
- Verify Porsche API is accessible
- Check browser console for CORS errors
- Ensure fallback images are available

### Preview Not Updating
- Verify `/api/configurations/preview` endpoint is working
- Check network tab for API calls
- Ensure option IDs are being sent correctly
- Clear browser cache

### Color Swatches Wrong
- Verify `hex_color` values in database
- Check if colors match Porsche's official palette
- Ensure color codes have `#` prefix

## Support
For issues or questions, check:
- Backend logs for API errors
- Browser console for frontend errors  
- Network tab for API response inspection
