import fontkit from 'fontkit';
import fs from 'fs';
import DatauriParser from 'datauri/parser.js';

 
// open a font synchronously
var font = fontkit.openSync('CaveatBrush-Regular.ttf');
 
// layout a string, using default shaping features.
// returns a GlyphRun, describing glyphs and positions.
var run = font.layout(dedupeCharacters(
` (Scaled 2x) 
Small Sized
Medium Sized
Large Sized
Todos
Buy Milk
Workout
Call Mom
Sleep more 7+ hours
Hello
`));
 
// get an SVG path for a glyph
var svg = run.glyphs[0].path.toSVG();
 
// create a font subset
var subset = font.createSubset();
run.glyphs.forEach(function(glyph) {
  subset.includeGlyph(glyph);
});
 
const writeStream = fs.createWriteStream('subset.ttf')
writeStream.addListener('close', () => {
  const buffer = fs.readFileSync('./subset.ttf');
  const parser = new DatauriParser();

 const dataURI = parser.format('.ttf', buffer);
//  console.log(`data:application/octet-stream;base64,${dataURI.base64}`);
console.log(dataURI.content);
})

function dedupeCharacters(characters) {
  const uniqueCharacters = new Set();
  Array.from(characters).forEach(character => {
    uniqueCharacters.add(character);
  });
  const uniques = Array.from(uniqueCharacters).join('');
  console.log(uniques);
  return uniques;
}

subset.encodeStream()
      .pipe(writeStream);