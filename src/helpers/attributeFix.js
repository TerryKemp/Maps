// Change entries of data object
const DataFix = (geoPath, data, capitalMarkers) => {
  const geographyPath = geoPath;
  const countryData = data;
  const capitalMarkersData = capitalMarkers;

  // Add missing country variants
  countryData.find(x => x.alpha3Code === 'COG').altSpellings = ['Republic of the Congo'];
  countryData.find(x => x.alpha3Code === 'COD').altSpellings = ['Democratic Republic of the Congo'];
  countryData.find(x => x.alpha3Code === 'GBR').altSpellings = ['Britain'];
  countryData.find(x => x.alpha3Code === 'MAF').altSpellings = ['St Martin'];
  countryData.find(x => x.alpha3Code === 'SXM').altSpellings = ['Sint Maarten'];
  countryData.find(x => x.alpha3Code === 'VGB').altSpellings = ['British Virgin Islands'];
  countryData.find(x => x.alpha3Code === 'VIR').altSpellings = ['US Virgin Islands'];

  // Move original name to altSpellings
  ['VEN', 'BOL', 'GBR', 'MDA', 'MKD', 'PSE', 'SYR', 'IRN', 'PRK', 'KOR', 'LAO', 'BRN', 'COD', 'TZA', 'FSM', 'BLM', 'KNA', 'LCA', 'MAF', 'SHN', 'SPM', 'VCT', 'KOS', 'VAT']
    .forEach((code) => {
      const country = countryData.find(x => x.alpha3Code === code);
      if (country.altSpellings) {
        country.altSpellings.push(country.name);
      } else {
        country.altSpellings = [country.name];
      }
    });

  const dataCorrections = [
    // Change display name of country to shorter variant
    { alpha: 'VEN', attribute: 'name', value: 'Venezuela' },
    { alpha: 'BOL', attribute: 'name', value: 'Bolivia' },
    { alpha: 'GBR', attribute: 'name', value: 'United Kingdom' },
    { alpha: 'MDA', attribute: 'name', value: 'Moldova' },
    { alpha: 'MKD', attribute: 'name', value: 'Macedonia' },
    { alpha: 'KOS', attribute: 'name', value: 'Kosovo' },
    { alpha: 'PSE', attribute: 'name', value: 'Palestine' },
    { alpha: 'SYR', attribute: 'name', value: 'Syria' },
    { alpha: 'IRN', attribute: 'name', value: 'Iran' },
    { alpha: 'PRK', attribute: 'name', value: 'North Korea' },
    { alpha: 'KOR', attribute: 'name', value: 'South Korea' },
    { alpha: 'LAO', attribute: 'name', value: 'Laos' },
    { alpha: 'BRN', attribute: 'name', value: 'Brunei' },
    { alpha: 'COD', attribute: 'name', value: 'DR Congo' },
    { alpha: 'TZA', attribute: 'name', value: 'Tanzania' },
    { alpha: 'FSM', attribute: 'name', value: 'Micronesia' },
    { alpha: 'BLM', attribute: 'name', value: 'St Barthélemy' },
    { alpha: 'KNA', attribute: 'name', value: 'St Kitts and Nevis' },
    { alpha: 'LCA', attribute: 'name', value: 'St Lucia' },
    { alpha: 'MAF', attribute: 'name', value: 'St Martin (French part)' },
    { alpha: 'SHN', attribute: 'name', value: 'St Helena, Ascension and Tristan da Cunha' },
    { alpha: 'SPM', attribute: 'name', value: 'St Pierre and Miquelon' },
    { alpha: 'VCT', attribute: 'name', value: 'St Vincent and the Grenadines' },
    // Set null areas (data based on Wikipedia)
    { alpha: 'PSE', attribute: 'area', value: 6220 },
    { alpha: 'SGS', attribute: 'area', value: 3903 },
    { alpha: 'SHN', attribute: 'area', value: 394 },
    { alpha: 'REU', attribute: 'area', value: 2511 },
    { alpha: 'MYT', attribute: 'area', value: 374 },
    { alpha: 'GUF', attribute: 'area', value: 83534 },
    { alpha: 'MTQ', attribute: 'area', value: 1128 },
    { alpha: 'GLP', attribute: 'area', value: 1628 },
    { alpha: 'SJM', attribute: 'area', value: 62049 },
    // Set numericCode and alpha2Code for Kosovo
    { alpha: 'KOS', attribute: 'numericCode', value: 999 },
    { alpha: 'KOS', attribute: 'alpha2Code', value: 'KO' },
    // Resolve Holy See capital name conflict with Italy, and change name to common designation
    { alpha: 'VAT', attribute: 'capital', value: 'Vatican City' },
    { alpha: 'VAT', attribute: 'name', value: 'Vatican City' },
  ];

  dataCorrections.forEach((obj) => {
    countryData.find(x => x.alpha3Code === obj.alpha)[obj.attribute] = obj.value;
  });

  // Create geography paths for regions of France
  const france = geographyPath.find(x => x.id === '250');
  const frenchguiana = JSON.parse(JSON.stringify(france));
  const guadeloupe = JSON.parse(JSON.stringify(france));
  const martinique = JSON.parse(JSON.stringify(france));
  const mayotte = JSON.parse(JSON.stringify(france));
  const reunion = JSON.parse(JSON.stringify(france));
  frenchguiana.id = '254';
  guadeloupe.id = '312';
  martinique.id = '474';
  mayotte.id = '175';
  reunion.id = '638';

  // Create geography path for Bonaire
  const netherlands = geographyPath.find(x => x.id === '528');
  const bonaire = JSON.parse(JSON.stringify(netherlands));
  bonaire.id = '535';

  // Set numericCode for Christmas Island
  geographyPath[98].id = '162';
  const cocos = JSON.parse(JSON.stringify(geographyPath[98]));
  cocos.id = '166';

  // Create geography path for Svalbard
  const norway = geographyPath.find(x => x.id === '578');
  const svalbard = JSON.parse(JSON.stringify(norway));
  svalbard.id = '744';

  // Create geography path for Tokelau
  const newzealand = geographyPath.find(x => x.id === '554');
  const tokelau = JSON.parse(JSON.stringify(newzealand));
  tokelau.id = '772';

  geographyPath.push(
    frenchguiana, guadeloupe, martinique, mayotte, reunion, bonaire, cocos, svalbard, tokelau,
  );

  // Remove Ashmore Reef to prevent extra Australia label
  geographyPath.splice(11, 1);

  // Set numericCode for Kosovo
  geographyPath[117].id = '999';

  // Add capitals for Overseas regions
  const extraCapitals = [
    { name: 'Cayenne', alpha3Code: 'GUF', coordinates: [-52.3135, 4.9224] },
    { name: 'Saint-Denis', alpha3Code: 'REU', coordinates: [55.4551, -20.8907] },
    { name: 'Fort-de-France', alpha3Code: 'MTQ', coordinates: [-61.0588, 14.6161] },
    { name: 'Mamoudzou', alpha3Code: 'MYT', coordinates: [45.2279, -12.7809] },
    { name: 'Basse-Terre', alpha3Code: 'GLP', coordinates: [-61.6947, 16.0341] },
    { name: 'Kralendijk', alpha3Code: 'BES', coordinates: [-68.2655, 12.1443] },
    { name: 'Fakaofo', alpha3Code: 'TKL', coordinates: [-171.2188, -9.3803] },
  ];

  extraCapitals.forEach((capitalObj) => {
    capitalMarkersData.push({ ...capitalObj, markerOffset: -7 });
  });

  // Add "Region of" designation for overseas regions
  const overseasRegions = {
    NZL: ['COK', 'NIU', 'TKL'],
    GBR: ['AIA', 'BMU', 'IOT', 'VGB', 'CYM', 'FLK', 'MSR', 'PCN', 'SHN', 'TCA', 'SGS', 'GGY', 'JEY', 'IMN'],
    USA: ['GUM', 'MNP', 'PRI', 'VIR', 'ASM'],
    AUS: ['CXR', 'CCK', 'NFK', 'HMD'],
    CHN: ['HKG', 'MAC'],
    DNK: ['FRO', 'GRL'],
    FRA: ['BLM', 'MAF', 'SPM', 'WLF', 'PYF', 'NCL', 'REU', 'GLP', 'MTQ', 'GUF', 'MYT'],
    NLD: ['ABW', 'CUW', 'SXM', 'BES'],
    FIN: ['ALA'],
    NOR: ['SJM'],
  };

  Object.keys(overseasRegions).forEach((countryAlpha) => {
    // for (const regionAlpha of overseasRegions[countryAlpha]) {
    overseasRegions[countryAlpha].forEach((regionAlpha) => {
      countryData.find(x => x.alpha3Code === regionAlpha).regionOf = countryAlpha;
    });
  });
};

