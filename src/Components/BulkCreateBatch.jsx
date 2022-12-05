import * as XLSX from 'xlsx'
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'antd'
import { MdSwapVert } from 'react-icons/md'
import { Modal } from 'antd';
import { ExclamationCircleFilled, DeleteTwoTone } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProducts, deleteProduct, createBatch } from './api';
import '../css/stock.css'
export default function BulkCreateBatch() {
    const [product, setproduct] = useState();
    const navigate = useNavigate();
    const [order, setorder] = useState("ASC");
    const { confirm } = Modal;
    const sorting = (col) => {
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

    const showConfirmUpload = async () => {

        let product = "Batch in excel will be saved!"
        await confirm({
            title: 'Do you want to upload batch in this file ?',
            icon: <ExclamationCircleFilled />,
            content: product,
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(
                        sendData()
                            ? resolve : reject, 2000);
                    console.log(resolve);
                }).catch(() => { console.log('Oops errors!') });

            },
            onCancel() { },
        });
    };

    const sendData = async () => {
        for (let i = 0; i < product.length; i++) {
            let product1 = {
                "product_id": product[i].product_id,
                "product_name": product[i].product_name,
                "quantity": product[i].quantity,
                "price": product[i].price,
                "sku": product[i].sku,
                "vendor": product[i].vendor,
                "vendor_location": product[i].vendor_location,
                "manufactured_date": product[i].manufactured_date,
                "batch_date": product[i].batch_date,
                "valid_upto": product[i].valid_upto,
            }
            console.log(product1);
            let response = await createBatch(product1)
            product[i].status = response.data.message;
            
        }
        navigate('/batch-list');
    }


    const readExcel = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
            const bufferArray = e.target.result;
            console.log(bufferArray);
            const wb = XLSX.read(bufferArray, { type: 'buffer' })
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname];
            let data = XLSX.utils.sheet_to_json(ws);
            setproduct(data);
            console.log(product)
        }

        fileReader.onerror = (err => {
            console.log(err);
        })
    }
    return (
        <div >
            <div className='upload-input'>
                <input
                    className='upload-input'
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        console.log(file);
                        readExcel(file);
                    }}
                /></div>
            {console.log(product)}
            {product ?
                <div className="product-top">
                    <h3>Product List</h3>
                    <div className='upload-button'>
                        <Button onClick={showConfirmUpload}>Upload</Button>
                    </div>
                    <Table striped bordered hover>
                        <thead className='thead-font'>
                            <tr>
                                <th onClick={() => sorting("batch_name")}>Batch Name<MdSwapVert /></th>
                                <th onClick={() => sorting("product_name")}>Product Name<MdSwapVert /></th>
                                <th onClick={() => sorting("price")}>Price<MdSwapVert /></th>
                                <th onClick={() => sorting("quantity")}>Quantity<MdSwapVert /></th>
                                <th onClick={() => sorting("vendor")}>Vendor<MdSwapVert /></th>
                                <th onClick={() => sorting("vendor_location")}>Vendor Location<MdSwapVert /></th>
                                <th onClick={() => sorting("batch_date")}>Created at<MdSwapVert /></th>
                                <th onClick={() => sorting("valid_upto")}>Expired at<MdSwapVert /></th>
                                {/* <th>Status</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {product.map((prod, index) => (
                                <tr key={index}>
                                    <td>{prod.batch_name}</td>
                                    <td>{prod.product_name}</td>
                                    <td>{prod.price}</td>
                                    <td>{prod.quantity}</td>
                                    <td>{prod.vendor}</td>
                                    <td>{prod.vendor_location}</td>
                                    <td>{prod.batch_date}</td>
                                    <td>{prod.valid_upto === 'YYYY-MM-DD' ? 'none' : prod.valid_upto}</td>
                                    {/* <td>{prod.status}</td> */}
                                </tr>

                            ))}
                        </tbody>
                    </Table>

                </div>
                : <div className='product-top'><label>Looking for batches</label></div>}
        </div>
    )
}