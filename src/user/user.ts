interface User {
    _id: { $oid: string };
    username: string;
    email: string;
    password: string;
    university: string;
    city: string;
    faculty: string;
    datetime_created: Date;
    datetime_updated: Date;
}

export default User;