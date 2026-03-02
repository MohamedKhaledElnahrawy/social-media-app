import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import SinglePostsPage from "./pages/SinglePostsPage";
import AuthLayout from "./layouts/AuthLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import { HeroUIProvider } from "@heroui/react";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AuthProtectedRoute from "./components/AuthProtectedRoute/AuthProtectedRoute";
import SettingPage from "./pages/SettingPage";
import { Toaster } from "react-hot-toast";
import FollowersPage from "./pages/FollowersPage";
import UserProfile from "./pages/UserProfile";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "profilepage",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile/:userId",
          element: (
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "settingpage",
          element: (
            <ProtectedRoute>
              <SettingPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "followers",
          element: (
            <ProtectedRoute>
              <FollowersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "single-post/:id",
          element: (
            <ProtectedRoute>
              <SinglePostsPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "",
      element: <AuthLayout />,
      children: [
        {
          path: "register",
          element: (
            <AuthProtectedRoute>
              <RegisterPage />
            </AuthProtectedRoute>
          ),
        },
        {
          path: "login",
          element: (
            <AuthProtectedRoute>
              <LoginPage />
            </AuthProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <HeroUIProvider>
        <RouterProvider router={router} />
      </HeroUIProvider>
    </>
  );
}
