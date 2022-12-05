const hapi = require('hapi');
const product = require('./service')
const dbmodel = require('./datamodels')
const server = hapi.server({
    port : 3001,
    host:'localhost',
    routes:{
      cors:true
    }
});
async function start(){
    try{
        await server.start();
    } catch (err){
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:',server.info.uri);
  }

  //add product
  server.route({
    method:'POST',
    path:'/createproduct',
    handler: async(request,h)=>{   
    return product.createProduct(request)
    }
  });

  //get products
  server.route({
    method:'GET',
    path:'/products/all',
    handler:async(request,h) =>{
      return dbmodel.getProductsAll()  
    }
  });


  //get products by page
  server.route({
    method:'GET',
    path:'/products/offset={offset}',
    handler:async(request,h) =>{
      return dbmodel.getProducts(request)  
    }
  });
  
  //get product by id
  server.route({
    method:'GET',
    path:"/productby/product_id={product_id}",
    handler: async(req, h)=>{
      return product.getProductById(req.params.product_id);
    }
  });
  
  //get product by product_name
  server.route({
    method:'GET',
    path:"/productby/product_name/{product_name}",
    handler: async(request, h)=>{
      return product.getProductByProductName(request.params.product_name)
    }
  });

  //get product by sku
  server.route({
    method:'GET',
    path:"/productby/sku/{sku}",
    handler: async(req, h)=>{
      return product.getProductBySku(req.params);
    }
  });

  //get product by price
  server.route({
    method:'GET',
    path:"/productby/selling_price/from={from}&to={to}",
    handler: async(req, h)=>{
      return product.getProductByPrice(req.params);
    }
  });
  
  //get product by category
  server.route({
    method:'GET',
    path:"/productby/category/{category}",
    handler: async(req, h)=>{
      console.log(req.params)
      return product.getProductByCategory(req.params);
    }
  });

  //get product by manufacturer
  server.route({
    method:'GET',
    path:"/productby/manufacturer/{manufacturer}",
    handler: async(req, h)=>{
      return product.getProductByManufacturer(req.params);
    }
  });
  
  //get product by vendor 
  server.route({
    method:'GET',
    path:'/productby/vendor/{vendor}',
    handler:async(request,h)=>{
      return product.getProductVendor(request.params)
    }
  });

  //get product by vendor location
  server.route({
    method:'GET',
    path:'/productby/vendor_location/{vendor_location}',
    handler:async(request,h)=>{
      return product.getProductVendorLocation(request.params)
    }
  });

  
  //edit product
  server.route({
    method:'PUT',
    path:'/editproduct/{id}',
    handler: async(req, h)=>{
      return product.editProduct(req);
    }
  });
  
  //delete product
  server.route({
    method:'DELETE',
    path:'/deleteproduct/{id}',
    handler: async(req, h)=>{
      return product.delProduct(req)
    }
  });
  
  //add batch
  server.route({
    method:'POST',
    path:'/createbatch',
    handler:async (request,h) =>{
      return product.createBatch(request)
    }
  });

  // get batch 
  server.route({
    method:'GET',
    path:'/batch',
    handler:async(request,h) =>{
      return dbmodel.getBatchesAll()
    }
  });
  // get batch 
  server.route({
    method:'GET',
    path:'/batch/offset={offset}',
    handler:async(request,h) =>{
      return dbmodel.getBatches(request)
    }
  });


  //delete batch
  server.route({
    method:'DELETE',
    path:'/deletebatch/{id}',
    handler: async(req, h)=>{
      return product.delBatch(req)
    }
  });
    

  
  
start()