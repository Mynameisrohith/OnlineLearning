import { useState } from "react";

// Fake Certificate Database (Frontend Only)
const certificatesDB = [
  {
    id: "LX-123456",
    name: "Rohith D",
    course: "React Masterclass",
    date: "2026-02-10",
    instructor: "Rohith D",
  },
  {
    id: "LX-987654",
    name: "Rohith D",
    course: "AI & Machine Learning",
    date: "2026-01-25",
    instructor: "Dr. John",
  },
];

export default function VerifyCertificate() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verify = () => {
    setLoading(true);
    setResult(null);

    // Fake API Delay
    setTimeout(() => {
      const cert = certificatesDB.find((c) => c.id === certId);
      if (cert) {
        setResult({ status: "valid", cert });
      } else {
        setResult({ status: "invalid" });
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className='container py-5'>
      {/* HEADER */}
      <div className='text-center mb-4'>
        <h1 className='fw-bold'>🎓 Certificate Verification Portal</h1>
        <p className='text-muted'>
          Verify authenticity of LearnX certificates worldwide
        </p>
      </div>

      {/* INPUT CARD */}
      <div className='card shadow border-0 p-4 mb-4'>
        <h5 className='fw-bold'>Enter Certificate ID</h5>

        <input
          className='form-control form-control-lg my-3'
          placeholder='Example: LX-123456'
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
        />

        <button
          className='btn btn-primary btn-lg w-100'
          onClick={verify}
          disabled={!certId || loading}
        >
          {loading ? "🔍 Verifying..." : "Verify Certificate"}
        </button>
      </div>

      {/* RESULT SECTION */}
      {result && result.status === "valid" && (
        <div className='card shadow border-success p-4'>
          <h3 className='text-success fw-bold'>✅ Certificate is VALID</h3>

          <div className='row mt-3'>
            <div className='col-md-6'>
              <p>
                <b>Student Name:</b> {result.cert.name}
              </p>
              <p>
                <b>Course:</b> {result.cert.course}
              </p>
              <p>
                <b>Completion Date:</b> {result.cert.date}
              </p>
            </div>

            <div className='col-md-6'>
              <p>
                <b>Certificate ID:</b> {result.cert.id}
              </p>
              <p>
                <b>Instructor:</b> {result.cert.instructor}
              </p>
              <p>
                <b>Status:</b> Verified & Authentic
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className='text-center mt-3'>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://learnx.com/verify/${result.cert.id}`}
              alt='QR'
            />
            <p className='text-muted small'>Scan to verify online</p>
          </div>
        </div>
      )}

      {result && result.status === "invalid" && (
        <div className='alert alert-danger text-center fw-bold fs-5'>
          ❌ Certificate NOT FOUND
          <p className='small mt-2 text-muted'>
            Check Certificate ID or contact LearnX support.
          </p>
        </div>
      )}
    </div>
  );
}
