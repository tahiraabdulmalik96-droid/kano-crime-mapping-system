// Official Police-Reported Crime Statistics
// Source: Kano State Police Command Division Returns
// These are the EXACT totals as reported by police (not the sampled map markers).

export const policeStatistics = {
  fagge: {
    division: 'Fagge Division',
    lga: 'Fagge',
    year: 2025,
    totalReported: 847,
    totalProsecuted: 765,
    totalConvicted: 153,
    crimes: [
      { type: 'Causing Hurt', reported: 83, prosecuted: 81, convicted: 80 },
      { type: 'Rape/Indecent Assault', reported: 4, prosecuted: 0, convicted: 0 },
      { type: 'Theft', reported: 329, prosecuted: 291, convicted: 0 },
      { type: 'Assault', reported: 13, prosecuted: 9, convicted: 2 },
      { type: 'C.B.T (Criminal Breach of Trust)', reported: 146, prosecuted: 37, convicted: 36 },
      { type: 'House Breaking', reported: 7, prosecuted: 5, convicted: 1 },
      { type: 'Burglary', reported: 0, prosecuted: 0, convicted: 0 },
      { type: 'Culpable Homicide', reported: 3, prosecuted: 0, convicted: 0 },
      { type: 'Cheating', reported: 53, prosecuted: 47, convicted: 16 },
      { type: 'Armed Robbery', reported: 4, prosecuted: 0, convicted: 0 },
      { type: 'Receiving Stolen Property', reported: 11, prosecuted: 11, convicted: 10 },
      { type: 'Unlawful Possession', reported: 145, prosecuted: 143, convicted: 5 },
      { type: 'Suspected Use of Drugs', reported: 7, prosecuted: 0, convicted: 0 },
      { type: 'Forgery', reported: 4, prosecuted: 0, convicted: 0 },
      { type: 'Kidnapping', reported: 0, prosecuted: 0, convicted: 0 },
      { type: 'Gambling', reported: 0, prosecuted: 0, convicted: 0 },
      { type: 'Unlawful Offence', reported: 1, prosecuted: 1, convicted: 0 },
      { type: 'Murder', reported: 0, prosecuted: 0, convicted: 0 },
      { type: 'Suicide', reported: 0, prosecuted: 0, convicted: 0 },
      { type: 'DPP Cases', reported: 39, prosecuted: 39, convicted: 3 },
    ],
  },
  gwale: {
    division: 'Gwale Division',
    lga: 'Gwale',
    year: 2025,
    totalReported: 44,
    crimes: [
      { type: 'Un-natural Offence', reported: 1, arrested: 1 },
      { type: 'Rape', reported: 2, arrested: 2 },
      { type: 'Grievous Hurt', reported: 7, arrested: 6 },
      { type: 'Theft & Other Stealing', reported: 10, arrested: 10 },
      { type: 'Criminal Breach of Trust/Cheating', reported: 6, arrested: 6 },
      { type: 'Mischief', reported: 2, arrested: 2 },
      { type: 'Inciting Disturbance', reported: 8, arrested: 5 },
      { type: 'Intimidation', reported: 4, arrested: 2 },
      { type: 'Criminal Force', reported: 3, arrested: 4 },
      { type: 'Intentional Insult', reported: 2, arrested: 2 },
    ],
  },
  kwalli: {
    division: 'Kwalli Division',
    lga: 'Kano Municipal',
    year: 2025,
    totalReported: 465,
    crimes: [
      { type: 'Theft and Other Stealing', arrested: 50, charged: 40, convicted: 23 },
      { type: 'Drugs Abuse', arrested: 69, charged: 60, convicted: 55 },
      { type: 'Shop Breaking and Theft', arrested: 61, charged: 55, convicted: 49 },
      { type: 'House Trespass and Theft', arrested: 51, charged: 47, convicted: 45 },
      { type: 'Grievous Harm', arrested: 41, charged: 37, convicted: 34 },
      { type: 'Assault', arrested: 45, charged: 42, convicted: 37 },
      { type: 'Cheating', arrested: 65, charged: 60, convicted: 53 },
      { type: 'Thuggery Activities and Causing Hurt', arrested: 76, charged: 70, convicted: 70 },
      { type: 'Culpable Homicide', arrested: 2, charged: 2, convicted: 2 },
      { type: 'Rape and Other Sexual Offences', arrested: 5, charged: 5, convicted: 5 },
    ],
  },
  nassarawa: {
    division: 'Nassarawa Division',
    lga: 'Nassarawa',
    year: 2025,
    totalReported: 433,
    crimes: [
      { type: 'Breach of Trust and Cheating', reported: 106, arrested: 80, charged: 46, convicted: 26 },
      { type: 'Theft', reported: 205, arrested: 170, charged: 110, convicted: 60 },
      { type: 'Receiving Stolen Property', reported: 34, arrested: 23, charged: 20, convicted: 10 },
      { type: 'Unlawful Possession', reported: 39, arrested: 39, charged: 20, convicted: 15 },
      { type: 'Assault', reported: 30, arrested: 18, charged: 10, convicted: 10 },
      { type: 'Disturbance of Public Peace', reported: 19, arrested: 24, charged: 10, convicted: 6 },
    ],
  },
  dala: {
    division: 'Dala Division',
    lga: 'Dala',
    year: 2024,
    totalReported: 157,
    crimes: [
      { type: 'Handset Snatching', reported: 28, arrested: 10, charged: 10, convicted: 5 },
      { type: 'Possession of Illegal Drugs', reported: 35, arrested: 22, charged: 10, convicted: 7 },
      { type: 'Theft', reported: 50, arrested: 35, charged: 20, convicted: 10 },
      { type: 'Armed Robbery', reported: 9, arrested: 5, charged: 0, convicted: 0 },
      { type: 'Rape/Unnatural Offence', reported: 10, arrested: 8, charged: 0, convicted: 0 },
      { type: 'Culpable Homicide', reported: 3, arrested: 1, charged: 0, convicted: 1 },
      { type: 'Shop Breaking and Theft', reported: 10, arrested: 8, charged: 5, convicted: 1 },
      { type: 'Causing Grievous Hurt', reported: 5, arrested: 3, charged: 3, convicted: 0 },
      { type: 'Possession of Dangerous Weapon', reported: 7, arrested: 5, charged: 3, convicted: 1 },
    ],
  },
};

export const getPoliceStatsSummary = () => {
  const divisions = Object.values(policeStatistics);
  return {
    totalDivisions: divisions.length,
    totalReported: divisions.reduce((sum, d) => sum + (d.totalReported || 0), 0),
    divisions: divisions.map(d => ({
      division: d.division,
      lga: d.lga,
      year: d.year,
      total: d.totalReported,
    })),
  };
};