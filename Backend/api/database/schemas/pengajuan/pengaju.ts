import { Schema, model, Types } from 'mongoose';

interface Pengaju {
    id: String,
    nama_pena: String,
    email: String,
    no_wa: String,
    pengajuan_penerbitan: Types.ObjectId[],
}

const PengajuSchema = new Schema<Pengaju>(
    {
        id: {
            type: String,
            required: true
        },
        nama_pena: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        no_wa: {
            type: String,
            required: true
        },
        pengajuan_penerbitan: [
            {
                type: Schema.Types.ObjectId,
                ref: 'pengajuan_penerbitan'
            }
        ]
    },
    { timestamps: true }
);

export const Pengaju = model<Pengaju>('pengaju', PengajuSchema, 'pengaju');