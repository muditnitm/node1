import authenticator from 'otplib/authenticator'
import crypto from 'crypto'
authenticator.options = { crypto }

export function generateOTP() {
    return authenticator.generate(process.env.OTP_SECRET)
}

export function verifyOTP(otp) {
    try {
        return authenticator.check(otp, process.env.OTP_SECRET)
    } catch (error) {
        return false
    }
}