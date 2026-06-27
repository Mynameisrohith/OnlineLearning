import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Home() {
  const { user } = useUser();

  return (
    <div>
      {/* HERO SECTION */}
      <section className='bg-primary text-white py-5'>
        <div className='container py-5'>
          <div className='row align-items-center'>
            <div className='col-md-7'>
              <h1 className='display-4 fw-bold'>
                Learn Skills for the Future 🚀
              </h1>
              <p className='fs-5'>
                10M+ learners • 50K+ courses • Industry experts
              </p>
              <div className='d-flex gap-2'>
                <Link to='/courses' className='btn btn-light btn-lg fw-bold'>
                  Browse Courses
                </Link>
                {!user && (
                  <Link to='/register' className='btn btn-outline-light btn-lg fw-bold'>
                    Get Started Free
                  </Link>
                )}
              </div>
            </div>
            <div className='col-md-5 text-center'>
              <img
                src='https://cdn-icons-png.flaticon.com/512/1055/1055687.png'
                className='img-fluid'
                style={{ maxHeight: "250px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className='bg-light py-5'>
        <div className='container'>
          <div className='row text-center g-4'>
            {[
              ["10M+", "Students"],
              ["50,000+", "Courses"],
              ["8,000+", "Instructors"],
              ["2M+", "Certificates Issued"],
            ].map((item, index) => (
              <div key={index} className='col-md-3'>
                <div className='card shadow-sm border-0 p-4'>
                  <h2 className='fw-bold text-primary'>{item[0]}</h2>
                  <p className='text-muted'>{item[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER PATHS */}
      <section className='py-5'>
        <div className='container'>
          <h2 className='fw-bold mb-4'>Career Learning Paths</h2>
          <div className='row g-4'>
            {["Full Stack Developer", "AI Engineer", "Data Scientist"].map(
              (path, index) => (
                <div key={index} className='col-md-4'>
                  <div className='card shadow-sm border-0 p-4 h-100'>
                    <h5 className='fw-bold'>{path}</h5>
                    <p className='text-muted'>
                      Structured roadmap with courses, projects & certification.
                    </p>
                    <Link to='/courses' className='btn btn-outline-primary'>
                      View Path →
                    </Link>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className='bg-dark text-white py-5'>
        <div className='container'>
          <h2 className='fw-bold mb-4'>Student Reviews ⭐</h2>
          <div className='row g-4'>
            {[
              ["Rahul", "Got job after completing Full Stack Path!"],
              ["Ananya", "Amazing instructors and practical projects."],
              ["John", "Best LMS platform I’ve used."],
            ].map((review, index) => (
              <div key={index} className='col-md-4'>
                <div className='card bg-secondary text-white p-4 border-0 shadow'>
                  <p>"{review[1]}"</p>
                  <h6 className='fw-bold mt-2'>- {review[0]}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className='py-5 bg-primary text-white text-center'>
        <div className='container'>
          <h2 className='fw-bold'>Start Learning Today</h2>
          <p className='fs-5'>Join millions of learners worldwide</p>
          {user ? (
            <Link to='/courses' className='btn btn-light btn-lg fw-bold'>
              Browse Courses
            </Link>
          ) : (
            <Link to='/register' className='btn btn-light btn-lg fw-bold'>
              Get Started Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
