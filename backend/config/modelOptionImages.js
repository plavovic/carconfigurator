// Model-specific option images (non-wheel tech options)
// Taycan uses its own visuals; other models fall back to Carrera imagery.
const modelOptionImages = {
  Taycan: {
    'HD Matrix LED Headlights': 'https://configurator.porsche.com/model/2026/Y1AAI1/common/detail_M8IU_l_1.jpg?h=671a72c03bf25699133237754d9e2c3d',
    'Night Vision Assist': 'https://configurator.porsche.com/model/2026/Y1AAI1/common/detail_M9R1_l_0.jpg?h=4f64ebdef6029f0b111cd4f3c6d50003'
  },
  Cayenne: {
    // Provided Cayenne-specific images
    'LED HD Matrix Headlights': 'https://configurator.porsche.com/model/2026/9YBAI1/common/detail_M8IU_l_1.jpg?h=824d97f26e2e5fd698331bf75734dcdb',
    'Led HD Matrix Headlights': 'https://configurator.porsche.com/model/2026/9YBAI1/common/detail_M8IU_l_1.jpg?h=824d97f26e2e5fd698331bf75734dcdb',
    'HD Matrix LED Headlights': 'https://configurator.porsche.com/model/2026/9YBAI1/common/detail_M8IU_l_1.jpg?h=824d97f26e2e5fd698331bf75734dcdb',

    'Rear Axle Steering': 'https://configurator.porsche.com/model/2026/9YBAI1/common/detail_M0N5_l_0.jpg?h=a98517e1ebb1a27b9b77fdd3c984808a',
    'Rear-Axle Steering': 'https://configurator.porsche.com/model/2026/9YBAI1/common/detail_M0N5_l_0.jpg?h=a98517e1ebb1a27b9b77fdd3c984808a',
    'Rear-axle steering': 'https://configurator.porsche.com/model/2026/9YBAI1/common/detail_M0N5_l_0.jpg?h=a98517e1ebb1a27b9b77fdd3c984808a',

    'InnoDrive including Active Lane Keeping': 'https://configurator.porsche.com/model/2026/9YBAI1/common/detail_PPY3_l_0.jpg?h=d8831e0556b2d606ce7a64ffa5636897',
    'Night Vision Assist': 'https://configurator.porsche.com/model/2026/9YBAI1/common/detail_M9R1_l_0.jpg?h=1f35666f1aa7f7550ef1ab019d4ce30c'
  },
  Macan: {
    'Led HD Matrix Headlights': 'https://configurator.porsche.com/model/2026/XABAA1/common/detail_M8IU_l_0.jpg?h=4e5fb4dc1a35e358e8ab46ccf6fc0944',
    'HD Matrix LED Headlights': 'https://configurator.porsche.com/model/2026/XABAA1/common/detail_M8IU_l_0.jpg?h=4e5fb4dc1a35e358e8ab46ccf6fc0944',
    'Power Steering Plus': 'https://configurator.porsche.com/model/2026/XABAA1/common/detail_M1N3_l_0.jpg?h=c1b1c4e3f6ea20931ffd7e92839f7295',
    'Porsche Electric Sport Sound': 'https://configurator.porsche.com/model/2026/XABAA1/common/detail_MGM3_l_0.jpg?h=bc69452914a4b8edb9ce5ab92aeb6fcd',
    'Bose Surround Premium System': 'https://configurator.porsche.com/model/2026/XABAA1/common/detail_M9VL_l_0.jpg?h=71fc888cc47caabf4341e9ddd06eeece',
    'Premium Sound System': 'https://configurator.porsche.com/model/2026/XABAA1/common/detail_M9VL_l_0.jpg?h=71fc888cc47caabf4341e9ddd06eeece',
    'Rear-axle steering': 'https://configurator.porsche.com/model/2026/XABAA1/common/detail_M0N5_l_0.jpg?h=1569a349934411ced4be08344b688f01',
    'Rear-Axle Steering': 'https://configurator.porsche.com/model/2026/XABAA1/common/detail_M0N5_l_0.jpg?h=1569a349934411ced4be08344b688f01'
  },
  Default: {
    'HD Matrix LED Headlights': 'https://configurator.porsche.com/model/2026/9921B2/common/detail_M8IU_l_0.jpg?h=8b73bd638d413078ba1b7d27d67e86f6',
    'Night Vision Assist': 'https://configurator.porsche.com/model/2026/9921B2/common/detail_M9R1_l_0.jpg?h=65823b01e1fa23dab6056fdcf5124f57'
  }
};

module.exports = modelOptionImages;
