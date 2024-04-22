import { Request, Response } from 'express';
import { MasterKategori } from "../../database/schemas/master_kategori";
import { encryptString, decryptString } from '../../utils/encryption';
import { Types } from 'mongoose';

class KategoriController{
    get = async(req: Request, res: Response) => {
        const kategori = await MasterKategori.find({}).sort('-createdAt');

        if (kategori?.length === 0) {
            throw new Error("Belum ada data kategori");
        }

        res.status(200).json({
            kategori,
            msg: "Berhasil"
        });
    }

    getOne = async(req: Request, res: Response) => {
        const { id } = req.params;
        const decryptedId = decryptString(id);
        const kategori = await MasterKategori.findById({ _id: decryptedId });

        if (!kategori){
            throw new Error("Tidak ditemukan kategori dengan id tersebut");
        }

        res.status(200).json({
            kategori,
            msg: "Berhasil"
        });
    }

    create = async(req: Request, res: Response) => {
        const { nama } = req.body;

        if (!nama){
            throw new Error('Tidak ada nama kategori');
        }

        const objectId = new Types.ObjectId();
        const encryptedId = encryptString(objectId.toString());

        const newKategoriObj = {
            _id: objectId,
            id: encryptedId,
            ...req.body
        }

        const newKategori = await MasterKategori.create(newKategoriObj);
        res.status(201).json({
            kategori: newKategori,
            msg: "Berhasil"
        });
    }

    update = async(req: Request, res: Response) => {
        const { id } = req.params;
        const decryptedId = decryptString(id);
        const kategori = await MasterKategori.findByIdAndUpdate({ _id: decryptedId }, req.body, { new: true })

        if (!kategori){
            throw new Error('Tidak ditemukan kategori dengan id tersebut!');
        }

        res.status(200).json({
            kategori: kategori,
            msg: "Berhasil"
        });
    }

    delete = async(req: Request, res: Response) => {
        const { id } = req.params;
        const decryptedId = decryptString(id);
        const kategori = await MasterKategori.findByIdAndDelete({ _id: decryptedId });

        if (!kategori){
            throw new Error("Tidak ditemukan kategori dengan id tersebut!");
        }

        res.status(200).json({
            kategori,
            msg: "Berhasil"
        });
    }
}

export const kategoriController = new KategoriController();