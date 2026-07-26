import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Briefcase, Clock, Heart, Shield, Store } from "lucide-react";
import ConsultationImg from "@/assets/consultation.png";
import { useGetConsultations, useGetDoctorById } from "@/queries";
import type { Consultations } from "@/types";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function Consultation() {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const slotId = Number(searchParams.get("slot_id"));
  const complaint = searchParams.get("complaint") || "";

  const navigate = useNavigate();

  const { data: consult, isLoading, error } = useGetConsultations();
  const { data: doctorData, isLoading: loadingDoctor } = useGetDoctorById(
    doctorId ?? ""
  );

  if (loadingDoctor)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading consultations...
      </div>
    );
  if (error) return <p>Failed to load consultations.</p>;

  if (!consult || consult.length === 0) {
    return <p>No consultations found.</p>;
  }

  return (
    <div className="px-4 py-8">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">
            Affordable consultations,
            <br />
            no insurance hassles
          </h1>
          <p className="text-emerald-600 max-w-md">
            We believe in making healthcare easier, so you can focus on taking
            care of yourself without any added stress.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src={ConsultationImg}
            alt="Doctor consulting with patient"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Virtual or Physical Section */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-4">
          Virtual or Physical
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enjoy convenient medical consultations and doorstep medication
          delivery
        </p>
      </div>

      {/* Consultation Cards */}

      {consult?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-20">
          {consult?.map((consults: Consultations) => (
            <div key={consults.id}>
              <Card className="bg-emerald-50 border-0 h-full flex flex-col py-4">
                <CardHeader className="flex items-center justify-center pt-8">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-emerald-700" />
                  </div>
                </CardHeader>
                <CardContent className="text-center flex-1">
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">
                    {consults.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{consults.details}</p>
                  <div className="mb-4">
                    <p className="text-xl font-bold text-emerald-800">
                      ₦ {Number(consults.price).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">per consultation</p>
                  </div>
                  <div
                    className="text-sm text-left space-y-1 mb-6"
                    dangerouslySetInnerHTML={{
                      __html: consults.includeDetails.replace(
                        "<ul>",
                        '<ul class="list-disc list-inside text-emerald-700">'
                      ),
                    }}
                  ></div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full px-8"
                    onClick={() => {
                      navigate(
                        `/user/confirm?type=consult&complaint=${complaint}&consultation_type=Physical&price=${
                          consults.price
                        }&name=${consults.name}&doctor=${encodeURIComponent(
                          JSON.stringify(doctorData)
                        )}&slot_id=${slotId}&service_id=${consults.id}`
                      );
                    }}
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No consultations available</p>
      )}

      {/* Why Book Section */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 text-center mb-12">
          Why You Should Book A Consultation?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Convenience */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 border-2 border-emerald-700 rounded-full flex items-center justify-center mb-4 relative">
              <Store className="h-10 w-10 text-emerald-700" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-emerald-700">
              Convenience
            </h3>
          </div>

          {/* Reduced Wait Times */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 border-2 border-emerald-700 rounded-full flex items-center justify-center mb-4 relative">
              <Clock className="h-10 w-10 text-emerald-700" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-emerald-700">
              Reduced Wait Times
            </h3>
          </div>

          {/* Continuity of Care */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 border-2 border-emerald-700 rounded-full flex items-center justify-center mb-4 relative">
              <Heart className="h-10 w-10 text-emerald-700" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-emerald-700">
              Continuity of Care
            </h3>
          </div>

          {/* Privacy */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 border-2 border-emerald-700 rounded-full flex items-center justify-center mb-4 relative">
              <Shield className="h-10 w-10 text-emerald-700" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-emerald-700">Privacy</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
