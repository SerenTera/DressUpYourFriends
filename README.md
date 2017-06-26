# DressUpYourFriends
Version 1.2: Added Support for Commands Modules(by Pinkie Pie),Import/Export abilities and ability to save player's costume changes though logouts/when out of range. Removed Greet to change.

Requires Commands module by Pinkie-Pie:https://github.com/pinkipi/command

A Tera Proxy Module to change the look of your friends, enemies or anyone in your visible vicnity. Appearance is Client Sided. Using the commands on anyone will cause their equipped costumes/equipment to change to look like yours/the customised equip. Can be customized using itemids.

Disable the module and this clears all entries and effectively prevents the logging of targets if you face lag in high population area.

Short list of commands (Type with '!' prefix if not using /proxy chat, eg: !dutoggle instead of dressup in global chat):

dutoggle- Toggle enable/disable

dressup (name), dressupsave (name), dressupdelete (name)- Changes target costume

duchangers, dufix, duid (name), dumode (mode number), dumode (partname),... --- modes/toggling of module functions/check id

ducustom fix, ducustom (partname)(itemID),... and ducustom (array of 11 parts)--- customize equipped costume

duexport,duimport --- import/export costume

## General instructions
When logging in you should see a message 'current equipped saved'. When you change your appearance in any way, you should see this message again. This signifies the current equip you have is saved and to be copied onto your targets.

To reset a target's appearance to their original, just move out till you cannot see them and move back in to reload.

There is an option to negate changers. Changers are selfconfidence potions, Shrink/Grow potions and big head potions. When negate changers is enabled, any target which has changers on will have their effect ended (client side) when attempting to dress them up. Currently I only added those that I logged from tera NA currently, so that there is no need to end 20 over abnormalities. If somehow the changers are not negated, then add more ids on your own in CHANGER_ABNORMALITY. I included a list of ids, and if you also want to negate height/chest/thigh changers, add in those ids on your own too (use 'present version' indicated ones).

#### Setup in index.js:

1. Set 'CUSTOM_MOD' in index.js to true if you use custom proxy modules that changes costumes, false if otherwise. This is true by default, setting to false will also stop the hooking of packets dispatched from proxy modules that changes costumes. (look for this line: const custom_mod=true;) 

2. Set 'MAINTAIN_COSTUME' in index.js to true if you want to maintain the changed equipment on your target even if he/she changes her/his appearances. This only works if he/she is in your sight and their appearance will revert when they go out of your sight.

3. Set 'MESSAGE_OVERRIDE_CHANGES' to false to stop system messages from appearing when someone is changed via automatic costume change from dressupsave command.

#### Defaults: 
Module is enabled, Maintain appearances thorugh target changes enabled, greet to change disabled, Ignore changers enabled (allow target to use maintain their changer appearances), mode=0. Change defaults in index.js.

## Commands: NO SPACES IN ARGUMENTS, and only 1 space between command and argument. use commas to separate multiple arguments.
USE ! as prefix to any commands if u are not typing commands in /proxy chat. IMPORTANT!

### Main action/module command (PLayers must be visible in your vicinity):
- dressup (name): Dress up the named person appearance with your saved costume/appearance. Can be in any captialization, just spelling matters. Eg: 'dressup seren' can dress up any igns seren,Seren, SEREN, seReN,etc. Only works if you can see them and have not disabled the module.
- dressupsave (name): Dress up AND SAVE the named person appearance with your saved costume/appearance. Works though logouts/out of range, where the character changed appearance will stay till it is deleted with next command OR module is disabled. You can use this to decide what each individual on your server looks like on your end permenently till you disable/use next command. Eg: 'dressupsave seren' can dress up any igns seren,Seren, SEREN, seReN,etc and saves the changed appearance/costume. When 'Seren' is come across again after logouts/out of range, seren will be dressed up as what is saved.
- dressupdelete (name): Delete the named person saved by the previous command. Eg. 'dressupdelete Seren' deletes seren's saved data.
- dutoggle: Toggle enabling/disabling of module. Disable module will disable logging of targets around you, disables saving of your appearances and clears all saved targets. This effectively makes the module disabled. You have to unequip and re-equip something to save your appearances (look for the message that indicates this), as well as move out and back into the visible vicinity of your targets to save their ids after re-enabling the module.

