// Real police crime statistics seeder
// Source: Kano State Police Command - Division Crime Statistics 2025 (Dala: 2024)
// Individual records are a representative sample (capped) of each reported category.
// Full real totals are preserved separately in policeStatisticsData.js for dashboard reference.

const { CrimeReport } = require('../../src/models');

const MAX_PER_TYPE = 15; // cap per crime type per division for map readability

const locations = {
  fagge: {
    lga_id: 2,
    points: [
      { name: 'Fagge D2', lat: 12.0052, lng: 8.5671 },
      { name: 'Fagge D1', lat: 12.0020, lng: 8.5620 },
      { name: 'Sabon Gari', lat: 12.0100, lng: 8.5750 },
      { name: 'Waje', lat: 11.9980, lng: 8.5500 },
    ],
  },
  gwale: {
    lga_id: 3,
    points: [
      { name: 'Hausawa Quarters', lat: 12.0312, lng: 8.5102 },
      { name: 'Gadon Kaya Quarters', lat: 12.0280, lng: 8.5080 },
      { name: 'Chiranchi Quarters', lat: 12.0260, lng: 8.5060 },
      { name: 'Kofar Naisa Quarters', lat: 12.0300, lng: 8.5120 },
      { name: 'Sani Mai Nagge Quarters', lat: 12.0340, lng: 8.5040 },
      { name: 'Diso Quarters', lat: 12.0250, lng: 8.5150 },
      { name: 'Gwale Quarters', lat: 12.0200, lng: 8.5090 },
    ],
  },
  kwalli: {
    lga_id: 4,
    points: [
      { name: 'Dubmini Zungura', lat: 12.0000, lng: 8.5900 },
      { name: 'Yakasai Quarters', lat: 12.0040, lng: 8.5950 },
      { name: 'Goron Albasa', lat: 12.0060, lng: 8.5880 },
      { name: 'Unguwa Gini Quarters', lat: 12.0080, lng: 8.5920 },
      { name: 'Kano Nassarawa Quarters', lat: 12.0010, lng: 8.5850 },
      { name: 'Indabawa Quarters', lat: 12.0090, lng: 8.5980 },
      { name: 'Sagagi Quarters', lat: 11.9990, lng: 8.5820 },
      { name: 'Dangundi Quarters', lat: 12.0030, lng: 8.5890 },
      { name: 'Rimi Market', lat: 12.0022, lng: 8.5919 },
      { name: 'Shahuchi', lat: 12.0050, lng: 8.5940 },
      { name: 'Gandun Albasa', lat: 12.0070, lng: 8.5870 },
      { name: 'Dogara Quarters', lat: 12.0015, lng: 8.5910 },
    ],
  },
  nassarawa: {
    lga_id: 5,
    points: [
      { name: 'Singer Market', lat: 11.9950, lng: 8.5350 },
      { name: 'Civic Center Road', lat: 11.9970, lng: 8.5380 },
      { name: 'Beirut Road', lat: 11.9930, lng: 8.5320 },
      { name: 'Niger Street', lat: 11.9960, lng: 8.5400 },
      { name: 'Bank Road', lat: 11.9920, lng: 8.5300 },
      { name: 'Ajasa Yan Cement Area', lat: 11.9980, lng: 8.5400 },
      { name: 'Bata Global GSM Market', lat: 11.9990, lng: 8.5370 },
      { name: 'Mallam Kato Motor Park', lat: 11.9940, lng: 8.5340 },
    ],
  },
  dala: {
    lga_id: 1,
    points: [
      { name: 'Gwammaja', lat: 12.0400, lng: 8.6100 },
      { name: 'Masaka', lat: 12.0420, lng: 8.6080 },
      { name: 'Kuka Bulukiya', lat: 12.0380, lng: 8.6120 },
      { name: 'Kwanar Taya', lat: 12.0450, lng: 8.6150 },
      { name: 'Dandishe', lat: 12.0370, lng: 8.6050 },
      { name: "Kwanar K'ruwa", lat: 12.0440, lng: 8.6070 },
      { name: 'Katsina Road', lat: 12.0460, lng: 8.6180 },
      { name: 'Tudun Mando', lat: 12.0410, lng: 8.6030 },
      { name: 'Adakawa', lat: 12.0390, lng: 8.6160 },
    ],
  },
};

