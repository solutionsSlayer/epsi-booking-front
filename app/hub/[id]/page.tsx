'use client'

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { View } from 'react-big-calendar';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

async function getCampusDetails(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:1337/api/buildings/${id}`, {
      headers: {
        'Authorization': 'Bearer 531bc9e5ca41fc9ea6a2987e0dc5093d395ebe159f443eb01d7dc3f77fd536607a11422b9642d27ee096b9d13ac96d9e19688a7649552a9d5743459eaebd019ac6775ad830973b72d923e98556766f72181184733b7b4612f83d078db8d54d91a3aea3777ae2425a13a8960996859bea7304af0911ce99219b68d4084cc32df9'
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

export default function CampusPage({ params }: { params: { id: string } }) {
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

  useEffect(() => {
    getCampusDetails(params.id).then(setCampusDetails);
    fetchAvailabilities();
    fetchBookings();
  }, [params.id]);

  const fetchAvailabilities = async () => {
    try {
      const startDate = moment().startOf('week').format('YYYY-MM-DD');
      const endDate = moment().endOf('week').format('YYYY-MM-DD');
      const res = await fetch(`http://127.0.0.1:1337/api/availabilities?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': 'Bearer 531bc9e5ca41fc9ea6a2987e0dc5093d395ebe159f443eb01d7dc3f77fd536607a11422b9642d27ee096b9d13ac96d9e19688a7649552a9d5743459eaebd019ac6775ad830973b72d923e98556766f72181184733b7b4612f83d078db8d54d91a3aea3777ae2425a13a8960996859bea7304af0911ce99219b68d4084cc32df9'
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

  const fetchAvailableRooms = async (date: Date, hour: number) => {
    try {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const res = await fetch(`http://127.0.0.1:1337/api/availabilities/rooms?date=${formattedDate}&hour=${hour}`, {
        headers: {
          'Authorization': 'Bearer 531bc9e5ca41fc9ea6a2987e0dc5093d395ebe159f443eb01d7dc3f77fd536607a11422b9642d27ee096b9d13ac96d9e19688a7649552a9d5743459eaebd019ac6775ad830973b72d923e98556766f72181184733b7b4612f83d078db8d54d91a3aea3777ae2425a13a8960996859bea7304af0911ce99219b68d4084cc32df9'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch available rooms');
      const data = await res.json();
      console.log("fetchAvailableRooms", data)
      setSelectedRooms(data);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      setSelectedRooms([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:1337/api/bookings?filters[app_user][id][$eq]=${connectedUser.id}`, {
        headers: {
          'Authorization': 'Bearer 531bc9e5ca41fc9ea6a2987e0dc5093d395ebe159f443eb01d7dc3f77fd536607a11422b9642d27ee096b9d13ac96d9e19688a7649552a9d5743459eaebd019ac6775ad830973b72d923e98556766f72181184733b7b4612f83d078db8d54d91a3aea3777ae2425a13a8960996859bea7304af0911ce99219b68d4084cc32df9'
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

      // Filter availabilities for the selected date and hour
      const selectedAvailabilities = availabilities.filter(a => 
        moment(a.startTime).format('YYYY-MM-DD') === formattedDate &&
        moment(a.startTime).hour() === hour &&
        !a.isBooked
      );

      // Set the selected rooms based on the filtered availabilities
      setSelectedRooms(selectedAvailabilities.map(a => ({
        id: a.room.id,
        name: a.room.name
      })));
    },
    [availabilities]
  );

  const handleBookRoom = (roomId: number, roomName: string) => {
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
            'Authorization': 'Bearer 531bc9e5ca41fc9ea6a2987e0dc5093d395ebe159f443eb01d7dc3f77fd536607a11422b9642d27ee096b9d13ac96d9e19688a7649552a9d5743459eaebd019ac6775ad830973b72d923e98556766f72181184733b7b4612f83d078db8d54d91a3aea3777ae2425a13a8960996859bea7304af0911ce99219b68d4084cc32df9',
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

        // Update the bookings state with the new booking
        setBookings(prev => [...prev, {
          id: createdBooking.data.id,
          title: bookingForm.name,
          start: new Date(startTime),
          end: new Date(endTime),
          color: eventColors[Math.floor(Math.random() * eventColors.length)],
        }]);

        setShowModal(false);
        setBookingForm({ name: '', room: '', app_user: '' });
        fetchAvailabilities(); // Refresh availabilities
      } catch (error) {
        console.error('Error creating booking:', error);
        alert(`Failed to create booking: ${error.message}`);
      }
    }
  };

  const handleSelectEvent = useCallback(
    (event: Event) => {
      const formattedStart = moment(event.start).format('MMMM D, YYYY HH:mm');
      const formattedEnd = moment(event.end).format('HH:mm');
      window.alert(
        `Booking Details:\n\nName: ${event.title}\nRoom: ${event.room}\nTime: ${formattedStart} - ${formattedEnd}`
      );
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
      return {
        style: {
          backgroundColor: event.color,
          borderRadius: '5px',
          opacity: 0.8,
          color: 'white',
          border: '0px',
          display: 'block'
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
      <h1 className="text-3xl font-bold text-center py-5 mb-8 text-black">{campusDetails.name} Campus</h1>
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
          {selectedTime && (
            <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
              <h3 className="text-xl font-bold mb-2 text-blue-600">Available Rooms</h3>
              <p className="mb-2 text-gray-700">For {selectedTime}</p>
              {selectedRooms.length > 0 ? (
                <ul className="space-y-2">
                  {selectedRooms.map(room => (
                    <li key={room.id} className="flex justify-between items-center">
                      <span className="text-gray-800">{room.name}</span>
                      <button
                        onClick={() => handleBookRoom(room.id, room.name)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Book
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">No rooms available for this time slot.</p>
              )}
            </div>
          )}
        </div>
        <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Campus Booking</h2>
          <p className="mb-4 text-gray-700">Connected User: {connectedUser.name}</p>
          <DnDCalendar
            slotPropGetter={slotPropGetter}
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
            style={{ height: 500 }}
          />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Confirm Booking</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border rounded-lg text-gray-800"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  required
                />
              </div>
              <p className="mb-4 text-gray-700">
                Room: {selectedRooms.find(r => r.id.toString() === bookingForm.room)?.name}
              </p>
              <p className="mb-4 text-gray-700">
                Time: {selectedTime}
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                  onClick={() => {
                    setShowModal(false);
                    setBookingForm({ name: '', room: '', app_user: '' });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style jsx global>{`
        .custom-time-slot {
          color: #333;
          font-weight: bold;
        }
        .rbc-time-slot {
          border-top: none !important;
        }
        .rbc-timeslot-group {
          border-bottom: 1px solid #e0e0e0;
        }
        .rbc-time-content {
          border-top: 1px solid #e0e0e0;
        }
        .rbc-header {
          background-color: #f0f0f0;
          color: #000;
          font-weight: bold;
          padding: 10px 0;
          border-bottom: 1px solid #ccc;
        }
        .rbc-date-cell {
          color: black;
          font-weight: bold;
        }
        .rbc-off-range {
          color: #999;
        }
        .rbc-off-range-bg {
          background-color: #f8f8f8;
        }
        .rbc-today {
          background-color: #e6f7ff;
        }
      `}</style>
    </div>
  );
}