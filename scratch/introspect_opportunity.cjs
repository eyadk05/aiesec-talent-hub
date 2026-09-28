async function introspectOpportunity() {
  const token = 'e316ebe109dd84ed16734e5161a2d236d0a7e6daf499941f7c110078e3c75493';

  const query = `
    query IntrospectOpportunity {
      __type(name: "Opportunity") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `;

  const res = await fetch(`https://gis-api.aiesec.org/graphql?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  const json = await res.json();
  const fields = json?.data?.__type?.fields || [];
  console.log('Opportunity fields count:', fields.length);
  fields.forEach(f => {
    console.log(`- ${f.name} (${f.type?.name || f.type?.ofType?.name || f.type?.kind})`);
  });
}

introspectOpportunity();
