"use client";

import { useReducer, useCallback } from "react";
import type { UserPublic } from "@/context/AuthContext";

export type AuthStep =
  | "EMAIL"
  | "LOGIN_OTP"
  | "SIGNUP_DETAILS"
  | "SIGNUP_OTP"
  | "SUCCESS";

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "client" | "developer";
}

export interface AuthState {
  step: AuthStep;
  mode: "login" | "signup";
  email: string;
  firstName: string;
  otpSentAt: number | null;
  isLoading: boolean;
  error: string | null;
  userData: Partial<RegisterData>;
}

type AuthAction =
  | { type: "SET_EMAIL"; email: string }
  | { type: "USER_EXISTS"; firstName?: string }
  | { type: "USER_NEW" }
  | { type: "OTP_SENT"; timestamp: number }
  | { type: "SET_USER_DATA"; data: Partial<RegisterData> }
  | { type: "OTP_VERIFIED" }
  | { type: "ERROR"; message: string }
  | { type: "LOADING"; value: boolean }
  | { type: "RESET" };

const initialState: AuthState = {
  step: "EMAIL",
  mode: "login",
  email: "",
  firstName: "",
  otpSentAt: null,
  isLoading: false,
  error: null,
  userData: {},
};

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.email, error: null };
    case "USER_EXISTS":
      return {
        ...state,
        step: "LOGIN_OTP",
        mode: "login",
        firstName: action.firstName ?? "",
        error: null,
      };
    case "USER_NEW":
      return { ...state, step: "SIGNUP_DETAILS", mode: "signup", error: null };
    case "OTP_SENT":
      return {
        ...state,
        otpSentAt: action.timestamp,
        step: state.mode === "signup" ? "SIGNUP_OTP" : state.step,
        error: null,
      };
    case "SET_USER_DATA":
      return { ...state, userData: { ...state.userData, ...action.data } };
    case "OTP_VERIFIED":
      return { ...state, step: "SUCCESS", error: null, isLoading: false };
    case "ERROR":
      return { ...state, error: action.message, isLoading: false };
    case "LOADING":
      return { ...state, isLoading: action.value, error: null };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

export function useAuthFlow(initialMode: "login" | "signup" = "login") {
  const [state, dispatch] = useReducer(reducer, { ...initialState, mode: initialMode });

  const setEmail = useCallback((email: string) => dispatch({ type: "SET_EMAIL", email }), []);
  const setUserExists = useCallback((firstName?: string) => dispatch({ type: "USER_EXISTS", firstName }), []);
  const setUserNew = useCallback(() => dispatch({ type: "USER_NEW" }), []);
  const setOtpSent = useCallback((timestamp: number) => dispatch({ type: "OTP_SENT", timestamp }), []);
  const setUserData = useCallback((data: Partial<RegisterData>) => dispatch({ type: "SET_USER_DATA", data }), []);
  const setOtpVerified = useCallback(() => dispatch({ type: "OTP_VERIFIED" }), []);
  const setError = useCallback((message: string) => dispatch({ type: "ERROR", message }), []);
  const setLoading = useCallback((value: boolean) => dispatch({ type: "LOADING", value }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return {
    state,
    setEmail,
    setUserExists,
    setUserNew,
    setOtpSent,
    setUserData,
    setOtpVerified,
    setError,
    setLoading,
    reset,
  };
}
