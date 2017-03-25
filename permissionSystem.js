'use strict';

let csvParser = require("./csvParser.js");

class PermissionManager{
    constructor(){
        this.distributorDict={}
        this.csv=new csvParser.Parser("cities.csv").cityMap;
    }

    /**
     * Parser to maintain in-memory map of regions distributor is allowed access
     */
    parse(perm){
        let dist = {
            name:perm.name,
            allowed:{},
        };
        if (perm.inherit!=""){
            dist.allowed = JSON.parse(JSON.stringify(this.distributorDict[perm.inherit].allowed));
        }
        for (let x in perm.include){
            let region = perm.include[x].split("-");
            switch(region.length){
            case 1:
                    let country = JSON.parse(JSON.stringify(this.csv[region[0]]));
                    dist.allowed[region[0]]=country;
                    break;
                case 2:
                    let state= JSON.parse(JSON.stringify(this.csv[region[1]][region[0]]));
                    if (region[1] in dist.allowed && region[0]){
                        dist.allowed[region[1]][region[0]]=state;
                    }else{
                        dist.allowed[region[1]]={};
                        dist.allowed[region[1]][region[0]]=state;
                    }
                    break;
                case 3:
                    let city = JSON.parse(JSON.stringify(this.csv[region[2]][region[1]].indexOf(region[0])));
                    if(region[2] in dist){
                        if (region[1] in dist.allowed[region[2]]){
                            if(dist.allowed[region[2]][region[1]].indexOf(region[0])==-1){
                                dist.allowed[region[2]][region[1]].push(JSON.parse(JSON.stringify(this.csv[region[2]][region[1]][city])));
                            }
                        }else{
                            dist.allowed[region[2]][region[1]]=[JSON.parse(JSON.stringify(this.csv[region[2]][region[1]][city]))];
                        }
                    }else{
                        dist.allowed[region[2]]={};
                        dist.allowed[region[2]][region[1]]=[JSON.parse(JSON.stringify(this.csv[region[2]][region[1]][city]))];
                    }
                    break;
            }
        }

        for (let x in perm.exclude){
            let region = perm.exclude[x].split("-");
            switch(region.length){
                case 1:
                    if(region[0] in dist.allowed){
                        delete dist.allowed[region[0]];
                    }
                    break;
                case 2:
                    if(region[1] in dist.allowed){
                        if (region[0] in dist.allowed[region[1]]){
                            delete dist.allowed[region[1]][region[0]];
                        }
                    }
                    break;
                case 3:
                    if(region[2] in dist.allowed){
                        if (region[1] in dist.allowed[region[2]]){
                            if (dist.allowed[region[2]][region[1]] && dist.allowed[region[2]][region[1]].indexOf(region[0])!=-1){
                                let index = dist.allowed[region[2]][region[1]].indexOf(region[0]);
                                dist.allowed[region[2]][region[1]].splice(index,1);
                            }
                        }
                    }
            }
        }
        this.distributorDict[perm.name]=dist;
    }
    
    /**
     * Loops over permission array to generate permissions
     */
    parsePermissions(permArr){
        for (let x in permArr){
            this.parse(permArr[x]);
        }
    }

    /**
     * Tests validity of distributor and permission asked for.
     */
    testValid(distName,permStr){
        let dist = this.distributorDict[distName];
        let region=permStr.split("-");
        switch(region.length){
            case 1:
                if (region[0] in dist.allowed){
                    return true;
                }
                return false;
            case 2:
                if(region[1] in dist.allowed){
                    if (region[0] in dist.allowed[region[1]]){
                        return true;
                    }
                    return false;
                }
                return false;
            case 3:
                if(region[2] in dist.allowed){
                    if (region[1] in dist.allowed[region[2]]){
                        if (dist.allowed[region[2]][region[1]].indexOf(region[0])!=-1){
                            return true;
                        }
                        return false;
                    }
                    return false;
                }
                return false;
        }
    }
    
    /**
     * Utility function to print validity for a distributor and permission request.
     */
    testValidityAndPrint(distName,permStr){
        if (this.testValid(distName,permStr)){
            console.log(distName+" CAN distribute in the region "+permStr);
        }else{
            console.log(distName+" CANNOT distribute in the region "+permStr);
        }
    }
}

/**
 * Standard node.js module.exports
 */
module.exports = {
    PermissionManager:PermissionManager,
}