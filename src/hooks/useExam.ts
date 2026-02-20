import { useState, useEffect } from 'react';

export interface Answer {
  questionId: string;
  selectedAnswer: string;
  points: number;
}

export interface ExamSession {
  lessonId: string;
  courseId: string;
  answers: Answer[];
  startTime: number;
  endTime: number | null;
  completed: boolean;
  score: number | null;
}

const STORAGE_KEY = 'exam_sessions';

export const useExam = (courseId: string, lessonId: string) => {
  const [session, setSession] = useState<ExamSession | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Cargar sesión existente o crear nueva
  useEffect(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${courseId}_${lessonId}`);
    if (saved) {
      const parsedSession = JSON.parse(saved);
      setSession(parsedSession);
      setAnswers(parsedSession.answers);
    } else {
      const newSession: ExamSession = {
        courseId,
        lessonId,
        answers: [],
        startTime: Date.now(),
        endTime: null,
        completed: false,
        score: null,
      };
      setSession(newSession);
    }
  }, [courseId, lessonId]);

  // Guardar respuesta
  const saveAnswer = (questionId: string, selectedAnswer: string, points: number) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      let updated: Answer[];

      if (existing > -1) {
        updated = [...prev];
        updated[existing] = { questionId, selectedAnswer, points };
      } else {
        updated = [...prev, { questionId, selectedAnswer, points }];
      }

      // Guardar en localStorage
      if (session) {
        const updatedSession = { ...session, answers: updated };
        localStorage.setItem(
          `${STORAGE_KEY}_${courseId}_${lessonId}`,
          JSON.stringify(updatedSession)
        );
        setSession(updatedSession);
      }

      return updated;
    });
  };

  // Finalizar examen
  const submitExam = (totalPoints: number) => {
    if (!session) return;

    const totalAnswers = answers.reduce((sum, a) => sum + a.points, 0);
    const score = Math.round((totalAnswers / totalPoints) * 100);

    const completedSession: ExamSession = {
      ...session,
      answers,
      endTime: Date.now(),
      completed: true,
      score,
    };

    setSession(completedSession);
    localStorage.setItem(
      `${STORAGE_KEY}_${courseId}_${lessonId}`,
      JSON.stringify(completedSession)
    );

    return completedSession;
  };

  // Limpiar sesión
  const clearSession = () => {
    localStorage.removeItem(`${STORAGE_KEY}_${courseId}_${lessonId}`);
    setSession(null);
    setAnswers([]);
  };

  return {
    session,
    answers,
    saveAnswer,
    submitExam,
    clearSession,
  };
};

// Función auxiliar para obtener resultado de un examen
export const getExamScore = (courseId: string, lessonId: string): number | null => {
  const saved = localStorage.getItem(`exam_sessions_${courseId}_${lessonId}`);
  if (saved) {
    const session = JSON.parse(saved) as ExamSession;
    return session.completed ? session.score : null;
  }
  return null;
};

// Función para obtener tiempo en formato legible
export const formatExamTime = (startTime: number): string => {
  const now = Date.now();
  const diffMs = now - startTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  
  if (diffMins > 0) {
    return `${diffMins}m ${diffSecs}s`;
  }
  return `${diffSecs}s`;
};

// Función para verificar si un módulo está completado al 100%
export const isModuleComplete = (courseId: string, lessons: Array<{ id: string; questions?: any[] }> | undefined): boolean => {
  if (!lessons || lessons.length === 0) return false;
  
  // Verificar que todas las lecciones con examen tengan puntuación del 100%
  const lessonsWithExams = lessons.filter((l) => l.questions && l.questions.length > 0);
  
  if (lessonsWithExams.length === 0) return true; // Si no hay exámenes, consideramos el módulo completado
  
  return lessonsWithExams.every((lesson) => {
    const score = getExamScore(courseId, lesson.id);
    return score === 100;
  });
};

// Función para obtener el progreso real de un curso
export const getCourseProgress = (courseId: string, lessons: Array<{ id: string; questions?: any[] }> | undefined): number => {
  if (!lessons || lessons.length === 0) return 0;
  
  const lessonsWithExams = lessons.filter((l) => l.questions && l.questions.length > 0);
  
  if (lessonsWithExams.length === 0) return 0;
  
  const totalScore = lessonsWithExams.reduce((sum, lesson) => {
    const score = getExamScore(courseId, lesson.id);
    return sum + (score || 0);
  }, 0);
  
  return Math.round(totalScore / lessonsWithExams.length);
};
