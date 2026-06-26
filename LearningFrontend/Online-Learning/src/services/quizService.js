// Quiz Service - API calls for quiz-related operations
import api from './api';

const quizService = {
  /**
   * Create a new quiz
   * @param {Object} quizData - Quiz data
   * @param {string} quizData.question - Quiz question
   * @param {string} quizData.optionA - Option A
   * @param {string} quizData.optionB - Option B
   * @param {string} quizData.optionC - Option C
   * @param {string} quizData.optionD - Option D
   * @param {string} quizData.correctAnswer - Correct answer (A/B/C/D or exact option)
   * @param {number} quizData.courseId - Course ID
   * @returns {Promise} - Created quiz data
   */
  createQuiz: async (quizData) => {
    try {
      const payload = {
        question: quizData.question,
        optionA: quizData.optionA,
        optionB: quizData.optionB,
        optionC: quizData.optionC,
        optionD: quizData.optionD,
        correctAnswer: quizData.correctAnswer,
        course: {
          id: Number(quizData.courseId),
        },
      };
      const response = await api.post('/quizzes', payload);
      return {
        id: response.id,
        question: response.question,
        optionA: response.optionA,
        optionB: response.optionB,
        optionC: response.optionC,
        optionD: response.optionD,
        correctAnswer: response.correctAnswer,
        courseId: response.courseId,
      };
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  /**
   * Get quizzes by course
   * @param {number} courseId - Course ID
   * @returns {Promise} - List of quizzes for the course
   */
  getQuizByCourse: async (courseId) => {
    try {
      const response = await api.get(`/quizzes/course/${courseId}`);
      const quizzes = Array.isArray(response) ? response : [];
      return quizzes.map((quiz) => ({
        id: quiz.id,
        question: quiz.question,
        optionA: quiz.optionA,
        optionB: quiz.optionB,
        optionC: quiz.optionC,
        optionD: quiz.optionD,
        correctAnswer: quiz.correctAnswer,
        courseId: quiz.courseId,
      }));
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },
};

export default quizService;
