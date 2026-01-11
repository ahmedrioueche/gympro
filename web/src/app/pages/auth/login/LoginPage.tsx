import { useEffect } from "react";
import Hero from "../../../../components/Hero";
import { bgGradient } from "../../../../constants/styles";
import { useTheme } from "../../../../context/ThemeContext";
import AuthHeader from "../components/AuthHeader";
import LoginForm from "./components/LoginForm";

function LoginPage() {
  const { isDark, setMode } = useTheme();

  useEffect(() => {
    setMode("dark");
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isDark ? bgGradient : "bg-background"
      } flex flex-col lg:flex-row overflow-x-hidden`}
    >
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
        <div className="max-w-md w-full space-y-8">
          <AuthHeader />
          <LoginForm />
        </div>
      </div>

      <Hero />
    </div>
  );
}

export default LoginPage;
