import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [responseData, setResponseData] = useState([]);
  const [image, setImage] = useState({});
  const [video, setVideo] = useState([]);

  const dashboardURL = "https://tolltax.xyz/demoapi/dashboard";
  const imageURL = "https://tolltax.xyz/demoapi/get_file";
  const videoURL = "https://tolltax.xyz/demoapi/get_videoclip";

  const requestBodyDataDashboard = {
    licence_plate: "",
    vehicle_type: "",
    vehicle_subtype: "",
    datefrom: "2021-08-01T00:00:00",
    dateto: "2021-09-01T00:00:00",
  };

  const loadDashboardData = async () => {
    const response = await fetch(dashboardURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyDataDashboard),
    });
    const data = await response.json();
    setResponseData(data.data);
    data.data.map((item, index) => {
      loadImageData(item.image, item.licence_plate);
      loadVideoData(item.videoclip, item.licence_plate);
    });
  };

  const loadImageData = async (imagePath, key) => {
    const response = await fetch(imageURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filepath: `${imagePath}` }),
    });
    const imageBlob = await response.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    let temp = image;
    temp[key] = imageObjectURL;
    setImage({ ...image, temp });
  };

  const loadVideoData = async (videoPath, key) => {
    const response = await fetch(videoURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filepath: `${videoPath}` }),
    });
    const videBlob = await response.blob();
    const videObjectURL = URL.createObjectURL(videBlob);
    let temp = video;
    temp[key] = videObjectURL;
    setVideo({ ...video, temp });
    console.log(video);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="App">
      {responseData.length > 0 ? (
        responseData.map((itemData, index) => (
          <div key={itemData.licence_plate} className="container">
            <div className="upper">
              <div className="details">
                <p>Job ID - {itemData.jobid}</p>
                <p>Licence Plate - {itemData.licence_plate}</p>
                <p>Time - {itemData.time}</p>
                <p>Vehicle Type - {itemData.vehicle_type}</p>
              </div>
              <div className="image">
                {image[itemData.licence_plate] ? (
                  <img src={image[itemData.licence_plate]} alt={"null"} />
                ) : (
                  "LOADING..."
                )}
              </div>
            </div>
            <div className="lower">
              <div className="video">
                <video controls>
                  {video[itemData.licence_plate] ? (
                    <source
                      src={video[itemData.licence_plate]}
                      type="video/mp4"
                    />
                  ) : (
                    "LOADING..."
                  )}
                </video>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="loading">LOADING...</div>
      )}
    </div>
  );
}

export default App;
