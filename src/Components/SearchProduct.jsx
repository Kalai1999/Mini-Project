import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { MdSwapVert } from 'react-icons/md'
import { AiOutlineSearch } from 'react-icons/ai'
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import {
    getProducts, deleteProduct, getProductbyId,
    getProductbyCategory, getProductbyVendorLocation,
    getProductbyManufacturer, getProductbyPrice,
    getProductbyProductName, getProductbyVendor,
    getProductbySku, getProductbyMrp, getProductbyCreatedAt
} from './api';
import { Radio, Input, Space, DatePicker, Button } from 'antd'
import { Row, Col } from 'react-bootstrap';


function ViewStock() {
    const [product, setproduct] = useState([]);
    const [order, setorder] = useState("ASC");
    const [search, setsearch] = useState('');
    const [startdate, setstartdate] = useState('');
    const [enddate, setenddate] = useState('');
    const [radio, setradio] = useState('product_name')
    const [batch,setbatch] = useState('');
    const { Search } = Input;
    const sorting = (col) => {
        console.log(col)
        if (order === "ASC") {
            const sorted = [...product].sort((a, b) =>
                a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
            )
            setproduct(sorted);
            setorder("DSC");
        }
        if (order === "DSC") {
            const sorted = [...product].sort((a, b) =>
                a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
            )
            setproduct(sorted);
            setorder("ASC");
        }
    }
    useEffect(() => {

    }, [search]);

    const getData = async () => {
        let data = await getProducts();
        setproduct(data);
    }

    const handleDelete = async (data) => {
        deleteProduct(data);
        alert('Product deleted!');
        getData();
    }

    const onSearch = async (value, value1) => {
        setsearch(value);
        console.log(radio, value);
        switch (radio) {
            case 'product_name': {
                console.log(value);
                let pro = await getProductbyProductName(value)
                setbatch(false)
                setproduct(pro.stocks);
                break;
            }
            case 'product_id': {
                console.log(value);
                let pro = await getProductbyId(value)
                setbatch(false)
                setproduct(pro);
                break;
            }
            case 'category': {
                console.log(value);
                let pro = await getProductbyCategory(value)
                setbatch(false)
                setproduct(pro);
                break;
            }
            case 'sku': {
                console.log(value);
                let pro = await getProductbySku(value)
                setbatch(false)
                setproduct(pro);
                break;
            }
            case 'price': {
                console.log(value);
                let pro = await getProductbyPrice(parseInt(value),parseInt(value1))
                setbatch(false)
                setproduct(pro);
                break;
            }
            case 'manufacturer': {
                console.log(value);
                let pro = await getProductbyManufacturer(value)
                setbatch(false)
                setproduct(pro);
                break;
            }
            case 'vendor': {
                console.log(value);
                let pro = await getProductbyVendor(value)
                setbatch(true)
                setproduct(pro);
                break;
            }
            case 'vendor_location': {
                console.log(value);
                let pro = await getProductbyVendorLocation(value, value1)
                setproduct(pro);
                setbatch(true)
                break;
            }
        }
        console.log(value);
    }
    return (
        <div className='product-top'>
            <h5>Search product by </h5>
            <Radio.Group defaultValue="product_name"
                onChange={(e) => setradio(e.target.value)}>
                <Radio value="product_name">Product name</Radio>
                <Radio value="sku">SKU</Radio>
                <Radio value="price">Price range</Radio>
                <Radio value="category">Category</Radio>
                <Radio value="manufacturer">Manufacturer</Radio>
                <Radio value="vendor">Vendor</Radio>
                <Radio value="vendor_location">Vendor location</Radio>

            </Radio.Group>
        {radio!=='created_at' && radio!=='price'?
            <Space className='search-block'>
                <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                />
            </Space>:
            radio=='created_at'?
            <Space className='search-block'>
            <Row>
                <Col>
                    <div className="group">
                        <label className="text-label">Start Date</label>
                        <input
                            className="input-text"
                            style={{ width: '100%' }}
                            type="date"
                            value={startdate}
                            onChange={(e) => { setstartdate(e.target.value) }}
                        />
                    </div>

                </Col>
                <Col>
                    <div className="group">
                        <label className="text-label">End Date</label>
                        <input
                            className="input-text"
                            style={{ width: '100%' }}
                            type="date"
                            value={enddate}
                            onChange={(e) => { setenddate(e.target.value) }}
                        />
                    </div>

                </Col>
                <Col>
                    <Button onClick={() => onSearch(startdate, enddate)}> Search</Button>
                </Col>
            </Row></Space>:
                       <Space className='search-block'>
                       <Row>
                           <Col>
                               <div className="group">
                                   <label className="text-label">Min price</label>
                                   <input
                                       className="input-text"
                                       style={{ width: '100%' }}
                                       type="number"
                                       value={startdate}
                                       onChange={(e) => { setstartdate(e.target.value) }}
                                   />
                               </div>
           
                           </Col>
                           <Col>
                               <div className="group">
                                   <label className="text-label">Max price</label>
                                   <input
                                       className="input-text"
                                       style={{ width: '100%' }}
                                       type="number"
                                       value={enddate}
                                       onChange={(e) => { setenddate(e.target.value) }}
                                   />
                               </div>
           
                           </Col>
                           <Col>
                               <Button onClick={() => onSearch(startdate, enddate)}> Search</Button>
                           </Col>
                       </Row></Space> 
}
            {search != ''&& product!==[] ?
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th onClick={() => sorting("product_name")}>Product Name<MdSwapVert /></th>
                            <th onClick={() => sorting("sku")}>SKU<MdSwapVert /></th>
                            <th onClick={() => sorting("selling_price")}>Price<MdSwapVert /></th>
                            <th onClick={() => sorting("category")}>Category<MdSwapVert /></th>
                            <th onClick={() => sorting("manufacturer")}>Manufacturer<MdSwapVert /></th>
                            {batch?
                            <th onClick={() => sorting("vendor")}>Vendor<MdSwapVert /></th>
                            :''}
                            {batch?
                            <th onClick={() => sorting("vendor_location")}>Vendor Location<MdSwapVert /></th>
                            :''}
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.map((prod, index) => (
                            <tr key={index}>
                                <td>{prod.product_name}</td>
                                <td>{prod.sku}</td>
                                <td>{prod.selling_price}</td>
                                <td>{prod.category}</td>
                                <td>{prod.manufacturer}</td>
                                {batch?
                                <td>{prod.vendor}</td>:''}
                                {batch?
                                <td>{prod.vendor_location}</td>:''}
                                <td className='icon-button'>
                                    <div>
                                        <DeleteTwoTone twoToneColor="#ff1212" onClick={(e) => {
                                            handleDelete(prod)
                                            console.log(prod)
                                        }} />
                                    </div>
                                    <Link to={`/edit-product/${prod.product_id}`} state={{ data: prod }} >
                                        <EditTwoTone />
                                    </Link>
                                </td>
                            </tr>

                        ))}
                    </tbody>

                </Table> : <div>Products not found</div>
            }
        </div>
    );
}
export default ViewStock;