export type ListenerDescriptor<EventName extends keyof HTMLElementEventMap> = [EventName, HTMLElementEventMap[EventName]];
