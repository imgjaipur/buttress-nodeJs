exports.successResponse = function (res, msg) {
    var data = {
      status: true,
      responseCode: 200,
      message: msg,
    };
    return res.status(200).json(data);
  };
  exports.successResponseWithData = function (res, msg, data) {
    var resData = {
      status: true,
      responseCode: 200,
      message: msg,
      data: data,
      
    };
    return res.status(200).json(resData);
}
  

  
  exports.ErrorResponse = function (res, msg) {
    var data = {
      status: false,
      responseCode:400,
      message: msg,
    };
    return res.status(200).json(data);
  };

  
  exports.notFoundResponse = function (res, msg) {
    var data = {
      status: false,
      responseCode: 404,
      message: msg,
    };
    return res.status(404).json(data);
  };
  
  exports.validationErrorWithData = function (res, msg, data) {
    var resData = {
      status: false,
      responseCode: 400,
      message: msg,
      data: data,
    };
    return res.status(400).json(resData);
  };
  
  exports.validationError = function (res, msg) {
    var resData = {
      status: false,
      responseCode: 400,
      message: msg,
    };
    return res.status(400).json(resData);
  };
  
  exports.unauthorizedResponse = function (res, msg) {
    var data = {
      status: false,
      responseCode: 401,
      message: msg,
    };
    return res.status(401).json(data);
  };
  
  
  