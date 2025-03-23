export const mockMileageData = {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    formattedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    summary: {
      distance: 125,
      time: '02:39',
      expenses: 30,
    },
    mapMarkers: [
      { latitude: 45.5017, longitude: -73.5673 },
      { latitude: 45.5088, longitude: -73.5619 },
    ],
  };
  