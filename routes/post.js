const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error("No uploads dir, creating upload dir");
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
router.post('/img', isLoggedIn, upload.single('img'), (req, res, next) => { // 'img'는 form에서 전송해줄때 키
  console.log(req.file); // 업로드 완료시 req.file에 결과가 적혀 있게 됨
  res.json({ url: `/img/${req.file.filename}` });
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // body-parser사용하지 않고 multer로 req.body 요청시는 none() 호출
  try {
    req.body.content.match(/a/);
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    console.log('----------------');
    console.log({ hashtags });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          console.log('creates idv tags and hashtag');
          console.log(tag);
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() }
          });
        })
      );
      console.log('------hashtag results----------');
      console.log(result);
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;