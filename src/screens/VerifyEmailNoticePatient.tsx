import { Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function VerifyEmailNoticePatient() {
  const navigate = useNavigate();
  const { user } = useAuth(); // <-- Get user safely from context

  const handleVerifyClick = () => {
    if (!user?.email) {
      console.error("User or email is undefined");
      return;
    }

    navigate("/user/enter-otp", { state: { email: user.email } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Main Card */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-10">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Please verify your email to access the dashboard.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Button
                onClick={handleVerifyClick}
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Verify Email
              </Button>
            </div>

            {/* Warning Alert */}
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                You won't be able to access all features until your email is
                verified.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
