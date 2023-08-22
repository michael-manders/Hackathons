const util = require("util");

async function execute(schoolName, key) {
    const googleMapsClient = require("@google/maps").createClient({
        key: "AIzaSyC8nz22aqHHsu980Jc1E_X33UFxeQpqn08",
    });
    const placesPromise = util.promisify(
        googleMapsClient.places.bind(googleMapsClient)
    );

    try {
        const response = await placesPromise({
            query: schoolName,
        });

        const data = {
            name: response.json.results[0].name,
            address: response.json.results[0].formatted_address,
            lat: response.json.results[0].geometry.location.lat,
            long: response.json.results[0].geometry.location.lng,
        };

        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = { execute };
