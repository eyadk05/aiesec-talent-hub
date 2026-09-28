async function introspectSlot() {
  const token = 'e316ebe109dd84ed16734e5161a2d236d0a7e6daf499941f7c110078e3c75493';

  const query = `
    query IntrospectSlot {
      __type(name: "Slot") {
        name
        fields {
          name
        }
      }
      slotConn: __type(name: "SlotConnection") {
        name
        fields {
          name
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
  console.log(JSON.stringify(json, null, 2));
}

introspectSlot();
