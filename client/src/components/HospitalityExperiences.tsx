import React from 'react';
import { EventType } from '../types';
import EventItem, { EventPlaceholder } from './EventItem';

type HospitalityExperiencesProps = {
  events: EventType[] | null;
  eventsLoading: boolean;
};

const HospitalityExperiences: React.FC<HospitalityExperiencesProps> = ({
  events,
  eventsLoading,
}) => {
  return (
    <>
      <title>Hospitality Experiences - Motorpoint Arena Nottingham</title>
      <section className="font-inter px-5">
        <div>
          <div className="my-6 border-b border-neutral-700 border-dotted outline-offset-1 max-w-6xl mx-auto"></div>
          <h1 className="text-white font-extrabold w-fit mx-auto font-inter text-3xl mt-16 uppercase">
            Upcoming events
          </h1>
        </div>
      </section>
      <section className="px-8 mt-16 pb-20 flex flex-col gap-7">
        {events &&
          events.map(({ title, featureImage, purchase, date, id }) => (
            <div
              key={id}
              className={`mx-3 relative overflow-visible transition-all duration-300 bg-[#850925] rounded-sm`}
            >
              {eventsLoading ? (
                <EventPlaceholder />
              ) : (
                <EventItem
                  title={title}
                  featureImage={featureImage}
                  purchase={purchase}
                  date={date}
                  darkMode={true}
                />
              )}
            </div>
          ))}
      </section>
    </>
  );
};

export default HospitalityExperiences;
