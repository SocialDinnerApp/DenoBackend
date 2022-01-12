export interface Event {
    name: string; 
    description: string;
    organizer: any;
    date: Date;
    time_starter: string;
    time_main: string;
    time_dessert: string;
    city: string;
    zip_code: Int16Array;
    is_public: boolean;
    max_participants: Int16Array;
    registration_deadline: string;
    datetime_created: Date;
    datetime_updated: Date;
    }