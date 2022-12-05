import pic1 from '../css/images/bg.png'
import '../css/stock.css'
import { Row, Col, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
const Home = () => {
    return (
        <div className='home'>
            <Container>
                <Row>
                    <Col>
                        <div className='quote'>
                            Success in management requires learning as fast as the world changes                
                        </div>
                        <Link  to={'/product-list'}>
                            <button className='home-button'>
                                Lets's start learning
                            </button>
                        </Link>
                    </Col>
                    <Col>
                        <div>
                            <img src={pic1} className='right-img' />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Home;