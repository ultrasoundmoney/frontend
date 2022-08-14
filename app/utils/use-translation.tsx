import * as React from "react";
import { TranslationsContext } from "../translations-context";

export const useTranslations = () => {
  const translations = React.useContext(TranslationsContext);
  return { translations };
};
