import { Schema, model, Types } from 'mongoose';

interface Admins {
    id: String,
    username: String,
    password: String,
    buku: Types.ObjectId[],
    events: Types.ObjectId[],
    mitra_events: Types.ObjectId[],
    master_kategori: Types.ObjectId[],
    master_penulis: Types.ObjectId[],
    accepted_pengajuan: Types.ObjectId[],
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
        },
        buku: [
            {
                type: Schema.Types.ObjectId,
                ref: 'buku'
            }
        ],
        events: [
            {
                type: Schema.Types.ObjectId,
                ref: 'events'
            }
        ],
        mitra_events: [
            {
                type: Schema.Types.ObjectId,
                ref: 'mitra_event'
            }
        ],
        master_kategori: [
            {
                type: Schema.Types.ObjectId,
                ref: 'master_kategori'
            }
        ],
        master_penulis: [
            {
                type: Schema.Types.ObjectId,
                ref: 'master_penulis'
            }
        ],
        accepted_pengajuan: [
            {
                type: Schema.Types.ObjectId,
                ref: 'pengajuan_penerbitan'
            }
        ]
    },
    { timestamps: true }
);

export const Admins = model<Admins>('admins', AdminsSchema, 'admins');