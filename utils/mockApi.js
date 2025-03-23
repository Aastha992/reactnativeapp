import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create an Axios instance
const axiosInstance = axios.create();

// Check environment and set up mock adapter
if (process.env.NODE_ENV === 'development') {
  const mock = new MockAdapter(axiosInstance);

  // Mock API response for directions
  mock.onGet('https://maps.googleapis.com/maps/api/directions/json').reply(200, {
    routes: [
      {
        legs: [
          {
            distance: { text: "15.5 km" },
            duration: { text: "25 mins" },
          },
        ],
      },
    ],
  });

  mock.onGet('/api/project-details').reply(200, {
    projectName: 'Construction Project Alpha',
    employees: ['Matt Friesen', 'Kathryn Murphy', 'Brooklyn Simmons', 'John Doe'],
    defaultHours: {
      totalHours: '200',
      billableHours: '180',
      rate: '50',
      subTotal: '9000',
      total: '9500',
    },
  });

  console.log('Mock API is active.');
}
// Define and export fetchProjectDetails
export const fetchProjectDetails = async () => {
  return {
    projectName: 'Construction Project Alpha',
    employees: ['Matt Friesen', 'Kathryn Murphy', 'Brooklyn Simmons'],
    defaultHours: {
      totalHours: '200',
      billableHours: '180',
      rate: '50',
      subTotal: '9000',
      total: '9500',
    },
  };
};

export default axiosInstance;