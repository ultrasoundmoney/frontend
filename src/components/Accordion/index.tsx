import * as React from "react";
import Twemoji from "../Twemoji";
import styles from "./Accordion.module.scss";

type AccordionProps = {
  title: string;
  text: string;
};
const Accordion: React.FC<AccordionProps> = ({ title, text }) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.title} text-lg py-6 break-words ${
          isOpen ? `${styles.open}` : ""
        }`}
        onClick={() => setOpen(!isOpen)}
      >
        <Twemoji
          className="flex gap-1 items-center"
          imageClassName="h-6"
          wrapper
        >
          {title}
        </Twemoji>
      </div>
      <div
        className={`${styles.item} break-words ${
          !isOpen
            ? `${styles.collapsed} ${styles.animateOut}`
            : `${styles.animateIn}`
        }`}
      >
        <Twemoji className="flex gap-1 items-center" imageClassName="h-6">
          <div className={`${styles.content} leading-relaxed pb-6`}>{text}</div>
        </Twemoji>
      </div>
    </div>
  );
};

export default Accordion;
