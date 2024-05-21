import { Schema, model, Types } from 'mongoose';

interface Events {
    id: String,
    judul: String,
    deskripsi: String,
    status_aktif: Boolean,
    tanggal_mulai_pendaftaran: Date,
    tanggal_selesai_pendaftaran: Date,
    tanggal_pembukaan: Date,
    tanggal_mulai_event: Date,
    tanggal_selesai_event: Date,
    tanggal_penutupan: Date,
    cara_bergabung: String,
    syarat: String,
    hadiah: String,
    contact_person: String,
    added_by: Types.ObjectId,
    gambar_event: Types.ObjectId[],
    pivot_mitra_event: Types.ObjectId[],
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
        tanggal_mulai_pendaftaran: {
            type: Date,
            required: true
        },
        tanggal_selesai_pendaftaran: {
            type: Date,
            required: true
        },
        tanggal_pembukaan: {
            type: Date,
            required: true
        },
        tanggal_mulai_event: {
            type: Date,
            required: true
        },
        tanggal_selesai_event: {
            type: Date,
            required: true
        },
        tanggal_penutupan: {
            type: Date,
            required: true
        },
        cara_bergabung: {
            type: String,
            required: true
        },
        syarat: {
            type: String,
            required: true
        },
        hadiah: {
            type: String,
            required: true
        },
        contact_person: {
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
        ],
        pivot_mitra_event: [
            {
                type: Schema.Types.ObjectId,
                ref: 'pivot_mitra_event'
            }
        ]
    },
    { timestamps: true }
);

export const Events = model<Events>('events', EventsSchema, 'events');