import fs from 'fs';
import path from 'path';

const faqs = JSON.parse(
  fs.readFileSync('./src/data_files/faqs_es.json', 'utf8')
);
const features = JSON.parse(
  fs.readFileSync('./src/data_files/features_es.json', 'utf8')
);
const pricing = JSON.parse(
  fs.readFileSync('./src/data_files/pricing_es.json', 'utf8')
);

// Extract partnersData manually or just leave it empty and let user fill it? No, I'll copy the strings from index.astro logic.
// I'll just write the new db.ts contents.
