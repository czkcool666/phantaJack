import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Moralis from 'moralis';

const User = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (session) {
      Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });
      const fetchUserData = async () => {
        try {
          const user = await Moralis.User.current();
          const userBalance = await Moralis.Web3API.account.getNativeBalance({
            address: user.get('ethAddress'),
          });
          setUserData({ user, userBalance });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold mb-8">Welcome, {session.user.email}</h1>
      {userData && (
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">User Information</h2>
          <p><strong>Username:</strong> {userData.user.get('username')}</p>
          <p><strong>ETH Address:</strong> {userData.user.get('ethAddress')}</p>
          <p><strong>Balance:</strong> {Moralis.Units.FromWei(userData.userBalance.balance)}</p>
        </div>
      )}
    </div>
  );
};

export default User;
