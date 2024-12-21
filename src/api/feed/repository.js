const { pool } = require('../../database')

exports.index = async (page, size, keyword, userId) => {
  const offset = (page - 1) * size;

  let query = 
  `SELECT feed.*, u.name AS user_name, f.id AS image_id,
  (SELECT COUNT(*) FROM favorite WHERE favorite.feed_id = feed.id) AS favorite_count,
  (SELECT COUNT(DISTINCT room.id)
  FROM room
  LEFT JOIN chat ON room.id = chat.room_id
  WHERE room.feed_id = feed.id AND chat.id IS NOT NULL) AS chat_count
  FROM feed
  LEFT JOIN user u ON u.id = feed.user_id
  LEFT JOIN files f ON feed.image_id = f.id`;

  const whereClause = [], params = [];

  if (keyword) {
    query += ` WHERE LOWER(feed.title) LIKE ? OR LOWER(feed.content) LIKE ?`;
    const keywordParam = `%${keyword}%`;
    params.push(keywordParam, keywordParam);
    if (userId) {
      whereClause.push(`feed.user_id = ?`);
      params.push(userId);
      if (whereClause.length > 0) {
        query += ` WHERE ` + whereClause.join(' AND ');
      }
    }
  }

  query += ` ORDER BY feed.id DESC LIMIT ? OFFSET ?`;
  params.push(`${size}`, `${offset}`);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>> before index");
  let result = await pool.query(query, params);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>> after index");
  return result;
}

exports.create = async (user, title, content, price, image) => {
  const query = `INSERT INTO feed
(user_id, title, content, price, image_id)
VALUES (?,?,?,?,?)`;
  // image가 undefined인 경우 null로 설정
  const imageId = image === undefined ? null : image;
  return await pool.query(query, [user, title, content, price, imageId]);
}

exports.show = async (id, userId) => {
  const query = `
  SELECT feed.*, u.name user_name, u.profile_id user_profile, image_id,
  EXISTS (SELECT 1 FROM favorite WHERE favorite.feed_id = feed.id AND favorite.
  user_id = ?) AS is_favorited
  FROM feed
  LEFT JOIN user u on u.id = feed.user_id
  LEFT JOIN files f1 on feed.image_id = f1.id
  LEFT JOIN files f2 on u.profile_id = f2.id
  WHERE feed.id = ?`;
  let result = await pool.query(query, [userId, id]);
  return (result.length < 0) ? null : result[0];
}

exports.update = async (title, content, price, imgid, id) => {
  const query = `UPDATE feed SET title = ? ,content = ?, price = ?, image_id = ? WHERE id =
?`;
  return await pool.query(query, [title, content, price, imgid, id]);
}

exports.delete = async id => {
  return await pool.query(`DELETE FROM feed WHERE id = ?`, [id]);
}