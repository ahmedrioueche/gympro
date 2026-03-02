import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";
import SignupForm from "./components/SignupForm";

function SignupPage() {
  return (
    <AuthLayout>
      <AuthHeader type="signup" />
      <SignupForm />
    </AuthLayout>
  );
}

export default SignupPage;
