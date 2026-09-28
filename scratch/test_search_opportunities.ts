import fs from 'fs';

async function testSearchOpportunities() {
  const query = `
    query searchAllOpportunityQuery($page: Int, $per_page: Int, $filters: OpportunityFilter) {
      searchAllOpportunity: searchOpportunities(
        pagination: { page: $page, per_page: $per_page }
        filters: $filters
      ) {
        paging {
          current_page
          total_items
          total_pages
        }
        data {
          id
          title
          location
          earliest_start_date
          applications_close_date
          duration
          salary
          salary_currency
          payment_period
          openings
          available_openings
          cover_photo
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
          skills {
            id
            name
          }
          logistics_info {
            accommodation_provided
            food_provided: food_covered
          }
        }
      }
    }
  `;

  // Test endpoints
  const endpoints = [
    'https://gis-api.aiesec.org/graphql',
    'https://aiesec.org/api/graphql',
    'https://gis-api.aiesec.org/graphql?access_token=dd6df21c110d9627da0cf575d31592394c8d5045c71b67277636e08dd107297e'
  ];

  for (const ep of endpoints) {
    try {
      console.log('Testing endpoint:', ep);
      const res = await fetch(ep, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Origin': 'https://aiesec.org',
          'Referer': 'https://aiesec.org/search'
        },
        body: JSON.stringify({
          query,
          variables: {
            page: 1,
            per_page: 5,
            filters: {
              programmes: [8] // GTa
            }
          }
        })
      });

      console.log('Status:', res.status);
      const text = await res.text();
      console.log('Body:', text.slice(0, 500));
    } catch (e) {
      console.error('Error:', e);
    }
  }
}

testSearchOpportunities();
