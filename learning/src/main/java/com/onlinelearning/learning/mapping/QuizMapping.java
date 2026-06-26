package com.onlinelearning.learning.mapping;

import com.onlinelearning.learning.dto.QuizDTO;
import com.onlinelearning.learning.entity.Course;
import com.onlinelearning.learning.entity.Quiz;

public class QuizMapping {

    // ENTITY → DTO
    public static QuizDTO mapToDto(Quiz quiz) {

        if (quiz == null) {
            return null;
        }

        QuizDTO dto = new QuizDTO();

        dto.setId(quiz.getId());
        dto.setQuestion(quiz.getQuestion());
        dto.setOptionA(quiz.getOptionA());
        dto.setOptionB(quiz.getOptionB());
        dto.setOptionC(quiz.getOptionC());
        dto.setOptionD(quiz.getOptionD());
        dto.setCorrectAnswer(quiz.getCorrectAnswer());

        if (quiz.getCourse() != null) {
            dto.setCourseId(quiz.getCourse().getId());
        }

        return dto;
    }

    // DTO → ENTITY
    public static Quiz mapToEntity(QuizDTO dto, Course course) {

        if (dto == null) {
            return null;
        }

        Quiz quiz = new Quiz();

        // Only set ID if updating
        quiz.setId(dto.getId());

        quiz.setQuestion(dto.getQuestion());
        quiz.setOptionA(dto.getOptionA());
        quiz.setOptionB(dto.getOptionB());
        quiz.setOptionC(dto.getOptionC());
        quiz.setOptionD(dto.getOptionD());
        quiz.setCorrectAnswer(dto.getCorrectAnswer());

        quiz.setCourse(course);

        return quiz;
    }
}