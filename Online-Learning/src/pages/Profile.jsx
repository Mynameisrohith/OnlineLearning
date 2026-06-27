import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import enrollmentService from "../services/enrollmentService";
import certificateService from "../services/certificateService";
import userService from "../services/userService";

export default function Profile() {
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [student, setStudent] = useState({
    name: user?.name || "Guest User",
    email: user?.email || "guest@example.com",
    joined: "2026",
    bio: "Full Stack Developer & AI Enthusiast. Passionate about building modern web applications.",
    courses: 0,
    certificates: 0,
    progress: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const [enrollmentsData, certificatesData] = await Promise.all([
          enrollmentService.getEnrollmentsByUser(user.id),
          certificateService.getCertificatesByUser(user.id),
        ]);
        
        const enrollmentsArray = Array.isArray(enrollmentsData) ? enrollmentsData : [];
        
        // Calculate average progress across all enrollments
        const totalProgress = enrollmentsArray.reduce((sum, enrollment) => {
          return sum + (enrollment.progress || 0);
        }, 0);
        const averageProgress = enrollmentsArray.length > 0 
          ? Math.round(totalProgress / enrollmentsArray.length) 
          : 0;
        
        setStudent((prev) => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          courses: enrollmentsArray.length,
          certificates: Array.isArray(certificatesData) ? certificatesData.length : 0,
          progress: averageProgress,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id, user?.name, user?.email]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    try {
      setSaving(true);
      const updatedData = {
        id: user.id,
        name: student.name,
        email: student.email,
        password: user.password || "password123", // Keep existing password
        role: user.role,
      };
      
      const response = await userService.updateUser(user.id, updatedData);
      
      // Update context with new user data
      const updatedUser = {
        ...user,
        name: student.name,
        email: student.email,
      };
      updateUser(updatedUser);
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Check if it's a backend endpoint issue
      if (error.message.includes("Failed to fetch") || error.message.includes("404")) {
        alert("⚠️ Backend update endpoint not available.\n\nYour changes are saved locally but won't persist after refresh.\n\nBackend needs: PUT /api/users/{id}");
        
        // Update context anyway for local state
        const updatedUser = {
          ...user,
          name: student.name,
          email: student.email,
        };
        updateUser(updatedUser);
        setIsEditing(false);
      } else {
        alert("Failed to update profile: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setStudent((prev) => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email || prev.email,
    }));
    setIsEditing(false);
  };

  return (
    <div className='container py-4'>
      <div className='row g-3'>
        {/* 👤 PROFILE CARD */}
        <div className='col-lg-4'>
          <div className='card shadow border-0 text-center p-3'>
            <img
              src='https://i.pravatar.cc/150'
              className='rounded-circle mx-auto mb-3'
              width='120'
              alt='Profile'
            />
            <h4 className='fw-bold'>{student.name}</h4>
            <p className='text-muted'>{student.email}</p>
            <button 
              className='btn btn-primary btn-sm' 
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              disabled={saving}
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>

          {/* 📊 STATS */}
          <div className='card shadow border-0 mt-3 p-3'>
            <h5 className='fw-bold'>Learning Stats</h5>
            <div className='d-flex justify-content-between mt-2'>
              <span>📚 Courses Enrolled</span>
              <b>{loading ? "..." : student.courses}</b>
            </div>
            <div className='d-flex justify-content-between mt-2'>
              <span>🎓 Certificates</span>
              <b>{loading ? "..." : student.certificates}</b>
            </div>
            <div className='d-flex justify-content-between mt-2'>
              <span>📈 Overall Progress</span>
              <b>{loading ? "..." : student.progress}%</b>
            </div>

            <div className='progress mt-2'>
              <div
                className='progress-bar bg-success'
                style={{ width: `${student.progress}%` }}
              >
                {loading ? "..." : student.progress}%
              </div>
            </div>
          </div>
        </div>

        {/* 🧾 PROFILE DETAILS */}
        <div className='col-lg-8'>
          <div className='card shadow border-0 p-4'>
            <h4 className='fw-bold mb-3'>Personal Information</h4>

            <div className='row mb-3'>
              <div className='col-md-6'>
                <label className='fw-bold'>Full Name</label>
                <input 
                  className='form-control' 
                  value={student.name} 
                  onChange={(e) => setStudent({...student, name: e.target.value})}
                  readOnly={!isEditing}
                />
              </div>
              <div className='col-md-6'>
                <label className='fw-bold'>Email</label>
                <input
                  className='form-control'
                  value={student.email}
                  onChange={(e) => setStudent({...student, email: e.target.value})}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className='row mb-3'>
              <div className='col-md-6'>
                <label className='fw-bold'>Joined Year</label>
                <input
                  className='form-control'
                  value={student.joined}
                  readOnly
                />
              </div>
              <div className='col-md-6'>
                <label className='fw-bold'>Role</label>
                <input className='form-control' value={user?.role || 'Student'} readOnly />
              </div>
            </div>

            {/* BIO */}
            <div className='mb-3'>
              <label className='fw-bold'>About Me</label>
              <textarea
                className='form-control'
                rows='4'
                value={student.bio}
                onChange={(e) => setStudent({...student, bio: e.target.value})}
                readOnly={!isEditing}
              ></textarea>
            </div>

            {isEditing ? (
              <div className='d-flex gap-2'>
                <button 
                  className='btn btn-success' 
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
                <button 
                  className='btn btn-secondary' 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  ✖ Cancel
                </button>
              </div>
            ) : (
              <button 
                className='btn btn-primary' 
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {/* 🧠 SKILLS SECTION */}
          <div className='card shadow border-0 mt-3 p-3'>
            <h5 className='fw-bold'>Skills</h5>
            <div className='d-flex flex-wrap gap-2 mt-2'>
              <span className='badge bg-primary'>React</span>
              <span className='badge bg-success'>Node.js</span>
              <span className='badge bg-warning text-dark'>AI / ML</span>
              <span className='badge bg-info text-dark'>Firebase</span>
              <span className='badge bg-secondary'>Bootstrap</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
