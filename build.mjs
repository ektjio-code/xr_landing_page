/*
  Strip-at-build: index_v3.html (commented working source) -> index_v3.min.html (deployable).
  Removes every HTML / CSS / JS comment via real parsers (html-minifier-terser -> clean-css + terser),
  so the shipped file carries none of the authoring notes. JS compress + mangle are OFF on purpose:
  comment removal only, so the WebGL / three.js code stays behaviourally identical (no renamed vars,
  no dead-code passes) and the GLSL shader template-literals / https URLs / string literals are never
  touched. Output sits at the repo ROOT so relative asset paths (strings.js, shinobu.glb, Tokonama
  Scene/, AR files) still resolve. Run: npm run build.
*/
import { readFile, writeFile } from 'node:fs/promises';
import { minify } from 'html-minifier-terser';

const SRC = 'index_v3.html';
const OUT = 'index_v3.min.html';

const src = await readFile(SRC, 'utf8');
const out = await minify(src, {
  removeComments: true,        // <!-- HTML comments -->
  collapseWhitespace: false,   // keep copy / layout spacing exactly as authored
  minifyCSS: true,             // clean-css: drops /* CSS comments */
  minifyJS: {                  // terser: drops // and /* */ JS comments, keeps the code
    compress: false,
    mangle: false,
    format: { comments: false },
  },
});

await writeFile(OUT, out, 'utf8');
const emSrc = (src.match(/—/g) || []).length;
const emOut = (out.match(/—/g) || []).length;
console.log(`built ${OUT}: ${src.length} -> ${out.length} bytes`);
console.log(`em-dashes: ${emSrc} (source) -> ${emOut} (shipped, copy-only; comment dashes gone)`);
