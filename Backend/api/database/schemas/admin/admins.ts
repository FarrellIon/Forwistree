import { Schema, model } from 'mongoose';

interface Admins {
    id: String,
    username: String,
    password: String
    createdAt: Date,
    updatedAt: Date
}

const AdminsSchema = new Schema<Admins>(
    {
        id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export const Admins = model<Admins>('admins', AdminsSchema, 'admins');