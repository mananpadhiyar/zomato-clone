import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { Carousel } from "react-responsive-carousel";

const Restaurant = (props) => {
  let { id } = useParams();
  //  console.log(id)

  // userForm

  const [name, setName] = useState(props.user?.name);
  const [email, setEmail] = useState(props.user?.email);
  const [address, setAddress] = useState("sabarmati , ahmedabad");
  const [mobile, setMobile] = useState("999999999");

  let [rDetails, setrDetails] = useState({});
  // here we just want only single detail that'why we are using {}

  let [menuItemsList, setMenuItemsList] = useState([]);

  let [total, setTotal] = useState(0);

  const addQty = (index) => {
    let menuItems = [...menuItemsList]; // as per menuItemList it will add it
    menuItems[index].qty += 1;
    //  default qty is 0 in database

    let newTotal = menuItems[index].price + total;
    setTotal(newTotal);
    // setMenuItemsList(menuItems)
  };

  const removeQty = (index) => {
    let menuItems = [...menuItemsList];
    menuItems[index].qty -= 1;

    let newTotal = total - menuItems[index].price;
    setTotal(newTotal);
    // setMenuItems(menuItemList)
  };

  let getRestaurantDetails = async () => {
    let url = `http://localhost:7001/api/get-restaurant-list-res-id/${id}`;

    let { data } = await axios.get(url);

    setrDetails(data.list);
  };

  let getMenuItemList = async () => {
    let url = `http://localhost:7001/api/get-menuitem-list-by-res-id/${id}`;

    let { data } = await axios.get(url);

    setMenuItemsList(data.list);
  };

  useEffect(() => {
    getRestaurantDetails();
    getMenuItemList();
    // onmouting(onLoad)
  }, []);

  let makePayment = async () => {
    let url = `http://localhost:7001/api/gen-order-details`;

    let { data } = await axios.post(url, { amount: total });
    //    console.log(data)

    if (data === false) {
      alert("unable to create an order id");
      return false;
    }

    let { order } = data;

    var options = {
      key: "rzp_test_RB0WElnRLezVJ5", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Advance-zomato-clone",
      description: "Online-food-delivery",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Zomato_logo.png/240px-Zomato_logo.png",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async (response) => {
        let userOrders = menuItemsList.filter((menu_item) => {
          return menu_item.qty > 0;
        });

        let sendData = {
          pay_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
          order: userOrders,
          name: name,
          email: email,
          address: address,
          mobile: mobile,
          totalAmount: total,
          res_id: rDetails._id,
          res_name: rDetails.name,
        };

        let url = "http://localhost:7001/api/verify-payment";

        let { data } = await axios.post(url, sendData);

        if (data.status === true) {
          alert("payment done successfully");
        } else {
          alert("payment failed, try again");
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: "9000090000",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
  };

  return (
    <>
      {/* slide image */}
      {/* modal */}
      <div
        className="modal fade"
        id="slideShow"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh " }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              <div>
                <img className="w-100" src={"/images/" + rDetails.image} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  menu item modal  */}
      <div
        className="modal fade "
        id="modalMenuItem"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {rDetails.name} Menus
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              {menuItemsList.map((menuItem, index) => {
                return (
                  <>
                    <div key={index} className="row p-2">
                      <div className="col-8">
                        <p className="mb-1 h6">{menuItem.name}</p>
                        <p className="mb-1">Rs.{menuItem.price}</p>
                        <p className="small text-muted">
                          {menuItem.description}
                        </p>
                      </div>
                      <div className="col-4 d-flex justify-content-end">
                        <div className="menu-food-item">
                          <img src={`/images/${menuItem.image}`} alt="" />

                          {menuItem.qty > 0 ? (
                            <div className="order-item-count section ">
                              <span
                                className="hand"
                                onClick={() => removeQty(index)}
                              >
                                -
                              </span>
                              <span>{menuItem.qty}</span>
                              <span
                                className="hand"
                                onClick={() => addQty(index)}
                              >
                                +
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => addQty(index)}
                              className="add-btn bg-primary btn-primary btn-sm add"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                      <hr className=" p-0 my-2" />
                    </div>
                  </>
                );
              })}

              {total > 0 ? (
                <div className="d-flex justify-content-between">
                  <h3>Total {total} </h3>
                  <button
                    className="process-btn btn-danger bg-danger"
                    data-bs-target="#userForm"
                    data-bs-toggle="modal"
                  >
                    Process
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {/*  menu item modal close */}

      {/* user form modal */}
      <div
        className="modal fade"
        id="userForm"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                User Form
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter full Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="back-btn btn-danger bg-danger"
                // data-bs-target="#modalMenuItem"
                // data-bs-toggle="modal"
                data-bs-target="#modalMenuItem"
                data-bs-toggle="modal"
              >
                Back
              </button>
              <button
                className="make-btn btn-success bg-success"
                onClick={makePayment}
              >
                Make Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="container-fluid">
        <div className="row bg-color justify-content-center">
          <Header user={props.user} />
        </div>

        <div className="row justify-content-center">
          <div className="col-10">
            <div className="row">
              <div className="col-12 mt-5">
                <div className="restaurant-main-image position-relative">
                  <img src={`/images/${rDetails.image}`} alt="" className="" />
                  <button
                    className=" btn-outline-light position-absolute btn-gallery"
                    data-bs-toggle="modal"
                    data-bs-target="#slideShow"
                  >
                    Click To Get Image Gallery
                  </button>
                </div>
              </div>
              <div className="col-12">
                <h3 className="mt-4">{rDetails.name}</h3>
                <div className="d-flex justify-content-between ">
                  <ul className="list-unstyled d-flex gap-3">
                    <li>Overview</li>
                    <li>Contact</li>
                  </ul>
                  <button
                    className=" menu-item-btn btn-danger align-self-start"
                    data-bs-toggle="modal"
                    href="#modalMenuItem"
                    style={{ marginTop: "-25px" }}
                    role="button"
                    disabled={props.user ? false : true}
                  >
                    {props.user ? "Place Online Order" : "login for order"}
                  </button>
                </div>
                <hr className="mt-0" />

                <div className="over-view">
                  <p className="h5 mb-4">About this place</p>

                  <p className="mb-0 fw-bold">Cuisine</p>
                  <p>
                    {rDetails.cuisine
                      ? rDetails.cuisine
                          .map((value, index) => {
                            return value.name;
                          })
                          .join(", ")
                      : null}
                  </p>

                  <p className="mb-0 fw-bold">MinCost</p>
                  <p>₹ {rDetails.min_price}</p>
                </div>

                <div className="over-view">
                  <p className="mb-0 fw-bold">Phone Number</p>
                  <p>{rDetails.contact_number}</p>

                  <p className="mb-0 fw-bold">Address</p>
                  <p>
                    {rDetails.locality}, {rDetails.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Restaurant;
