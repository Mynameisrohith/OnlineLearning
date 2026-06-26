package com.onlinelearning.learning.serviceimpl;

import com.onlinelearning.learning.dto.QuizDTO;
import com.onlinelearning.learning.entity.Course;
import com.onlinelearning.learning.entity.Quiz;
import com.onlinelearning.learning.repository.CourseRepository;
import com.onlinelearning.learning.repository.QuizRepository;
import com.onlinelearning.learning.service.QuizService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;

    public QuizServiceImpl(QuizRepository quizRepository,
                           CourseRepository courseRepository) {
        this.quizRepository = quizRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public QuizDTO createQuiz(Quiz dto) {

        Course course = courseRepository.findById(dto.getCourse().getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Quiz quiz = new Quiz();
        quiz.setQuestion(dto.getQuestion());
        quiz.setOptionA(dto.getOptionA());
        quiz.setOptionB(dto.getOptionB());
        quiz.setOptionC(dto.getOptionC());
        quiz.setOptionD(dto.getOptionD());
        quiz.setCorrectAnswer(dto.getCorrectAnswer());
        quiz.setCourse(course);

        Quiz savedQuiz = quizRepository.save(quiz);

        return mapToDTO(savedQuiz);
    }



    @Override
    public List<QuizDTO> getQuizByCourse(Long courseId) {

        return quizRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // 🔥 Private Mapper Method
    private QuizDTO mapToDTO(Quiz quiz) {
        return new QuizDTO(
                quiz.getId(),
                quiz.getQuestion(),
                quiz.getOptionA(),
                quiz.getOptionB(),
                quiz.getOptionC(),
                quiz.getOptionD(),
                quiz.getCorrectAnswer(),
                quiz.getCourse().getId()
        );
    }
}