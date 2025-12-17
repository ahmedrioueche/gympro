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
