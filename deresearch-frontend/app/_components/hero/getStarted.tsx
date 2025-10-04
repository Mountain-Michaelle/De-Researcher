"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "../../_redux/wallet/walletActions";
import type { AppDispatch, RootState } from "../../_redux/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
//
interface GetStartedProps {
  title?: string;
  bgStyle?: string;
  textColor?: string;
}

//
const GetStarted: React.FC<GetStartedProps> = ({ title, bgStyle, textColor }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isConnected, loading } = useSelector((state: RootState) => state.wallet);
  //
  const handleConnect = async () => {
    await dispatch(connectWallet());
    // Wait for wallet connection before redirect
    setTimeout(() => {
      if (isConnected) {
        router.push("/projects");
      }
    }, 500);
  };

  return (
    <>
      {!isConnected && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="bg-custom-gradient border px-5 py-2 mt-3 rounded-md text-white font-medium"
              style={{ background: bgStyle, color: textColor }}
            >
              {title || "Get Started"}
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-custom-gradient relative">
            <img
              src="/images/wallet.png"
              className="absolute -z-20 -bottom-2 -right-3"
              width={180}
              alt="Wallet background"
            />
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Welcome!</AlertDialogTitle>
              <AlertDialogDescription className="text-red-200 text-[16px]">
                Connect your wallet to get started.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <div className="flex items-center w-full justify-center gap-3">
                <AlertDialogAction onClick={handleConnect}>
                  {loading ? "Connecting..." : isConnected ? "Upload Projects" : "Let's Go!"}
                </AlertDialogAction>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default GetStarted;
