import { Star } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

export function ManagerTestimonials() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-primary/5 py-24 px-6 border-y border-primary/20"
    >
      <div
        className="max-w-7xl mx-auto text-center mb-16 hero-animate"
        style={
          inView
            ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
            : undefined
        }
      >
        <h2 className="text-4xl font-black mb-4 text-white tracking-tight">
          {t("landing.managerPage.testimonials.title")}
        </h2>
        <p className="text-slate-400 text-lg">
          {t("landing.managerPage.testimonials.subtitle")}
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card p-8 rounded-3xl hover:border-primary/40 transition-all duration-300 hero-animate"
            style={
              inView
                ? { animation: `heroFadeUp 0.6s ease-out ${0.2 * i}s forwards` }
                : undefined
            }
          >
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, starIdx) => (
                <Star
                  key={starIdx}
                  className="w-4 h-4 text-primary fill-primary"
                />
              ))}
            </div>
            <p className="italic text-slate-300 text-lg mb-8 leading-relaxed">
              "{t(`landing.managerPage.testimonials.quote${i}`)}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-white/10">
                <img
                  className="w-full h-full object-cover"
                  alt="Reviewer"
                  src={
                    i === 1
                      ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCo4LHFJuFUi5RxTdsAlEf3Dz0WSSEFBK2y70kQIdfUAg5L-IRWBE29KQa5B_MOEcyIGy3zDUwwVVsi_BcxtP6Uz0mqO2a8ItFaAaM8RXnYMCR3jsge62k3DwEnQ1FBjsYIBmh8rXQVDfB__mu9mMk5SDJP3qHlP1iJhN1h78f_NTln6-8p1zo-18-hXpRB8RgHsxgi91yoDRvPsRL7rqI_YN4ORb1gxg2252Kli-T3afHWYbf695a17l-ZY12q1o9Bg78FFlUCcvk"
                      : i === 2
                        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDax1S41oUACwn-uHDx-pOfFrnejtygWnwQiyy2ds86AayJEmnBfpHweTM_0cNYD8rPlpKfiTibsdzTf5DGH6SCavtghVWOA2RvtN2-0VBQ5VFP0iVic1LUkUaYZg0EV_uL6rP-8kGZJ6WU3DM1KWmyT178Nc_QRMXVUiSldM2ERL4SqmtJmwohlP4Al699asJU1JpmqDE6Fn2oXgdulwxiU4bQfGSE6l9k-jhvxqJEdzHC8F0a2x4d90UW68C7GmY9BCVxE9HbPr4"
                        : "https://lh3.googleusercontent.com/aida-public/AB6AXuAxMGewbfyqpX-xPkYvzGnXjL37vZkdQ3JtzwkIxqJ0_V0hf7qpxBcBApHmgWLQhhh27J1wznuYIECB2V7lXmCDz08aO5jn4nZIwmcff5LMKuqIUkuwQErqlWZPsR-4hwc-FxKkEwsb4YVlFHgd534ROWGQcJb_Y8VPC8xf3VcYcM5iYq1e1sOcmwe4s_-owWOw_kTmBypsXae9JDKSRHTBsqKIzmsLXR_r2HfJmyeWBTEPi83deyswMXQuG-WRL6gVgbcIZLWiEAg"
                  }
                />
              </div>
              <div>
                <p className="font-bold text-white">
                  {t(`landing.managerPage.testimonials.owner${i}`)}
                </p>
                <p className="text-xs text-slate-500 uppercase font-black tracking-widest">
                  {t(`landing.managerPage.testimonials.gym${i}`)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
