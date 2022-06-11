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

export const weiToEth = (wei: number): number => wei / 10 ** 18;

export function convertToInternationalCurrencySystem(labelValue: number) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? Number(Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? Number(Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? Number(Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(labelValue)).toFixed(2);
}
