import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import styles from "./dashboard.module.css";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const { logindata, setLoginData } = useContext(LoginContext);
  const [data, setData] = useState(false);
  const [inpval, setInpval] = useState([]);
  const setVal = (e) => {
    const { name, value } = e.target;

    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();

    if (data.status === 401 || !data) {
      history("*");
    } else {
      setLoginData(data);
      history("/dash");
    }
  };

  const edit = () => {
    setInpval(logindata.ValidUserOne);
    setShow(true);
  };

  const update = async (e) => {
    e.preventDefault();
    const { _id, fname, email, age } = inpval;
    const data = await fetch("/updateUser/" + _id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: fname,
        email: email,
        age: age,
      }),
    });

    const res = await data.json();

    if (res.status === 200) {
      toast.success("Update Successfully done 😊!", {
        position: "top-center",
      });
      setInpval({ ...inpval, fname: "", email: "", age: "" });
      DashboardValid();
      setData(true);
      setShow(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 2000);
  }, []);

  return (
    <>
      {data ? (
        <div className={styles.banner}>
          <Card className={styles.cardTop}>
            <Card.Img
              className={styles.cardImg}
              variant="top"
              src="./man.png"
              alt="avtar"
            />
            <Card.Body>
              <Card.Title className="text-center">User Info</Card.Title>
              <Card.Text style={{ marginLeft: "42px" }}>
                <label>
                  <b>Name:</b>
                  <span>
                    &nbsp;{logindata ? logindata.ValidUserOne.fname : ""}
                  </span>
                </label>
                <label>
                  <b>Email:</b>
                  <span>
                    &nbsp;{logindata ? logindata.ValidUserOne.email : ""}
                  </span>
                </label>
                <label>
                  <b>D.O.B:</b>
                  <span>
                    &nbsp;
                    {logindata
                      ? format(
                          new Date(logindata.ValidUserOne.age),
                          "dd-MM-yyyy"
                        )
                      : ""}
                  </span>
                </label>
              </Card.Text>
              <Button
                variant="primary"
                onClick={edit}
                className={styles.cardButton}
              >
                edit
              </Button>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}

      <Modal show={show}>
        <Modal.Header onClick={handleClose} closeButton>
          <Modal.Title>Update User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.banner}>
            <img
              src="./man.png"
              style={{ width: "100px", marginTop: 20 }}
              alt=""
            />
            <div className="form_input">
              <label htmlFor="fname">
                <b>Name:</b>
              </label>
              &nbsp;
              <input
                type="text"
                className={styles.modalInp}
                onChange={setVal}
                value={inpval.fname}
                name="fname"
                id="fname"
                placeholder="Enter Your Name"
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">
                <b>Email:</b>
              </label>
              &nbsp;
              <input
                type="email"
                onChange={setVal}
                value={inpval.email}
                name="email"
                id="email"
                className={styles.modalInp}
                placeholder="Enter Your Email Address"
              />
            </div>
            <div className="form_input">
              <label htmlFor="date">
                <b>D.O.B:</b>
              </label>
              &nbsp;
              <input
                type="date"
                onChange={setVal}
                value={inpval.age}
                name="age"
                id="age"
                className={styles.modalInp}
                style={{
                  width: "11em",
                }}
                placeholder="Enter Your Age"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={update}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
