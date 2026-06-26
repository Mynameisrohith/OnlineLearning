package com.onlinelearning.learning.service;
import com.onlinelearning.learning.dto.QuizDTO;
import com.onlinelearning.learning.entity.Quiz;

import java.util.List;

public interface QuizService {

    QuizDTO createQuiz(Quiz quizDTO);

    List<QuizDTO> getQuizByCourse(Long courseId);
}