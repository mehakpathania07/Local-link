import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  Clock,
  Briefcase,
  User,
  AlertCircle,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { AppNotification, UserRole } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  userRole: UserRole;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  userRole,
  onMarkAllRead,
  onClearAll,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const relevantNotifications = notifications.filter(
    (n) => n.recipientRole === userRole
  );

  const unreadCount = relevantNotifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#29242A]/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#EFE4DC] animate-in slide-in-from-right duration-200">
        
        {/* Top Bar */}
        <div className="p-5 sm:p-6 bg-[#FFF9F3] border-b border-[#EFE4DC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#EEE7F4] text-[#493548] flex items-center justify-center relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5A824] absolute top-1 right-1 border-2 border-white" />
              )}
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-[#29242A]">
                Notifications
              </h2>
              <p className="text-xs text-[#766D75]">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#766D75] hover:text-[#29242A] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action bar */}
        {relevantNotifications.length > 0 && (
          <div className="px-5 py-2.5 bg-white border-b border-[#F6F0FA] flex items-center justify-between text-xs">
            <button
              onClick={onMarkAllRead}
              className="text-[#493548] font-bold hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
            <button
              onClick={onClearAll}
              className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {relevantNotifications.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#EEE7F4] text-[#493548] flex items-center justify-center mx-auto opacity-70">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-sm text-[#29242A]">
                No notifications yet
              </h4>
              <p className="text-xs text-[#766D75] max-w-xs mx-auto">
                Updates on service requests, provider responses, and confirmations will appear here.
              </p>
            </div>
          ) : (
            relevantNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onSelectNotification(notif);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  notif.read
                    ? 'bg-white border-[#EFE4DC]/80 hover:bg-[#FFF9F3]'
                    : 'bg-[#FFF9F3] border-[#493548]/30 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-xs text-[#29242A] flex items-center gap-1.5">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#493548] shrink-0" />
                    )}
                    <span>{notif.title}</span>
                  </h4>
                  <span className="text-[10px] text-[#766D75] whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>
                <p className="text-xs text-[#493548] leading-relaxed">
                  {notif.message}
                </p>
                <div className="flex items-center justify-end text-[11px] font-bold text-[#493548] gap-1 pt-0.5">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
