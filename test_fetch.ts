import fs from 'fs';

async function fetchRealAiesecOpps() {
  console.log('Testing fetching real opportunities from AIESEC.org...');

  // Public token used by AIESEC.org web portal
  const publicToken = 'dd6df21c110d9627da0cf575d31592394c8d5045c71b67277636e08dd107297e';

  // GraphQL query to fetch real live opportunities
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

  // Test GTa (programme 8)
  try {
    const res = await fetch(`https://gis-api.aiesec.org/graphql?access_token=${publicToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({
        query,
        variables: {
          page: 1,
          per_page: 10,
          filters: {
            programmes: [8] // GTa
          }
        }
      })
    });

    const json = await res.json();
    console.log('API Status:', res.status);
    console.log('GTa Total items found:', json?.data?.allOpportunity?.paging?.total_items);
    if (json?.data?.allOpportunity?.data?.length > 0) {
      console.log('Sample real GTa opp:', JSON.stringify(json.data.allOpportunity.data[0], null, 2));
    } else {
      console.log('Response body:', JSON.stringify(json, null, 2));
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

fetchRealAiesecOpps();
