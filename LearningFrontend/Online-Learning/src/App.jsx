import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import LecturePlayer from "./pages/LecturePlayer";
import Profile from "./pages/Profile";
import Certificates from "./pages/Certificates";
import AdminPanel from "./pages/AdminPanel";
import Instructor from "./pages/Instructor";
import Footer from "./components/Footer";
import VerifyCertificate from "./pages/VerifyCertificate";
import QuizPage from "./pages/QuizPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify' element={<VerifyCertificate />} />
        <Route path='/' element={<Home />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/course/:id' element={<CourseDetail />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/my-courses' element={<MyCourses />} />
        <Route path='/lecture/:id' element={<LecturePlayer />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/certificates' element={<Certificates />} />
        <Route path='/admin' element={<AdminPanel />} />
        <Route path='/instructor' element={<Instructor />} />
        <Route path='/quiz/:courseId' element={<QuizPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
