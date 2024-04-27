import { Schema, model } from 'mongoose';

interface PivotPenulisBuku {
    id: String,
    buku: Schema.Types.ObjectId,
    penulis: Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const PivotPenulisBukuSchema = new Schema<PivotPenulisBuku>(
    {
        id: {
            type: String,
            required: true
        },
        buku: {
            type: Schema.Types.ObjectId,
            ref: 'buku',
            required: true
        },
        penulis: {
            type: Schema.Types.ObjectId,
            ref: 'master_penulis',
            required: true
        },
    },
    { timestamps: true }
);

export const PivotPenulisBuku = model<PivotPenulisBuku>('pivot_penulis_buku', PivotPenulisBukuSchema, 'pivot_penulis_buku');