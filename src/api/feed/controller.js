const repository = require('./repository')
const favoriteRepository = require('../favorite/repository');

exports.favoriteToggle = async (req, res) => {
  try {
    const feedId = req.params.id;
    const userId = req.user.id;

    // 즐겨찾기 토글
    const result = await favoriteRepository.favoriteToggle(feedId, userId);

    // 클라이언트에 결과 반환
    res.send({ result: 'ok', action: result.result });
  } catch (error) {
    console.error(error);
    res.send({ result: 'fail', message: '오류가 발생하였습니다.' });
  }
};

exports.index = async (req, res) => {
  const { page = 1, size = 10, keyword = '' } = req.query;

  const userId = req.user.id; // 현재 로그인한 사용자의 ID

  // 사용자 입력에서 불필요한 공백을 제거하고, 대소문자 구분 없이 검색하기 위해 소문자로 변환
  const trimmedKeyword = keyword.trim().toLowerCase();
  const items = await repository.index(page, size, trimmedKeyword);
  const modifiedItems = items.map(item => ({
    ...item,
    is_me: (userId == item.user_id)
  }));
  res.json({ result: 'ok', data: modifiedItems });
}

exports.store = async (req, res) => {
  const body = req.body;
  const user = req.user;

  const result = await repository.create(user.id, body.title, body.content, body.price, body.imageId);

  if (result.affectedRows > 0) {
    res.send({ result: 'ok', data: result.insertId });   
  } else {
    res.send({ result: 'fail', message: '오류가 발생하였습니다.' });
  }
}

exports.show = async (req, res) => {
  const id = req.params.id;
  const user = req.user;

  const item = await repository.show(id, user.id);

  const modifiedItem = {
    ...item,
    writer: {
      id: item.user_id,
      name: item.user_name,
      profile_id: item.user_profile
    },
    is_favorited: Boolean(item.is_favorited) // 1 또는 0을 boolean으로
  };

  delete modifiedItem.user_name;
  delete modifiedItem.user_profile;
  modifiedItem['is_me'] = (user.id == item.user_id);

  res.send({ result: 'ok', data: modifiedItem });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const user = req.user;

  const item = await repository.show(id)

  if (user.id !== item.user_id) {
    res.send({ result: 'fail', message: '타인의 글을 수정할 수 없습니다.' })
  }

  const result = await repository.update(body.title, body.content, body.price, body.imageId, id);

  if (result.affectedRows > 0) {
    res.send({ result: 'ok', data: body });
  } else {
    res.send({ result: 'fail', message: '오류가 발생하였습니다.' });
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const item = await repository.show(id);

  if (user.id !== item.user_id) {
    res.send({ result: 'fail', message: '타인의 글을 삭제할 수 없습니다.' })
  } else {
    await repository.delete(id);
    res.send({ result: "ok", data: id });
  }
}
exports.myFeed = async (req, res) => {
  const { page = 1, size = 10 } = req.query;
  const userId = req.user.id; // 현재 로그인한 사용자의 ID
  const items = await repository.index(page, size, null, userId);
  const modifiedItems = items.map(item => ({
    ...item,
    is_me: true
  }));
  res.json({ result: 'ok', data: modifiedItems });
}

exports.getFavoriteFeeds = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const userId = req.user.id;
    const favoriteFeeds = await favoriteRepository.getFavoritesByUserId(userId, page, size);
    
    res.json({ result: 'ok', data: favoriteFeeds });
  } catch (error) {
    console.error(error);
    res.status(500).send({ result: 'fail', message: '오류가 발생하였습니다.' });
  }
};