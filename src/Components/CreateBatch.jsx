import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import '../css/stock.css'
import { createBatch, getProductbyProductName, getProductsAll } from "./api";
import { Select, Modal, Button, Space, input, Alert, DatePicker } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useForm } from "react-hook-form";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';



export default function CreateBatch() {

    const { confirm } = Modal;
    dayjs.extend(customParseFormat);
    const [productList, setproductList] = useState([]);
    const [productid, setproductid] = useState('');
    const [productname, setproductname] = useState('');
    const [price, setprice] = useState(0);
    const [sku, setsku] = useState('');
    const [quantity, setquantity] = useState('');
    const [vendor, setvendor] = useState('');
    const [vendorLoc, setvendorLoc] = useState('');
    const navigate = useNavigate();
    const [success,setsuccess] =useState('');
    let today = new Date();
    let date = today.getFullYear() + '-' + parseInt(today.getMonth() + 1) + '-' + today.getDate()
    let currentDate=new Date(date);
    const [batch_date, setbatch_date] = useState(date);
    const [manufactured_date, setmanufactured_date] = useState(Date);
    const [expiry_date, setexpiry_date] = useState('YYYY-MM-DD');
    const categorylist = [
        { value: "phones", label: "Phones" },
        { value: "tab", label: "Tab" },
        { value: "tv", label: "TV" },
        { value: "accessories", label: "Accessories" }];

    const [focused, setfocused] = useState({
        product_name: false,
        sku: false,
        price: false,
        quantity: false,
        vendor: false,
        manufactured_date:false,
        expiry_date:false,
        vendor_location: false,
        batch_date:false
    });
    const handleFocus = (e) => {
      console.log(e.target.name)
        setfocused({
            ...focused,
            [e.target.name]: true   
        });
    }

    const handleChange = (value) => {
        setproductname(value)
        console.log(`selected ${value}`);
    };
    const sendData = async () => {
        let product1 = {
            "product_id": productid,
            "product_name": productname,
            "quantity": quantity,
            "price": price,
            "sku":sku,
            "vendor": vendor,
            "vendor_location": vendorLoc,
            "manufactured_date":manufactured_date,
            "batch_date": batch_date,
            "valid_upto": expiry_date,
        }
        console.log(product1);
        let response = await createBatch(product1)
        if (response.data.message == "error") {
            if (response.data.error.constraint == "product_product_name_key") {
                setsuccess("error")
            }
            else if (response.data.error.constraint == "product_sku_key") {
                setsuccess("error")
            }
        }
        else if (response.data.message == "success") {
            setsuccess("success");
            handleClear();
        }
    }

    const showConfirm = async () => {
        let product = ["Batch with product name", ":", productname]
        await confirm({
            title: 'Do you Want to confirm this batch?',
            icon: <ExclamationCircleFilled />,
            content: product,
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(
                        sendData()
                            ? resolve : reject, 2000);
                    console.log(resolve);
                    // navigate('/product-list');
                }).catch(() => { console.log('Oops errors!') });
            },
            onCancel() { },
        });
    };
    const handleClear = () => {
        setproductname('');
        setsku('')
        setmanufactured_date('')
        setexpiry_date('YYYY-MM-DD')
        setproductid('')
        setquantity('');
        setprice('');
        setvendorLoc('');
        setvendor('');
        setfocused({
            product_name: false,
            sku: false,
            price: false,
            quantity: false,
            vendor: false,
            manufactured_date:false,
            expiry_date:false,
            vendor_location: false,
            batch_date:false
        })

    }
    useEffect(() => {
        getData()
    }, [productname])

    const getData = async () => {
        let stock = await getProductsAll();
        let data=stock.stocks[0]
        console.log(data);
        let pl = [];
        let pn;
        console.log(date)
        for (let i = 0; i < data.length; i++) {
            pn = {
                value: data[i].product_name,
                label: data[i].product_name
            }
            pl.push(pn)
        }
        setproductList(pl)
    }

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
      };
    return (
        <div className="product-top">
             {success === "success" ?
                <Alert message='Batch added successfully'
                    type="success"
                    closable
                    // onClick={setsuccess('')}
                    className="alert-success"
                /> 
                : success === "error" ? 
                <Alert message='Sorry error occurred'
                 type="error" 
                 closable
                 className="alert-error" /> : ''
            }

            <form className='outline-card'>
                <Row>
                    <Col>
                        <div className="card-head">
                            Create Batch
                        </div>
                    </Col>
                </Row>
                <Row>
                    {/* First row */}
                    <Col md='1' />
                    <Col md='5' >
                        <div className='group'>
                            <label className="text-label">Product Name</label>
                            <Select
                                style={{ width: "100%" }}
                                showSearch
                                value={productname}
                                onChange={handleChange}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={productList}
                                
                            />

                            {/* <small>
                                 {error?.product_name && error.product_name.message}
                             </small> */}
                        </div>
                    </Col>
                    <Col md='5' >
                        <div className='group'>
                            <label className="text-label"> SKU</label>
                            <input
                                type="text"
                                className="input-text"
                                value={sku}
                                name='sku'
                                disabled
                            // {...register('product_name',registerOptions.product_name)}
                            />

                        </div>
                    </Col>
                    <Col md='1' />
                    {/* Second row */}
                    <Col md='1' />

                    <Col md='5'>
                        <div className="group">
                            <label className="text-label">Quantity</label>
                            <input
                                type="number"
                                className="input-text"
                                value={quantity}
                                name='quantity'
                                onBeforeInput={async () => {
                                    let stock = await getProductbyProductName(productname);
                                    console.log('product name',stock)
                                    setproductid(stock.stocks[0].product_id)
                                    setsku(stock.stocks[0].sku)
                                    return true
                                }}
                                required
                                min='0'
                                onBlur={handleFocus}
                                focused={focused.quantity.toString()}
                                onChange={(e) => {
                                    setquantity(e.target.value);
                                }}
                            /> <p>Quantity should contains positive nummbers</p>
                            </div>
                    </Col>
                    <Col md='5' >
                        <div className='group'>
                            <label className="text-label">Price</label>
                            <input
                                type='number'
                                className="input-text"
                                value={price}
                                required={true}
                                name='price'
                                min='0'
                                pattern="^[0-9]*$"
                                onBlur={handleFocus}
                                focused={focused.price.toString()}
                                onChange={(e) => {
                                    setprice(e.target.value);
                                    console.log(e.target.value);
                                }}
                            />
                            <p>Price value should contains only positive values</p>
                        </div>
                    </Col>
                    <Col md='1' />

                    {/* Third row */}
                    <Col md='1' />
                    <Col md='5'>
                        <div className="group">
                            <label className="text-label">Vendor</label>
                            <input
                                type='text'
                                className="input-text"
                                value={vendor}
                                name='vendor'
                                onChange={(e) => {
                                    setvendor(e.target.value);
                                    console.log(e.target.value);
                                }}
                                required
                                pattern="^[a-zA-Z0-9_,+. ]*$"
                                onBlur={handleFocus}
                                focused={focused.vendor.toString()}
                            /> 
                            <p>Vendor name can be alphanumeric values</p>
                            </div>
                    </Col>

                    <Col md='5' >
                        <div className='group'>
                            <label className="text-label">Vendor Location</label>
                            <input
                            name='vendor_location'
                                type='text'
                                className="input-text"
                                value={vendorLoc}
                                onChange={(e) => {
                                    setvendorLoc(e.target.value);
                                    console.log(e.target.value);
                                }}
                                required
                                pattern="^[a-zA-Z0-9_,+. ]*$"
                                onBlur={handleFocus}
                                focused={focused.vendor_location.toString()}
                            />
                            <p>vendor location can be alphanumeric values</p>
                        </div>
                    </Col>
                    <Col md='1' />

                    {/* Fifth row */}
                    <Col md='1' />
                    <Col md='5'>
                        <div className="group">
                            <label className="text-label">Manufactured Date</label>
                            
                            <input
                            name='manufactured_date'
                            className="input-text"
                            style={{width:'100%'}}
                            type="date"
                            max={currentDate}
                            value={manufactured_date}
                            onChange={(e)=>{setmanufactured_date(e.target.value)}}
                            /><p>Manufactured date can not be future date</p>
                        </div>
                    </Col>
                    <Col md='5'>
                        <div className="group">
                            <label className="text-label">Expiry Date</label>
                            
                            <input
                            name='expiry_date'
                            className="input-text"
                            style={{width:'100%'}}
                            type="date"
                            value={expiry_date}
                            min="2022-12-05"
                            onChange={(e)=>{setexpiry_date(e.target.value)}}
                            />
                            <p>expiry date should not be past date</p>
                        </div>
                    </Col>
                    <Col md='1' />

                </Row>
                <Space wrap>
                    <Button onClick={showConfirm}>Create</Button>
                    <Button onClick={handleClear}>Clear</Button>
                </Space>
            </form>
        </div>
    )
}
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom";
// import { Form, Col, Button } from "react-bootstrap";
// import '../css/stock.css'
// import { createBatch, createProduct } from "./api";
// import { Select, Modal, Space, input, Alert, notification } from 'antd';
// import { ExclamationCircleFilled } from '@ant-design/icons';

