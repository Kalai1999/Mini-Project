// const { response } = require('@hapi/hapi/lib/validation');
const uuid = require('uuid');
const insertDB = require('./datamodels');
const createProduct = async (request) => {
  let stock1 = {
    "product_id": uuid.v1(),
    "sku": request.payload.sku,
    "product_name": request.payload.product_name,
    "summary": request.payload.summary,
    "category": request.payload.category,
    "selling_price": request.payload.selling_price,
    "manufacturer": request.payload.manufacturer,
    "warranty": request.payload.warranty,
    "status":"success"
  };
  return insertDB.insertData(stock1)
}
const sendResponse=async (res) =>{
  console.log('Response', res)
  if (res.response.rowCount > 0)
    return {
      message: "success",
      stocks: res.stocks
    };
  else
    return {
      message: "No product found!",
      stocks:res.stocks
    }
}


const getProductById = async (request) => {
  let res = await insertDB.getProductsById(request)
  return sendResponse(res)
}

const getProductByProductName = async (request) => {
  let res = await insertDB.getProductsbyProductName(request)
  return sendResponse(res)
}
const getProductBySku = async (request) => {
  let res = await insertDB.getProductsbySku(request.sku)
  return sendResponse(res)
}

const getProductByCategory = async (request) => {
  let res = await insertDB.getProductsByCategory(request.category)
  return sendResponse(res)
}

const getProductByManufacturer = async (request) => {
  let res = await insertDB.getProductsByManufacturer(request.manufacturer)
  return sendResponse(res)
}
const getProductByPrice = async (request) => {
  console.log(request);
  let res = await insertDB.getProductsByPriceRange(request.from,request.to)
  console.log("Price",res);
  return sendResponse(res);
}
const getProductVendor=async(request)=>{
  let res = await insertDB.getProductsByVendor(request.vendor)
  return sendResponse(res)
}
const getProductVendorLocation=async(request)=>{
  let res = await insertDB.getProductsByVendorLocation(request.vendor_location)
  return sendResponse(res)
}

const editProduct = async (request) => {
  const product = request.payload;
  console.log("Edit", request);
  let match = await insertDB.updateProduct(product);
  if (match) {
    return {
      message: "success",
      stocks: product
    }
  }
  else {
    return {
      message: "Product not found.",
    }
  }
}

const delProduct = async (request) => {
  await insertDB.deleteBatchByProduct(request.params.id);
  let stock = await insertDB.deleteProduct(request.params.id);
  if (stock > 0) {
    return {
      message: "success",
    }
  }
  else {
    return {
      message: "Product not found.",
    }
  }

}

const createBatch = async (request) => {
  console.log('request ', request);
  let stock1 = {
    "batch_id": uuid.v1(),
    "batch_name": "B" + request.payload.sku,
    "product_name": request.payload.product_name,
    "product_id": request.payload.product_id,
    "sku": request.payload.sku,
    "quantity": request.payload.quantity,
    "price": request.payload.price,
    "batch_date": request.payload.batch_date,
    "manufactured_date": request.payload.manufactured_date,
    "valid_upto": request.payload.valid_upto,
    "vendor": request.payload.vendor,
    "vendor_location": request.payload.vendor_location
  };
  return insertDB.insertBatch(stock1)

}


const delBatch = async (request) => {

  let stock = await insertDB.deleteBatch(request.params.id);

  if (stock > 0) {
    return {
      message: "success!",
    }
  }
  else {
    return {
      message: "Batch not found.",
    }
  }

}

module.exports = {
  createProduct,
  getProductById,
  getProductByProductName,
  getProductByCategory,
  getProductVendor,
  getProductVendorLocation,
  getProductByManufacturer,
  getProductByPrice,
  getProductBySku,
  editProduct,
  delProduct,
  createBatch,
  delBatch
}