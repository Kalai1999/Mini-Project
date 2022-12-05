import axios from "axios";
const localhost = 'http://localhost:3001'
export const getProductsAll = async (data) => {
  let product;
  const res = await axios.get(`${localhost}/products/all`)
    .then((response) => {
      let res = response.data;
      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}


export const getProducts = async (data) => {
  let product;
  const res = await axios.get(`${localhost}/products/offset=${data}`)
    .then((response) => {
      let res = response.data;

      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}

export const getProductbyId = async (data) => {
  let product;
  console.log('search', data);
  const res = await axios.get(`${localhost}/productbyid/id/${data}`)
    .then((response) => {
      let res = response.data.stocks;
      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}

export const getProductbyProductName = async (data) => {
  let product;
  console.log('search', data);
  const res = await axios.get(`${localhost}/productby/product_name/${data}`)
    .then((response) => {
      let res = response.data;
      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}

export const getProductbySku = async (data) => {
  let product;
  console.log('search', data);
  const res = await axios.get(`${localhost}/productby/sku/${data}`)
    .then((response) => {
      let res = response.data.stocks;
      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}

export const getProductbyCategory = async (data) => {
  let product;
  console.log('search', data);
  const res = await axios.get(`${localhost}/productby/category/${data}`)
    .then((response) => {
      let res = response.data.stocks;
      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}
export const getProductbyPrice = async (start,end) => {
  let product;
  console.log('search', start,end);
  const res = await axios.get(`${localhost}/productby/selling_price/from=${start}&to=${end}`)
    .then((response) => {
      let res = response.data.stocks;
      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}

export const getProductbyDiscount = async (data) => {
  let product;
  console.log('search', data);
  const res = await axios.get(`${localhost}/productby/discount/${data}`)
    .then((response) => {
      let res = response.data.stocks;
      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}

export const getProductbyManufacturer = async (data) => {
  let product;
  console.log('search', data);
  const res = await axios.get(`${localhost}/productby/manufacturer/${data}`)
    .then((response) => {
      let res = response.data.stocks;
      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}

export const getProductbyVendor = async (data) => {
  let product;
  console.log('search', data);
  const res = await axios.get(`${localhost}/productby/vendor/${data}`)
    .then((response) => {
      let res = response.data.stocks;
      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}
export const getProductbyVendorLocation = async (data) => {
  let product;
  console.log('search', data);
  const res = await axios.get(`${localhost}/productby/vendor_location/${data}`)
    .then((response) => {
      let res = response.data.stocks;
      product = res
      console.log("Response ", product)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return product;
}


export const deleteProduct = async (data) => {
  console.log(data.product_id);
  const res = await axios.delete(`${localhost}/deleteproduct/${data.product_id}`)
    .then((response) => {
      let res = response;
      console.log("Response ", res)
    })
    .catch((err) => {
      console.log(err.message);
    });

}

export const createProduct = async (product) => {
  let response;
  let result = await axios.post(`${localhost}/createproduct`, product)
    .then((res) => {
      console.log(res);
      response=res
    })
    .catch((err) => {
      console.log(err);
    })
    console.log("response insert",response);
    return response

}

export const updateProduct = async (product) => {
  let response;

  console.log(product); 
  let result = await axios.put(`${localhost}/editproduct/${product.product_id}`, product)
    .then((res) => {
      console.log(res);
      response = res;
    })
    .catch((err) => {
      console.log(err);
    })
    return response;

}

export const getBatch = async (data) => {
  let batch;
  const res = await axios.get(`${localhost}/batch/offset=${data}`)
    .then((response) => {
      let res = response.data;
      batch = res
      console.log("Response ", batch)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return batch;
}
export const getBatchAll = async (data) => {
  let batch;
  const res = await axios.get(`${localhost}/batch`)
    .then((response) => {
      let res = response.data;
      batch = res
      console.log("Response ", batch)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return batch;
}

export const getBatchbyId = async (data) => {
  let batch;
  const res = await axios.get(`${localhost}/batchby/id/${data}`)
    .then((response) => {
      let res = response.data.batch;
      batch = res
      console.log("Response ", batch)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return batch;
}

export const getBatchbyProductName = async (data) => {
  let batch;
  const res = await axios.get(`${localhost}/batchby/product_name/${data}`)
    .then((response) => {
      let res = response.data.batch;
      batch = res
      console.log("Response ", batch)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return batch;
}

export const getBatchbyQuantity = async (data) => {
  let batch;
  const res = await axios.get(`${localhost}/batchby/quantity/${data}`)
    .then((response) => {
      let res = response.data.batch;
      batch = res
      console.log("Response ", batch)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return batch;
}

export const getBatchbyPrice = async (start,end) => {
  let batch;

  const res = await axios.get(`${localhost}/batchby/price/from=${start}&to=${end}`)
    .then((response) => {
      let res = response.data.batch;
      batch = res
      console.log("Response ", batch)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return batch;
}
export const getBatchbyVendor = async (data) => {
  let batch;
  const res = await axios.get(`${localhost}/batchby/vendor/${data}`)
    .then((response) => {
      let res = response.data.batch;
      batch = res
      console.log("Response ", batch)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return batch;
}

export const getBatchbyVendorLocation = async (data) => {
  let batch;
  const res = await axios.get(`${localhost}/batchby/vendor_location/${data}`)
    .then((response) => {
      let res = response.data.batch;
      batch = res
      console.log("Response ", batch)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return batch;
}

export const getBatchbyBatchDate = async (start,end) => {
  let batch;
  const res = await axios.get(`${localhost}/batchby/manufactured_date/start=${start}&end=${end}`)
    .then((response) => {
      let res = response.data.batch;
      batch = res
      console.log("Response ", batch)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return batch;
}

export const createBatch = async (data) => {
  let batch;
  let result = await axios.post(`${localhost}/createbatch`, data)
    .then((res) => {
      console.log(res);
      batch=res
    })
    .catch((err) => {
      console.log(err);
    })
    return batch;
}

export const deleteBatch = async (data) => {
  const res = await axios.delete(`${localhost}/deletebatch/${data.batch_id}`)
    .then((response) => {
      let res = response;
      console.log("Response ", res)
    })
    .catch((err) => {
      console.log(err.message);
    });

}
