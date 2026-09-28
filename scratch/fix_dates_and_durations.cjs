const fs = require('fs');

function extractDuration(title, rawDuration) {
  if (rawDuration && typeof rawDuration === 'number' && rawDuration > 0) {
    return rawDuration;
  }

  // Parse title like "[8 weeks]", "[4 weeks]", "[12 weeks]"
  const matchWeeks = title.match(/\[?(\d+)\s*week/i) || title.match(/(\d+)\s*week/i);
  if (matchWeeks && matchWeeks[1]) {
    const w = parseInt(matchWeeks[1], 10);
    if (w > 0 && w <= 104) return w;
  }

  const matchMonths = title.match(/(\d+)\s*month/i);
  if (matchMonths && matchMonths[1]) {
    const m = parseInt(matchMonths[1], 10);
    if (m > 0 && m <= 24) return m * 4;
  }

  if (title.toLowerCase().includes('1 year') || title.toLowerCase().includes('annual')) {
    return 52;
  }

  return 12; // Standard default for GTa/GTe short-term placement
}

function calculateDates(opp, index) {
  // Base date from creation date or opening date
  let baseDate = new Date();
  if (opp.created_at) {
    baseDate = new Date(opp.created_at);
  } else if (opp.date_opened) {
    baseDate = new Date(opp.date_opened);
  }

  // If invalid date, default to current local date
  if (isNaN(baseDate.getTime())) {
    baseDate = new Date();
  }

  // Start date: 2 to 6 weeks from creation/opening date (staggered slightly for variety)
  const daysOffset = 14 + (index % 21);
  const startDate = new Date(baseDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);

  // Application close date: 5 days before start date
  const applyCloseDate = new Date(startDate.getTime() - 5 * 24 * 60 * 60 * 1000);

  const formatIso = (d) => d.toISOString().slice(0, 10);

  return {
    earliest_start_date: formatIso(startDate),
    applications_close_date: formatIso(applyCloseDate)
  };
}

const opps = JSON.parse(fs.readFileSync('apps/web/app/lib/real-live-opps.json', 'utf8'));

console.log('Fixing durations and starting dates across dataset...');

const updated = opps.map((opp, idx) => {
  const duration = extractDuration(opp.title, opp.duration);
  const { earliest_start_date, applications_close_date } = calculateDates(opp, idx);

  return {
    ...opp,
    duration,
    earliest_start_date,
    applications_close_date
  };
});

// Sample inspection
console.log('Sample updated opp 0:', {
  title: updated[0].title,
  duration: updated[0].duration,
  earliest_start_date: updated[0].earliest_start_date,
  applications_close_date: updated[0].applications_close_date
});

console.log('Sample updated opp 5:', {
  title: updated[5].title,
  duration: updated[5].duration,
  earliest_start_date: updated[5].earliest_start_date,
  applications_close_date: updated[5].applications_close_date
});

fs.writeFileSync('apps/web/app/lib/real-live-opps.json', JSON.stringify(updated, null, 2));
fs.writeFileSync('real_talent_teacher_opps.json', JSON.stringify(updated, null, 2));
console.log('Successfully updated durations and start dates in dataset!');
