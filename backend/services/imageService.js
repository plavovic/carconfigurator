/**
 * Image Service for Porsche Car Configurator
 * Generates Porsche image URLs using their official image API
 */

const PORSCHE_IMAGE_BASE_URL = 'https://prs.porsche.com/iod/image';
const DEFAULT_REGION = 'WW'; // Worldwide
const DEFAULT_CLIENT_ID = 'icc';

/**
 * Image angle IDs
 */
const IMAGE_ANGLES = {
  FRONT: 1,          // Front view
  THREE_QUARTER: 2,  // 3/4 front view
  SIDE: 3,           // Side view
  REAR: 4,           // Rear view
  INTERIOR: 5        // Interior view
};

/**
 * Generate Porsche image URL
 * @param {string} modelCode - Porsche model code (e.g., 'Y1AEN1' for Taycan)
 * @param {string} configCode - Configuration code with all options encoded
 * @param {number} angle - Image angle ID (1=front, 2=3/4, 3=side, 4=rear, 5=interior)
 * @param {string} region - Region code (default: 'WW')
 * @param {string} clientId - Client ID (default: 'icc')
 * @returns {string} - Complete image URL
 */
function generateImageUrl(modelCode, configCode, angle = IMAGE_ANGLES.FRONT, region = DEFAULT_REGION, clientId = DEFAULT_CLIENT_ID) {
  if (!modelCode || !configCode) {
    return null;
  }
  
  return `${PORSCHE_IMAGE_BASE_URL}/${region}/${modelCode}/${angle}/${configCode}?clientId=${clientId}`;
}

/**
 * Generate all image URLs for a car model configuration
 * @param {string} modelCode - Porsche model code
 * @param {string} configCode - Configuration code
 * @returns {object} - Object with all image angles
 */
function generateModelImages(modelCode, configCode) {
  if (!modelCode || !configCode) {
    return {
      front: null,
      threeQuarter: null,
      side: null,
      rear: null,
      interior: null
    };
  }

  return {
    front: generateImageUrl(modelCode, configCode, IMAGE_ANGLES.FRONT),
    threeQuarter: generateImageUrl(modelCode, configCode, IMAGE_ANGLES.THREE_QUARTER),
    side: generateImageUrl(modelCode, configCode, IMAGE_ANGLES.SIDE),
    rear: generateImageUrl(modelCode, configCode, IMAGE_ANGLES.REAR),
    interior: generateImageUrl(modelCode, configCode, IMAGE_ANGLES.INTERIOR)
  };
}

/**
 * Generate image URL for an option (color, wheel, etc.)
 * For colors, this returns the model with that color applied
 * @param {string} modelCode - Porsche model code
 * @param {string} baseConfigCode - Base configuration code
 * @param {string} optionCode - Option code to apply
 * @param {number} angle - Image angle ID
 * @returns {string} - Image URL with option applied
 */
function generateOptionImage(modelCode, baseConfigCode, optionCode, angle = IMAGE_ANGLES.THREE_QUARTER) {
  if (!modelCode || !baseConfigCode || !optionCode) {
    return null;
  }
  
  // For now, use the base config code with the option
  // In a real implementation, you'd need to encode the option into the config code
  return generateImageUrl(modelCode, baseConfigCode, angle);
}

/**
 * Generate image array for a configuration with selected options
 * @param {string} modelCode - Porsche model code
 * @param {string} baseConfigCode - Base configuration code
 * @param {Array} selectedOptions - Array of selected option codes
 * @returns {object} - Object with image URLs
 */
function generateConfigurationImages(modelCode, baseConfigCode, selectedOptions = []) {
  // In a real implementation, you would:
  // 1. Build a new config code by combining base config with selected options
  // 2. Generate images with the combined config code
  
  // For now, we'll use the base config code
  // You'll need to implement the Porsche config code builder based on their API docs
  
  return generateModelImages(modelCode, baseConfigCode);
}

/**
 * Get placeholder image based on category
 * @param {string} category - Option category (e.g., 'Exterior Color', 'Wheels')
 * @returns {string} - Placeholder image URL or null
 */
function getPlaceholderImage(category) {
  const placeholders = {
    'Exterior Color': '/images/placeholder-color.png',
    'Wheels': '/images/placeholder-wheel.png',
    'Interior': '/images/placeholder-interior.png',
    'Technology': '/images/placeholder-tech.png'
  };
  
  return placeholders[category] || null;
}

/**
 * Build a configuration code from options
 * This is a placeholder - you'll need to implement based on Porsche's encoding
 * @param {string} baseConfigCode - Base configuration code
 * @param {Array} options - Array of option objects with codes
 * @returns {string} - New configuration code
 */
function buildConfigCode(baseConfigCode, options = []) {
  // TODO: Implement Porsche's configuration code builder
  // This requires understanding their encoding format
  // For now, return the base config code
  return baseConfigCode;
}

module.exports = {
  IMAGE_ANGLES,
  generateImageUrl,
  generateModelImages,
  generateOptionImage,
  generateConfigurationImages,
  getPlaceholderImage,
  buildConfigCode
};
