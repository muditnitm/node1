
import WalletTransaction from '../../../../models/walletTransaction'
import User from '../../../../models/user'
import { response_200, response_500, setResponse } from '../../../../lib/apiResponseFormat'
import { sequelize } from '../../../../config/db'

export async function addToWallet(req, res) {
    try {
        const user = await User.findOne({
            where: {
                id: req['emp_id']
            }
        })
        if (user) {
            await sequelize.transaction(t => {
                return Promise.all([
                    WalletTransaction.create({
                        amount: +req.body.amount,
                        type: 'CREDIT',
                        json: req.body.json ? req.body.json : '',
                        user_id: req['emp_id']
                    }, t),
                    User.update({
                        wallet: user.wallet + (+req.body.amount)
                    }, {
                            where: {
                                id: req['emp_id']
                            }
                        }, t)
                ])
            })
        }
        setResponse(res, response_200("amount has been added to your wallet"))
    } catch (error) {
        setResponse(res, response_500("Error while adding amount your wallet", error.message))
    }
}