const SiteModel = require("../../models/siteModel.js");
const {
    successResponseWithData,
    ErrorResponse,
} = require("./../../lib/apiresponse");

let sitecontroller = {
    getsite: async(req, res) => {
        try {
            let whereObj = {
                working_status: true
            }
            if (req.query.id) {
                whereObj['_id'] = req.query.id;
            }
            if (req.query.code) {
                whereObj['site_code'] = req.query.code;
            }
            // console.log(`whereObj`, whereObj);
            const site = await SiteModel.find(whereObj);
            return successResponseWithData(res, 'Success', site);
        } catch (error) {
            return ErrorResponse(res, error);
        }
    }
}


module.exports = sitecontroller;