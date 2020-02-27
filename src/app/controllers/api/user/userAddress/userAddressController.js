import Address from '../../../../models/address'
import EmergencyContact from '../../../../models/emergencyContact'
import { response_200, response_401, response_404, response_500, setResponse } from '../../../../lib/apiResponseFormat'

export async function createAddress(req, res) {
    try {
        await Address.create({
            name: req.body.name,
            type: req.body.type,
            lattitude: req.body.lattitude,
            langitude: req.body.langitude,
            user_id: req['emp_id']
        })
        setResponse(res, response_200("Address created succwssfully"))
    } catch (error) {
        setResponse(res, response_500("Error while creating address", error.message))
    }
}

export async function deleteAddress(req, res) {
    try {
        await Address.delete({
            where: {
                id: req.query.id,
                user_id: req['emp_id']
            }
        })
        setResponse(res, response_200("Address deleted succwssfully"))
    } catch (error) {
        setResponse(res, response_500("Error while deleting address", error.message))
    }
}

export async function updateAddress(req, res) {
    try {
        const updated = await Address.update(
            {
                name: req.body.name,
                type: req.body.type,
                lattitude: req.body.lattitude,
                langitude: req.body.langitude,
                user_id: req['emp_id']
            },
            {
                where: {
                    id: req.body.id
                }
            })
        if (updated[0] === 0)
            return setResponse(res, response_200("Specified Address not found"))
        return setResponse(res, response_200("Address updated succwssfully"))
    } catch (error) {
        setResponse(res, response_500("Error while updating address", error.message))
    }
}

export async function getAddress(req, res) {
    try {
        return setResponse(res, response_200(await Address.findAll({where: {
            user_id: req['emp_id']
        }})))
    } catch (error) {
        setResponse(res, response_500("Error while getting address", error.message))
    }
}

export async function createEmergencyContact(req, res) {
    try {
        await EmergencyContact.create({
            name: req.body.name,
            type: req.body.type,
            contact: req.body.contact,
            user_id: req['emp_id']
        })
        setResponse(res, response_200("emergency contact created succwssfully"))
    } catch (error) {
        setResponse(res, response_500("Error while creating emergency contact", error.message))
    }
}

export async function updateEmergencyContact(req, res) {
    try {
        const updated = await EmergencyContact.update(
            {
                name: req.body.name,
                type: req.body.type,
                contact: req.body.contact,
                user_id: req['emp_id']
            },
            {
                where: {
                    id: req.body.id
                }
            })
        if (updated[0] === 0)
            return setResponse(res, response_200("Specified Emergency contact not found"))
        return setResponse(res, response_200("emergency contact updated succwssfully"))
    } catch (error) {
        setResponse(res, response_500("Error while updating emergency contact", error.message))
    }
}

export async function getEmergencyContact(req, res) {
    try {
        return setResponse(res, response_200(await EmergencyContact.findAll({where: {
            user_id: req['emp_id']
        }})))
    } catch (error) {
        setResponse(res, response_500("Error while getting address", error.message))
    }
}
