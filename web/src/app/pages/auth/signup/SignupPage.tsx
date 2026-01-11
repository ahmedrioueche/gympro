import { useEffect } from "react";
import Hero from "../../../../components/Hero";
import { bgGradient } from "../../../../constants/styles";
import { useTheme } from "../../../../context/ThemeContext";
import AuthHeader from "../components/AuthHeader";
import SignupForm from "./components/SignupForm";

function SignupPage() {
  const { isDark, setMode } = useTheme();

  useEffect(() => {
    setMode("dark");
  }, []);

  return (
    <div
      className={`min-h-screen flex ${isDark ? bgGradient : "bg-background"}`}
    >
      <div className="overflow-y-auto flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <AuthHeader type="signup" />
          <SignupForm />
        </div>
      </div>

      <Hero />
    </div>
  );
}

export default SignupPage;
