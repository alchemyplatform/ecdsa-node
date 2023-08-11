import {AddressConfig} from "./logs.js"

export let users = [];


    export function usersArrayLoop(){
        for(var i =0;i<10;i++){
        users.push({id:i,
            address:AddressConfig.addressGen()
            ,balance:AddressConfig.balanceLog()
            ,private:AddressConfig.privatKeyGen()
        ,public:AddressConfig.publicKeyGen()});     
        }     
        return users[0];
    }
      

 console.log(usersArrayLoop());