// Change positioning of country labels
const CountryMarkersFix = (centroids) => {
  const centroidsData = centroids;

  const centroidsFix = [
    // Americas coordinates
    ['CAN', [-100, 55]], ['USA', [-100, 40]], ['CHL', [-73, -39]],
    // Oceania coordinates
    ['FJI', [177.5, -18]], ['KIR', [189, -1]], ['MHL', [169, 8.5]], ['FSM', [151, 7.5]], ['MNP', [145.5, 16.5]],
    ['SLB', [161.6, -9.75]], ['VUT', [168.5, -17]], ['NCL', [163.8, -20.9]], ['PLW', [133, 6]],
    // South America and Africa marker offsets
    ['SUR', -10], ['GUY', -15], ['DOM', 10], ['GMB', 3], ['GNB', 5], ['GIN', 5], ['SLE', 5], ['LBR', 5],
    ['NGA', -5], ['CIV', 22], ['GHA', 10], ['TGO', 5], ['CAF', 5], ['CMR', 10], ['COD', -17], ['COG', 10],
    ['KEN', 10], ['COM', -5], ['MUS', -5], ['ZAF', -8], ['MWI', -5],
    // Europe marker offsets
    ['AUT', -5], ['CHE', 5], ['SVN', -3], ['HRV', -5], ['BIH', -7], ['SRB', 3], ['MNE', -5], ['ALB', 5],
    // Asia marker offsets
    ['ISR', 10], ['JOR', 10], ['LBN', 5], ['GEO', -5], ['ARM', -8], ['TKM', 5], ['AZE', 3], ['BRN', -5], ['BRN', -5],
    // Oceania marker offsets
    ['WLF', -10], ['ASM', 10],
  ];

  centroidsFix.forEach((fix) => {
    if (Array.isArray(fix[1])) {
      centroidsData.find(x => x.alpha3Code === fix[0]).coordinates = fix[1];
    } else {
      centroidsData.find(x => x.alpha3Code === fix[0]).markerOffset = fix[1];
    }
  });
};

