import { Fingerprint, Hash, RefreshCcw, Wifi } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../components/ui/InputField";

interface FormData {
  rfidId: string;
  pinCode: string;
}

interface FormErrors {
  pinCode?: string;
}

interface StepAccessInfoProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (field: keyof FormData, value: string | boolean) => void;
  onGeneratePin: () => void;
}

function StepAccessInfo({
  formData,
  errors,
  handleInputChange,
  onGeneratePin,
}: StepAccessInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 gap-8">
        {/* RFID Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-surface border border-border rounded-2xl p-6 transition-all hover:border-primary/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Wifi className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">
                  {t("createMember.access.rfid.label", "RFID Tag")}
                </h4>
                <p className="text-xs text-text-secondary">
                  {t("createMember.access.rfid.helper", "Scan the member's card or bracelet now")}
                </p>
              </div>
            </div>
            
            <InputField
              type="text"
              value={formData.rfidId}
              onChange={(e) => handleInputChange("rfidId", e.target.value)}
              placeholder={t("createMember.access.rfid.placeholder", "Card ID (e.g. 0001234567)")}
              className="bg-background/50"
              autoFocus
            />
          </div>
        </div>

        {/* PIN Section */}
        <div className="bg-surface border border-border rounded-2xl p-6 transition-all hover:border-primary/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">
                {t("createMember.access.pin.label", "Personal PIN Code")}
              </h4>
              <p className="text-xs text-text-secondary">
                {t("createMember.access.pin.helper", "Used for manual entry at the terminal")}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <InputField
                type="text"
                value={formData.pinCode}
                onChange={(e) => handleInputChange("pinCode", e.target.value)}
                placeholder="123456"
                error={errors.pinCode}
                className="bg-background/50 font-mono tracking-widest text-lg"
                maxLength={8}
              />
            </div>
            <button
              type="button"
              onClick={onGeneratePin}
              className="h-[52px] px-4 rounded-xl border border-border bg-surface hover:bg-muted text-text-primary transition-all flex items-center justify-center gap-2 group shadow-sm active:scale-95"
              title={t("createMember.access.pin.generate", "Auto-Generate PIN")}
            >
              <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline text-sm font-medium">
                {t("common.generate", "Generate")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepAccessInfo;
