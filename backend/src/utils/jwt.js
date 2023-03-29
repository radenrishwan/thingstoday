import jwt from 'jsonwebtoken';

const generateToken = ({ name, email, id }) => {
    const token = jwt.sign({
        id: id,
        name: name,
        email: email,
        sign_in_provider: "thinstoday.com"
    }, process.env.SECRET_KEY, {
        expiresIn: '7 days',
        algorithm: 'HS256'
    }) 

    return token
}

const verifyToken = ({ token }) => {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    return decoded
}

export {
    generateToken,
    verifyToken
}