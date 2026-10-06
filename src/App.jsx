/* eslint-disable no-unused-vars */
import "./App.css";
import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import BackToTop from "./components/common/BackToTop";
import Loading from "./components/common/Loading";
import Chatbot from "./pages/Chatbot";
import { ACCOUNT_TYPE } from "./utils/constants";

// Lazy-loaded pages for Route-Based Code Splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Rateus = lazy(() => import("./pages/Rateus"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Catalog = lazy(() => import("./pages/Catalog"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyProfile = lazy(() => import("./components/core/Dashboard/MyProfile"));
const Settings = lazy(() => import("./components/core/Dashboard/Settings"));
const EnrolledCourses = lazy(() => import("./components/core/Dashboard/EnrolledCourses"));
const Cart = lazy(() => import("./components/core/Dashboard/Cart"));
const AddCourse = lazy(() => import("./components/core/Dashboard/AddCourse"));
const MyCourses = lazy(() => import("./components/core/Dashboard/MyCourses"));
const EditCourse = lazy(() => import("./components/core/Dashboard/EditCourse"));
const Instructor = lazy(() => import("./components/core/Dashboard/InstructorDashboard/Instructor"));
const ViewCourse = lazy(() => import("./pages/ViewCourse"));
const VideoDetails = lazy(() => import("./components/core/ViewCourse/VideoDetails"));
const PrivacyPolicy = lazy(() => import("./pages/privacypolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const Project = lazy(() => import("./pages/Project"));
const Error = lazy(() => import("./pages/Error"));

function App() {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="flex-1 w-screen bg-richblack-900 flex flex-col font-inter min-h-screen">
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="catalog/:catalogName" element={<Catalog />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route
            path="signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />
          <Route
            path="login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />
          <Route
            path="forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />
          <Route
            path="verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />
          <Route
            path="update-password/:id"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project" element={<Project />} />
          <Route path="/rateus" element={<Rateus />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/settings" element={<Settings />} />
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route
                  path="dashboard/enrolled-courses"
                  element={<EnrolledCourses />}
                />
              </>
            )}
            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route
                  path="dashboard/edit-course/:courseId"
                  element={<EditCourse />}
                />
              </>
            )}
          </Route>
          <Route
            element={
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                  path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                  element={<VideoDetails />}
                />
              </>
            )}
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
      <BackToTop />
      <Chatbot />
    </div>
  );
}

export default App;
