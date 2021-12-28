import React, {useEffect, useState} from "react";
import { Form, Input} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../FireFetch";
import {MDBAlert} from "mdbreact";
import Firebase from "../../../Firebase";


var storageRef = Firebase.storage().ref("System/Outlets");
const EditProjectModal = (props) => {

    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [selectedOutlet, setSelectedOutlet] = useState(props.editOutlet);


    const handleFileUpload = (e) => {
        var tempArray = Object.values(e.target.files);
        setFilesList(tempArray)
    }

    useEffect(() => {
        setSelectedOutlet(props.editOutlet);
    }, [props])


    const editOutlet = () => {
        //setShowLoading(true);

        var name = document.getElementById("outletName").value;
        var location = document.getElementById("location").value;
        var contactName = document.getElementById("contactName").value;
        var contactEmail = document.getElementById("contactEmail").value
        var contactPhone = document.getElementById("contactPhone").value;
        var notes = document.getElementById("feedback").value;
        var outletID = selectedOutlet.outletID;
        var longitude = document.getElementById("long").value
        var latitude = document.getElementById("lat").value

        var object = {
            "name" : name,
            "location" : location,
            "contactPerson" : {
                "email" : contactEmail,
                "name" : contactName,
                "phone" : contactPhone
            },
            "coordinates" : {
                "longitude" : longitude,
                "latitude" : latitude
            },
            "feedbackNotes" : notes,
        };


        var startIndex = selectedOutlet.urls.length;
        var endIndex = startIndex + filesList.length;


        const output = FireFetch.updateInDB("Outlets", outletID, object);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Projects edited successfully");
                setShowLoading(false);
                setShowAlert(true);
                setColor("success");
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2100);

                for(var i = startIndex; i < endIndex; i++){
                    var actualIndex = endIndex - i;
                    console.log(actualIndex-1)

                    storageRef.child(outletID).child(""+i).put(filesList[actualIndex-1]).then(function(snapshot) {
                        console.log('Uploaded a blob or file!');
                    });
                }

            }
        }).catch((error) => {
            setMessage("Unable to edit outlet, an error occurred :: " + error);
            setColor("danger");
            setShowAlert(true);
            setShowLoading(false);
        })

    }


    return (
        <div>
            <Form
                layout="vertical"
                onFinish={editOutlet}
            >

                <Form.Item label="Outlet name">
                    <Input placeholder="enter outlet name" defaultValue={selectedOutlet.name} id="outletName"/>
                </Form.Item>
                <Form.Item label="Location (District, Area)">
                    <Input placeholder="enter outlet location e.g. (District, Area)" defaultValue={selectedOutlet.location} id="location"/>
                </Form.Item>
                <Form.Item label="Latitude" name="latitude">
                    <Input type="number" placeholder="enter latitude" defaultValue={selectedOutlet.coordinates.latitude} id="lat"/>
                </Form.Item>
                <Form.Item label="Longitude" name="longitude">
                    <Input type="number" placeholder="enter longitude" defaultValue={selectedOutlet.coordinates.longitude} id="long"/>
                </Form.Item>

                <Form.Item label="Outlet Contact Person Name">
                    <Input type="text" defaultValue={selectedOutlet.contactPerson.name} placeholder="enter outlet contact person name" id="contactName"/>
                </Form.Item>

                <Form.Item label="Outlet Contact Phone">
                    <Input type="phone" defaultValue={selectedOutlet.contactPerson.phone} placeholder="enter user phone number" id="contactPhone"/>
                </Form.Item>
                <Form.Item label="Outlet Contact Email">
                    <Input type="text" defaultValue={selectedOutlet.contactPerson.email} placeholder="enter contact email address" id="contactEmail"/>
                </Form.Item>

                <Form.Item label="Feedback Notes">
                    <Input type="text" defaultValue={selectedOutlet.feedbackNotes} placeholder="enter outlet notes" id="feedback"/>
                </Form.Item>

                <Form.Item label="Upload Outlet Images">
                    <Input type="file"
                           multiple
                           style={{ width: "100%" }}
                           accept="image/*"
                           onChange={handleFileUpload}
                           placeholder="outlet image" id="outletImage"/>
                </Form.Item>

                {showAlert?
                    <>
                        <MDBAlert color={color} className="my-3 font-italic" >
                            {message}
                        </MDBAlert>
                    </>
                    : null }

                <Button type="primary" htmlType="submit" className="text-white" style={{background: "#f06000", borderColor: "#f06000"}} isLoading={showLoading}>
                    Edit
                </Button>

            </Form>

        </div>
    )

}

export default EditProjectModal;
