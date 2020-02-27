import UserQuery from '../../../../models/userQuery'
import Queryeply from '../../../../models/queryeply'
import QueryTypes from '../../../../models/queryTypes'
import { response_200, response_500, setResponse } from '../../../../lib/apiResponseFormat'

export async function postQuery(req, res) {
    try {
        await UserQuery.create({
            title: req.body.title,
            description: req.body.description,
            user_id: req['emp_id'],
            query_type: req.body.query_type
        })
        setResponse(res, response_200("your query has posted"))
    } catch (error) {
        setResponse(res, response_500("Error while posting your query", error.message))
    }
}

export async function updateQuery(req, res) {
    try {
        await UserQuery.update({
            status: req.body.status
        }, {
                where: {
                    id: req.body.id
                }
            })
        setResponse(res, response_200("your query has updated"))
    } catch (error) {
        setResponse(res, response_500("Error while updating your query", error.message))
    }
}

export async function getAllQuery(req, res) {
    try {
        if (req['role'] === 'ADMIN') {
            return setResponse(res, response_200(await UserQuery.findAll({
                include: [{
                    model: QueryTypes
                }, {
                    model: Queryeply
                }],
                order: [
                    ['updatedAt', 'DESC'],
                    [Queryeply, 'createdAt', 'DESC']
                ]
            })))
        }
        return setResponse(res, response_200(await UserQuery.findAll({
            where: {
                user_id: req['emp_id']
            }
        })))
    } catch (error) {
        setResponse(res, response_500("Error while getting query", error.message))
    }
}

export async function getQueryTypes(req, res) {
    try {
        return setResponse(res, response_200(await QueryTypes.findAll({
            where: {
                active: true
            }
        })))
    } catch (error) {
        setResponse(res, response_500("Error while getting query types", error.message))
    }
}

export async function replyToQuery(req, res) {
    try {
        await Queryeply.create({
            isAdmin: req.role === 'ADMIN' ? true : false,
            description: req.body.description,
            query_id: req.body.query_id
        })
        setResponse(res, response_200("Posted reply successfully"))
    } catch (error) {
        setResponse(res, response_500("Error while posting reply", error.message))
    }
}