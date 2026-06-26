import { useState } from "react";
import Certificate from "../components/Certificate";

export default function CertificatePage() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("Full Stack Web Development");
  const [customCourse, setCustomCourse] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const courses = [
    "Full Stack Web Development",
    "React Masterclass",
    "AI & Machine Learning",
    "Java Full Course",
  ];

  return (
    <div className='container py-4'>
      {/* HEADER */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1 className='fw-bold'>🎓 Certificate Generator</h1>
        <span className='badge bg-primary fs-6'>Admin Panel</span>
      </div>

      {/* FORM CARD */}
      <div className='card p-4 shadow border-0 mb-4'>
        <h5 className='fw-bold mb-3'>Student Details</h5>

        {/* Student Name */}
        <input
          className='form-control mb-3'
          placeholder='Enter Student Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Course Select */}
        <select
          className='form-select mb-3'
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          {courses.map((c) => (
            <option key={c}>{c}</option>
          ))}
          <option value='custom'>Custom Course</option>
        </select>

        {/* Custom Course Input */}
        {course === "custom" && (
          <input
            className='form-control mb-3'
            placeholder='Enter Custom Course Name'
            value={customCourse}
            onChange={(e) => setCustomCourse(e.target.value)}
          />
        )}

        {/* Date */}
        <label className='fw-bold'>Completion Date</label>
        <input
          type='date'
          className='form-control mb-3'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* LIVE PREVIEW */}
      {name && (
        <>
          <h4 className='fw-bold mb-3'>📜 Live Certificate Preview</h4>

          <div className='card shadow border-0 p-3 bg-light'>
            <Certificate
              name={name}
              course={course === "custom" ? customCourse : course}
              date={date}
            />
          </div>
        </>
      )}

      {/* EMPTY MESSAGE */}
      {!name && (
        <div className='text-center mt-5 text-muted'>
          <h5>Enter student details to generate certificate preview.</h5>
        </div>
      )}
    </div>
  );
}
