import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "@/components/authUser/Login";
import { RegisterModal } from "@/components/authUser/Register";
import { Login as ProviderLogin } from "@/components/authDoctor/Login";
import ProviderRegister from "@/components/authDoctor/Register";

/**
 * Sign-in and sign-up as real pages with their own URLs, so the website,
 * emails and search results can link straight to them. They reuse the
 * existing forms (and their booking-aware redirects), shown over a plain
 * branded background instead of over the old landing page.
 */

/** Leave the dashboards app for a page of the main website. */
export function goToSite(path = "/") {
  window.location.assign(path);
}

/**
 * The forms call onClose both when dismissed and after signing in (when they
 * have already navigated to the dashboard). Only a dismissal leaves the app.
 */
function closeTo(path: string) {
  return () => {
    if (!localStorage.getItem("token")) goToSite(path);
  };
}

function AuthBackdrop({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} | DocLabPharm`;
  }, [title]);

  return (
    <div className="min-h-screen bg-brand-50" aria-hidden="true">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <a href="/" className="text-2xl font-extrabold text-brand-700">
          DocLabPharm
        </a>
      </div>
    </div>
  );
}

export function PatientLoginPage() {
  const navigate = useNavigate();
  return (
    <>
      <AuthBackdrop title="Log in" />
      <LoginModal isOpen onClose={closeTo("/")} onOpenRegister={() => navigate("/register")} />
    </>
  );
}

export function PatientRegisterPage() {
  const navigate = useNavigate();
  return (
    <>
      <AuthBackdrop title="Create your account" />
      <RegisterModal isOpen onClose={closeTo("/")} onOpenLogin={() => navigate("/login")} />
    </>
  );
}

export function ProviderLoginPage() {
  const navigate = useNavigate();
  return (
    <>
      <AuthBackdrop title="Partner log in" />
      <ProviderLogin
        isOpen
        onClose={closeTo("/partners")}
        onOpenRegister={() => navigate("/partners/register")}
      />
    </>
  );
}

export function ProviderRegisterPage() {
  const navigate = useNavigate();
  return (
    <>
      <AuthBackdrop title="Register your practice" />
      <ProviderRegister
        isOpen
        onClose={closeTo("/partners")}
        onOpenLogin={() => navigate("/partners/login")}
      />
    </>
  );
}

/** Routes the website now serves itself: leave the app and load them. */
export function SiteRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}
