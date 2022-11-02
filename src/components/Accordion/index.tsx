import * as React from "react";
import BodyText from "../TextsNext/BodyText";
import Twemoji from "../Twemoji";
import styles from "./Accordion.module.scss";

type AccordionProps = {
  title: string;
  text: string;
};
const Accordion: React.FC<AccordionProps> = ({ title, text }) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <BodyText className={styles["wrapper"]}>
      <div
        className={`${styles.title} break-words py-6 text-lg ${
          isOpen ? `${styles.open}` : ""
        }`}
        onClick={() => setOpen(!isOpen)}
      >
        <Twemoji imageClassName="inline h-6 ml-1">
          <p
            dangerouslySetInnerHTML={{
              __html: String(title),
            }}
          ></p>
        </Twemoji>
      </div>
      <div
        className={`whitespace-pre-line break-words pb-6 ${styles.item} ${
          isOpen
            ? `${styles.animateIn}`
            : `${styles.collapsed} ${styles.animateOut}`
        }`}
      >
        <Twemoji imageClassName="inline h-6">
          <p
            className={`${styles.content} pb-6 leading-relaxed`}
            dangerouslySetInnerHTML={{
              __html: String(text),
            }}
          ></p>
        </Twemoji>
      </div>
    </BodyText>
  );
};

export default Accordion;
