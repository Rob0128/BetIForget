  import React from "react";

  const Footer: React.FC = () => {
    return (
<footer className="w-full bg-gray-100 text-black border-t border-gray-200 py-6 flex flex-col items-center">
  <p className="text-sm text-center">
    &copy; {new Date().getFullYear()} Forgettory. All rights reserved.
  </p>

  {/* Link container - horizontal layout */}
  <div className="mt-4 flex flex-row gap-4">
    <a
      href="/privacy"
      className="bg-orange-500 text-white px-4 py-2 rounded text-center"
    >
      Privacy Policy
    </a>
    <a
      href="/terms"
      className="bg-orange-500 text-white px-4 py-2 rounded text-center"
    >
      Terms of Service
    </a>
  </div>
</footer>

    );
  };

  export default Footer;
