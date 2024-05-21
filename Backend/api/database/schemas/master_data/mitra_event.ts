import { Schema, model, Types } from 'mongoose';

interface MitraEvent {
    id: String,
    nama: String,
    image: String,
    pivot_mitra_event: Types.ObjectId[],
    added_by: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const MitraEventSchema = new Schema<MitraEvent>(
    {
        id: {
            type: String,
            required: true
        },
        nama: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        added_by: {
            type: Schema.Types.ObjectId,
            ref: 'admins',
            required: true
        },
        pivot_mitra_event: [
            {
                type: Schema.Types.ObjectId,
                ref: 'pivot_mitra_event'
            }
        ]
    },
    { timestamps: true }
);

export const MitraEvent = model<MitraEvent>('mitra_event', MitraEventSchema, 'mitra_event');