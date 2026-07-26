import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Payment Successful
      </h2>
      <p className="text-gray-600 mb-6">
        Your services have been booked successfully.
      </p>
      <Button
        className="bg-green-600 text-white"
        onClick={() => navigate("/user/dashboard")}
      >
        Go Dashboard
      </Button>
    </div>
  );
};

export default CheckoutSuccess;
