import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/Search";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Restaurant from "./components/Restaurant";

function App() {
  let [locationList, setLocationList] = useState([]);

  const getLocationList = async () => {
    let url = `http://localhost:7001/api/get-location-list`;
    let { data } = await axios.get(url);

    setLocationList(data.list);
  };

  useEffect(() => {
    getLocationList();
  }, []);

  let getUserDetails = () => {
    let token = localStorage.getItem("advance_zomato_auto_token");

    if (token === null) {
      return null;
    } else {
      try {
        let data = jwt_decode(token);
        // console.log(data);
        return data;
      } catch (error) {
        return null;
      }
    }
  };

  let [user, setUser] = useState(getUserDetails());

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home locationList={locationList} user={user} />}
        ></Route>
        <Route
          path="/search/:id/:name"
          element={<Search locationList={locationList} user={user} />}
        ></Route>
        <Route
          path="/restaurant/:id"
          element={<Restaurant user={user} />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
