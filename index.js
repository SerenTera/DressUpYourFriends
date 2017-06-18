const CUSTOM_MOD=true, 		 //Change this to true if you use custom proxy modules that changes appearances using S_USER_EXTERNAL_CHANGE.
	  MAINTAIN_COSTUME=true, //true maintains user changed appearances on target, when target changes its costume. Only works if sight is maintained.
	  COMMAND_MODULE=false;  //Change this for Command module support. Currently unsupported yet, keep it false.
	  
const modes=require('./modes'); 
const CHANGER_ABNORMALITY=[7777001,7777003,7777007,7000005,7000001,7000011], //Current Abnormality ids of shape changers/self confidence
	  customchat=['weapon','chest','inner','chestdye','enchantment','hat','mask','back','weaponskin','costume','costumedye']; //shortcut name for custom changes: [weapon,chest,innerwear,chestDye,weaponEnchant,hairAdornment,mask,back,weaponSkin,costume,costumeDye]
	  //customchat=['hairAdornment','mask','back','weaponSkin','costume']; //Uncomment any set you like to use instead and comment out the other one. This one simplify the id based customization. Do so on modes.js too.
		
module.exports = function dressupf(dispatch) {
	//Defaults:
	let enabled=true, //default enabling of object
		negatechangers=false, //default negate big head/self confidence shape changers, true=remove/negate changers on target, false=allow changers on target.
		greeting=false,	//default greeting changes costume
		fix=false,
		mode=0; //default mode of module.
	
	let players=[],
		changed=[],
		modemessage=[],
		equips={},	
		playerid,
		newcustom;
	
	dispatch.hook('S_LOGIN', 1, event => {
		playerid = event.cid;
	});

	dispatch.hook('S_SPAWN_USER',3,event => {  
		for(var i=0; i<players.length ;i++) {
			if(event.cid.equals(players[i].id)) {
				return;
			};
		};
		if(enabled) {
			players.push({
				igname:event.name.toLocaleLowerCase(),
				id:event.cid,
				playerequip:[event.weapon,event.chest,event.inner,event.chestDye,event.weaponEnchant,event.hairAdornment,event.mask,event.back,event.weaponSkin,event.costume,event.costumeDye]
			});
		};
	});
	
	dispatch.hook('C_START_INSTANCE_SKILL',1,event => {
		if(greeting && (event.skill===127510165)) {	
			var greetid = event.targets[0].target;
			pushcostume2(greetid),
			message('Greet target changed');			
		};
	});
	
	dispatch.hook('S_DESPAWN_USER',1,event => { //remove users when out of range, very important to keep arrays small		
		for(var i=0; i<players.length ;i++) {
			if(event.target.equals(players[i].id)) {	//match id to target, if true remove the whole array index--Reminder:Do not use === for object comparison
				players.splice((i),1);
				break;
			};
		};
	});
	
	dispatch.hook('S_SPAWN_ME',1, event => { //reset namelists when changing locations
		players=[],
		changed=[];
	});
	

	dispatch.hook('S_USER_EXTERNAL_CHANGE',1,event => {   //slienced packets wont be saved by default.
		if(!fix && enabled && event.id.equals(playerid)) {
			equips = Object.assign({},event),
			message('Current Equipped saved');
		}
		else if(MAINTAIN_COSTUME && changed.length!==0) { 
			for(var i=0;i<changed.length;i++) { 
				if(event.id.equals(changed[i].id)) {
					return false;
					break;
				};
			};
		};
	});
	
	if(CUSTOM_MOD) {
		dispatch.hook('S_USER_EXTERNAL_CHANGE',1,{order:6,filter:{fake:true}},event => { 	//hooks for fake packets from other modules, hook later to prevent clashes?
			if(enabled && event.id.equals(playerid) && !fix) {	
				equips = Object.assign({},event),
				message('Current Equipped saved');
			};
		});
	};
	
	
	dispatch.hook('C_CHAT', 1, event => {
		//Change appearance
		if(event.message.includes('!dressup ')) {
			let namestr=(event.message).replace('</FONT>','').replace('<FONT>','').replace('!dressup','').replace(' ','').toLocaleLowerCase();
			for(var i=0;i<players.length;i++) {
				if(players[i].igname===namestr) {
					pushcostume(players[i].id,players[i].playerequip);
					message('Changed '+namestr);
					break;
				};
			};
			return false;
		};
		//Commands that affects features when applying the equipments
		if(event.message.includes('!du ')) {
			if(event.message.includes('greeting')){
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
			}
			else if(event.message.includes('fix')){
				if(fix) {
					fix=false,
					message('Saved equipment Not Fixed');
				}
				else
					fix=true,
					message('Saved equipment Fixed');
			}	
			else {
				mode= parseInt((event.message.replace(/[^0-9\.]/g, '')),10);
				if(isNaN(mode)) {
					let singlemode=event.message.replace('</FONT>','').replace('<FONT>','').replace('!ducustom','').replace(' ','').toLowerCase();
					mode=[];
					for(let i in customchat) {
						if(singlemode.includes(customchat[i])) {
							mode.push(i);
							modemessage.push(customchat[i]);
						};
					};
					message('Mode changed. Following parts will be kept: '+modemessage+mode),
					modemessage=[];
				}
				else if(mode>(modes.totalmode()-1)) {
					mode=0,
					message('Invalid mode, resetting to default mode=0');
				}
				else
					message('Mode changed to '+mode);
			};
			return false;
		};	
		
		//customise saved equipment (only fix works)
		if(event.message.includes('!ducustom ')) {
			if(event.message.includes('[')) {
				let customset=JSON.parse("["+event.message.replace(/[^0-9\,\x\X]/g, '')+"]");
				newcustom=modes.customchange(customset),
				message('Custom change to '+newcustom);
				Object.assign(equips,newcustom);
			}
			else if(event.message.includes('fix') && CUSTOM_MOD) {
				dispatch.hookOnce('S_USER_EXTERNAL_CHANGE',1,{order:7,filter:{fake:true}},event => { //Only if you use custom mods that changes equip via S_USER_EXTERNAL_CHANGE
					if(event.id.equals(playerid)) {	
						equips = Object.assign({},event),
						message('New equip saved, not applied to player');
						return false;
					};
				});
			}
			else {
				let customstring=event.message.replace('</FONT>','').replace('<FONT>','').replace('!ducustom','').replace(' ','').replace(/[0-9\.]/g, '').toLowerCase(),
					customid=parseInt(event.message.replace(/[^0-9\.]/g, ''));
				if(customchat.includes(customstring)) { 
					stringindex=customchat.indexOf(customstring.toString()); //techincally not strict equal (===)
					newcustom=modes.changesingle(stringindex,customid),
					message('Custom single change '+ newcustom);
					Object.assign(equips,newcustom);  //repeatable and will continue to be kept so long as it is not changed again.
				};
			};
			return false;
		};
		
		//Disable/Enable Module
		if(/^<FONT>!du<\/FONT>$/i.test(event.message)) {
			if(enabled) {
				enabled=false,
				players=[],
				changed=[],
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
	
	//WHEN USING OBJECT.ASSIGN FOR A NEW OBJECT, MUST USE Object.assign({},object,object), as it will return the target object!
	function pushcostume(playeridn,playereqp) {		
		let targetmodeeqp= modes.targetequip(mode,playereqp),
			newcostume= Object.assign({},equips,{id:playeridn},targetmodeeqp);
		if(negatechangers) {
			endabnormality(playeridn);
		};
		dispatch.toClient('S_USER_EXTERNAL_CHANGE', 1, newcostume);
		for(var i=0;i<changed.length;i++) {
			if(changed[i].id.equals(playeridn)) return;
		};
		changed.push({id:playeridn});
	};
	
	function pushcostume2(playeridn) {		
		let	newcostume= Object.assign({},equips,{id:playeridn});
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
			authorName: '',
			message: '(DressUpFriends)'+msg
		});
	};
};
