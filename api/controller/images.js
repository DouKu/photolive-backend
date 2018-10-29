'use strict';
import nconf from 'nconf';
import { getFsize } from '../service/qiniu';
import { dbFindById, dbUpdate, dbCreate } from '../service/dbtools';

const uploadImg = async ctx => {
  ctx.verifyParams({
    origin: 'string',
    tiny: 'string',
    min: { type: 'string', required: false },
    type: { type: 'int', required: false },
    tagId: { type: 'int', required: false },
    des: { type: 'string', required: false, max: 30 }
  });
  const body = ctx.request.body;
  const albumId = Number(ctx.params.albumId);
  const album = await dbFindById('Albums', albumId);
  const fSize = await checkUploadImg(body, album, ctx);
  const newImg = Object.assign({ albumId, size: fSize }, body);
  console.log(newImg);
  const data = await dbCreate('Images', newImg);
  console.log(data);
  await dbUpdate('Albums', {
    storeUse: album.storeUse + fSize,
    imgNum: album.imgNum + 1
  }, { where: { id: albumId } });
  ctx.body = {
    code: 200,
    data
  };
};

async function checkUploadImg (body, album, ctx) {
  checkAlbumOwner(album, ctx);
  for (let key of nconf.get('imgUrls')) {
    try {
      console.log(body[key]);
      const a = await getFsize(body[key]);
      console.log(a);
    } catch (error) {
      console.log(error);
      ctx.throw(500, error);
    }
  }
  if (!body.type || body.type === nconf.get('imgTyp').img) {
    if (!body.tagId) ctx.throw(400, '缺少图片标签');
  }
  const fSize = getFsize(body.origin);
  if (fSize + album.storeUse >= album.store) {
    ctx.throw(400, '存储空间不足请升级相册存储空间或删除其他照片重试');
  }
  return fSize;
}

export {
  uploadImg
};

function checkAlbumOwner (albumObj, ctx) {
  if (albumObj.userId !== ctx.state.userMess.id) {
    ctx.throw(403, '无权修改该相册');
  }
}
