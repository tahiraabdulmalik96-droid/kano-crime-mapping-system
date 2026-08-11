const { CrimeReport } = require('../../src/models');

const seedCrimes = async () => {
  const crimes = [
    // Dala LGA (id: 1)
    { title: 'Armed Robbery', description: 'Armed robbery at Dala market', latitude: 12.0421, longitude: 8.6102, address: 'Dala Market', lga_id: 1, occurred_at: '2024-01-05T10:30:00Z', source: 'simulated', status: 'verified', victim_count: 2 },
    { title: 'Theft', description: 'Mobile phone snatching at Dala', latitude: 12.0380, longitude: 8.6050, address: 'Dala Road', lga_id: 1, occurred_at: '2024-01-12T14:00:00Z', source: 'simulated', status: 'verified', victim_count: 1 },
    { title: 'Assault', description: 'Physical assault near Dala junction', latitude: 12.0450, longitude: 8.6150, address: 'Dala Junction', lga_id: 1, occurred_at: '2024-02-03T20:00:00Z', source: 'simulated', status: 'pending', victim_count: 1 },

    // Fagge LGA (id: 2)
    { title: 'Robbery', description: 'Robbery at Fagge market', latitude: 12.0052, longitude: 8.5671, address: 'Fagge Market', lga_id: 2, occurred_at: '2024-01-08T09:00:00Z', source: 'simulated', status: 'verified', victim_count: 3 },
    { title: 'Burglary', description: 'House broken into at Fagge', latitude: 12.0020, longitude: 8.5620, address: 'Fagge D2', lga_id: 2, occurred_at: '2024-01-20T02:00:00Z', source: 'simulated', status: 'verified', victim_count: 1 },
    { title: 'Theft', description: 'Car parts stolen at Fagge', latitude: 12.0080, longitude: 8.5700, address: 'Fagge D1', lga_id: 2, occurred_at: '2024-02-14T23:00:00Z', source: 'simulated', status: 'pending', victim_count: 1 },

    // Gwale LGA (id: 3)
    { title: 'Armed Robbery', description: 'Armed robbery at Gwale area', latitude: 12.0312, longitude: 8.5102, address: 'Gwale Main Road', lga_id: 3, occurred_at: '2024-01-15T21:00:00Z', source: 'simulated', status: 'verified', victim_count: 2 },
    { title: 'Assault', description: 'Fight at Gwale junction', latitude: 12.0280, longitude: 8.5080, address: 'Gwale Junction', lga_id: 3, occurred_at: '2024-02-20T18:00:00Z', source: 'simulated', status: 'pending', victim_count: 2 },

    // Kano Municipal LGA (id: 4)
    { title: 'Armed Robbery', description: 'Bank robbery near Kofar Mata', latitude: 12.0022, longitude: 8.5919, address: 'Kofar Mata', lga_id: 4, occurred_at: '2024-01-10T11:00:00Z', source: 'simulated', status: 'verified', victim_count: 5 },
    { title: 'Theft', description: 'Pickpocketing at Sabon Gari', latitude: 12.0100, longitude: 8.5750, address: 'Sabon Gari Market', lga_id: 4, occurred_at: '2024-01-18T13:00:00Z', source: 'simulated', status: 'verified', victim_count: 1 },
    { title: 'Robbery', description: 'Street robbery at Kano Municipal', latitude: 12.0050, longitude: 8.5850, address: 'Zoo Road', lga_id: 4, occurred_at: '2024-02-07T22:00:00Z', source: 'simulated', status: 'verified', victim_count: 2 },
    { title: 'Burglary', description: 'Shop broken into at Kano Municipal', latitude: 12.0150, longitude: 8.5900, address: 'Ibrahim Taiwo Road', lga_id: 4, occurred_at: '2024-02-25T03:00:00Z', source: 'simulated', status: 'pending', victim_count: 1 },

    // Nassarawa LGA (id: 5)
    { title: 'Theft', description: 'Theft at Nassarawa area', latitude: 11.9950, longitude: 8.5350, address: 'Nassarawa GRA', lga_id: 5, occurred_at: '2024-01-22T16:00:00Z', source: 'simulated', status: 'verified', victim_count: 1 },
    { title: 'Armed Robbery', description: 'Armed robbery at Nassarawa junction', latitude: 11.9980, longitude: 8.5400, address: 'Nassarawa Junction', lga_id: 5, occurred_at: '2024-02-01T20:30:00Z', source: 'simulated', status: 'verified', victim_count: 3 },
    { title: 'Assault', description: 'Assault at Nassarawa market', latitude: 11.9920, longitude: 8.5300, address: 'Nassarawa Market', lga_id: 5, occurred_at: '2024-02-18T15:00:00Z', source: 'simulated', status: 'pending', victim_count: 1 },

    // Tarauni LGA (id: 6)
    { title: 'Robbery', description: 'Robbery at Tarauni area', latitude: 12.0350, longitude: 8.5750, address: 'Tarauni Road', lga_id: 6, occurred_at: '2024-01-25T19:00:00Z', source: 'simulated', status: 'verified', victim_count: 2 },
    { title: 'Theft', description: 'Theft at Tarauni market', latitude: 12.0320, longitude: 8.5800, address: 'Tarauni Market', lga_id: 6, occurred_at: '2024-02-10T12:00:00Z', source: 'simulated', status: 'verified', victim_count: 1 },

    // Ungogo LGA (id: 7)
    { title: 'Armed Robbery', description: 'Armed robbery at Ungogo', latitude: 12.0650, longitude: 8.5600, address: 'Ungogo Road', lga_id: 7, occurred_at: '2024-01-30T21:30:00Z', source: 'simulated', status: 'verified', victim_count: 2 },
    { title: 'Burglary', description: 'Burglary at Ungogo residential area', latitude: 12.0620, longitude: 8.5550, address: 'Ungogo Residential', lga_id: 7, occurred_at: '2024-02-15T01:00:00Z', source: 'simulated', status: 'pending', victim_count: 1 },
    { title: 'Theft', description: 'Theft at Ungogo market', latitude: 12.0680, longitude: 8.5650, address: 'Ungogo Market', lga_id: 7, occurred_at: '2024-03-01T10:00:00Z', source: 'simulated', status: 'verified', victim_count: 1 },
  ];

  for (const crime of crimes) {
    await CrimeReport.findOrCreate({
      where: {
        title: crime.title,
        address: crime.address,
        occurred_at: crime.occurred_at,
      },
      defaults: crime,
    });
  }

  console.log('Sample crimes seeded successfully!');
};

seedCrimes().catch(console.error);