import { Schema, model } from 'mongoose';

interface GambarEvent {
    id: String,
    event: Schema.Types.ObjectId,
    image: String,
    createdAt: Date,
    updatedAt: Date
}

const GambarEventSchema = new Schema<GambarEvent>(
    {
        id: {
            type: String,
            required: true
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: 'events',
            required: true
        },
        image: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export const GambarEvent = model<GambarEvent>('gambar_event', GambarEventSchema, 'gambar_event');