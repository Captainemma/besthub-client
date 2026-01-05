import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaystackReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const reference = params.get("reference");

  useEffect(() => {
    if (reference) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ reference, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [reference, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Paystack Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaystackReturnPage;
