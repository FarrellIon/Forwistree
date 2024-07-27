import { Admins } from "../database/schemas/admin/admins";
import { decryptString } from "../utils/encryption";
import { Types } from 'mongoose';

async function authDetailController (request: any, response: any) {
    if(!request.headers.uservalue){
        response.status(201).json({
            msg: "Belum disertakan id unik user"
        });
    }
    const adminEncryptedObjectId = decryptString(request.headers.uservalue as any);
    const adminObjectId = new Types.ObjectId(adminEncryptedObjectId);
    
    const userDB = await Admins.findOne({ _id: adminObjectId });

    if(userDB){
        response.status(201).json({
            username: userDB.username,
            msg: "Berhasil"
        });
    }else{
        response.status(201).json({
            msg: "Tidak ditemukan admin dengan id unik tersebut"
        });
    }
};

export default authDetailController;