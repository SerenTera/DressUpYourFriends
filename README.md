# DressUpYourFriends
Version 1.0: Add ignore target changers/self confidence function. Readme not completed, will complete soon.

A Tera Proxy Module to change the look of your friends, enemies or anyone in your visible vicnity. Appearance is Client Sided!!! Using the commands on anyone will cause their equipped costumes/equipment to change to look like yours. Currently copies every costume/equipment on you, but appearance (skintone,hair,face etc) is unaffected.

Might cause some lags in heavily populated areas? Does not seem so from tests. But you can just disable the module and this clears all entry and effectively prevents the logging of targets.

Yes i know the code is messy af with comments everywhere. Just don't look LUL, i'm new to JS. Feel free to share, this is harmless, but risk is on you since you are using a proxy anyway.

## General instructions
When logging in you should see a message 'current equipped saved'. When you change your appearance in any way (except using proxy modules), you should see this message again. This signifies the current equip you have is saved and to be copied onto your targets.

To reset a target's appearance to their original, just move out till you cannot see them and move back in to reload. I miggghhhhhht add a function in the future but i dont see why this is important because doing that will require the saving of all character's apearances, much easier to just move back and in right?

Set 'CUSTOM_MOD' in index.js to true if you use custom proxy modules that changes costumes, false if otherwise. This is true by default, setting to false will also stop the hooking of packets dispatched from proxy modules that changes costumes. (look for this line: const custom_mod=true;) 

Set 'MAINTAIN_COSTUME' in index.js to true if you want to maintain the changed equipment on your target even if he/she changes her/his appearances. This only works if he/she is in your sight and their appearance will revert when they go out of your sight.

There is an option to negate changers. Changers are selfconfidence potions, Shrink/Grow potions and big head potions. When negate changers is enabled, any target which has changers on will have their effect ended (client side) when attempting to dress them up. Currently I only added those that I logged from tera NA currently, so that there is no need to end 20 over abnormalities. If somehow the changers are not negated, then add more ids on your own in CHANGER_ABNORMALITY. I included a list of ids, and if you also want to negate height/chest/thigh changers, add in those ids on your own too (use 'present version' indicated ones).

Defaults: Module is enabled, Maintain appearances thorugh target changes enabled, greet to change disabled, Ignore changers disabled (allow target to use maintain their changer appearances)
## Commands: Spaces are important if you want to block em from being broadcasted.
Main action/module command:
- !dressup (name): Dress up the named person to look like you. Can be in any captialization, just spelling matters. Eg: '!dressup seren' can dress up any igns seren,Seren, SEREN, seReN,etc. Only works if you can see them and have not disabled the module.
- !du: Toggle enabling/disabling of module. Disable module will disable logging of targets around you, disables saving of your appearances and clears all saved targets. This effectively makes the module disabled. You have to unequip and re-equip something to save your appearances (look for the message that indicates this), as well as move out and back into the visible vicinity of your targets to save their ids after re-enabling the module.

Module function commands:
- !du greeting: Toggles greet to change. Change someone's look to yours by greeting their character instead using 'Personalized greeting' skill. Works even with module disabled but only the last saved equip will be copied. The target will look exactly like you with no customization to appearances supported. Use name changing (!dressup name) if customization is desired.
- !du changers: Toggles negate changers or not. Enable=negates changers, ending their effect on the target. Disable does otherwise.
- !du fix: Toggle to fix the saved equip to the current one on you and prevent saving any further equip appearances even if you change your equipments. Toggle again to stop the fixing.
- !du (number): Change modes to prevent some parts from being changed. see modes section.
- !du (part name):Prevent specific equip parts from being changed on the target. See modes section.

Commands to customise your equips to copy:
- !ducustom fix: If you have a custom module (eg: costume-ex) you can use this command to stop the such modules from changing your appearance, yet saving the infomation of the changes to the equips to be copied onto target. This only works for 1 change. This is probably only useful if using dressing room, you can use this command, enter dress room and exit without your appearance changing but the saved equipped will be changed, if you wish to look different from your target.
- !ducustom ['weapon','chest','inner','chestdye','enchantment','hat','mask','back','weaponskin','costume','costumedye']- This command allows you to enter the itemId to modify your saved equipped infomation. All array must be filled, use 'x' to blank it out if you do not want to change that part. Not working yet
-!ducustom (part name)(itemId) - Changes the part saved in your saved equipped costume/appearance to the itemId entered. Not working yet.

List of part names (type without the ''): 'weapon','chest','inner','chestdye','enchantment','hat','mask','back','weaponskin','costume','costumedye'

## Modes
This module saves the costume info of people around you so you can prevent certain parts on the target from being changed. The name of the parts are as follows:
Parts name: 
'weapon','chest','inner','chestdye','enchantment','hat','mask','back','weaponskin','costume','costumedye'

Mode number:
see modes.js for now. will add later

Example: type '!du hat mask back' if you want to stop hat, mask and back accessories of the target from being changed.
## Known bugs
The following bugs pertain to body costumes only. Other parts are largely unaffected and will copy over.
- If your costume only is available for cloth, then you can only target cloth classes. Attempting to do otherwise could cause a floating head effect or default armor look, although from my tests, this is only occuring to elins?  Armor type limited costume largely appears in fash coupon shops only, so other costume where any armor type can wear will work.
- When a user has modesty potion on, then your costume won't be able to show. Use !du changers to stop this.
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
-Fix bug

## Compatibility with other modules
Might have issues with other modules that are undetected, although I have coded hooks to run later than other modules to see changes made and log them. This does not interfere/modify the dispatched packets from other modules. The only packet that comes through and modified (silenced) is 'S_USER_EXTERNAL_CHANGE' in the case where it is from a target that is not the playing character.

Surgeon module might work to ensure race compatibility. Untested yet.

The compatibility with other modules is an experimental feature. Tests have shown that it works but there might be bugs.
## Credits 
- Bernkastel's Costume-ex for allowing me to understand the fact that I needed to use .equals instead of === (im noob)
https://github.com/Bernkastel-0/
- Teralove's emote-player module for the looping code to save players name/ign 
https://github.com/teralove/
