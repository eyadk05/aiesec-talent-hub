const fs = require('fs');

async function scrapePage(id) {
  const url = `https://aiesec.org/opportunity/global-talent/${id}`;
  console.log('Fetching:', url);

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();
  
  // Extract __NEXT_DATA__
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
  if (match && match[1]) {
    const nextData = JSON.parse(match[1]);
    console.log('Found __NEXT_DATA__!');
    fs.writeFileSync('./next_data_opp.json', JSON.stringify(nextData, null, 2));
    
    // Search for opp data inside pageProps
    const pageProps = nextData?.props?.pageProps;
    console.log('PageProps keys:', pageProps ? Object.keys(pageProps) : 'none');
    if (pageProps) {
      console.log('Sample pageProps excerpt:', JSON.stringify(pageProps, null, 2).slice(0, 1000));
    }
  } else {
    console.log('No __NEXT_DATA__ found. HTML snippet:');
    console.log(html.slice(0, 500));
  }
}

scrapePage("1339665");
