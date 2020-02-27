import { uploadToS3, getData, deleteDocument } from '../../../../services/awsProvider'
import UserDoc from '../../../../models/documents'
import fs from 'fs'


export async function uploadDoc(req, res) {
    try {
        console.log(req)
        const url = await uploadToS3(`driver/1/a.png`, req.files.file.data)
        const document = await UserDoc.create({
            name: req.body.name,
            url,
            type: req.body.type ? req.body.type : null
        })
        
        res.send("document")
    } catch (error) {
        console.log(error)
    }
}

export async function getDoc(req, res) {
    try {
        const response = await getData("driver/1/Screenshot(6).png")
        res.writeHead(200, { 'Content-Type': 'image/png' })
        res.end(response, 'binary')
    } catch (error) {
        console.log(error)
    }
}

export async function deleteDoc(req, res) {
    try {
        const response = await deleteDocument("Screenshot(6).png")
        res.send(response)
    } catch (error) {
        console.log(error)
    }
}