import { Request, Response } from 'express';
import { MasterKategori } from "../../database/schemas/master_kategori";
import { encryptString, decryptString } from '../../utils/encryption';
import { Types } from 'mongoose';
import validator from 'validator';

class KategoriController{
    get = async(req: Request, res: Response) => {
        const kategori = await MasterKategori.find({}).sort('-createdAt');

        if (kategori?.length === 0) {
            res.status(500).send('Belum ada data kategori');
            return;
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
            res.status(500).send('Tidak ditemukan kategori dengan id tersebut');
            return;
        }

        res.status(200).json({
            kategori,
            msg: "Berhasil"
        });
    }

    create = async(req: Request, res: Response) => {
        const { nama } = req.body;

        const requiredFields = ['nama'];
        let errorMsg: string = '';
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                errorMsg += `Tidak ada ${field.replace('_', ' ')}\n`;
            }
        }

        if(errorMsg != ''){
            res.status(500).send(errorMsg);
            return;
        }

        if (!validator.isAlphanumeric(nama)){
            res.status(500).send('Nama kategori tidak valid');
            return;
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
            res.status(500).send('Tidak ditemukan kategori dengan id tersebut!');
            return;
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
            res.status(500).send('Tidak ditemukan kategori dengan id tersebut!');
            return;
        }

        res.status(200).json({
            kategori,
            msg: "Berhasil"
        });
    }
}

export const kategoriController = new KategoriController();