// export default function CreateProduct() {
// //declarations
//     const { confirm } = Modal;
//     const [values, setvalues] = useState({
//         product_name: '',
//         sku: '',
//         price: '',
//         quantity: '',
//         vendor: '',
//         manufactured_date:'',
//         expiry_date:'',
//         vendor_location: '',
//         batch_date:''
//     })
//     const [focused, setfocused] = useState({
//         product_name: false,
//         sku: false,
//         price: false,
//         quantity: false,
//         vendor: false,
//         manufactured_date:false,
//         expiry_date:false,
//         vendor_location: false,
//         batch_date:false
//     });
//     const [productnameerr, setproduct_nameerr] = useState('');
//     const [skuerr, setskuerr] = useState('');
//     const [success, setsuccess] = useState('');
//     const navigate = useNavigate();


//     const showConfirm = async (e) => {
//         e.preventDefault();
//         let product = ["Product Name", ":", values.product_name], msg
//         console.log(product);
//         await confirm({
//             title: 'Do you Want to confirm this product?',
//             icon: <ExclamationCircleFilled />,
//             content: product,
//             onOk() {
//                 return new Promise((resolve, reject) => {
//                     setTimeout(
//                         sendData()
//                             ? resolve : reject, 2000);
//                     console.log(resolve);
//                 }).catch(() => { console.log('Oops errors!') });
//             },
//             onCancel() { },
//         });
//     };

