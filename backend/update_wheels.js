const db = require('./db');

const wheelUpdates = [
  {
    name: '19" Standard',
    url: 'https://prs.porsche.com/iod/image/WW/9921B2/1/N4Igxg9gdgZglgcxALlAQynAtmgLnaAZxQG0BdAGnDSwFMAnNFUOAExRFoA9cBaAGwgB3XjHrQ+-WjD5CAFrVr8QVCAAd8RZiABuaenAy4OrWoQDWudSAC+NqrSg644qHSjHUINhwDyaQjhiVQ0CKGJUOyp+RDl8KCQvH2QQABEAQQBNFRB1TXDmKJA1cVYAVzBPFnYUgE5agCYARgAhBpy8sIjQSDKPegBPAGEIUw4AdXGcrFGlTNp9FAaABgaANhD8iJIQZYBFHKaAFQBmHJOWs6oAVgAOAA0ctYBJK5AAdnSAaRz3gHFajlagAtACiOVBAFl2lQ-k0AGI5Z7jN4AKVBbwAMn8jqkAEqYnIABQAEjk9td0uS8YCqHsAGpvACqRNpIHpmPaZDs9hAhFouHiCG6IBgEHoOE8IAAVmpaEgqLhGOE1PpHJ4YGh+Py7EA?clientId=icc'
  },
  {
    name: '20" Carrera Classic',
    url: 'https://prs.porsche.com/iod/image/WW/9921B2/1/N4Igxg9gdgZglgcxALlAQynAtmgLnaAZxQG0BdAGnDSwFMAnNFUOAExRFoA9cBaAGwgB3XjHrQ+-WjD5CAFrVr8QVCAAd8RZiABuaenAy4OrWoQDWudSAC+NqrSg644qHSjHUINhwDyaQjhiVQ0CKGJUOyp+RDl8KCQvH2QQABEAQQBNFRB1TXDmKJA1cVYAVzBPFnYUgE5agCYARgAhBpy8sIjQSDKPegBPAGEIUw4AdXGcrFGlTNp9FAaABgaANhD8iJIQZYBFHKaAFQBmHJOWs6oAVlqWnLWASSuQAHZ0gGkc14BxWpzagAtACiOWBAFl2lQfk0AGI5R7jF4AKWBLwAMj8jqkAEronIABQAEjk9td0qScf8qHsAGovACqBOpIFp6PaZDs9hAhFouHiCG6IBgEHoOE8IAAVmpaEgqLhGOE1PpHJ4YGh+Ly7EA?clientId=icc'
  },
  {
    name: '21" Carrera S',
    url: 'https://prs.porsche.com/iod/image/WW/9921B2/1/N4Igxg9gdgZglgcxALlAQynAtmgLnaAZxQG0BdAGnDSwFMAnNFUOAExRFoA9cBaAGwgB3XjHrQ+-WjD5CAFrVr8QVCAAd8RZiABuaenAy4OrWoQDWudSAC+NqrSg644qHSjHUINhwDyaQjhiVQ0CKGJUOyp+RDl8KCQvH2QQABEAQQBNFRB1TXDmKJA1cVYAVzBPFnYUgE5agCYARgAhBpy8sIjQSDKPegBPAGEIUw4AdXGcrFGlTNp9FAaABgaANhD8iJIQZYBFHKaAFQBmHJOWs6o1gEkrkAB2dIBpHIeAcVqc2oAtAFEckMABxHHJ-ACy7So7yaADEcjdxvcAFJ-e4AGXeR1SACV0TkAAoACRyewArOlSTivlQ9gA1e4AVQJNJAdPR7TIdnsIEItFw8QQ3RAMAg9BwnhAACs1LQkFRcIxwmp9I5PDA0Pw+XYgA?clientId=icc'
  },
  {
    name: '22" Turbo',
    url: 'https://prs.porsche.com/iod/image/WW/9921B2/1/N4Igxg9gdgZglgcxALlAQynAtmgLnaAZxQG0BdAGnDSwFMAnNFUOAExRFoA9cBaAGwgB3XjHrQ+-WjD5CAFrVr8QVCAAd8RZiABuaenAy4OrWoQDWudSAC+NqrSg644qHSjHUINhwDyaQjhiVQ0CKGJUOyp+RDl8KCQvH2QQABEAQQBNFRB1TXDmKJA1cVYAVzBPFnYUgE5agCYARgAhBpy8sIjQSDKPegBPAGEIUw4AdXGcrFGlTNp9FAaABgaANhD8iJIQZYBFHKaAFQBmHJOWs6oAVlr0nLWASSuQAHZ0gGkc14BxWpzagAtACiOWBAFl2lQfk0AGI5R7jF4AKWBLwAMj8jqkAEronIABQAEjk9td7lQ9jj-pSAGovACqBJpIFp6PaZDs9hAhFouHiCG6IBgEHoOE8IAAVmpaEgqLhGOE1PpHJ4YGh+Ly7EA?clientId=icc'
  }
];

async function updateWheels() {
  try {
    for (const wheel of wheelUpdates) {
      // Match option names approximately (some DB rows include model suffixes)
      await db.query(
        'UPDATE options SET image_url = $1 WHERE name ILIKE $2 AND category = $3',
        [wheel.url, `%${wheel.name}%`, 'Wheels']
      );
      console.log(`Updated ${wheel.name}`);
    }
    console.log('All wheels updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating wheels:', error);
    process.exit(1);
  }
}

updateWheels();
