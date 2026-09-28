import fs from 'fs';

async function main() {
  const url = 'https://aiesec.org/_next/static/chunks/app/(root)/(default-navbar)/search/page-b91d28b1a5494369.js';
  console.log('Fetching search chunk:', url);
  const res = await fetch(url);
  const text = await res.text();
  console.log('Search chunk size:', text.length);

  // Search for token strings or GraphQL queries or URLs
  const tokenMatches = text.match(/access_token["']?\s*[:=]\s*["']([^"']+)["']/g) ||
                       text.match(/[a-f0-9]{32,64}/g);
  console.log('Potential hex tokens found (first 10):', tokenMatches?.slice(0, 10));

  // Search for GIS or GraphQL URLs
  const urls = text.match(/https?:\/\/[^\s"'\`]+/g);
  console.log('URLs in search chunk:', Array.from(new Set(urls || [])));

  // Search for query names
  const queries = text.match(/query\s+[A-Za-z0-9_]+/g);
  console.log('Queries found:', queries);
}

main();
