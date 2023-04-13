import { createContext, useContext } from 'react';

import { CoreEventHandlers } from './CoreEventHandlers';

export const EventHandlerContext = createContext<CoreEventHandlers>(null);

EventHandlerContext.displayName = 'EventHandlerContext';

export const useEventHandler = () => useContext(EventHandlerContext);
