import React from 'react';
import robot from '/404.webp?url';

type NoResultsPropsType = {
  message: string;
};

const NoResults: React.FC<NoResultsPropsType> = ({ message }) => {
  return (
    <div className="flex flex-col gap-10 mx-auto p-4 pb-10">
      <div className="max-w-lg w-full mx-auto">
        <img src={robot} className="w-full p-4" />
      </div>
      <h1 className="font-inter sm:text-3xl text-2xl md:text-5xl max-w-6xl text-center w-full text-[#d2430f] font-extrabold uppercase">
        {message}
      </h1>
    </div>
  );
};

export default NoResults;
