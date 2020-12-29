const path = "https://skoolgo.pixelmindit.com:5000/images/gymnago.png"

module.exports = {

  verifyCode: (code) => {
    return `<div style="
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            backgroundColor: "#ccc",
            overflow: "auto",
            paddingBottom: "40px",
            fontFamily: "sans-serif"
          ">
            <img src=${path} alt="logo"
              style=""
                width: "270px",
                maxWidth: "100%",
                margin: "40px auto",
                display: "block"
              "" />
            <div style=""
              padding: "40px 40px 80px 40px",
              borderLeft: "40px solid #ccc",
              borderRight: "40px solid #ccc",
              boxSizing: "border-box",
              width: "100%",
              backgroundColor: "#fff"
            "">
              <h3
                style=""
                  fontSize: "28px",
                  textAlign: "center",
                  fontWeight: "700",
                  margin: "0 0 40px 0"
                "">
                Confirm Your Account
              </h3>
              <p
                style="" margin: "0" "" >
                Hi There,
              </p>
              <p
                style="" margin: "0" "" >
                Welcome to Gymnago, Here is the confirmation code for your sign in
              </p>
              <h2
                style=""
                  fontSize: "35px",
                  fontWeight: "700",
                  color: "#007bff",
                  margin: " 16px 0",
                  letterSpacing: "7px"
                "" >
                ${code}
              </h2>
              <p
                style="" margin: "0" "">
                All you have to do is copy code and paste it to your form to complete the email verification process
              </p>
              <p
                style="" margin: "40px 0 0 0" "">
                Thank you,
              </p>
              <a href="#"
                style="" color: "#007bff", margin: "0", textDecoration: "none" "">
                The GymNaGo Team
              </a>
            </div>
          </div>`
  },

  passwordGenerated: (password, userName) => {
    return ` <div style=""
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                backgroundColor: "#ccc",
                overflow: "auto",
                paddingBottom: "40px",
                fontFamily: "sans-serif"
              "">
                <img src=${path} alt="logo"
                  style=""
                    width: "270px",
                    maxWidth: "100%",
                    margin: "40px auto",
                    display: "block"
                  "" />
                <div style=""
                  padding: "40px 40px 80px 40px",
                  borderLeft: "40px solid #ccc",
                  borderRight: "40px solid #ccc",
                  boxSizing: "border-box",
                  width: "100%",
                  backgroundColor: "#fff"
                "">
                  <h3
                    style=""
                      fontSize: "28px",
                      textAlign: "center",
                      fontWeight: "700",
                      margin: "0 0 40px 0"
                    "">
                    Generated Password
                  </h3>
                  <p
                    style="" margin: "0" "" >
                    Hi ${userName},
                  </p>
                  <p
                    style="" margin: "0" "" >
                    You are recieving this email because we have got a request to generate new password for your account
                  </p>
                  <div
                    style=""
                        margin: " 16px 5px"
                    "" >
                    <span>
                        Your Password is:
                    </span>
                    <span             
                      style=""
                        fontSize: "35px",
                        fontWeight: "700",
                        color: "#007bff",
                        margin: "0 0 0 8px"
                      "" >
                        ${password}
                    </span>
                  </div>
                  <p
                    style="" margin: "40px 0 0 0" "">
                    Thank you,
                  </p>
                  <a href="#"
                    style="" color: "#007bff", margin: "0", textDecoration: "none" "">
                    The Gymnago Team
                  </a>
                </div>
              </div>`
  }

};