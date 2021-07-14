import * as React from "react";
type CountDownProps = {
  targetDate: string;
  targetTime: string;
};
const Countdown: React.FC<CountDownProps> = ({ targetDate, targetTime }) => {
  const [state, setState] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  let timer: any;
  let distance;

  const setDate = () => {
    const now = new Date().getTime();
    const countDownDate = new Date(
      targetDate + " " + targetTime + " UTC"
    ).getTime();
    distance = countDownDate - now;
    if (distance < 0) {
      clearInterval(timer);
    } else {
      setState({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }
  };

  const counter = () => {
    timer = setInterval(() => {
      setDate();
    }, 1000);
  };

  React.useEffect(() => {
    setDate();
    counter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {targetDate && targetTime && (
        <div className="inline-flex justify-center w-full z-20 px-4 md:px-0">
          {Object.entries(state).map((el, i) => (
            <div
              key={i}
              className="entry flex-1 md:py-4 mx-1 md:mx-2 bg-blue-midnightexpress first:ml-0 last:mr-0"
            >
              <div
                key={el[1]}
                className="entry-value text-5xl sm:text-6xl md:text-7xl"
              >
                <span className="count top curr flipTop">{el[1] + 1}</span>
                <span className="count top next">{el[1]}</span>
                <span className="count bottom next flipBottom">{el[1]}</span>
                <span className="count bottom curr">{el[1] + 1}</span>
              </div>
              <div className="entry-title text-sm my-2">
                {el[0].toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default Countdown;
