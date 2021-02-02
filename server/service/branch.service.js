const axios = require('axios');
const { bioStarMachineUrl, } = require('../../config/biostar.config');
const { bioStarToken, addPackage, updatePackage, getFingerPrintTemplate,
  getFaceRecognitionTemplate, addUserInBioStar } = require('../biostar');
const { logger: { logger } } = require('../../config');
const { Branch } = require('../model');


module.exports = {

  checkMachineConfigured: async (ip, machineId) => {
    try {
      const headers = await bioStarToken(ip);
      await axios.get(bioStarMachineUrl(ip, machineId), { headers });
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  },

  getAllBranch: async () => {
    const branches = await Branch
      .find({}, { bioStarIp: 1, machineId: 1, typeOfMachine: 1 }).lean();
    return branches;
  },

  getAllBranchById: async (id) => {
    const branches = await Branch
      .findById(id, { bioStarIp: 1, machineId: 1, typeOfMachine: 1 }).lean();
    return branches;
  },

  addPackageInAllBranch: async (packageName, startTime, endTime) => {
    const branches = await module.exports.getAllBranch();
    let response = '';
    for (const branch of branches) {
      response = await addPackage(branch.bioStarIp, packageName, startTime, endTime);
    }
    return response;
  },

  updatePackageInAllBranches: async (packageName, fromTime, toTime, bioStarInfo) => {
    const branches = await module.exports.getAllBranch();
    let response = '';
    for (const branch of branches) {
      response = await updatePackage(branch.bioStarIp, packageName, fromTime, toTime, bioStarInfo);
    }
    return response;
  },

  deviceObjectByTypeOfMachine: async (type, fingerIndex = 0) => {
    if (type === 'Exclude') return;
    const { typeOfMachine, bioStarIp, machineId } = await Branch.findOne({ typeOfMachine: type });
    if (typeOfMachine === 'BioStation') {
      const { template0, template1 } = await getFingerPrintTemplate(bioStarIp, machineId);
      const biometricTemplate = { template0, template1, fingerIndex };
      return biometricTemplate;
    } else {
      const { raw_image, templates } = await getFaceRecognitionTemplate(bioStarIp, machineId);
      const faceRecognitionTemplate = { raw_image, templates };
      return faceRecognitionTemplate;
    }
  },

  employeeBioStarObject: (bioStarInfo, employee, credential) => {
    return {
      accessGroupName: bioStarInfo.accessGroupName,
      accessGroupId: bioStarInfo.accessGroupId,
      userGroupId: bioStarInfo.userGroupId,
      memberId: 'E' + employee.employeeId,
      name: credential.userName,
      email: credential.email,
      phoneNumber: employee.mobileNo,
      templates: employee.faceRecognitionTemplate.templates,
      raw_image: employee.faceRecognitionTemplate.raw_image,
      endDate: new Date(new Date().setFullYear(2030, 10, 12)).toISOString(),
      startDate: new Date().toISOString(),
    }
  },


  registerUserInBioStar: async (obj) => {
    const branches = await module.exports.getAllBranch();
    let response = '';
    for (const branch of branches) {
      response = await addUserInBioStar(branch.bioStarIp, obj.memberId, obj);
    }
    return response;
  },

  templatesByMemberBranch: async (branch) => {
    const { bioStarIp, machineId, typeOfMachine } = await module.exports.getAllBranchById(branch);
    if (typeOfMachine === 'Exclude') return;
    if (typeOfMachine === 'BioStation') {
      const { template0, template1 } = await getFingerPrintTemplate(bioStarIp, machineId);
      const biometricTemplate = { template0, template1 };
      return biometricTemplate;
    } else {
      const { raw_image, templates } = await getFaceRecognitionTemplate(bioStarIp, machineId);
      const faceRecognitionTemplate = { raw_image, templates };
      return faceRecognitionTemplate;
    }
  }






};