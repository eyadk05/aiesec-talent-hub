const fs = require('fs');

async function parseRsc(id) {
  const url = `https://aiesec.org/opportunity/global-talent/${id}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });

  const html = await res.text();
  fs.writeFileSync('./opp_page_raw.html', html);
  console.log('Saved html, size:', html.length);

  // Search for duration, weeks, start date in text
  const textClean = html.replace(/<[^>]+>/g, ' ');
  console.log('Cleaned text excerpt around duration/date:');
  
  const matches = [...html.matchAll(/"duration"[:\s]+(\d+)|"earliest_start_date"[:\s]+"([^"]+)"|"applications_close_date"[:\s]+"([^"]+)"|(\d+)\s*Weeks?|(\d+)\s*Semanas?/gi)];
  matches.forEach(m => console.log('Match:', m[0]));
}

parseRsc("1339665");
