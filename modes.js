'use strict'
//This file contains all the potential mode combinations.
//modefunc contains the array index of customequipname that is to be excluded from being copied over.

	
//This list all the possible costume combinations, in order
//General equips on 1st tab in character profile
//weaponModel,etc : I have to freaking idea whats model for but whatever
//Dye: Dyes for general equips.
//weaponEnchant: Weapon Enchantment. 0-9 in this current patch I think.
//styleHead, etc etc: The proper costumes on second tab
//acessory 
//styleBodyDye: Dye for Body costume. Only applies if the costume is dyeable
		  
//List of modes:
//REFER TO the list above or in fieldId in costumePacket.json for adding modes 
//Indexes to keep follow fieldId, just add modes by using this format (modenumber)=[index,index,index....], eg 7:[1,2] to keep weapon and chest.

const path = require('path'),
	  fs = require('fs')

try {
	let customequipname = JSON.parse(fs.readFileSync(path.join(__dirname,'lib','costumePacket.json'), 'utf8')).fieldId
}
catch(e){customequipname={}}  //Temporary



const modefunc={
			0:[], 		 		//[] (DEFAULT: NO MAINTAINING OF TARGET COSTUME)
			1:[0,7,23],  		//keeps targets weapon
			2:[8,12,24],	 	//keeps targets costume
			3:[0,7,23,8,12,24], //keeps target weapon and costume
			4:[20,21,22,24], 	//keep costume, including mask, back, hairadornment.
			5:[1,12],			//keeps target body 
			6:[0,7]				//keep target weapon w/o skin
}
		
module.exports = {		
	
	update() {
		customequipname = JSON.parse(fs.readFileSync(path.join(__dirname,'lib','costumePacket.json'), 'utf8')).fieldId
		console.log('[DressUpFriends] Updated modes.js with new version defs. Refer to fieldId in costumePacket.json')
		return
	},
	
	totalmode() {
		return Object.keys(modefunc).length;
	},
	
	targetequip(num,playerequipset) { //change what equip to keep on target
		let mergeequip={}
		if(isNaN(num)) {
			Object.entries(customequipname).forEach(([key, value]) => {
				if(num.includes(value)) mergeequip[value]=playerequipset[key]
			})
		}
		else {
			for(let index of (modefunc[num])) {
				mergeequip[customequipname[index]] = playerequipset[index];
			}
		}
		return mergeequip
	},
	
	customchange(customset) {  //complex changer
		let newequipset={}
		for(let i in customset) {
			if(isFinite(customset[i])) {
				newequipset[customequipname[i]]=customset[i]
			}
		}
		return newequipset
	}
	
}
		
