// config/database.js
/*module.exports = {

    'url' : 'mongodb://yhacks:yhacks123@jello.modulusmongo.net:27017/pi2qyPyb' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};
*/

module.exports = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': 'new2you!'
    },
	'database': 'my_schema',
    'users_table': 'users',
    'expenses_table': 'expenses'
};
