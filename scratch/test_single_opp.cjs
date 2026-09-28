async function getSingleOpp(id) {
  const token = 'e316ebe109dd84ed16734e5161a2d236d0a7e6daf499941f7c110078e3c75493';

  const query = `
    query GetOpportunity($id: ID!) {
      getOpportunity(id: $id) {
        id
        title
        duration
        project_duration
        earliest_start_date
        latest_end_date
        applications_close_date
        date_opened
        created_at
        opportunity_duration_type {
          id
          duration_type
        }
        role_info {
          city
        }
        specifics_info {
          salary
        }
      }
    }
  `;

  const res = await fetch(`https://gis-api.aiesec.org/graphql?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { id }
    })
  });

  const json = await res.json();
  console.log(`Single Opportunity (${id}) result:`);
  console.log(JSON.stringify(json, null, 2));
}

getSingleOpp("1339665");
