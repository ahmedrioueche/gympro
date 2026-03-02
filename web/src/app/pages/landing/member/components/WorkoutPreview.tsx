import { History, PlayCircle, Timer } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

export function WorkoutPreview() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  const exercises = [
    {
      id: 1,
      name: "Barbell Bench Press",
      sets: "4 Sets x 8-10 Reps",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDjrw5OkksRn84DFBZl9x5J5FEi3M4av2x3400Cafu7DXgtbp6h-yl9lmADtYKp96FWMHuXblZYE_J4Wy__bnBGSQCSHXo23GRdos6DztXjaumMH7uZilEGDFYYUn-E1CU9CKX8DOe8aVBE9DubheVMh7YzLwwiAfQ1EaXQSShWpkNndG9mFeaVBfcui0Ic-c6QKGL6iLg4tL6y8v56lFNK87_YTcVnSOasRT4QwOXmuO2bKn0FrT3ci_jx6rfLgrdYiV7tkI4REZ0",
    },
    {
      id: 2,
      name: "Overhead Press",
      sets: "3 Sets x 10-12 Reps",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDdeeUiyDToXqDt4csfkslASoNNHO8xbquGPBhojcYoWbbx9Heta0NVHsfUeWhGrcqp09UJR2Ox3DlSo9qgV8iLubqobkgh9dzqfE1RsbOfMmAnw5t1VgkX7faq13mUJTGoheru5rhFIBGIvC2uDEy1eGqRQo8-f61CMlLRNAzQaSHlCV53AcgOS0M6emxj3SOxfi-L8550lUNIZQH99MyVR7TDzzk3Zj-1uk57DDTO0_G6mFpvUveCvvoWkPvCrhDbGSAvT1MFI6Q",
    },
    {
      id: 3,
      name: "Incline DB Flyes",
      sets: "3 Sets x 12-15 Reps",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBRy1s8kuioEddgYg0D56fb0NvZPm8qpgNNuar5tNBLng8qOe4hzKMcx5ZmgPmEBADQk-FwBlrAqxTdsMgrXCZF20Uw7W4k1zkxVhHcyr1XhePaRgcPvjI7FhkMWCiSlyN7S3T4Edb4QC7rDC1sSua5kEnUxSbnh71zi74DLqXNbQlqXMzfnjmVDf_BMzu_wRafbL27a2Fiki4_J6V-FxLJF4fWmJvEyh5xj-rfMm0UxKcgPQcJM-L_X8rqZEQqvxsLVX-NdkJBSpU",
    },
    {
      id: 4,
      name: "Lateral Raises",
      sets: "4 Sets x 15-20 Reps",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBMl2UCv9WQ4ZvmUQY-f0-mODrJjlLJEUx2tb_rQqjKramKfrjk2suHVV7ZyKljI0eOjHCi461w2_J7K9CwIWi29yRNnvfnxem97dR__yMCoXngGAA42VeFdS-fLCsEdWqhMlR8hKQQ1XjQeNaVxDgQnealmz4ZXf-U1vVpXLdtJgtxAR1ahco6VltEcNRO_ODsiPkgPYzzCy7McxcXw-DTG-n1HhYwsf3q0OObkO7GOD2F5tafNDzrOH0oK_Sf6zKjvG0UJ80cOhk",
    },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start py-24"
    >
      <div
        className="space-y-6 pt-10 hero-animate"
        style={
          inView
            ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
            : undefined
        }
      >
        <h2 className="text-4xl font-bold text-white tracking-tight">
          {t("landing.memberPage.preview.title")}
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          {t("landing.memberPage.preview.description")}
        </p>
        <ul className="space-y-6 mt-8">
          <li className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary mt-1 shrink-0">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold">
                {t("landing.memberPage.preview.restTimers.title")}
              </h4>
              <p className="text-slate-400 text-sm">
                {t("landing.memberPage.preview.restTimers.desc")}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary mt-1 shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold">
                {t("landing.memberPage.preview.history.title")}
              </h4>
              <p className="text-slate-400 text-sm">
                {t("landing.memberPage.preview.history.desc")}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div
        className="glass-card rounded-[2.5rem] p-6 md:p-8 border-white/20 shadow-2xl shadow-secondary/10 relative overflow-hidden hero-animate"
        style={
          inView
            ? { animation: "heroFadeUp 0.6s ease-out 0.3s forwards" }
            : undefined
        }
      >
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-white">
              {t("landing.memberPage.preview.workout.title")}
            </h3>
            <p className="text-accent-purple text-xs font-medium uppercase tracking-widest mt-1">
              {t("landing.memberPage.preview.workout.focus")}
            </p>
          </div>
          <div className="bg-secondary/20 px-3 py-1 rounded-full text-secondary text-xs font-bold border border-secondary/20">
            {t("landing.memberPage.preview.workout.duration")}
          </div>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/40 transition-all group cursor-pointer"
            >
              <div className="size-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                <img
                  alt={ex.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  src={ex.image}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium group-hover:text-secondary transition-colors">
                  {ex.name}
                </h4>
                <p className="text-slate-500 text-xs mt-1">{ex.sets}</p>
              </div>
              <PlayCircle className="text-slate-500 group-hover:text-secondary transition-colors w-6 h-6" />
            </div>
          ))}
        </div>

        <button className="w-full mt-8 bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-secondary/40 active:scale-95 relative z-10">
          {t("landing.memberPage.preview.workout.cta")}
        </button>

        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
      </div>
    </section>
  );
}
