import { ReactElement } from 'react';
import robot from '/404.webp?url';

export type NotificationPropsType = {
  error?: string | null;
  popup?: boolean;
};

const Notification = ({
  error,
  popup,
}: NotificationPropsType): ReactElement => {
  const renderImg = () => {
    if (error) {
      return (
        <div className=" max-w-xs w-full p-2">
          <img src={robot} alt="" />
        </div>
      );
    }
  };

  return (
    <div
      aria-hidden={popup ? 'false' : 'true'}
      className="fixed  z-30  top-0 translate-y-3 transition-all duration-300 ease-in-out aria-hidden:-translate-y-full aria-hidden:pointer-events-none pointer-events-auto aria-hidden:opacity-0 left-1/2 -translate-x-1/2 opacity-100  border border-neutral-800 rounded-sm flex  flex-2 min-h-[128px] p-2  gap-4 justify-between items-center max-w-xs w-full mx-auto bg-white"
    >
      {renderImg()}
      <span className="text-lg h-fit font-inter font-semibold">{error}</span>
    </div>
  );
};

export default Notification;