One word about saved characters using dressupsave is that if you play across multiple servers, then the appearances of all the same saved characters will changed to be the same. So be wise which one you chose to export with.
### Module functionality commands (add space after !du):
- duchangers: Toggles negate changers or not. Enable=negates changers, ending their effect on the target. Disable does otherwise.
- dufix: Toggle to fix the saved equip to the current one on you and prevent saving any further equip appearances even if you change your equipments. Toggle again to stop the fixing.
- duid (name):Checks the item ID of the costume parts that the named target have and also prints them out in console(command prompt). Must be in your vicinity. Eg: 'duid Seren' checks seren's costume item IDs. This is a useful command because you can copy what is on your command prompt and paste what is INSIDE the curly bracket ({}) together with 'ducustom' command. That is, 'ducustom {itemID infomation}' to obtain a saved equipped of the target(in this eg, seren) and with dressup commands you can paste the target (in this eg, seren) equip on another player. Procedure: 'duid (name of target you want to copy costume)=>copy from command prompt(that is rightclick, then mark and copy)=>'ducustom <paste message>'=>dressupsave (name of target to copy TO) or just dressup if you dont want to save.
- dumode (mode number): Change modes to prevent some parts from being changed. See modes section.
- dumode (part name):Prevent specific equip parts from being changed on the target. See modes section.

### Commands to customise your equips to copy:
- ducustom fix: If you have a custom module (eg: costume-ex) you can use this command to temporarily stop the such modules from changing your appearance, yet saving the infomation of the changes to the equips to be copied onto target. This only works for 1 change. This is probably only useful if using dressing room, you can use this command, enter dress room and exit without your appearance changing but the saved equipped will be changed, if you wish to look different from your target. However, subsquent changes will cause the look saved by costume-ex to take over your appearances. Not a very useful command tbh.
- ducustom ('weapon','chest','inner','chestdye','enchantment','hat','mask','back','weaponskin','costume','costumedye')- This command allows you to enter the itemId to modify your saved equipped infomation. All array must be filled, use 'x' to blank it out if you do not want to change that part. See customization section.
- ducustom (part name)(itemId),(part name)(itemId),.... - Changes the part saved in your saved equipped costume/appearance to the itemId entered. Enter multiple partname and ids separated by a comma (,) for multiple changes. NO spaces in between (partname)(itemid),.... See customization section.

### Commands for import/export
- duexport: Create an export file (called 'importdata.json') saving your character costume infomation. You can send this file on to other players with this module to change what YOUR character looks like on their end, if their module is enabled and they have used the 'duimport' command. (SEE below). Can contain multiple characters, so u can export all your alts, however you must enter this command on each one that you want to save. Overrides the saved character info if importdata.json already contains it with the new infomation. No cids are recorded, only name+itemIDs. No restarts or shutdown of proxy required to copy and send the file.

- duimport: Imports the file (importdata.json) in your module folder. importdata.json obtained from other player must be put into the module folder where the index.js of this mod is located (ie: bin/node_modules/DressUpYourFriends, with -master if you are a lazy person lul). If you want to use another person importdata.json but have one of your own importdata.json currently in your module folder, backup your one and delete then copy the one sent by the other party in the module folder. This copies all characters stored in importdata.js, to copy only one or a select few, use 'duimport (name)'. No restarts or shutdown of proxy required to use this command after  importdata.json has been copied into the folder, just copy and use the command.

- duimport (name): Same as previous command, only that instead of importing all the characters inside importdata.json, you only import the named character. eg: 'duimport seren' only imports seren character from importdata.json, even if other characters exists.

One word about exports/imports is that if you play across multiple servers, then the appearances of all the same named characters will changed to be the same. So be wise which one you chose to export with.

## Modes (command: dumode)
This module saves the costume info of people around you so you can prevent certain parts on the target from being changed. You can customize the parts on the target you want to prevent from being changed using 2 methods:

### Mode number:
For modes, there are 6 different modes number that changes what will be replaced on the target. They are as follows:
- 0: default, replaces everything
- 1: keeps targets weapon and weapon skins
-	2: keeps targets costume
-	3: keeps target weapon,weapon skin and costume
- 4: keep target costume, including mask, back, hairadornment (in other words, costume, hats, capes and masks).
-	5: keeps target chest (non costume chest piece)
-	6: keep target weapon, NOT including weapon skin

You can add more modes on your own in modes.js under modefunc. Follow instruction in modes.js to figure out how.

Example: Type 'dumode 3' if you want to prevent target weapon, weapon skin and costume from being changed.

