import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import Header from "./Header";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const Search = (props) => {
  let { id } = useParams();
  let locationList = props.locationList;

  let navigate = useNavigate();

  let [restaurantList, setRestaurantList] = useState([]);

  let [currentPage, setCurrentPage] = useState(1);

  let [filterData, setFilterData] = useState({
    sort: 1,
    mealType: id,
  });

  let paginationHandler = (selectPage) => {
    if (selectPage >= 1 && selectPage <= Math.ceil(restaurantList.length / 2)) {
      setCurrentPage(selectPage);
    }
  };

  //Making a POST request in Axios requires two parameters: the URI of the service endpoint
  //and an object that contains the properties you wish to send to the serve

  const getFilterData = async () => {
    let url = `http://localhost:7001/api/filter`;

    let { data } = await axios.post(url, filterData);

    setRestaurantList(data.list);
  };

  const setFilterForPage = (event) => {
    let { value, name, checked } = event.target;

    // console.log(value, name);

    switch (name) {
      case "location":
        if (value == "") {
          delete filterData.loc_id;
        } else {
          setFilterData({ ...filterData, loc_id: Number(value) });
          break;
        }

      case "cuisine":
        if (checked) {
          setFilterData({ ...filterData, cuisine: Number(value) });
        } else {
          setFilterData((event) => event !== value);
        }

        break;

      case "min_price":
        let array = value.split("-");
        // console.log(array);

        setFilterData({
          ...filterData,
          lCost: Number(array[0]),
          hCost: Number(array[1]),
        });

        break;

      case "sort":
        setFilterData({ ...filterData, sort: Number(value) });

        break;
    }
  };

  useEffect(() => {
    getFilterData();
  }, [filterData]);

  return (
    <section className="container-fluid">
      <div className="row bg-color align-items-center justify-content-center">
        <Header user={props.user} />
      </div>

      <div className="row">
        <div className="col-12 px-5 pt-4">
          <p className="h3 search-title fw-bold ">Breakfast Places</p>
        </div>

        <div className="col-12 d-flex flex-wrap px-lg-5 px-md-5 pt-4">
          <div className="food-shadow col-12 col-lg-3 col-md-4 me-5 p-3 mb-4">
            <div className="d-flex justify-content-between">
              <p className="fw-bold font-size-22px m-0 mb-3">Filter</p>
              <button
                className="btn border-none d-lg-none d-md-none "
                data-bs-toggle="collapse"
                data-bs-target="#collapseFilter"
                aria-controls="collapseFilter"
              >
                <span className="fa fa-eye"></span>
              </button>
            </div>

            {/* <!-- Collapse start  --> */}
            <div className="collapse show" id="collapseFilter">
              <div>
                <label htmlFor="" className="form-label">
                  Select Location
                </label>
                <select
                  className="form-select form-select-sm"
                  name="location"
                  onChange={setFilterForPage}
                >
                  <option value="">--- Select Location ---</option>
                  {
                    // we can use map method cause we set by default locationList value as an
                    // emty array
                    locationList.map((location, index) => {
                      return (
                        <option key={index} value={location.location_id}>
                          {location.name} , {location.city}
                        </option>
                      );
                    })
                  }
                </select>
              </div>
              <p className="mt-4 mb-2 fw-bold">Cuisine</p>
              <div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="cuisine"
                    value="1"
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    North Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="cuisine"
                    value="2"
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    South Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="cuisine"
                    value="3"
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Chinese
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="cuisine"
                    value="4"
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Fast Food
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="cuisine"
                    value="5"
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Street Food
                  </label>
                </div>
              </div>
              <p className="mt-4 mb-2 fw-bold">Min Cost</p>
              <div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="min_price"
                    value="0-500"
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    less then 500
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="min_price"
                    value="500-1000"
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    500 to 1000
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="min_price"
                    value="1000-1500"
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    1000 to 1500
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="min_price"
                    value="1500-2000"
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    1500 to 2000
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="min_price"
                    value="2000-99999"
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    2000+
                  </label>
                </div>
              </div>
              <p className="mt-4 mb-2 fw-bold">Sort</p>
              <div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="1"
                    name="sort"
                    checked={filterData.sort === 1 ? true : false}
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Price low to high
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="-1"
                    name="sort"
                    checked={filterData.sort === -1 ? true : false}
                    onChange={setFilterForPage}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Price high to low
                  </label>
                </div>
              </div>
            </div>

            {/* <!-- Collapse end --> */}
          </div>

          <div className="col-12 col-lg-8 col-md-7">
            {restaurantList.length === 0 ? (
              <p className="h2 text-center text-danger">No Result Found</p>
            ) : (
              restaurantList
                .slice(currentPage * 2 - 2, currentPage * 2)
                .map((restaurant, index) => {
                  return (
                    <>
                      <div
                        onClick={() =>
                          navigate(`/restaurant/${restaurant._id}`)
                        }
                        key={index}
                        className="col-12 food-shadow p-4 mb-4"
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={`/images/${restaurant.image}`}
                            alt="food-item-img"
                            className="food-item"
                          />
                          <div className="ms-5">
                            <p className="h4 fw-bold">{restaurant.name}</p>
                            <span className="fw-bold text-muted">FORT</span>
                            <p className="m-0 text-muted">
                              <i
                                className="fa fa-map-marker fa-2x text-danger"
                                aria-hidden="true"
                              ></i>
                              {restaurant.locality} , {restaurant.city}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="d-flex">
                          <div>
                            <p className="m-1 ">CUISINES:</p>
                            <p className="m-1 ">MIN PRICE:</p>
                          </div>
                          <div className="ms-5">
                            <p className="m-1 fw-bold">
                              {restaurant.cuisine
                                .map((value) => {
                                  return value.name;
                                })
                                .join(" , ")}
                            </p>
                            <p className="m-0 fw-bold">
                              <i className="fa fa-inr" aria-hidden="true"></i>
                              {restaurant.min_price}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
            )}

            {restaurantList.length > 0 ? (
              <div className="pagination">
                <span onClick={() => paginationHandler(currentPage - 1)}>
                  ◀
                </span>

                {Array.from({
                  length: Math.ceil(restaurantList.length / 2),
                }).map((value, index) => {
                  return (
                    <>
                      <span
                        className={
                          currentPage == index + 1 ? "pagination__active" : ""
                        }
                        onClick={() => paginationHandler(index + 1)}
                      >
                        {" "}
                        {index + 1}{" "}
                      </span>
                    </>
                  );
                })}

                <span onClick={() => paginationHandler(currentPage + 1)}>
                  ▶
                </span>
              </div>
            ) : (
              ""
            )}

            {
              //    [1,2,3,4,5,6,7,8,9,10].map((i,index) => {
              //     return <>
              //        <span className={currentPage == i ? "pagination__active" : ""}
              //        key={index}
              //         onClick={()=>paginationHandler(i)}
              //         >{i}</span>
              //     </>
              // })
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;
