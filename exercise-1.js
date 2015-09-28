var mysql = require('mysql');
var Promise = require('bluebird');
var colors = require('colors');
var Clitable=require('cli-table');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

connection.queryAsync('SHOW DATABASES').then(
    function(result) {
        var rows = result[0];
        return rows;
        
    }
)
.map(
    function(row) {
        return row.Database.rainbow.bold;
    }
)
.then(
    function(arr){
        var table=new Clitable({head:["Database names".bold], chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});
        for(var i=0; i<arr.length; i++){
        table.push([arr[i]])
        }
        console.log(table.toString());
    }
)
.finally(
    function() {
        connection.end();
    }
);