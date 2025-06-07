import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { axiosGetCache } from './api';
import HospitalityExperiences from './components/HospitalityExperiences';
import Layout from './components/Layout';
import NottinghamPanthers from './components/NottinghamPanthers';
import WhatsOn from './components/WhatsOn';
import { EventType } from './types';

const App: React.FC = () => {
  const location = useLocation();
  const [events, setEvents] = useState<EventType[] | null>(null);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(
    location.pathname.includes('hospitality-experiences')
  );

  useEffect(() => {
    const isHospitality = location.pathname.includes('hospitality-experiences');
    const isPanthers = location.pathname.includes('nottingham-panthers');
    const isWhatsOn = location.pathname.includes('whats-on');

    const loadEvents = async () => {
      setEventsLoading(true);

      try {
        if (isHospitality) {
          await fetchEvents(setEvents, { hospitality: 'true' });
          setDarkMode(true);
        } else if (isPanthers) {
          await fetchEvents(setEvents, { panthers: 'true' });
          setDarkMode(false);
        } else if (isWhatsOn) {
          await fetchEvents(setEvents);
          setDarkMode(false);
        }
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#171717' : '#fff';
  }, [darkMode]);

  return (
    <Routes>
      <Route element={<Layout darkMode={darkMode} />}>
        <Route path="/" element={<Navigate to="/whats-on" replace />} />
        <Route
          path="/whats-on"
          element={
            events && (
              <WhatsOn
                events={events}
                setEvents={setEvents}
                eventsLoading={eventsLoading}
                setEventsLoading={setEventsLoading}
              />
            )
          }
        />
        <Route
          path="/nottingham-panthers"
          element={
            events && (
              <NottinghamPanthers
                eventsLoading={eventsLoading}
                events={events}
              />
            )
          }
        />
        <Route
          path="/hospitality-experiences"
          element={
            events && (
              <HospitalityExperiences
                eventsLoading={eventsLoading}
                events={events}
              />
            )
          }
        />
      </Route>
    </Routes>
  );
};

export async function fetchEvents(
  setEvents: React.Dispatch<React.SetStateAction<EventType[] | null>>,
  filter: Record<string, string> | null = null
) {
  let events;

  try {
    events = await axiosGetCache(filter);
    setEvents(events);

    if (!filter && events.length) return events;
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }
}

export default App;
