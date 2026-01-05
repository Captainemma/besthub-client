import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { capturePayment } from "@/store/shop/order-slice"; // adjust if needed

function PaystackCallbackPage() {
  const location = useLocation();
  const dispatch = useDispatch();

  // Extract query params from Paystack redirect
  const params = new URLSearchParams(location.search);
  const reference = params.get("reference");

  useEffect(() => {
    if (reference) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      // Call backend to verify transaction with Paystack
      dispatch(capturePayment({ reference, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        } else {
          window.location.href = "/shop/payment-failed";
        }
      });
    }
  }, [reference, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold">Processing your Paystack payment...</h2>
    </div>
  );
}

export default PaystackCallbackPage;
