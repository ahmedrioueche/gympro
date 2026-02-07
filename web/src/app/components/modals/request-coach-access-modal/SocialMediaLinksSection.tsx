import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../components/ui/InputField";

interface SocialMediaLinksSectionProps {
  links: string[];
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  onLinkChange: (index: number, value: string) => void;
}

export function SocialMediaLinksSection({
  links,
  onAddLink,
  onRemoveLink,
  onLinkChange,
}: SocialMediaLinksSectionProps) {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        {t("dashboard.socialMediaLinks", "Social Media / Portfolio Links")}
      </label>
      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <InputField
                type="url"
                value={link}
                onChange={(e) => onLinkChange(index, e.target.value)}
                placeholder="https://"
              />
            </div>
            {links.length > 1 && (
              <button
                onClick={() => onRemoveLink(index)}
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors mt-[1px]"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onAddLink}
          className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80"
        >
          <Plus className="w-4 h-4" />
          {t("common.addLink", "Add Link")}
        </button>
      </div>
    </div>
  );
}
