// SuccessPage.js
import { useEffect, useState } from "react";
import SuccessMetaMask from "./successMetaMask";
import SuccessWeb3Auth from "./successWeb3Auth";

const SuccessPage = () => {
  const [loginMethod, setLoginMethod] = useState("");

  useEffect(() => {
    const method = localStorage.getItem('loginMethod');
    setLoginMethod(method);
  }, []);

  if (!loginMethod) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {loginMethod === 'metamask' ? (
        <SuccessMetaMask />
      ) : loginMethod === 'web3auth' ? (
        <SuccessWeb3Auth />
      ) : (
        <p>Invalid login method.</p>
      )}
    </div>
  );
};

export default SuccessPage;
