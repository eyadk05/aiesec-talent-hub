async function testSlotsQuery() {
  const token = 'e316ebe109dd84ed16734e5161a2d236d0a7e6daf499941f7c110078e3c75493';

  const query = `
    query OpportunitySearch($page: Int, $per_page: Int) {
      allOpportunity(page: $page, per_page: $per_page) {
        data {
          id
          title
          all_slots {
            nodes {
              id
              start_date
              end_date
              applications_close_date
              status
            }
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
      variables: { page: 1, per_page: 5 }
    })
  });

  const json = await res.json();
  console.log('Introspected exact slot dates & durations:');
  console.log(JSON.stringify(json?.data?.allOpportunity?.data, null, 2));
}

testSlotsQuery();
