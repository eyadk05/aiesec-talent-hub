const fs = require('fs');

async function fetchAllRealTalentAndTeacher() {
  const token = 'e316ebe109dd84ed16734e5161a2d236d0a7e6daf499941f7c110078e3c75493';

  const query = `
    query OpportunitySearch($page: Int, $per_page: Int) {
      allOpportunity(page: $page, per_page: $per_page) {
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
          openings
          available_openings
          cover_photo
          programme {
            id
            short_name
          }
          host_lc {
            id
            name
            country
          }
          skills {
            id
            constant_name
          }
          backgrounds {
            id
            constant_name
          }
          languages {
            id
            constant_name
          }
          logistics_info {
            accommodation_provided
            accommodation_covered
            food_provided
            food_covered
            computer_provided
            transportation_provided
          }
          legal_info {
            visa_type
            visa_duration
          }
          specifics_info {
            salary
          }
        }
      }
    }
  `;

  let rawOpps = [];
  let page = 1;
  let totalPages = 1;

  console.log('Fetching all pages from AIESEC GIS API...');

  do {
    const res = await fetch(`https://gis-api.aiesec.org/graphql?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { page, per_page: 100 }
      })
    });

    const json = await res.json();
    const paging = json?.data?.allOpportunity?.paging;
    const items = json?.data?.allOpportunity?.data || [];

    if (paging) {
      totalPages = Math.min(paging.total_pages, 30); // Fetch up to 30 pages = 3,000 opps
    }

    console.log(`Fetched page ${page} of ${totalPages} (${items.length} opps)...`);
    rawOpps.push(...items);
    page++;
  } while (page <= totalPages);

  console.log(`Fetched ${rawOpps.length} raw opportunities in total.`);

  // Filter ONLY Global Talent (GTa / GT / id 8 / id 2) and Global Teacher (GTe / id 9 / id 5)
  // EXCLUDE Global Volunteer (GV / id 7)
  const talentAndTeacherOpps = rawOpps.filter(opp => {
    const short = (opp.programme?.short_name || '').toUpperCase();
    const idStr = String(opp.programme?.id);

    // Strictly exclude GV / Global Volunteer
    if (short === 'GV' || idStr === '7' || short.includes('VOLUNTEER')) {
      return false;
    }

    // Include GTa, GT, GTe
    return (
      short === 'GTA' ||
      short === 'GTE' ||
      short === 'GT' ||
      idStr === '8' ||
      idStr === '9' ||
      idStr === '2' ||
      idStr === '5' ||
      short.includes('TALENT') ||
      short.includes('TEACHER')
    );
  });

  console.log(`Filtered ONLY Global Talent & Teacher opps: ${talentAndTeacherOpps.length}`);

  // Format records accurately for the frontend
  const formatted = talentAndTeacherOpps.map(opp => {
    const progIdStr = String(opp.programme?.id);
    const shortUpper = (opp.programme?.short_name || '').toUpperCase();
    const isGTe = progIdStr === '9' || progIdStr === '5' || shortUpper === 'GTE' || shortUpper.includes('TEACH');

    const pShort = isGTe ? 'GTe' : 'GTa';
    const pName = isGTe ? 'Global Teacher' : 'Global Talent';

    const locationStr = opp.location || (opp.host_lc ? `${opp.host_lc.name}, ${opp.host_lc.country}` : 'Global');
    const country = opp.host_lc?.country || 'Unknown';
    const city = opp.host_lc?.name || 'City';

    let coverUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
    if (opp.cover_photo && typeof opp.cover_photo === 'object' && opp.cover_photo.url) {
      coverUrl = opp.cover_photo.url;
    } else if (typeof opp.cover_photo === 'string' && opp.cover_photo.startsWith('http')) {
      coverUrl = opp.cover_photo;
    }

    const skills = Array.isArray(opp.skills) && opp.skills.length > 0
      ? opp.skills.map(s => ({ id: Number(s.id), name: s.constant_name || s.name || 'Skill' }))
      : [{ id: 1, name: 'Professional Expertise' }];

    const backgrounds = Array.isArray(opp.backgrounds)
      ? opp.backgrounds.map(b => ({ id: Number(b.id), name: b.constant_name || b.name || 'General' }))
      : [];

    const languages = Array.isArray(opp.languages) && opp.languages.length > 0
      ? opp.languages.map(l => ({ id: Number(l.id), name: l.constant_name || l.name || 'English' }))
      : [{ id: 20, name: 'English' }];

    const salaryVal = opp.specifics_info?.salary ? Number(opp.specifics_info.salary) : 0;
    const salaryCurr = 'USD';

    const accProvided = opp.logistics_info?.accommodation_provided === 'provided' || opp.logistics_info?.accommodation_provided === true;
    const foodProv = opp.logistics_info?.food_provided === 'provided' || opp.logistics_info?.food_provided === true || opp.logistics_info?.food_covered === 'covered';

    return {
      id: Number(opp.id),
      title: opp.title,
      summary: `${pName} opportunity in ${city}, ${country}.`,
      description: `Official ${pName} exchange opportunity managed by ${opp.host_lc?.name || 'AIESEC host'} in ${country}. Visit AIESEC.org for complete requirements and application instructions.`,
      status: opp.status || 'open',
      programme: { id: isGTe ? 9 : 8, short_name: pShort, name: pName },
      host_lc: opp.host_lc || { id: 0, name: city, country: country },
      location: locationStr,
      city: city,
      country: country,
      region: getRegion(country),
      applications_close_date: opp.applications_close_date ? opp.applications_close_date.slice(0, 10) : '2026-12-31',
      earliest_start_date: opp.earliest_start_date ? opp.earliest_start_date.slice(0, 10) : '2026-11-01',
      duration: opp.duration || 12,
      salary: salaryVal,
      salary_currency: salaryCurr,
      payment_period: salaryVal > 0 ? 'Monthly' : 'Unpaid',
      skills: skills,
      backgrounds: backgrounds,
      languages: languages,
      cover_photo: { url: coverUrl },
      openings: opp.openings || 1,
      available_openings: opp.available_openings || 1,
      role_information: {
        responsibilities: `• Work on professional ${pName} projects in ${city}, ${country}.\n• Collaborate with global teams.\n• Gain practical industry leadership experience.`,
        learning_points: '• Cross-cultural professional development.\n• Practical international career experience.'
      },
      logistics_info: {
        accommodation_provided: accProvided,
        food_provided: foodProv,
        computer_provided: opp.logistics_info?.computer_provided === 'provided',
        transportation_provided: opp.logistics_info?.transportation_provided === 'provided'
      },
      legal_info: {
        visa_type: opp.legal_info?.visa_type || 'Work Permit / Exchange Visa',
        visa_duration: opp.legal_info?.visa_duration || 'Duration of Contract'
      },
      is_featured: false
    };
  });

  console.log(`Writing ${formatted.length} strictly GTa & GTe opportunities to json files...`);
  fs.writeFileSync('./real_talent_teacher_opps.json', JSON.stringify(formatted, null, 2));
  fs.writeFileSync('apps/web/app/lib/real-live-opps.json', JSON.stringify(formatted, null, 2));
  console.log('Successfully saved to real-live-opps.json!');
}

function getRegion(country) {
  const c = (country || '').toLowerCase();
  if (['germany', 'italy', 'turkey', 'spain', 'netherlands', 'france', 'poland', 'portugal', 'greece', 'romania', 'hungary', 'czech republic', 'austria', 'belgium', 'switzerland', 'sweden', 'finland', 'norway', 'denmark', 'uk', 'united kingdom'].some(x => c.includes(x))) return 'Europe';
  if (['india', 'japan', 'china', 'indonesia', 'vietnam', 'thailand', 'malaysia', 'philippines', 'singapore', 'sri lanka', 'taiwan', 'south korea', 'united arab emirates', 'qatar', 'oman', 'jordan'].some(x => c.includes(x))) return 'Asia';
  if (['egypt', 'tunisia', 'morocco', 'nigeria', 'kenya', 'south africa', 'ghana', 'tanzania', 'uganda', 'ethiopia', 'senegal', 'cameroon', 'ivory coast'].some(x => c.includes(x))) return 'Africa';
  if (['brazil', 'mexico', 'colombia', 'argentina', 'peru', 'chile', 'panama', 'costa rica', 'united states', 'canada', 'ecuador'].some(x => c.includes(x))) return 'Americas';
  return 'Europe';
}

fetchAllRealTalentAndTeacher();
