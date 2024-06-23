import { Request, Response } from 'express';
import { MasterKategori } from "../../database/schemas/master_data/master_kategori";
import { encryptString, decryptString } from '../../utils/encryption';
import { Types } from 'mongoose';
import validator from 'validator';
import { Buku } from '../../database/schemas/buku/buku';

class KategoriController{
    get = async(req: Request, res: Response) => {
        try{
            const kategori = await MasterKategori.find({})
            .populate({
                path: 'buku',
                select: 'gambar_buku',
                populate: {
                    path: 'gambar_buku',
                    select: 'image'
                }
            })
            .sort('-createdAt');

            if (kategori?.length === 0) {
                res.status(500).send('Belum ada data kategori');
                return;
            }

            res.status(200).json({
                kategori,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    getOne = async(req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const decryptedId = decryptString(id);
            const kategori = await MasterKategori.findById({ _id: decryptedId })
            .populate({
                path: 'buku',
                populate: {
                    path: 'gambar_buku',
                    select: 'image'
                }
            });

            const buku = await Buku.findOne()
                .where({kategori: decryptedId})
                .sort('-diskon');

            if(!buku){
                res.status(404).send('Tidak ada buku yang ditemukan dalam kategori ini');
                return;
            }

            const maxDiskon = (buku as any).diskon;

            if (!kategori){
                res.status(500).send('Tidak ditemukan kategori dengan id tersebut');
                return;
            }

            res.status(200).json({
                kategori,
                maxDiskon,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    getRandom = async(req: Request, res: Response) => {
        try {
            const categories = await MasterKategori.find({ buku: { $exists: true, $ne: [] } })
            .populate({
                path: 'buku',
                populate: {
                    path: 'gambar_buku',
                    select: 'image'
                }
            });

            if (categories.length === 0) {
                res.status(500).send('Tidak ditemukan kategori yang mengandung buku');
                return;
            }

            const randomIndex = Math.floor(Math.random() * categories.length);
            const kategori = categories[randomIndex];

            res.status(200).json({
                kategori,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    create = async(req: Request, res: Response) => {
        try {
            const requiredFields = ['nama'];
            let errorMsg: string = '';
            
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    errorMsg += `Tidak ada ${field.replace(/_/g, ' ')}\n`;
                }
            }

            if(errorMsg != ''){
                res.status(500).send(errorMsg);
                return;
            }

            const validatorMsg: string = this.validateInputs(req);
            if(validatorMsg != ''){
                res.status(500).send(validatorMsg);
                return;
            }

            const objectId = new Types.ObjectId();
            const encryptedId = encryptString(objectId.toString());
            const adminObjectId = (req.user! as any)._id;

            const newKategoriObj = {
                _id: objectId,
                id: encryptedId,
                added_by: adminObjectId,
                ...req.body
            }

            const newKategori = await MasterKategori.create(newKategoriObj);
            res.status(201).json({
                kategori: newKategori,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    update = async(req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const decryptedId = decryptString(id);

            if (Object.keys(req.body).length === 0){
                res.status(500).send('Belum ada data yang diinput');
                return;
            }

            const validatorMsg: string = this.validateInputs(req);
            if(validatorMsg != ''){
                res.status(500).send(validatorMsg);
                return;
            }

            const kategori = await MasterKategori.findByIdAndUpdate({ _id: decryptedId }, req.body, { new: true })
            if (!kategori){
                res.status(500).send('Tidak ditemukan kategori dengan id tersebut!');
                return;
            }

            res.status(200).json({
                kategori: kategori,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    delete = async(req: Request, res: Response) => {
        try{
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
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    validateInputs = (req: Request) => {
        let errorMsg: string = '';
        
        if(req.body.nama){
            if (!validator.isAlphanumeric(req.body.nama, undefined, {ignore: ' -,&!.?'})){
                errorMsg += 'Nama kategori tidak valid';
            }
            
            if(!validator.isLength(req.body.nama, { min: 3, max: 30 })){    
                errorMsg += 'Nama kategori harus sepanjang 3-30 huruf';
            }
        }

        return errorMsg;
    }
}

export const kategoriController = new KategoriController();