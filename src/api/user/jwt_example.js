const jwt = require('jsonwebtoken');

const util = require('util');
const signAsync = util.promisify(jwt.sign);
const verifyAsync = util.promisify(jwt.verify);

const privateKey = 'my_private_key';

async function generateAndVerifyToken() {
    try{
        // 토큰 생성
        let token = await signAsync({foo: 'bar'}, privateKey);
        // 토큰 검증
        let decoded = await verifyAsync(token, privateKey);

        console.log(decoded);
    }catch(error){
        console.error('Error handling token:', error);
    }
}

generateAndVerifyToken();