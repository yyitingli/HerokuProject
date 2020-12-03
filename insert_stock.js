const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://yyitingli:253718516@cluster0.6jyam.mongodb.net/?retryWrites=true&w=majority";

var http = require('http');
var port = process.env.PORT || 3000;
var csv = 'companies-1.csv';
var coll = 'companies';

let m =  "";
let x = "" ;

main();

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<h1>Import Companies Collection From CSV</h1>");
    res.write ("<br>");
    res.write("<h2> STEP 1: delete existing companies collection </h2>")
    res.write("<h3>" + x + "</h3>");
    res.write ("<hr>");
    res.write("<h2> STEP 2: insert corresponding entries into the MongoDB companies collection  </h2>")
   res.write ("<h3>" + m + "</h3>");
   
   
   res.end();
}).listen(port); 




function main() {

    var csv = 'companies-1.csv';
    var coll = 'companies';
    x = collectionDelete(coll);
    loadCSVtoDB(csv);
    
}

function formFindQuery(type, input){
	var display = ""
	if(type == "Company"){
		display = "Ticker";
	}

}

function find(query){

}


function insertion(data) {
	var message = "";
    MongoClient.connect(url, function(err, db) {
        if (err) {
            return console.log(err);
        }

        var dbo = db.db("companies");
        var collection = dbo.collection('companies');


        collection.insertOne(data, function(err, res) {
            if (err) throw err;
            //console.log(JSON.stringify(data) + " is inserted");
        });
        //console.log("Success!");
        db.close();
        
    });
    message = JSON.stringify(data) + " is inserted";
    return  message ;
}


function loadCSVtoDB(csv) {
    var readline = require('readline');
    var fs = require('fs');
    var message = "";
    var myFile = readline.createInterface({
        input: fs.createReadStream(csv)
    });
    var i = 0;
    var keys = ["",""]
    myFile.on('line', function(line) {
    	if(i == 0){
    		keys = line.split(',');
    		//console.log('keys[0]:' + keys[0] + ' keys[1] ' + keys[1]  );
    	}else{
    		
        	const words = line.split(',');
        	var data = formJSON(keys, words);
            message =  i + " : " + insertion(data) + "<br>";
            console.log(message);
            collectsData(message);
            //console.log(message);
        	//console.log('words[0]:' + words[0] + ' words[1] ' +  words[1] );
    	}
    	i++;
        
        
    })
   
}

function collectsData(data){
    m += data;
}
function collectionDelete(coll){
	var message = "";
	MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("companies");
  dbo.collection(coll).drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) {
    	console.log("Collection deleted");
    	
    }

    db.close();
  });
});
    message +="Collection deleted";
	return message ;
}

function formJSON(keys, words){
	var data = {};
	for(var i = 0; i < keys.length; i++){
		data[keys[i]] = words[i];
	}
	//console.log(JSON.stringify(data));
	return data;
}