const CapitalMarkersFix = (capitalMarkers) => {
  const capitalMarkersData = capitalMarkers;

  const capitalFix = [
    // Caribbean capital markers fix
    ['GTM', 10], ['SLV', 12], ['CRI', 12], ['URY', 15], ['GUY', -10], ['SUR', -5], ['GUF', 0], ['DOM', 0],
    // Africa capital markers fix
    ['CPV', -10], ['SEN', 0], ['GMB', 2], ['GNB', 2], ['GIN', 2], ['SLE', 6], ['LBR', 4], ['BFA', 13],
    ['CIV', -10], ['GHA', 12], ['TGO', 5], ['BEN', -3], ['NGA', 0], ['STP', -5], ['GNQ', 0], ['GAB', 10],
    ['COG', -5], ['COD', 12], ['CAF', -10], ['ERI', 0], ['BDI', 12], ['MYT', 13], ['REU', 13], ['ZAF', -3],
    ['LSO', 13], ['SWZ', 13],
    // Europe capital markers fix
    ['EST', 13], ['SVK', 13], ['HUN', 13], ['HRV', 8], ['SVN', 0], ['CHE', 0], ['AND', 0], ['MCO', 0],
    ['VAT', 15], ['BIH', 0], ['ALB', 12], ['MKD', 12], ['MNE', 0], ['BGR', 5],
    // Asia capital markers fix
    ['ARM', 13], ['PSE', 13], ['JOR', 3], ['IRQ', -3], ['KWT', -3], ['SYR', -12], ['OMN', 12], ['ARE', -3],
    ['AFG', -9], ['PAK', -5], ['IND', -9], ['NPL', -5], ['BTN', 13], ['BGD', 13], ['KOR', 13],
    // Oceania capital markers fix
    ['GUM', 13], ['KIR', 13], ['ASM', 13], ['WLF', -10], ['WSM', -3],
  ];

  capitalFix.forEach((fix) => {
    capitalMarkersData.find(x => x.alpha3Code === fix[0]).markerOffset = fix[1];
  });
};

function SeparateRegions(data) {
  const countryData = data;
  // Separate France into regions
  const coordsFRA = countryData.find(x => x.properties.alpha3Code === 'FRA').geometry.coordinates.splice(0, 7);
  countryData.find(x => x.properties.alpha3Code === 'REU').geometry.coordinates = [coordsFRA[0]];
  countryData.find(x => x.properties.alpha3Code === 'MYT').geometry.coordinates = [coordsFRA[1]];
  countryData.find(x => x.properties.alpha3Code === 'GUF').geometry.coordinates = [coordsFRA[2]];
  countryData.find(x => x.properties.alpha3Code === 'MTQ').geometry.coordinates = [coordsFRA[3]];
  countryData.find(x => x.properties.alpha3Code === 'GLP').geometry.coordinates = coordsFRA.slice(4);

  // Separate Netherlands into regions
  const coordsNLD = countryData.find(x => x.properties.alpha3Code === 'NLD').geometry.coordinates.splice(0, 3);
  countryData.find(x => x.properties.alpha3Code === 'BES').geometry.coordinates = coordsNLD;

  // Separate Cocos from Christmas
  const coordsCXR = countryData.find(x => x.properties.alpha3Code === 'CXR').geometry.coordinates.splice(0, 2);
  countryData.find(x => x.properties.alpha3Code === 'CCK').geometry.coordinates = coordsCXR;

  // Separate Svalbard from Norway
  const coordsNOR = countryData.find(x => x.properties.alpha3Code === 'NOR').geometry.coordinates.splice(22, 10);
  countryData.find(x => x.properties.alpha3Code === 'SJM').geometry.coordinates = coordsNOR;

  // Separate Tokelau from New Zealand
  const coordsNZL = countryData.find(x => x.properties.alpha3Code === 'NZL').geometry.coordinates.splice(11, 2);
  countryData.find(x => x.properties.alpha3Code === 'TKL').geometry.coordinates = coordsNZL;
}

export { DataFix, CountryMarkersFix, CapitalMarkersFix, SeparateRegions };
