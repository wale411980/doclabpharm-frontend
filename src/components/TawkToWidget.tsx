import { useEffect } from "react";

const TawkToWidget = () => {
  useEffect(() => {
    if (document.getElementById("tawk-script")) return;

    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = import.meta.env.VITE_TAWK_TO_PROPERTY_ID;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, []);

  return null;
};

export default TawkToWidget;
