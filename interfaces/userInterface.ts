interface IUser {
    name: string;
    email: string;
    slug?: string;
    phone?: string;
    image?: string;
    password: string;
    passwordChangedAt?: Date;
    otp?: string;
    otpExpire?: Date;
    role?: string;
    active?: boolean;
}

export { IUser };