import firestore from '@react-native-firebase/firestore';

export const saveUserProfile = async (userId: string, userData: any) => {
  try {
    await firestore().collection('users').doc(userId).set(userData, { merge: true });
    console.log('User profile saved successfully!');
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      console.log('No user profile found!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const deleteUserProfile = async (userId: string) => {
  try {
    await firestore().collection('users').doc(userId).delete();
    console.log('User profile deleted successfully!');
  } catch (error) {
    console.error('Error deleting user profile:', error);
  }
};

export const updateUserField = async (userId: string, field: string, value: any) => {
  try {
    await firestore().collection('users').doc(userId).update({ [field]: value });
    console.log(`User field ${field} updated successfully!`);
  } catch (error) {
    console.error(`Error updating user field ${field}:`, error);
  }
};
