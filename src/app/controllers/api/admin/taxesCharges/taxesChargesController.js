import Charges from '../../../../models/taxesCharges'
import Logger from '../../../../lib/logger'
import { response_200, setResponse, response_500, response_400 } from '../../../../lib/apiResponseFormat'


export async function updateCharges(req, res) {
    try {
        const index = ['TAX', 'PER_KM', 'PER_MIN', 'BASE_FAIR'].indexOf(req.body.tax_type)
        if (index > -1) {
            await Charges.update({
                amount: req.body.amount,
                modified_by: req['emp_id']
            }, {
                    where: {
                        name: req.body.tax_type,
                        id: req.body.tax_id
                    }
                }
            )
            Logger.info(`${req.body.type} updated successfully`)
            return setResponse(res, response_200(`${req.body.tax_type} updated successfully`))
        }
        return setResponse(res, response_400("change the charges type", "Invalid charges type found"))
    } catch (error) {
        Logger.error(`Error while updating charges: ${error.message}`)
        return setResponse(res, response_500("Error while updating charges", error.message))
        
    }
    
}

export async function getAllCharges(req, res) {
    try {
        const charges = await Charges.findAll({
            where: {
                deletedAt: null
            }
        })
        return setResponse(res, response_200({charges}))
    } catch (error) {
        Logger.error(`Error while getting charges: ${error.message}`)
        return setResponse(res, response_500({charges: []}, error.message))
        
    }
}