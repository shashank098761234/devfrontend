import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "./utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      console.log("res>>>>", res?.data?.data);

      dispatch(addConnections(res?.data?.data));
    } catch (error) {}
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  console.log("connections.length>>>>>>>>>>>.", connections);

  if (!connections) return;

  if (connections.length === 0) return <h1>No connections found</h1>;

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-2xl">Connections</h1>
      {connections.map((connection) => {
        const { _id, firstName, lastname, photoUrl, about } = connection;
        return (
          <div className="m-4 p-4 border rounded-lg bg-base-300 w-1/2 mx-auto">
            <img alt="photo" className="w-20 h-20" src={photoUrl} />
            <h2>{firstName}</h2>
            <p>{about}</p>
            <Link to={"/chat/" + _id}>
              <button className="btn btn-primary my-5">Chat</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
