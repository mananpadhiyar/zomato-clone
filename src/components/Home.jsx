import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
  let navigate = useNavigate();

  let locationList = props.locationList;
  let [filterData, setFilterData] = useState({});

  const [mealtypeList, setMealtypeList] = useState([]);
  let [restaurantList, setrestaurantList] = useState([]);
  let getfilterData = async () => {
    let url = `http://localhost:7001/api/filter`;

    let { data } = await axios.post(url, filterData);

    setrestaurantList(data.list);
  };

  // console.log(filterData)

  let setLocationForPage = (event) => {
    let { value, name } = event.target;

    //  console.log(name , value)

    switch (name) {
      case "location":
        if (value === "") {
          delete filterData.loc_id;
        } else {
          setFilterData({ loc_id: Number(value) });
        }
        break;
    }
  };

  let navigationToRes = (event) => {
    // console.log(event.target)
    let { value } = event.target;

    navigate(`/restaurant/${value}`);
  };
  const getMealtypeList = async () => {
    let url = "http://localhost:7001/api/get-mealtype-list";

    let { data } = await axios.get(url);

    setMealtypeList(data.list);
  };

  useEffect(() => {
    getMealtypeList();
    getfilterData();
  }, [filterData]);

  return (
    <>
      <main className="container-fluid hero">
        <section className="row main-section align-content-start justify-content-center">
          <Header logo={false} user={props.user} />

          <section className="container  main-body">
            <p className="logo">e!</p>
            <p className="main-text">
              Find the best restaurants, cafés, and bars
            </p>
            <div className="search">
              <select
                name="location"
                onChange={setLocationForPage}
                type="text"
                className="input-location"
                placeholder="Please type a location"
              >
                <option value="">---select-location---</option>
                {locationList.map((location, index) => {
                  return (
                    <>
                      <option key={index} value={location.location_id}>
                        {location.name}, {location.city}
                      </option>
                    </>
                  );
                })}
              </select>
              {/*  onChange={() => {navigate(`/restaurant/id`)}}   */}
              <select
                onChange={navigationToRes}
                className="input-search"
                placeholder="Search for restaurants"
              >
                {restaurantList.length === 0 ? (
                  delete (<option disabled> ----select resturant----- </option>)
                ) : (
                  <option> ----select resturant----- </option>
                )}

                {restaurantList.length === 0 ? (
                  <option>NO RESULT</option>
                ) : (
                  restaurantList.map((value, index) => {
                    return (
                      <>
                        <option key={index} value={value._id}>
                          {value.name} ({value.locality}, {value.city})
                        </option>
                      </>
                    );
                  })
                )}
              </select>
            </div>
          </section>
        </section>
      </main>

      <section className="quick-search">
        <h1>Quick Searches</h1>
        <p>Discover restaurants by type of meal</p>

        <section className="section-list">
          {mealtypeList.map((mealtype, index) => {
            return (
              <>
                <article
                  key={index}
                  onClick={() =>
                    navigate(`/search/${mealtype.meal_type}/${mealtype.name}`)
                  }
                  className="section-item"
                >
                  <div className="section-img">
                    <img src={`/images/${mealtype.image}`} alt="" />
                  </div>

                  <div className="section-item-title">
                    <p>{mealtype.name}</p>
                    <span>{mealtype.content}</span>
                  </div>
                </article>
              </>
            );
          })}
        </section>
      </section>
    </>
  );
};

export default Home;
