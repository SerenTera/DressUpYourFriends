//This file contains all the potential mode combinations as well as inner combinations.
//modefunc contains the array index of customequipname that is to be excluded from being copied over.
const customequipname=['weapon','chest','innerwear','chestDye','weaponEnchant','hairAdornment','mask','back','weaponSkin','costume','costumeDye']; //index: 0=weapon,1=chest,2=innerwear... etcetc
	  //customequipname=['hairAdornment','mask','back','weaponSkin','costume']; //uncomment the set you like to use instead. Comment out the other set. ONLY use one at a time.
		  
//List of modes:
//indexes to keep follow customequipname, just add modes by using this format (modenumber)=[index,index,index....], eg 7:[0,1] to keep weapon and chest.
const modefunc={
			0:[], 		 //[] (DEFAULT: NO MAINTAINING OF TARGET COSTUME)
			1:[0,4,8],  	 //[weapon, weaponSkin]  keeps targets weapon
			2:[9,10],	 //[costume,costumeDye] keeps targets costume
			3:[0,4,8,9,10], //[weaponSkin,costume,costumeDye] keeps target weapon and costume
			4:[5,6,7,9,10], //keep costume, including mask, back, hairadornment.
			5:[1,3],		 //[chest,chestDye] keeps target chest
			6:[0,4]			//keep target weapon w/o skin
		};
module.exports = {		

	totalmode() {
		return Object.keys(modefunc).length;
	},
	
	targetequip(num,playerequipset) {
		let mergeequip={};
		if(isNaN(num)) {
			for(let index of num) {
				mergeequip[customequipname[index]]=playerequipset[index];
			};
		}
		else {
			for(let index of (modefunc[num])) {
				mergeequip[customequipname[index]]=playerequipset[index];
			};
		};
		return mergeequip
	},
	
	customchange(customset) {  //complex changer
		let newequipset={};
		for(let i in customset) {
			if(isFinite(customset[i])) {
				newequipset[customequipname[i]]=customset[i];
			};
		};
		return newequipset
	},
	
	changesingle(stringindex,customid) { //single string changer
		let singleequip={};
		singleequip[customequipname[stringindex]]=customid;
		return singleequip
	}
	
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
		
