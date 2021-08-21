export const followerCountConvert = (num: number) => {
  if (num > 999 && num < 1000000) {
    // convert to K for number from > 1000 < 1 million
    return (num / 1000).toFixed(1) + "K";
  } else if (num > 1000000) {
    // convert to M for number from > 1 million
    return (num / 1000000).toFixed(1) + "M";
  } else if (num <= 999) {
    // if value < 1000, nothing to do
    return num;
  }
};
export const convertDateStringReadable = (date: string | number) => {
  if (date != undefined || date != null) {
    const dateString = new Date(date).toDateString();
    const dateStringToArr = dateString.split(" ");
    return `${dateStringToArr[1]} ${dateStringToArr[2]},${dateStringToArr[3]}`;
  }
};
