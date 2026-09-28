async function check() {
  const id = '1339668';
  const urls = [
    `https://aiesec.org/opportunity/${id}`,
    `https://aiesec.org/opportunity/gv/${id}`,
    `https://aiesec.org/opportunity/global-volunteer/${id}`,
    `https://aiesec.org/opportunity/global-talent/${id}`,
    `https://aiesec.org/opportunity/7/${id}`,
    `https://aiesec.org/search?q=${id}`
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(u, '=>', res.status);
    } catch (e) {
      console.log(u, '=> Error:', e.message);
    }
  }
}
check();
