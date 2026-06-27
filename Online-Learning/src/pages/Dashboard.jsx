import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import enrollmentService from "../services/enrollmentService";
import courseService from "../services/courseService";
import certificateService from "../services/certificateService";
import { useUser } from "../context/UserContext";

export default function Dashboard() {
  const { user } = useUser();
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (user?.id) {
          const [enrollmentsData, certificatesData] = await Promise.all([
            enrollmentService.getEnrollmentsByUser(user.id),
            certificateService.getCertificatesByUser(user.id)
          ]);
          
          const enrollmentsArray = Array.isArray(enrollmentsData) ? enrollmentsData : [];
          setEnrollments(enrollmentsArray);
          setCertificates(Array.isArray(certificatesData) ? certificatesData : []);

          // Fetch course details for each enrollment
          const coursesWithDetails = await Promise.all(
            enrollmentsArray.map(async (enrollment) => {
              try {
                const course = await courseService.getCourseById(enrollment.courseId);
                return {
                  ...enrollment,
                  courseTitle: course?.title || `Course #${enrollment.courseId}`,
                  courseDetails: course
                };
              } catch (err) {
                return {
                  ...enrollment,
                  courseTitle: `Course #${enrollment.courseId}`,
                  courseDetails: null
                };
              }
            })
          );
          setEnrolledCourses(coursesWithDetails);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const completedCourses = enrollments.filter(e => e.progress === 100).length;
  const inProgressCourses = enrollments.filter(e => e.progress < 100).length;

  return (
    <div className='d-flex'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className='container-fluid p-4' style={{ marginLeft: "240px" }}>
        <h2 className='fw-bold mb-4'>📊 Student Dashboard</h2>

        {/* 🔹 STATS CARDS */}
        <div className='row g-3 mb-4'>
          <div className='col-md-3'>
            <div className='card shadow border-0 p-3 text-center'>
              <h6 className='text-muted'>Enrolled Courses</h6>
              <h2 className='fw-bold text-primary'>
                {loading ? "..." : enrollments.length}
              </h2>
            </div>
          </div>

          <div className='col-md-3'>
            <div className='card shadow border-0 p-3 text-center'>
              <h6 className='text-muted'>Completed Courses</h6>
              <h2 className='fw-bold text-success'>
                {loading ? "..." : completedCourses}
              </h2>
            </div>
          </div>

          <div className='col-md-3'>
            <div className='card shadow border-0 p-3 text-center'>
              <h6 className='text-muted'>Certificates Earned</h6>
              <h2 className='fw-bold text-warning'>
                {loading ? "..." : certificates.length}
              </h2>
            </div>
          </div>

          <div className='col-md-3'>
            <div className='card shadow border-0 p-3 text-center'>
              <h6 className='text-muted'>In Progress</h6>
              <h2 className='fw-bold text-info'>
                {loading ? "..." : inProgressCourses}
              </h2>
            </div>
          </div>
        </div>

        {/* 📈 LEARNING PROGRESS & RECENT COURSES */}
        <div className='row g-3'>
          {/* Progress Chart Section */}
          <div className='col-lg-8'>
            <div className='card shadow border-0 p-3'>
              <h5 className='fw-bold'>📈 Learning Progress</h5>
              
              {loading ? (
                <div className='alert alert-info'>Loading progress...</div>
              ) : enrolledCourses.length === 0 ? (
                <div className='alert alert-warning'>
                  No enrolled courses. Browse courses to get started!
                </div>
              ) : (
                <>
                  {enrolledCourses.slice(0, 5).map((enrollment, idx) => (
                    <div key={enrollment.id || idx} className='mb-2'>
                      <small className='text-muted'>{enrollment.courseTitle}</small>
                      <div className='progress'>
                        <div
                          className={`progress-bar ${
                            idx % 3 === 0 ? 'bg-primary' : 
                            idx % 3 === 1 ? 'bg-success' : 
                            'bg-info'
                          }`}
                          style={{ width: `${enrollment.progress || 0}%` }}
                        >
                          {enrollment.progress || 0}%
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className='col-lg-4'>
            <div className='card shadow border-0 p-3'>
              <h5 className='fw-bold'>🕒 Recent Activity</h5>
              {loading ? (
                <div className='alert alert-info'>Loading...</div>
              ) : (
                <ul className='list-group list-group-flush'>
                  {enrolledCourses.length > 0 ? (
                    <>
                      {enrolledCourses.slice(0, 4).map((course, idx) => (
                        <li key={idx} className='list-group-item'>
                          {course.progress === 100 
                            ? `Completed ${course.courseTitle}` 
                            : `Learning ${course.courseTitle}`}
                        </li>
                      ))}
                    </>
                  ) : (
                    <li className='list-group-item'>No recent activity</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* 📚 MY COURSES TABLE */}
        <div className='card shadow border-0 p-3 mt-4'>
          <h5 className='fw-bold'>📚 My Courses</h5>

          {loading ? (
            <div className='alert alert-info'>Loading courses...</div>
          ) : error ? (
            <div className='alert alert-danger'>{error}</div>
          ) : enrolledCourses.length === 0 ? (
            <div className='alert alert-warning'>
              You haven't enrolled in any courses yet. Browse courses to get started!
            </div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-striped mt-2'>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {enrolledCourses.map((enrollment) => {
                    const progress = enrollment.progress || 0;
                    const isCompleted = progress === 100;
                    
                    return (
                      <tr key={enrollment.id}>
                        <td>{enrollment.courseTitle}</td>
                        <td>
                          <div className='progress'>
                            <div
                              className={`progress-bar ${
                                isCompleted ? 'bg-success' : 'bg-info'
                              }`}
                              style={{ width: `${progress}%` }}
                            >
                              {progress}%
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            isCompleted ? 'bg-success' : 'bg-warning'
                          }`}>
                            {isCompleted ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className='btn btn-sm btn-primary'
                            onClick={() => window.location.href = `/course/${enrollment.courseId}`}
                          >
                            {isCompleted ? 'Review' : 'Continue'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
