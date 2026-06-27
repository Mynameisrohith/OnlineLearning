import { useState, useEffect } from "react";
import userService from "../services/userService";
import quizService from "../services/quizService";
import courseService from "../services/courseService";
import certificateService from "../services/certificateService";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states for quiz creation
  const [quizFormData, setQuizFormData] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    courseId: "",
  });

  // Form states for certificate creation
  const [certFormData, setCertFormData] = useState({
    userId: "",
    courseId: "",
  });

  // Form states for course creation
  const [courseFormData, setCourseFormData] = useState({
    title: "",
    description: "",
    instructorId: "",
    price: "",
    oldPrice: "",
    rating: "",
    category: "",
    level: "",
    image: "",
  });

  // Fetch users and quizzes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, coursesData] = await Promise.all([
          userService.getAllUsers(),
          courseService.getAllCourses({ page: 0, size: 100 })
        ]);
        setUsers(Array.isArray(usersData) ? usersData : []);
        
        // Handle paginated course response
        if (coursesData?.content) {
          setCourses(coursesData.content);
        } else if (Array.isArray(coursesData)) {
          setCourses(coursesData);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateQuiz = async () => {
    if (
      !quizFormData.question ||
      !quizFormData.optionA ||
      !quizFormData.optionB ||
      !quizFormData.optionC ||
      !quizFormData.optionD ||
      !quizFormData.correctAnswer ||
      !quizFormData.courseId
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const createdQuiz = await quizService.createQuiz(quizFormData);
      setQuizzes((prev) => [...prev, createdQuiz]);
      alert("Quiz created successfully!");
      setQuizFormData({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        courseId: "",
      });
    } catch (err) {
      console.error("Error creating quiz:", err);
      alert("Failed to create quiz: " + err.message);
    }
  };

  const handleCreateCertificate = async () => {
    if (!certFormData.userId || !certFormData.courseId) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await certificateService.generateCertificate(
        certFormData.userId,
        certFormData.courseId
      );
      alert("Certificate generated successfully!");
      setCertFormData({ userId: "", courseId: "" });
    } catch (err) {
      console.error("Error generating certificate:", err);
      alert("Failed to generate certificate: " + err.message);
    }
  };

  const handleCreateCourse = async () => {
    if (
      !courseFormData.title ||
      !courseFormData.description ||
      !courseFormData.instructorId ||
      !courseFormData.price ||
      !courseFormData.category ||
      !courseFormData.level
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const courseData = {
        title: courseFormData.title,
        description: courseFormData.description,
        instructor: { id: parseInt(courseFormData.instructorId) },
        price: parseFloat(courseFormData.price),
        oldPrice: courseFormData.oldPrice ? parseFloat(courseFormData.oldPrice) : null,
        rating: courseFormData.rating ? parseFloat(courseFormData.rating) : 0,
        category: courseFormData.category,
        level: courseFormData.level,
        image: courseFormData.image || null,
      };
      
      const createdCourse = await courseService.createCourse(courseData);
      setCourses((prev) => [...prev, createdCourse]);
      alert("Course created successfully!");
      setCourseFormData({
        title: "",
        description: "",
        instructorId: "",
        price: "",
        oldPrice: "",
        rating: "",
        category: "",
        level: "",
        image: "",
      });
    } catch (err) {
      console.error("Error creating course:", err);
      alert("Failed to create course: " + err.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === "active") return "bg-success";
    if (status === "admin") return "bg-primary";
    return "bg-secondary";
  };

  const normalizeStatus = (user) => {
    if (user?.role?.toLowerCase() === "admin") {
      return "admin";
    }
    return "active";
  };

  return (
    <div className='container-fluid py-4'>
      <h2 className='fw-bold mb-4'>🛠 Admin Dashboard</h2>

      {error && (
        <div className='alert alert-warning' role='alert'>
          {error}
        </div>
      )}

      {/* 🔹 ADMIN STATS */}
      <div className='row g-3 mb-4'>
        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>Total Users</h6>
            <h2 className='fw-bold text-primary'>{loading ? "..." : users.length}</h2>
          </div>
        </div>

        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>Total Courses</h6>
            <h2 className='fw-bold text-success'>{loading ? "..." : courses.length}</h2>
          </div>
        </div>

        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>Total Quizzes</h6>
            <h2 className='fw-bold text-info'>{quizzes.length}</h2>
          </div>
        </div>

        <div className='col-md-3'>
          <div className='card shadow border-0 p-3 text-center'>
            <h6>User Roles</h6>
            <h2 className='fw-bold text-warning'>
              {loading ? "..." : new Set(users.map((u) => u.role)).size}
            </h2>
          </div>
        </div>
      </div>

      {/* 📚 COURSE, QUIZ & CERTIFICATE MANAGEMENT */}
      <div className='row g-3 mb-4'>
        {/* Create Course */}
        <div className='col-lg-4'>
          <div className='card shadow border-0 p-3'>
            <h5 className='fw-bold'>📚 Create New Course</h5>

            <div className='mb-2'>
              <label className='fw-bold'>Title</label>
              <input
                type='text'
                className='form-control'
                placeholder='React Masterclass'
                value={courseFormData.title}
                onChange={(e) =>
                  setCourseFormData({ ...courseFormData, title: e.target.value })
                }
              />
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Description</label>
              <textarea
                className='form-control'
                rows='2'
                placeholder='Complete React from beginner to advanced'
                value={courseFormData.description}
                onChange={(e) =>
                  setCourseFormData({ ...courseFormData, description: e.target.value })
                }
              />
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Instructor</label>
              <select
                className='form-control'
                value={courseFormData.instructorId}
                onChange={(e) =>
                  setCourseFormData({ ...courseFormData, instructorId: e.target.value })
                }
              >
                <option value=''>Select Instructor</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className='row mb-2'>
              <div className='col-6'>
                <label className='fw-bold'>Price (₹)</label>
                <input
                  type='number'
                  className='form-control'
                  placeholder='999'
                  value={courseFormData.price}
                  onChange={(e) =>
                    setCourseFormData({ ...courseFormData, price: e.target.value })
                  }
                />
              </div>
              <div className='col-6'>
                <label className='fw-bold'>Old Price (₹)</label>
                <input
                  type='number'
                  className='form-control'
                  placeholder='1999'
                  value={courseFormData.oldPrice}
                  onChange={(e) =>
                    setCourseFormData({ ...courseFormData, oldPrice: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Category</label>
              <select
                className='form-control'
                value={courseFormData.category}
                onChange={(e) =>
                  setCourseFormData({ ...courseFormData, category: e.target.value })
                }
              >
                <option value=''>Select Category</option>
                <option>Web Development</option>
                <option>AI</option>
                <option>Data Science</option>
                <option>Programming</option>
                <option>Design</option>
                <option>Business</option>
                <option>Security</option>
                <option>Cloud</option>
                <option>DevOps</option>
                <option>Mobile Development</option>
              </select>
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Level</label>
              <select
                className='form-control'
                value={courseFormData.level}
                onChange={(e) =>
                  setCourseFormData({ ...courseFormData, level: e.target.value })
                }
              >
                <option value=''>Select Level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Image URL</label>
              <input
                type='text'
                className='form-control'
                placeholder='https://example.com/image.jpg'
                value={courseFormData.image}
                onChange={(e) =>
                  setCourseFormData({ ...courseFormData, image: e.target.value })
                }
              />
            </div>

            <button
              className='btn btn-primary w-100'
              onClick={handleCreateCourse}
            >
              Create Course
            </button>
          </div>
        </div>

        {/* Create Quiz */}
        <div className='col-lg-4'>
          <div className='card shadow border-0 p-3'>
            <h5 className='fw-bold'>📝 Create New Quiz</h5>

            <div className='mb-2'>
              <label className='fw-bold'>Course</label>
              <select
                className='form-control'
                value={quizFormData.courseId}
                onChange={(e) =>
                  setQuizFormData({ ...quizFormData, courseId: e.target.value })
                }
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
              <label className='fw-bold'>Question</label>
              <input
                type='text'
                className='form-control'
                placeholder='What is React?'
                value={quizFormData.question}
                onChange={(e) =>
                  setQuizFormData({ ...quizFormData, question: e.target.value })
                }
              />
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Option A</label>
              <input
                type='text'
                className='form-control'
                placeholder='Library'
                value={quizFormData.optionA}
                onChange={(e) =>
                  setQuizFormData({ ...quizFormData, optionA: e.target.value })
                }
              />
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Option B</label>
              <input
                type='text'
                className='form-control'
                placeholder='Framework'
                value={quizFormData.optionB}
                onChange={(e) =>
                  setQuizFormData({ ...quizFormData, optionB: e.target.value })
                }
              />
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Option C</label>
              <input
                type='text'
                className='form-control'
                placeholder='Language'
                value={quizFormData.optionC}
                onChange={(e) =>
                  setQuizFormData({ ...quizFormData, optionC: e.target.value })
                }
              />
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Option D</label>
              <input
                type='text'
                className='form-control'
                placeholder='Database'
                value={quizFormData.optionD}
                onChange={(e) =>
                  setQuizFormData({ ...quizFormData, optionD: e.target.value })
                }
              />
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Correct Answer</label>
              <input
                type='text'
                className='form-control'
                placeholder='Library'
                value={quizFormData.correctAnswer}
                onChange={(e) =>
                  setQuizFormData({ ...quizFormData, correctAnswer: e.target.value })
                }
              />
            </div>

            <button
              className='btn btn-success w-100'
              onClick={handleCreateQuiz}
            >
              Create Quiz
            </button>
          </div>
        </div>

        {/* Generate Certificate */}
        <div className='col-lg-4'>
          <div className='card shadow border-0 p-3'>
            <h5 className='fw-bold'>🎓 Generate Certificate</h5>

            <div className='mb-2'>
              <label className='fw-bold'>User</label>
              <select
                className='form-control'
                value={certFormData.userId}
                onChange={(e) =>
                  setCertFormData({ ...certFormData, userId: e.target.value })
                }
              >
                <option value=''>Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className='mb-2'>
              <label className='fw-bold'>Course</label>
              <select
                className='form-control'
                value={certFormData.courseId}
                onChange={(e) =>
                  setCertFormData({ ...certFormData, courseId: e.target.value })
                }
              >
                <option value=''>Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              className='btn btn-warning w-100 mt-auto'
              onClick={handleCreateCertificate}
            >
              Generate Certificate
            </button>

            <div className='alert alert-info mt-3 small'>
              📌 Certificate will be generated for the selected user upon course completion.
            </div>
          </div>
        </div>
      </div>

      {/* 👥 USER MANAGEMENT TABLE */}
      <div className='card shadow border-0 p-3 mt-4'>
        <h5 className='fw-bold'>👥 Manage Users</h5>

        {loading ? (
          <div className='alert alert-info'>Loading users...</div>
        ) : users.length === 0 ? (
          <div className='alert alert-info'>No users found</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-striped mt-2'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className='badge bg-secondary'>
                        {user.role || "Student"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusBadgeClass(normalizeStatus(user))}`}
                      >
                        {normalizeStatus(user) === "admin" ? "Admin" : "Active"}
                      </span>
                    </td>
                    <td>
                      <button
                        className='btn btn-sm btn-info'
                        onClick={() => setSelectedUser(user)}
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className='modal d-block bg-dark bg-opacity-50' style={{ display: "block" }}>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>User Details</h5>
                <button
                  className='btn-close'
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className='modal-body'>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Status:</strong> {normalizeStatus(selectedUser) === "admin" ? "Admin" : "Active"}
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  className='btn btn-secondary'
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
