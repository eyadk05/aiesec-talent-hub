async function checkDurationFields() {
  const token = 'e316ebe109dd84ed16734e5161a2d236d0a7e6daf499941f7c110078e3c75493';

  const query = `
    query OpportunitySearch($page: Int, $per_page: Int) {
      allOpportunity(page: $page, per_page: $per_page) {
        data {
          id
          title
          created_at
          date_opened
          earliest_start_date
          latest_end_date
          applications_close_date
          duration
          project_duration
          opportunity_duration_type {
            id
            duration_type
          }
        }
      }
    }
  `;

  const res = await fetch(`https://gis-api.aiesec.org/graphql?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { page: 1, per_page: 15 }
    })
  });

  const json = await res.json();
  console.log('Introspected Duration Sample:');
  console.log(JSON.stringify(json?.data?.allOpportunity?.data, null, 2));
}

checkDurationFields();
