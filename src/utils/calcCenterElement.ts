export const calcCenterElement = (element: HTMLElement): number => {
  const topEl = element.getBoundingClientRect().y + window.scrollY;
  const heightEl = element.clientHeight;

  // like {top: 50%, transform: translateY(-50%)} in CSS
  return topEl - window.innerHeight / 2 + heightEl / 2;
};
