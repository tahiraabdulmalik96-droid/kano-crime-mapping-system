const { LGA } = require('../../src/models');

const seedLGAs = async () => {
  const lgas = [
    { name: 'Dala', population: 365000, area_sqkm: 13.2 },
    { name: 'Fagge', population: 220000, area_sqkm: 8.5 },
    { name: 'Gwale', population: 280000, area_sqkm: 11.3 },
    { name: 'Kano Municipal', population: 320000, area_sqkm: 137.0 },
    { name: 'Nassarawa', population: 420000, area_sqkm: 72.4 },
    { name: 'Tarauni', population: 195000, area_sqkm: 22.1 },
    { name: 'Ungogo', population: 350000, area_sqkm: 195.0 },
  ];

  for (const lga of lgas) {
    await LGA.findOrCreate({
      where: { name: lga.name },
      defaults: lga
    });
  }

  console.log('Kano City LGAs seeded successfully!');
};

seedLGAs().catch(console.error);  