import * as React from "react";

const TranslationContext = React.createContext<Data>({});

export const TranslationProvider: React.FC<{
  value?: Data;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export function useTranslations(): { translations: Data } {
  const translations = React.useContext(TranslationContext);
  return {
    translations: translations,
  };
}
