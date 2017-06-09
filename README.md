# DressUpYourFriends
Version 0.1: Initial release with basic working features

A Tera Proxy Module to change the look of your friends, enemies or anyone in your visible vicnity. Appearance is Client Sided!!! Using the commands on anyone will cause their equipped costumes/equipment to change to look like yours. Currently copies every costume/equipment on you, but appearance (skintone,hair,face etc) is unaffected.

Might cause some lags in heavily populated areas? I dont know. But you can just disable the module and this clears all entry and effectively prevents the logging of targets.

Yes i know the code is messy af with comments everywhere. Just don't look LUL, i'm new to JS. Feel free to share, this is harmless, but risk is on you since you are using a proxy anyway.

## General instructions
When logging in you should see a message 'current equipped saved'. When you change your appearance in any way (except using proxy modules), you should see this message again. This signifies the current equip you have is saved and to be copied onto your targets.

To reset a target's appearance to their original, just move out till you cannot see them and move back in to reload. I miggghhhhhht add a function in the future but i dont see why this is important because doing that will require the saving of all character's apearances, much easier to just move back and in right?

Defaults: Module is enabled, Maintain appearances thorugh target changes enabled.
## Commands:
- !dressup (name): Dress up the named person to look like you. Can be in any captialization, just spelling matters. Eg: '!dressup seren' can dress up any igns seren,Seren, SEREN, seReN,etc. 
- !du maintain: Toggles whether to maintain the changed costume on others even if they change their look.-Untested fully yet
- !du: Toggle enabling/disabling of module. Disable module will disable logging of targets around you, disables saving of your appearances and clears all saved targets. This effectively makes the module disabled. You have to unequip and re-equip something to save your appearances (look for the message that indicates this), as well as move out and back into the visible vicinity of your targets to save their ids after re-enabling the module.
- !du(number): change modes. Not Implemented Yet.

## Known bugs
The following bugs pertain to body costumes only. Other parts are largely unaffected and will copy over.
- It might not work for targets of different armor type. If your costume only is avilable for cloth, then you can only target cloth classes. Attempting to do otherwise could cause a floating head effect, although from my tests, this is only occuring to elins?  Armor type limited costume largely appears in fash coupon shops only, so other costume where any armor type can wear will probably work.
- The exception to above is using Ninja costumes and equipments. They are super buggy and can cause various issues when used on non-ninja elins, such as floating head effects. However, i am too stingy to use a costume that all elins can wear to test with, it will probably work if you use a costume with no armor type limitation.
- Using this on another race will cause their costume to revert to default, even if that costume is available for that race too (eg: winter orchid is available to all classes and race, but using a castanic ver on an elin just reverts the elin costume to a defaulted one). There is no workaround for this because i have to log every single costume id of the different classes for each costume if i were to do this, but there is a way to enter your custom costume ids soon.
- It worked alright when i unequipped costume and left the equipments or inners(fml,see safety advice 1) equipped.  I tested a castanic and lul, have you seen a elin using arccannon before?
Other bugs:
- Simply move out and back from the sight of the target to reload their appearances.
- Probably will not save module-changed appearances by other modules yet. Will try to do that next, after working out the costume issues.

## Safety advice
- Forced erp is a henious crime in the land of baldera. I am not responsible should you be caught by the popo(ri) due to misuse.
- It is impossible for me to test every aspect so expect bugs here and there.


## TODO
- Allow changing of appearance via greeting the target. (So you dont have to type any names :) )
- Making costume work regardless of shape.
- Save player equipments from other modules that changes looks too (filter.fake=true)
- Give a command to allow players to customize their saved look using item ids, so they can put different costumes on the changed target and do not necessary become a copy of the target costume. Especially weapons, which should not be replaced. No more Elin carrying an arcannon. That looked so weird. 
- Give different options to users that allow them to only copy certain equipments. (ie: only change body costume, while leaving the rest as target's original costume)- requires indexing 

## Credits 
- Bernkastel's Costume-ex for allowing me to understand the fact that I needed to use .equals instead of === (im noob)
https://github.com/Bernkastel-0/
- Teralove's emote-player module for the looping code to save players name/ign 
https://github.com/teralove/
