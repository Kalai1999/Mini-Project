const {Pool} = require('pg');
const connectionString='postgresql://root@localhost:26257/stocks?sslmode=disable';
const pool = new Pool({connectionString});

// create product
const insertData = async(stock1)=>{
  let error,errstatus=false;
let insertquery= {text:`INSERT INTO product VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
    values:[
        stock1.product_id,
        stock1.sku,
        stock1.product_name,
        stock1.summary,
        stock1.category,
        stock1.selling_price,
        stock1.manufacturer,
        stock1.warranty
      ]  
    }
    await pool
    .query(insertquery)
    .then(res=>{console.log(res);
  })
    .catch(err=>{
      console.log(err);
      errstatus=true;
      error = err;
    })
    if(errstatus==true){
      stock1.status=error
      if(error.name=="error"){
      return {
        message : "error",
        error:error
      }
    }}
    else{
      return {
        message:"success",
        stock:stock1
      }        
    }
}

//update product
const updateProduct = async(stock1)=>{
  let update = false;
  let insertquery= {text:`UPDATE product 
  SET sku = $2,
      product_name =$3,
      summary = $4,
      category = $5,
      selling_price =$6,
      manufacturer=$7,
      warranty=$8
  WHERE product_id = $1 `,
  values:[
      stock1.product_id,
      stock1.sku,
      stock1.product_name,
      stock1.summary,
      stock1.category,
      stock1.selling_price,
      stock1.manufacturer,
      stock1.warranty    ]  
  }
  await pool
  .query(insertquery)
  .then(res=>{console.log('updated',res);
  update = true})
  .catch(err=>{
    console.log(err);
  })
  return update
}
//product total
const getTotalCount=async()=>{
  const gettotal = {
    text:`SELECT COUNT(product_name) FROM product`
  }  
  let product;
  await pool
  .query(gettotal)
  .then(res=>{
    console.log(res)
    product=res.rows[0].count
  })
  .catch(err=>{
    console.log(err)
  })
  return product
}

//get product by page
const getProductsAll =async()=>{
  
      const getquery = {
          text: `SELECT * FROM product`
        }
        let stock=[];
         
        await pool
            .query(getquery)
            .then(res=>{
              console.log(res);
              stock.push(res.rows)
              console.log("Stock data ",stock);
            }).catch(err=>{
              console.log(err);
            })
        return {
          message:"success",
          stocks:stock,
          }; 
  }
  

//get product by page
const getProducts =async(request)=>{
let total= await getTotalCount()

    const getquery = {
        text: `SELECT * FROM product LIMIT 10 OFFSET ${request.params.offset}`,
        types: {
          getTypeParser: () => val => val,
        }
      }
      let stock=[];
       
      await pool
          .query(getquery)
          .then(res=>{
            console.log(res);
            stock.push(res.rows)
            console.log("Stock data ",stock);
          }).catch(err=>{
            console.log(err);
          })
          stock.push(total)
          console.log("Total",total)
      return {
        message:"success",
        stocks:stock,
        }; 
  
}
//get by product name
const getProductsbyProductName =async(product_name)=>{
  let stock,response;
  const getquery = {
      text: 'SELECT * from product WHERE product_name = $1',
      values:[
        product_name
      ],
      types: {
        getTypeParser: () => val => val,
      },
    }
     
    await pool
        .query(getquery)
        .then(res=>{
          console.log(res);response=res;
          stock= res.rows;
          console.log("Stock data ",stock);
        }).catch(err=>{
          console.log(err);
        })
    return {
      response:response,
      stocks:stock
    }
}
//get by product name
const getProductsbySku =async(sku)=>{
  let stock,response;
  const getquery = {
      text: 'SELECT * from product WHERE sku = $1',
      values:[
        sku
      ],
      types: {
        getTypeParser: () => val => val,
      },
    }
     
    await pool
        .query(getquery)
        .then(res=>{
          console.log(res);response=res;
          stock= res.rows;
          console.log("Stock data ",stock);
        }).catch(err=>{
          console.log(err);
        })
    return {
      response:response,
      stocks:stock
    }
}


//get by product id
const getProductsById =async(id)=>{
  let response,stock;
  const getquery = {
      text: 'SELECT * from product WHERE product_id = $1',
      values:[id]
    }
    await pool
        .query(getquery)
        .then(res=>{
          console.log(res);
          stock= res.rows;
          response=res;
        }).catch(err=>{
          console.log(err);
        })
    return{
        response:response,
        stocks:stock
    } 
}
const getProductsByCategory =async(value)=>{
  let response,stock;
  const getquery = {
      text: 'SELECT * from product WHERE category = $1',
      values:[value]
    }
    await pool
        .query(getquery)
        .then(res=>{
          console.log(res);
          stock= res.rows;
          response=res;
          console.log("Stock data ",stock);
        }).catch(err=>{
          console.log(err);
        })
    return{
        response:response,
        stocks:stock
    } 
}

//get by manufacturer
const getProductsByManufacturer =async(value)=>{
  let response,stock;
  const getquery = {
      text: 'SELECT * from product WHERE manufacturer = $1',
      values:[value]
    }
    await pool
        .query(getquery)
        .then(res=>{
          console.log(res);
          stock= res.rows;
          response=res;
          console.log("Stock data ",stock);
        }).catch(err=>{
          console.log(err);
        })
    return{
        response:response,
        stocks:stock
    } 
}

//get by price range
const getProductsByPriceRange =async(value,value1)=>{
  let response,stock;
  const getquery = {
      text: 'SELECT * from product WHERE selling_price BETWEEN $1 AND $2',
      values:[value,value1]
    }
    await pool
        .query(getquery)
        .then(res=>{
          console.log(res);
          stock= res.rows;
          response=res;
          console.log("Stock data ",stock);
        }).catch(err=>{
          console.log(err);
        })
    return{
        response:response,
        stocks:stock
    } 
}

//get by vendor
const getProductsByVendor =async(value)=>{
  let response,stock;
  const getquery = {
      text: `SELECT * from product 
     JOIN batch ON product.product_id=batch.product_id AND batch.vendor =$1`,
      values:[value]
    }
    await pool
        .query(getquery)
        .then(res=>{
          console.log(res);
          stock= res.rows;
          response=res;
          console.log("Stock data ",stock);
        }).catch(err=>{
          console.log(err);
        })
    return{
        response:response,
        stocks:stock
    } 
}

//get by vendor location
const getProductsByVendorLocation =async(value)=>{
  let response,stock;
  const getquery = {
      text: `SELECT * from product 
     JOIN batch ON product.product_id=batch.product_id AND batch.vendor_location =$1`,
      values:[value]
    }
    await pool
        .query(getquery)
        .then(res=>{
          console.log(res);
          stock= res.rows;
          response=res;
          console.log("Stock data ",stock);
        }).catch(err=>{
          console.log(err);
        })
    return{
        response:response,
        stocks:stock
    } 
}

const deleteProduct = async(id)=>{
    let del ;
    const deletequery = {
        text: `DELETE FROM product WHERE product_id=$1`,
        values:[id]
      }
       await pool
          .query(deletequery)
          .then(res=>{console.log(res);
            del=res.rowCount
        })
          .catch(err=>{
            console.log(err);
          })
          return del
}


const insertBatch= async(stock1)=>{
  let error,errstatus=false;
    let insertquery_batch= {text:`INSERT INTO batch VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) `,
    values:[
        stock1.batch_id,
        stock1.batch_name,
        stock1.product_name,
        stock1.product_id,
        stock1.sku,
        stock1.quantity,
        stock1.price,
        stock1.batch_date,
        stock1.valid_upto,
        stock1.manufactured_date,
        stock1.vendor,
        stock1.vendor_location
      ]  
    }

    await pool
    .query(insertquery_batch)
    .then(res=>{console.log(res);})
    .catch(err=>{
      errstatus=true;
      error=err;
      console.log(err);
    })
    if(errstatus==true){
      if(error.name=="error"){
        return {
          message : "error",
          error:error
        }
      }}
      else{
        return {
          message:"success",
          stock:stock1
        }        
      }
  
}
//product total
const getTotalBatch=async()=>{
  const gettotal = {
    text:`SELECT COUNT(product_name) FROM batch`
  }  
  let product;
  await pool
  .query(gettotal)
  .then(res=>{
    console.log(res)
    product=res.rows[0].count
  })
  .catch(err=>{
    console.log(err)
  })
  return product
}


const getBatchesAll = async ()=>{
    const getquery = {
        text: 'SELECT * from batch',
        types: {
          getTypeParser: () => val => val,
        },
      }
      let batch;
       
      await pool
          .query(getquery)
          .then(res=>{
            console.log(res);
            batch= res.rows;
            console.log("Batch data ",batch);
          }).catch(err=>{
            console.log(err);
          })
          
         return {
          message:"success",
          batches:batch
         };
  
}
const getBatches = async (request)=>{
  let total= await getTotalBatch();
  const getquery = {
      text: `SELECT * FROM batch LIMIT 10 OFFSET ${request.params.offset}`,
      types: {
        getTypeParser: () => val => val,
      },
    }

    let batch=[];
     
    await pool
        .query(getquery)
        .then(res=>{
          console.log(res);
          batch.push(res.rows);
          console.log("Batch data ",batch);
        }).catch(err=>{
          console.log(err);
        })
        batch.push(total)
        
       return {
        message:"success",
        batches:batch
       };

}


const deleteBatch = async(id)=>{
    let del ;
    const deletequery = {
        text: `DELETE FROM batch WHERE batch_id=$1`,
        values:[id]
      }
       await pool
          .query(deletequery)
          .then(res=>{console.log(res);
            del= res.rowCount;
        })
          .catch(err=>{
            console.log(err);
          })
          return del;
}
const deleteBatchByProduct = async(id)=>{
    let del ;
    const deletequery = {
        text: `DELETE FROM batch WHERE product_id=$1`,
        values:[id]
      }
       await pool
          .query(deletequery)
          .then(res=>{console.log(res);
            del= res.rowCount;
        })
          .catch(err=>{
            console.log(err);
          })
          return del;
}

module.exports={
    insertData,
    updateProduct,
    getProducts,
    getProductsAll,
    getProductsById,
    getProductsByCategory,
    getProductsByVendor,
    getProductsByVendorLocation,
    getProductsbySku,
    getProductsByManufacturer,
    getProductsbyProductName,
    getProductsByPriceRange,
    deleteProduct,
    insertBatch,
    getBatchesAll,
    getBatches,
    deleteBatch,
    deleteBatchByProduct
}