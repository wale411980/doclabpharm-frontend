import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <Navbar currentPage="home" onNavigate={() => navigate("/")} />

      <div className="container mx-auto px-4 py-40">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <FileText className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These terms govern your use of DocLabPharm's healthcare services.
            Please read them carefully to understand your rights and
            responsibilities.
          </p>
        </div>

        {/* Key Points */}
        <Card className="mb-8 border-green-200 py-4">
          <CardContent>
            <div className="gap-6">
              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Services Provided
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    DoclabPharm is an Application (software) that enables users
                    connect with licensed doctors, laboratories, pharmacies, and
                    other medical healthcare practitioners and institutions
                    either virtually or in-person. The Application allows users
                    book consultations, facilitate medical tests, and purchase
                    medical products from pharmacies. The Application also
                    allows for consultations with medical health practitioners
                    which may be conducted via chat, audio, video, or in person,
                    depending on availability.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    The Application allows you to request and schedule lab tests
                    with third-party medical health institutions such as medical
                    laboratories. The Application may facilitate the purchase
                    and delivery of medications and health products from
                    licensed pharmacies.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    <span className="font-bold">NOTE:</span> DoclabPharm is not
                    an emergency medical application and does not replace
                    emergency medical services. Therefore, if you are
                    experiencing a medical emergency, call your local emergency
                    number immediately or reach out to any health care
                    establishment closest to you.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Payments and Fees
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    Fees for consultations, lab tests, and pharmaceutical
                    product purchases from pharmacies are as displayed in the
                    Application according to the specification of the medical
                    health practitioners, institutions and pharmacies involved.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    All payments are subject to applicable taxes and third-party
                    payment processor terms. Pricing may change at any time
                    where there is any adjustment made by the medical health
                    practitioners, institutions and pharmacies. Failed or
                    reversed payments may result in suspension of services from
                    the medical health practitioners, institutions and
                    pharmacies.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Cancellations and Refund
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    Cancellation and refund policies vary according to the
                    medical health practitioners, institutions or pharmacies
                    involved and service type. Consultation fees shall be
                    non-refundable once a session has started. Lab test and
                    pharmacy orders may not be refundable once processing has
                    begun.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    DISCLAIMER/LIMITATION OF LIABILITY
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    Doclabpharm does not claim to be run by medical health
                    practitioners as Doclabpharm is only a software that makes
                    it easy for its users to connect with people and
                    institutions who are themselves licensed medical health
                    practitioners and institutions.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    Pursuant to the above, your usage of Doclabpharm does not
                    create a patient and medical health practitioner/institution
                    relationship. Such relationship shall only exist between you
                    and any medical health practitioner or institution you opt
                    to consult using our Application. Therefore, users of
                    Doclabpharm are advised to exercise their personal judgment
                    on which medical health practitioner or institution to
                    consult using our Application as Doclabpharm shall not bear
                    any liability for acts or conducts of medical health
                    practitioners or institutions listed on the Application.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    Provided that a user shall have the right to seek redress
                    directly against any medical health practitioner or
                    institution for unprofessional acts and conducts that
                    violates the users rights in law.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Use for Lawful Purpose
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    As a user of Doclabpharm, you undertake to use the
                    Application only for lawful purpose and as such you must not
                    misuse this Application for any fraudulent, illegal or
                    unlawful activity or any activity prohibited under the laws
                    of the Federal Republic of Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Confidentiality of Passwords, Codes and Log-in Details
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    You shall treat as confidential your account information and
                    log-in details and as such you shall not disclose, share or
                    otherwise make known to any party or person or even our
                    staff any secrete code or password utilized by you to access
                    your account and or carry out transactions. Doclabpharm
                    shall not be liable for any loss suffered which results from
                    your sharing of log-in details, any secrete code or password
                    to your Doclabpharm account with any party.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Eligibility to Use Doclabpharm
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    Doclabpharm is not intended for users who are persons below
                    the age of 18 (eighteen) years and persons under legal
                    disability. Provided that a parent, guardian or person
                    having the care and custody of a child may use this
                    Application for the purpose of reaching out to a health
                    practitioner or institution for the benefit of the child.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    Provided also that where any user uses this Application as a
                    parent, guardian or person having the care and custody of a
                    child for the benefit of any child, such a user shall be
                    responsible if any misrepresentation of the nature of the
                    relationship existing between such user and the child and
                    any misrepresentation of the intent of the use of this
                    Application in relation to the child.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Accuracy of Information Supplied
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    By accepting our legal terms, conditions and privacy policy,
                    you guarantee that every information provided by you are
                    your genuine and accurate information, and that your
                    identity is genuine and you have not committed any identity
                    theft by the information supplied to us, and you undertake
                    to be held liable where by virtue of any misleading
                    information provided by you, loss is occasioned to
                    Doclabpharm.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Termination
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    We reserve the right to suspend or terminate access to the
                    Application if as a user you violate these legal terms and
                    conditions contained herein.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Intellectual Property
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    All content, design, and data within the Application are the
                    property of Walexbiz Nigeria Limited. Unauthorized
                    reproduction, distribution, or modification is prohibited.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Governing Law
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    These legal terms and conditions shall be governed by and
                    construed under the laws of the Federal Republic of Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Governing Law
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    These legal terms and conditions shall be governed by and
                    construed under the laws of the Federal Republic of Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Definitions
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    In this terms and conditions the following words and
                    expression bears the meanings ascribed to them below:
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    <span className="font-semibold">"User"/"You"</span> means
                    any person who subscribe to use the Doclabpharm Application.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    <span className="font-semibold">"Patient"</span> means a
                    user who books consultations, facilitates tests, or
                    purchases medical products using Doclabpharm.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    <span className="font-semibold">
                      "Medical Health Practitioner"
                    </span>{" "}
                    means licensed doctors, and other licensed health workers
                    within the meaning of the Medical and Dental Practitioners
                    Act Cap M8 Laws of the Federation of Nigeria (LFN) 2004 and
                    the National Health Act 2014.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    <span className="font-semibold">
                      "Medical Health Institutions"
                    </span>{" "}
                    means health care establishment under the National Health
                    Act 2014 and it includes the whole or part of a public or
                    private institution, facility, building or place, whether
                    for profit or not, that is operated or designed to provide
                    inpatient or outpatient diagnostic or therapeutic
                    interventions nursing, rehabilitative, palliative,
                    convalescent, preventive or other health services.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    <span className="font-semibold">“Pharmacy”</span> means a
                    place approved and registered by the Pharmacy Council of
                    Nigeria (PCN) for any of the following purposes of
                    dispensing, selling, distributing, storage, stocking,
                    retailing, wholesale manufacturing, importation, exportation
                    of drugs or any other form of pharmaceutical activities
                    approved by the PCN under the Pharmacy Council of Nigeria
                    (Establishment Act) 2022.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    <span className="font-semibold">"Consultation"</span> means
                    any virtual or in-person medical interaction facilitated via
                    the Doclabpharm Application.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
