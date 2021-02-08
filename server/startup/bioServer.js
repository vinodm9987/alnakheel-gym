const axios = require('axios');
const WebSocket = require('ws');


const body = {
    "User": {
        "login_id": "admin",
        "password": "pixel1234"
    }
};


const headers = {
    "content-type": "application/json"
}

const biostarEvent = async (bsSessionId) => {
    const header = { "content-type": "application/json", "bs-session-id": bsSessionId }
    await axios.post('http://192.168.100.74/api/events/start', {}, { headers: header })
}

async function addAttendanceLog(memberId, fingerScanStatus) {
    let header = { 'Content-Type': 'application/json;charset=UTF-8', "Access-Control-Allow-Origin": "*" }
    let body = { memberId, fingerScanStatus }
    const { datas } = await axios.post(`https://skoolgo.pixelmindit.com:5700/api/attendance/addMemberAttendance`, body, { header });
    return datas
}

async function getMemberLog(memberId, fingerScanStatus) {
    let header = { 'Content-Type': 'application/json;charset=UTF-8', "Access-Control-Allow-Origin": "*" }
    let body = { memberId, fingerScanStatus }
    const { datas } = await axios.post(`https://skoolgo.pixelmindit.com:5700/api/member/getMemberByMemberId`, body, { header });
    return datas
}


module.exports.StartBioStarServer = async () => {

    const response = await axios.post('http://192.168.100.74/api/login', body, { headers })
    const bsSessionId = response.headers["bs-session-id"]
    const ws = new WebSocket('ws://192.168.100.74/wsapi', { perMessageDeflate: false });

    ws.onopen = () => {
        ws.send('bs-session-id' + "=" + bsSessionId);
        setTimeout(function () { postBioStar2() }, 1000);
        const postBioStar2 = async () => {
            await biostarEvent(bsSessionId)
        }
    }

    ws.onmessage = async function (event) {
        let data = JSON.parse(event.data);
        if (data.Event) {
            switch (data.Event.event_type_id.code) {
                case '4865':
                    await addAttendanceLog(data.Event.user_id.user_id, "Successfully Punched Fingerprint")
                    break;
                case '6401':
                    await getMemberLog(data.Event.user_id.user_id, "Disabled User")
                    break;
                case '6403':
                    await getMemberLog(data.Event.user_id.user_id, "Disabled User")
                    break;
                case '6402':
                    await getMemberLog(data.Event.user_id.user_id, "Disabled User")
                    break;
                case '4867':
                    await addAttendanceLog(data.Event.user_id.user_id, "Successfully Done Face Recognition")
                    break;
                default:
                    break;
            }
        }
    };
}


