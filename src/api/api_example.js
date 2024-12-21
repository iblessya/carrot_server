//mysql2/promise 모듈을 사용하여 비동기 처리를 지원
const mysql = require('mysql2/promise');

//데이터베이스 연결 설정
async function connectDB() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'test'
        });

        // 플레이스홀더를 사용한 SQL 쿼리 실행
        const [results, fields] = await connection.query(
            'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
            ['Page', 45]
        );

        console.log(results);
        console.log(fields);
    }catch(err){
        console.error('Database connection error:', err);
    }
}

connectDB();