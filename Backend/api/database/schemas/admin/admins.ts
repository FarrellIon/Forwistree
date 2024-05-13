import { Schema, model, Types } from 'mongoose';

interface Admins {
    id: String,
    username: String,
    password: String,
    buku: Types.ObjectId[],
    events: Types.ObjectId[],
    master_kategori: Types.ObjectId[],
    master_penulis: Types.ObjectId[],
    pengajuan_penerbitan: Types.ObjectId[],
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
        pengajuan_penerbitan: [
            {
                type: Schema.Types.ObjectId,
                ref: 'pengajuan_penerbitan'
            }
        ]
    },
    { timestamps: true }
);

export const Admins = model<Admins>('admins', AdminsSchema, 'admins');