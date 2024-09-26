'use client'

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { View, ToolbarProps } from 'react-big-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

async function getCampusDetails(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:1337/api/buildings/${id}`, {
      headers: {
        'Authorization': 'Bearer c410e18811d6b3920585b0d8a0f2b06303e50a20dd32be15cb6dca4fb1cdeb820b72dbaaacbc140c94a57946612509a974bc79c37293dd81602cea05503b56f6d2fd094c6f566f3eecb905bdc9eb3c440bb8f2eed42682f3a93852046277647cdd2c5a971a24eb1fc8d094e73d150989a3740c2968c95eaf456c024bfc1e5fdc'
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();

    console.log("getCampusDetails", data)

    return data;
  } catch (error) {
    console.error('Failed to fetch campus details:', error);
    return null;
  }
}

interface Campus {
  id: number;
  location: string;
  name: string;
  url: string;
}

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  color?: string;
  room?: string;
}

const eventColors = ['#3174ad', '#32a852', '#a83232', '#a86f32', '#7132a8'];

interface BookingForm {
  name: string;
  room: string;
  app_user: string;
}

interface Availability {
  id: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  room: {
    id: number;
    name: string;
  };
}

interface AvailableRoom {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

const CustomToolbar = (props: ToolbarProps) => {
  const { label } = props;
  return (
    <div className="rbc-toolbar">
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        {props.views.map(name => (
          <button
            type="button"
            key={name}
            className={`rbc-btn ${props.view === name ? 'rbc-active' : ''}`}
            onClick={() => props.onView(name)}
          >
            {name}
          </button>
        ))}
      </span>
    </div>
  );
};

export default function ClientCampusPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [campusDetails, setCampusDetails] = useState<Campus | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState(Views.WEEK);
  const [showModal, setShowModal] = useState(false);
  const [newBooking, setNewBooking] = useState<Event | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: '',
    room: '',
    app_user: '',
  });
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<AvailableRoom[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [connectedUser, setConnectedUser] = useState<User>({ id: 63, name: "Jane Smith" });
  const [bookings, setBookings] = useState<Event[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      console.log("auth", auth);
      setIsAuthenticated(auth);

      if (!auth) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      getCampusDetails(params.id).then(setCampusDetails);
      fetchAvailabilities();
      fetchBookings();
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      handleResize(); // Set initial state
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isLoading, isAuthenticated, params.id]);

  const fetchAvailabilities = async () => {
    try {
      const startDate = moment().startOf('week').format('YYYY-MM-DD');
      const endDate = moment().endOf('week').format('YYYY-MM-DD');
      const res = await fetch(`http://127.0.0.1:1337/api/availabilities?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': 'Bearer c410e18811d6b3920585b0d8a0f2b06303e50a20dd32be15cb6dca4fb1cdeb820b72dbaaacbc140c94a57946612509a974bc79c37293dd81602cea05503b56f6d2fd094c6f566f3eecb905bdc9eb3c440bb8f2eed42682f3a93852046277647cdd2c5a971a24eb1fc8d094e73d150989a3740c2968c95eaf456c024bfc1e5fdc'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch availabilities');
      const data = await res.json();
      console.log("fetchAvailabilities", data)
      setAvailabilities(data);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:1337/api/bookings?filters[app_user][id][$eq]=${connectedUser.id}`, {
        headers: {
          'Authorization': 'Bearer c410e18811d6b3920585b0d8a0f2b06303e50a20dd32be15cb6dca4fb1cdeb820b72dbaaacbc140c94a57946612509a974bc79c37293dd81602cea05503b56f6d2fd094c6f566f3eecb905bdc9eb3c440bb8f2eed42682f3a93852046277647cdd2c5a971a24eb1fc8d094e73d150989a3740c2968c95eaf456c024bfc1e5fdc'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      console.log("fetchBookings", data);
      
      const formattedBookings = data.data.map((booking: any) => ({
        id: booking.id,
        title: booking.name || 'Untitled Booking',
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
        color: eventColors[Math.floor(Math.random() * eventColors.length)],
        room: booking.room?.name || 'Unknown Room'
      }));
      
      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleSelectSlot = useCallback(
    ({ start }) => {
      const hour = start.getHours();
      const formattedDate = moment(start).format('YYYY-MM-DD');
      console.log('Selecting slot:', formattedDate, hour);
      
      setSelectedDate(start);
      setSelectedHour(hour);
      setSelectedSlot(start);
      setSelectedTime(moment(start).format('MMMM D, YYYY HH:mm'));

      const selectedAvailabilities = availabilities.filter(a => 
        moment(a.startTime).format('YYYY-MM-DD') === formattedDate &&
        moment(a.startTime).hour() === hour &&
        !a.isBooked
      );

      console.log('Availabilities for selected hour:', selectedAvailabilities);

      setSelectedRooms(selectedAvailabilities.map(a => ({
        id: a.room.id,
        name: a.room.name
      })));

      setShowAvailableRooms(true);
    },
    [availabilities]
  );

  const handleBookRoom = async (roomId: number, roomName: string) => {
    setBookingForm(prev => ({ ...prev, room: roomId.toString() }));
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedHour && bookingForm.room) {
      try {
        const startTime = moment(selectedDate).hour(selectedHour).toISOString();
        const endTime = moment(selectedDate).hour(selectedHour + 1).toISOString();

        const response = await fetch('http://localhost:1337/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer c410e18811d6b3920585b0d8a0f2b06303e50a20dd32be15cb6dca4fb1cdeb820b72dbaaacbc140c94a57946612509a974bc79c37293dd81602cea05503b56f6d2fd094c6f566f3eecb905bdc9eb3c440bb8f2eed42682f3a93852046277647cdd2c5a971a24eb1fc8d094e73d150989a3740c2968c95eaf456c024bfc1e5fdc',
          },
          body: JSON.stringify({
            data: {
              name: bookingForm.name,
              room: parseInt(bookingForm.room),
              app_user: connectedUser.id,
              startTime: startTime,
              endTime: endTime,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to create booking: ${JSON.stringify(errorData)}`);
        }

        const createdBooking = await response.json();
        console.log('Booking created successfully:', createdBooking);

        setBookings(prev => [...prev, {
          id: createdBooking.data.id,
          title: bookingForm.name,
          start: new Date(startTime),
          end: new Date(endTime),
          color: eventColors[Math.floor(Math.random() * eventColors.length)],
          room: selectedRooms.find(r => r.id.toString() === bookingForm.room)?.name,
        }]);

        setSelectedRooms(prev => prev.filter(room => room.id.toString() !== bookingForm.room));

        setShowModal(false);
        setBookingForm({ name: '', room: '', app_user: '' });
        
        await fetchAvailabilities();
        await fetchBookings();
        
      } catch (error) {
        console.error('Error creating booking:', error);
        alert(`Failed to create booking: ${error.message}`);
      }
    }
  };

  const handleSelectEvent = useCallback(
    (event: Event) => {
      setSelectedEvent(event);
      setShowEventModal(true);
    },
    []
  );

  const onEventResize = useCallback(
    ({ event, start, end }) => {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
      );
    },
    []
  );

  const onEventDrop = useCallback(
    ({ event, start, end }) => {
      setNewBooking({ ...event, start, end });
      setShowModal(true);
    },
    []
  );

  const eventPropGetter = useCallback(
    (event: Event) => {
      const colors = ['#935b9e', '#8fbe54', '#36b6d4', '#facf53', '#d94759', '#4b4b99', '#e4803e'];
      const colorIndex = event.id % colors.length;
      return {
        style: {
          backgroundColor: colors[colorIndex],
          borderRadius: '4px',
          opacity: 0.8,
          color: 'white',
          border: 'none',
          display: 'block',
          fontWeight: '500',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
        }
      };
    },
    []
  );

  const slotPropGetter = useCallback(
    (date: Date) => {
      const hour = date.getHours();
      const availability = availabilities.find(a => 
        moment(a.startTime).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD') &&
        moment(a.startTime).hour() === hour &&
        !a.isBooked
      );
      
      return {
        style: {
          backgroundColor: availability ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
          border: availability ? '1px solid green' : '1px solid red',
        },
        className: 'custom-time-slot',
      };
    },
    [availabilities]
  );

  const AvailableRoomsSection = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-4 border-t-4 border-purple-600">
      <h3 className="text-xl font-bold mb-3 text-purple-700">Available Rooms</h3>
      <p className="mb-4 text-gray-600">{selectedTime || "No time selected"}</p>
      {showAvailableRooms ? (
        selectedRooms.length > 0 ? (
          <ul className="space-y-3">
            {selectedRooms.map(room => (
              <li key={room.id} className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                <span className="text-purple-800 font-medium">{room.name}</span>
                <button
                  onClick={() => handleBookRoom(room.id, room.name)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Book Now
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 italic">No rooms available for this time slot.</p>
        )
      ) : (
        <p className="text-gray-600 italic">Select a time slot to view available rooms.</p>
      )}
    </div>
  );

  const EventDetailsModal = () => (
    <AnimatePresence>
      {showEventModal && selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowEventModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Booking Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="ml-2 text-purple-600">{selectedEvent.title}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Room:</span>
                <span className="ml-2 text-purple-600">{selectedEvent.room}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Start:</span>
                <span className="ml-2 text-purple-600">
                  {moment(selectedEvent.start).format('MMMM D, YYYY HH:mm')}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">End:</span>
                <span className="ml-2 text-purple-600">
                  {moment(selectedEvent.end).format('MMMM D, YYYY HH:mm')}
                </span>
              </div>
            </div>
            <button
              className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => setShowEventModal(false)}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!campusDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>Loading campus details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="relative overflow-hidden rounded-lg shadow-lg mb-6">
            <Image
              src={`http://127.0.0.1:1337/${campusDetails.url}`}
              alt={`Campus ${campusDetails.name}`}
              width={500}
              height={300}
              layout="responsive"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
              <h2 className="text-white text-3xl font-bold mb-2">{campusDetails.name}</h2>
              <p className="text-white text-xl">{campusDetails.location}</p>
            </div>
          </div>
          {/* Always render AvailableRoomsSection for both mobile and desktop */}
          <AvailableRoomsSection />
        </div>
        <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6 overflow-hidden">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">Campus Booking</h2>
          <p className="mb-4 text-gray-700">Connected User: {connectedUser.name}</p>
          <div className="calendar-container overflow-x-auto">
            <div style={{ minWidth: '800px' }}>
              <DnDCalendar
                localizer={localizer}
                events={bookings}
                startAccessor={(event: any) => event.start}
                endAccessor={(event: any) => event.end}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                resizable
                selectable
                step={60}
                timeslots={1}
                view={view}
                onView={(newView: View) => setView(newView as "week")}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                min={moment().hours(8).minutes(0).toDate()}
                max={moment().hours(20).minutes(0).toDate()}
                eventPropGetter={eventPropGetter}
                slotPropGetter={slotPropGetter}
                style={{ height: 600 }}
                toolbar={true}
                formats={{
                  dateFormat: 'dddd, MMMM D',
                  timeGutterFormat: 'HH:mm',
                  eventTimeRangeFormat: ({ start, end }) => `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
                }}
                components={{
                  toolbar: CustomToolbar,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl transform transition-all">
            <h2 className="text-2xl font-bold mb-6 text-purple-700">Confirm Booking</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="name">
                  Booking Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  required
                  placeholder="Enter booking name"
                />
              </div>
              <div className="mb-6">
                <p className="text-gray-700 font-medium">
                  Room: <span className="text-purple-600">{selectedRooms.find(r => r.id.toString() === bookingForm.room)?.name}</span>
                </p>
              </div>
              <div className="mb-8">
                <p className="text-gray-700 font-medium">
                  Time: <span className="text-purple-600">{selectedTime}</span>
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 ease-in-out"
                  onClick={() => {
                    setShowModal(false);
                    setBookingForm({ name: '', room: '', app_user: '' });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <EventDetailsModal />
      <style jsx global>{`
        .calendar-container {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .rbc-calendar {
          min-width: 800px;
          font-family: 'Geist Sans', sans-serif;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .rbc-header {
          background-color: #935b9e;
          color: white;
          font-weight: 600;
          padding: 12px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .rbc-time-header-content {
          background-color: #935b9e;
          color: white;
        }
        .rbc-time-view, .rbc-month-view {
          background-color: white;
        }
        .rbc-timeslot-group {
          border-bottom: 1px solid #e0e0e0;
        }
        .rbc-time-content {
          border-top: 1px solid #e0e0e0;
        }
        .rbc-time-slot {
          border-top: none !important;
        }
        .rbc-event {
          background-color: #8fbe54;
          border-radius: 4px;
          color: white;
          border: none;
          padding: 4px;
          transition: all 0.3s ease;
        }
        .rbc-event:hover {
          transform: scale(1.02);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .rbc-today {
          background-color: #f0e6ff;
        }
        .rbc-off-range-bg {
          background-color: #f8f8f8;
        }
        .rbc-date-cell {
          color: #4b4b99;
          font-weight: 600;
        }
        .rbc-toolbar button {
          color: #4b4b99;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .rbc-toolbar button:hover {
          background-color: #e6f7ff;
        }
        .rbc-toolbar button.rbc-active {
          background-color: #4b4b99;
          color: white;
        }
        .custom-time-slot {
          color: #333;
          font-weight: 500;
        }
        /* Additional styles for mobile responsiveness */
        @media (max-width: 768px) {
          .rbc-calendar {
            height: 500px !important;
          }
        }
      `}</style>
    </div>
  );
}