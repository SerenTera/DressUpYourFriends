const CUSTOM_MOD=true, 		 //Set this to true if you use custom proxy modules that changes appearances using S_USER_EXTERNAL_CHANGE. Leave this as true if you don't know what it means
	  MAINTAIN_COSTUME=true, //true maintains user changed appearances on target, when target changes its costume. Only works if sight is maintained.
	  MESSAGE_OVERRIDE_CHANGES=true;  //Change this to false if you want to silence the messages that get sent when a saved target costume is overrided.
	  
	  
const modes=require('./modes'),
	  Command = require('command'),
	  path = require('path'),
	  fs = require('fs');
	
const CHANGER_ABNORMALITY=[7777001,7777003,7777007,7000005,7000001,7000011,806001], //Current Abnormality ids of shape changers/self confidence/zombie pot
	  customchat=['weapon','chest','inner','chestdye','enchantment','hat','mask','back','weaponskin','costume','costumedye'], //shortcut name for custom changes: [weapon,chest,innerwear,chestDye,weaponEnchant,hairAdornment,mask,back,weaponSkin,costume,costumeDye]
	  customfilename=['weapon','body','hand','feet','head','face','weaponModel','bodyModel','handModel','feetModel','weaponDye','bodyDye','handDye','feetDye','weaponEnchant','styleHead','styleFace','styleBack','styleWeapon','styleBody','styleFootprint','styleBodyDye'];

