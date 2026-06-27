import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import { useUser } from "../context/UserContext";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [unregistering, setUnregistering] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);

        // Check if user is already enrolled
        if (user?.id) {
          try {
            const enrollments = await enrollmentService.getEnrollmentsByUser(user.id);
            const enrolled = Array.isArray(enrollments) 
              ? enrollments.some(e => e.courseId === parseInt(id))
              : false;
            setIsEnrolled(enrolled);
          } catch (err) {
            console.error('Error checking enrollment:', err);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      alert('Please login to enroll in this course');
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentService.enrollStudent(user.id, parseInt(id));
      setIsEnrolled(true);
      alert('Successfully enrolled in the course!');
      navigate('/my-courses');
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Failed to enroll: ' + (err.message || 'Please try again'));
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnregister = async () => {
    if (!user?.id) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to unregister from this course?');
    if (!confirmed) return;

    setUnregistering(true);
    try {
      await enrollmentService.unenrollStudent(user.id, parseInt(id));
      setIsEnrolled(false);
      alert('You have been unregistered from this course.');
    } catch (err) {
      console.error('Error unregistering:', err);
      alert('Failed to unregister: ' + (err.message || 'Please try again'));
    } finally {
      setUnregistering(false);
    }
  };

  if (loading) {
    return (
      <div className='container text-center py-5'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
        <p className='mt-3'>Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container py-5'>
        <div className='alert alert-danger' role='alert'>
          <h5>⚠️ Error Loading Course</h5>
          <p>{error}</p>
          <button 
            className='btn btn-outline-danger btn-sm me-2'
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
          <button 
            className='btn btn-outline-secondary btn-sm'
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className='container py-5 text-center'>
        <h4>Course not found</h4>
        <button 
          className='btn btn-primary mt-3'
          onClick={() => navigate('/courses')}
        >
          Browse All Courses
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* HERO SECTION */}
      <div
        className='text-white py-5'
        style={{ background: "linear-gradient(135deg,#1c1d1f,#0d6efd)" }}
      >
        <div className='container'>
          <h1 className='fw-bold'>{course.title}</h1>
          <p className='fs-5'>{course.description}</p>
          <p>⭐ {course.rating} ({course.reviews} reviews) • Created by {course.instructor}</p>
          <div className='d-flex gap-3 mt-2'>
            <span className='badge bg-info text-dark'>{course.level}</span>
            <span className='badge bg-success'>{course.category}</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className='container my-4'>
        <div className='row g-4'>
          {/* LEFT SECTION */}
          <div className='col-lg-8'>
            {/* VIDEO PLAYER */}
            <div className='card shadow-sm p-3'>
              <img 
                src={course.image} 
                alt={course.title}
                className='w-100 rounded'
                style={{ height: "420px", objectFit: "cover" }}
              />
            </div>

            {/* COURSE INFO STATS */}
            <div className='card shadow-sm p-3 mt-3'>
              <div className='row text-center'>
                <div className='col'>
                  <h5>⏱ 48 Hours</h5>
                  <p>Video Content</p>
                </div>
                <div className='col'>
                  <h5>📚 120 Lectures</h5>
                  <p>Modules</p>
                </div>
                <div className='col'>
                  <h5>🎓 Beginner → Advanced</h5>
                  <p>Level</p>
                </div>
              </div>
            </div>

            {/* WHAT YOU WILL LEARN */}
            <div className='card shadow-sm p-4 mt-4'>
              <h4 className='fw-bold'>What you'll learn</h4>
              <div className='row'>
                <div className='col-md-6'>
                  <ul>
                    <li>Build full stack web apps</li>
                    <li>React Hooks & State</li>
                    <li>Node.js & Express APIs</li>
                  </ul>
                </div>
                <div className='col-md-6'>
                  <ul>
                    <li>MongoDB Database</li>
                    <li>Authentication & JWT</li>
                    <li>Deploy on Cloud</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CURRICULUM */}
            <div className='card shadow-sm p-4 mt-4'>
              <h4 className='fw-bold'>Course Curriculum</h4>

              <div className='accordion mt-3' id='curriculum'>
                <div className='accordion-item'>
                  <h2 className='accordion-header'>
                    <button
                      className='accordion-button'
                      data-bs-toggle='collapse'
                      data-bs-target='#m1'
                    >
                      Module 1: Web Basics
                    </button>
                  </h2>
                  <div id='m1' className='accordion-collapse collapse show'>
                    <div className='accordion-body'>
                      HTML, CSS, JavaScript Fundamentals
                    </div>
                  </div>
                </div>

                <div className='accordion-item'>
                  <h2 className='accordion-header'>
                    <button
                      className='accordion-button collapsed'
                      data-bs-toggle='collapse'
                      data-bs-target='#m2'
                    >
                      Module 2: React Development
                    </button>
                  </h2>
                  <div id='m2' className='accordion-collapse collapse'>
                    <div className='accordion-body'>
                      Components, Hooks, Projects
                    </div>
                  </div>
                </div>

                <div className='accordion-item'>
                  <h2 className='accordion-header'>
                    <button
                      className='accordion-button collapsed'
                      data-bs-toggle='collapse'
                      data-bs-target='#m3'
                    >
                      Module 3: Backend & Database
                    </button>
                  </h2>
                  <div id='m3' className='accordion-collapse collapse'>
                    <div className='accordion-body'>
                      Node.js, Express, MongoDB
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 👨‍🏫 INSTRUCTOR SECTION */}
            <div className='card shadow-sm p-4 mt-4'>
              <h4 className='fw-bold'>Instructor</h4>
              <div className='d-flex align-items-center gap-3 mt-3'>
                <img
                  src='https://via.placeholder.com/100'
                  className='rounded-circle'
                  alt='instructor'
                />
                <div>
                  <h5 className='fw-bold'>{course.instructor}</h5>
                  <p className='text-muted'>Course Instructor</p>
                  <p>
                    ⭐ {course.rating} Rating • {course.reviews} Reviews
                  </p>
                </div>
              </div>
              <p className='mt-2'>
                Expert instructor with years of experience in {course.category}.
              </p>
            </div>

            {/* ⭐ STUDENT REVIEWS */}
            <div className='card shadow-sm p-4 mt-4'>
              <h4 className='fw-bold'>Student Reviews</h4>

              <div className='border-bottom py-2'>
                <b>Arjun Kumar</b> ⭐⭐⭐⭐⭐
                <p>Best full stack course. Very detailed explanations.</p>
              </div>

              <div className='border-bottom py-2'>
                <b>Neha Sharma</b> ⭐⭐⭐⭐☆
                <p>Good course, but backend part could be deeper.</p>
              </div>

              <div className='py-2'>
                <b>John Smith</b> ⭐⭐⭐⭐⭐
                <p>Highly recommended for beginners.</p>
              </div>
            </div>
          </div>

          {/* RIGHT PRICE CARD */}
          <div className='col-lg-4'>
            <div
              className='card shadow-lg p-4 sticky-top'
              style={{ top: "100px" }}
            >
              <h2 className='fw-bold text-success'>₹{course.price}</h2>
              {course.oldPrice && (
                <p className='text-muted'>
                  <del>₹{course.oldPrice}</del>{' '}
                  <span className='text-danger'>
                    {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}% OFF
                  </span>
                </p>
              )}

              {isEnrolled ? (
                <>
                  <button 
                    className='btn btn-success w-100 mb-2'
                    onClick={() => navigate('/my-courses')}
                  >
                    ✓ Enrolled - Go to My Courses
                  </button>
                  <button
                    className='btn btn-outline-danger w-100 mb-2'
                    onClick={handleUnregister}
                    disabled={unregistering}
                  >
                    {unregistering ? 'Unregistering...' : 'Unregister Course'}
                  </button>
                </>
              ) : (
                <button 
                  className='btn btn-primary w-100 mb-2'
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              <button className='btn btn-outline-secondary w-100 mb-2'>
                Add to Wishlist
              </button>
              <button 
                className='btn btn-success w-100'
                onClick={() => navigate(`/quiz/${course.id}`)}
              >
                📝 Take Quiz
              </button>

              <hr />

              <p className='fw-bold'>This course includes:</p>
              <ul className='list-unstyled'>
                <li>🎥 Video content</li>
                <li>📂 Source code & downloads</li>
                <li>🎓 Certificate</li>
                <li>📱 Lifetime access</li>
                <li>⭐ {course.rating} rating</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
