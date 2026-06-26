import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import enrollmentService from "../services/enrollmentService";
import courseService from "../services/courseService";
import { useUser } from "../context/UserContext";

export default function MyCourses() {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unregisteringCourseId, setUnregisteringCourseId] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (user?.id) {
          const enrollments = await enrollmentService.getEnrollmentsByUser(user.id);
          const enrollmentsArray = Array.isArray(enrollments) ? enrollments : [];
          
          // Fetch course details for each enrollment
          const coursesWithDetails = await Promise.all(
            enrollmentsArray.map(async (enrollment) => {
              try {
                const course = await courseService.getCourseById(enrollment.courseId);
                return {
                  id: enrollment.courseId,
                  title: course?.title || `Course #${enrollment.courseId}`,
                  instructor: course?.instructor || "Unknown",
                  progress: enrollment.progress || 0,
                  rating: course?.rating || 0,
                  lectures: 100, // Default value
                  image: course?.image || "https://via.placeholder.com/300x180",
                  lastLecture: "Continue Learning",
                };
              } catch (err) {
                return {
                  id: enrollment.courseId,
                  title: `Course #${enrollment.courseId}`,
                  instructor: "Unknown",
                  progress: enrollment.progress || 0,
                  rating: 0,
                  lectures: 0,
                  image: "https://via.placeholder.com/300x180",
                  lastLecture: "Continue Learning",
                };
              }
            })
          );
          
          setMyCourses(coursesWithDetails);
        }
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  const handleUnregister = async (courseId) => {
    if (!user?.id) {
      alert('Please login first');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to unregister from this course?');
    if (!confirmed) return;

    try {
      setUnregisteringCourseId(courseId);
      await enrollmentService.unenrollStudent(user.id, courseId);
      setMyCourses((prev) => prev.filter((course) => course.id !== courseId));
      alert('Course unregistered successfully.');
    } catch (err) {
      console.error('Error unregistering course:', err);
      alert('Failed to unregister: ' + (err.message || 'Please try again'));
    } finally {
      setUnregisteringCourseId(null);
    }
  };

  return (
    <div className='container-fluid py-4'>
      <h2 className='fw-bold mb-3'>📚 My Learning</h2>

      {/* 🔍 SEARCH BAR */}
      <div className='row mb-3'>
        <div className='col-md-6'>
          <input
            className='form-control'
            placeholder='Search your courses...'
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🏆 STATS CARDS */}
      <div className='row g-3 mb-4'>
        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>Total Courses</h6>
            <h2 className='fw-bold text-primary'>
              {loading ? "..." : myCourses.length}
            </h2>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>Completed</h6>
            <h2 className='fw-bold text-success'>
              {loading ? "..." : myCourses.filter((c) => c.progress === 100).length}
            </h2>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>In Progress</h6>
            <h2 className='fw-bold text-warning'>
              {loading ? "..." : myCourses.filter((c) => c.progress < 100).length}
            </h2>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>Avg Progress</h6>
            <h2 className='fw-bold text-info'>
              {loading ? "..." : myCourses.length > 0 
                ? Math.round(myCourses.reduce((sum, c) => sum + c.progress, 0) / myCourses.length) + "%"
                : "0%"
              }
            </h2>
          </div>
        </div>
      </div>

      {loading ? (
        <div className='alert alert-info'>Loading your courses...</div>
      ) : error ? (
        <div className='alert alert-danger'>{error}</div>
      ) : myCourses.length === 0 ? (
        <div className='alert alert-warning'>
          You haven't enrolled in any courses yet. <Link to='/courses'>Browse courses</Link> to get started!
        </div>
      ) : (
        <>
          {/* ▶️ RESUME LEARNING SECTION */}
          <h4 className='fw-bold mb-2'>▶ Resume Learning</h4>
          <div className='d-flex overflow-auto gap-3 pb-3'>
            {myCourses.filter(c => c.progress < 100).slice(0, 5).map((c) => (
              <div
                key={c.id}
                className='card shadow border-0'
                style={{ minWidth: "280px" }}
              >
                <img
                  src={c.image}
                  className='card-img-top'
                  style={{ height: "140px", objectFit: "cover" }}
                />
                <div className='card-body'>
                  <h6 className='fw-bold'>{c.title}</h6>
                  <p className='text-muted small'>Last: {c.lastLecture}</p>
                  <Link
                    to={`/lecture/${c.id}`}
                    className='btn btn-primary btn-sm w-100'
                  >
                    Continue →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 🎓 ALL MY COURSES GRID */}
          <h4 className='fw-bold mt-4'>🎓 All My Courses</h4>
          <div className='row g-4 mt-1'>
            {myCourses.filter((c) =>
              c.title.toLowerCase().includes(search.toLowerCase())
            ).map((c) => (
          <div key={c.id} className='col-xl-3 col-lg-4 col-md-6'>
            <div className='card shadow border-0 h-100'>
              <img
                src={c.image}
                className='card-img-top'
                style={{ height: "180px", objectFit: "cover" }}
              />

              <div className='card-body'>
                <h6 className='fw-bold'>{c.title}</h6>
                <p className='text-muted small'>Instructor: {c.instructor}</p>
                <p className='small'>
                  ⭐ {c.rating} | 📚 {c.lectures} lectures
                </p>

                {/* Progress */}
                <div className='progress mb-2'>
                  <div
                    className='progress-bar bg-success'
                    style={{ width: `${c.progress}%` }}
                  >
                    {c.progress}%
                  </div>
                </div>

                {/* Badges */}
                {c.progress === 100 && (
                  <span className='badge bg-success me-2'>Completed</span>
                )}
                {c.progress < 100 && (
                  <span className='badge bg-warning text-dark'>
                    In Progress
                  </span>
                )}

                {/* Buttons */}
                <div className='d-flex gap-2 mt-2'>
                  <Link
                    to={`/lecture/${c.id}`}
                    className='btn btn-primary btn-sm w-100'
                  >
                    Learn
                  </Link>

                  <button
                    type='button'
                    className='btn btn-outline-danger btn-sm w-100'
                    onClick={() => handleUnregister(c.id)}
                    disabled={unregisteringCourseId === c.id}
                  >
                    {unregisteringCourseId === c.id ? 'Unregistering...' : 'Unregister'}
                  </button>

                  {c.progress === 100 && (
                    <Link
                      to='/certificates'
                      className='btn btn-success btn-sm w-100'
                    >
                      Certificate
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
          </div>

          {/* 🎯 ACHIEVEMENTS */}
          <div className='card shadow border-0 p-3 mt-4'>
            <h5 className='fw-bold'>🏅 Learning Stats</h5>
            <div className='d-flex gap-3 mt-2 flex-wrap'>
              {myCourses.filter(c => c.progress === 100).length > 0 && (
                <span className='badge bg-success'>🎓 {myCourses.filter(c => c.progress === 100).length} Completed</span>
              )}
              {myCourses.filter(c => c.progress < 100).length > 0 && (
                <span className='badge bg-warning text-dark'>📚 {myCourses.filter(c => c.progress < 100).length} In Progress</span>
              )}
              <span className='badge bg-primary'>🔥 Keep Learning!</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
