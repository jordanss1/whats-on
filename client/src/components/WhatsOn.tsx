import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { axiosGetCategories, axiosGetMonths } from '../api';
import { fetchEvents } from '../App';
import { EventType } from '../types';
import EventItem, { EventDateHeading, EventPlaceholder } from './EventItem';

type WhatsOnProps = {
  events: EventType[] | null;
  setEvents: React.Dispatch<React.SetStateAction<EventType[] | null>>;
  eventsLoading: boolean;
  setEventsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const WhatsOn: React.FC<WhatsOnProps> = ({
  events,
  setEvents,
  eventsLoading,
  setEventsLoading,
}) => {
  const [searchParams, setSearchParams] = useSearchParams('');
  const [eventMonths, setEventMonths] = useState<
    EventType['monthAndYear'][] | null
  >(null);
  const [eventCategories, setEventCategories] = useState<
    EventType['genre'] | null
  >(null);

  const currentFilter = Object.fromEntries([...searchParams]);

  useEffect(() => {
    const loadEvents = async () => {
      setEventsLoading(true);

      try {
        fetchEvents(setEvents, currentFilter);
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, [searchParams]);

  useEffect(() => {
    async function loadCategories() {
      const categories = await axiosGetCategories();
      setEventCategories(categories);
    }

    async function loadMonths() {
      const months = await axiosGetMonths();
      setEventMonths(months);
    }

    loadMonths();
    loadCategories();
  }, []);

  const updateFilter = (target: HTMLInputElement | HTMLSelectElement) => {
    const key = target.name;
    const value = target.value;

    if (key) {
      if (value) {
        setSearchParams({
          [key.toLowerCase()]: value.toLowerCase(),
        });
      } else setSearchParams();
    }
  };

  const renderEvents = events!
    .filter((e) => {
      const title = e.title ?? '';

      return (
        e.canEventBeSold &&
        !title.toLowerCase().includes('spotlight meal upgrade') &&
        !title.toLowerCase().includes('green room upgrade')
      );
    })
    .map(
      (
        { title, date, dates, featureImage, purchase, id, monthAndYear },
        i,
        arr
      ) => {
        const dateHeading = new Date(dates[0]).toLocaleString('en-UK', {
          month: 'long',
          year: 'numeric',
        });

        const addHeading = i === 0 || monthAndYear !== arr[i - 1].monthAndYear;
        const lastEventInDate =
          i !== arr.length - 1 && monthAndYear !== arr[i + 1].monthAndYear;

        return (
          <div key={id}>
            {addHeading && (
              <div className="mb-10">
                <EventDateHeading date={dateHeading} />
              </div>
            )}
            <div
              className={`mx-3 ${
                lastEventInDate ? 'mb-10' : ''
              } relative overflow-visible transition-all duration-300  hover:[box-shadow:0_20px_32px_-5px_rgba(50,50,93,0.35)] [box-shadow:0_14px_32px_-5px_rgba(50,50,93,0.25)]`}
            >
              {eventsLoading ? (
                <EventPlaceholder />
              ) : (
                <EventItem
                  title={title}
                  featureImage={featureImage}
                  purchase={purchase}
                  date={date}
                />
              )}
            </div>
          </div>
        );
      }
    );

  return (
    <>
      <title>What's On - Motorpoint Arena Nottingham</title>
      <section className="w-full px-6 py-14 bg-[#004996]">
        <form className="flex gap-7 w-full max-w-[1450px] mx-auto justify-evenly items-center">
          <SelectComponent
            name="category"
            handleChange={updateFilter}
            currentFilter={currentFilter}
            options={eventCategories}
          />

          <SelectComponent
            name="month"
            currentFilter={currentFilter}
            handleChange={updateFilter}
            options={eventMonths}
          />

          <SearchComponent
            name="search"
            currentFilter={currentFilter}
            handleChange={updateFilter}
          />
        </form>
      </section>
      <section className="px-8 mt-16 pb-20 flex flex-col gap-7">
        {events && renderEvents}
      </section>
    </>
  );
};

type SelectComponentProps = {
  options: string[] | null;
  handleChange: (target: HTMLInputElement | HTMLSelectElement) => void;
  name: 'category' | 'month';
  currentFilter: Record<string, string>;
};

function SelectComponent({
  options,
  handleChange,
  name,
  currentFilter,
}: SelectComponentProps): ReactElement {
  const renderOptions = () =>
    options?.map((option, i) => {
      let name = option.toLowerCase();
      name = name.charAt(0).toUpperCase() + name.slice(1);

      return (
        <option value={option.toLowerCase()} key={i}>
          {name}
        </option>
      );
    });

  const value = currentFilter[name] ?? '';

  return (
    <div className="relative flex-1 grid">
      <select
        name={name}
        onChange={({ target }) => handleChange(target)}
        value={value}
        className="font-inter py-2.5 px-5 bg-white  ring-2 ring-[#13256f]  text-[#666] appearance-none p-2 rounded-4xl font-semibold text-[15px]"
      >
        <option value="" disabled>
          Filter events by {name.charAt(0).toUpperCase() + name.slice(1)}
        </option>
        {renderOptions()}
      </select>
      <i className="fa-solid fa-angle-down absolute text-lg right-4.5 top-1/2 -translate-y-2 text-[#d2430f]"></i>
    </div>
  );
}

type SearchComponentProps = {
  handleChange: (target: HTMLInputElement | HTMLSelectElement) => void;
  currentFilter: Record<string, string>;
  name: string;
};

function SearchComponent({
  handleChange,
  currentFilter,
  name,
}: SearchComponentProps): ReactElement {
  const value = currentFilter[name] ?? '';

  return (
    <div className="flex-1 relative grid">
      <input
        onChange={({ target }) => handleChange(target)}
        type="text"
        name={name}
        value={value}
        className="font-inter py-2.5 px-5 bg-white  ring-2 ring-[#13256f] font-semibold text-[#666] p-2 rounded-4xl text-[15px] placeholder:text-[#666] placeholder:font-semibold"
        placeholder="Search events"
      />
      <i className="fa-solid fa-magnifying-glass absolute right-4.5 top-1/2 -translate-y-2 text-[#d2430f]"></i>
    </div>
  );
}

export default WhatsOn;
