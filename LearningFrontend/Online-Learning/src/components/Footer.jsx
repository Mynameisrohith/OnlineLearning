export default function Footer() {
  return (
    <footer className='bg-dark text-light pt-5 mt-5'>
      <div className='container'>
        <div className='row'>
          {/* Company Info */}
          <div className='col-md-3 mb-4'>
            <h5 className='fw-bold'>LearnX</h5>
            <p>
              LearnX is a modern online learning platform offering courses in
              programming, AI, business, and design.
            </p>
          </div>

          {/* Categories */}
          <div className='col-md-3 mb-4'>
            <h6 className='fw-bold'>Popular Categories</h6>
            <ul className='list-unstyled'>
              <li>Web Development</li>
              <li>AI & Machine Learning</li>
              <li>Data Science</li>
              <li>Cyber Security</li>
              <li>Business & Marketing</li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className='col-md-3 mb-4'>
            <h6 className='fw-bold'>Useful Links</h6>
            <ul className='list-unstyled'>
              <li>About Us</li>
              <li>Become an Instructor</li>
              <li>Careers</li>
              <li>Help & Support</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className='col-md-3 mb-4'>
            <h6 className='fw-bold'>Subscribe</h6>
            <p>Get updates on new courses and offers.</p>
            <input
              type='email'
              className='form-control mb-2'
              placeholder='Enter your email'
            />
            <button className='btn btn-primary w-100'>Subscribe</button>
          </div>
        </div>

        {/* Social Media */}
        <div className='text-center border-top pt-3 mt-3'>
          <p>Follow us on</p>
          <div className='d-flex justify-content-center gap-3 fs-4'>
            <i className='bi bi-facebook'></i>
            <i className='bi bi-twitter'></i>
            <i className='bi bi-linkedin'></i>
            <i className='bi bi-youtube'></i>
          </div>
        </div>

        {/* Copyright */}
        <div className='text-center mt-3 pb-3'>
          <p className='mb-0'>© 2026 LearnX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
