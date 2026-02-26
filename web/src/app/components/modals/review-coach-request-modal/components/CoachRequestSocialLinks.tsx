import { Instagram, Link as LinkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  links?: string[];
}

export function CoachRequestSocialLinks({ links }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
        <Instagram className="w-4 h-4 text-primary" />
        {t("admin.coaching.reviewModal.socialMedia")}
      </h4>
      {links && links.length > 0 ? (
        <div className="space-y-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline truncate"
            >
              <LinkIcon className="w-3 h-3 flex-shrink-0" />
              {link}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary italic">
          {t("admin.coaching.reviewModal.noSocialMedia")}
        </p>
      )}
    </div>
  );
}
