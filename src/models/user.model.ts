import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
}, {versionKey: false}); // versionKey: flase using do not allow to store __v field in mongodb for each records.

const User = model<IUser>('User', userSchema);

export default User;