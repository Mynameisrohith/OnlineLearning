import { useState, useEffect } from "react";
import CourseCard from "../components/CourseCard";
import courseService from "../services/courseService";

export default function Courses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("id");
  const [price, setPrice] = useState(5000);

  // Pagination
  const [page, setPage] = useState(0); // Backend uses 0-indexed pages
  const perPage = 6;

  // API State
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          search,
          category,
          level,
          maxPrice: price,
          page,
          size: perPage,
          sort
        };

        const response = await courseService.getAllCourses(params);
        
        // Handle paginated response from Spring Boot
        if (response.content) {
          setCourses(response.content);
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
        } else {
          // Fallback if response is just an array
          setCourses(Array.isArray(response) ? response : []);
          setTotalPages(1);
          setTotalElements(Array.isArray(response) ? response.length : 0);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch courses');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, category, level, price, page, sort]);

  const paginatedCourses = courses;

  return (
    <div className='container-fluid my-4'>
      {/* HEADER */}
      <div className='bg-primary text-white p-4 rounded mb-4'>
        <h2 className='fw-bold'>Browse Courses</h2>
        <p>Choose from industry experts & real-world projects</p>
      </div>

      <div className='row'>
        {/* FILTER PANEL */}
        <div className='col-lg-3 mb-4'>
          <div
            className='card p-3 shadow-sm sticky-top'
            style={{ top: "90px" }}
          >
            <h5 className='fw-bold mb-3'>Filter Courses</h5>

            {/* Search */}
            <input
              className='form-control mb-3'
              placeholder='Search courses...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Category */}
            <select
              className='form-select mb-3'
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value=''>All Categories</option>
              <option>Web Development</option>
              <option>AI</option>
              <option>Data Science</option>
              <option>Business</option>
            </select>

            {/* Level */}
            <select
              className='form-select mb-3'
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value=''>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            {/* Price Filter */}
            <label className='fw-semibold'>Max Price: ₹{price}</label>
            <input
              type='range'
              className='form-range'
              min='0'
              max='5000'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            {/* Sorting */}
            <select
              className='form-select'
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(0); // Reset to first page on sort
              }}
            >
              <option value='id'>Sort by Latest</option>
              <option value='price'>Price Low to High</option>
              <option value='rating'>Highest Rated</option>
              <option value='title'>Alphabetical</option>
            </select>
          </div>
        </div>

        {/* COURSES GRID */}
        <div className='col-lg-9'>
          {/* Active Filters Chips */}
          <div className='mb-3 d-flex gap-2 flex-wrap'>
            {category && <span className='badge bg-primary'>{category}</span>}
            {level && <span className='badge bg-success'>{level}</span>}
            {search && (
              <span className='badge bg-warning text-dark'>"{search}"</span>
            )}
          </div>

          {/* Results Count */}
          <p className='text-muted'>
            {loading ? 'Loading...' : `Showing ${courses.length} of ${totalElements} courses`}
          </p>

          {/* Loading State */}
          {loading && (
            <div className='text-center py-5'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
              <p className='mt-3'>Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className='alert alert-danger' role='alert'>
              <h5>⚠️ Error Loading Courses</h5>
              <p>{error}</p>
              <button 
                className='btn btn-outline-danger btn-sm'
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {/* GRID */}
          {!loading && !error && (
            <div className='row g-4'>
              {paginatedCourses.length > 0 ? (
                paginatedCourses.map((c) => <CourseCard key={c.id} course={c} />)
              ) : (
                <div className='text-center py-5'>
                  <h4>No courses found</h4>
                  <p>Try changing filters</p>
                </div>
              )}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <nav className='mt-4'>
              <ul className='pagination justify-content-center'>
                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                  <button
                    className='page-link'
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i ? "active" : ""}`}
                  >
                    <button
                      className='page-link'
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                  <button
                    className='page-link'
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages - 1}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
