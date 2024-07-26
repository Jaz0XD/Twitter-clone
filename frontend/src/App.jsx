//* Importing dependencies
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

//* Importing Pages
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import ExplorePage from "./pages/explore/ExplorePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { data: authUser, isLoading } = useQuery({
    //* we use queryKey to give a unique name to the query and refer to it later
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser is here: ", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {/* Sidebar Component is common component as it is not wrapped in any folder with Routes */}
      {authUser && <Sidebar />}
      {/*If user is authenticated, then show the sidebar i.e In Home page and not in Login / Signup pages */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/explore"
          element={authUser ? <ExplorePage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      {authUser && <RightPanel />}
      {/*If user is authenticated, then show the sidebar i.e In Home page and not in Login / Signup pages */}
      <Toaster />
    </div>
  );
}

export default App;
