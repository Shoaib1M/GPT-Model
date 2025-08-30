import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Chatbox from "./components/Chatbox";
import Community from "./pages/community";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import Loading from "./pages/loading";
import Login from "./pages/login";
import { useAppContext } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, LoadingUser } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { pathname } = useLocation();
  if (pathname === "/loading" || LoadingUser) return <Loading />;

  return (
    <>
      <Toaster />
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}
      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<Chatbox />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;
