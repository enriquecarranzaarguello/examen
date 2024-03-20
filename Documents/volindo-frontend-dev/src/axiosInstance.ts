import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(async config => {
  try {
    const Auth = (await import('@aws-amplify/auth')).default;

    const session = await Auth.currentSession();
    const idToken = session.getIdToken().getJwtToken();

    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
  } catch (error) {
    console.error('Error getting id_token:', error);
  }

  return config;
});

export default axiosInstance;
