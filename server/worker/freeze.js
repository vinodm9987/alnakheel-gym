const { redisConfig } = require('../../config');
const { MultiWorker, Queue } = require('node-resque');
const { biostar: { getUserFreezeObject, BIO_STAR_USER_REGISTRATION_URL }, logger: { logger } } = require('../../config')
const { DetailsIcon } = require('../constant/mobileIcon');
const { Credential } = require('../model')
const { FreezeAccept, } = require('../constant/messageRedirect');
const { mobileObject, webObject } = require('../notification/service');
const { Details } = require('../constant/webIcon');
const { notificationObjectWithoutToken } = require("../utils/notification")
const { createBroadcastForMember } = require('../notification/service')
const axios = require('axios');


module.exports = {

  setConnection: () => {
    return redisConfig;
  },

  jobs: () => {
    const jobs = {

      notification: {
        perform: async (members) => {
          const users = await Credential.find({ userId: { $in: members } }).lean();
          const { name, backgroundColor, color } = DetailsIcon;
          const { title, webPath, mobileCompo } = FreezeAccept();
          const mobile = mobileObject(title, mobileCompo, "_id", name, color, backgroundColor);
          const web = webObject(title, webPath, "_id", Details);
          const message = notificationObjectWithoutToken('Point Redeem', title, { mobileCompo });
          await createBroadcastForMember(mobile, web, message, users);
        }
      },

      biostar: {
        perform: async (memberId, startDate, endDate, headers) => {
          try {
            const response = await axios.get(`${BIO_STAR_USER_REGISTRATION_URL}/${memberId}`, { headers });
            const object = getUserFreezeObject(response.data, startDate, endDate);
            const newResponse = await axios.put(`${BIO_STAR_USER_REGISTRATION_URL}/${memberId}`, object, { headers });
            return newResponse;
          } catch (error) {
            logger.error(error);
            console.error("TCL: exports.bioStarLogin -> error", error.response.data);
          }
        }
      }
    };
    return jobs;
  },

  startWorker: async (connection, jobs) => {
    const worker = new MultiWorker({ connection, queues: ["freeze"] }, jobs);
    return worker;
  },


  workerEvent: (multiWorker) => {
    multiWorker.on("start", (workerId) => {
      console.log(`worker[${workerId}] started`);
    });

    multiWorker.on("end", (workerId) => {
      console.log(`worker[${workerId}] ended`);
    });

    multiWorker.on("success", (workerId, queue, job, result, duration) => {
      console.log(
        `worker[${workerId}] job success ${queue} ${JSON.stringify(
          job
        )} >> ${result} (${duration}ms)`
      );
    });

    multiWorker.on("failure", (workerId, queue, job, failure, duration) => {
      console.log(
        `worker[${workerId}] job failure ${queue} ${JSON.stringify(
          job
        )} >> ${failure} (${duration}ms)`
      );
    });

    multiWorker.on("error", (error, workerId, queue, job) => {
      console.log(
        `worker[${workerId}] error ${queue} ${JSON.stringify(job)} >> ${error}`
      );
    });
  },


  connectQueue: async (connection, jobs) => {
    const queue = new Queue({ connection }, jobs);
    queue.on("error", function (error) { console.log(error); });
    await queue.connect();
    return queue;
  },

  addQueued: async (queue, type, args) => {
    const response = await queue.enqueue("freeze", type, args);
    return response;
  }



}