//     const sendData = async () => {
//         let product1 = {
//             "product_name": values.product_name,
//             "sku": values.sku,
//             "quantity": values.quantity,
//             "vendor": values.vendor,
//             "price": values.price,
//             "vendor_location":values.vendor_location,
//             "manufactured_date": values.manufactured_date,
//             "valid_upto": values.valid_upto,
//             "batch_date":values.batch_date
//         }
// //        console.log(product1);
//         let response = await createBatch(product1)
//         if (response.data.message == "error") {
//             if (response.data.error.constraint == "product_product_name_key") {
//                 setsuccess("error")
//                 setproduct_nameerr("Product name already exists.")
//             }
//             else if (response.data.error.constraint == "product_sku_key") {
//                 setsuccess("error")
//                 setskuerr("SKU already exists")
//             }
//         }
//         else if (response.data.message == "success") {
//             setsuccess("success");
//             handleClear();
//         }
//         console.log(skuerr,productnameerr,success)
//     }
//     const handleClear = () => {
//         setvalues({
//             product_name: '',
//             sku: '',
//             price: '',
//             manufacturer: '',
//             warranty: '',
//             summary: ''    
//         })
//         setfocused({
//             product_name: false,
//             sku: false,
//             price: false,
//             manufacturer: false,
//             warranty: false,
//             summary: false
    
//         })
//     }
//     const handleChange = (value) => {
//         setcategory(value);
//         console.log(`selected ${value}`);
//     };
//     const onChange = (e) => {
//         setvalues({
//             ...values,
//             [e.target.name]: e.target.value
//         })
//     }
//     const handleFocus = (e) => {
//         setfocused({
//             ...focused,
//             [e.target.name]: true   
//         });
//         if(e.target.name=="product_name"){
//             setproduct_nameerr('')
//         }
//         else if(e.target.name=="sku"){
//             setskuerr('')
//         }
//     }

//     console.log(values, focused)
//     return (
//         <div className="product-top">
//             {success === "success" ?
//                 <Alert message='Batch added successfully'
//                     type="success"
//                     closable
//                     className="alert-success"
//                 />
//                 : success === "error" ? 
//                 <Alert message={skuerr? skuerr : productnameerr}
//                  type="error" 
//                  closable
//                  className="alert-error" /> : ''
//             }

