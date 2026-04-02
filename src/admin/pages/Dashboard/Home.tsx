import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {

  const COUNTDOWN_DAYS = 100;

  function getStartTime() {
    const savedTime = localStorage.getItem("countdownStart");

    if (savedTime) {
      return parseInt(savedTime);
    } else {
      const now = new Date().getTime();
      localStorage.setItem("countdownStart", now);
      return now;
    }
  }

  const startTime = getStartTime();
  const endTime = startTime + COUNTDOWN_DAYS * 24 * 60 * 60 * 1000;

  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <PageMeta
        title="Coming Soon - StayNThrill"
        description="StayNThrill dashboard is coming soon."
      />

      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="text-center max-w-3xl w-full">

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            StayNThrill
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
            Coming Soon
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mb-10">
            We're working hard to launch something amazing.
            Stay tuned!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div key={unit} className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
                <h3 className="text-3xl font-bold text-primary">
                  {timeLeft[unit]}
                </h3>
                <p className="text-gray-500 text-sm mt-2 capitalize">{unit}</p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </>
  );
}