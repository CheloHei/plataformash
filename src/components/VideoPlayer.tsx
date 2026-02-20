import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  isOpen: boolean;
  videoUrl?: string;
  lessonTitle: string;
  onClose: () => void;
}

export const VideoPlayer = ({
  isOpen,
  videoUrl,
  lessonTitle,
  onClose,
}: VideoPlayerProps) => {
  if (!isOpen || !videoUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-card rounded-t-lg p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{lessonTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Container */}
        <div className="bg-black rounded-b-lg overflow-hidden">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title={lessonTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