const normalizeCrimeType = (raw) => {
  const r = raw.toLowerCase();
  if (r.includes('robbery')) return 'Armed Robbery';
  if (r.includes('theft') || r.includes('stealing') || r.includes('shop breaking') || r.includes('house trespass') || r.includes('handset')) return 'Theft';
  if (r.includes('assault') || r.includes('hurt') || r.includes('grievous')) return 'Assault';
  if (r.includes('house breaking') || r.includes('burglary')) return 'Burglary';
  if (r.includes('rape') || r.includes('unnatural') || r.includes('indecent')) return 'Other';
  if (r.includes('cheating') || r.includes('breach of trust') || r.includes('c.b.t')) return 'Other';
  if (r.includes('receiving stolen') || r.includes('r.s.p')) return 'Theft';
  if (r.includes('kidnap')) return 'Kidnapping';
  if (r.includes('homicide') || r.includes('murder')) return 'Other';
  if (r.includes('drug') || r.includes('possession')) return 'Other';
  if (r.includes('mischief') || r.includes('trespass')) return 'Vandalism';
  if (r.includes('disturbance') || r.includes('inciting') || r.includes('intimidation') || r.includes('insult') || r.includes('force')) return 'Assault';
  if (r.includes('forgery')) return 'Other';
  return 'Other';
};

const divisionData = {
  fagge: {
    year: 2025,
    crimes: [
      ['Causing Hurt', 83], ['Rape/Indecent Assault', 4], ['Theft', 329],
      ['Assault', 13], ['C.B.T', 146], ['House Breaking', 7],
      ['C/Homicide', 3], ['Cheating', 53], ['Armed Robbery', 4],
      ['R.S.P', 11], ['U/Lawful Possession', 145], ['S.U.D', 7],
      ['Forgery', 4], ['U/Offence', 1], ['DPP', 39],
    ],
  },
  gwale: {
    year: 2025,
    crimes: [
      ['Un-natural offence', 1], ['Rape', 2], ['Grievous Hurt', 7],
      ['Theft & other stealing', 10], ['Criminal breach of trust/cheating', 6],
      ['Mischief', 2], ['Inciting disturbance', 8], ['Intimidation', 4],
      ['Criminal Force', 3], ['Intentional Insult', 2],
    ],
  },
  kwalli: {
    year: 2025,
    crimes: [
      ['Theft and other stealing', 50], ['Drugs Abuse', 69],
      ['Shop breaking and theft', 61], ['House trespass and theft', 51],
      ['Grievous harm', 41], ['Assault', 45], ['Cheating', 65],
      ['Thuggery activities and causing hurt', 76], ['Culpable Homicide', 2],
      ['Rape and other sexual offences', 5],
    ],
  },
  nassarawa: {
    year: 2025,
    crimes: [
      ['Breach of Trust and Cheating', 106], ['Theft', 205],
      ['Receiving Stolen Property', 34], ['Unlawful Possession', 39],
      ['Assault', 30], ['Disturbance of Public Peace', 19],
    ],
  },
  dala: {
    year: 2024,
    crimes: [
      ['Handset Snatching', 28], ['Possession of Illegal Drugs', 35],
      ['Theft', 50], ['Armed Robbery', 9], ['Rape/Unnatural Offence', 10],
      ['Culpable Homicide', 3], ['Shop Breaking and Theft', 10],
      ['Causing Grievous Hurt', 5], ['Possession of Dangerous Weapon', 7],
    ],
  },
};

const jitter = (val) => val + (Math.random() - 0.5) * 0.01;

const randomDateInYear = (year) => {
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start));
};

const seedRealCrimes = async () => {
  let totalCreated = 0;

  for (const [divisionKey, division] of Object.entries(divisionData)) {
    const loc = locations[divisionKey];
    if (!loc) continue;

    for (const [rawType, count] of division.crimes) {
      const title = normalizeCrimeType(rawType);
      const recordCount = Math.min(count, MAX_PER_TYPE);

      for (let i = 0; i < recordCount; i++) {
        const point = loc.points[Math.floor(Math.random() * loc.points.length)];
        const occurredAt = randomDateInYear(division.year);

        try {
          await CrimeReport.create({
            title,
            description: `${rawType} reported in ${point.name} (${divisionKey.toUpperCase()} Division)`,
            lga_id: loc.lga_id,
            latitude: jitter(point.lat),
            longitude: jitter(point.lng),
            address: point.name,
            occurred_at: occurredAt,
            status: 'verified',
            source: 'police',
            victim_count: 1,
          });
          totalCreated++;
        } catch (err) {
          console.error(`Failed to create record for ${title} in ${divisionKey}:`, err.message);
        }
      }
    }
  }

  console.log(`✅ Real police crime data seeded successfully! ${totalCreated} records created.`);
};

seedRealCrimes().catch(console.error);