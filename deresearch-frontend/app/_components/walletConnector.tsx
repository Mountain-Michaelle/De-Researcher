"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../_redux/store";
import { connectWallet, checkWalletConnection } from "../_redux/wallet/walletActions";
import { Alert } from "./modals/popUp";
import { useWalletConnect } from "../walletUtils/hooks/useConnect";


interface WalletConnectorProps {
  title?: string;
  bgStyle?: string;
  textColor?: string;
}

//
// 🧠 Component
//
const WalletConnector: React.FC<WalletConnectorProps> = ({
  title,
  bgStyle,
  textColor,
}) => {

  const [isVisible, setIsVisible] = useState<Boolean>(true)
  
   const handleCancel = () => {
    setIsVisible(false)
  }
  // Type-safe Redux hooks
  const dispatch = useDispatch<AppDispatch>();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

  const { shortAddress, isConnected, loading, error } = useTypedSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(checkWalletConnection());

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        dispatch(checkWalletConnection());
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, [dispatch]);

  return (
    <>
      {!isConnected ? (
        <button
          onClick={() => dispatch(connectWallet())}
          className="bg-custom-gradient lg:w-[190px] md:w-[180px] m-auto text-center p-3 rounded-full text-[18px] text-white"
          style={{ background: bgStyle ? bgStyle : '', color: textColor }}
        >
          {loading ? "Connecting..." : title ?? "Connect Wallet"}
        </button>
      ) : (
        <Alert
          text="Go to MetaMask and disconnect your wallet!"
          account={shortAddress ?? ""}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default WalletConnector;
