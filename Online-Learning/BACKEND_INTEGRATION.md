# Backend Integration Guide

## Overview
The frontend has been configured to fetch data directly from the Spring Boot backend API.

## Backend API Endpoints

Based on your Spring Boot service, the following endpoints are expected:

### Course Endpoints
- `GET /api/courses` - Get all courses with filters, pagination, and sorting
- `GET /api/courses/{id}` - Get a single course by ID
- `POST /api/courses` - Create a new course
- `PUT /api/courses/{id}` - Update a course
- `DELETE /api/courses/{id}` - Delete a course

## Configuration

### 1. Environment Variables
The `.env` file contains the API base URL:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2. Vite Proxy Configuration
The `vite.config.js` has been configured with a proxy to handle CORS during development:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

## API Service Layer

### Files Created:
1. **`src/services/api.js`** - Base API client with fetch wrapper
2. **`src/services/courseService.js`** - Course-specific API functions

### Usage Example:
```javascript
import courseService from '../services/courseService';

// Get all courses with filters
const courses = await courseService.getAllCourses({
  search: 'React',
  category: 'Web Development',
  level: 'Beginner',
  maxPrice: 2000,
  page: 0,
  size: 6,
  sort: 'price'
});

// Get single course
const course = await courseService.getCourseById(1);
```

## Updated Components

### 1. Courses.jsx
- ✅ Fetches courses from backend API
- ✅ Implements filtering (search, category, level, price)
- ✅ Implements pagination (0-indexed for Spring Boot)
- ✅ Implements sorting
- ✅ Shows loading and error states
- ✅ Handles API errors gracefully

### 2. CourseDetail.jsx
- ✅ Fetches course details by ID from URL params
- ✅ Shows loading state
- ✅ Shows error state with retry option
- ✅ Displays dynamic course data (title, description, price, etc.)

## Backend Requirements

### Expected Response Formats:

#### 1. Get All Courses (Paginated)
```json
{
  "content": [
    {
      "id": 1,
      "title": "Course Title",
      "description": "Course description",
      "instructor": "Instructor Name",
      "price": 999.0,
      "oldPrice": 1999.0,
      "rating": 4.8,
      "reviews": 2300,
      "category": "Web Development",
      "level": "Beginner",
      "image": "image-url"
    }
  ],
  "totalPages": 5,
  "totalElements": 30,
  "size": 6,
  "number": 0
}
```

#### 2. Get Course by ID
```json
[
  {
    "id": 1,
    "title": "Course Title",
    "description": "Course description",
    "instructor": "Instructor Name",
    "price": 999.0,
    "oldPrice": 1999.0,
    "rating": 4.8,
    "reviews": 2300,
    "category": "Web Development",
    "level": "Beginner",
    "image": "image-url"
  }
]
```
Note: Backend returns array, frontend extracts first element.

## Backend Controller Example

You'll need to create a REST controller in your Spring Boot application:

```java
@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173") // Vite default port
public class CourseController {
    
    @Autowired
    private courseService courseService;
    
    @GetMapping
    public ResponseEntity<Page<CourseDto>> getAllCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "id") String sort) {
        
        Page<CourseDto> courses = courseService.getAllCourses(
            search, category, level, maxPrice, page, size, sort
        );
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<List<CourseDto>> getCourseById(@PathVariable Integer id) {
        List<CourseDto> course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }
    
    @PostMapping
    public ResponseEntity<CourseDto> createCourse(@RequestBody Course course) {
        CourseDto created = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<List<CourseDto>> updateCourse(
            @PathVariable Integer id, 
            @RequestBody CourseDto dto) {
        List<CourseDto> updated = courseService.updateCourse(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<List<CourseDto>> deleteCourse(@PathVariable Integer id) {
        List<CourseDto> deleted = courseService.deleteCourse(id);
        return ResponseEntity.ok(deleted);
    }
}
```

## Running the Application

### 1. Start the Backend
```bash
# In your Spring Boot project directory
./mvnw spring-boot:run
# or
gradle bootRun
```
The backend should run on `http://localhost:8080`

### 2. Start the Frontend
```bash
# In your React project directory
npm run dev
```
The frontend will run on `http://localhost:5173`

## Testing the Integration

1. Open your browser and navigate to `http://localhost:5173`
2. Go to the Courses page
3. You should see courses fetched from your backend
4. Try filtering by category, level, price range
5. Try searching for courses
6. Click on a course to view details

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Add `@CrossOrigin` annotation to your Spring Boot controller
2. Or configure CORS globally in Spring Boot:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

### Backend Not Responding
1. Ensure Spring Boot application is running on port 8080
2. Check backend logs for errors
3. Test endpoints with Postman or curl

### Data Not Showing
1. Check browser console for errors
2. Verify API_BASE_URL in `.env` file
3. Check network tab in browser DevTools
4. Ensure backend has data in the database

## Next Steps

1. **Admin Panel**: Update AdminPanel.jsx to use API for CRUD operations
2. **Authentication**: Add JWT authentication for protected routes
3. **Enrollment**: Create enrollment endpoints and integrate
4. **Error Handling**: Implement global error boundary
5. **Loading States**: Add skeleton loaders for better UX
