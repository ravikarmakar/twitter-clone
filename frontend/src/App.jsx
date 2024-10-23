import { Route, Routes } from "react-router-dom";

import LoginPage from "../src/pages/auth/login/LoginPage.jsx";
import SignUpPage from "../src/pages/auth/signup/SignUpPage.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import Profile from "../src/pages/profile/ProfilePage.jsx";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* this is common component , not wraped with Routes */}
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
      <RightPanel />
    </div>
  );
}

export default App;
