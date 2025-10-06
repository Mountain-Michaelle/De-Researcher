"use client";

import React from "react";
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
import { disconnectWallet } from "../../_redux/wallet/walletActions";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../_redux/store";

//
// 🧩 Define prop types
//

interface PopupProps {
  handleDisconnect: () => void;
  handleCancel: () => void;
  isVisible: boolean;
  text: string;
  popType: string;
  haveButton?: boolean;
}

interface AlertProps {
  account: string;
  handleCancel: () => void;
  text: string;
}

//
// 🧱 Popup component
//
export const Popup: React.FC<PopupProps> = ({
  handleDisconnect,
  handleCancel,
  isVisible,
  text,
  popType,
  haveButton = false,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed h-[100vh] top-0 inset-x-0 flex justify-center z-40">
      <div
        className="bg-custom-gradient overflow-hidden border relative border-red-500 
        border-opacity-10 z-50 rounded-md p-6 w-96 h-fit mt-32 animate-slide-center"
        style={{ backdropFilter: "blur(20px)" }}
      >
        <div className="absolute -z-20 -bottom-5 -right-3">
          <img src="/images/wallet.png" width={180} alt="wallet background" />
        </div>

        <h2 className="font-semibold text-2xl text-orange-400">{popType}</h2>
        <p className="text-white mt-2 text-xl">{text}</p>

        {haveButton && (
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 bg-opacity-50 hover:bg-gray-400 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-600 bg-opacity-55 hover:bg-red-700 hover:bg-opacity-65 text-white rounded-md"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export const Alert: React.FC<AlertProps> = ({ account, handleCancel, text }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div
          className="bg-custom-gradient w-fit md:w-[180px] text-center p-3 md:p-2 rounded-full text-[18px] 
          overflow-hidden text-white relative"
        >
          <div className="flex justify-center absolute left-0 top-0 bottom-0 bg-white w-[45px] h-[45px] rounded-full">
            <img
              src="/images/logos/metamask.svg"
              alt="MetaMask"
              className="w-[35px] md:w-[40px]"
            />
          </div>
          <div className="ml-12 md:ml-8">{account}</div>
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-custom-gradient">
        <img
          src="/images/wallet.png"
          className="absolute -z-20 -bottom-2 -right-3"
          width={180}
          alt="Wallet illustration"
        />
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-red-300 text-[16px]">
            {text}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <div className="flex items-center gap-3">
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => dispatch(disconnectWallet())}>
              Hide
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
