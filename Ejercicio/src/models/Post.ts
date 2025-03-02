import { Schema, model, ObjectId } from 'mongoose';

export interface IPost {
    title: string;
    content: string;
    user: ObjectId;
}

const PostSchema = new Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" }
});

export const PostModel = model<IPost>("Post", PostSchema);
