import * as XLSX from 'xlsx'
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'antd'
import { MdSwapVert } from 'react-icons/md'
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProducts, deleteProduct, getProductbyId, createProduct } from './api';
import '../css/stock.css'
export default function BulkUpload() {
    const [product, setproduct] = useState();
    const [status, setstatus] = useState();
    let statusmsg = [];
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

        let product = "Products in excel will be saved!"
        await confirm({
            title: 'Do you want to upload product in this file ?',
            icon: <ExclamationCircleFilled />,
            content: product,
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(
                        insertProduct()
                            ? resolve : reject, 2000);
                    console.log(resolve);
                    // navigate('/product-list');
                }).catch(() => { console.log('Oops errors!') });

            },
            onCancel() { },
        });
    };
    const insertProduct = async () => {
        for (let i = 0; i < product.length; i++) {
            let productData = {
                "product_name": product[i].product_name,
                "sku": product[i].sku,
                "summary": product[i].summary,
                "category": product[i].category,
                "selling_price": product[i].selling_price,
                "manufacturer": product[i].manufacturer,
                "warranty": product[i].warranty,
            }
            //    console.log(productData)
            let response = await createProduct(productData)
            console.log(response,response.data.message)
            product[i].status = response.data.message
//            product[i].status = response.data.message
            if (response.data.message == 'success') {
                product[i].status = response.data.message
            }
            else if (response.data.message == 'error') {
                if (response.data.error.constraint == "product_product_name_key") {
                    product[i].status = "Product name already exists"
                }
                else if (response.data.error.constraint == "product_sku_key") {
                    product[i].status = "SKU already exists"
                }
            }
        }
        setproduct(product)
        console.log(product,"ttt")
        // navigate('/product-list')
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
            {console.log(product,"nnn")}
            {product ?
                <div className="product-top">
                    <h3>Product List</h3>
                    <div className='upload-button'>
                        <Button onClick={showConfirmUpload}>Upload</Button>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th onClick={() => sorting("product_name")}>Product Name<MdSwapVert /></th>
                                <th onClick={() => sorting("sku")}>SKU<MdSwapVert /></th>
                                <th onClick={() => sorting("selling_price")}>Price<MdSwapVert /></th>
                                <th onClick={() => sorting("category")}>Category<MdSwapVert /></th>
                                <th onClick={() => sorting("manufacturer")}>Manufacturer<MdSwapVert /></th>
                                <th onClick={() => sorting("warranty")}>Warranty<MdSwapVert /></th>
                                <th>Status</th>
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
                                    <td>{prod.warranty}</td>
                                    <td>{prod.status}</td>
                                </tr>

                            ))}
                        </tbody>
                    </Table>

                </div>
                : <div className='product-top'><label>Looking for products</label></div>}
        </div>
    )
}