import {useState} from 'react';
import { useEffect } from 'react';
import './App.css';

function App() {

  const [apires, setapires] = useState('No Response');
  const [register, setregister] = useState({
      username : '',
      email : '',
      password : '',
      age : '',
      gender : '',
  });
  const [login, setlogin] = useState({
    username:'',
    password:''
  });
  const [userData, setuserData] = useState(null);

  const checkApi = () => {
    fetch('http://localhost:8000/',{
      'method' : 'GET'
    }).then(
      res => res.json()
      
    ).then(
      data => setapires(data.message)
      
    ).catch(
      (error) => console.log(error)
    );
  }

  // handle register
  const handleRegister = () =>{
    // console.log(register);

    fetch('http://localhost:8000/user/register',{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(register)
    }).then(
      res => res.json()
    ).then(
      data => {
        alert(data.message);
      }
    ).catch(
      error => console.log(error)
    );
  }


  // handle login form
  const handleLogin = ()=>{
    console.log(login);

    fetch('http://localhost:8000/user/login',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(login)
    }).then(
      res => res.json()
    ).then(
      data => {
        alert(data.message);
        console.log(data);
        localStorage.setItem('accessToken',data.accessToken);
        console.log(localStorage.getItem('accessToken'));
      }
    ).catch(
      error => console.log(error)
    );
  }


  // get user data
  const getUserData = ()=>{
    const accessToken = localStorage.getItem('accessToken');

    fetch('http://localhost:8000/user/profile',{
      method:'GET',
      headers:{
        'authorization': `Bearer ${accessToken}`
      },
    }).then(
      res => res.json()
    ).then(
      data => {
        console.log(data);
        setuserData(data.profile);
      }
    ).catch(
      error => console.log(error)
    )
  }


  // refresh token
  // const handleRefreshToken = ()=>{
  //   const tokenInCookie = document.cookie.split(';').find(cookie => cookie.includes('refreshToken'));
  //   console.log(tokenInCookie);

  //   if(!tokenInCookie){
  //     console.log('Refresh token not found!');
  //     return;
  //   }

  //   fetch('http://localhost:8000/user/refreshToken',{
  //     method:'GET'
  //   }).then(
  //     res => res.json()
  //   ).then(
  //     data => {
  //       console.log(data);

  //     }
  //   ).catch(
  //     error => console.log(error)
  //   )
  // }

  useEffect( 
    ()=>{
      checkApi();
    }
  ,[]);

  return (
    <div className="App">
      {/* <header className="App-header">
        <p>
          {apires}
        </p>
      </header> */}

      <table>

       <thead>
        <tr>
            <th colSpan="2">Registration form</th>
          </tr>
       </thead>

        <tbody>
          <tr>
            <td>
              Username
            </td>
            <td>
              <input type="text" required onChange={(e)=>{ setregister({...register, username : e.target.value}) }}></input>
            </td>
          </tr>

          <tr>
            <td>
              Email
            </td>
            <td>
            <input type="email" required onChange={(e)=>{ setregister({...register, email:e.target.value}) }}></input>
            </td>
          </tr>
          
          <tr>
            <td>
              Password
            </td>
            <td>
            <input type="password" required onChange={(e)=>{ setregister({...register, password:e.target.value})}}></input>
            </td>
          </tr>
          
          <tr>
            <td>
              Age
            </td>
            <td>
            <input type="text" required onChange={(e)=>{ setregister({...register, age:e.target.value})}}></input>
            </td>
          </tr>
          
          <tr>
            <td>
              Gender
            </td>
            <td>
            <input type="text" required onChange={(e)=>{ setregister({...register, gender:e.target.value})}}></input>
            </td>
          </tr>
          
          <tr>
            <td colSpan="2" align="right">
              <input onClick={handleRegister} type="submit" value="Register Now"></input>
            </td>
          </tr>
        </tbody>
        
      </table>


      <br></br>
      <br></br>
      <br></br>
      <hr></hr>

      <table>
        <thead>
          <tr>
            <th colSpan="2">
              Login Form
            </th>
          </tr>
        </thead>

        <tbody>
            <tr>
              <td>Username or Email</td>
              <td>
                <input type="text" required onChange={(e)=>{setlogin({...login, username:e.target.value})}}></input>
              </td>
            </tr>
            <tr>
              <td>Password</td>
              <td>
                <input type="password" required onChange={(e)=>{setlogin({...login,password:e.target.value})}}></input>
              </td>
            </tr>
            <tr>
              <td colSpan="2" align="right">
                <input onClick={handleLogin} type="submit" value="Login Now"></input>
              </td>
            </tr>
        </tbody>
      </table>


      <br></br>
      <br></br>
      <br></br>
      <hr></hr>

      <p><b>User Data</b></p>
      <button onClick={getUserData}>Get User Data</button>
      {
        userData && <div>
          <img src={userData.profilePic} style={{height:100}}></img>
          <p>Username : {userData.username}</p>
          <p>Email : {userData.email}</p>
          <p>Age : {userData.age}</p>
          <p>Gender : {userData.gender}</p>
        </div>
      }

    </div>
  );
}

export default App;
