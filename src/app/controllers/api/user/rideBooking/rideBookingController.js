import {response_200, response_500, setResponse} from '../../../../lib/apiResponseFormat'

export async function bookRide(req, res) {
    setResponse(res, response_200({
        name: 'Test Driver',
        email: 'test@gmail.com',
        lattitude: '2212121',
        langitude: '34343423',
        pno: 1234567898
    }))
}