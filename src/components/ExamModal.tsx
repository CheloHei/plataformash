import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ExamModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  totalQuestions: number;
  answeredQuestions: number;
  score: Record<string, string>;
}

export const ExamModal = ({
  isOpen,
  onConfirm,
  onCancel,
  totalQuestions,
  answeredQuestions,
}: ExamModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Card className="w-full max-w-md p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              ¿Finalizar examen?
            </h2>
            <p className="text-muted-foreground">
              Has respondido {answeredQuestions} de {totalQuestions} preguntas.
            </p>
          </div>

          {/* Answered Summary */}
          {answeredQuestions < totalQuestions && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-sm text-yellow-700 font-medium">
                ⚠️ Aún hay {totalQuestions - answeredQuestions} pregunta(s) sin responder.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Continuar respondiendo
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-accent hover:bg-accent/90"
            >
              Sí, finalizar
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
