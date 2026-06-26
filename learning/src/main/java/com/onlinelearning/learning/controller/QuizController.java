package com.onlinelearning.learning.controller;

import com.onlinelearning.learning.dto.QuizDTO;
import com.onlinelearning.learning.entity.Quiz;
import com.onlinelearning.learning.service.QuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // Create Quiz
    @PostMapping
    public QuizDTO createQuiz(@RequestBody Quiz quiz) {
        return quizService.createQuiz(quiz);
    }

    // Get Quiz by Course
    @GetMapping("/course/{courseId}")
    public List<QuizDTO> getQuizByCourse(@PathVariable Long courseId) {
        return quizService.getQuizByCourse(courseId);
    }
}