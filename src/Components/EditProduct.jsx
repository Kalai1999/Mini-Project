import { useState } from "react"
import { useNavigate ,useLocation} from "react-router-dom";
import { Col, Button } from "react-bootstrap";
import '../css/stock.css'
import { updateProduct } from "./api";
import { Select, Modal, Space, Alert } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

export default function EditProduct(props) {
    const location = useLocation();
    let data = location.state.data;

console.log(data)
//declarations
    const { confirm } = Modal;
    const [values, setvalues] = useState({
        product_id:data.product_id,
        product_name: data.product_name,
        sku: data.sku,
        selling_price: data.selling_price,
        manufacturer: data.manufacturer,
        warranty: data.warranty,
        summary: data.summary
    })
    const [focused, setfocused] = useState({
        product_name: false,
        sku: false,
        selling_price: false,
        manufacturer: false,
        warranty: false,
        summary: false
    });
    const categorylist = [
        { value: "Phones", label: "Phones" },
        { value: "Tab", label: "Tab" },
        { value: "TV", label: "TV" },
        { value: "Accessories", label: "Accessories" }];
    const [productnameerr, setproduct_nameerr] = useState('');
    const [category, setcategory] = useState(data.category);
    const [skuerr, setskuerr] = useState('');
    const [success, setsuccess] = useState('');
    const navigate = useNavigate();
    let today = new Date();
    let date = today.getFullYear() + '-' + parseInt(today.getMonth() + 1) + '-' + today.getDate()


    const showConfirm = async (e) => {
        e.preventDefault();
        let product = ["Product Name", ":", values.product_name], msg
        console.log(product);
        await confirm({
            title: 'Do you want to update this product?',
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

    const sendData = async () => {
        let product1 = {
            "product_id":values.product_id,
            "product_name": values.product_name,
            "sku": values.sku,
            "summary": values.summary,
            "category": category,
            "selling_price": values.selling_price,
            "manufacturer": values.manufacturer,
            "warranty": values.warranty
        }
       console.log(product1);
        let response = await updateProduct(product1)
        if (response.data.message == "error") {
            setsuccess('error');
            alert('something went wrong! kindly check the values are in correct formats')
        }
        else if (response.data.message == "success") {
            setsuccess("success");
            alert('product updated successfully')
            navigate('/product-list')
            handleClear();
        }
        console.log(skuerr,productnameerr,success)
    }
    const handleClear = () => {
        setvalues({
            product_name: '',
            sku: '',
            selling_price: '',
            manufacturer: '',
            warranty: '',
            summary: ''    
        })
        setfocused({
            product_name: false,
            sku: false,
            selling_price: false,
            manufacturer: false,
            warranty: false,
            summary: false
    
        })
        setcategory('phones')
    }
    const handleChange = (value) => {
        setcategory(value);
        console.log(`selected ${value}`);
    };
    const onChange = (e) => {
        setvalues({
            ...values,
            [e.target.name]: e.target.value
        })
    }
    const handleFocus = (e) => {
        setfocused({
            ...focused,
            [e.target.name]: true   
        });
        if(e.target.name=="product_name"){
            setproduct_nameerr('')
        }
        else if(e.target.name=="sku"){
            setskuerr('')
        }
    }

    console.log(values, focused)
    return (
        <div className="product-top">
            {success === "success" ?
                <Alert message='Product added successfully'
                    type="success"
                    closable
                    className="alert-success"
                />
                : success === "error" ? 
                <Alert message={skuerr? skuerr : productnameerr}
                 type="error" 
                 closable
                 className="alert-error" /> : ''
            }

            <div className="page-bg">                  
                <form onSubmit={showConfirm} className='outline-card'>
                    <div>
                        <Col>
                            <div className="card-head">
                                Update product
                            </div>
                        </Col>
                    </div>
                    <div className="form-row">
                        {/* First row */}
                        <div className='group'>
                            <label className="text-label">Product Name</label>
                            <input
                                type="text"
                                className="input-text"
                                value={values.product_name}
                                name='product_name'
                                placeholder='Product Name'
                                onChange={onChange}
                                required={true}
                                pattern="^[a-zA-Z0-9_.- ]*$"
                                onBlur={handleFocus}
                                focused={focused.product_name.toString()}
                            />
                            <p>Product name should not be empty</p>
                            <small>
                                {success === "error" ? productnameerr : ''}
                            </small>
                        </div>

                        <div className="group">
                            <label className="text-label">SKU</label>
                            <input
                                type="number"
                                className="input-text"
                                name='sku'
                                value={values.sku}
                                placeholder='001'
                                onChange={onChange}
                                required={true}
                                pattern="^[0-9]*$"
                                onBlur={handleFocus}
                                focused={focused.sku.toString()}
                            />
                            <p>SKU should be in numbers</p>
                            <small>
                                {success === "error" ? skuerr : ''}
                            </small>

                        </div>
                    </div>
                    <div className="form-row">
                        <div className='group'>
                            <label className="text-label">Category</label>
                            <Select
                                value={category}
                                defaultValue="phones"
                                style={{ width: "100%" }}
                                onChange={handleChange}
                                options={categorylist}
                            />
                        </div>
                        <div className="group">
                            <label className="text-label">Description</label>
                            <input
                                type='text'
                                className="input-text"
                                value={values.summary}
                                name='summary'
                                placeholder="Description"
                                onChange={onChange}
                                required={true}
                                pattern="^[a-zA-Z0-9_.- +]*$"
                                onBlur={handleFocus}
                                focused={focused.summary.toString()}
                            />
                            <p>Description should not be empty</p>
                        </div>
                    </div>
                    {/* Third row */}
                    <div className="form-row">
                        <div className='group'>
                            <label className="text-label">Price</label>
                            <input
                                type='number'
                                name='selling_price'
                                className="input-text"
                                value={values.selling_price}
                                placeholder="1000"
                                onChange={onChange}
                                required={true}
                                min='0'
                                onBlur={handleFocus}
                                focused={focused.selling_price.toString()}
                            />
                            <p>Price should contains only positive numbers</p>
                        </div>
                        <div className="group">
                            <label className="text-label">Manufacturer</label>
                            <input
                                type='text'
                                name='manufacturer'
                                className="input-text"
                                placeholder="Manufacturer"
                                value={values.manufacturer}
                                onChange={onChange}
                                required={true}
                                pattern="^[A-Za-z0-9.&]*$"
                                onBlur={handleFocus}
                                focused={focused.warranty.toString()}
                            />
                            <p>Manufacturer should not be empty</p>
                        </div>
                    </div>
                    {/* Fifth row */}
                    <div className="form-row">
                        <div className="group">
                            <label className="text-label">Warranty</label>
                            <input
                                type='text'
                                name='warranty'
                                placeholder="2 years"
                                className="input-text"
                                value={values.warranty}
                                onChange={onChange}
                                required={true}
                                pattern="^[a-zA-Z0-9]{1,12}$"
                                onBlur={handleFocus}
                                focused={focused.warranty.toString()}
                            />
                            <p>Warranty should not be empty and contains special characters</p>
                        </div>

                    </div>
                    <Space wrap>
                        <Button type='submit'>Update</Button>
                        <Button onClick={handleClear}>Clear</Button>
                    </Space>
                </form>
            </div>
        </div>
    )
}
