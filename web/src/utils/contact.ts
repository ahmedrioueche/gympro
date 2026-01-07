import { APP_DATA } from "../../../packages/client/src/constants/app";
import type { TranslationType } from "../types/common";

export const handleContactSupport = (
  t: TranslationType,
  subject?: string,
  body?: string
) => {
  const email = APP_DATA.email;
  const encodedSubject = encodeURIComponent(subject || t("support.subject"));
  const encodedBody = encodeURIComponent(body || t("support.body"));
  window.open(
    `https://mail.google.com/mail/?view=cm&to=${email}&su=${encodedSubject}&body=${encodedBody}`,
    "_blank"
  );
};

export const openGmail = (email: string, subject?: string, body?: string) => {
  if (!email) return;
  const encodedSubject = encodeURIComponent(subject || "");
  const encodedBody = encodeURIComponent(body || "");
  window.open(
    `https://mail.google.com/mail/?view=cm&to=${email}&su=${encodedSubject}&body=${encodedBody}`,
    "_blank"
  );
};

export const openWhatsApp = (phoneNumber: string, message?: string) => {
  if (!phoneNumber) return;
  // Remove non-numeric characters for the API
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message || "");
  window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
};
