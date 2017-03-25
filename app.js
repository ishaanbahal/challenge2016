'use strict';
let permissions = require("./permissionSystem.js");
let fs = require("fs");

let perms = fs.readFileSync("permissions.json","utf-8");
perms=JSON.parse(perms);
let pm = new permissions.PermissionManager();
pm.parsePermissions(perms);

// Running tests
console.log("++++Running distributor tests using permissions.json++++\n");

/**
 * Please add your tests here.
 * Add more permissions/distributors in permissions.json
 */
pm.testValidityAndPrint("D1","India");
pm.testValidityAndPrint("D1","United States");
pm.testValidityAndPrint("D1","Tamil Nadu-India");
pm.testValidityAndPrint("D1","Chennai-Tamil Nadu-India");
pm.testValidityAndPrint("D1","Karnataka-India");
pm.testValidityAndPrint("D2","Madhya Pradesh-India");
pm.testValidityAndPrint("D2","Tamil Nadu-India");
pm.testValidityAndPrint("D3","Chennai-Tamil Nadu-India");
pm.testValidityAndPrint("D3","Madhya Pradesh-India");
pm.testValidityAndPrint("D4","Tamil Nadu-India");
pm.testValidityAndPrint("D4","Madhya Pradesh-India");
pm.testValidityAndPrint("D4","Gwalior-Madhya Pradesh-India");
pm.testValidityAndPrint("D5","India");
pm.testValidityAndPrint("D5","Karnataka-India");
pm.testValidityAndPrint("D5","Tamil Nadu-India");
pm.testValidityAndPrint("D5","Chennai-Tamil Nadu-India");