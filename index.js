const custom_mod=true; //Change this to true if you use custom proxy modules that changes appearances. Set to false otherwise. Experimental.

const CHANGER_ABNORMALITY=[7777001,7777003,7777007,7000005,7000001,7000011]; //Current Abnormality ids of shape changers/self confidence
//const Modes= require('./modes')
module.exports = function dressupf(dispatch) {
	//Defaults:
	let enabled=true, //not used now
		debug=false,  //display debug messages
		maintaincos=true,//default maintain of costume
		negatechangers=false, //default negate big head/self confidence shape changers, true=remove/negate changers on target, false=allow changers on target.
		greeting=false;	//default greeting changes costume
	
	let players=[],
		changed=[],	//playerarray player[i].igname, player[i].id
		equips={},	
		playerid,
		newcostume,
		num=1;
	// for..in={object based.}, returns indexes, for..of=[ array based.], return value	
	//sUserExtChange==player/PC changes to costume
	//Ninjas are unique in itself and using another class costume on ninja just invalidates the costume and causes floating head. 
	//Using ninja classes costume on a non ninja elins just causes no changes.
	dispatch.hook('S_LOGIN', 1, event => {
		playerid = event.cid;
	});

	dispatch.hook('S_SPAWN_USER',3,event => {  
		for(var i=0; i<players.length ;i++) {
			if(event.cid.equals(players[i].id)) {
				if(debug) {
				message('not saved');
				};
				return;
			};
		};
		if(enabled) {
			players.push({igname:event.name.toLocaleLowerCase(),id:event.cid}); //tolocalelowercase for other regions igns of different locale?
		};
	});
	
	dispatch.hook('C_START_INSTANCE_SKILL',1,event => {
		if(greeting && (event.skill===127510165)) {	
			var greetid = event.targets[0].target;
			pushcostume(greetid),
			message('Greet target changed');			
		};
	});
						
		
	dispatch.hook('S_DESPAWN_USER',1,event => { //remove users when out of range, very important to keep arrays small		
		for(var i=0; i<players.length ;i++) {
			if(event.target.equals(players[i].id)) {	//match id to target, if true remove the whole array index--Reminder:Do not use === for object comparison
				if(debug){
				message('splice'+ JSON.stringify(players[i]));
				};
				players.splice((i),1);
				break;
			};
		};
	});
	
	dispatch.hook('S_SPAWN_ME',1, event => {		//reset namelists when changing locations
		players=[],
		changed=[];
	});
	
	//hook sUserExtChange, PC need to requip something for this to trigger for now.		
	dispatch.hook('S_USER_EXTERNAL_CHANGE',1,event => {   //slienced packets wont be saved by default.
		if(enabled && event.id.equals(playerid)) {	//must define this for only packets that matches PC
			equips = Object.assign({},event),
			message('Current Equipped saved');
			if(debug){
			message((JSON.stringify(equips)));//save equipment.
			};
		}
		else if(maintaincos && changed.length!==0) {  // for other characters !== PC
			for(var i=0;i<changed.length;i++) { 
				if(event.id.equals(changed[i].id)) {
					return false;
					break;
				};
			};
		};
	});
	
	if(custom_mod) {
		dispatch.hook('S_USER_EXTERNAL_CHANGE',1,{order:6,filter:{fake:true}},event => { 	//hooks for fake packets from other modules, hook later to prevent clashes?
			if(enabled && event.id.equals(playerid)) {	
				equips = Object.assign({},event),
				message('Current Equipped saved');
				if(debug){
				message((JSON.stringify(equips)));//save equipment.
				};
			};
		});
	};
	
	dispatch.hook('C_CHAT', 1, event => {
		if(event.message.includes('!dressup ')) {
			let namestr=(event.message).replace('</FONT>','').replace('<FONT>','').replace('!dressup','').replace(' ','').toLocaleLowerCase();
			for(var i=0;i<players.length;i++) {
				if(players[i].igname===namestr) {
					pushcostume(players[i].id);
					message('Changed '+namestr)
					break;
				};
			};
			return false;
		};
		if(event.message.includes('!du ')) {
			if(event.message.includes('maintain')){
				if(maintaincos) {
					maintaincos=false,
					message('Costume not maintained');
				}
				else
					maintaincos=true,
					message('Costume maintained');
			}
			else if(event.message.includes('greeting')){
				if(greeting) {
					greeting=false,
					message('Greet to change disabled');
				}
				else
					greeting=true,
					message('Greet to change enabled');
			}
			else if(event.message.includes('changers')){
				if(negatechangers) {
					negatechangers=false,
					message('Negate shape changers disabled');
				}
				else
					negatechangers=true,
					message('Negate shape changers enabled');
			};
			return false;
		};
		
		
		if(/^<FONT>!du<\/FONT>$/i.test(event.message)) {
			if(enabled) {
				enabled=false,
				players=[],
				message('Disabled DressupFriends');
			}
			else {
				enabled=true,
				message('Enabled DressupFriends');
			};
			return false;
		};
	});
			
	function endabnormality(targetidn) {
		for(let skillid of CHANGER_ABNORMALITY) {
			dispatch.toClient('S_ABNORMALITY_END',1, {
				target: targetidn,
				id: skillid
			});
		};
	};
		
	function pushcostume(playeridn) {
		if(num===1) {  
			newcostume = Object.assign(equips,{id:playeridn});
			if(debug) {
			message('save'+JSON.stringify(newcostume));
			};
		};
		if(negatechangers) {
			endabnormality(playeridn);
		};
		dispatch.toClient('S_USER_EXTERNAL_CHANGE', 1, newcostume);	
		for(var i=0;i<changed.length;i++) {
			if(changed[i].id.equals(playeridn)) return;
		};
		changed.push({id:playeridn});
	};
	
	function message(msg) {
		dispatch.toClient('S_CHAT', 1, {
			channel: 24,
			authorID: 0,
			unk1: 0,
			gm: 0,
			unk2: 0,
			authorName: '',
			message: '(DressUpFriends)'+msg
		});
	};
};
	
