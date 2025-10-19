import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification as NotificationType } from '@/contexts/NotificationContext';

interface NotificationProps {
  notification: NotificationType;
  onClose: () => void;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    gradient: 'from-green-500 via-green-600 to-green-700',
    borderColor: 'border-green-300/50',
  },
  error: {
    icon: AlertCircle,
    gradient: 'from-red-500 via-red-600 to-red-700',
    borderColor: 'border-red-300/50',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'from-yellow-500 via-yellow-600 to-yellow-700',
    borderColor: 'border-yellow-300/50',
  },
  info: {
    icon: Info,
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
    borderColor: 'border-blue-300/50',
  },
};

export const Notification = ({ notification, onClose }: NotificationProps) => {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <div
      className={`
        relative flex items-start gap-3 min-w-[320px] max-w-[420px]
        bg-gradient-to-br ${config.gradient}
        border-2 ${config.borderColor}
        rounded-3xl p-4 pr-10
        shadow-elegant backdrop-blur-sm
        animate-in slide-in-from-top-5 duration-300
      `}
    >
      <Icon className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-lg font-black text-white text-stroke-dark mb-1">
          {notification.title}
        </h4>
        <p className="text-sm font-bold text-white/90">
          {notification.message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
