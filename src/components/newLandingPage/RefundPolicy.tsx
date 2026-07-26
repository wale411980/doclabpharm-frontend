import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RefreshCw,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const RefundPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <Navbar currentPage="home" onNavigate={() => navigate("/")} />

      <div className="container mx-auto px-4 py-40">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <RefreshCw className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand that healthcare needs can change. Our refund policy is
            designed to be fair and transparent while ensuring continuity of
            care.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 1, 2024
          </p>
        </div>

        {/* Quick Reference */}
        <Card className="mb-8 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Clock className="w-6 h-6 mr-2" />
              Refund Timeline Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800">24 Hours</h3>
                <p className="text-sm text-gray-600">
                  Full refund for consultation cancellations
                </p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-semibold text-yellow-800">24-48 Hours</h3>
                <p className="text-sm text-gray-600">
                  50% refund with cancellation fee
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-red-800">
                  Less than 24 Hours
                </h3>
                <p className="text-sm text-gray-600">
                  No refund for late cancellations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <a
                    href="#general-policy"
                    className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    General Policy
                  </a>
                  <a
                    href="#consultation-refunds"
                    className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Consultation Refunds
                  </a>
                  <a
                    href="#prescription-refunds"
                    className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Prescription Refunds
                  </a>
                  <a
                    href="#lab-test-refunds"
                    className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Lab Test Refunds
                  </a>
                  <a
                    href="#subscription-refunds"
                    className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Subscription Refunds
                  </a>
                  <a
                    href="#refund-process"
                    className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Refund Process
                  </a>
                  <a
                    href="#exceptions"
                    className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Exceptions
                  </a>
                  <a
                    href="#contact"
                    className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Contact Us
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Policy Content */}
          <div className="lg:col-span-3 space-y-8">
            <section id="general-policy">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    1. General Refund Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-semibold mb-2">
                      Our Commitment
                    </p>
                    <p className="text-gray-700">
                      We are committed to providing exceptional healthcare
                      services. If you are not satisfied with our services, we
                      will work with you to address your concerns and provide
                      appropriate refunds when applicable.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Key Principles
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Refunds are processed within 5-10 business days</li>
                      <li>Refunds are issued to the original payment method</li>
                      <li>All refund requests must be submitted in writing</li>
                      <li>
                        Medical necessity and safety considerations may affect
                        refund eligibility
                      </li>
                      <li>
                        Insurance-covered services follow insurance provider
                        guidelines
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="consultation-refunds">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    2. Consultation Refunds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Telemedicine Consultations
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            More than 24 hours before appointment
                          </p>
                          <p className="text-gray-600">
                            100% refund, no cancellation fee
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            24-48 hours before appointment
                          </p>
                          <p className="text-gray-600">
                            50% refund, $25 cancellation fee applies
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Less than 24 hours before appointment
                          </p>
                          <p className="text-gray-600">No refund available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      In-Person Consultations
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>48+ hours notice: Full refund</li>
                      <li>24-48 hours notice: 75% refund</li>
                      <li>Less than 24 hours: No refund</li>
                      <li>Emergency situations considered case-by-case</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Follow-up Appointments
                    </h4>
                    <p className="text-gray-600">
                      Follow-up appointments included in treatment packages
                      cannot be refunded individually. Refunds apply to the
                      entire treatment package based on services not yet
                      received.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="prescription-refunds">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    3. Prescription and Medication Refunds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-600 mb-2" />
                    <p className="text-yellow-800 font-semibold">
                      Important Notice
                    </p>
                    <p className="text-gray-700">
                      Due to safety regulations, most prescription medications
                      cannot be returned or refunded once dispensed. However, we
                      offer several options for medication-related concerns.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Refundable Situations
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Pharmacy error in medication dispensing</li>
                      <li>Damaged or defective medication upon receipt</li>
                      <li>Prescription cancelled before dispensing</li>
                      <li>Insurance coverage changes affecting cost</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Non-Refundable Situations
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Patient decides not to take prescribed medication</li>
                      <li>
                        Side effects or adverse reactions (consult your doctor)
                      </li>
                      <li>Medication effectiveness concerns</li>
                      <li>Change in treatment plan after dispensing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Alternative Solutions
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        Medication adjustment consultation at no additional cost
                      </li>
                      <li>Generic alternatives when available</li>
                      <li>Patient assistance program referrals</li>
                      <li>Insurance appeal support</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="lab-test-refunds">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    4. Laboratory Test Refunds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Before Sample Collection
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>24+ hours notice: Full refund</li>
                      <li>12-24 hours notice: 50% refund</li>
                      <li>Less than 12 hours: No refund</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      After Sample Collection
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        Laboratory processing errors: Full refund and retest
                      </li>
                      <li>
                        Contaminated or insufficient samples: Retest at no
                        charge
                      </li>
                      <li>
                        Patient-requested cancellation: No refund available
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Home Test Kits
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Unopened kits: Full refund within 30 days</li>
                      <li>Defective kits: Replacement or full refund</li>
                      <li>Used kits: No refund available</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="subscription-refunds">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    5. Subscription and Membership Refunds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Monthly Subscriptions
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Cancel anytime before next billing cycle</li>
                      <li>No refund for current month's services</li>
                      <li>Access continues until end of billing period</li>
                      <li>Unused consultations do not carry over</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Annual Subscriptions
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>30-day money-back guarantee for new subscribers</li>
                      <li>
                        Pro-rated refund for unused months (after 30 days)
                      </li>
                      <li>$50 processing fee for annual plan cancellations</li>
                      <li>Used services deducted at monthly rates</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Premium Memberships
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>14-day trial period with full refund option</li>
                      <li>Partial refunds based on unused benefits</li>
                      <li>Special circumstances considered individually</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="refund-process">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    6. How to Request a Refund
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Step 1: Submit Request
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        Email:{" "}
                        <a
                          href="mailto:refunds@doclabpharm.com"
                          className="text-green-600 underline"
                        >
                          refunds@doclabpharm.com
                        </a>
                      </li>
                      <li>Phone: +1 (555) 123-4567</li>
                      <li>Online: Patient portal refund request form</li>
                      <li>
                        Mail: DocLabPharm Billing Department, 123 Health St,
                        Medical City, MC 12345
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Step 2: Required Information
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Patient name and date of birth</li>
                      <li>Service date and appointment/order number</li>
                      <li>Reason for refund request</li>
                      <li>Preferred refund method</li>
                      <li>Supporting documentation (if applicable)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Step 3: Review Process
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Initial review within 2 business days</li>
                      <li>Additional information may be requested</li>
                      <li>Final decision within 5 business days</li>
                      <li>Refund processing takes 5-10 business days</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800">
                      <strong>Tip:</strong> Include as much detail as possible
                      in your refund request to expedite the review process.
                      Screenshots, receipts, and specific dates help us process
                      your request more quickly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="exceptions">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    7. Special Circumstances and Exceptions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Medical Emergencies
                    </h4>
                    <p className="text-gray-600 mb-2">
                      We understand that medical emergencies can disrupt planned
                      appointments. In cases of:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Hospitalization or emergency room visits</li>
                      <li>Sudden illness preventing appointment attendance</li>
                      <li>Family medical emergencies</li>
                    </ul>
                    <p className="text-gray-600 mt-2">
                      We will review refund requests on a case-by-case basis
                      with appropriate documentation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Technical Issues
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Platform outages during scheduled appointments</li>
                      <li>Connectivity issues preventing service delivery</li>
                      <li>System errors affecting billing or scheduling</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Provider Cancellations
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Full refund for provider-initiated cancellations</li>
                      <li>Priority rescheduling at no additional cost</li>
                      <li>Compensation for any inconvenience caused</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Insurance Changes
                    </h4>
                    <p className="text-gray-600">
                      If your insurance coverage changes and affects your
                      ability to receive services, we will work with you to find
                      alternative payment solutions or provide appropriate
                      refunds.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="contact">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    8. Contact Our Billing Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Refund Department
                    </h4>
                    <div className="text-gray-600 space-y-1">
                      <p>DocLabPharm Billing Department</p>
                      <p>123 Health Street, Medical City, MC 12345</p>
                      <p>
                        Email:{" "}
                        <a
                          href="mailto:refunds@doclabpharm.com"
                          className="text-green-600 underline"
                        >
                          refunds@doclabpharm.com
                        </a>
                      </p>
                      <p>Phone: +1 (555) 123-4567</p>
                      <p>Hours: Monday-Friday, 8:00 AM - 6:00 PM EST</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Patient Advocate
                    </h4>
                    <p className="text-gray-600">
                      If you need additional assistance with billing or refund
                      concerns, our Patient Advocate is available to help
                      resolve complex situations.
                    </p>
                    <p className="text-gray-600">
                      Email:{" "}
                      <a
                        href="mailto:advocate@doclabpharm.com"
                        className="text-green-600 underline"
                      >
                        advocate@doclabpharm.com
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Need Help with a Refund?
              </h3>
              <p className="text-gray-600 mb-6">
                Our billing team is here to assist you with any refund questions
                or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-green-600 hover:bg-green-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Request Refund
                </Button>
                <Link to="/">
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    Return to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
