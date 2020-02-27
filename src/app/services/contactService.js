import { apiCall } from './httpClient'

// const url = `https://${process.env.API_KEY}:${process.env.API_TOKEN}${process.env.API_DOMAIN}/v1/Accounts/${process.env.ACCOUNT_SID}/`
var url = 'https://bsms.chat2friend.co.in/api/sendsms?route=Transactional&senderid=HELLOO&'
// const sendSMS = 'Sms/send'
// const from = '09513886363'

export async function sendSms(to, body) {
    const postUrl = url + `message=${body}&mobilenumber=${to}&userid=nitm&password=123456`
    // const options = {
    //     from,
    //     to,
    //     body
    // }
    return await apiCall('post', postUrl)
}