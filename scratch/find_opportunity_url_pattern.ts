import fs from 'fs';

async function testUrl(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log(`URL: ${url} => Status: ${res.status}`);
    return res.status;
  } catch (e) {
    console.error(`Error for ${url}:`, e);
    return 500;
  }
}

async function main() {
  const id = '1339283';
  const patterns = [
    `https://aiesec.org/opportunity/${id}`,
    `https://aiesec.org/opportunities/${id}`,
    `https://aiesec.org/opportunity/gta/${id}`,
    `https://aiesec.org/opportunity/global-talent/${id}`,
    `https://aiesec.org/search?opportunity_id=${id}`,
    `https://aiesec.org/search?q=${id}`,
    `https://aiesec.org/opportunity/detail/${id}`,
    `https://aiesec.org/expa/opportunities/${id}`
  ];

  for (const p of patterns) {
    await testUrl(p);
  }
}

main();
