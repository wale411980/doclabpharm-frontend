import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <Navbar currentPage="home" onNavigate={() => navigate("/")} />

      <div className="container mx-auto px-4 py-40">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Shield className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy and the security of your health information is our top
            priority. Learn how we collect, use, and protect your personal data.
          </p>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8 border-green-200 py-4">
          <CardContent>
            <div className="gap-6">
              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Personal Data for the Purpose of this Privacy Policy
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    For the purpose of this privacy policy, reference to your
                    personal data is reference to your personal information we
                    collect from you including: name, email, age, gender,
                    nationality and account details when you register, it also
                    includes device information, Internet Protocol (IP) address,
                    and your activity logs on our Application.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Automated Decision Making
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    Our services involves the utilization of software programs
                    and a combination of varieties of interconnected computer
                    systems for automated decision making, including profiling.
                    The significant and envisaged consequences of such use of
                    automated decision making process is that the system will
                    from time to time be subjected to maintenance, like all
                    other electronic service systems.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    However, we have put in place the necessary network of
                    computers and firewalls to ensure that during any such
                    period of system maintenance and at all time, the processing
                    of your personal data is conducted in a manner that your
                    privacy, fundamental rights and freedom are protected.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Lawful Purpose for Processing Personal Data
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    We will collect and process your personal data for any or
                    all of the following lawful purposes:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>
                      To enable us take steps to identify you prior to your
                      contracting with us by subscribing to our services and to
                      enable us render our services of facilitating your easy
                      medical consultation, laboratory tests, purchase of
                      pharmaceutical products.
                    </li>
                    <li>
                      For direct marketing, to improve Application performance
                      and user experience, to communicate updates,
                      notifications, or service changes.
                    </li>
                    <li>
                      For the establishment, exercise or defense of a legal
                      claim, obtaining legal advice or in the conduct of legal
                      proceedings.
                    </li>
                    <li>
                      For reason of substantial public interest on the basis of
                      any law in force in Nigeria which shall be such that
                      provides for suitable and specific measures to safeguard
                      your fundamental rights, freedoms and interest; to enable
                      us to effectively carry out our obligation in a way that
                      will ensure the protection of your vital transaction and
                      interest.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Duration of Storage of Personal Data
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    We will process and store your personal data during the
                    period of your subscription to our services, and after that
                    period, your personal data shall be stored only for such
                    period as may be required of us by virtue of a written law
                    or any subsidiary legislation made pursuant to a written
                    law.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Sharing of Personal Data
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    For the purpose of effectively rendering our services
                    through Doclabpharm, we will be sharing your personal data
                    with third-party medical health practitioners, institutions
                    and pharmacies whom we have carefully selected and who have
                    good reputation on issues of data privacy. These third-party
                    medical health practitioners, institutions and pharmacies
                    shall receive and process your personal data for the purpose
                    of facilitating the services you may require from
                    Doclabpharm.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    We shall also, where necessary, process and share your
                    personal data with government agencies in accordance with
                    any written law in force in Nigeria requiring us to comply
                    with a demand for your personal data by such agency for
                    substantial public interest. However, we shall ensure that
                    all such processing and sharing of data shall only be
                    allowed to the extent that it is proportionate to the aim
                    pursued, and no personal data processing and sharing shall
                    be carried out in breach of your fundamental rights,
                    privacy, freedom and interest.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Cross-Border Transfer of Personal Data
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    We will, for the purpose of performing our contract with
                    you, share your personal data with third party data
                    processors in the health sectors outside Nigeria as may be
                    necessary resulting from your query.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Your Privacy Rights as a User of Doclabpharm:
                  </h3>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Right to Obtain Confirmation
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    You shall have the right, without constraint or unreasonable
                    delay, to obtain from us confirmation as to whether we or
                    any of our third-party data processors with which we share
                    your personal data for purpose of facilitating the rendering
                    of our services to you are storing or processing personal
                    data relating to you, and to know the purpose of such
                    processing, the categories of your personal data concerned,
                    the recipients or any categories of recipient to whom your
                    personal data have been or will be disclosed, including,
                    recipients in foreign countries or international
                    organizations.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    You shall have the right, without constraint or unreasonable
                    delay, to obtain from us a confirmation, where possible, of
                    the duration period for which your personal data will be
                    stored, and where that period cannot be reasonably
                    ascertained, you shall have the right to obtain from us a
                    confirmation of the criteria for determining the duration
                    period for which your personal data will be stored.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Right of Rectification, Correction, Erasure, Deletion or
                    Objection
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    You have the right, without constraint or unreasonable
                    delay, to request from us any rectification or erasure of
                    your personal data, or a restriction on our processing of
                    your personal data or object to our processing of your
                    personal data for direct marketing or any other purpose or
                    in general.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    You shall also have the right to request for the correction
                    of your personal data which is inaccurate, outdated,
                    incomplete or misleading, and where such correction is not
                    feasible or suitable to the circumstance, you shall have the
                    right to request for the deletion of your personal data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Right to Information on Source of Personal Data
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    You shall have the right, without constraint or unreasonable
                    delay, to obtain from us any available information as to the
                    source of your personal data we collect and process.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Right to Lodge Complaint with the Commission
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    You shall have the right to lodge a complaint with the
                    Nigeria Data Protection Commission for investigation, where
                    you feel aggrieved by any decision made by us or any of our
                    action or inaction in relation to the collection and
                    processing of your personal data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Right to Obtain Information on Existence of Automated
                    Decision Making
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    You shall have the right, without constraint or unreasonable
                    delay, to obtain from us confirmation as to the existence of
                    automated decision making process regarding your personal
                    data we collect and process, including profiling, and the
                    significance and envisaged consequences of such automated
                    decision making process to you.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Right to Copy of Personal Data
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    You shall have the right, without constraint or unreasonable
                    delay, to obtain from us a copy of your personal data in
                    either a Portable Document Format (PDF), Text file (TXT),
                    Open Document Text (ODT), Word document (Doc) or any other
                    commonly used electronic format we may prescribe which shall
                    be legible.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    However, where providing you with such copy of your personal
                    data would impose unreasonable cost on us, we would require
                    you to bear some or all of the cost for the making available
                    to you a copy of your personal data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Erasure of Personal Data
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    Note that we shall erase your personal data without undue
                    delay where it is no longer necessary to process or store
                    same in relation to the lawful purpose for which it was
                    collected and processed, or where there is no lawful basis
                    on which we are to continue to retain your personal data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Right not to be Subject Solely to Automated Decision Making
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    Despite our use of automated decision making machinery, you
                    have a right not to be subject to a decision based solely on
                    automated processing of your personal data, including
                    profiling, which produces legal or similar significant
                    effect concerning you.
                  </p>
                  <p className="text-gray-600 text-justify mb-2">
                    However, your right not to be subject solely to automated
                    decision making will not apply to where the decision is
                    necessary for entering into a contract with us and where it
                    relates entirely to the performance of our duty under
                    contract with you. It shall also not apply where you have
                    given your consent or the automated decision making is
                    authorized by a written law which establishes suitable
                    measures to safeguard your fundamental rights, freedoms and
                    interests.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Right To Human Intervention, Expression of View and to
                    Contest Automated Decision
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    Our automated decision making process will be implemented
                    alongside suitable measures to safeguard your fundamental
                    rights, freedoms and interests, accordingly, you shall have
                    the right to obtain from us human intervention upon your
                    request by reaching us through our contact information
                    provided below in our footer section, and also
                    to express your point of view on any service rendered by us
                    or any automated decision made by us. You shall also have
                    the right to contest any automated decision made by us by
                    sending your complain alongside the particulars and reasons
                    upon which you are contesting the decision and we shall have
                    human intervention to look into your complaint and revert
                    back to you without undue delay.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Review and Update of Privacy Policy
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    This privacy policy may be reviewed and updated from time to
                    time for the purpose of keeping it in tune with the Nigeria
                    Data Protection Act 2023 or any regulation made by the
                    Nigeria Data Protection Commission established pursuant the
                    the Act, and where there is any such review and update, we
                    shall notify you of any such review and give you the
                    opportunity to either give consent before we continue to
                    process your data in line with the reviewed and updated
                    privacy policy or to refuse and withdraw consent.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Data Security
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    We ensure your personal data are collected and processed in
                    a way that will guarantee your fundamental rights, privacy,
                    confidentiality, freedoms and interests by utilizing
                    encryption and other methods of de-identification of your
                    personal data and secure data storage system. We also carry
                    out periodic assessment of risks to processing systems, we
                    regularly test, assess and evaluate the effectiveness of the
                    measures we have implemented in the light of evolving risks
                    identified, and we carry out regular updating of the
                    measures and introduce new measures where necessary to
                    address perceived possible shortcomings in effectiveness to
                    safeguard against evolving risks.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Consent
                  </h3>
                  <p className="text-gray-600 text-justify mb-2">
                    By clicking “Accept” you have agreed to our
terms and conditions and privacy policy and you voluntarily give your consent to us for the processing of and sharing of
                    your personal data in the manner contained in our privacy
                    policy.
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

export default PrivacyPolicy;
