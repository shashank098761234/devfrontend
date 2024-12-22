import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "./utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.log(error.message);
    }
  };

  const reviewRequest = async (status, id) => {
    try {
      const res = axios.post(
        BASE_URL + "/request/review/" + status + "/" + id,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeRequest(id));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  console.log("requests>>>>>>>>>>>>>>>", requests);

  if (!requests) return;

  if (requests.length === 0)
    return <h1 className="flex justify-center my-10">No requests found</h1>;

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-2xl">Requests</h1>
      {requests.map((request) => {
        const { firstName, lastname, photoUrl, about, _id } =
          request?.fromUserId;

        console.log("ID>>>>>>>>>>>>>", _id);

        return (
          <div
            key={_id}
            className="m-4 p-4 border rounded-lg bg-base-300 w-1/2 mx-auto"
          >
            <img alt="photo" className="w-20 h-20" src={photoUrl} />
            <h2>{firstName}</h2>
            <p>{about}</p>
            <div>
              <button
                className="btn btn-primary mx-4"
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
