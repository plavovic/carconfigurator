// Model-specific option images (non-wheel tech options)
// Taycan uses its own visuals; other models fall back to Carrera imagery.
const modelOptionImages = {
  Taycan: {
    'HD Matrix LED Headlights': 'https://configurator.porsche.com/model/2026/Y1AAI1/common/detail_M8IU_l_1.jpg?h=671a72c03bf25699133237754d9e2c3d',
    'Night Vision Assist': 'https://configurator.porsche.com/model/2026/Y1AAI1/common/detail_M9R1_l_0.jpg?h=4f64ebdef6029f0b111cd4f3c6d50003'
  },
  Default: {
    'HD Matrix LED Headlights': 'https://configurator.porsche.com/model/2026/9921B2/common/detail_M8IU_l_0.jpg?h=8b73bd638d413078ba1b7d27d67e86f6',
    'Night Vision Assist': 'https://configurator.porsche.com/model/2026/9921B2/common/detail_M9R1_l_0.jpg?h=65823b01e1fa23dab6056fdcf5124f57'
  }
};

module.exports = modelOptionImages;
