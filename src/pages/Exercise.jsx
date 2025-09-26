import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { HiDocumentCheck } from "react-icons/hi2";

const Exercise = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); 
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/lessons/${id}/exercises`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleChoiceChange = (event, questionId) => {
    setAnswers((prevAnswers) => {
      const answersArray = Array.isArray(prevAnswers) ? prevAnswers : [];
      const index = answersArray.findIndex((item) => item.id === questionId);

      if (index !== -1) {
        // ✅ อัปเดตคำตอบเดิม
        const updatedAnswers = [...answersArray];
        updatedAnswers[index] = { id: questionId, answer: event.target.value };
        return updatedAnswers;
      } else {
        // ✅ เพิ่มคำตอบใหม่
        return [
          ...answersArray,
          { id: questionId, answer: event.target.value },
        ];
      }
    });
  };

  const checkAnswer = (question) => {
    const answerObj = answers.find((item) => item.id === question._id);
    return answerObj ? answerObj.answer === question.correctAnswer : false;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let calculatedScore = 0;

    questions.forEach((question) => {
      if (checkAnswer(question)) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    saveScore(calculatedScore);
  };

  const saveScore = async (calculatedScore) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/exercises/${id}/score`,
        { score: calculatedScore, answers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]); // ✅ เคลียร์เป็น array
    setSubmitted(false);
    setScore(0);
  };

  const allQuestionsAnswered = questions.every((question) =>
    answers.some((item) => item.id === question._id)
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4 text-purple-600">แบบฝึกหัด</h1>
        <button
          className={`btn bg-purple-600 text-white`}
          onClick={handleSubmit}
          disabled={submitted || !allQuestionsAnswered}
        >
          ส่งคำตอบ
        </button>
      </div>

      {!submitted && (
        <div className="mb-12 mt-4 p-2 rounded-lg overflow-hidden">
          <div className="overflow-x-auto flex gap-2 items-center px-2">
            <span className="text-gray-600">ข้อ</span>
            {questions.map((_, index) => {
              const isAnswered = answers.find(
                (item) => item.id === questions[index]._id
              );

              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`${
                    currentQuestionIndex === index
                      ? "bg-purple-600 border border-purple-600 text-white"
                      : isAnswered
                      ? "bg-green-300 text-white"
                      : "bg-white text-black"
                  } w-8 h-8 rounded-md transition duration-200 ease-in-out border hover:bg-purple-600 hover:text-white`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div>
            <div className="my-4 p-4 rounded-lg bg-gray-200">
              <p className="font-bold">
                {questions[currentQuestionIndex]?.question}
              </p>
            </div>

            {questions[currentQuestionIndex]?.type === "multiple-choice" && (
              <div className="space-y-4 px-6">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <label
                      key={index}
                      className={`p-10 rounded-md w-full text-left cursor-pointer transition duration-200 ease-in-out flex items-center ${
                        answers.find(
                          (item) =>
                            item.id === questions[currentQuestionIndex]._id &&
                            item.answer === option
                        )
                          ? "bg-purple-200"
                          : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questions[currentQuestionIndex]._id}`}
                        value={option}
                        checked={
                          answers.find(
                            (item) =>
                              item.id === questions[currentQuestionIndex]._id
                          )?.answer === option
                        }
                        onChange={(e) =>
                          handleChoiceChange(
                            e,
                            questions[currentQuestionIndex]._id
                          )
                        }
                        className="mr-3 radio checked:bg-purple-600"
                      />
                      {option}
                    </label>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {submitted && (
        <div className="p-6">
          <div className="flex flex-col items-center ">
            <HiDocumentCheck size={64} className="text-purple-600" />
            <p className="text-lg font-semibold text-gray-800">
              คุณได้ทำแบบฝึกหัดหลังเรียนแล้ว
            </p>
          </div>
          <div className=" max-w-[300px] mx-auto">
            <div className="flex justify-between mt-4">
              <p>ผลคะแนน</p>{" "}
              <p>
                {score} / {questions.length}
              </p>
            </div>

            <div className="flex justify-between mt-4">
              <p>ผลการทดสอบ</p>
              {score / questions.length > 0.6 ? (
                <p className="font-semibold text-green-600 mt-2">
                  ✅ ผ่าน! ยินดีด้วย 🎉
                </p>
              ) : (
                <p className="font-semibold text-red-600 mt-2">
                  ❌ ไม่ผ่าน ลองใหม่อีกครั้ง!
                </p>
              )}
            </div>
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={resetQuiz}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                ทำอีกครั้ง
              </button>
              <Link
                to="/"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                เสร็จสิ้น
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercise;
