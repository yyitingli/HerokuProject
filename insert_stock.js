const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://yyitingli:253718516@cluster0.6jyam.mongodb.net/?retryWrites=true&w=majority";

var http = require('http');
var port = process.env.PORT || 3000;
console.log("This goes to the console window");
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
   res.write(loadCSVtoDB(csv));
   res.write (collectionDelete(coll));
   res.end();
}).listen(port); 


function main() {

    var csv = 'companies-1.csv';
    var coll = 'companies';
    loadCSVtoDB(csv);
    collectionDelete(coll);

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
            console.log(JSON.stringify(data) + " is inserted");
            message += JSON.stringify(data) + " is inserted";
        });

        //console.log("Success!");
        db.close();

    });
    return message;
}


function loadCSVtoDB(csv) {
    var readline = require('readline');
    var fs = require('fs');

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
        	insertion(data);
        	//console.log('words[0]:' + words[0] + ' words[1] ' +  words[1] );
    	}
    	i++;
        
    });

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
    	message +="Collection deleted";
    }

    db.close();
  });
});
	return message;
}

function formJSON(keys, words){
	var data = {};
	for(var i = 0; i < keys.length; i++){
		data[keys[i]] = words[i];
	}
	//console.log(JSON.stringify(data));
	return data;
}

//main();