export interface VidgetProps {
  name: string;
  title?: string;
}
export type moneyType = "Deflationary" | "Infationary";

export interface FirstVidgetProps {
  currentMoneyType: moneyType;
  date: string;
}
export interface SecondVidgetProps extends VidgetProps {
  number: number;
  cost: number;
}
export interface ThirdVidgetProps extends VidgetProps {
  numberETHBlock: number;
}

export const convertDateStringReadable = (date: string | number) => {
  if (date != undefined || date != null) {
    const dateString = new Date(date).toDateString();
    const dateStringToArr = dateString.split(" ");
    return `${dateStringToArr[1]} ${dateStringToArr[2]},${dateStringToArr[3]}`;
  }
};

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

export const weiToEth = (wei: number): number => wei / 10 ** 18;
