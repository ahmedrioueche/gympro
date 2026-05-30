import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "./LoginForm";

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockLogin = {
  method: "email",
  setMethod: vi.fn(),
  formData: { email: "", password: "" },
  handleChange: vi.fn(),
  rememberMe: false,
  setRememberMe: vi.fn(),
  phone: {
    countryCode: "US",
    phoneNumber: "",
    setCountryCode: vi.fn(),
    setPhoneNumber: vi.fn(),
  },
  isSubmitting: false,
  isGoogleLoading: false,
  isFormValid: true,
  handleLogin: vi.fn((e) => e.preventDefault()),
  handleGoogleLogin: vi.fn(),
};

vi.mock("../hooks/useLogin", () => ({
  useLogin: () => mockLogin,
}));

vi.mock("../../../../../hooks/usePhoneFeatures", () => ({
  usePhoneFeatures: () => ({
    isPhoneEnabled: true,
    isGeneralSmsEnabled: true,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email login by default", () => {
    render(<LoginForm />);
    expect(
      screen.getByPlaceholderText("auth.email_placeholder"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("auth.password_placeholder"),
    ).toBeInTheDocument();
  });

  it("toggles to phone login method", () => {
    render(<LoginForm />);
    const toggleButton = screen.getByTitle("auth.phone");
    fireEvent.click(toggleButton);
    expect(mockLogin.setMethod).toHaveBeenCalledWith("phone");
  });

  it("renders phone login when method is phone", () => {
    mockLogin.method = "phone";
    render(<LoginForm />);
    // PhoneNumberInput mock should be handled, but here we check for the absence of email
    expect(
      screen.queryByPlaceholderText("auth.email_placeholder"),
    ).not.toBeInTheDocument();
    mockLogin.method = "email"; // Reset for other tests
  });

  it("calls handleLogin on form submission", () => {
    render(<LoginForm />);
    const form = screen.getByLabelText("login-form");
    fireEvent.submit(form);

    expect(mockLogin.handleLogin).toHaveBeenCalled();
  });

  it("disables sign in button when form is invalid", () => {
    mockLogin.isFormValid = false;
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: /auth.sign_in/i });
    expect(submitButton).toBeDisabled();
    mockLogin.isFormValid = true; // Reset
  });

  it("calls handleGoogleLogin when Google button is clicked", () => {
    render(<LoginForm />);
    const googleButton = screen
      .getByText("auth.continue_with_google")
      .closest("button");
    if (googleButton) fireEvent.click(googleButton);
    expect(mockLogin.handleGoogleLogin).toHaveBeenCalled();
  });
});
