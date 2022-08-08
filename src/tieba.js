const service = require('../service');
const { TIEBA } = require('../config');
const sendEmail  = require('./email');

//  签到成功自动抽奖一次(免费的)
// console.log(process.env)
if (!TIEBA) {
  console.log(`获取不到cookie,请检查设置`)
} else {
  //  百度贴吧签到
  service.getTbs(TIEBA).then(res => {
    const tbs = res.tbs;
    service.checkInBaiDu({ tbs }, TIEBA).then(() => {
      console.log(`百度贴吧签到成功`)
    }).catch(err => {
      sendEmail(false, [{ msg: '贴吧签到失败' }]);
      console.log(`贴吧签到失败`, err)
    })
  })
}
