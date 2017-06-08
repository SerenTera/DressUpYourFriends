module.exports = function dressupf(dispatch) {
	let players=[],
		changed=[],	//playerarray player[i].igname, player[i].id
		equips={},	
		enabled=true, //not used now
		debug=false,  //display debug messages
		maintaincos=true, //default maintain of costume
		playerid,
		newcostume,
		num=1;
	//filter.fake=true
	//cid==target==id
	//sSpawnUser==info on other players
	//sUserExtChange==player/PC changes to costume
	
	dispatch.hook('S_LOGIN', 1, event => {
		playerid = event.cid;
	});
	
	//hook to save players names:
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
		if(debug){
		message(JSON.stringify(players));
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
	
	//hook sUserExtChange, PC need to requip something for this to trigger for now. Todo: automatically add in properties using sLogin			
	dispatch.hook('S_USER_EXTERNAL_CHANGE',1,event => {
		if(enabled && event.id.equals(playerid)) {	//must define this for only packets that matches PC
			equips = Object.assign({},event),
			message('Current Equipped saved');
			if(debug){
			message((JSON.stringify(equips)));//save equipment.
			};
		};
		if(maintaincos && changed.length!==0) {
			for(var i=0;i<changed.length;i++) { 
				if(event.id.equals(changed[i].id)) {
					return false;
					break;
				};
			};
		};
	});
	
	
	dispatch.hook('C_CHAT', 1, event => {
		if(event.message.includes('!dressup')) {
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
		if(event.message.includes('!du')) {
			if(event.message.includes('maintain')){
				if(maintaincos) {
					maintaincos=false,
					message('Costume not maintained');
				}
				else
					maintaincos=true,
					message('Costume maintained');
			}
			else {
				if(enabled) {
					enabled=false,
					players=[],
					message('Disabled DressupFriends');
				}
				else
					enabled=true,
					message('Enabled DressupFriends');
			};
			return false;
		};
	});
			
			
	function pushcostume(playeridn) {
		if(num===1) {  
			newcostume = Object.assign(equips,{id:playeridn});
			if(debug) {
			message('save'+JSON.stringify(newcostume));
			};
		};
		dispatch.toClient('S_USER_EXTERNAL_CHANGE', 1, newcostume);	
		for(var i=0;i<changed.length;i++) {
			if(changed[i].id.equals(playeridn)) return;
		}	
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
				
