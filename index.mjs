import fontkit from "fontkit";
import fs from "fs";
import DatauriParser from "datauri/parser.js";

// open a font synchronously
var font = fontkit.openSync("CaveatBrush-Regular.ttf");

// Layout a string, which returns a GlyphRun that includes
// exactly which glyphs were needed to render the string.
var run = font.layout(
  dedupeCharacters(
    // This list was manually extracted in this test. It would be instead
    // extracted from the subset of text shapes being exported in a Tldraw document
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
`
  )
);

// Create a font subset that only includes the glyphs needed to render the string
var subset = font.createSubset();
run.glyphs.forEach(function (glyph) {
  subset.includeGlyph(glyph);
});

// Write the subset to a new font file
const writeStream = fs.createWriteStream("subset.ttf");

// Once it's finished print out the data URI
writeStream.addListener("close", () => {
  //
  const buffer = fs.readFileSync("./subset.ttf");
  const parser = new DatauriParser();

  const dataURI = parser.format(".ttf", buffer);
  // This is the data URI that can be used in a CSS @font-face rule
  console.log(`data:application/octet-stream;base64,${dataURI.base64}`);
});

subset.encodeStream().pipe(writeStream);

/*
 * Dedupe characters
 * @param {string} characters - A string of characters
 * @returns {string} - A string of unique characters
 */
function dedupeCharacters(characters) {
  const uniqueCharacters = new Set();
  Array.from(characters).forEach((character) => {
    uniqueCharacters.add(character);
  });
  const uniques = Array.from(uniqueCharacters).join("");
  console.log(uniques);
  return uniques;
}
