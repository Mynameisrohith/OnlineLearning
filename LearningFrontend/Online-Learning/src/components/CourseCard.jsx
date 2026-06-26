import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import enrollmentService from "../services/enrollmentService";
import { useState } from "react";

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Please login to enroll in this course');
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentService.enrollStudent(user.id, course.id);
      alert('Successfully enrolled!');
      navigate('/my-courses');
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Failed to enroll: ' + (err.message || 'Please try again'));
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className='col-md-4 col-lg-3 mb-4'>
      <div className='card shadow-sm h-100 course-card'>
        {/* Course Thumbnail */}
        <img
          src={course.image || "https://via.placeholder.com/300x180"}
          className='card-img-top'
          alt={course.title}
        />

        <div className='card-body d-flex flex-column'>
          {/* Title */}
          <h5 className='card-title fw-bold'>{course.title}</h5>

          {/* Description */}
          <p className='card-text text-muted' style={{ fontSize: "14px" }}>
            {course.description}
          </p>

          {/* Instructor */}
          <p className='mb-1'>
            <small>Instructor: {course.instructor}</small>
          </p>

          {/* Rating */}
          <p className='mb-1'>
            ⭐ {course.rating || "4.8"} ({course.reviews || 1200} reviews)
          </p>

          {/* Price */}
          <h6 className='fw-bold text-primary'>
            ₹{course.price}{" "}
            <span className='text-muted text-decoration-line-through'>
              ₹{course.oldPrice}
            </span>
          </h6>

          {/* Buttons */}
          <div className='mt-auto d-flex gap-2'>
            <Link
              className='btn btn-primary w-100'
              to={`/course/${course.id}`}
            >
              View Course
            </Link>
            <button 
              className='btn btn-outline-success w-100'
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? 'Enrolling...' : 'Enroll'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
