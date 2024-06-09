import { Magic, MagicSDKAdditionalConfiguration } from 'magic-sdk';
import { OpenIdExtension } from '@magic-ext/oidc';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';

type MagicInstance = Magic;

const createMagicInstance = (key: string): MagicInstance => {
  const config: MagicSDKAdditionalConfiguration = {
    extensions: [new OpenIdExtension() as any],
  };
  return new Magic(key, config);
};

const MagicContext = createContext<{ magic: MagicInstance | null; web3: Web3 | null }>({
  magic: null,
  web3: null,
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: ReactNode }) => {
  const [magic, setMagic] = useState<MagicInstance | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY) {
      const magicInstance = createMagicInstance(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string);
      setMagic(magicInstance);
      setWeb3(new Web3((magicInstance as any).rpcProvider));
    }
  }, []);

  const value = useMemo(() => ({
    magic,
    web3,
  }), [magic, web3]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
