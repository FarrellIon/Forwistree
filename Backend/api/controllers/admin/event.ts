import { Request, Response } from 'express';
import { Admins } from '../../database/schemas/admin/admins';
import { encryptString, decryptString } from '../../utils/encryption';
import { Types } from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import cloudinary from '../../utils/cloudinary';
import mime from 'mime-types';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Events } from '../../database/schemas/events/events';
import { GambarEvent } from '../../database/schemas/events/gambar_event';
import { MitraEvent } from '../../database/schemas/master_data/mitra_event';
import { PivotMitraEvent } from '../../database/schemas/pivot/pivot_mitra_event';

class EventController{
    get = async(req: Request, res: Response) => {
        try {
            const event = await Events.find({})
            .populate('gambar_event', 'image')
            .populate({
                path: 'pivot_mitra_event',
                select: 'mitra',
                populate: {
                    path: 'mitra'
                }
            })
            .sort('-createdAt');

            if (event?.length === 0) {
                res.status(201).json({
                    msg: "Belum ada data event"
                });
                return;
            }

            res.status(200).json({
                event,
                msg: "Berhasil"
            });
            return;
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
            const event = await Events.findById({ _id: decryptedId })
            .populate({
                path: 'pivot_mitra_event',
                select: 'mitra',
                populate: {
                    path: 'mitra'
                }
            })
            .populate('gambar_event', 'image');

            if (!event){
                res.status(500).json('Tidak ditemukan event dengan id tersebut');
                return;
            }

            res.status(200).json({
                event,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(201).json({
                msg: "Terjadi kesalahan, error : " + JSON.stringify(error)
            });
            return;
        }
    }

    getOngoingEvent = async(req: Request, res: Response) => {
        try {
            const now = new Date();

            const event = await Events.findOne({
                tanggal_mulai_pendaftaran: { $lt: now },
                tanggal_penutupan: { $gt: now }
            })
            .populate('gambar_event');

            if (!event){
                res.status(201).json({
                    msg: "Tidak ada event yang sedang berlangsung"
                });
                return
            }

            res.status(200).json({
                event,
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
                judul,
                deskripsi,
                mitra_event,
                ...rest
            } = req.body;
            const { gambar_event } = (req as any).files;

            const requiredFields = ['judul', 'deskripsi', 'tanggal_mulai_pendaftaran', 'tanggal_selesai_pendaftaran', 'tanggal_pembukaan', 'tanggal_mulai_event', 'tanggal_selesai_event', 'tanggal_penutupan', 'cara_bergabung', 'syarat', 'hadiah', 'contact_person', 'mitra_event'];
            

            //Validators
            let errorMsg: string = '';
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    errorMsg += `Tidak ada ${field.replace(/_/g, ' ')}\n`;
                }
            }

            const validatorMsg: string = this.validateInputs(req);
            if(validatorMsg != ''){
                res.status(201).json({
                    msg: validatorMsg
                });
                return;
            }
            
            if(!gambar_event){
                errorMsg += `Tidak ada gambar event yang terlampir\n`;
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

            interface GambarEvent {
                buffer: Buffer
            }


            //Insert Event
            const objectId = new Types.ObjectId();
            const encryptedId = encryptString(objectId.toString());
            const adminEncryptedObjectId = decryptString(req.headers.uservalue as any);
            const adminObjectId = new Types.ObjectId(adminEncryptedObjectId);

            const newEventObj = {
                _id: objectId,
                id: encryptedId,
                judul: judul,
                deskripsi: deskripsi,
                added_by: adminObjectId,
                ...rest
            }

            const newEvent = await Events.create(newEventObj);


            //Upload Gambar Event
            const unique_id = crypto.randomBytes(8).toString("hex");
            const nama_folder = 'forwistree/event/'+judul.replace(/ /g,"_")+'_'+unique_id;
            const gambar_event_array = Array.isArray(gambar_event) ? gambar_event : [gambar_event];
            gambar_event_array.forEach(async (gambar: GambarEvent) => {
                const uploadGambarResult: UploadResult = await new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload_stream({folder: nama_folder}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                        if (error) {
                            return reject(error);
                        } else {
                            return resolve(uploadResult as UploadResult);
                        }
                    }).end(gambar.buffer);
                });

                const gambarObjectId = new Types.ObjectId();
                const encryptedGambarId = encryptString(gambarObjectId.toString());
                const gambar_event_url = uploadGambarResult.secure_url;
                
                const newGambarEventObj = {
                    _id: gambarObjectId,
                    id: encryptedGambarId,
                    event: objectId,
                    image: gambar_event_url
                }
    
                await GambarEvent.create(newGambarEventObj);


                //Add gambar event relation to event
                const eventRelationObj = await Events.findById({ _id: objectId });
                if(eventRelationObj){
                    eventRelationObj.gambar_event.push(newGambarEventObj as any);
                    eventRelationObj.save();
                }
            });

            
            //Insert Mitra
            const mitra_event_array = Array.isArray(mitra_event) ? mitra_event : [mitra_event];
            mitra_event_array.forEach(async (mitra: string) => {
                const pivotMitraEventObjectId = new Types.ObjectId();
                const encryptedMitraEventId = encryptString(pivotMitraEventObjectId.toString());
                const decryptedMitraId = decryptString(mitra);
                const mitraId = new Types.ObjectId(decryptedMitraId);
                
                const newPivotMitraEventObj = {
                    _id: pivotMitraEventObjectId,
                    id: encryptedMitraEventId,
                    event: objectId,
                    mitra: mitraId
                }
    
                await PivotMitraEvent.create(newPivotMitraEventObj);

                
                //Add pivot mitra event relations
                const eventRelationObj = await Events.findById({ _id: objectId });
                if(eventRelationObj){
                    eventRelationObj.pivot_mitra_event.push(pivotMitraEventObjectId);
                    eventRelationObj.save();
                }
                
                const mitraRelationObj = await MitraEvent.findById({ _id: mitraId });
                if(mitraRelationObj){
                    mitraRelationObj.pivot_mitra_event.push(pivotMitraEventObjectId);
                    mitraRelationObj.save();
                }
            });


            //Insert event relations
            const adminRelationObj = await Admins.findById({ _id: adminObjectId });
            if(adminRelationObj){
                adminRelationObj.events.push(newEventObj);
                adminRelationObj.save();
            }

            
            res.status(201).json({
                event: newEvent,
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
                judul,
                mitra_event,
                ...rest
            } = req.body;
            const { gambar_event } = (req as any).files;

            const event = await Events.findById({ _id: decryptedId });

            if (!event){
                res.status(201).json({
                    msg: 'Tidak ditemukan event dengan id tersebut'
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

            interface GambarEvent {
                buffer: Buffer
            }


            //Delete Gambar Event
            if(event.gambar_event.length !== 0 && gambar_event){
                const gambar_event_url_db = event.gambar_event[0];
                const gambar_event = await GambarEvent.findById({ _id: gambar_event_url_db });

                if(gambar_event){
                    const parts = gambar_event.image.split('/');
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
                }
            }


            //Update Mitra
            const newEventObj = {
                judul: judul,
                ...rest
            }
            
            const updatedMitra = await Events.findByIdAndUpdate({ _id: decryptedId }, newEventObj, { new: true });

            if(!updatedMitra){
                res.status(201).json({
                    msg: 'Tidak ditemukan mitra dengan id tersebut'
                });
                return;
            }


            if(gambar_event){
                //Upload Gambar Event
                const unique_id = crypto.randomBytes(8).toString("hex");
                const nama_folder = 'forwistree/event/'+judul.replace(/ /g,"_")+'_'+unique_id;
                const gambar_event_array = Array.isArray(gambar_event) ? gambar_event : [gambar_event];
                gambar_event_array.forEach(async (gambar: GambarEvent, index: number) => {
                    const uploadGambarResult: UploadResult = await new Promise((resolve, reject) => {
                        cloudinary.v2.uploader.upload_stream({folder: nama_folder+'/gambar_event'}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                            if (error) {
                                return reject(error);
                            } else {
                                return resolve(uploadResult as UploadResult);
                            }
                        }).end(gambar.buffer);
                    });

                    const gambarObjectId = new Types.ObjectId();
                    const encryptedGambarId = encryptString(gambarObjectId.toString());
                    const gambar_event_url = uploadGambarResult.secure_url;
                    
                    const newGambarEventObj = {
                        _id: gambarObjectId,
                        id: encryptedGambarId,
                        event: event._id,
                        image: gambar_event_url
                    }
        
                    const updatedGambarEvent = await GambarEvent.create(newGambarEventObj);
                    if(!updatedGambarEvent){
                        res.status(201).json({
                            msg: 'Gagal upload gambar event'
                        });
                        return;
                    }

                    
                    //Add gambar event relation to event
                    const eventRelationObj = await Events.findById({ _id: decryptedId });
                    if(eventRelationObj){
                        if(index === 0){
                            eventRelationObj.gambar_event = [];
                        }
                        eventRelationObj.gambar_event.push(newGambarEventObj as any);
                        eventRelationObj.save();
                    }
                });
            }

            if(mitra_event){
                //Delete Mitra Relations
                const event_obj = await Events.findById({ _id: decryptedId });
                if(event_obj){
                    const old_mitra = event_obj.pivot_mitra_event;
                    const old_mitra_array = Array.isArray(old_mitra) ? old_mitra : [old_mitra];

                    old_mitra_array.forEach(async (mitra: Types.ObjectId, index: number) => {
                        const pivotMitraRelationObj = await PivotMitraEvent.findById({ _id: mitra });
                        
                        if(pivotMitraRelationObj){
                            const mitraRelationObj = await MitraEvent.findById({ _id: pivotMitraRelationObj.mitra });
                            
                            if(mitraRelationObj){
                                mitraRelationObj.pivot_mitra_event = [];
                                mitraRelationObj.save();
                            }
                        }
                    });
                }else{
                    res.status(201).json({
                        msg: 'Event tidak ditemukan'
                    });
                    return;
                }
            

                //Insert Mitra
                const mitra_event_array = Array.isArray(mitra_event) ? mitra_event : [mitra_event];
                mitra_event_array.forEach(async (mitra: string, index: number) => {
                    const pivotMitraEventObjectId = new Types.ObjectId();
                    const encryptedMitraEventId = encryptString(pivotMitraEventObjectId.toString());
                    const decryptedMitraId = decryptString(mitra);
                    const mitraId = new Types.ObjectId(decryptedMitraId);
                    const mitraRelationObj = await MitraEvent.findById({ _id: mitraId });

                    const eventRelationObj = await Events.findById({ _id: event._id });
                    
                    const newPivotMitraEventObj = {
                        _id: pivotMitraEventObjectId,
                        id: encryptedMitraEventId,
                        event: event._id,
                        mitra: mitraId
                    }
        
                    const updatedPivotMitraEvent = await PivotMitraEvent.create(newPivotMitraEventObj);
                    if(!updatedPivotMitraEvent){
                        res.status(201).json({
                            msg: 'Gagal upload gambar event'
                        });
                        return;
                    }


                    //Add pivot event relations
                    if(eventRelationObj){
                        if(index === 0){
                            eventRelationObj.pivot_mitra_event = [];
                        }
                        eventRelationObj.pivot_mitra_event.push(pivotMitraEventObjectId);
                        eventRelationObj.save();
                    }
                    
                    if(mitraRelationObj){
                        mitraRelationObj.pivot_mitra_event.push(pivotMitraEventObjectId);
                        mitraRelationObj.save();
                    }
                });
            }

            res.status(200).json({
                event: event,
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
            const event = await Events.findByIdAndDelete({ _id: decryptedId });

            if (!event){
                res.status(201).json({
                    msg: 'Tidak ditemukan event dengan id tersebut'
                });
                return;
            }

            res.status(200).json({
                event,
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

        interface GambarEvent {
            buffer: Buffer,
            mimetype: any
        }

        const { gambar_event } = (req as any).files;

        if(req.body.judul){
            if (!validator.isAlphanumeric(req.body.judul, undefined, {ignore: ' -,&!.?'})){
                errorMsg += 'Judul event tidak valid';
                errorMsg += '\n';
            }

            if(!validator.isLength(req.body.judul, { min: 1, max: 40 })){    
                errorMsg += 'Judul event harus sepanjang 1-40 huruf';
                errorMsg += '\n';
            }
        }

        if(req.body.deskripsi){
            if (!validator.isAlphanumeric(req.body.deskripsi, undefined, {ignore: ' -,&!.?'})){
                errorMsg += 'Deskripsi event tidak valid';
                errorMsg += '\n';
            }

            if(!validator.isLength(req.body.deskripsi, { min: 1, max: 200 })){    
                errorMsg += 'Deskripsi event harus sepanjang 1-200 huruf';
                errorMsg += '\n';
            }
        }

        if(req.body.tanggal_mulai_pendaftaran){
            if(!validator.isDate(req.body.tanggal_mulai_pendaftaran)){
                errorMsg += 'Tanggal mulai pendaftaran belum memiliki format yang benar';
                errorMsg += '\n';
            }
        }

        if(req.body.tanggal_selesai_pendaftaran){
            if(!validator.isDate(req.body.tanggal_selesai_pendaftaran)){
                errorMsg += 'Tanggal selesai pendaftaran belum memiliki format yang benar';
                errorMsg += '\n';
            }
        }

        if(req.body.tanggal_pembukaan){
            if(!validator.isDate(req.body.tanggal_pembukaan)){
                errorMsg += 'Tanggal pembukaan belum memiliki format yang benar';
                errorMsg += '\n';
            }
        }

        if(req.body.tanggal_mulai_event){
            if(!validator.isDate(req.body.tanggal_mulai_event)){
                errorMsg += 'Tanggal mulai event belum memiliki format yang benar';
                errorMsg += '\n';
            }
        }

        if(req.body.tanggal_selesai_event){
            if(!validator.isDate(req.body.tanggal_selesai_event)){
                errorMsg += 'Tanggal selesai event belum memiliki format yang benar';
                errorMsg += '\n';
            }
        }

        if(req.body.tanggal_penutupan){
            if(!validator.isDate(req.body.tanggal_penutupan)){
                errorMsg += 'Tanggal penutupan belum memiliki format yang benar';
                errorMsg += '\n';
            }
        }

        if(req.body.cara_bergabung){
            if (!validator.isAlphanumeric(req.body.cara_bergabung, undefined, {ignore: ' -,&!.?'})){
                errorMsg += 'Cara bergabung event tidak valid';
                errorMsg += '\n';
            }

            if(!validator.isLength(req.body.cara_bergabung, { min: 1, max: 200 })){    
                errorMsg += 'Cara bergabung event harus sepanjang 1-200 huruf';
                errorMsg += '\n';
            }
        }
        
        if(req.body.syarat){
            if (!validator.isAlphanumeric(req.body.syarat, undefined, {ignore: ' -,&!.?'})){
                errorMsg += 'Syarat tidak valid';
                errorMsg += '\n';
            }

            if(!validator.isLength(req.body.syarat, { min: 1, max: 200 })){    
                errorMsg += 'Syarat harus sepanjang 1-200 huruf';
                errorMsg += '\n';
            }
        }

        if(req.body.hadiah){
            if (!validator.isAlphanumeric(req.body.hadiah, undefined, {ignore: ' -,&!.?'})){
                errorMsg += 'Hadiah tidak valid';
                errorMsg += '\n';
            }

            if(!validator.isLength(req.body.hadiah, { min: 1, max: 200 })){    
                errorMsg += 'Hadiah harus sepanjang 1-200 huruf';
                errorMsg += '\n';
            }
        }

        if(req.body.contact_person){
            if (!validator.isAlphanumeric(req.body.contact_person, undefined, {ignore: ' -,&!.?:'})){
                errorMsg += 'Contact person tidak valid';
                errorMsg += '\n';
            }

            if(!validator.isLength(req.body.contact_person, { min: 1, max: 200 })){    
                errorMsg += 'Contact person harus sepanjang 1-200 huruf';
                errorMsg += '\n';
            }
        }

        if(gambar_event){
            let counter: number = 0;
            const gambar_event_array = Array.isArray(gambar_event) ? gambar_event : [gambar_event];
            gambar_event_array.forEach((gambar: GambarEvent) => {
                const fileType = mime.contentType(gambar.mimetype);

                if(fileType != 'image/jpeg' && fileType != 'image/webp' && fileType != 'image/png') counter++;
            });

            if(counter !== 0){
                errorMsg += 'Semua gambar event yang terlampir harus berformat jpeg/png/webp';
                errorMsg += '\n';
            }

            if(gambar_event.length > 5){
                errorMsg += 'Gambar event tidak boleh lebih dari 5';
                errorMsg += '\n';
            }
        }

        if(req.body.mitra_event){
            let mitra_event = req.body.mitra_event;
            const mitra_event_array = Array.isArray(mitra_event) ? mitra_event : [mitra_event];
            
            mitra_event_array.forEach(async (mitra: string) => {
                const mitraId = decryptString(mitra);
                if(!MitraEvent.exists({ _id: new Types.ObjectId(mitraId) })){
                    errorMsg += 'Mitra tidak ditemukan';
                    errorMsg += '\n';
                    return errorMsg;
                }
            });
        }

        return errorMsg;
    }
}

export const eventController = new EventController();