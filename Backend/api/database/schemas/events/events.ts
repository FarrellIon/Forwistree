import { Schema, model } from 'mongoose';

interface Events {
    id: String,
    judul: String,
    deskripsi: String
    status_aktif: Boolean
    added_by: Schema.Types.ObjectId,
    gambar_event: Schema.Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date
}

const EventsSchema = new Schema<Events>(
    {
        id: {
            type: String,
            required: true
        },
        judul: {
            type: String,
            required: true
        },
        deskripsi: {
            type: String,
            required: true
        },
        status_aktif: {
            type: Boolean,
            required: true,
            default: false
        },
        added_by: {
            type: Schema.Types.ObjectId,
            ref: 'admins',
            required: true
        },
        gambar_event: [
            {
                type: Schema.Types.ObjectId,
                ref: 'gambar_event'
            }
        ]
    },
    { timestamps: true }
);

export const Events = model<Events>('events', EventsSchema, 'events');