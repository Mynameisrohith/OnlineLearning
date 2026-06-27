import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import quizService from "../services/quizService";

export default function QuizPage() {
  const { courseId } = useParams();

  const [selectedCourseId, setSelectedCourseId] = useState(courseId || "");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = async (activeCourseId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizService.getQuizByCourse(activeCourseId);
      const mappedQuestions = data.map((quiz) => ({
        id: quiz.id,
        q: quiz.question,
        options: [quiz.optionA, quiz.optionB, quiz.optionC, quiz.optionD],
        answer: quiz.correctAnswer,
      }));
      setQuestions(mappedQuestions);
      setCurrent(0);
      setScore(0);
      setFinished(false);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      setSelectedCourseId(courseId);
      fetchQuestions(courseId);
    } else {
      setLoading(false);
    }
  }, [courseId]);

  const startCourseQuiz = () => {
    if (!selectedCourseId) {
      setError("Please enter a course ID");
      return;
    }
    fetchQuestions(selectedCourseId);
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setFinished(false);
  };

  const handleAnswer = (option) => {
    if (option === questions[current].answer) {
      setScore(score + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className='container py-4'>
        <h1 className='fw-bold'>Course Quiz</h1>
        <div className='alert alert-info'>Loading quizzes...</div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className='container py-4'>
        <h1 className='fw-bold'>Course Quiz</h1>
        <div className='alert alert-danger mb-3'>Error: {error}</div>
        <div className='card p-3 shadow'>
          <label className='fw-bold mb-2'>Course ID</label>
          <input
            className='form-control mb-2'
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            placeholder='Enter course ID'
          />
          <button className='btn btn-primary' onClick={startCourseQuiz}>
            Load Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!courseId && questions.length === 0) {
    return (
      <div className='container py-4'>
        <h1 className='fw-bold'>Course Quiz</h1>
        <div className='card p-3 shadow mt-3'>
          <label className='fw-bold mb-2'>Course ID</label>
          <input
            className='form-control mb-2'
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            placeholder='Enter course ID'
          />
          <button className='btn btn-primary' onClick={startCourseQuiz}>
            Load Quiz
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className='container py-4'>
        <h1 className='fw-bold'>Course Quiz</h1>
        <div className='alert alert-info'>No quiz questions available for this course.</div>
      </div>
    );
  }

  return (
    <div className='container py-4'>
      <h1 className='fw-bold'>Course Quiz</h1>

      {!finished ? (
        <div className='card p-4 shadow mt-3'>
          <h4>
            Question {current + 1}/{questions.length}
          </h4>
          <p className='fw-bold'>{questions[current].q}</p>

          {questions[current].options.map((o, i) => (
            <button
              key={i}
              className='btn btn-outline-primary w-100 my-2'
              onClick={() => handleAnswer(o)}
            >
              {o}
            </button>
          ))}
        </div>
      ) : (
        <div className='card p-4 shadow mt-3 text-center'>
          <h2>Quiz Completed 🎉</h2>
          <h3>
            Score: {score}/{questions.length}
          </h3>
          <p>{score >= questions.length / 2 ? "You Passed ✅" : "You Failed ❌"}</p>
          <button
            className='btn btn-primary mt-3'
            onClick={handleRestart}
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
}
