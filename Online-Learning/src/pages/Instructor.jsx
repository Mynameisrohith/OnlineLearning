import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import courseService from "../services/courseService";
import { useUser } from "../context/UserContext";

export default function Instructor() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lecture upload form
  const [lectureForm, setLectureForm] = useState({
    courseId: "",
    title: "",
    description: "",
    videoFile: null,
  });

  // Fetch instructor's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses({ page: 0, size: 100 });
        
        // Handle paginated response
        let allCourses = [];
        if (response?.content) {
          allCourses = response.content;
        } else if (Array.isArray(response)) {
          allCourses = response;
        }
        
        // Filter courses by instructor if user is logged in
        if (user?.name) {
          allCourses = allCourses.filter(course => course.instructor === user.name);
        }
        
        setCourses(allCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  const handleLectureUpload = () => {
    if (!lectureForm.courseId || !lectureForm.title) {
      alert("Please fill in course and lecture title");
      return;
    }
    
    alert("Lecture upload functionality will be implemented with video service");
    setLectureForm({
      courseId: "",
      title: "",
      description: "",
      videoFile: null,
    });
  };

  const handleEditCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const totalStudents = courses.reduce((sum, course) => sum + (course.reviews || 0), 0);
  const avgRating = courses.length > 0 
    ? (courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length).toFixed(1)
    : 0;

  return (
    <div className='container-fluid py-4'>
      <h2 className='fw-bold mb-4'>👨‍🏫 Instructor Dashboard</h2>

      {/* 🔹 INSTRUCTOR STATS */}
      <div className='row g-3 mb-4'>
        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>Total Courses</h6>
            <h2 className='fw-bold text-primary'>{loading ? "..." : courses.length}</h2>
          </div>
        </div>

        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>Total Reviews</h6>
            <h2 className='fw-bold text-success'>{loading ? "..." : totalStudents}</h2>
          </div>
        </div>

        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>Average Rating</h6>
            <h2 className='fw-bold text-warning'>⭐ {loading ? "..." : avgRating}</h2>
          </div>
        </div>

        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>Status</h6>
            <h2 className='fw-bold text-info'>{courses.length > 0 ? "Active" : "New"}</h2>
          </div>
        </div>
      </div>

      {/* 📤 UPLOAD LECTURE & ANALYTICS */}
      <div className='row g-3'>
        {/* Upload Lecture */}
        <div className='col-lg-6'>
          <div className='card shadow border-0 p-3'>
            <h5 className='fw-bold'>📤 Upload New Lecture</h5>

            <div className='mb-2'>
              <label className='fw-bold'>Course</label>
              <select 
                className='form-control'
                value={lectureForm.courseId}
                onChange={(e) => setLectureForm({ ...lectureForm, courseId: e.target.value })}
              >
                <option value=''>Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Lecture Title</label>
              <input
                className='form-control'
                placeholder='React Hooks Explained'
                value={lectureForm.title}
                onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
              />
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Upload Video</label>
              <input 
                type='file' 
                className='form-control'
                accept='video/*'
                onChange={(e) => setLectureForm({ ...lectureForm, videoFile: e.target.files[0] })}
              />
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Description</label>
              <textarea 
                className='form-control' 
                rows='3'
                value={lectureForm.description}
                onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
              ></textarea>
            </div>

            <button 
              className='btn btn-primary w-100'
              onClick={handleLectureUpload}
            >
              Upload Lecture
            </button>
          </div>
        </div>

        {/* Student Analytics */}
        <div className='col-lg-6'>
          <div className='card shadow border-0 p-3'>
            <h5 className='fw-bold'>📊 Course Performance</h5>

            {loading ? (
              <div className='alert alert-info'>Loading analytics...</div>
            ) : courses.length === 0 ? (
              <div className='alert alert-warning'>
                No courses found. Create courses in the admin panel to get started!
              </div>
            ) : (
              <>
                <p className='text-muted'>Average Rating</p>
                <div className='progress mb-2'>
                  <div className='progress-bar bg-success' style={{ width: `${(avgRating / 5) * 100}%` }}>
                    {avgRating}/5.0
                  </div>
                </div>

                <p className='text-muted'>Total Reviews</p>
                <div className='progress mb-2'>
                  <div className='progress-bar bg-primary' style={{ width: '65%' }}>
                    {totalStudents}
                  </div>
                </div>

                <p className='text-muted'>Active Courses</p>
                <div className='progress'>
                  <div
                    className='progress-bar bg-info'
                    style={{ width: '100%' }}
                  >
                    {courses.length}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 📚 MANAGE COURSES TABLE */}
      <div className='card shadow border-0 p-3 mt-4'>
        <h5 className='fw-bold'>📚 My Courses</h5>

        {loading ? (
          <div className='alert alert-info'>Loading courses...</div>
        ) : error ? (
          <div className='alert alert-danger'>{error}</div>
        ) : courses.length === 0 ? (
          <div className='alert alert-warning'>
            No courses found. Create courses in the admin panel to see them here!
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-striped mt-2'>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Reviews</th>
                  <th>Rating</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td>{course.category}</td>
                    <td>
                      <span className='badge bg-info'>{course.level}</span>
                    </td>
                    <td>{course.reviews || 0}</td>
                    <td>⭐ {course.rating || 0}</td>
                    <td>₹{course.price}</td>
                    <td>
                      <button 
                        className='btn btn-sm btn-primary'
                        onClick={() => handleEditCourse(course.id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
