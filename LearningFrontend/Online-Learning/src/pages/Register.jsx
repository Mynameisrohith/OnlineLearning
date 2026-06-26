import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import userService from "../services/userService";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false);

  useEffect(() => {
    // Check if this will be the first user
    const checkFirstUser = async () => {
      try {
        const users = await userService.getAllUsers();
        console.log("Users in database:", users);
        if (!users || users.length === 0) {
          console.log("First user detected! Showing ADMIN option");
          setIsFirstUser(true);
          setFormData(prev => ({ ...prev, role: "ADMIN" }));
        } else {
          console.log("Users already exist, hiding ADMIN option");
        }
      } catch (err) {
        console.error("Error checking users:", err);
        // If API fails or returns error, assume first user (safer for setup)
        console.log("API error - defaulting to first user");
        setIsFirstUser(true);
        setFormData(prev => ({ ...prev, role: "ADMIN" }));
      }
    };
    checkFirstUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      await userService.registerUser(userData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container py-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card shadow border-0 p-4'>
            <h2 className='fw-bold text-center mb-4'>📝 Register</h2>

            {error && (
              <div className='alert alert-danger' role='alert'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label fw-bold'>
                  Full Name <span className='text-danger'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter your full name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label fw-bold'>
                  Email Address <span className='text-danger'>*</span>
                </label>
                <input
                  type='email'
                  className='form-control'
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label fw-bold'>
                  Password <span className='text-danger'>*</span>
                </label>
                <input
                  type='password'
                  className='form-control'
                  placeholder='At least 6 characters'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label fw-bold'>
                  Confirm Password <span className='text-danger'>*</span>
                </label>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Re-enter your password'
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label fw-bold'>
                  Register as <span className='text-danger'>*</span>
                </label>
                <select
                  className='form-select'
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  {isFirstUser && <option value='ADMIN'>Admin</option>}
                  <option value='STUDENT'>Student</option>
                  <option value='INSTRUCTOR'>Instructor</option>
                </select>
                <small className='text-muted'>
                  {isFirstUser 
                    ? '🎉 Admin option available for first user only' 
                    : 'Choose your role on the platform'}
                </small>
              </div>

              <button
                type='submit'
                className='btn btn-primary w-100 fw-bold'
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <hr className='my-4' />

            <p className='text-center text-muted'>
              Already have an account?{" "}
              <Link to='/login' className='text-primary fw-bold'>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
