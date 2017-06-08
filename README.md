# DressUpYourFriends
Version 0.1: Currently under testing, use with caution. 

A Tera Proxy Module to change the look of your friends, enemies or anyone in your vicnity. Appearance is Client Sided. Using the commands on anyone will cause their equipped costumes/equipment to change to look like yours.

Currently you need to unequip and re-equip any part of your equipment to save your look when logging in the first time. Subsequent changes to equipment will change the saved look automatically. 

## Commands:
!dressup (name): Dress up the named person to look like you


## TODO
- Save player equipments for first time logins automatically (Hook sLogin)
- Save player equipments from other modules that changes looks too (filter.fake=true)
- Give a command to allow players to customize their saved look using item ids, so they can put different costumes on the changed target and do not necessary become a copy of the target costume.
- Give different options to users that allow them to only copy certain equipments. (ie: only change body costume, while leaving the rest as target's original costume)- requires indexing 
