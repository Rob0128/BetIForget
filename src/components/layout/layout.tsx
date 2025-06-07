import React from "react";
import Footer from "../footer/footer";
import Header from "../header/header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white-900 text-white">
      <Header />
      <main className="flex-grow flex justify-center items-start">
        <div className="w-full mx-auto px-4 py-12">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;