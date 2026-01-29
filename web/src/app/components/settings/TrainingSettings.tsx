import {
  type TimerSettings,
  TIMER_SOUND_TRACKS,
} from "@ahmedrioueche/gympro-client";
import { Play, Square, Timer } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../../components/ui/InputField";

interface TrainingSettingsProps {
  timerSettings: TimerSettings;
  onUpdate: (settings: TimerSettings) => void;
}

export default function TrainingSettings({
  timerSettings,
  onUpdate,
}: TrainingSettingsProps) {
  const { t } = useTranslation();
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const handleUpdate = (field: keyof TimerSettings, value: any) => {
    onUpdate({ ...timerSettings, [field]: value });
  };

  const handlePreviewSound = (trackId: string) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.src = `/sounds/timer/${trackId}.mp3`;
      previewAudioRef.current.play().catch(console.error);
      setPlayingTrackId(trackId);
      previewAudioRef.current.onended = () => setPlayingTrackId(null);
    }
  };

  const stopPreviewSound = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      setPlayingTrackId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden audio element for preview */}
      <audio ref={previewAudioRef} preload="none" />

      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          {t("member.settings.training.title", "Training Settings")}
        </h3>
        <p className="text-sm text-text-secondary">
          {t(
            "member.settings.training.subtitle",
            "Manage your training preferences",
          )}
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Timer Settings */}
        <div className="bg-background border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-border/50">
            <div className="p-2 rounded-lg bg-surface border border-border text-text-secondary">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-text-primary">
                {t(
                  "member.settings.preferences.timer.title",
                  "Smart Rest Timer",
                )}
              </p>
              <p className="text-sm text-text-secondary">
                {t(
                  "member.settings.preferences.timer.subtitle",
                  "Customize your workout rest timer",
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                {t(
                  "member.settings.preferences.timer.defaultRest",
                  "Default Rest (seconds)",
                )}
              </label>
              <InputField
                type="number"
                value={timerSettings.defaultRestTime}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  handleUpdate("defaultRestTime", val);
                }}
                min="0"
                placeholder="90"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                {t(
                  "member.settings.preferences.timer.alarmDuration",
                  "Maximum Alarm Duration (seconds)",
                )}
              </label>
              <InputField
                type="number"
                value={timerSettings.alarmDuration}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  handleUpdate("alarmDuration", val);
                }}
                min="1"
                max="30"
                placeholder="3"
              />
            </div>

            <div className="col-span-full space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                {t(
                  "member.settings.preferences.timer.sound",
                  "Completion Sound",
                )}
              </label>
              <div className="flex gap-2">
                {(["beep", "vibrate", "silent"] as const).map((sound) => (
                  <button
                    key={sound}
                    onClick={() => handleUpdate("sound", sound)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                      timerSettings.sound === sound
                        ? "bg-primary text-white border-primary"
                        : "bg-surface border-border hover:border-primary/50 text-text-secondary"
                    }`}
                  >
                    {sound}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Track Selector - only shown when sound is "beep" */}
            {timerSettings.sound === "beep" && (
              <div className="col-span-full space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  {t(
                    "member.settings.preferences.timer.completionSoundTrack",
                    "Completion Sound",
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TIMER_SOUND_TRACKS.map((track) => (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                        (timerSettings.soundTrack ?? "beep_1") === track.id
                          ? "bg-primary/10 border-primary text-text-primary"
                          : "bg-surface border-border hover:border-primary/50 text-text-secondary"
                      }`}
                      onClick={() => handleUpdate("soundTrack", track.id)}
                    >
                      <span className="text-sm font-medium">{track.label}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (playingTrackId === track.id) {
                            stopPreviewSound();
                          } else {
                            handlePreviewSound(track.id);
                          }
                        }}
                        className={`p-1.5 rounded-full transition-colors ${
                          playingTrackId === track.id
                            ? "hover:bg-red-500/20 text-red-500"
                            : "hover:bg-primary/20 text-primary"
                        }`}
                        title={
                          playingTrackId === track.id
                            ? t("common.stop", "Stop")
                            : t("common.preview", "Preview")
                        }
                      >
                        {playingTrackId === track.id ? (
                          <Square size={14} />
                        ) : (
                          <Play size={14} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Countdown Settings - only shown when sound is "beep" */}
            {timerSettings.sound === "beep" && (
              <>
                <div className="col-span-full border-t border-border/50 pt-4 mt-2">
                  <p className="text-sm font-medium text-text-primary mb-1">
                    {t(
                      "member.settings.preferences.timer.warningCountdown",
                      "Warning Countdown",
                    )}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {t(
                      "member.settings.preferences.timer.warningCountdownDesc",
                      "Play a warning sound before the timer ends",
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    {t(
                      "member.settings.preferences.timer.warningSeconds",
                      "Warning At (seconds)",
                    )}
                  </label>
                  <InputField
                    type="number"
                    value={timerSettings.warningSeconds ?? 5}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      handleUpdate("warningSeconds", val);
                    }}
                    min="1"
                    max="30"
                    placeholder="5"
                  />
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    {t(
                      "member.settings.preferences.timer.warningSoundTrack",
                      "Warning Sound",
                    )}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {TIMER_SOUND_TRACKS.map((track) => (
                      <div
                        key={track.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                          (timerSettings.warningSoundTrack ?? "beep_1") ===
                          track.id
                            ? "bg-warning/10 border-warning text-text-primary"
                            : "bg-surface border-border hover:border-warning/50 text-text-secondary"
                        }`}
                        onClick={() =>
                          handleUpdate("warningSoundTrack", track.id)
                        }
                      >
                        <span className="text-sm font-medium">
                          {track.label}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (playingTrackId === track.id) {
                              stopPreviewSound();
                            } else {
                              handlePreviewSound(track.id);
                            }
                          }}
                          className={`p-1.5 rounded-full transition-colors ${
                            playingTrackId === track.id
                              ? "hover:bg-red-500/20 text-red-500"
                              : "hover:bg-warning/20 text-warning"
                          }`}
                          title={
                            playingTrackId === track.id
                              ? t("common.stop", "Stop")
                              : t("common.preview", "Preview")
                          }
                        >
                          {playingTrackId === track.id ? (
                            <Square size={14} />
                          ) : (
                            <Play size={14} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
