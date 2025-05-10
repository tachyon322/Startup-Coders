import { Resend } from 'resend'
import dotenv from "dotenv"

let resendPromise: Resend | null;

dotenv.config();

const getResend = () => {
  if (!resendPromise) {
    resendPromise = new Resend(process.env.RESEND_API_KEY);
  }
  return resendPromise;
};

export default getResend;