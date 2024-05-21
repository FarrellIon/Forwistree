import { Schema, model, Types } from 'mongoose';

interface PivotMitraEvent {
    id: String,
    mitra: Types.ObjectId,
    event: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const PivotMitraEventSchema = new Schema<PivotMitraEvent>(
    {
        id: {
            type: String,
            required: true
        },
        mitra: {
            type: Schema.Types.ObjectId,
            ref: 'mitra_event',
            required: true
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: 'events',
            required: true
        },
    },
    { timestamps: true }
);

export const PivotMitraEvent = model<PivotMitraEvent>('pivot_mitra_event', PivotMitraEventSchema, 'pivot_mitra_event');