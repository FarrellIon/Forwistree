import { Request, Response } from 'express';
import { encryptString, decryptString } from '../../utils/encryption';
import { Types } from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import cloudinary from '../../utils/cloudinary';
import mime from 'mime-types';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { PengajuanPenerbitan } from '../../database/schemas/pengajuan/pengajuan_penerbitan';
import { MasterPenulis } from '../../database/schemas/master_data/master_penulis';
import { Pengaju } from '../../database/schemas/pengajuan/pengaju';

class PengajuanController{
    getPengaju = async(req: Request, res: Response) => {
        try {
            const pengaju = await Pengaju.find({})
            .sort('-createdAt');

            if (pengaju?.length === 0) {
                res.status(200).json({
                    msg: "Belum ada data pengaju"
                });
                return;
            }

            res.status(200).json({
                pengaju,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(201).json({
                msg: "Terjadi kesalahan, error : " + JSON.stringify(error)
            });
            return;
        }
    }

    get = async(req: Request, res: Response) => {
        try {
            const pengajuan = await PengajuanPenerbitan.find({})
            .populate('pengaju')
            .sort('-createdAt');

            if (pengajuan?.length === 0) {
                res.status(201).json({
                    msg: 'Belum ada data pengajuan'
                });
                return;
            }

            res.status(200).json({
                pengajuan,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(201).json({
                msg: "Terjadi kesalahan, error : " + JSON.stringify(error)
            });
            return;
        }
    }

    getOne = async(req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const decryptedId = decryptString(id);
            const pengajuan = await PengajuanPenerbitan.findById({ _id: decryptedId });

            if (!pengajuan){
                res.status(201).json({
                    msg: 'Tidak ditemukan pengajuan dengan id tersebut'
                });
                return;
            }

            res.status(200).json({
                pengajuan,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(201).json({
                msg: "Terjadi kesalahan, error : " + JSON.stringify(error)
            });
            return;
        }
    }

    create = async(req: Request, res: Response) => {
        try{
            //Declarations
            const { 
                checkbox,
                pengaju,
                ...rest
            } = req.body;
            const { file_sinopsis } = (req as any).files;

            
            //Validators
            let errorMsg: string = '';
            let requiredFields;

            if(checkbox == 'false' || checkbox == 'undefined' || (checkbox == 'true' && !pengaju)){
                requiredFields = ['nama_pena', 'no_wa', 'email'];
    
                for (const field of requiredFields) {
                    if (!req.body[field] || req.body[field] == 'undefined') {
                        errorMsg += `Tidak ada ${field.replace(/_/g, ' ')}<br>`;
                    }
                }
            }
            
            if(!file_sinopsis){
                errorMsg += `Tidak ada file sinopsis yang terlampir\n`;
            }

            if(errorMsg != ''){
                res.status(201).json({
                    msg: errorMsg
                });
                return;
            }
            

            //Interface
            interface UploadResult {
                secure_url: string
            }


            //Upload Sinopsis
            const validatorMsg: string = this.validateInputs(req);
            if(validatorMsg != ''){
                res.status(201).json({
                    msg: validatorMsg
                });
                return;
            }

            const unique_id = crypto.randomBytes(8).toString("hex");
            const nama_folder = 'forwistree/pengajuan/'+unique_id;
            const fileSinopsisBuffer = file_sinopsis[0].buffer;
            const uploadResult: UploadResult = await new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream({folder: nama_folder+'/file_sinopsis'}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(uploadResult as UploadResult);
                    }
                }).end(fileSinopsisBuffer);
            });
            const file_sinopsis_url = uploadResult.secure_url;

            //Insert Pengajuan
            let pengajuDecrypted;
            let pengajuObj;
            let newPengajuanObj: any;
            const penulisObjectId = new Types.ObjectId();
            const penulisEncryptedId = encryptString(penulisObjectId.toString());
            if(checkbox == 'true' && pengaju){
                pengajuDecrypted = decryptString(pengaju);
                pengajuObj = await Pengaju.findById({ _id: pengajuDecrypted });
                if(pengajuObj){
                    const objectId = new Types.ObjectId();
                    const encryptedId = encryptString(objectId.toString());
                    newPengajuanObj = {
                        _id: objectId,
                        id: encryptedId,
                        pengaju: pengajuDecrypted,
                        file_sinopsis: file_sinopsis_url
                    }
                }else{
                    res.status(201).json({
                        msg: 'Pengaju tidak ditemukan'
                    });
                    return;
                }
            }else{
                const newPenulisObj = {
                    _id: penulisObjectId,
                    id: penulisEncryptedId,
                    nama_pena: req.body.nama_pena,
                    no_wa: req.body.no_wa,
                    email: req.body.email
                }
    
                const newPenulis = await Pengaju.create(newPenulisObj);

                if(!newPenulis){
                    res.status(201).json({
                        msg: 'Data pengaju gagal dibuat'
                    });
                    return;
                }

                const pengajuanObjectId = new Types.ObjectId();
                const pengajuanEncryptedId = encryptString(pengajuanObjectId.toString());
                newPengajuanObj = {
                    _id: pengajuanObjectId,
                    id: pengajuanEncryptedId,
                    pengaju: penulisObjectId,
                    file_sinopsis: file_sinopsis_url,
                }

                pengajuDecrypted = penulisObjectId;
            }

            const newPengajuan = await PengajuanPenerbitan.create(newPengajuanObj);

            if(!newPengajuan){
                res.status(201).json({
                    msg: 'Data pengajuan gagal dibuat'
                });
                return;
            }


            //Insert pengajuan relations
            const penulisRelationObj = await Pengaju.findById({ _id: pengajuDecrypted });
            if(penulisRelationObj){
                penulisRelationObj.pengajuan_penerbitan.push(newPengajuanObj);
                penulisRelationObj.save();
            }else{
                res.status(201).json({
                    msg: 'Relasi penulis tidak ditemukan'
                });
                return;
            }

            
            res.status(201).json({
                pengajuan: newPengajuan,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(201).json({
                msg: "Terjadi kesalahan, error : " + JSON.stringify(error)
            });
            return;
        }
    }

    update = async(req: Request, res: Response) => {
        try {
            //Declarations
            const { id } = req.params;
            const decryptedId = decryptString(id);

            const { 
                checkbox,
                pengaju,
                ...rest
            } = req.body;
            const { file_sinopsis } = (req as any).files;

            const pengajuan = await PengajuanPenerbitan.findById({ _id: decryptedId });
            const pengajuanId = pengajuan?._id;

            if (!pengajuan){
                res.status(201).json({
                    msg: 'Tidak ditemukan pengajuan dengan id tersebut'
                });
                return;
            }
            

            //Validators
            if (Object.keys(req.body).length === 0){
                res.status(201).json({
                    msg: 'Belum ada data yang diinput'
                });
                return;
            }

            const validatorMsg: string = this.validateInputs(req);
            if(validatorMsg != ''){
                res.status(201).json({
                    msg: validatorMsg
                });
                return;
            }

            
            //Interface
            interface UploadResult {
                secure_url: string
            }


            //Delete Sinopsis
            const file_sinopsis_url_db = pengajuan.file_sinopsis;
            const parts = file_sinopsis_url_db.split('/');
            const index = parts.indexOf('forwistree');
            const extractedPart = parts.slice(index).join('/');
            const firstSlashIndex = extractedPart.indexOf('/');
            const secondSlashIndex = extractedPart.indexOf('/', firstSlashIndex + 1);
            const thirdSlashIndex = extractedPart.indexOf('/', secondSlashIndex + 1);
            const extractedPartFinal = extractedPart.substring(0, thirdSlashIndex);

            await new Promise((resolve, reject) => {
                cloudinary.v2.api.delete_resources_by_prefix(extractedPartFinal, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(uploadResult as UploadResult);
                    }
                });
            });
            await new Promise((resolve, reject) => {
                cloudinary.v2.api.delete_folder(extractedPartFinal, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(uploadResult as UploadResult);
                    }
                });
            });


            //Upload Sinopsis
            const unique_id = crypto.randomBytes(8).toString("hex");
            const nama_folder = 'forwistree/pengajuan/'+unique_id;
            const fileSinopsisBuffer = file_sinopsis[0].buffer;
            const uploadResult: UploadResult = await new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream({folder: nama_folder+'/file_sinopsis'}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(uploadResult as UploadResult);
                    }
                }).end(fileSinopsisBuffer);
            });
            const file_sinopsis_url = uploadResult.secure_url;

            
            //Update Pengajuan
            let newPengajuanObj;
            if(checkbox == 'true' && pengaju){
                const pengajuId = decryptString(pengaju);
                newPengajuanObj = {
                    pengaju: pengajuId,
                    file_sinopsis: file_sinopsis_url
                }
            }else{
                const pengajuInsert = {
                    ...rest
                }
                const pengajuId = pengajuan.pengaju;
                const pengajuObj = await Pengaju.findByIdAndUpdate({ _id: pengajuId }, pengajuInsert, { new: true })

                if(!pengajuObj){
                    res.status(201).json({
                        msg: 'Data pengaju gagal diupdate'
                    });
                    return;
                }

                newPengajuanObj = {
                    file_sinopsis: file_sinopsis_url,
                }
            }
            
            const updatedPengajuan = await PengajuanPenerbitan.findByIdAndUpdate({ _id: decryptedId }, newPengajuanObj, { new: true });

            if(!updatedPengajuan){
                res.status(201).json({
                    msg: 'Tidak ditemukan pengajuan dengan id tersebut'
                });
                return;
            }


            if(checkbox == 'true' && pengaju){
                //Remove Old Relations
                const oldPengajuRelationObj = await Pengaju.findById({ _id: pengajuan.pengaju });

                if(oldPengajuRelationObj){
                    oldPengajuRelationObj.pengajuan_penerbitan = oldPengajuRelationObj?.pengajuan_penerbitan.filter(item => item.toString() !== pengajuanId?.toString())
                    oldPengajuRelationObj.save();
                }else{
                    res.status(201).json({
                        msg: 'Relasi pengaju tidak ditemukan'
                    });
                    return;
                }

                
                //Add relations
                const newPengajuRelationObj = await Pengaju.findById({ _id: decryptString(pengaju) });
                
                if(newPengajuRelationObj){
                    newPengajuRelationObj.pengajuan_penerbitan.push(updatedPengajuan._id);
                    newPengajuRelationObj.save();
                }else{
                    res.status(201).json({
                        msg: 'Relasi pengaju tidak ditemukan'
                    });
                    return;
                }
            }

            res.status(200).json({
                pengajuan: pengajuan,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(201).json({
                msg: "Terjadi kesalahan, error : " + JSON.stringify(error)
            });
            return;
        }
    }

    delete = async(req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const decryptedId = decryptString(id);
            const pengajuan = await PengajuanPenerbitan.findByIdAndDelete({ _id: decryptedId });

            if (!pengajuan){
                res.status(201).json({
                    msg: 'Tidak ditemukan pengajuan dengan id tersebut'
                });
                return;
            }

            res.status(200).json({
                pengajuan,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(201).json({
                msg: "Terjadi kesalahan, error : " + JSON.stringify(error)
            });
            return;
        }
    }

    validateInputs = (req: Request) => {
        let errorMsg: string = '';

        const { file_sinopsis } = (req as any).files;

        if(req.body.checkbox == 'false' || req.body.checkbox == 'undefined'){
            if(req.body.nama_pena){
                if (!validator.isAlphanumeric(req.body.nama_pena, undefined, {ignore: ' -,&!.?'})){
                    errorMsg += 'Nama pena tidak valid';
                    errorMsg += '<br>';
                }
                
                if(!validator.isLength(req.body.nama_pena, { max: 30 })){    
                    errorMsg += 'Nama pena maksimal 30 huruf';
                    errorMsg += '<br>';
                }
            }

            if(req.body.email){
                if (!validator.isEmail(req.body.email)){
                    errorMsg += 'Email tidak valid';
                    errorMsg += '<br>';
                }
            }
    
            if(req.body.no_wa){
                if (!validator.isNumeric(req.body.no_wa)){
                    errorMsg += 'Nomor HP tidak valid';
                    errorMsg += '<br>';
                }
            }
        }

        if(file_sinopsis){
            const fileType = mime.contentType(file_sinopsis[0].mimetype);
            if(fileType != 'application/pdf'){
                errorMsg += 'File sinopsis harus file pdf';
                errorMsg += '<br>';
            }

            if(file_sinopsis.length > 1){
                errorMsg += 'File sinopsis tidak boleh lebih dari 1';
                errorMsg += '<br>';
            }
        }

        if(req.body.checkbox == 'true' && req.body.pengaju){
            try {
                const pengajuId = decryptString(req.body.pengaju);
                if(!MasterPenulis.exists({ _id: new Types.ObjectId(pengajuId) })){
                    errorMsg += 'Data pengaju tidak ditemukan';
                    errorMsg += '<br>';
                }
            } catch (error) {
                errorMsg += 'Pengaju tidak valid';
                errorMsg += '<br>';
            }
        }

        return errorMsg;
    }
}

export const pengajuanController = new PengajuanController();