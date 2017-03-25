'use strict';

const fs = require("fs");

class InvalidCsvException extends Error{
    constructor(message) {
    super();
    this.message = message; 
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}

class Parser{
    
    constructor(fileName="", encoding="utf-8", delimiter=","){
        this.fileName = fileName;
        this.encoding=encoding;
        this.delimiter=delimiter;
        this.cityMap={};
        this.parseCsv();
    }

    parseCsv(){
        try{
            let data = fs.readFileSync(this.fileName,this.encoding).split("\n");
            data.pop();
            for (let x in data){
                let row = data[x].replace("\r","").split(",");
                if (row.length!=6){
                    throw new InvalidCsvException("CSV columns should be exactly 6");
                }
                if (row[5] in this.cityMap){
                    if(row[4] in this.cityMap[row[5]]){
                        this.cityMap[row[5]][row[4]].push(row[3]);
                    }else{
                        this.cityMap[row[5]][row[4]]=[row[3]];
                    }
                }else{
                    this.cityMap[row[5]]={};
                    this.cityMap[row[5]][row[4]]=[row[3]];
                }
            }
        }
        catch(e){
            console.log(e.message);
        }
    }
}

module.exports = {
    Parser:Parser
}