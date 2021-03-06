import { feature } from 'topojson-client';
import {
  DataFix,
  CountryMarkersFix,
  CapitalMarkersFix,
  SeparateRegions,
} from '../helpers/attributeFix';
import capitalData from '../assets/country_capitals';
import { alpha3Codes } from '../assets/regionAlpha3Codes';
import { geoPath } from 'd3-geo';

export default function loadPaths() {
  fetch('/world-50m.json')
    .then((response) => {
      if (response.status !== 200) {
        console.log(`There was a problem: ${response.status}`);
        return;
      }
      response.json().then((worldData) => {
        fetch('https://restcountries.eu/rest/v2/all?fields=name;alpha3Code;alpha2Code;numericCode;area')
          .then((restCountries) => {
            if (restCountries.status !== 200) {
              console.log(`There was a problem: ${restCountries.status}`);
              return;
            }
            restCountries.json().then((restData) => {
              let data = feature(worldData, worldData.objects.countries).features;
              let countryMarkers = [];
              const capitalMarkers = [];

              // Remove Antarctica and invalid iso codes
              data = data.filter(x => (+x.id !== 10 ? 1 : 0));

              const essentialData = ['name', 'capital', 'alpha3Code', 'alpha2Code', 'area'];

              DataFix(data, restData, capitalMarkers);

              data.filter(x => ((+x.id !== -99) ? 1 : 0)).forEach((x) => {
                const geography = x;
                const countryData = restData.find(c => +c.numericCode === +geography.id);

                essentialData.forEach((key) => { geography.properties[key] = countryData[key]; });

                if (countryData.regionOf) {
                  geography.properties.regionOf = countryData.regionOf;
                }

                if (countryData.altSpellings) {
                  geography.properties.altSpellings = countryData.altSpellings;
                }

                const captemp = capitalData
                  .find(capital => capital.CountryCode === countryData.alpha2Code);
                if (captemp) {
                  const capitalCoords = [+captemp.CapitalLongitude, +captemp.CapitalLatitude];

                  capitalMarkers.push({
                    name: countryData.capital,
                    alpha3Code: countryData.alpha3Code,
                    coordinates: capitalCoords,
                    markerOffset: -7,
                  });
                }
              });

              SeparateRegions(data);

              data.forEach((x) => {
                const { alpha3Code } = x.properties;
                const path = geoPath().projection(this.projection());
                countryMarkers.push([this.projection().invert(path.centroid(x)), alpha3Code]);
              });

              countryMarkers = countryMarkers.map(array => ({
                name: data.find(x => x.properties.alpha3Code === array[1]).properties.name,
                alpha3Code: array[1],
                coordinates: array[0],
                markerOffset: 0,
              }));
              CountryMarkersFix(countryMarkers);
              CapitalMarkersFix(capitalMarkers);

              const filterRegions = alpha3Codes.world

              this.setState({ geographyPaths: data, countryMarkers, capitalMarkers, filterRegions });
            });
          });
      });
    });
}