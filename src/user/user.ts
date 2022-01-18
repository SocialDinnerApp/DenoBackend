interface User {
    _id: { $oid: string };
    name: string;
    email: string;
    password: string;
}

export default User;