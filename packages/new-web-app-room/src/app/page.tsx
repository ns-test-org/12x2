'use client';

import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
}

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
  };

  const formatDate = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(day);
    setSelectedDate(dateStr);
    setShowEventForm(true);
  };

  const addEvent = () => {
    if (eventTitle.trim() && selectedDate) {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventTitle.trim(),
        date: selectedDate
      };
      setEvents([...events, newEvent]);
      setEventTitle('');
      setShowEventForm(false);
      setSelectedDate(null);
    }
  };

  const getEventsForDate = (day: number) => {
    const dateStr = formatDate(day);
    return events.filter(event => event.date === dateStr);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                ← Previous
              </button>
              <h2 className="text-xl font-semibold text-gray-700 min-w-[200px] text-center">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-100 rounded">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-24 bg-gray-50 rounded"></div>;
              }

              const dayEvents = getEventsForDate(day);
              const isToday = today.getDate() === day && 
                            today.getMonth() === currentMonth && 
                            today.getFullYear() === currentYear;

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`h-24 p-2 border rounded cursor-pointer hover:bg-blue-50 transition-colors ${
                    isToday ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded truncate"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvent(event.id);
                        }}
                        title={`${event.title} (click to delete)`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Event form modal */}
          {showEventForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">
                  Add Event for {selectedDate}
                </h3>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Enter event title..."
                  className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={addEvent}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Add Event
                  </button>
                  <button
                    onClick={() => {
                      setShowEventForm(false);
                      setEventTitle('');
                      setSelectedDate(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Events list */}
          {events.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Upcoming Events</h3>
              <div className="space-y-2">
                {events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                    >
                      <div>
                        <div className="font-medium text-gray-800">{event.title}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

