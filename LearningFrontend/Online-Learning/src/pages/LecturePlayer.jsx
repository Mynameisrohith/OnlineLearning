import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";

export default function LecturePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lectures = [
    { title: "Introduction to Course", duration: "10 min" },
    { title: "Setup Environment", duration: "15 min" },
    { title: "React Basics", duration: "25 min" },
    { title: "Components & Props", duration: "20 min" },
    { title: "State & Hooks", duration: "30 min" },
    { title: "Project Build", duration: "40 min" },
  ];

  const [currentLecture, setCurrentLecture] = useState(0);

  const progress = Math.round(((currentLecture + 1) / lectures.length) * 100);

  return (
    <div className='container-fluid py-3 bg-light'>
      <div className='row g-3'>
        {/* 🎥 VIDEO PLAYER SECTION */}
        <div className='col-lg-8'>
          <div className='card shadow border-0'>
            <div className='card-body'>
              <h4 className='fw-bold mb-2'>{lectures[currentLecture].title}</h4>
              <p className='text-muted'>
                Duration: {lectures[currentLecture].duration}
              </p>

              {/* Video */}
              <video
                controls
                className='w-100 rounded bg-black'
                style={{ height: "420px" }}
              >
                <source src='/demo.mp4' type='video/mp4' />
              </video>

              {/* Progress */}
              <div className='mt-3'>
                <ProgressBar progress={progress} />
                <small className='text-muted'>{progress}% Completed</small>
              </div>

              {/* Controls */}
              <div className='d-flex justify-content-between mt-3'>
                <button
                  className='btn btn-outline-secondary'
                  disabled={currentLecture === 0}
                  onClick={() => setCurrentLecture(currentLecture - 1)}
                >
                  ← Previous
                </button>

                <button
                  className='btn btn-primary'
                  disabled={currentLecture === lectures.length - 1}
                  onClick={() => setCurrentLecture(currentLecture + 1)}
                >
                  Next →
                </button>
              </div>

              {/* Notes */}
              <div className='mt-4'>
                <h5 className='fw-bold'>📝 Lecture Notes</h5>
                <textarea
                  className='form-control'
                  rows='4'
                  placeholder='Write your personal notes here...'
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* 📚 PLAYLIST SIDEBAR */}
        <div className='col-lg-4'>
          <div
            className='card shadow border-0 sticky-top'
            style={{ top: "80px" }}
          >
            <div className='card-body vh-100 overflow-auto'>
              <h5 className='fw-bold mb-3'>Course Curriculum</h5>

              {lectures.map((lec, index) => (
                <div
                  key={index}
                  className={`p-2 rounded mb-2 lecture-item ${
                    index === currentLecture
                      ? "bg-primary text-white"
                      : "bg-light"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setCurrentLecture(index)}
                >
                  <div className='d-flex justify-content-between'>
                    <span>
                      <b>Lecture {index + 1}</b> - {lec.title}
                    </span>
                    <span className='small'>{lec.duration}</span>
                  </div>
                </div>
              ))}

              {/* Course Summary */}
              <div className='mt-3 border-top pt-2 small text-muted'>
                <p>📌 Total Lectures: {lectures.length}</p>
                <p>⏱ Total Duration: 12 Hours</p>
                <p>🎓 Certificate Included</p>
              </div>

              {/* Take Quiz Button */}
              <button 
                className='btn btn-success w-100 mt-2'
                onClick={() => navigate(`/quiz/${id}`)}
              >
                📝 Take Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
