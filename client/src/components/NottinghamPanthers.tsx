import React from 'react';
import { EventType } from '../types';
import EventItem, { EventPlaceholder } from './EventItem';
import NoResults from './NoResults';

type NottinghamPanthersProps = {
  events: EventType[] | null;
  eventsLoading: boolean;
  error: null | string;
};

const NottinghamPanthers: React.FC<NottinghamPanthersProps> = ({
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
          className={`mx-3 relative overflow-visible transition-all duration-300 bg-[#850925] rounded-sm`}
        >
          <EventItem
            title={title}
            featureImage={featureImage}
            purchase={purchase}
            date={date}
          />
        </div>
      ));
    } else {
      return (
        <NoResults
          message={error ?? "We don't have any panther games on at this time"}
        />
      );
    }
  };
  return (
    <>
      <title>Nottingham Panthers - Motorpoint Arena Nottingham</title>
      <section className="font-inter px-2 lg:px-5">
        <div>
          <div className="my-6 border-b border-neutral-700 border-dotted outline-offset-1 max-w-6xl mx-auto"></div>
          <p className="text-black font-inter text-lg sm:text-[20px] mt-16 px-3 lg:px-6">
            Experience the thrill of ice hockey and purchase tickets to a
            claw-biting Nottingham Panthers home game! The ice hockey season
            runs from August to April each year.
          </p>
        </div>
      </section>
      <section className="lg:px-8 px-3 mt-16 pb-20 flex flex-col gap-7">
        {renderEvents()}
      </section>
    </>
  );
};

export default NottinghamPanthers;
