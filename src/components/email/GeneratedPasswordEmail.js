import React, { Component } from 'react'
import gymlogo from '../../assets/img/gymnago.png'
import algymlogo from '../../assets/img/al-main-logo.png'

class GeneratedPasswordEmail extends Component {

  render() {
    return (
      <div style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        backgroundColor: "#ccc",
        overflow: "auto",
        paddingBottom: "40px",
        fontFamily: "sans-serif"
      }}>
        <img src={algymlogo} alt="logo"
          style={{
            width: "100px",
            maxWidth: "100%",
            margin: "40px auto",
            display: "block"
          }} />
        <div style={{
          padding: "40px 40px 80px 40px",
          borderLeft: "40px solid #ccc",
          borderRight: "40px solid #ccc",
          boxSizing: "border-box",
          width: "100%",
          backgroundColor: "#fff"
        }}>
          <h3
            style={{
              fontSize: "28px",
              textAlign: "center",
              fontWeight: "700",
              margin: "0 0 40px 0"
            }}>
            Generated Password
          </h3>
          <p
            style={{ margin: "0" }} >
            Hi Muhammed Abdulla,
          </p>
          <p
            style={{ margin: "0" }} >
            You are recieving this email because we have got a request to generate new password for your account
          </p>
          <div
            style={{
                margin: " 16px 5px"
            }} >
            <span>
                Your Password is:
            </span>
            <span             
              style={{
                fontSize: "35px",
                fontWeight: "700",
                color: "#007bff",
                margin: "0 0 0 8px"
              }} >
                bzrlcva8
            </span>
          </div>
          <p
            style={{ margin: "40px 0 0 0" }}>
            Thank you,
          </p>
          <a href="#"
            style={{ color: "#007bff", margin: "0", textDecoration: "none" }}>
            The Gymnago Team
          </a>
        </div>
      </div>
    )
  }
}

export default GeneratedPasswordEmail