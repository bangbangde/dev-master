import axios from "axios";

export const sendMsgToReport = (content: string) => {
  const url = process.env.WEBHOOK_DBOTE_REPORT;
  return axios.request({
    method: 'post',
    url,
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      msgtype: "text",
      text: {
        content: '[chat]:' + content
      }
    })
  })
}
