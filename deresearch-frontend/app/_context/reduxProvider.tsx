"use client"; // ✅ Must be client component

import { Provider } from "react-redux";
import { store } from "../_redux/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}