//This file contains all the potential mode combinations.
//modefunc contains the array index of customequipname that is to be excluded from being copied over.
const customequipname = {
	
//This list all the possible costume combinations	
	0:'weapon',  		//General equips on 1st tab in character profile
	1:'body',
	2:'hand',
	3:'feet',
	4:'underwear',
	5:'head',
	6:'face',
	7:'weaponModel',	//I have to freaking idea whats model for but whatever
	8:'bodyModel',
	9:'handModel',
	10:'feetModel',
	11:'weaponDye',		//Dyes for general equips.
	12:'bodyDye',		
	13:'handDye',
	14:'feetDye',
	15:'underwearDye',
	16:'styleBackDye',
	17:'styleHeadDye',
	18:'styleFaceDye',
	19:'weaponEnchant',	//Weapon Enchantment. 0-9 in this current patch I think.
	20:'styleHead',		//The proper costumes on second tab
	21:'styleFace',
	22:'styleBack',
	23:'styleWeapon',
	24:'styleBody',
	25:'styleFootprint',
	26:'styleBodyDye'	//Dye for Body costume. Only applies if the costume is dyeable
}
		  
//List of modes:
//indexes to keep follow customequipname, just add modes by using this format (modenumber)=[index,index,index....], eg 7:[1,2] to keep weapon and chest.
const modefunc={
			0:[], 		 		//[] (DEFAULT: NO MAINTAINING OF TARGET COSTUME)
			1:[0,7,23],  		//keeps targets weapon
			2:[8,12,24],	 	//keeps targets costume
			3:[0,7,23,8,12,24], //keeps target weapon and costume
			4:[20,21,22,24], 	//keep costume, including mask, back, hairadornment.
			5:[1,12],			//keeps target body 
			6:[0,7]				//keep target weapon w/o skin
		};
		
module.exports = {		

	totalmode() {
		return Object.keys(modefunc).length;
	},
	
	targetequip(num,playerequipset) { //change what equip to keep on target
		let mergeequip={}
		if(isNaN(num)) {
			Object.entries(customequipname).forEach(([key, value]) => {
				if(num.includes(value.toLowerCase())) mergeequip[value]=playerequipset[key]
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
	},
	
	/*changesingle(stringindex,customid) { //single string changer
		let singleequip={};
		if(stringindex.length===customid.length) {
			for(let i in stringindex) {
				singleequip[customequipname[stringindex[i]]]=customid[i];
			}
		}
		return singleequip
	}*/
	
	/*function message(msg) {
		dispatch.toClient('S_CHAT', 1, {
			channel: 24,
			authorID: 0,
			unk1: 0,
			gm: 0,
			unk2: 0,
			authorName: '',
			message: '(DressUpFriends)'+msg
		});
	};*/
};		
		
