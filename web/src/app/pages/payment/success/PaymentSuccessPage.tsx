import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });

  useEffect(() => {
    try {
      if (window.Paddle?.Checkout) {
        window.Paddle.Checkout.close();
      }
    } catch (e) {}

    navigate({
      to: "/manager/subscription",
      search: searchParams as any,
      replace: true,
    });
  }, [navigate, searchParams]);

  return null;
}

export default PaymentSuccessPage;
