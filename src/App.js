import './App.css';
import ViewBatch from './Components/ViewBatch';
import ViewStock from './Components/ViewProduct';
import NavDropdown from 'react-bootstrap/NavDropdown';
import CreateProduct from './Components/CreateProduct';
import CreateBatch from './Components/CreateBatch';
import EditProduct from './Components/EditProduct';
import SearchProduct from './Components/SearchProduct';
import ProductUpload from './Components/BulkCreateProduct';
import ProductUpdate from './Components/BulkUpdate';
import BatchUpload from './Components/BulkCreateBatch';
import Home from './Components/Home'
import { Nav, Navbar, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {
	return (
		<Router>
			<div className="App">
				<header>
					<Navbar bg="dark" variant="dark">
						<Container>
							{/* <Navbar.Brand>
								<Link to={"/product-list"}
									className="nav-link">
									Products
								</Link>
							</Navbar.Brand> */}

							<Nav className="justify-content-end">
							<Nav>
									<Link to={"/"}
										className="nav-link">
										Home
									</Link>
								</Nav>
								<Nav>
									<NavDropdown
										id="nav-dropdown-dark-example"
										title="Product"
										style={{ backgroundColor: "#212529" }}
										menuVariant="dark"
									>
										<NavDropdown.Item href="/create-product">
											Create
										</NavDropdown.Item>
										<NavDropdown.Item href="/search-product">
											Search
										</NavDropdown.Item>
										<NavDropdown.Item href="/product-list">
											View
										</NavDropdown.Item>
									</NavDropdown>
								</Nav>
								<Nav>
									<NavDropdown
										id="nav-dropdown-dark-example"
										title="Batch"
										style={{ backgroundColor: "#212529" }}
										menuVariant="dark"
									>
										<NavDropdown.Item href="/create-batch">
											Create
										</NavDropdown.Item>
										<NavDropdown.Item href="/batch-list">
											View
										</NavDropdown.Item>
									</NavDropdown>
								</Nav>
								<Nav>
								<NavDropdown
										id="nav-dropdown-dark-example"
										title="Bulk upload"
										style={{ backgroundColor: "#212529" }}
										menuVariant="dark"
									>
										<NavDropdown.Item href="/product-upload">
											Upload product
										</NavDropdown.Item>
										<NavDropdown.Item href="/product-update">
											Update product
										</NavDropdown.Item>
										<NavDropdown.Item href="/batch-upload">
											Upload batch
										</NavDropdown.Item>
									</NavDropdown>
								</Nav>
							</Nav>
						</Container>
					</Navbar>
				</header>

				<Container>
					<Row>
						<Col md={12}>
							<div className="wrapper">
								<Routes>
									<Route default path="/"
										element={<Home />} />
									<Route path="/create-product"
										element={<CreateProduct />} />
									<Route path="/search-product"
										element={<SearchProduct />} />
									<Route path="/create-batch"
										element={<CreateBatch />} />
									<Route path="/batch-list"
										element={<ViewBatch />} />
									<Route path="/edit-product/:id"
										element={<EditProduct />} />
									<Route path="/product-list"
										element={<ViewStock />} />
									<Route path="/product-upload"
										element={<ProductUpload />} />
									<Route path="/batch-upload"
										element={<BatchUpload />} />
									<Route path="/product-update"
										element={<ProductUpdate />} />
								</Routes>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</Router>
	);
};

export default App;