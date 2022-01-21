export interface Event {
    _id: { $oid: string };
    name: string; 
    description: string;
    organizer: any;
    date: string;
    time_starter: string;
    time_main: string;
    time_dessert: string;
    city: string;
    fee: number;
    zip_code: number;
    max_participants: number;
    registration_deadline: string;
    datetime_created: Date;
    datetime_updated: Date;
    }