module.exports = function dressupf(dispatch) {
	//Defaults (Modify with true/false only, except for mode):
	let enabled=true, //default enabling of object. Keep at false if you do not use this module often.
		negatechangers=true, //default negate big head/self confidence shape changers, true=remove/negate changers on target, false=allow changers on target.
		greeting=false,	//default greeting changes costume
		fix=false, //default fixing of costume. Don't change this, use ingame command to change instead.
		playersave=false, //dont touch this.
		fileopen=true,  //dont touch this.
		mode=0; //default mode of module.
	
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	let players=[],
		changed=[],
		changerlist=[],
		modemessage=0,
		equips={},	
		playerid,
		importdata,
		stopwrite,
		importsave,
		datanamestring,
		originalequips,
		clearchangers,
		customdata={},
		newcustom;
	
	try { 
		customdata = require('./playerdata.json');
	}
	catch(e) {  
		customdata = {};  
	};
	
	try {
		importdata = require('./importdata.json');
	}
	catch(e) {
		importdata={};
	};

	const command = Command(dispatch);
	
	dispatch.hook('S_LOGIN', 1, event => {
		playerid = event.cid,
		datanamestring=event.name.toLocaleLowerCase();
	});

	dispatch.hook('S_SPAWN_USER',11,event => {
		if(enabled)	{
			let playername=event.name.toLocaleLowerCase();
			for(var i=0; i<players.length ;i++) {  //unlikely but a double layer. Slows down code progress tho :S
				if(event.cid.equals(players[i].id)) {
					return;
				};
			};
			players.push({
				igname:playername,
				id:event.cid,
				playerequip:[event.weapon,event.chest,event.inner,event.chestDye,event.weaponEnchant,event.hairAdornment,event.mask,event.back,event.weaponSkin,event.costume,event.costumeDye]
			});
			if(customdata[playername]) {
				for(var i=0;i<changed.length;i++) {
					if(changed[i].id.equals(event.cid)) {
						break;
					};
					if(i==(changed.length-1)) {
						changed.push({id:event.cid});
					};	
				};
				changerlist[event.cid]=customdata[playername].changers;
				Object.assign(event,customdata[playername]);
				delete event.changers;
				if(MESSAGE_OVERRIDE_CHANGES) {command.message('Changed '+ playername + ' to saved costume')};
				return true
			};
		};
	});
	
	dispatch.hook('S_ABNORMALITY_BEGIN',2,event => {
		if(changerlist[event.target] && CHANGER_ABNORMALITY.includes(event.id)) {return false};
	});
	
	
	dispatch.hook('S_DESPAWN_USER',1,event => { //remove users when out of range, very important to keep arrays small		
		for(var i=0; i<players.length ;i++) {
			if(event.target.equals(players[i].id)) {	
				players.splice((i),1);
				break;
			};
		};
	});
	
	dispatch.hook('S_SPAWN_ME',1, event => { //reset namelist on location change
		players=[],
		changed=[];
	});

	dispatch.hook('S_USER_EXTERNAL_CHANGE',1,event => {   //slienced packets wont be saved by default.
		if(!fix && enabled && event.id.equals(playerid)) {
			equips = Object.assign({},event),
			originalequips=Object.assign({},event),
			command.message('(Dressup) Current Equipped saved');
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
				originalequips=Object.assign({},event),
				command.message('(Dressup) Current Equipped saved');
			};
		});
	};
	
	//Change target appearance
	command.add('dressup',namestr => {
		namestr=namestr.toLocaleLowerCase();
		for(var i=0;i<players.length;i++) {
			if(players[i].igname===namestr) {
				pushcostume(namestr,players[i].id,players[i].playerequip);
				command.message('(Dressup)Changed '+namestr+' (Mode: '+JSON.stringify(modemessage)+')');
				break;
			};
		};
	});
	
	command.add('dressupsave',namestring => {
		namestring=namestring.toLocaleLowerCase();
		for(var i=0;i<players.length;i++) {
			if(players[i].igname===namestring) {
				playersave=true,
				pushcostume(namestring,players[i].id,players[i].playerequip);
				playersave=false;
				saveplayer('playerdata.json',customdata);
				command.message('(Dressup)Changed and saved '+namestring+' (Mode: '+JSON.stringify(modemessage)+')');
				break;
			};
		};
	});
	
	command.add('dressupdelete',deletename => {
		deletename=deletename.toLocaleLowerCase();
		if(customdata[deletename]) {
				delete customdata[deletename];
				saveplayer('playerdata.json',customdata);
				command.message('(Dressup)Deleted '+deletename+' from saved data');
		};
	});
	//Commands that affects features when applying the equipments
	command.add('duchangers', () => {
		if(negatechangers) {
			negatechangers=false,
			command.message('(Dressup)Negate shape changers disabled');
		}
		else
			negatechangers=true,
			command.message('(Dressup)Negate shape changers enabled');
	});
	
	command.add('dufix', () => {
		if(fix) {
			fix=false,
			command.message('(Dressup)Saved equipment Not Fixed');
		}
		else
			fix=true,
			command.message('(Dressup)Saved equipment Fixed');
	});
	
	command.add('dumode', arg => {
		mode=parseInt((arg.replace(/[^0-9\.]/g, '')),10);
		if(isNaN(mode)) {
			let singlemode=arg.toLowerCase()
			mode=[],
			modemessage=[];
			for(let i in customchat) {
				if(singlemode.includes(customchat[i])) {
					mode.push(i);
					modemessage.push(customchat[i]);
				};		
			};
			command.message('(Dressup)Mode changed. Following parts will be kept: '+ modemessage);
		}
		else if(mode>(modes.totalmode()-1)) {
			mode=0,
			modemessage=0,
			command.message('(Dressup)Invalid mode, resetting to default mode=0');
		}
		else
			modemessage=[mode],
			command.message('(Dressup)Mode changed to '+mode);
	});
	
	command.add('duid', namestri => {
		namestri=namestri.toLocaleLowerCase();
		for(var i=0;i<players.length;i++) {
			if(players[i].igname===namestri) {
				let idtext={};
				playeridequip=players[i].playerequip;
				for(let i in customchat) {
					idtext[customchat[i]]=playeridequip[i];
				};
				command.message('(Dressup)Player '+namestri+' costume ids are: '+JSON.stringify(idtext));
				console.log('(Dressup)Player '+namestri+' costume ids are: '+JSON.stringify(idtext));
				break;
			};
		};
	});
	
	//Customise saved equipment
	command.add('ducustom', argu => {
		if(argu.includes('(')) {
			let customset=argu.replace(/[^0-9\,\x\X]/g, '').split(",");
			newcustom=modes.customchange(customset);
			if(Object.keys(newcustom).length===0) {
				command.message('(Dressup)Custom change error: Empty/Wrong input. Check that you use () with 11 itemIDs or x')
			}
			else
				command.message('(Dressup)Custom change to '+JSON.stringify(newcustom)),
				Object.assign(equips,newcustom);
		}
		else if(argu.includes('fix') && CUSTOM_MOD) {
			command.message('(Dressup)Custom fix mode in effect, the next costume change will not be applied but will be saved');
			dispatch.hookOnce('S_USER_EXTERNAL_CHANGE',1,{order:7,filter:{fake:true}},event => { //Only if you use custom mods that changes equip via S_USER_EXTERNAL_CHANGE
				if(event.id.equals(playerid)) {	
					equips = Object.assign({},event),
					command.message('(Dressup)New equip saved, not applied to player');
					return false;
				};
			});
		}
		else {
			let customstring=argu.replace(/[0-9\"\'\:\{\}]/g, '').replace(/ /g,'').toLowerCase().split(","),
				customidstr=argu.replace(/[^0-9\,]/g, '').replace(/ /g,'').split(","),
				stringindex=[],
				customid=[];
			for(let i in customstring) {
				if(customchat.includes(customstring[i])) {
					stringindex.push(customchat.indexOf(customstring[i]));
					customid.push(customidstr[i]);
				};
			};
			newcustom=modes.changesingle(stringindex,customid);
			if(typeof(newcustom)=== 'object'){Object.assign(equips,newcustom)};  //repeatable and will continue to be kept so long as it is not changed again.
			if(Object.keys(newcustom).length===0) {
				command.message('(Dressup)Custom part change error: Empty/Wrong input. Check spellings and , is used to separate parts.')
			}
			else
				command.message('(Dressup)Custom part change '+ JSON.stringify(newcustom));
		};
	});	
	//Import/export data
	command.add('duimport',namearg => {
		fs.readFile(path.join(__dirname,'importdata.json'),function(err,data) {
			if(err) {
				command.message('(Dressup) Error reading file importdata.json. Check that it is in module folder');
				return
			};
			data=JSON.parse(data);
			if(typeof namearg === 'undefined') {
				Object.assign(customdata,data);
				saveplayer('playerdata.json',customdata);
				command.message('(Dressup) Attempted to Import all data');
			}
			else if(data[namearg.toLocaleLowerCase()]) {
				customdata[namearg.toLocaleLowerCase()]=data[namearg.toLocaleLowerCase()];
				saveplayer('playerdata.json',customdata);
				command.message('(Dressup) Attempted to Import data for '+ namearg);
			}
			else
				command.message('(Dressup) Error Importing file: Name not found');
		});
	});

	command.add('duexport',() => {
		importdata[datanamestring]=makesavefile(originalequips);
		saveplayer('importdata.json',importdata);
		command.message('(Dressup) Created import file. Send importdata.json to another player to have them fix how all your exported characters look like on their end.');
	});
		
	//Disable/Enable Module
	command.add('dutoggle',() => {
		if(enabled) {
			enabled=false,
			players=[],
			changed=[],
			command.message('(Dressup)Disabled DressupFriends');
		}
		else {
			enabled=true,
			command.message('(Dressup)Enabled DressupFriends');
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
	
	function pushcostume(playerign,playeridn,playereqp) {		
		let targetmodeeqp= modes.targetequip(mode,playereqp),
			newcostume= Object.assign({},equips,{id:playeridn},targetmodeeqp);
		if(negatechangers) {
			endabnormality(playeridn);
		};
		dispatch.toClient('S_USER_EXTERNAL_CHANGE', 1, newcostume);
		if(playersave) {
			customdata[playerign]=makesavefile(newcostume);
		};
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
	
	function makesavefile(datatosave) {
		datatosave.inner=datatosave.innerwear,
		datatosave.changers=negatechangers;
		for(let deletename of ['id','innerwear','unk1','unk2','unk3','unk4','enable']) {
			delete datatosave[deletename]
		};
		return Object.assign({},datatosave);
	};
	
	function saveplayer(filename,dataname) {
		if(fileopen) {
			fileopen=false;
			fs.writeFile(path.join(__dirname,filename), JSON.stringify(dataname), err => {
				if(err) command.message('Error Writing File, attempting to rewrite');
				fileopen = true;
			});
		}
		else {
			clearTimeout(stopwrite);  //if file still being written
			stopwrite=setTimeout(saveplayer(filename,dataname),2000);
			return;
		};
	};
};
