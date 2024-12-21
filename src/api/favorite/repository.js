const { pool } = require('../../database');

exports.favoriteToggle = async (feedId, userId) => {
  // 즐겨찾기 상태 확인 쿼리
  const checkQuery = `SELECT * FROM favorite WHERE feed_id = ? AND user_id = ?`;
  const checkResult = await pool.query(checkQuery, [feedId, userId]);
  // 이미 즐겨찾기에 추가된 경우 제거
  if (checkResult.length > 0) {
    const deleteQuery = `DELETE FROM favorite WHERE feed_id = ? AND user_id = ?`;
    await pool.query(deleteQuery, [feedId, userId]);
    return { result: 'removed' };
  }
  // 즐겨찾기에 추가되지 않은 경우 추가
  else {
    const insertQuery = `INSERT INTO favorite (feed_id, user_id) VALUES (?, ?)`;
    await pool.query(insertQuery, [feedId, userId]);
    return { result: 'added' };
  }
}

exports.getFavoritesByUserId = async (userId, page, size) => {
    const offset = (page - 1) * size;
    const query = `
  SELECT feed.*, u.name AS user_name, f.id AS image_id,
  (SELECT COUNT(*) FROM favorite WHERE favorite.feed_id = feed.id) AS favorite_
  count
  FROM favorite
  JOIN feed ON favorite.feed_id = feed.id
  LEFT JOIN user u ON u.id = feed.user_id
  LEFT JOIN files f ON feed.image_id = f.id
  WHERE favorite.user_id = ?
  ORDER BY favorite.created_at DESC
  LIMIT ? OFFSET ?
  `;
    return await pool.query(query, [userId, size, offset]);
};