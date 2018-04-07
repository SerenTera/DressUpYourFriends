//DressUpYourFriends v3.0.0
//Configuration file is config.json (NOT configDefault.json)

const modes=require('./modes'),
	  Command = require('command'),
	  path = require('path'),
	  fs = require('fs'),	  
	  defaultConfig = require('./lib/configDefault.json')
	
const CHANGER_ABNORMALITY=[7777001,7777003,7777007,7000005,7000001,7000011,806001], //Current Abnormality ids of shape changers/self confidence/zombie pot
	  customchat=['weapon','chest','inner','chestdye','enchantment','hat','mask','back','weaponskin','costume','costumedye'] //shortcut name for custom changes: [weapon,chest,innerwear,chestDye,weaponEnchant,hairAdornment,mask,back,weaponSkin,costume,costumeDye]
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports = function dressupf(dispatch) {
	const command = Command(dispatch)
	
	let players={},
		changed=[],
		changerlist=[],
		customstring,
		customidstr,
		stringindex=[],
		customid=[],
		modemessage=0,
		equips={},	
		playerid,
		playername,
		importdata,
		stopwrite,
		importsave,
		datanamestring,
		originalequips,
		clearchangers,
		customdata={},
		newcustom={},
		equiplist=[],
		costumePacket,
		packetname=[],
		fileopen=true, 			//dont touch this.
		debug = false		
	 	
/////Try requires	
	try {customdata = require('./playerdata.json')}
	catch(e) {customdata = {} }
	
	try {importdata = require('./importdata.json')}
	catch(e) {importdata={} }
	
	try {
		costumePacket = require('./lib/costumePacket.json')
		packetname = costumePacket.packetField
	}
	catch(e) {
		costumePacket = {packetField:[],gameVersion:0,fieldId:{}}
	}
	
	try{
		config = JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'), 'utf8'))
		if(config.moduleVersion !== defaultConfig.moduleVersion) {
			config = Object.assign({},defaultConfig,config,{moduleVersion:defaultConfig.moduleVersion})
			saveplayer(config,'config.json')
			console.log('[DressUpFriends] Updated new config file. Current settings transferred over.')
		}
	}
	catch(e){
		config = defaultConfig
		saveplayer(config,'config.json')
		console.log('[DressUpFriends] Initated a new config file due to missing config file. Add your default config in config.json.')
	}	

	
/////Configs shortcut
	const MAINTAIN_COSTUME = config.MAINTAIN_COSTUME, 			
		  MESSAGE_OVERRIDE_CHANGES = config.MESSAGE_OVERRIDE_CHANGES
		  
	let enabled=config.enabled,
		negateChangers=config.negateChangers, 				
		ignoreFake=config.ignoreFake, 		
		playersave=config.playersave, 		
		mode=config.mode	
	
	
/////Commands
	command.add('dressup',namestr => {
		namestr=namestr.toLowerCase()
		if(namestr === datanamestring) {
			dispatch.toClient('S_USER_EXTERNAL_CHANGE', 6, equips)
			command.message('(Dressup)You Changed </3')
		}
		if(players[namestr]) {
			pushcostume(namestr,players[namestr].id,players[namestr].playerequip)
			command.message('(Dressup)Changed '+namestr+' (Mode: '+JSON.stringify(modemessage)+')')
		}
	})
	
	command.add('dressupsave',namestring => {
		namestring=namestring.toLowerCase()
		if(players[namestring]) {
			playersave=true
			pushcostume(namestring,players[namestring].id,players[namestring].playerequip)
			playersave=false
			saveplayer(customdata,'playerdata.json')
			command.message('(Dressup)Changed and saved '+namestring+' (Mode: '+JSON.stringify(modemessage)+')')
		}
	})
	
	command.add('dressupdelete',deletename => {
		deletename=deletename.toLocaleLowerCase()
		if(customdata[deletename]) {
				delete customdata[deletename]
				saveplayer(customdata,'playerdata.json')
				command.message('(Dressup)Deleted '+deletename+' from saved data')
		}
	})
	
	//Commands that affects features when applying the equipments
	command.add('duchangers', () => {
		negateChangers = !negateChangers
		command.message(`(Dressup)Negate shape changers ${negateChangers ? 'enabled' : 'disabled'}`)
	})
	
	command.add('dufake', () => {
		ignoreFake = !ignoreFake
		command.message(`(Dressup)Ignore fake equipment sent by other modules ${ignoreFake ? 'enabled' : 'disabled'}`);
	})
	
	command.add('dumode', arg => {
		mode=parseInt((arg.replace(/[^0-9\.]/g, '')),10)
		if(isNaN(mode)) {
			let singlemode=arg.replace(/ /g, '').toLowerCase().split(",")
			mode=[]
			modemessage=[]
			for(let name of packetname) {
				if(singlemode.includes(name.toLowerCase())) {
					mode.push(name)
					modemessage.push(name)
				}	
			}
			command.message('(Dressup)Mode changed. Following parts will be kept: '+ modemessage)
		}
		else if(mode>(modes.totalmode()-1)) {
			mode=0
			modemessage=0
			command.message('(Dressup)Invalid mode, resetting to default mode=0')
		}
		else
			modemessage=[mode],
			command.message('(Dressup)Mode changed to '+mode)
	})
	
	command.add('duid', namestri => {
		namestri=namestri.toLowerCase()
		if(players[namestri]) {
			let idtext={}
			playeridequip = players[namestri].playerequip
			for(let i in packetname) idtext[packetname[i]] = playeridequip[i]
			command.message('(Dressup)Player '+namestri+' costume ids are:\n'+ JSON.stringify(idtext, null, "\t"))
			console.log('(Dressup)Player '+namestri+' costume ids are:\n'+ JSON.stringify(idtext, null, "\t"))
		}
	})
	
	//Customise saved equipment
	command.add('ducustom', (argu,name) => {
		if(argu.includes('json')) {
			fs.readFile(path.join(__dirname,'ducustom.json'),function(err,data) {
				if(err) {
					command.message('(Dressup) Error reading file ducustom.json. Remember to blank out entries if not used as ""')
					return
				}
				else
					data=JSON.parse(data)
					Object.entries(data).forEach(([key,values]) => {
						if(isNaN(parseInt(values))) delete data[key]
						else 
							data[key] = parseInt(values)
					})
					Object.assign(equips,data)
					command.message('(Dressup)Sucessfully modified saved equip. Changes: '+JSON.stringify(data))
			})
		}
		else if(argu.includes('fix') && CUSTOM_MOD) { //does not work maybe
			command.message('(Dressup)Custom fix mode in effect, the next costume change will not be applied but will be saved');
			dispatch.hookOnce('S_USER_EXTERNAL_CHANGE',6,{order:7,filter:{fake:true}}, event => { //Only if you use custom mods that changes equip via S_USER_EXTERNAL_CHANGE
				if(event.gameId.equals(playerid)) {	
					equips = Object.assign({},event)
					command.message('(Dressup)New equip saved, not applied to player')
					return false
				}
			})
		}
		else {
			customstring=argu.replace(/[0-9\"\'\:\{\}]/g, '').replace(/ /g,'').toLowerCase().split(",") //Sorry, i went fuck it and left it ugly :/
			customidstr=argu.replace(/[^0-9\,]/g, '').replace(/ /g,'').split(",")
			stringindex=[]
			customid=[]
			if(customstring.length !== customidstr.length) {
				command.message('(Dressup)Custom part change error: Mismatch id and part. Check spellings and , is used to separate parts.')
				return
			}
			
			for(let name of packetname) {
				if(customstring.includes(name.toLowerCase())) {
					newcustom[name] = customidstr[customstring.indexOf(name.toLowerCase())]
				}
			}
		
			if(typeof(newcustom)=== 'object'){Object.assign(equips,newcustom)}  //repeatable and will continue to be kept so long as it is not changed again.
			
			if(Object.keys(newcustom).length===0) {
				command.message('(Dressup)Custom part change error: Empty/Wrong input. Check spellings and , is used to separate parts.')
			}
			else
				command.message('(Dressup)Custom part change '+ JSON.stringify(newcustom));
		}
		
		
	})
	
	//Import/export data
	command.add('duimport',namearg => {
		fs.readFile(path.join(__dirname,'importdata.json'),function(err,data) {
			if(err) {
				command.message('(Dressup) Error reading file importdata.json. Check that it is in module folder')
				return
			}
			data=JSON.parse(data)
			if(typeof namearg === 'undefined') {
				Object.assign(customdata,data)
				saveplayer(customdata,'playerdata.json')
				command.message('(Dressup) Attempted to Import all data')
			}
			else if(data[namearg.toLowerCase()]) {
				customdata[namearg.toLowerCase()]=data[namearg.toLowerCase()]
				saveplayer(customdata,'playerdata.json')
				command.message('(Dressup) Attempted to Import data for '+ namearg)
			}
			else
				command.message('(Dressup) Error Importing file: Name not found')
		})
	})

	command.add('duexport',() => {
		importdata[datanamestring] = makesavefile(originalequips)
		saveplayer(importdata,'importdata.json')
		command.message('(Dressup) Created import file. Send importdata.json to another player to have them fix how all your exported characters look like on their end.')
	})
		
	//Disable/Enable Module
	command.add('dutoggle',() => {
		if(enabled) {
			enabled=false
			players=[]
			changed=[]
			command.message('(Dressup)Disabled DressupFriends')
		}
		else {
			enabled=true,
			command.message('(Dressup)Enabled DressupFriends')
		}
	})
	
	command.add('dupacket',() => {
		command.message('[DressupFriends] Attempting to check for vital packet changes. Unequip something')
		packetUpdate('*')
		modes.update()
	})
	
	command.add('dumigrate',() => {
		let tempObj = {}
		Object.keys(customdata).forEach( key => {
			if(!customdata[key].showStyle) {
				tempObj = customdata[key].changers
				delete customdata[key].changers
				customdata[key].showStyle = true
				customdata[key].changers = tempObj
			}
		})
		saveplayer(customdata,'playerdata.json')
		command.message('[DressupFriends] Sucessfully migrated playerdata.json to new format')
	})
////////Dispatches	
	dispatch.hook('S_LOGIN', dispatch.base.majorPatchVersion >= 67 ? 10 : 9, event => {
		playerid = event.gameId
		datanamestring=event.name.toLowerCase()
		if(costumePacket.gameVersion != dispatch.base.protocolVersion) {
			console.log('[DressupFriends] New game version detected. Attempt to check for vital packet changes upon login.')
			packetUpdate('*')
		}
	})

	dispatch.hook('S_SPAWN_USER',13,event => {
		if(enabled)	{
			playername = event.name.toLowerCase()
			
			if(players[playername]) return
			
			else 
				players[playername] = {
					id: event.gameId,
					playerequip:equiparray(event)
				}
			
			if(customdata[playername]) {
				if(!changed.includes(event.gameId.toString())) changed.push(event.gameId.toString())
				if(customdata[playername].changers && !changerBlock.includes(event.gameId)) changerBlock.push(event.gameId)
				
				Object.assign(event,customdata[playername])
				delete event.changers
				if(MESSAGE_OVERRIDE_CHANGES) command.message(`Changed ${event.name} to saved costume`)
				
				return true
			}
		}
	})
	
	dispatch.hook('S_ABNORMALITY_BEGIN', 2, event => {
		if(changerBlock[event.target] && CHANGER_ABNORMALITY.includes(event.id)) return false
	})
	
	
	dispatch.hook('S_DESPAWN_USER', 3, event => { 	
		for(let [key, value] of Object.entries(players)) {
			if(event.gameId.equals(value.id)) {
				delete players[key]
				if(debug) console.log(key)
				break
			}
		}
	})
	
	dispatch.hook('S_LOAD_TOPO', 'raw', () => { 
		players=[]
		changed=[]
		changerBlock=[]
	})

	

	dispatch.hook('S_USER_EXTERNAL_CHANGE', 6, {order:6,filter:{fake:null}}, (event,fake) => { 	//hooks for fake packets from other modules, hook later to prevent clashes?
		if(ignoreFake && fake) return
		
		if(enabled && event.gameId.equals(playerid)) {  //NOT A SPELLING ERROR ~.~
			equips = event	
			originalequips = event
			command.message('(Dressup) Current Equipped saved')
		}
		
		else if(MAINTAIN_COSTUME && changed.length!==0 && !fake) { 
			if(changed.includes(event.gameId.toString())) return false
		}
	})
	
/////Functions
	function packetUpdate(version) {
		dispatch.hookOnce('S_USER_EXTERNAL_CHANGE' ,version , {order:-100,filter:{fake:null}}, event => {
			let compareName = Object.keys(event)
			let matchId = {}
			compareName.shift() //Remove 1st gameId
			
			if(arraysEqual(packetname,compareName)) {
				console.log('[DressupFriends] No new packet changes detected in new game revision.')
				saveplayer(Object.assign({},costumePacket,{gameVersion:dispatch.base.protocolVersion}),['lib','costumePacket.json'])
			}
				
			else {
				packetname = compareName
				console.log('[DressupFriends] Detected changes in packet definition. Update module packet [S_USER_EXTERNAL_CHANGE]')
				costumePacket.gameVersion = dispatch.base.protocolVersion
				for(i=0; i < packetname.length; i++) {
					matchId[i] = packetname[i]
				}
				costumePacket.fieldId = matchId	
				
				saveplayer({
					"packetField":packetname,
					"gameVersion":dispatch.base.protocolVersion,
					"fieldId": matchId
				},['lib','costumePacket.json'])
				
			}
		})
	}
	
	function arraysEqual(arr1,arr2) { //StackOverflow ftw
		if (arr1.length !== arr2.length) return false
		
		for (var i = arr1.length; i--;) {
			if(arr1[i] !== arr2[i]) return false
		}
		return true
	}
	
	function endabnormality(target) {
		for(let skillid of CHANGER_ABNORMALITY) {
			dispatch.toClient('S_ABNORMALITY_END',1, {
				target: target,
				id: skillid
			})
		}
	}
	
	function pushcostume(playerign,playeridn,playereqp) {		
		let targetmodeeqp = modes.targetequip(mode,playereqp)
		newcostume = Object.assign({},equips,{gameId:playeridn},targetmodeeqp)
		if(negateChangers) endabnormality(playeridn)
			
		dispatch.toClient('S_USER_EXTERNAL_CHANGE', 6, newcostume)
		
		if(playersave) customdata[playerign] = makesavefile(newcostume)
		
		if(!changed.includes(playeridn.toString())) changed.push(playeridn.toString())

	}
	
	
	function makesavefile(datatosave) {
		datatosave.changers = negateChangers
		delete datatosave.gameId
		return datatosave
	}
	
	function saveplayer(data,args) { 
		if(!Array.isArray(args)) args = [args] //Find a way around this later -.-
		
		if(fileopen) {
			fileopen=false
			fs.writeFile(path.join(__dirname, ...args), JSON.stringify(data,null,"\t"), err => {
				if(err) command.message('Error Writing File, attempting to rewrite')
				fileopen = true
				if(!err && data.gameVersion) modes.update()
			})
		}
		else {
			clearTimeout(stopwrite)			 //if file still being written
			stopwrite=setTimeout(saveplayer(__dirname,...args),2000)
			return
		}
	}
	
	function readFiles(...args) {
		return JSON.parse(fs.readFileSync(path.join(__dirname,...args), 'utf8'));
	}	
	
	function equiparray(event) {
		equiplist=[]
		for(let prop of packetname) equiplist.push(event[prop])
		return equiplist
	}
	
	function applySave(saveObj,gameId) {
		delete saveObj.changers
		return Object.assign({},{gameId:gameId},saveObj)
	}
}
