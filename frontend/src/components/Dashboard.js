import React, { useContext, useEffect ,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/Context';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Dashboard = () => {

    const { logindata, setLoginData } = useContext(LoginContext);

    const [data, setData] = useState(false);
    const [arr, setArr] = useState([]);
    console.log('arr', arr)
    const [inpval, setInpval] = useState({
        
        
        fname: "",
        email: "",
        age: ""
    });
    console.log('inpval', inpval)
    const setVal = (e) => {
        // console.log(e.target.value);
        const { name, value } = e.target;

        setInpval(() => {
            return {
                ...inpval,
                [name]: value
            }
        })
    };

    const history = useNavigate();

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");

        const res = await fetch("/validuser", {
           
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        console.log('res', res)
        const data = await res.json();
        console.log('data', data)

        if (data.status === 401 || !data) {
            history("*");
        } else {
            console.log("user verify");
            setLoginData(data)
            history("/dash");
        }
    }

    const update =async(id)=>{
        const { fname, email, age } = logindata.ValidUserOne;
       setArr({fname:fname,email:email,age:age})
        
        
        console.log(id)
        const data = await fetch("/register", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                
            })
        });

        const res = await data.json();
        console.log('res', res)
    }

    useEffect(() => {
        setTimeout(() => {
            DashboardValid();
            setData(true)
        }, 2000)

    })

    return (
        <>
            {
                data ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img src="./man.png" style={{ width: "200px", marginTop: 20 }} alt="" />
                    
                        <div className="form_input">
                            <label htmlFor="fname">Name</label>
                            <input type="text" onChange={setLoginData} value={logindata.ValidUserOne.email} name="fname" id="fname" placeholder='Enter Your Name' />
                        </div>
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input type="email" onChange={setVal} value={logindata.ValidUserOne.email} name="email" id="email" placeholder='Enter Your Email Address' />
                        </div>
                        <div className="form_input">
                            <label htmlFor="email">Age</label>
                            <input type="age" onChange={setVal} value={logindata ? logindata.ValidUserOne.age : ""} name="age" id="age" placeholder='Enter Your Email Address' />
                        </div>
                        <button className='btn' onClick={()=>update(logindata.ValidUserOne._id)}>Update</button>
                    <h1>User Name:{logindata ? logindata.ValidUserOne.fname : ""}</h1>
                    <h1>User Email:{logindata ? logindata.ValidUserOne.email : ""}</h1>
                    <h1>User Age:{logindata ? logindata.ValidUserOne.age : ""}</h1>
                </div> : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    Loading... &nbsp;
                    <CircularProgress />
                </Box>
            }

        </>

    )
}

export default Dashboard