import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { MdSwapVert } from 'react-icons/md'
import { Modal,Pagination,Button} from 'antd';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { getProducts, deleteProduct, getProductbyId, getBatch, deleteBatch } from './api';
function ViewBatch() {
  const [product, setproduct] = useState([]);
  const [products, setproducts] = useState([]);
  const [order, setorder] = useState("ASC");
  const [search, setsearch] = useState('');
  const [total, settotal] = useState('0');
  const [startrow, setstartrow] = useState('0')
  const [endrow, setendrow] = useState('0')
  const navigate = useNavigate();
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
  useEffect(() => {
    getData(1)
  }, [search]);

  const getData = async (page) => {
    let offset=0;
    if (page == 1)
      offset = 0;
    else
      offset = ((page - 1) * 10);
    console.log(offset);
    let data = await getBatch(offset);
    console.log(data);
    setproduct(data.batches[0]);
    setstartrow(offset + 1)
    settotal(data.batches[1])
    end = offset + 10
    if (end >= parseInt(total)) {
      setendrow(total)
    }
    else
      setendrow(end)

  }
  const showConfirm = async (data) => {
    console.log(data.product_name)
    let product=["Product name :", data.product_name]
     confirm({
        title: 'Do you want to delete this product?',
        icon: <ExclamationCircleFilled />,
        content: product,
        onOk() {
            return new Promise(async(resolve, reject) => {
                setTimeout(
                    await handleDelete(data)
                     ? resolve : reject, 2000);
                    console.log(resolve);
                navigate('/batch-list');
                getData();
            }).catch(() => { console.log('Oops errors!') });
            
        },
        onCancel() { },
    });
};
const handleDelete=async(data)=>{
  let res = await deleteBatch(data)
  if(res.data.message=="success!"){
    alert('Batch is deleted successfully..')
    getData(1);
  }
  else if(res.data.message=="Batch not found."){
    alert("Batch not found.")
  }
  navigate('/batch-list');
}
const showConfirmDownloadAll=async ()=>{
  let data = await getProductsAll();
  setproducts(data.stocks);

  let wb = XLSX.utils.book_new(),
  ws=XLSX.utils.json_to_sheet(products);

  XLSX.utils.book_append_sheet(wb,ws,'Batch Sheet 1');
  XLSX.writeFile(wb,'Batch List.xlsx');

}

const showConfirmDownload = async () => {

  let wb = XLSX.utils.book_new(),
  ws=XLSX.utils.json_to_sheet(product);

  XLSX.utils.book_append_sheet(wb,ws,'Batch Sheet 1');
  XLSX.writeFile(wb,'Batch List.xlsx');
};



  return (
    <div className='product-top'>
      <h3>Batch List</h3>
      <div className='upload-button'>
        <Button onClick={showConfirmDownload} style={{marginRight:'10px'}}>Download</Button>
        <Button onClick={showConfirmDownloadAll}>Download all</Button>
      </div>

      <div className='pagination'>
        <span>{startrow} - {endrow} / {total}</span>
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
            <th>Options</th>
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
                <td>{prod.valid_upto==='YYYY-MM-DD'?'none':prod.valid_upto}</td>
                <td className='icon-button'>
                  <div>
                    <DeleteTwoTone twoToneColor="#ff1212" onClick={e=>showConfirm(prod)}/>
                  </div>
                </td>
              </tr>

            ))}
          </tbody>
        

      </Table>
      <Pagination defaultCurrent={1} total={total} onChange={(e) => getData(e)} />

    </div>
  );
}
export default ViewBatch;