//             <div className="page-bg">
                
//                 <form onSubmit={showConfirm} className='outline-card'>
//                     <div>
//                         <Col>
//                             <div className="card-head">
//                                 Create Product
//                             </div>
//                         </Col>
//                     </div>
//                     <div className="form-row">
//                         {/* First row */}
//                         <div className='group'>
//                             <label className="text-label">Product Name</label>
//                             <input
//                                 type="text"
//                                 className="input-text"
//                                 value={values.product_name}
//                                 name='product_name'
//                                 placeholder='Product Name'
//                                 onChange={onChange}
//                                 required={true}
//                                 pattern="^[a-zA-Z0-9_.- ]*$"
//                                 onBlur={handleFocus}
//                                 focused={focused.product_name.toString()}
//                             />
//                             <p>Product name should not be empty</p>
//                             <small>
//                                 {success === "error" ? productnameerr : ''}
//                             </small>
//                         </div>

//                         <div className="group">
//                             <label className="text-label">SKU</label>
//                             <input
//                                 type="number"
//                                 className="input-text"
//                                 name='sku'
//                                 disabled
//                                 value={values.sku}
//                                 placeholder='001'
//                                 onChange={onChange}
//                                 required={true}
//                                 pattern="^[0-9]*$"
//                                 onBlur={handleFocus}
//                                 focused={focused.sku.toString()}
//                             />
//                             <p>SKU should be in numbers</p>
//                             <small>
//                                 {success === "error" ? skuerr : ''}
//                             </small>

//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className='group'>
//                             <label className="text-label">Category</label>
//                             <Select
//                                 value={category}
//                                 defaultValue="phones"
//                                 style={{ width: "100%" }}
//                                 onChange={handleChange}
//                                 options={categorylist}
//                             />
//                         </div>
//                         <div className="group">
//                             <label className="text-label">Description</label>
//                             <input
//                                 type='text'
//                                 className="input-text"
//                                 value={values.summary}
//                                 name='summary'
//                                 placeholder="Description"
//                                 onChange={onChange}
//                                 required={true}
//                                 pattern="^[a-zA-Z0-9_,+. ]*$"
//                                 onBlur={handleFocus}
//                                 focused={focused.summary.toString()}
//                             />
//                             <p>Description should not be empty</p>
//                         </div>
//                     </div>
//                     {/* Third row */}
//                     <div className="form-row">
//                         <div className='group'>
//                             <label className="text-label">Price</label>
//                             <input
//                                 type='number'
//                                 name='price'
//                                 className="input-text"
//                                 value={values.price}
//                                 placeholder="1000"
//                                 onChange={onChange}
//                                 required={true}
//                                 min='0'
//                                 onBlur={handleFocus}
//                                 focused={focused.price.toString()}
//                             />
//                             <p>Price should contains only positive numbers</p>
//                         </div>
//                         <div className="group">
//                             <label className="text-label">Manufacturer</label>
//                             <input
//                                 type='text'
//                                 name='manufacturer'
//                                 className="input-text"
//                                 placeholder="Manufacturer"
//                                 value={values.manufacturer}
//                                 onChange={onChange}
//                                 required={true}
//                                 pattern="^[A-Za-z0-9.&]*$"
//                                 onBlur={handleFocus}
//                                 focused={focused.warranty.toString()}
//                             />
//                             <p>Manufacturer should not be empty</p>
//                         </div>
//                     </div>
//                     {/* Fifth row */}
//                     <div className="form-row">
//                         <div className="group">
//                             <label className="text-label">Warranty</label>
//                             <input
//                                 type='text'
//                                 name='warranty'
//                                 placeholder="2 years"
//                                 className="input-text"
//                                 value={values.warranty}
//                                 onChange={onChange}
//                                 required={true}
//                                 pattern="^[a-zA-Z0-9 ]{1,7}$"
//                                 onBlur={handleFocus}
//                                 focused={focused.warranty.toString()}
//                             />
//                             <p>Warranty should not be empty and contains special characters</p>
//                         </div>

//                     </div>
//                     <Space wrap>
//                         <Button type='submit'>Create</Button>
//                         <Button onClick={handleClear}>Clear</Button>
//                     </Space>
//                 </form>
//             </div>
//         </div>
//     )
// }
