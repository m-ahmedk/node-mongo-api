const createResponse = (message, result, rows_affected, fields_updated, fields_affected, statuscode, status) => {
    return {
      message: message,
      result: result,
      rows_affected: rows_affected,
      fields_updated: fields_updated,
      fields_affected: fields_affected,
      statuscode: statuscode,
      status: status
    };
  }
  
module.exports = createResponse;