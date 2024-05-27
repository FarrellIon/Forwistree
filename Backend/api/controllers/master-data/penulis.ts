import { Request, Response } from 'express';
import { MasterPenulis } from '../../database/schemas/master_data/master_penulis';
import { encryptString, decryptString } from '../../utils/encryption';
import { Types } from 'mongoose';
import validator from 'validator';

class PenulisController{
    get = async(req: Request, res: Response) => {
        try{
            const penulis = await MasterPenulis.find({}).sort('-createdAt');

            if (penulis?.length === 0) {
                res.status(500).send('Belum ada data penulis');
                return;
            }

            res.status(200).json({
                penulis,
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
            const penulis = await MasterPenulis.findById({ _id: decryptedId });

            if (!penulis){
                res.status(500).send('Tidak ditemukan penulis dengan id tersebut');
                return;
            }

            res.status(200).json({
                penulis,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    create = async(req: Request, res: Response) => {
        try {
            const requiredFields = ['nama_pena'];
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

            const newPenulisObj = {
                _id: objectId,
                id: encryptedId,
                added_by: adminObjectId,
                ...req.body
            }

            const newPenulis = await MasterPenulis.create(newPenulisObj);
            res.status(201).json({
                penulis: newPenulis,
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

            const penulis = await MasterPenulis.findByIdAndUpdate({ _id: decryptedId }, req.body, { new: true })
            if (!penulis){
                res.status(500).send('Tidak ditemukan penulis dengan id tersebut!');
                return;
            }

            res.status(200).json({
                penulis: penulis,
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
            const penulis = await MasterPenulis.findByIdAndDelete({ _id: decryptedId });

            if (!penulis){
                res.status(500).send('Tidak ditemukan penulis dengan id tersebut!');
                return;
            }

            res.status(200).json({
                penulis,
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
                errorMsg += 'Nama penulis tidak valid';
            }
            
            if(!validator.isLength(req.body.nama, { max: 30 })){    
                errorMsg += 'Nama penulis maksimal 30 huruf';
            }
        }

        if(req.body.nama_pena){
            if (!validator.isAlphanumeric(req.body.nama_pena, undefined, {ignore: ' -,&!.?'})){
                errorMsg += 'Nama pena penulis tidak valid';
            }
            
            if(!validator.isLength(req.body.nama_pena, { max: 30 })){    
                errorMsg += 'Nama pena penulis maksimal 30 huruf';
            }
        }

        if(req.body.email){
            if (!validator.isEmail(req.body.email)){
                errorMsg += 'Email tidak valid';
            }
        }

        if(req.body.no_wa){
            if (!validator.isNumeric(req.body.no_wa)){
                errorMsg += 'Nomor HP tidak valid';
            }
        }

        return errorMsg;
    }
}

export const penulisController = new PenulisController();