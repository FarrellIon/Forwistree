import { Admins } from "../database/schemas/admin/admins";
import { encryptString, decryptString } from "../utils/encryption";
import { hashPassword } from "../utils/hashing";
import { Types } from 'mongoose';

async function authRegisterController (request: any, response: any) {
    const { username, password } = request.body;
    if(!username || !password){
        response.status(400);
        response.send({ msg: 'Username atau password masih kosong' });
    }
    const userDB = await Admins.findOne({
        $or: [{username}]
    });
    if(userDB){
        response.status(400);
        response.send({ msg: 'Admin dengan nama tersebut sudah ada' });
    }else{
        const passwordHashed = hashPassword(password);
        const objectId = new Types.ObjectId();
        const encryptedId = encryptString(objectId.toString());

        const adminObj = {
            _id: objectId,
            id: encryptedId,
            username: username,
            password: passwordHashed
        }

        const newUser = await Admins.create(adminObj);
        response.status(201).send(newUser);
    }
};

export default authRegisterController;