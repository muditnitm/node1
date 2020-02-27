import AWS from 'aws-sdk'
import Logger from '../lib/logger';


var s3;

process.nextTick(() => {
    AWS.config.update({ region: 'ap-south-1' })
    s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })
    console.log(`${process.env.AWS_ACCESS_KEY}, ${process.env.AWS_SECRET_ACCESS_KEY}`)

})
export async function uploadToS3(name, data, Data_Cash = true) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name,
        Body: data,
        ACL: 'public-read'
    }
    if (!Data_Cash) {
        params["CacheControl"] = "no-cache"
    }
    
    try {
        const response = await s3.upload(params).promise()
        console.log(`File uploaded successfully ${response.Location}`)
        Logger.info(`File uploaded successfully ${response.Location}`)
        return response.Location
    } catch (error) {
        console.log(error)
        throw s3Err
    }

}

export async function getData(name) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name,
    }
    try {
        const response = await s3.getObject(params).promise()
        return response.Body.toString('binary')

    } catch (error) {
        console.log(error)
        return false
    }
}

export async function deleteDocument(name) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name,
    }
    try {
        const response = await s3.deleteObject(params).promise()
        console.log(response, params)
        return response

    } catch (error) {
        console.log(error)
        return false
    }
}