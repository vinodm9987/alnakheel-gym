import React from 'react'
import logo from '../../assets/img/giphy.gif'
import loader from '../../assets/img/800.gif'
import bgImage from '../../assets/img/icon-bg.jpg'
import { connect } from 'react-redux'

function Spinner(props) {
    if (props.loader) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fcfdfa',
                position: 'absolute',
                zIndex: 1030,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover'
            }}>
                <img src={logo} alt='' style={{ width: '200px', height: '150px' }} />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <h3>Loading</h3>
                    <img src={loader} alt='' style={{ width: '40px', height: '10px', marginLeft: '10px' }} />
                </div>
            </div>
        )
    } else {
        return null
    }
}

const mapStateToProps = ({ loader }) => ({
    loader
});

export default connect(mapStateToProps)(Spinner);