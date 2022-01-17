import * as React from "react";
import twemoji from "twemoji";
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
        dangerouslySetInnerHTML={{
          __html: twemoji.parse(title),
        }}
      />
      <div
        className={`${styles.item} break-words ${
          !isOpen ? `${styles.collapsed} animateOut` : "animateIn"
        }`}
      >
        <div
          className={`${styles.content} leading-relaxed pb-6`}
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(text),
          }}
        />
      </div>
    </div>
  );
};

export default Accordion;
