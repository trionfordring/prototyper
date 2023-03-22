import { Application } from '@/types/application';
import { PropsWithChildren, createContext, useContext } from 'react';

export const ApplicationInfoContext = createContext<Application>(
  undefined as Application
);

export function ApplicationInfoProvider({
  application,
  children,
}: PropsWithChildren<{ application: Application }>) {
  return (
    <ApplicationInfoContext.Provider value={application}>
      {children}
    </ApplicationInfoContext.Provider>
  );
}

export function useApplicationInfo() {
  return useContext(ApplicationInfoContext);
}
