import Firebase from "./Firebase";


var dbRef = Firebase.database().ref("System/");
class FireFetch {

    SaveTODB = (endPoint, objectID, object) => {

        console.log("saving");
        return dbRef.child(endPoint).child(objectID)
            .set(object)
            .then(() => {
                return "success";
            })
            .catch((error) => {
                return error.getMessage;
            });
    };


    DeleteFromDB = (endPoint, objectID) => {

        return dbRef.child(endPoint).child(objectID)
            .remove()
            .then(() => {
                return "success";
            })
            .catch((error) => {
                return error.getMessage;
            });
    };

    updateInDB = (endPoint, objectID, object) => {
        return dbRef.child(endPoint).child(objectID)
            .update(object)
            .then(() => {
                return "success";
            })
            .catch((error) => {
                return error.getMessage;
            });
    }

}

export default new FireFetch();
