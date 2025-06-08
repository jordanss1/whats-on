import React from 'react';
import { EventType } from '../types';
import EventItem, { EventPlaceholder } from './EventItem';
import NoResults from './NoResults';

type HospitalityExperiencesProps = {
  events: EventType[] | null;
  eventsLoading: boolean;
  error: null | string;
};

const HospitalityExperiences: React.FC<HospitalityExperiencesProps> = ({
  events,
  eventsLoading,
  error,
}) => {
  const renderEvents = () => {
    if (eventsLoading) {
      return Array.from({ length: 5 }).map((val, i) => (
        <EventPlaceholder key={i} />
      ));
    } else if (events?.length) {
      return events.map(({ title, featureImage, purchase, date, id }) => (
        <div
          key={id}
          className="mx-3 relative overflow-visible transition-all duration-300 bg-[#850925] rounded-sm"
        >
          <EventItem
            title={title}
            featureImage={featureImage}
            purchase={purchase}
            date={date}
            darkMode={true}
          />
        </div>
      ));
    } else {
      return (
        <NoResults
          message={
            error ?? "We don't have any hospitality events on at this time"
          }
        />
      );
    }
  };

  return (
    <>
      <title>Hospitality Experiences - Motorpoint Arena Nottingham</title>
      <section className="font-inter px-5">
        <div>
          <div className="my-6 border-b border-neutral-700 border-dotted outline-offset-1 max-w-6xl mx-auto"></div>
          <h1 className="text-white font-extrabold w-fit mx-auto font-inter text-3xl mt-16 uppercase whitespace-nowrap">
            Upcoming events
          </h1>
        </div>
      </section>
      <section className="lg:px-8 px-2.5 mt-16 pb-20 flex flex-col gap-7">
        {renderEvents()}
      </section>
    </>
  );
};

export default HospitalityExperiences;
