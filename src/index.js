const service = require('../service');
const { JUEJIN, TIEBA, BILI, QQ, EMAIL } = require('../config');
const sendEmail  = require('./email');

//  掘金
function juejin() {
  return new Promise((resolve) => {
    let text = '未签到';
    if(JUEJIN) {
      service.checkIn(JUEJIN).then(_ => {
        service.lottery(JUEJIN);
        service.getBigService(JUEJIN).then((res) => {
          const id = res.lotteries[0]['user_id'];
          service.luckyService(id, JUEJIN);
        })
        text = '签到成功';
        resolve({ code: 200, msg: `掘金签到：${text}` });
      }).catch(err => {
        text = '签到失败';
        console.log('掘金签到失败：', err);
        resolve({ code: 400, msg: `掘金签到：${text}` });
      })
    } else {
      text = '未设置cookie';
      resolve({ code: 400, msg: `掘金签到：${text}` });
    }
  })
}

//  百度贴吧
function tieba() {
  return new Promise((resolve) => {
    let text = '未签到';
    if(TIEBA) {
      service.getTbs(TIEBA).then(res => {
        const tbs = res.tbs;
        service.checkInBaiDu({ tbs }, TIEBA).then(() => {
          text = '签到成功';
          resolve({ code: 200, msg: `贴吧签到：${text}` });
        }).catch(err => {
          text = '签到失败';
          console.log(`贴吧签到失败`, err);
          resolve({ code: 400, msg: `贴吧签到：${text}` });
        })
      })
    } else {
      text = '未设置cookie';
      resolve({ code: 400, msg: `贴吧签到：${text}` });
    }
  })
}

//  哔哩哔哩
function bili() {
  return new Promise((resolve) => {
    let text = '未签到';
    if (BILI) {
      service.biliLiveService(BILI).then((res) => {
        text = '签到成功';
        resolve({ code: 200, msg: `哔哩哔哩签到：${text}` });
      }).catch(err => {
        text = '签到失败';
        console.log(`bili直播签到失败: `, err);
        resolve({ code: 400, msg: `哔哩哔哩签到：${text}` });
      })
    } else {
      text = '未设置cookie';
      resolve({ code: 400, msg: `哔哩哔哩签到：${text}` });
    }
  })
}

async function all() {
  Promise.all([juejin(), tieba(), bili()]).then(res => {
    if (res.every((v) => v.code === 200)) {
      //  所有签到成功,则不发送邮件通知
    } else {
      sendEmail(false, res);
    }
  })
}

all();

// /**
//  * 计算价格
//  * @param oldTotalPic 原来的总金额
//  * @param newTotalPic 现在的总金额
//  * @param oldNumber 原来的总数
//  * @param newNumber 现在的总数
//  */
// function count(oldTotalPic, newTotalPic, oldNumber, newNumber) {
//   return ((oldTotalPic + newTotalPic) / (oldNumber + newNumber)).toFixed(4)
// }
