export type Uuid = string; 

export interface Event {
    eventId: Uuid; 
    name: string; 
    description: string;
    date: Date;
    }