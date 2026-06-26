import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import userService from "../services/userService";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // Try to use the proper login endpoint first
      try {
        const response = await userService.loginUser({
          email: formData.email,
          password: formData.password,
        });
        
        // If login endpoint exists and returns user data
        if (response && response.id) {
          const userData = {
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          // Redirect based on role
          if (response.role === "ADMIN") {
            navigate("/admin");
          } else if (response.role === "INSTRUCTOR") {
            navigate("/instructor");
          } else {
            navigate("/dashboard");
          }
          return;
        }
      } catch (loginError) {
        console.log("Login endpoint not available, trying fallback method");
      }

      // Fallback: Check against all users (for development/testing)
      const users = await userService.getAllUsers();
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect based on role
        if (user.role === "ADMIN") {
          navigate("/admin");
        } else if (user.role === "INSTRUCTOR") {
          navigate("/instructor");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container py-5'>
      <div className='row justify-content-center'>
        <div className='col-md-5'>
          <div className='card shadow border-0 p-4'>
            <h2 className='fw-bold text-center mb-4'>🔐 Login</h2>

            {error && (
              <div className='alert alert-danger' role='alert'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label fw-bold'>Email Address</label>
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
                <label className='form-label fw-bold'>Password</label>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Enter your password'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type='submit'
                className='btn btn-primary w-100 fw-bold'
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <hr className='my-4' />

            <p className='text-center text-muted'>
              Don't have an account?{" "}
              <Link to='/register' className='text-primary fw-bold'>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