### Parts name: 
This is a simpler way to customize the parts you want without using modes. Use the parts names together with the command 'dumode ' (notice the space! It's important) to customize which part on the target you want to prevent from being changed. Separate out the parts using commas(,) so that the command will be accepted

Part names are as follows, costume/weaponskin are the emp/whatever costume items:

weapon,chest,inner,chestdye,enchantment,hat,mask,back,weaponskin,costume,costumedye

Hopefully the part names are self explanatory.

Example: type 'dumode hat,mask,back' if you want to stop hat, mask and back accessories of the target from being changed.

## Customization
Additionally, you can set the costume you want to be pasted over onto the using commands and itemIds, in addition to using other modules that changes appearances (such as costume-ex), this allows you to achieve a different look from your target. However, any appearance changes made after customization will change back to the costume/equips on you, unless !du fix was used prior to customization. There are 2 commands available:

### Complex customization
This uses the following commands:

ducustom ('weapon','chest','inner','chestdye','enchantment','hat','mask','back','weaponskin','costume','costumedye')

Where you have to replace each of the part with their desired itemID or 'x' if you want to leave it as the one you have equipped. 

Example: 'ducustom (x,x,x,x,12,150208,x,x,185498,255196,x)' will change your saved hat/weaponskin/costume equipped to Bizzare tiered hat, castanic wedding dress, and a plasma cannon weaponskin with +12 enchantment effect.

### Simple customization
This uses this command, where each part and itemid are separated by a comma (,). No spaces between partname and itemId. 

ducustom (part name)(itemId),(part name)(itemId),.... 

Part names are: weapon,chest,inner,chestdye,enchantment,hat,mask,back,weaponskin,costume,costumedye

Example: 'ducustom hat150208,weaponskin185498,costume255196' to change your saved hat/weaponskin/costume equipped to Bizzare tiered hat, castanic wedding dress, and a plasma cannon weaponskin.

You can also just use '!ducustom costume255196' if you just want to change a single part. In this example it changes the saved costume to castanic wedding dress.

Simple customization is stackable, where each change will modify the costume part and previous changes will still be counted in. The latest itemId for that part is copied.

Reminder that you can also copy and paste what is obtained within the curly brackets ({ and }) in the console when using 'duid (name)', and then using 'ducustom {infomation}' to customize the saved equips to that of the one obtained by duid.

## Known bugs
The following bugs pertain to body costumes only. Other parts are largely unaffected and will copy over.
- You can only apply a costume sucessfully only if the target model(race and class) is able to support the costume. In other words, no applying of elin costume on barakas or no applying of leather costume on metal classes.
- When a user has modesty potion on, then your costume won't be able to show. Use 'duchangers' to stop this.
- Using this on another race will cause their costume to revert to default, even if that costume is available for that race too (eg: winter orchid is available to all classes and race, but using a castanic ver on an elin just reverts the elin costume to a defaulted one). There is no workaround for this because the ids are different for different races i have to log every single costume id of the different classes for each costume if i were to do this, but there is a way to enter your custom costume ids soon.
- It worked alright when i unequipped costume and left the equipments or inners(fml,see safety advice 1) equipped.  I tested a castanic and lul, have you seen a elin using arccannon before?

Other bugs:
- Ninja/Reaper weapon is tested to be kinda buggy. 
- Simply move out and back from the sight of the target to reload their appearances.
- Probably will not save module-changed appearances by other modules yet. Will try to do that next, after working out the costume issues.

## Safety advice
- Forced erp is a henious crime in the land of baldera. I am not responsible should you be caught by the popo(ri) due to misuse.
- It is impossible for me to test every aspect so expect bugs here and there.

## TODO
- Fix bug

## Compatibility with other modules
Might have issues with other modules that are undetected, although I have coded hooks to run later than other modules to see changes made and log them. This does not interfere/modify the dispatched packets from other modules. The only packet that comes through and modified (silenced) is 'S_USER_EXTERNAL_CHANGE' in the case where it is from a target that is not the playing character.

Surgeon module might work to ensure race compatibility. Untested yet.

The compatibility with other modules is an experimental feature. Tests have shown that it works but there might be bugs.
## Credits 
- Bernkastel's Costume-ex for module feature testing and better customization.
https://github.com/Bernkastel-0/
- Teralove's emote-player module for the looping code to save players name/ign 
https://github.com/teralove/
