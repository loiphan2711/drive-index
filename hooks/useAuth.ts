'use client';

import type { SendOtpInput, VerifyOtpInput } from '@/services/auth';
import useSWRMutation from 'swr/mutation';

import { sendOtp, signOut, verifyOtp } from '@/services/auth';

const sendOtpMutation = (_key: string, { arg }: { arg: SendOtpInput }) =>
  sendOtp(arg);

const verifyOtpMutation = (_key: string, { arg }: { arg: VerifyOtpInput }) =>
  verifyOtp(arg);

const signOutMutation = () => signOut();

export const useSendOtp = () =>
  useSWRMutation('/api/auth/send-otp', sendOtpMutation);

export const useVerifyOtp = () =>
  useSWRMutation('/api/auth/verify-otp', verifyOtpMutation);

export const useSignOut = () =>
  useSWRMutation('auth/sign-out', signOutMutation);
