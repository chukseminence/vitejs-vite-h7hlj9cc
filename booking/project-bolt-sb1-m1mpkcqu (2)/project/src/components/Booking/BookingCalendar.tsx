import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, DollarSign, User } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

interface BookingCalendarProps {
  onBookingSelect: (date: Date, timeSlot: TimeSlot) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ onBookingSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    // Generate time slots for the selected date
    generateTimeSlots();
  }, [selectedDate]);

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          id: `${selectedDate.toISOString()}-${time}`,
          time,
          available: Math.random() > 0.3, // Random availability for demo
          price: 75,
        });
      }
    }
    
    setTimeSlots(slots);
  };

  const getWeekDays = () => {
    const weekStart = startOfWeek(new Date());
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Select Date & Time
        </h2>
      </div>

      <div className="p-6">
        {/* Date Selection */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Choose a date</h3>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <motion.button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-3 rounded-lg text-center transition-all duration-200 ${
                  isSameDay(day, selectedDate)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : isToday(day)
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-xs font-medium mb-1">
                  {format(day, 'EEE')}
                </div>
                <div className="text-lg font-bold">
                  {format(day, 'd')}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Available times for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <motion.button
                key={slot.id}
                onClick={() => slot.available && onBookingSelect(selectedDate, slot)}
                disabled={!slot.available}
                className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                  slot.available
                    ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={slot.available ? { scale: 1.02 } : {}}
                whileTap={slot.available ? { scale: 0.98 } : {}}
              >
                <div className="font-medium text-sm mb-1">{slot.time}</div>
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {slot.price}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {timeSlots.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No available slots</h3>
            <p className="text-gray-500">Please select a different date.</p>
          </div>
        )}
      </div>
    </div>
  );
};