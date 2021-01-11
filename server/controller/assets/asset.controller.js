/**
 * utils.
*/

const { logger: { logger }, upload: { uploadAvatar }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')


/**
 * models.
*/

const { Assets, Contract, Supplier } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');




/**
 ******** supplier controller ********
*/







exports.getAllSuppliersForAdmin = async (req, res) => {
  try {
    let response = await Supplier.find({}).lean();
    let newResponse = response.filter(doc => {
      if (req.body.search) {
        let search = req.body.search.toLowerCase()
        let temp1 = doc.supplierName.toLowerCase();
        let temp2 = doc.supplierCode.toString();
        let temp3 = doc.mobileNumber;
        let temp4 = doc.email.toLowerCase()
        let temp5 = doc.address.toLowerCase();
        if (temp1.includes(search) ||
          temp2.includes(search) ||
          temp3.includes(search) ||
          temp4.includes(search) ||
          temp5.includes(search)) {
          return doc;
        }
      } else {
        return doc;
      }
    });
    successResponseHandler(res, newResponse, "successfully get all supplier");
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while get all supplier !");
  }
};



exports.getAllSuppliers = (req, res) => {
  Supplier.find({ status: true })
    .then(response => {
      successResponseHandler(res, response, "successfully get all active supplier");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while get all active supplier !");
    })
};



exports.getASuppliersById = (req, res) => {
  Supplier.findById(req.params.id)
    .then(response => {
      successResponseHandler(res, response, "successfully get all active supplier");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while get all active supplier !");
    })
};



exports.addNewSupplier = (req, res) => {
  let newSupplier = new Supplier(req.body);
  newSupplier.save().then(response => {
    auditLogger(req, 'Success')
    successResponseHandler(res, response, "successfully add new supplier");
  }).catch(error => {
    logger.error(error);
    auditLogger(req, 'Failed')
    errorResponseHandler(res, error, "Exception while adding new supplier !");
  })
};


exports.updateSupplier = async (req, res) => {
  req.responseData = await Supplier.findById(req.params.id).lean()
  Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(response => {
      auditLogger(req, 'Success')
      successResponseHandler(res, response, "successfully updated supplier");
    }).catch(error => {
      logger.error(error);
      auditLogger(req, 'Failed')
      errorResponseHandler(res, error, "Exception while updating  supplier !");
    });
};








/**
 ******** supplier controller ********
*/








exports.getAllAssetsForAdmin = async (req, res) => {
  try {
    let queryCond = {};
    if (req.body.branch) queryCond["assetBranch"] = req.body.branch;
    let response = await Assets.find(queryCond).populate('supplierName assetBranch').lean();
    let newResponse = response.filter(doc => {
      if (req.body.search) {
        let search = req.body.search.toLowerCase()
        let temp1 = doc.assetName.toLowerCase();
        let temp2 = doc.assetsCode.toString();
        let temp3 = doc.supplierName.supplierName.toLowerCase();
        let temp5 = doc.serialNumber.toLowerCase();
        if (temp1.includes(search) ||
          temp2.includes(search) ||
          temp3.includes(search) ||
          temp5.includes(search)) {
          return doc;
        }
      } else {
        return doc;
      }
    });
    successResponseHandler(res, newResponse, "successfully get all assets");
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while get all assets !");
  }
};






exports.getAllAssets = async (req, res) => {
  Assets.find({ status: true })
    .then(response => {
      successResponseHandler(res, response, "successfully get all active Assets");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while get all active Assets !");
    });
};




exports.addNewAssets = async (req, res) => {
  uploadAvatar(req, res, async (err, result) => {
    if (err)
      return errorResponseHandler(res, err, "while uploading image error occurred !");
    let data = JSON.parse(req.body.data)
    let newAssets = new Assets(data);
    newAssets["assetImage"] = req.files[0]
    newAssets.save().then(response => {
      successResponseHandler(res, response, "successfully add new Assets");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while adding new Assets !");
    })
  });
};



exports.getAssetsById = async (req, res) => {
  Assets.findById(req.params.id).populate('supplierName assetBranch contractor.contractId')
    .populate({ path: 'contractor.contractId', populate: { path: 'contractor' } })
    .then(response => {
      successResponseHandler(res, response, "successfully get all active Assets");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while get all active Assets !");
    })
};


exports.getAssetsBySupplier = async (req, res) => {
  try {
    let response = await Assets.find({ supplierName: req.body.supplier, status: true }).lean();
    let newResponse = response.filter(doc => {
      if (req.body.search) {
        let search = req.body.search.toLowerCase()
        let temp1 = doc.assetName.toLowerCase();
        let temp2 = doc.assetsCode.toString();
        let temp3 = doc.serialNumber.toLowerCase();
        if (temp1.includes(search) ||
          temp2.includes(search) ||
          temp3.includes(search)) {
          return doc;
        }
      } else {
        return doc;
      }
    });
    successResponseHandler(res, newResponse, "successfully get all assets");
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while get all assets !");
  }
};



exports.updateAssets = async (req, res) => {
  uploadAvatar(req, res, async (err, data) => {
    if (err)
      return errorResponseHandler(res, err, "while uploading image error occurred !");
    try {
      const data = JSON.parse(req.body.data);
      if (req.files.length > 0) {
        data["assetImage"] = req.files[0]
      }
      const response = await Assets.findByIdAndUpdate(req.params.id, data, { new: true })
      return successResponseHandler(res, response, "successfully updated Assets !!");
    } catch (error) {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while updating  Assets !");
    };
  })
};


exports.updateAssetsStatus = (req, res) => {
  Assets.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    .populate('supplierName assetBranch')
    .then(response => {
      successResponseHandler(res, response, "successfully updated status of Assets  !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while updating status of Assets !");
    });
}


exports.addNewRepair = (req, res) => {
  req.body['repairDateTime'] = new Date()
  Assets.findByIdAndUpdate(req.params.id, { $push: { repairLog: req.body } }, { new: true })
    .populate('supplierName assetBranch contractor.contractId')
    .then(response => {
      successResponseHandler(res, response, "successfully added repair");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while adding  Assets  repair!");
    });
};



exports.updateRepairLog = (req, res) => {
  const { id, technicianName, mobileNo, amount, maintainStatus } = req.body
  Assets.findOneAndUpdate({ "repairLog._id": id },
    { $set: { technicianName, mobileNo, amount, maintainStatus } }, { new: true })
    .then(response => {
      successResponseHandler(res, response, "successfully update repair");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while updating  Assets  repair!");
    });
};






/**
 ******** contractor controller ********
*/









exports.getAllContractForAdmin = async (req, res) => {
  try {
    let response = await Contract.find({}).populate('contractor').lean();
    let newResponse = response.filter(doc => {
      if (req.body.search) {
        let search = req.body.search.toLowerCase()
        let temp1 = doc.contractName.toLowerCase();
        let temp2 = doc.poNumber.toString();
        if (temp1.includes(search) ||
          temp2.includes(search)) {
          return doc;
        }
      } else {
        return doc;
      }
    });
    successResponseHandler(res, newResponse, "successfully get all contract");
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while get all contract !");
  }
};





exports.addContract = async (req, res) => {
  try {
    uploadAvatar(req, res, async (err, result) => {
      if (err) {
        errorResponseHandler(res, err, "Exception while adding new contract !");
      } else {
        let data = JSON.parse(req.body.data)
        let newContract = new Contract(data);
        newContract["contractStart"] = setTime(data.contractStart);
        newContract["contractEnd"] = setTime(data.contractEnd);
        newContract["document"] = req.files[0];
        let response = await newContract.save();
        let contractor = { current: true, contractId: response._id }
        for (let i = 0; i < data.assets.length; i++) {
          await Assets.findByIdAndUpdate(data.assets[i], { isContracted: true, $push: { contractor } })
        }
        return successResponseHandler(res, response, "successfully add new contract !");
      }
    });
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while adding new contract !");
  }
};


exports.updateContract = (req, res) => {
  uploadAvatar(req, res, async (err, result) => {
    if (err) {
      errorResponseHandler(res, err, "Exception while adding new contract !");
    } else {
      const data = JSON.parse(req.body.data);
      data["contractStart"] = setTime(data.contractStart);
      data["contractEnd"] = setTime(data.contractEnd);
      if (req.files.length > 0) {
        data["document"] = req.files[0]
      }
      Contract.findByIdAndUpdate(req.params.id, data, { new: true })
        .then((response) => {
          return successResponseHandler(res, response, "successfully update new contract !");
        }).catch(error => {
          logger.error(error);
          errorResponseHandler(res, error, "Exception while updating contract !");
        })
    }
  })
};



exports.updateStatusOfContract = (req, res) => {
  Contract.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    .then((response) => {
      return successResponseHandler(res, response, "successfully update status contract !");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while updating status contract !");
    })
};


exports.getContractById = async (req, res) => {
  Contract.findById(req.params.id).populate('contractor assets')
    .populate({ path: 'assets', populate: { path: "assetBranch" } })
    .then(response => {
      successResponseHandler(res, response, "successfully get all active Assets");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while get all active Assets !");
    })
};

