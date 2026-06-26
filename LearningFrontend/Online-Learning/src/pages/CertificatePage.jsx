import { useState } from "react";
import Certificate from "../components/Certificate";

export default function CertificatePage() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("Full Stack Web Development");

  return (
    <div className='container py-4'>
      <h1 className='fw-bold'>Generate Certificate</h1>

      <div className='card p-3 shadow mt-3'>
        <input
          className='form-control mb-2'
          placeholder='Enter Student Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className='form-select mb-2'
          onChange={(e) => setCourse(e.target.value)}
        >
          <option>Full Stack Web Development</option>
          <option>React Masterclass</option>
          <option>AI Course</option>
        </select>
      </div>

      {name && <Certificate name={name} course={course} />}
    </div>
  );
}
