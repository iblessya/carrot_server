const { pool } = require('../../database');

exports.index = async (page, size) => {
  const offset = (page - 1) * size;
  const query = `SELECT * FROM community ORDER BY community.id DESC LIMIT ? OFFSET ?`;
  return await pool.query(query, [size, offset]);
};

exports.create = async (user, title, content, category, image) => {
  const query = `INSERT INTO community
(user_id, title, content, category, image_id)
VALUES (?,?,?,?,?)`;
  // image가 undefined인 경우 null로 설정
  const imageId = image === undefined ? null : image;
  return await pool.query(query, [user, title, content, category, imageId]);
};

exports.show = async (id) => {
  const query = `
SELECT community.*, u.name user_name, u.profile_id user_profile, image_id
FROM community
LEFT JOIN user u on u.id = community.user_id
LEFT JOIN files f1 on community.image_id = f1.id
LEFT JOIN files f2 on u.profile_id = f2.id
WHERE community.id = ?`;
  let result = await pool.query(query, [id]);
  return (result.length < 0) ? null : result[0];
};

exports.update = async (title, content, category, imageId, id) => {
  const query = `UPDATE community SET title = ? ,content = ?, category = ?, image_id =
? WHERE id = ?`;
  return await pool.query(query, [title, content, category, imageId, id]);
};

exports.delete = async (id) => {
  return await pool.query(`DELETE FROM community WHERE id = ?`, [id]);
};