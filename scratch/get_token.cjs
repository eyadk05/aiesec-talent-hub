const fs = require('fs');

async function getLiveTokenAndOpps() {
  try {
    console.log('Fetching aiesec.org page HTML...');
    const res = await fetch('https://aiesec.org/search', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    
    // Search for 64-char hex token in html
    const hexMatches = html.match(/[a-f0-9]{64}/gi) || [];
    console.log('Found potential 64-char tokens:', hexMatches.length);

    // Let's also fetch main JS bundles if referenced
    const scriptSrcs = [...html.matchAll(/src=["'](\/_next\/static\/[^"']+)["']/g)].map(m => m[1]);
    console.log('Found next static scripts:', scriptSrcs);

    let validToken = null;

    // Test any hex tokens found
    for (const token of hexMatches) {
      const testRes = await testToken(token);
      if (testRes) {
        validToken = token;
        console.log('Found VALID TOKEN!', token);
        break;
      }
    }

    if (!validToken) {
      for (const src of scriptSrcs) {
        const jsUrl = `https://aiesec.org${src}`;
        console.log('Fetching script:', jsUrl);
        const jsRes = await fetch(jsUrl);
        const jsText = await jsRes.text();
        const jsTokens = jsText.match(/[a-f0-9]{64}/gi) || [];
        for (const token of jsTokens) {
          const testRes = await testToken(token);
          if (testRes) {
            validToken = token;
            console.log('Found VALID TOKEN in JS bundle!', token);
            break;
          }
        }
        if (validToken) break;
      }
    }

    if (validToken) {
      console.log('Fetching live real opportunities using valid token...');
      await fetchRealOpps(validToken);
    } else {
      console.log('No valid token found automatically. Testing public search endpoints...');
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

async function testToken(token) {
  try {
    const query = `{ allOpportunity(per_page: 1) { paging { total_items } } }`;
    const res = await fetch(`https://gis-api.aiesec.org/graphql?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (res.status === 200) {
      const json = await res.json();
      if (json.data && json.data.allOpportunity) {
        return true;
      }
    }
  } catch (e) {}
  return false;
}

async function fetchRealOpps(token) {
  const query = `
    query OpportunitySearch($page: Int, $per_page: Int, $filters: OpportunityFilter) {
      allOpportunity(page: $page, per_page: $per_page, filters: $filters) {
        paging {
          total_items
          total_pages
          current_page
        }
        data {
          id
          title
          status
          location
          applications_close_date
          earliest_start_date
          latest_end_date
          duration
          salary
          salary_currency
          payment_period
          openings
          available_openings
          programme {
            id
            short_name
            name
          }
          sub_programme {
            id
            name
          }
          host_lc {
            id
            name
            country
          }
          home_lc {
            id
            name
            country
          }
          cover_photo {
            url
          }
          skills {
            id
            name
          }
          backgrounds {
            id
            name
          }
          languages {
            id
            name
          }
          work_fields {
            id
            name
          }
          role_information {
            learning_points
            responsibilities
          }
          logistics_info {
            accommodation_provided
            accommodation_covered
            food_provided: food_covered
            computer_provided
            transportation_provided
          }
          legal_info {
            visa_type
            visa_duration
          }
        }
      }
    }
  `;

  // Fetch page 1 of GTa (programme 8) and GTe (programme 9)
  const resGTa = await fetch(`https://gis-api.aiesec.org/graphql?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { page: 1, per_page: 25, filters: { programmes: [8] } }
    })
  });
  const jsonGTa = await resGTa.json();

  const resGTe = await fetch(`https://gis-api.aiesec.org/graphql?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { page: 1, per_page: 25, filters: { programmes: [9] } }
    })
  });
  const jsonGTe = await resGTe.json();

  const gtaOpps = jsonGTa?.data?.allOpportunity?.data || [];
  const gteOpps = jsonGTe?.data?.allOpportunity?.data || [];

  console.log(`Fetched ${gtaOpps.length} GTa opps and ${gteOpps.length} GTe opps.`);

  const allOpps = [...gtaOpps, ...gteOpps];
  fs.writeFileSync('./real_live_opps_fetched.json', JSON.stringify(allOpps, null, 2));
  console.log('Saved to real_live_opps_fetched.json!');
}

getLiveTokenAndOpps();
