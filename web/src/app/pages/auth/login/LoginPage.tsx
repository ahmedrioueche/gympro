import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";
import LoginForm from "./components/LoginForm";

function LoginPage() {
  return (
    <AuthLayout>
      <AuthHeader />
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
