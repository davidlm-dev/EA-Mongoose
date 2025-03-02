import { Schema, model, ObjectId } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    username: string;
    phone?: string;
    company?: { name: string };
    posts?: ObjectId[];
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    phone: String,
    company: { name: String },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

export const UserModel = model<IUser>("User", UserSchema);
