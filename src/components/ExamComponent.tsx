import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Question } from '@/data/mockData';
import { ExamModal } from '@/components/ExamModal';
import { useExam, formatExamTime } from '@/hooks/useExam';

interface ExamComponentProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  questions: Question[];
  onComplete?: (score: number) => void;
}

export const ExamComponent = ({
  courseId,
  lessonId,
  lessonTitle,
  questions,
  onComplete,
}: ExamComponentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('0s');

  const { session, saveAnswer, submitExam } = useExam(courseId, lessonId);

  // Actualizar tiempo transcurrido
  useEffect(() => {
    if (!session || session.completed) return;
    
    const interval = setInterval(() => {
      setElapsedTime(formatExamTime(session.startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: answer,
    }));

    const points = answer === 'correct' 
      ? questions[currentQuestion].points.correct
      : answer === 'partial'
      ? questions[currentQuestion].points.partial
      : questions[currentQuestion].points.failed;

    saveAnswer(questions[currentQuestion].id, answer, points);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const totalPoints = questions.reduce(
      (sum, q) => sum + Math.max(q.points.correct, q.points.partial),
      0
    );
    const completedSession = submitExam(totalPoints);
    if (completedSession) {
      setShowResults(true);
      onComplete?.(completedSession.score || 0);
    }
  };

  if (!session) {
    return null;
  }

  const isAnswered = !!selectedAnswers[questions[currentQuestion].id];
  const totalPoints = questions.reduce(
    (sum, q) => sum + Math.max(q.points.correct, q.points.partial),
    0
  );

  if (showResults && session.completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
            (session.score || 0) >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {(session.score || 0) >= 70 ? (
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {(session.score || 0) >= 70 ? '¡Aprobado!' : 'No aprobado'}
            </h2>
            <p className="text-4xl font-bold text-accent mb-2">{session.score}%</p>
            <p className="text-muted-foreground">
              {(session.score || 0) >= 70
                ? 'Excelente desempeño en el examen.'
                : 'Intenta nuevamente para mejorar tu puntuación.'}
            </p>
          </div>

          <div className="pt-4 space-y-2">
            <Button 
              className="w-full"
              onClick={() => window.location.href = `/cursos/${courseId}`}
            >
              Volver al curso
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Examen: {lessonTitle}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Pregunta {currentQuestion + 1} de {questions.length}
          </span>
          {/* <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={16} />
            <span>Tiempo: {elapsedTime}</span>
          </div> */}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          layoutId="progress"
          className="h-2 bg-accent rounded-full transition-all"
          style={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          <Card className="p-6 border-2 border-border">
            <p className="text-lg font-semibold text-foreground">
              {questions[currentQuestion].text}
            </p>

            <div className="mt-6 space-y-3">
              {['correct', 'partial', 'failed'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${
                    selectedAnswers[questions[currentQuestion].id] === option
                      ? 'border-accent bg-accent/10 text-foreground'
                      : 'border-border bg-card hover:border-accent/50 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize">
                      {option === 'correct' ? 'Correcta' : option === 'partial' ? 'Parcial' : 'Incorrecta'}
                    </span>
                    {selectedAnswers[questions[currentQuestion].id] === option && (
                      <CheckCircle2 size={20} className="text-accent" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="flex-1"
        >
          Anterior
        </Button>

        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={Object.keys(selectedAnswers).length !== questions.length}
            className="flex-1 bg-accent hover:bg-accent/90"
          >
            Finalizar Examen
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex-1"
          >
            Siguiente
          </Button>
        )}
      </div>

      {/* Confirmation Modal */}
      <ExamModal
        isOpen={showConfirm}
        onConfirm={handleSubmit}
        onCancel={() => setShowConfirm(false)}
        totalQuestions={questions.length}
        answeredQuestions={Object.keys(selectedAnswers).length}
        score={selectedAnswers}
      />
    </div>
  );
};
