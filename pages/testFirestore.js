// pages/testFirestore.js
import { useEffect, useState } from 'react';
import { saveUserData, getUserData } from '../src/firebase/firebaseClient'; // Ensure the import path is correct

const TestFirestore = () => {
  const [userData, setUserData] = useState(null);
  const userId = "testUser123"; // Sample user ID for testing

  useEffect(() => {
    const testFirestore = async () => {
      try {
        // Save test data
        await saveUserData(userId, "Test User", "testuser@example.com");
        console.log("Test data saved.");

        // Retrieve test data
        const data = await getUserData(userId);
        setUserData(data);
        console.log("Test data retrieved:", data);
      } catch (error) {
        console.error("Error testing Firestore:", error);
      }
    };

    testFirestore();
  }, []);

  return (
    <div>
      <h1>Test Firestore</h1>
      {userData ? (
        <div>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TestFirestore;
