import Fuse from 'fuse.js';
import metroAreas from '../assets/data/airportsAreaList.json';
import airports from '../assets/data/airportsList.json';
import { DisplayAirportType } from '@typing/types';

const airportsSearcher = new Fuse(airports, {
  keys: [
    { name: 'code', weight: 0.4 },
    { name: 'normalName', weight: 0.6 },
    { name: 'normalCity', weight: 0.9 },
    { name: 'normalCountry', weight: 0.5 },
    { name: 'normalKeywords', weight: 0.8 },
  ],
  minMatchCharLength: 3,
  threshold: 0.2,
});

const metroAreasSearcher = new Fuse(metroAreas, {
  keys: [
    { name: 'code', weight: 0.4 },
    { name: 'city', weight: 0.9 },
    { name: 'country', weight: 0.5 },
    { name: 'airports', weight: 0.4 },
    { name: 'keywords', weight: 0.8 },
  ],
  minMatchCharLength: 3,
  threshold: 0.2,
});

export const searchAirportByWord = (word: string) => {
  const airports = airportsSearcher.search(
    word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  );
  const metroAreas = metroAreasSearcher.search(word);

  let displayAirports: DisplayAirportType[] = [];

  if (metroAreas.length === 0) {
    displayAirports = airports.map(result => {
      return {
        type: 'normal',
        id: result.item.id,
        code: result.item.code,
        city: result.item.city,
        country: result.item.country,
        name: result.item.name,
      };
    });

    return displayAirports;
  }

  metroAreas.forEach(metroArea => {
    // Add metroarea to the list
    displayAirports.push({
      type: 'area',
      code: metroArea.item.code,
      city: metroArea.item.city,
      country: metroArea.item.country,
    });
    // Search airports on metro area
    const actualAirportsOnArea = airports.filter(result =>
      metroArea.item.airports.includes(result.item.code)
    );
    // Remove from original and add on display
    actualAirportsOnArea.forEach(result => {
      const index = airports.indexOf(result);
      airports.splice(index, 1);
      displayAirports.push({
        type: 'sub',
        id: result.item.id,
        code: result.item.code,
        name: result.item.name,
        city: result.item.city,
        country: result.item.country,
      });
    });
  });

  //Add remaining airports to the list
  airports.forEach(result => {
    displayAirports.push({
      type: 'normal',
      code: result.item.code,
      name: result.item.name,
      city: result.item.city,
      country: result.item.country,
    });
  });

  return displayAirports;
};

export const searchAirportByCode = (code: string) => {
  return (
    airports.find(airport => airport.code === code) ||
    metroAreas.find(metroArea => metroArea.code === code) ||
    null
  );
};
