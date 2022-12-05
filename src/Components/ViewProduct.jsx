import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { MdSwapVert } from 'react-icons/md'
import { Modal, Pagination,Button } from 'antd';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Link ,useNavigate} from 'react-router-dom';
import { getProducts, deleteProduct, getProductsAll } from './api';
import * as XLSX from 'xlsx';
function ViewStock() {
  const [product, setproduct] = useState([]);
  const [products, setproducts] = useState([]);
  const [total, settotal] = useState('0');
  const [startrow, setstartrow] = useState('0')
  const [endrow, setendrow] = useState('0')
  const [order, setorder] = useState("ASC");
  const { confirm } = Modal;
  const navigate = useNavigate();
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
  }, []);

  const getData = async (page) => {
    let offset;
    if (page == 1)
      offset = 0;
    else
      offset = ((page - 1) * 10);
    let end;
    console.log(offset);
    let data = await getProducts(offset);
    setproduct(data.stocks[0]);
    setstartrow(offset + 1)
    settotal(data.stocks[1])
    end = offset + 10
    if (end > parseInt(total)) {
      setendrow(total)
    }
    else
      setendrow(end)

  }
  const showConfirm = async (data) => {
    console.log(data.product_name)
    let product = ["Batches related with this product also be deleted!  ", "  ", "Product name :", data.product_name]
    await confirm({
      title: 'Do you want to delete this product ?',
      icon: <ExclamationCircleFilled />,
      content: product,
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(
            handleDelete(data)
              ? resolve : reject, 2000);
          console.log(resolve);
          getData(1)
        }).catch(() => { console.log('Oops errors!') });

      },
      onCancel() { },
    });
  };
  const handleDelete=async(data)=>{
    let res = deleteProduct(data)
    if(res.data.message=="success"){
      alert('Product is deleted successfully..')
      getData(1);
    }
    else if(res.data.message=="Product not found."){
      alert("Product not found.")
    }
    getData(1);
    navigate('/product-list');
  }
  const showConfirmDownloadAll=async ()=>{
    let data = await getProductsAll();
    setproducts(data.stocks);

    let wb = XLSX.utils.book_new(),
    ws=XLSX.utils.json_to_sheet(products);

    XLSX.utils.book_append_sheet(wb,ws,'Product Sheet 1');
    XLSX.writeFile(wb,'Product List.xlsx');

  }

  const showConfirmDownload = async () => {

    let wb = XLSX.utils.book_new(),
    ws=XLSX.utils.json_to_sheet(product);

    XLSX.utils.book_append_sheet(wb,ws,'Product Sheet 1');
    XLSX.writeFile(wb,'Product List.xlsx');
  };


  return (
    <div className='product-top'>
      <h3>Product List</h3>
      <div className='upload-button'>
        <Button onClick={showConfirmDownload} style={{marginRight:'10px'}}>Download</Button>
        <Button onClick={showConfirmDownloadAll}>Download all</Button>
      </div>

      <div className='pagination'>
        <span>{startrow} - {endrow} / {total}</span>
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
              <td>{prod.warranty}</td>
              <td className='icon-button'>
                <div>
                <DeleteTwoTone twoToneColor="#ff1212" onClick={e => showConfirm(prod)} />
                </div>
                <Link to={`/edit-product/${prod.product_id}`} state={{ data: prod }} >
                  <EditTwoTone />
                </Link>
              </td>
            </tr>

          ))}
        </tbody>


      </Table>

      <Pagination defaultCurrent={1} total={total} onChange={(e) => getData(e)} />
    </div>
  );
}
export default ViewStock;