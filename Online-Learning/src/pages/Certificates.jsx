import { useState, useEffect } from "react";
import Certificate from "../components/Certificate";
import certificateService from "../services/certificateService";
import courseService from "../services/courseService";
import { useUser } from "../context/UserContext";

export default function Certificates() {
  const { user } = useUser();
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch certificates from backend
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        if (user?.id) {
          const data = await certificateService.getCertificatesByUser(user.id);
          const certificateDtos = Array.isArray(data) ? data : [];
          const mappedCertificates = certificateDtos.map((certificate) => {
            return {
              id: certificate.id,
              userId: certificate.user?.id || user.id,
              courseId: certificate.course?.id,
              name: certificate.user?.name || user?.name || "Unknown User",
              course: certificate.course?.title || "Unknown Course",
              date: "N/A",
              certificateCode: certificate.certificateCode,
            };
          });
          setCertificates(mappedCertificates);
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError(err.message);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  // Filter certificates
  const filteredCertificates = certificates.filter((c) =>
    (c.course || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleDownloadPDF = (certificate) => {
    // This would integrate with your backend PDF generation service
    console.log("Downloading certificate:", certificate);
    alert("PDF download would be implemented with backend integration");
  };

  return (
    <div className='container py-4'>
      {/* HEADER */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2 className='fw-bold'>🎓 My Certificates</h2>

        <input
          type='text'
          className='form-control w-25'
          placeholder='Search course...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className='alert alert-warning' role='alert'>
          {error} - Showing sample data
        </div>
      )}

      {/* 🔹 STATS CARDS */}
      <div className='row mb-4 g-3'>
        <div className='col-md-4'>
          <div className='card shadow-sm border-0 p-3 text-center bg-light'>
            <h6>Total Certificates</h6>
            <h2 className='fw-bold text-success'>
              {loading ? "..." : certificates.length}
            </h2>
          </div>
        </div>

        <div className='col-md-4'>
          <div className='card shadow-sm border-0 p-3 text-center bg-light'>
            <h6>Courses Completed</h6>
            <h2 className='fw-bold text-primary'>
              {loading ? "..." : Math.ceil(certificates.length * 1.2)}
            </h2>
          </div>
        </div>

        <div className='col-md-4'>
          <div className='card shadow-sm border-0 p-3 text-center bg-light'>
            <h6>Latest Certificate</h6>
            <h5 className='fw-bold'>{certificates[0]?.course || "None"}</h5>
          </div>
        </div>
      </div>

      {/* 🏆 CERTIFICATE GRID */}
      {loading ? (
        <div className='alert alert-info'>Loading certificates...</div>
      ) : filteredCertificates.length === 0 ? (
        <div className='text-center mt-5'>
          <h4>No Certificates Found</h4>
          <p>Complete courses to earn certificates.</p>
        </div>
      ) : (
      <div className='row g-4'>
        {filteredCertificates.map((c) => (
          <div className='col-xl-4 col-lg-6' key={c.id}>
            <div className='card shadow border-0 p-3 h-100'>
              {/* Small Preview */}
              <div className='border rounded p-2 bg-white'>
                <Certificate name={c.name} course={c.course} />
              </div>

              <div className='mt-3'>
                <p className='text-muted mb-1'>📅 Issued On: {c.date}</p>

                <div className='d-flex gap-2'>
                  <button
                    className='btn btn-outline-primary btn-sm w-100'
                    onClick={() => setSelectedCert(c)}
                  >
                    👁 View
                  </button>

                  <button
                    className='btn btn-success btn-sm w-100'
                    onClick={() => handleDownloadPDF(c)}
                  >
                    ⬇ Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}


      {/* 🔥 PREVIEW MODAL */}
      {selectedCert && (
        <div
          className='modal fade show d-block'
          style={{ background: "#000000aa" }}
        >
          <div className='modal-dialog modal-xl modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>
                  Certificate Preview - {selectedCert.course}
                </h5>
                <button
                  className='btn-close'
                  onClick={() => setSelectedCert(null)}
                ></button>
              </div>

              <div className='modal-body'>
                <Certificate
                  name={selectedCert.name}
                  course={selectedCert.course}
                />
              </div>

              <div className='modal-footer'>
                <button
                  className='btn btn-secondary'
                  onClick={() => setSelectedCert(null)}
                >
                  Close
                </button>
                <button
                  className='btn btn-success'
                  onClick={() => handleDownloadPDF(selectedCert)}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
