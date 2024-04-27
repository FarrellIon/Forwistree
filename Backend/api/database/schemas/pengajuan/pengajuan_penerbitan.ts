import { Schema, model } from 'mongoose';

interface PengajuanPenerbitan {
    id: String,
    pengaju: Schema.Types.ObjectId,
    file_sinopsis: String,
    accepted_by: Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const PengajuanPenerbitanSchema = new Schema<PengajuanPenerbitan>(
    {
        id: {
            type: String,
            required: true
        },
        pengaju: {
            type: Schema.Types.ObjectId,
            ref: 'pengaju',
            required: true
        },
        file_sinopsis: {
            type: String,
            required: true
        },
        accepted_by: {
            type: Schema.Types.ObjectId,
            ref: 'admins',
            required: true
        }
    },
    { timestamps: true }
);

export const PengajuanPenerbitan = model<PengajuanPenerbitan>('pengajuan_penerbitan', PengajuanPenerbitanSchema, 'pengajuan_penerbitan');