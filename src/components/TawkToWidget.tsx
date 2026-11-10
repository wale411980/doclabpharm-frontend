import { useEffect } from "react";

const TawkToWidget = () => {
  useEffect(() => {
    // The setting holds the full Tawk.to embed URL; skip the widget when unset.
    const src = process.env.NEXT_PUBLIC_TAWK_TO_PROPERTY_ID;
    if (!src || document.getElementById("tawk-script")) return;

    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = src;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, []);

  return null;
};

export default TawkToWidget;
