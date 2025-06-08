import React from 'react';
import { Link } from 'react-router';
import { EventType } from '../types';
import ImgWithFallback from './ImgWithFallback';

type EventItemProps = {
  purchase: EventType['purchase'];
  featureImage: EventType['featureImage'];
  title: EventType['title'];
  date: string;
  darkMode?: boolean;
};

const EventItem: React.FC<EventItemProps> = ({
  title,
  featureImage,
  purchase,
  date,
  darkMode = false,
}: EventItemProps) => {
  return (
    <Link className="rounded-md cursor-pointer" to={purchase}>
      <article className="flex lg:flex-row flex-col rounded-md lg:pb-0 pb-8 lg:gap-5">
        <ImgWithFallback
          src={featureImage}
          className="lg:max-w-xs min-h-44 w-full lg:rounded-r-none rounded-tl-sm rounded-tr-sm lg:rounded-l-sm object-cover h-full max-h-80 lg:max-h-none lg:h-44"
        />
        <div className="flex flex-col rounded-sm justify-center gap-6 lg:gap-5 px-6 py-4 lg:px-1 lg:py-1">
          <div
            className={`flex flex-col ${
              darkMode ? 'text-white' : 'text-[#243048]'
            }`}
          >
            <h2 className="uppercase text-[26px] font-[900] -mb-1 font-inter">
              {title}
            </h2>
            <p className="pl-0.5 text-[16px] font-bold lg:font-normal font-inter">
              {date}
            </p>
          </div>
          <button
            className={`uppercase cursor-pointer ${
              darkMode
                ? 'text-[#243048] bg-[#d99c28]'
                : 'text-white bg-[#d2430f]'
            } rounded-4xl w-fit p-2 px-5 font-bold text-[16px]`}
          >
            Info & Tickets
          </button>
        </div>
      </article>
    </Link>
  );
};

export function EventPlaceholder() {
  return (
    <div className="rounded-md cursor-pointer animate-pulse">
      <article className="flex rounded-md gap-5 bg-gray-200 dark:bg-[#2a2a2a]">
        <div className="max-w-xs w-full rounded-l-sm h-44 bg-gray-300 dark:bg-[#3a3a3a]" />
        <div className="flex flex-col justify-center gap-5 p-1 w-full">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-3/4 bg-gray-300 dark:bg-[#444] rounded" />
            <div className="h-4 w-1/2 bg-gray-300 dark:bg-[#444] rounded" />
          </div>
          <div className="h-10 w-40 bg-gray-300 dark:bg-[#555] rounded-4xl" />
        </div>
      </article>
    </div>
  );
}

export function EventDateHeading({ date }: { date: string }) {
  return (
    <div className="bg-[#004996] w-full text-2xl font-inter text-white font-extrabold p-2 px-3">
      {date}
    </div>
  );
}

export default EventItem;
