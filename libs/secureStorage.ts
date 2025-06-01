import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'weatherApp-token';

export const saveSecureToken = async (token: string) => {
  try {
    await Keychain.setGenericPassword('user', token, {
      service: SERVICE_NAME,
    });
  } catch (error) {
    console.error('Error saving token to Keychain', error);
  }
};

export const getSecureToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE_NAME,
    });
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Error getting token from Keychain', error);
    return null;
  }
};

export const deleteSecureToken = async () => {
  try {
    await Keychain.resetGenericPassword({ service: SERVICE_NAME });
  } catch (error) {
    console.error('Error deleting token from Keychain', error);
  }
};
