import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { axiosGetCache } from './api';
import HospitalityExperiences from './components/HospitalityExperiences';
import Layout from './components/Layout';
import Notification from './components/Notification';
import NottinghamPanthers from './components/NottinghamPanthers';
import WhatsOn from './components/WhatsOn';
import { EventType } from './types';

export type HandleEventsType = (
  filter: Record<string, string> | null
) => Promise<void>;

const App: React.FC = () => {
  const location = useLocation();
  const [events, setEvents] = useState<EventType[] | null>(null);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [popup, setPopup] = useState<boolean>(false);
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
          setError(null);
          setDarkMode(true);
        } else if (isPanthers) {
          await fetchEvents(setEvents, { panthers: 'true' });
          setError(null);
          setDarkMode(false);
        } else if (isWhatsOn) {
          await fetchEvents(setEvents);
          setError(null);
          setDarkMode(false);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#171717' : '#fff';
  }, [darkMode]);

  useEffect(() => {
    if (error) {
      setPopup(true);

      const timer = setTimeout(() => setPopup(false), 2500);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (eventsLoading) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [eventsLoading]);

  function handleError(err: unknown): void {
    let message = 'Problem retrieving events - please try again';

    if (err instanceof AxiosError) {
      message = err.response?.data.error ?? message;
      setError(message);
    } else {
      setError(message);
    }
  }

  const handleEvents: HandleEventsType = async (filter) => {
    setEventsLoading(true);

    try {
      await fetchEvents(setEvents, filter);
      setError(null);
    } catch (err) {
      handleError(err);
    } finally {
      setEventsLoading(false);
    }
  };

  return (
    <>
      <Notification popup={popup} error={error} />
      <Routes>
        <Route element={<Layout darkMode={darkMode} />}>
          <Route path="/" element={<Navigate to="/whats-on" replace />} />
          <Route
            path="/whats-on"
            element={
              <WhatsOn
                events={events}
                handleEvents={handleEvents}
                eventsLoading={eventsLoading}
                error={error}
              />
            }
          />
          <Route
            path="/nottingham-panthers"
            element={
              <NottinghamPanthers
                eventsLoading={eventsLoading}
                events={events}
                error={error}
              />
            }
          />
          <Route
            path="/hospitality-experiences"
            element={
              <HospitalityExperiences
                eventsLoading={eventsLoading}
                events={events}
                error={error}
              />
            }
          />
        </Route>
      </Routes>
    </>
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
    throw error;
  }
}

export default App;
