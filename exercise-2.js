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

// connection.queryAsync('SHOW DATABASES').then(
//     function(result) {
//         var rows = result[0];
//         return rows;
//     }
// ).map(
//     function(row) {
//         return connection.queryAsync('SHOW TABLES FROM ' + row.Database).then(
//             function(result) {
//                 var rows = result[0].map(function(tableRow) {
//                     return tableRow['Tables_in_' + row.Database];
//                 });
//                 return {databaseName: row.Database, tableNames: rows};
//             }
//         );
//     }
// ).then(
//     function(mappedRows) {
//         var arrRow=mappedRows //.forEach(function(dbAndTables) {
//         //     if (dbAndTables.tableNames.length) {
//         //         return dbAndTables.databaseName.bold + ": ";
//         //         dbAndTables.tableNames.forEach(function(tableName) {
//         //             console.log("\t" + tableName.rainbow);
//         //         });
//         //     }
//         //     else {
//         //         console.log( (dbAndTables.databaseName + " does not have any tables").bold.yellow ); 
//         //     }
//         // })
//         console.log(arrRow);
        
//          var table=new Clitable({head:["Database names".bold, "Table names"], chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
//          , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
//          , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
//          , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
// });
        
//         table.push({arrRow});
        
//         console.log(table.toString());
        
//         ;
//     }
// ).finally(
//     function() {
//         connection.end();
//     }
// );


connection.queryAsync("SHOW DATABASES").then(
    function(results) {
        var rows = results[0];  
        return rows;    
    }
).map(
    function(row){
    return connection.queryAsync("SHOW TABLES FROM "+row.Database).then(
        function(results){
            return {
                'Database': row.Database,
                'Tables': results[0]
            };
        });
    }
).then(
    function(arrRow){
    var table = new Clitable({head:["Database names".bold, "Table names".bold], chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});

    arrRow.forEach(function(rowz){
        var row = {};
        var tablArr = [];
        var key = rowz.Database.yellow;
        
        rowz.Tables.forEach(function(item){
            
            tablArr.push(item["Tables_in_"+rowz.Database]);
        });
        
        row[key] = tablArr.join('\n').bold;
        table.push(row);
    });
    
    console.log(table.toString());
    
}).finally(
    function() {
        connection.end();
    }
);